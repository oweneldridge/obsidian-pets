import { App } from "obsidian";
import { BasePetType } from "../pet";
import { States } from "../states";
import { PetColor, PetSize, PetType } from "../types";

/**
 * Cockatiel pet implementation - bird with multiple colors
 */
export class Cockatiel extends BasePetType {
	readonly label = 'cockatiel';
	readonly emoji = '🦜';

	static readonly possibleColors = [PetColor.brown, PetColor.gray];

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
		return 2.5; // Birds fall slower
	}

	get hello(): string {
		return `Tweet tweet! I'm a friendly cockatiel! 🦜`;
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
		super(app, PetType.cockatiel, petColor, petSize, name, floorString, left, speed);
		this.initState();
	}
}

export const COCKATIEL_NAMES: ReadonlyArray<string> = [
	'Tweety', 'Kiwi', 'Mango', 'Peaches', 'Sunny', 'Charlie', 'Coco',
	'Pepper', 'Buddy', 'Rio', 'Sky', 'Cloud', 'Feather', 'Wings',
	'Chirpy', 'Whistle', 'Melody', 'Harmony', 'Song', 'Trill',
	'Beaky', 'Crest', 'Cheep', 'Pearl', 'Jewel',
];
