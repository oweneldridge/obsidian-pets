import { App } from "obsidian";
import { BasePetType } from "../pet";
import { States } from "../states";
import { PetColor, PetSize, PetType } from "../types";

/**
 * Rat pet implementation with multiple colors
 */
export class Rat extends BasePetType {
	readonly label = 'rat';
	readonly emoji = '🐀';

	static readonly possibleColors = [
		PetColor.brown,
		PetColor.gray,
		PetColor.white,
	];

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
		return 3.2;
	}

	get hello(): string {
		return `Squeak squeak! I'm a clever little rat! 🐀`;
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
		super(app, PetType.rat, petColor, petSize, name, floorString, left, speed);
		this.initState();
	}
}

export const RAT_NAMES: ReadonlyArray<string> = [
	'Remy', 'Stuart', 'Templeton', 'Ratigan', 'Rizzo', 'Splinter', 'Ratatouille',
	'Nibbles', 'Whiskers', 'Squeaky', 'Cheese', 'Cheddar', 'Brie', 'Gouda',
	'Squeaker', 'Ratty', 'Ratter', 'Scurry', 'Sniff', 'Algernon',
	'Ben', 'Socrates', 'Nicodemus', 'Justin', 'Brutus',
];
