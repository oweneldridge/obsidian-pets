import { App } from "obsidian";
import { BasePetType } from "../pet";
import { States } from "../states";
import { PetColor, PetSize, PetType } from "../types";

/**
 * Snail pet implementation with slow movement
 */
export class Snail extends BasePetType {
	readonly label = 'snail';
	readonly emoji = '🐌';

	static readonly possibleColors = [PetColor.brown];

	sequence = {
		startingState: States.sitIdle,
		sequenceStates: [
			{
				state: States.sitIdle,
				possibleNextStates: [
					States.walkRight,
					States.runRight,
					States.swipe,
				],
			},
			{
				state: States.walkRight,
				possibleNextStates: [States.walkLeft, States.runLeft],
			},
			{
				state: States.runRight,
				possibleNextStates: [States.walkLeft, States.runLeft],
			},
			{
				state: States.walkLeft,
				possibleNextStates: [States.sitIdle],
			},
			{
				state: States.runLeft,
				possibleNextStates: [States.sitIdle],
			},
			{
				state: States.chase,
				possibleNextStates: [States.idleWithBall],
			},
			{
				state: States.swipe,
				possibleNextStates: [States.sitIdle],
			},
			{
				state: States.idleWithBall,
				possibleNextStates: [
					States.walkRight,
					States.walkLeft,
					States.runLeft,
					States.runRight,
					States.swipe,
				],
			},
		],
	};

	get canSwipe(): boolean {
		return true;
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
		return 2.0;
	}

	get hello(): string {
		return `I may be slow, but I always get there eventually! 🐌`;
	}

	constructor(
		app: App,
		petColor: PetColor,
		petSize: PetSize,
		name: string,
		floorString: string = '0%',
		left: number = 100,
		speed: number = 3
	) {
		super(app, PetType.snail, petColor, petSize, name, floorString, left, speed);
		this.initState();
	}
}

export const SNAIL_NAMES: ReadonlyArray<string> = [
	'Slowpoke', 'Gary', 'Turbo', 'Flash', 'Speedy', 'Lightning', 'Shelly',
	'Sheldon', 'Spiral', 'Dizzy', 'Whirl', 'Zoom', 'Dash', 'Rocket',
	'Snellie', 'Jeremy', 'Swirl', 'Helix', 'Twist', 'Curly', 'Escargot',
	'Pierre', 'Marcel', 'Goo', 'Slime',
];
