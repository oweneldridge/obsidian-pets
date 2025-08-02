import { App } from "obsidian";
import {
	IPetType,
	IState,
	States,
	BallState,
	HorizontalDirection,
	FrameResult,
	resolveState,
	PetState,
	isStateAboveGround
} from "./states";
import { ISequenceTree } from "./sequences";
import { Ball } from "./ball";
import { PetSize, PetColor, PetType } from "./types";
import { PLUGIN_ID } from "./constants";

/**
 * State persistence structure for saving/loading pet state
 */
export interface PetInstanceState {
	currentStateEnum: States;
	petName: string;
	petType: PetType;
	petColor: PetColor;
	petFriend: string | undefined;
	petLeft: number;
	petBottom: number;
}

/**
 * Abstract base class for all pet types, implementing the IPetType interface.
 * Each specific pet type (Dog, Cat, etc.) should extend this class and provide
 * its own sequence tree, label, and sprite mappings.
 */
export abstract class BasePetType implements IPetType {
	// Static count tracking - incremented for each pet of this type created
	static count: number = 0;

	// Type helper for static count access in constructor
	['constructor']: typeof BasePetType;

	// Abstract properties that each pet type must define
	abstract sequence: ISequenceTree;
	abstract readonly label: string;
	abstract readonly emoji: string;

	// Core pet properties
	id: number;
	el: HTMLImageElement;
	collision: HTMLDivElement;
	speech: HTMLDivElement;
	app: App;
	petType: PetType;
	petColor: PetColor;
	petSize: PetSize;
	name: string;
	containerWidth: number = 400; // Default container width, will be updated

	// State machine
	currentState: IState;
	currentStateEnum: States;

	// Friend system
	private _friend: IPetType | undefined;

	// Position and movement
	private _left: number = 0;
	private _bottom: number = 0;
	private _floor: number = 0;
	private _floorString: string = '0%'; // CSS floor position (e.g., "10%")
	private _speed: number;
	private sizeInPixels: number;

	constructor(
		app: App,
		petType: PetType,
		petColor: PetColor,
		petSize: PetSize,
		name: string,
		floorString: string = '0%',
		left: number = 100,
		speed: number = 3 // Default to normal speed (PetSpeed.normal)
	) {
		this.id = Date.now() + Math.random();
		this.app = app;
		this.petType = petType;
		this.petColor = petColor;
		this.petSize = petSize;
		this.name = name;
		this._floorString = floorString;
		this._left = left;
		this._bottom = 0; // Will be calculated from container height
		this._floor = 0; // Will be calculated from container height

		// Set base speed from pet type, modified by size
		let sizeMultiplier: number;
		switch (this.petSize) {
			case PetSize.nano: sizeMultiplier = 0.8; break;
			case PetSize.small: sizeMultiplier = 1.0; break;
			case PetSize.medium: sizeMultiplier = 1.2; break;
			case PetSize.large: sizeMultiplier = 1.5; break;
			default: sizeMultiplier = 1.0; break;
		}
		this._speed = this.randomizeSpeed(speed * sizeMultiplier);

		// Debug easter egg: log creation details when pet is named "debug"
		if (this.name.toLowerCase() === 'debug') {
			console.log(
				`Creating pet ${this.name} of type ${this.petType} with size ${this.petSize} at position (${this._left}, ${this._bottom}) with speed ${this._speed}`
			);
		}

		// Create sprite element
		this.el = document.createElement('img');
		this.el.addClass('obsidian-pet');

		// Create collision div (for friend collision detection)
		this.collision = document.createElement('div');
		this.collision.addClass('pet-collision');

		// Create speech bubble div
		this.speech = document.createElement('div');
		this.speech.addClass('pet-speech-bubble');

		// Initialize state machine - will be set in initState() after subclass construction
		this.currentStateEnum = States.sitIdle;
		this.currentState = resolveState(States.sitIdle, this);

		// Increment the static count of the Pet class that the constructor belongs to
		this.constructor.count += 1;
	}

	/**
	 * Initialize the state machine with the pet's sequence tree.
	 * Must be called by subclass constructor after super().
	 */
	protected initState(): void {
		this.currentStateEnum = this.sequence.startingState;
		this.currentState = resolveState(this.currentStateEnum, this);
	}

