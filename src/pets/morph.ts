import { App } from "obsidian";
import { BasePetType } from "../pet";
import { States } from "../states";
import { PetColor, PetSize, PetType } from "../types";

/**
 * Morph pet implementation - morphing character
 */
export class Morph extends BasePetType {
	readonly label = 'morph';
	readonly emoji = '🔮';

	static readonly possibleColors = [PetColor.purple];

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
		return `I can morph into anything! Watch me transform! 🔮`;
	}

	constructor(
		app: App,
		petColor: PetColor,
		petSize: PetSize,
		name: string,
		floorString: string = '0%',
		left: number = 100
	) {
		super(app, PetType.morph, petColor, petSize, name, floorString, left);
		this.initState();
	}
}

export const MORPH_NAMES: ReadonlyArray<string> = [
	'Morph', 'Morpheus', 'Mystique', 'Shifter', 'Changeling', 'Ditto',
	'Mimic', 'Echo', 'Chameleon', 'Transformer', 'Shapiro', 'Flex', 'Alter',
	'Varia', 'Mutant', 'Polymorph', 'Prism', 'Spectrum', 'Quantum', 'Phase',
	'Meta', 'Enigma', 'Cipher', 'Mystic', 'Arcane',
];
