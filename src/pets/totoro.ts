import { App } from "obsidian";
import { BasePetType } from "../pet";
import { States } from "../states";
import { PetColor, PetSize, PetType } from "../types";

/**
 * Totoro pet implementation with wall climbing abilities
 */
export class Totoro extends BasePetType {
	readonly label = 'totoro';
	readonly emoji = '🐾';

	static readonly possibleColors = [PetColor.gray];

	sequence = {
		startingState: States.sitIdle,
		sequenceStates: [
			{
				state: States.sitIdle,
				possibleNextStates: [States.walkRight, States.lie],
			},
			{
				state: States.lie,
				possibleNextStates: [States.walkRight, States.walkLeft],
			},
			{
				state: States.walkRight,
				possibleNextStates: [States.walkLeft, States.sitIdle],
			},
			{
				state: States.walkLeft,
				possibleNextStates: [
					States.sitIdle,
					States.climbWallLeft,
					States.sitIdle,
				],
			},
			{
				state: States.climbWallLeft,
				possibleNextStates: [States.wallHangLeft],
			},
			{
				state: States.wallHangLeft,
				possibleNextStates: [States.jumpDownLeft],
			},
			{
				state: States.jumpDownLeft,
				possibleNextStates: [States.land],
			},
			{
				state: States.land,
				possibleNextStates: [
					States.sitIdle,
					States.walkRight,
					States.lie,
				],
			},
			{
				state: States.chase,
				possibleNextStates: [States.idleWithBall],
			},
			{
				state: States.idleWithBall,
				possibleNextStates: [States.walkRight, States.walkLeft],
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
		return 0.2; // Can climb walls!
	}

	get climbHeight(): number {
		return 100;
	}

	get fallSpeed(): number {
		return 3.2;
	}

	get hello(): string {
		return `Try Laughing. Then Whatever Scares You Will Go Away. 🎭`;
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
		super(app, PetType.totoro, petColor, petSize, name, floorString, left, speed);
		this.initState();
	}
}

export const TOTORO_NAMES: ReadonlyArray<string> = [
	'Totoro',
	'トトロ',
	'Max',
	'Molly',
	'Coco',
	'Buddy',
	'Ruby',
	'Oscar',
	'Lucy',
	'Bailey',
	'Big fella',
];
