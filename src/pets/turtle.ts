import { App } from "obsidian";
import { BasePetType } from "../pet";
import { States } from "../states";
import { PetColor, PetSize, PetType } from "../types";

/**
 * Turtle pet implementation with slow movement and lie state
 */
export class Turtle extends BasePetType {
	readonly label = 'turtle';
	readonly emoji = '🐢';

	static readonly possibleColors = [PetColor.green, PetColor.orange];

	sequence = {
		startingState: States.sitIdle,
		sequenceStates: [
			{
				state: States.sitIdle,
				possibleNextStates: [
					States.walkRight,
					States.runRight,
					States.lie,
				],
			},
			{
				state: States.lie,
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
				possibleNextStates: [
					States.sitIdle,
					States.lie,
					States.walkRight,
					States.runRight,
				],
			},
			{
				state: States.runLeft,
				possibleNextStates: [
					States.sitIdle,
					States.lie,
					States.walkRight,
					States.runRight,
				],
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
					States.lie,
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
		return 2.5;
	}

	get hello(): string {
		return `Slow and steady wins the race! 🐢`;
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
		super(app, PetType.turtle, petColor, petSize, name, floorString, left, speed);
		this.initState();
	}
}

export const TURTLE_NAMES: ReadonlyArray<string> = [
	'Shelley', 'Franklin', 'Crush', 'Squirt', 'Shelly', 'Speedy', 'Slowpoke',
	'Donatello', 'Leonardo', 'Raphael', 'Michelangelo', 'Splinter', 'Yertle',
	'Toby', 'Tuck', 'Tank', 'Bowser', 'Koopa', 'Tortoise', 'Terrapin',
	'Myrtle', 'Snappy', 'Shelled', 'Turbo', 'Flash',
];
