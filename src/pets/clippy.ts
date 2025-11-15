import { App } from "obsidian";
import { BasePetType } from "../pet";
import { States } from "../states";
import { PetColor, PetSize, PetType } from "../types";

/**
 * Clippy pet implementation - the helpful paperclip
 */
export class Clippy extends BasePetType {
	readonly label = 'clippy';
	readonly emoji = '📎';

	static readonly possibleColors = [
		PetColor.black,
		PetColor.brown,
		PetColor.green,
		PetColor.yellow,
	];

	sequence = {
		startingState: States.sitIdle,
		sequenceStates: [
			{
				state: States.sitIdle,
				possibleNextStates: [States.walkRight, States.runRight],
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
				state: States.idleWithBall,
				possibleNextStates: [
					States.walkRight,
					States.walkLeft,
					States.runLeft,
					States.runRight,
				],
			},
		],
	};

	get canSwipe(): boolean {
		return false;
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
		return `Hi, I'm Clippy, would you like some assistance today? 👋!`;
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
		super(app, PetType.clippy, petColor, petSize, name, floorString, left, speed);
		this.initState();
	}
}

export const CLIPPY_NAMES: ReadonlyArray<string> = [
	'Clippy', 'Karl Klammer', 'Clippy Jr.', 'Molly', 'Coco', 'Buddy',
	'Ruby', 'Oscar', 'Lucy', 'Bailey',
];
