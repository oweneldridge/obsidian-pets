import { App } from "obsidian";
import { BasePetType } from "../pet";
import { States } from "../states";
import { PetColor, PetSize, PetType } from "../types";

/**
 * Zappy pet implementation - electric character
 */
export class Zappy extends BasePetType {
	readonly label = 'zappy';
	readonly emoji = '⚡';

	static readonly possibleColors = [PetColor.yellow];

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
		return `Zzzzap! I'm charged up and ready to go! ⚡`;
	}

	constructor(
		app: App,
		petColor: PetColor,
		petSize: PetSize,
		name: string,
		floorString: string = '0%',
		left: number = 100
	) {
		super(app, PetType.zappy, petColor, petSize, name, floorString, left);
		this.initState();
	}
}

export const ZAPPY_NAMES: ReadonlyArray<string> = [
	'Zappy', 'Bolt', 'Spark', 'Flash', 'Thunder', 'Lightning', 'Electro',
	'Voltage', 'Amp', 'Watt', 'Tesla', 'Joule', 'Ohm', 'Current', 'Charge',
	'Buzz', 'Zippy', 'Static', 'Shock', 'Zap', 'Striker', 'Stormy', 'Raiden',
	'Pikachu', 'Sparky',
];
