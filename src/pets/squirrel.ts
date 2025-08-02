import { App } from "obsidian";
import { BasePetType } from "../pet";
import { PetColor, PetSize, PetType } from "../types";
import { States } from "../states";

export class Squirrel extends BasePetType {
	readonly label = 'squirrel';
	readonly emoji = '🐿️';

	static possibleColors = [
		PetColor.gray,
		PetColor.black,
		PetColor.brown,
		PetColor.purple,
		PetColor.white,
	];

	sequence = {
		startingState: States.sitIdle,
		sequenceStates: [
			{
				state: States.sitIdle,
				possibleNextStates: [States.walkRight, States.walkLeft],
			},
			{
				state: States.standRight,
				possibleNextStates: [
					States.walkRight,
					States.runRight,
					States.walkLeft,
				],
			},
			{
				state: States.standLeft,
				possibleNextStates: [
					States.walkLeft,
					States.runLeft,
					States.walkRight,
					States.climbWallLeft,
				],
			},
			{
				state: States.walkRight,
				possibleNextStates: [
					States.standRight,
					States.runRight,
					States.walkLeft,
					States.walkRight,
				],
			},
			{
				state: States.walkLeft,
				possibleNextStates: [
					States.standLeft,
					States.runLeft,
					States.climbWallLeft,
					States.walkRight,
					States.walkLeft,
				],
			},
			{
				state: States.runRight,
				possibleNextStates: [
					States.runLeft,
					States.walkRight,
					States.walkRight,
					States.standRight,
				],
			},
			{
				state: States.runLeft,
				possibleNextStates: [
					States.runRight,
					States.walkLeft,
					States.walkLeft,
					States.standLeft,
					States.climbWallLeft,
				],
			},
			{
				state: States.climbWallLeft,
				possibleNextStates: [States.wallDigLeft],
			},
			{
				state: States.wallDigLeft,
				possibleNextStates: [States.wallNap],
			},
			{
				state: States.wallNap,
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
				possibleNextStates: [States.sitIdle, States.runRight],
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
				possibleNextStates: [States.runRight, States.runLeft],
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
		return 7; // Squirrels are fast climbers!
	}

	get climbHeight(): number {
		return 150; // Squirrels climb higher than cats
	}

	get fallSpeed(): number {
		return 15; // Faster fall speed
	}

	get hello(): string {
		let response = 'Got any nuts?!';
		switch (this.name.toLowerCase()) {
			case 'bruce':
				response = "Wanna get nuts? Let's get nuts!";
				break;
			case 'hugo':
				response = "I'm the world's laziest squirrel!";
				break;
			case 'rocky':
				response = 'Oh, Bullwinkle! You did it again!';
				break;
			case 'slappy':
				response = 'You remind me of...';
				break;
			case 'sandy':
				response = "I don't cry, I sweat through my eyes!";
				break;
			case 'charlie':
				response = 'Charie DO know!';
				break;
			case 'eleanor':
				response = 'Meow?';
				break;
		}
		return response;
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
		super(app, PetType.squirrel, petColor, petSize, name, floorString, left, speed);
		this.initState();
	}
}

export const SQUIRREL_NAMES: ReadonlyArray<string> = [
	'Twiggy',
	'Scrat',
	'Rocky',
	'Sandy',
	'Secret Squirrel',
	'Slappy',
	'Skippy',
	'Conker',
	'Bucky',
	'Guinevere',
	'Sally',
	'Chitter',
	'Squeaks',
	'Sinan',
	'Nutsy',
	'Lady Timbertail',
	'Nibbles',
	'Nutty',
	'Twitchy',
	'Nutkin',
	'Acornelia',
	'Sneezy',
	'Scamper',
	'Peanut',
	'Eleanor',
	'Acorn',
	'Bruce',
	'Walnut',
	'Hazel',
	'Noah',
	'Henry',
	'Ranger',
	'Link',
	'Tomato',
	'Charlie',
	'Pinecone',
];