	// IPetType interface implementation

	/**
	 * Main state machine update - called each animation frame
	 */
	nextFrame(): void {
		// Update sprite facing direction
		if (this.currentState.horizontalDirection === HorizontalDirection.left) {
			this.faceLeft();
		} else if (this.currentState.horizontalDirection === HorizontalDirection.right) {
			this.faceRight();
		}

		// Set animation sprite for current state
		this.setAnimation(this.currentState.spriteLabel);

		// Advance state machine
		const frameResult = this.currentState.nextFrame();
		if (frameResult === FrameResult.stateComplete) {
			// State completed, choose next state from sequence tree
			const nextState = this.chooseNextState(this.currentStateEnum);
			this.currentState = resolveState(nextState, this);
			this.currentStateEnum = nextState;
		}
	}

	/**
	 * Legacy update method for backward compatibility with old animation loop.
	 * New code should call nextFrame() instead.
	 * @deprecated Use nextFrame() instead
	 */
	update(viewWidth: number, viewHeight: number, floorY: number, ball: Ball | null): string | void {
		// Handle ball chasing logic BEFORE updating state machine
		if (ball && this.canChase) {
			// If ball is already caught by another pet, stop chasing
			if (ball.paused) {
				if (this.currentStateEnum === States.chase || this.currentStateEnum === States.idleWithBall) {
					this.currentStateEnum = States.sitIdle;
					this.currentState = resolveState(States.sitIdle, this);
				}
				return;
			}

			const ballIsOnFloor = ball.position.y >= floorY - 30;
			const distanceToBall = Math.abs((this.left + this.width / 2) - ball.position.x);

			// If ball is on floor and close enough, catch it
			if (ballIsOnFloor && distanceToBall < 40) {
				// Mark ball as caught so other pets stop chasing
				ball.paused = true;
				// Switch to idle with ball state
				if (this.currentStateEnum !== States.idleWithBall) {
					this.currentStateEnum = States.idleWithBall;
					this.currentState = resolveState(States.idleWithBall, this);
				}
				return 'caught_ball';
			}

			// If ball is on floor but not caught, chase it
			if (ballIsOnFloor && this.currentStateEnum !== States.chase && this.currentStateEnum !== States.idleWithBall) {
				this.currentStateEnum = States.chase;
				this.currentState = resolveState(States.chase, this);
			}

			// If in chase state, move toward ball
			if (this.currentStateEnum === States.chase) {
				const speed = this._speed; // Chase at normal walking speed (matching vscode-pets)
				if (ball.position.x < this.left + this.width / 2) {
					// Ball is to the left
					this.positionLeft(Math.max(0, this.left - speed));
					this.faceLeft();
				} else {
					// Ball is to the right
					this.positionLeft(Math.min(viewWidth - this.width, this.left + speed));
					this.faceRight();
				}
			}
		} else if (this.currentStateEnum === States.chase || this.currentStateEnum === States.idleWithBall) {
			// No ball present but in chase/ball state, return to idle
			this.currentStateEnum = States.sitIdle;
			this.currentState = resolveState(States.sitIdle, this);
		}

		// Call the state machine for normal behavior (when not chasing)
		if (this.currentStateEnum !== States.chase) {
			this.nextFrame();
		} else {
			// In chase state, just update animation
			this.setAnimation('run');
		}
	}

	/**
	 * Choose the next state from the pet's sequence tree
	 */
	private chooseNextState(fromState: States): States {
		let possibleNextStates: States[] | undefined;

		// Find possible next states in sequence tree
		for (let i = 0; i < this.sequence.sequenceStates.length; i++) {
			if (this.sequence.sequenceStates[i].state === fromState) {
				possibleNextStates = this.sequence.sequenceStates[i].possibleNextStates;
				break;
			}
		}

		if (!possibleNextStates || possibleNextStates.length === 0) {
			// Fallback to starting state if no transitions defined
			return this.sequence.startingState;
		}

		// Randomly select one of the possible next states
		const idx = Math.floor(Math.random() * possibleNextStates.length);
		return possibleNextStates[idx];
	}

