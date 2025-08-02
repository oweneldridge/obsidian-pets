import { App } from "obsidian";
import { BasePetType } from "../pet";
import { States } from "../states";
import { PetColor, PetSize, PetType } from "../types";

/**
 * Dog pet implementation with complete state machine
 */
export class Dog extends BasePetType {
	readonly label = 'dog';
	readonly emoji = '🐶';

	static readonly possibleColors = [
		PetColor.black,
		PetColor.brown,
		PetColor.white,
		PetColor.red,
		PetColor.akita,
	];

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
		return 0; // Dogs don't climb
	}

	get climbHeight(): number {
		return 0;
	}

	get fallSpeed(): number {
		return 3.2;
	}

	get hello(): string {
		return `Every dog has its day - and today is woof day! Today I just want to bark. Take me on a walk`;
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
		super(app, PetType.dog, petColor, petSize, name, floorString, left, speed);
		this.initState();
	}
}

export const DOG_NAMES: ReadonlyArray<string> = [
	'Bella', 'Charlie', 'Max', 'Molly', 'Coco', 'Buddy', 'Ruby', 'Oscar',
	'Lucy', 'Bailey', 'Milo', 'Daisy', 'Archie', 'Ollie', 'Rosie', 'Lola',
	'Frankie', 'Toby', 'Roxy', 'Poppy', 'Luna', 'Jack', 'Millie', 'Teddy',
	'Harry', 'Cooper', 'Bear', 'Rocky', 'Alfie', 'Hugo', 'Bonnie', 'Pepper',
	'Lily', 'Leo', 'Maggie', 'George', 'Mia', 'Marley', 'Harley', 'Chloe',
	'Lulu', 'Jasper', 'Billy', 'Nala', 'Monty', 'Ziggy', 'Winston', 'Zeus',
	'Zoe', 'Stella', 'Sasha', 'Rusty', 'Gus', 'Baxter', 'Dexter', 'Diesel',
	'Willow', 'Barney', 'Bruno', 'Penny', 'Honey', 'Milly', 'Murphy', 'Holly',
	'Benji', 'Henry', 'Lilly', 'Pippa', 'Shadow', 'Sam', 'Buster', 'Lucky',
	'Ellie', 'Duke', 'Jessie', 'Cookie', 'Harvey', 'Bruce', 'Jax', 'Rex',
	'Louie', 'Bentley', 'Jet', 'Banjo', 'Beau', 'Ella', 'Ralph', 'Loki',
	'Lexi', 'Chester', 'Sophie', 'Billie', 'Louis', 'Cleo', 'Spot', 'Bolt',
	'Ein', 'Maddy', 'Ghost', 'Midnight', 'Pumpkin', 'Sparky', 'Linus', 'Cody',
	'Slinky', 'Toto', 'Balto', 'Golfo', 'Pongo', 'Beethoven', 'Hachiko',
	'Scooby', 'Clifford', 'Astro', 'Goofy', 'Chip', 'Einstein', 'Fang',
	'Truman', 'Uggie', 'Bingo', 'Blue', 'Cometa', 'Krypto', 'Huesos', 'Odie',
	'Snoopy', 'Aisha', 'Moly', 'Chiquita', 'Chavela', 'Tramp', 'Lady',
	'Puddles', 'Gunun',
];
