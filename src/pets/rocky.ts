import { App } from "obsidian";
import { BasePetType } from "../pet";
import { States } from "../states";
import { PetColor, PetSize, PetType } from "../types";

/**
 * Rocky pet implementation - rock character (no ball animation)
 */
export class Rocky extends BasePetType {
	readonly label = 'rocky';
	readonly emoji = '🪨';

	static readonly possibleColors = [PetColor.gray];

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
				state: States.swipe,
				possibleNextStates: [States.sitIdle],
			},
		],
	};

	get canSwipe(): boolean {
		return true;
	}

	get canChase(): boolean {
		return false; // No ball animation
	}

	get climbSpeed(): number {
		return 0;
	}

	get climbHeight(): number {
		return 0;
	}

	get fallSpeed(): number {
		return 5.0; // Rocks fall faster
	}

	get hello(): string {
		return `I'm solid as a rock! 🪨`;
	}

	constructor(
		app: App,
		petColor: PetColor,
		petSize: PetSize,
		name: string,
		floorString: string = '0%',
		left: number = 100
	) {
		super(app, PetType.rocky, petColor, petSize, name, floorString, left);
		this.initState();
	}
}

export const ROCKY_NAMES: ReadonlyArray<string> = [
	'Rocky', 'Boulder', 'Stone', 'Pebble', 'Granite', 'Marble', 'Slate',
	'Flint', 'Cobble', 'Basalt', 'Quartz', 'Onyx', 'Obsidian', 'Geo',
	'Cliff', 'Crag', 'Mesa', 'Rocky Balboa', 'Dwayne', 'The Rock',
	'Stonehenge', 'Gibraltar', 'Rockwell', 'Chip', 'Shale',
];
