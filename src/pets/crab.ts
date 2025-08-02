import { App } from "obsidian";
import { BasePetType } from "../pet";
import { States } from "../states";
import { PetColor, PetSize, PetType } from "../types";

/**
 * Crab pet implementation
 */
export class Crab extends BasePetType {
	readonly label = 'crab';
	readonly emoji = '🦀';

	static readonly possibleColors = [PetColor.red];

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
		return 0;
	}

	get climbHeight(): number {
		return 0;
	}

	get fallSpeed(): number {
		return 3.2;
	}

	get hello(): string {
		return `Hi, I'm Crabsolutely Clawsome Crab 👋!`;
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
		super(app, PetType.crab, petColor, petSize, name, floorString, left, speed);
		this.initState();
	}
}

export const CRAB_NAMES: ReadonlyArray<string> = [
	'Ferris', 'Pinchy', 'Grabby', 'Big Red', 'Crabby', 'Buddy', 'Ruby Red',
	'Oscar', 'Lucy', 'Bailey', 'Crabito', 'Percy', 'Rocky', 'Mr. Krabs',
	'Shelly', 'Santa Claws', 'Clawdia', 'Scuttle', 'Snappy', 'Hermit',
	'Horseshoe', 'Snapper', 'Coconut', 'Sebastian', 'Abby', 'Bubbles',
	'Bait', 'Big Mac', 'Biggie', 'Claws', 'Copper', 'Crabette', 'Crabina',
	'Crabmister', 'Crusty', 'Crabcake', 'Digger', 'Nipper', 'Pincer',
	'Poopsie', 'Recluse', 'Salty', 'Squirt', 'Groucho', 'Grumpy',
	'Lenny Krabitz', 'Leonardo DaPinchy', 'Peeves', 'Penny Pincher', 'Prickl',
];
