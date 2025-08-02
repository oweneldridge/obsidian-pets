import { App } from "obsidian";
import { BasePetType } from "../pet";
import { States } from "../states";
import { PetColor, PetSize, PetType } from "../types";

/**
 * Snake pet implementation with slithering movement
 */
export class Snake extends BasePetType {
	readonly label = 'snake';
	readonly emoji = '🐍';

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
		return `Sssssss... I'm just here to ssslither around. Don't mind me! 🐍`;
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
		super(app, PetType.snake, petColor, petSize, name, floorString, left, speed);
		this.initState();
	}
}

export const SNAKE_NAMES: ReadonlyArray<string> = [
	'Slinky', 'Slither', 'Monty', 'Python', 'Kaa', 'Nagini', 'Basilisk',
	'Cobra', 'Viper', 'Fang', 'Hiss', 'Scales', 'Severus', 'Sidewinder',
	'Rattle', 'Medusa', 'Asp', 'Noodle', 'Spaghetti', 'Pretzel', 'Twisty',
	'Zigzag', 'Slytherin', 'Danger Noodle', 'Julius Squeezer',
];