	/**
	 * Set the animation sprite for the current state
	 */
	private setAnimation(spriteLabel: string): void {
		// Replace spaces with underscores in color name for file paths
		const colorPath = this.petColor.replace(/ /g, '_');
		const assetPath = this.getAssetPath(`${this.petType}/${colorPath}_${spriteLabel}_8fps.gif`);
		const currentSrcBase = this.el.src.split('?')[0];
		const newSrcBase = assetPath.split('?')[0];

		if (currentSrcBase !== newSrcBase) {
			this.el.src = assetPath;
		}
	}

	/**
	 * Face the pet left (flip sprite horizontally)
	 */
	private faceLeft(): void {
		this.el.style.transform = 'scaleX(-1)';
	}

	/**
	 * Face the pet right (normal sprite orientation)
	 */
	private faceRight(): void {
		this.el.style.transform = 'scaleX(1)';
	}

	/**
	 * Get the full path to a media asset
	 */
	private getAssetPath(asset: string): string {
		const plugin = (this.app as any).plugins.getPlugin(PLUGIN_ID);
		if (!plugin) return '';
		return this.app.vault.adapter.getResourcePath(
			`${plugin.app.vault.configDir}/plugins/${PLUGIN_ID}/media/${asset}`
		);
	}

	// Swipe ability
	abstract get canSwipe(): boolean;

	// State holding for temporary states like swipe
	private holdState?: IState;
	private holdStateEnum?: States;

	swipe(): void {
		// Don't swipe if already swiping
		if (this.currentStateEnum === States.swipe) {
			return;
		}
		// Save current state to return to after swipe
		this.holdState = this.currentState;
		this.holdStateEnum = this.currentStateEnum;
		// Switch to swipe state
		this.currentStateEnum = States.swipe;
		this.currentState = resolveState(States.swipe, this);
		// Show wave emoji
		this.showSpeechBubble('👋');
	}

	// Chase ability
	abstract get canChase(): boolean;

	chase(ballState: BallState, canvas: HTMLCanvasElement): void {
		if (this.canChase && ballState.paused) {
			this.currentState = resolveState(States.chase, this);
			this.currentStateEnum = States.chase;
		}
	}

	// Speed properties
	get speed(): number {
		return this._speed;
	}

	/**
	 * Randomize speed with ±30% variation
	 */
	randomizeSpeed(speed: number): number {
		const min = speed * 0.7;
		const max = speed * 1.3;
		const newSpeed = Math.random() * (max - min) + min;
		return newSpeed;
	}

	abstract get climbSpeed(): number;
	abstract get climbHeight(): number;
	abstract get fallSpeed(): number;

	get isMoving(): boolean {
		return (
			this.currentStateEnum === States.walkLeft ||
			this.currentStateEnum === States.walkRight ||
			this.currentStateEnum === States.runLeft ||
			this.currentStateEnum === States.runRight ||
			this.currentStateEnum === States.chase ||
			this.currentStateEnum === States.chaseFriend
		);
	}

	abstract get hello(): string;

	// Position properties
	get bottom(): number {
		return this._bottom;
	}

	get left(): number {
		return this._left;
	}

	positionBottom(bottom: number): void {
		this._bottom = bottom;
		this.el.style.bottom = `${bottom}px`;
		this.collision.style.bottom = `${bottom}px`;
		this.speech.style.bottom = `${bottom + this.sizeInPixels}px`;
	}

	positionLeft(left: number): void {
		this._left = left;
		this.el.style.left = `${left}px`;
		this.collision.style.left = `${left}px`;
		this.speech.style.left = `${left}px`;
	}

	get width(): number {
		return this.sizeInPixels;
	}

	get floor(): number {
		return this._floor;
	}

	// Friend system
	get hasFriend(): boolean {
		return this._friend !== undefined;
	}

	get friend(): IPetType | undefined {
		return this._friend;
	}

	makeFriendsWith(friend: IPetType): boolean {
		this._friend = friend;
		return true;
	}

	get isPlaying(): boolean {
		return (
			this.currentStateEnum === States.chaseFriend ||
			this.hasFriend
		);
	}

	// Speech bubble
	showSpeechBubble(message: string, duration: number = 3000): void {
		this.speech.textContent = message;
		this.speech.removeClass('pet-speech-hidden');
		setTimeout(() => {
			this.hideSpeechBubble();
		}, duration);
	}

