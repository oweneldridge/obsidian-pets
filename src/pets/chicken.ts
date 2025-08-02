import { App } from "obsidian";
import { BasePetType } from "../pet";
import { States } from "../states";
import { PetColor, PetSize, PetType } from "../types";

/**
 * Chicken pet implementation with swipe ability
 */
export class Chicken extends BasePetType {
	readonly label = 'chicken';
	readonly emoji = '🐔';

	static readonly possibleColors = [PetColor.white];

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
		return `Puk Puk Pukaaak - just let me lay my egg. 🥚`;
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
		super(app, PetType.chicken, petColor, petSize, name, floorString, left, speed);
		this.initState();
	}
}

export const CHICKEN_NAMES: ReadonlyArray<string> = [
	'Hen Solo', 'Cluck Vader', 'Obi Wan Henobi', 'Albert Eggstein',
	'Abrahen Lincoln', 'Cluck Norris', 'Sir Clucks-A-Lot', 'Frank-hen-stein',
	'Richard', 'Dixi', 'Nugget', 'Bella', 'Cotton', 'Pip', 'Lucky', 'Polly',
	'Mirabel', 'Elsa', 'Bon-Bon', 'Ruby', 'Rosie', 'Teriyaki', 'Penguin', 'Sybil',
];
