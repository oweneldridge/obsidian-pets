import { App } from "obsidian";
import { BasePetType } from "../pet";
import { PetColor, PetSize, PetType } from "../types";
import { States } from "../states";

export class Cat extends BasePetType {
	readonly label = 'cat';
	readonly emoji = '🐱';

	static possibleColors = [
		PetColor.black,
		PetColor.brown,
		PetColor.gray,
		PetColor.orange,
		PetColor.white,
	];

	sequence = {
		startingState: States.sitIdle,
		sequenceStates: [
			{
				state: States.sitIdle,
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
					States.climbWallLeft,
					States.walkRight,
					States.runRight,
				],
			},
			{
				state: States.runLeft,
				possibleNextStates: [
					States.sitIdle,
					States.climbWallLeft,
					States.walkRight,
					States.runRight,
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
		return 1.5;
	}

	get climbHeight(): number {
		return 100;
	}

	get fallSpeed(): number {
		return 3.2;
	}

	get hello(): string {
		return `brrr... Meow!`;
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
		super(app, PetType.cat, petColor, petSize, name, floorString, left, speed);
		this.initState();
	}
}

export const CAT_NAMES: ReadonlyArray<string> = [
	'Bella',
	'Charlie',
	'Molly',
	'Coco',
	'Ruby',
	'Oscar',
	'Lucy',
	'Bailey',
	'Milo',
	'Daisy',
	'Archie',
	'Ollie',
	'Rosie',
	'Lola',
	'Frankie',
	'Roxy',
	'Poppy',
	'Luna',
	'Jack',
	'Millie',
	'Teddy',
	'Cooper',
	'Bear',
	'Rocky',
	'Alfie',
	'Hugo',
	'Bonnie',
	'Pepper',
	'Lily',
	'Tilly',
	'Leo',
	'Maggie',
	'George',
	'Mia',
	'Marley',
	'Harley',
	'Chloe',
	'Lulu',
	'Missy',
	'Jasper',
	'Billy',
	'Nala',
	'Monty',
	'Ziggy',
	'Winston',
	'Zeus',
	'Zoe',
	'Stella',
	'Sasha',
	'Rusty',
	'Gus',
	'Baxter',
	'Dexter',
	'Willow',
	'Barney',
	'Bruno',
	'Penny',
	'Honey',
	'Milly',
	'Murphy',
	'Simba',
	'Holly',
	'Benji',
	'Henry',
	'Lilly',
	'Pippa',
	'Shadow',
	'Sam',
	'Lucky',
	'Ellie',
	'Duke',
	'Jessie',
	'Cookie',
	'Harvey',
	'Bruce',
	'Jax',
	'Rex',
	'Louie',
	'Jet',
	'Banjo',
	'Beau',
	'Ella',
	'Ralph',
	'Loki',
	'Lexi',
	'Chester',
	'Sophie',
	'Chilli',
	'Billie',
	'Louis',
	'Scout',
	'Cleo',
	'Purfect',
	'Spot',
	'Bolt',
	'Julia',
	'Ginger',
	'Amelia',
	'Oliver',
	'Ghost',
	'Midnight',
	'Pumpkin',
	'Binx',
	'Riley',
	'Lenny',
	'Mango',
	'Alex',
	'Boo',
	'Botas',
	'Romeo',
	'Bob',
	'Clyde',
	'Simon',
	'Mimmo',
	'Carlotta',
	'Felix',
	'Duchess',
	'Byrt',
	'Nianian',
];
