import { App } from "obsidian";
import { BasePetType } from "../pet";
import { PetColor, PetSize, PetType } from "../types";
import { States } from "../states";

export class Bunny extends BasePetType {
	readonly label = 'bunny';
	readonly emoji = '🐰';

	static possibleColors = [
		PetColor.white,
		PetColor.purple,
		PetColor.gray,
	];

	sequence = {
		startingState: States.sitIdle,
		sequenceStates: [
			{
				state: States.lie,
				possibleNextStates: [States.sitIdle],
			},
			{
				state: States.sitIdle,
				possibleNextStates: [
					States.lie,
					States.walkRight,
					States.walkLeft,
					States.standLeft,
					States.standRight,
				],
			},
			{
				state: States.standLeft,
				possibleNextStates: [
					States.lie,
					States.walkRight,
					States.walkLeft,
					States.walkLeft,
				],
			},
			{
				state: States.standRight,
				possibleNextStates: [
					States.lie,
					States.walkRight,
					States.walkRight,
					States.walkLeft,
				],
			},
			{
				state: States.walkRight,
				possibleNextStates: [
					States.walkLeft,
					States.runRight,
					States.runRight,
				],
			},
			{
				state: States.walkLeft,
				possibleNextStates: [
					States.walkRight,
					States.runLeft,
					States.runLeft,
				],
			},
			{
				state: States.runRight,
				possibleNextStates: [
					States.walkLeft,
					States.runLeft,
					States.runLeft,
				],
			},
			{
				state: States.runLeft,
				possibleNextStates: [States.standLeft],
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
		return true;
	}

	get canChase(): boolean {
		return true;
	}

	get climbSpeed(): number {
		return 0; // Bunnies don't climb
	}

	get climbHeight(): number {
		return 0;
	}

	get fallSpeed(): number {
		return 3.2;
	}

	get hello(): string {
		return `Your pookie bunny ${this.name} hopin' by!`;
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
		super(app, PetType.bunny, petColor, petSize, name, floorString, left, speed);
		this.initState();
	}
}

export const BUNNY_NAMES: ReadonlyArray<string> = [
	'Bella',
	'Bugs',
	'BunBun',
	'Bunny',
	'Boo',
	'Charlie',
	'Coco',
	'Daisy',
	'Ginger',
	'Hazel',
	'Honey',
	'Hopper',
	'Lily',
	'Lola',
	'Lucy',
	'Luna',
	'Minnie',
	'Misty',
	'Mocha',
	'Molly',
	'Oreo',
	'Penny',
	'Peter',
	'Pookie',
	'Rosie',
	'Ruby',
	'Sandy',
	'Sunny',
	'Thumper',
	'Willow',
];
