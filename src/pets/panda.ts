import { App } from "obsidian";
import { BasePetType } from "../pet";
import { States } from "../states";
import { PetColor, PetSize, PetType } from "../types";

/**
 * Panda pet implementation with lie state
 */
export class Panda extends BasePetType {
	readonly label = 'panda';
	readonly emoji = '🐼';

	static readonly possibleColors = [PetColor.black, PetColor.brown];

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
					States.lie,
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
		return `I love bamboo and naps! 🐼`;
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
		super(app, PetType.panda, petColor, petSize, name, floorString, left, speed);
		this.initState();
	}
}

export const PANDA_NAMES: ReadonlyArray<string> = [
	'Po', 'Bao', 'Ming', 'Chi Chi', 'Ling Ling', 'Mei Mei', 'Bamboo',
	'Kung Fu', 'Master', 'Shifu', 'Tigress', 'Yin', 'Yang', 'Panda',
	'Tian Tian', 'Bei Bei', 'Tai Shan', 'Lun Lun', 'Yang Yang', 'Xiao Liwu',
	'Bai Yun', 'Gao Gao', 'Su Lin', 'Zhen Zhen', 'Yun Zi',
];
