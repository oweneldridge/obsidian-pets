import { App } from "obsidian";
import { BasePetType } from "../pet";
import { States } from "../states";
import { PetColor, PetSize, PetType } from "../types";

/**
 * Fox pet implementation with complex movement patterns
 */
export class Fox extends BasePetType {
	readonly label = 'fox';
	readonly emoji = '🦊';

	static readonly possibleColors = [PetColor.red, PetColor.white];

	sequence = {
		startingState: States.sitIdle,
		sequenceStates: [
			{
				state: States.sitIdle,
				possibleNextStates: [
					States.lie,
					States.walkRight,
					States.walkLeft,
					States.runRight,
					States.runLeft,
				],
			},
			{
				state: States.lie,
				possibleNextStates: [
					States.walkRight,
					States.walkLeft,
					States.runRight,
					States.runLeft,
				],
			},
			{
				state: States.walkRight,
				possibleNextStates: [
					States.sitIdle,
					States.walkLeft,
					States.runLeft,
				],
			},
			{
				state: States.walkLeft,
				possibleNextStates: [
					States.sitIdle,
					States.walkRight,
					States.runRight,
				],
			},
			{
				state: States.runRight,
				possibleNextStates: [
					States.lie,
					States.sitIdle,
					States.walkLeft,
					States.runLeft,
				],
			},
			{
				state: States.runLeft,
				possibleNextStates: [
					States.lie,
					States.sitIdle,
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
					States.lie,
					States.walkRight,
					States.walkLeft,
					States.runRight,
					States.runLeft,
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
		return `fox says hello`;
	}

	constructor(
		app: App,
		petColor: PetColor,
		petSize: PetSize,
		name: string,
		floorString: string = '0%',
		left: number = 100
	) {
		super(app, PetType.fox, petColor, petSize, name, floorString, left);
		this.initState();
	}
}

export const FOX_NAMES: ReadonlyArray<string> = [
	'Arizona', 'Frankie', 'Rosy', 'Cinnamon', 'Ginger', 'Todd', 'Rocky',
	'Felix', 'Sandy', 'Archie', 'Flynn', 'Foxy', 'Elmo', 'Ember', 'Hunter',
	'Otto', 'Sonic', 'Amber', 'Maroon', 'Spark', 'Sparky', 'Sly', 'Scout',
	'Penny', 'Ash', 'Rose', 'Apollo', 'Chili', 'Blaze', 'Radish', 'Scarlett',
	'Juliet', 'Goldie', 'Rooney', 'Paprika', 'Alpine', 'Rusty', 'Maple',
	'Vixen', 'David', 'Apricot', 'Claire', 'Wilma', 'Copper', 'Pepper',
	'Crimson', 'Ariel', 'Arvi', 'George', 'Eva', 'Fuzzy', 'Russell', 'Rufus',
	'Mystic', 'Leopold', 'Scully', 'Ferris', 'Robin', 'Zorro', 'Scarlet',
	'Comet', 'Rowan', 'Jake', 'Hope', 'Molly', 'Mars', 'Apple', 'Geneva',
	'Redford', 'Chestnut', 'Evelyn', 'Red', 'Aurora', 'Agniya', 'Fitz',
	'Crispin', 'Sunny', 'Autumn', 'Bridget', 'Ruby', 'Iris', 'Pumpkin',
	'Rose', 'Rosie', 'Vesta', 'Adolf', 'Lava', 'Conan', 'Flame', 'Oswald',
	'Tails', 'Chester', 'Jasper', 'Finch', 'Scarlet', 'Chewy', 'Finnick',
	'Biscuit', 'Prince Harry', 'Loki', 'Pip', 'Pippin',
];
