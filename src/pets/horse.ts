import { App } from "obsidian";
import { BasePetType } from "../pet";
import { States } from "../states";
import { PetColor, PetSize, PetType } from "../types";

/**
 * Horse pet implementation with stand state and multiple colors
 */
export class Horse extends BasePetType {
	readonly label = 'horse';
	readonly emoji = '🐴';

	static readonly possibleColors = [
		PetColor.black,
		PetColor.brown,
		PetColor.white,
		PetColor.magical,
		PetColor.paintbeige,
		PetColor.paintblack,
		PetColor.paintbrown,
		PetColor.socksbeige,
		PetColor.socksblack,
		PetColor.socksbrown,
		PetColor.warrior,
	];

	sequence = {
		startingState: States.standRight,
		sequenceStates: [
			{
				state: States.sitIdle,
				possibleNextStates: [States.walkRight],
			},
			{
				state: States.standRight,
				possibleNextStates: [
					States.walkRight,
					States.walkRight,
					States.walkLeft,
					States.standRight,
				],
			},
			{
				state: States.standLeft,
				possibleNextStates: [
					States.walkRight,
					States.walkLeft,
					States.walkLeft,
					States.standLeft,
				],
			},
			{
				state: States.walkRight,
				possibleNextStates: [
					States.walkLeft,
					States.runRight,
					States.runLeft,
					States.standRight,
					States.standRight,
					States.standRight,
				],
			},
			{
				state: States.runRight,
				possibleNextStates: [
					States.walkRight,
					States.walkRight,
					States.runLeft,
				],
			},
			{
				state: States.walkLeft,
				possibleNextStates: [
					States.walkRight,
					States.runLeft,
					States.runRight,
					States.standLeft,
					States.standLeft,
					States.standLeft,
				],
			},
			{
				state: States.runLeft,
				possibleNextStates: [
					States.walkLeft,
					States.walkLeft,
					States.runRight,
				],
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
		return 0;
	}

	get climbHeight(): number {
		return 0;
	}

	get fallSpeed(): number {
		return 3.5;
	}

	get hello(): string {
		return `Neigh! Let's gallop together! 🐴`;
	}

	constructor(
		app: App,
		petColor: PetColor,
		petSize: PetSize,
		name: string,
		floorString: string = '0%',
		left: number = 100
	) {
		super(app, PetType.horse, petColor, petSize, name, floorString, left);
		this.initState();
	}
}

export const HORSE_NAMES: ReadonlyArray<string> = [
	'Spirit', 'Maximus', 'Bullseye', 'Shadowfax', 'Seabiscuit', 'Secretariat',
	'Black Beauty', 'Trigger', 'Silver', 'Champion', 'Epona', 'Rocinante',
	'Thunder', 'Lightning', 'Storm', 'Blaze', 'Star', 'Duke', 'Buttercup',
	'Midnight', 'Shadow', 'Twilight', 'Dawn', 'Dusty', 'Rusty', 'Patches',
	'Pepper', 'Ginger', 'Cinnamon', 'Chestnut', 'Maple', 'Ember', 'Flame',
	'Apollo', 'Zeus', 'Athena', 'Bella', 'Luna', 'Charlie', 'Max', 'Buddy',
	'Rocky', 'Lucky', 'Scout', 'Ranger', 'Maverick', 'Ace', 'Bandit',
];
