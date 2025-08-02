import { App } from "obsidian";
import { BasePetType } from "../pet";
import { States } from "../states";
import { PetColor, PetSize, PetType } from "../types";

/**
 * Deno pet implementation - the JavaScript runtime mascot
 */
export class Deno extends BasePetType {
	readonly label = 'deno';
	readonly emoji = '🦕';

	static readonly possibleColors = [PetColor.green];

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
		return `I'm a secure runtime for JavaScript and TypeScript! 🦕`;
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
		super(app, PetType.deno, petColor, petSize, name, floorString, left, speed);
		this.initState();
	}
}

export const DENO_NAMES: ReadonlyArray<string> = [
	'Deno', 'Sauropod', 'Rex', 'Tyson', 'Rexy', 'Barney', 'Dino',
	'Denver', 'Spike', 'Littlefoot', 'Cera', 'Petrie', 'Ducky', 'Chomper',
	'Yoshi', 'Reptar', 'Earl', 'Dinosaur', 'Arlo', 'Buddy', 'Tiny',
	'Shiny', 'Don', 'Runtime', 'Secure',
];
