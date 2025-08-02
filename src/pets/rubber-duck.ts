import { App } from "obsidian";
import { BasePetType } from "../pet";
import { States } from "../states";
import { PetColor, PetSize, PetType } from "../types";

/**
 * Rubber Duck pet implementation - debugging companion
 */
export class RubberDuck extends BasePetType {
	readonly label = 'rubber-duck';
	readonly emoji = '🦆';

	static readonly possibleColors = [PetColor.yellow];

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
		return `Quack! Tell me about your code and I'll help you debug it! 🦆`;
	}

	constructor(
		app: App,
		petColor: PetColor,
		petSize: PetSize,
		name: string,
		floorString: string = '0%',
		left: number = 100
	) {
		super(app, PetType.rubberduck, petColor, petSize, name, floorString, left);
		this.initState();
	}
}

export const RUBBER_DUCK_NAMES: ReadonlyArray<string> = [
	'Debugger', 'Quacky', 'CodeDuck', 'Compiler', 'Syntax', 'Parser', 'Duck',
	'Rubber', 'Squeaky', 'Bubbles', 'Splashy', 'Waddles', 'Puddles', 'Ducky',
	'Quacker', 'Donald', 'Daffy', 'Howard', 'Dewey', 'Louie', 'Huey',
	'Scrooge', 'Launchpad', 'Darkwing', 'Mallard',
];