	private hideSpeechBubble(): void {
		this.speech.addClass('pet-speech-hidden');
	}

	// State persistence
	getState(): PetInstanceState {
		return {
			currentStateEnum: this.currentStateEnum,
			petName: this.name,
			petType: this.petType,
			petColor: this.petColor,
			petFriend: this._friend?.name,
			petLeft: this._left,
			petBottom: this._bottom,
		};
	}

	recoverState(state: PetInstanceState): void {
		this.currentStateEnum = state.currentStateEnum;
		this.currentState = resolveState(this.currentStateEnum, this);
		this.name = state.petName;
		this.petType = state.petType;
		this.petColor = state.petColor;
		this.positionLeft(state.petLeft);
		this.positionBottom(state.petBottom);
	}

	recoverFriend(friend: IPetType): void {
		this._friend = friend;
	}

	// DOM manipulation
	remove(): void {
		this.el.remove();
		this.collision.remove();
		this.speech.remove();
	}

	/**
	 * Spawn the pet in the DOM container
	 */
	spawn(container: HTMLElement): void {
		const size = {
			[PetSize.nano]: 30,
			[PetSize.small]: 40,
			[PetSize.medium]: 50,
			[PetSize.large]: 65,
		}[this.petSize];

		this.sizeInPixels = size;

		// Calculate floor position from floor percentage
		// Floor percentage represents distance from bottom of container
		const floorPercent = parseFloat(this._floorString);
		const containerHeight = container.offsetHeight;
		this._floor = containerHeight * (floorPercent / 100);
		this._bottom = this._floor;

		// Setup sprite element
		this.el.addClass('pet-element');
		this.el.style.width = `${size}px`;
		this.el.style.height = `${size}px`;
		this.el.setAttribute('title', this.name);

		// Setup collision element (same size as sprite)
		this.collision.style.width = `${size}px`;
		this.collision.style.height = `${size}px`;

		// Add mouseover event for swipe interaction
		this.collision.addEventListener('mouseover', () => {
			if (this.canSwipe) {
				this.swipe();
			}
		});

		// Position pet
		this.positionLeft(this._left);
		this.positionBottom(this._bottom);

		// Add to DOM
		container.appendChild(this.el);
		container.appendChild(this.collision);
		container.appendChild(this.speech);
	}

	/**
	 * Update the floor position for the pet
	 * @param newFloorString - New floor position as CSS value (e.g., "10%")
	 */
	setFloor(newFloorString: string): void {
		this._floorString = newFloorString;
		// Floor will be recalculated on next spawn or position update
		this.el.style.bottom = newFloorString;
	}
}

/**
 * Concrete Pet class for backward compatibility with existing code.
 * Provides default implementations of abstract properties.
 * For new code, create specific pet classes extending BasePetType.
 */
export class Pet extends BasePetType {
	// Default sequence tree - basic walk/sit pattern
	sequence: ISequenceTree = {
		startingState: States.sitIdle,
		sequenceStates: [
			{
				state: States.sitIdle,
				possibleNextStates: [States.walkRight, States.walkLeft]
			},
			{
				state: States.walkRight,
				possibleNextStates: [States.walkLeft, States.sitIdle]
			},
			{
				state: States.walkLeft,
				possibleNextStates: [States.walkRight, States.sitIdle]
			}
		]
	};

	readonly label: string = 'pet';
	readonly emoji: string = '🐾';

	get canSwipe(): boolean {
		return !isStateAboveGround(this.currentStateEnum);
	}

	get canChase(): boolean {
		return true;
	}

	get climbSpeed(): number {
		return 0;
	}

	get climbHeight(): number {
		return 0;
	}

	get fallSpeed(): number {
		return 3.2;
	}

	get hello(): string {
		return `Hello, I'm ${this.name}!`;
	}

	constructor(
		app: App,
		petType: PetType | string,
		petColor: PetColor | string,
		petSize: PetSize,
		name: string,
		floorString: string = '0%',
		left: number = 100
	) {
		// Convert string types to enums for backward compatibility
		const typeEnum = typeof petType === 'string' ? petType as PetType : petType;
		const colorEnum = typeof petColor === 'string' ? petColor as PetColor : petColor;

		super(app, typeEnum, colorEnum, petSize, name, floorString, left);
		this.initState();
	}
}
