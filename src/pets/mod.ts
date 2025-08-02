import { App } from "obsidian";
import { BasePetType } from "../pet";
import { States } from "../states";
import { PetColor, PetSize, PetType } from "../types";

/**
 * Mod pet implementation - mod character
 */
export class Mod extends BasePetType {
	readonly label = 'mod';
	readonly emoji = '🎮';

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
		return `I'm here to moderate and modify! Let's keep things fun! 🎮`;
	}

	constructor(
		app: App,
		petColor: PetColor,
		petSize: PetSize,
		name: string,
		floorString: string = '0%',
		left: number = 100
	) {
		super(app, PetType.mod, petColor, petSize, name, floorString, left);
		this.initState();
	}
}

export const MOD_NAMES: ReadonlyArray<string> = [
	'Mod', 'Moderator', 'Admin', 'Guardian', 'Keeper', 'Watcher', 'Sentinel',
	'Overseer', 'Manager', 'Chief', 'Boss', 'Leader', 'Captain', 'Commander',
	'Director', 'Supervisor', 'Controller', 'Regulator', 'Enforcer', 'Monitor',
	'Steward', 'Custodian', 'Protector', 'Defender', 'Shield',
];
