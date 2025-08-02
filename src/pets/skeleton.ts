import { App } from "obsidian";
import { BasePetType } from "../pet";
import { States } from "../states";
import { PetColor, PetSize, PetType } from "../types";

/**
 * Skeleton pet implementation with stand state and multiple colors
 */
export class Skeleton extends BasePetType {
	readonly label = 'skeleton';
	readonly emoji = '💀';

	static readonly possibleColors = [
		PetColor.blue,
		PetColor.brown,
		PetColor.green,
		PetColor.orange,
		PetColor.pink,
		PetColor.purple,
		PetColor.red,
		PetColor.warrior,
		PetColor.white,
		PetColor.yellow,
	];

	sequence = {
		startingState: States.standRight,
		sequenceStates: [
			{
				state: States.sitIdle,
				possibleNextStates: [States.walkRight],
			},
			{
				state: States.standRight,
				possibleNextStates: [
					States.walkRight,
					States.walkRight,
					States.walkLeft,
					States.standRight,
				],
			},
			{
				state: States.standLeft,
				possibleNextStates: [
					States.walkRight,
					States.walkLeft,
					States.walkLeft,
					States.standLeft,
				],
			},
			{
				state: States.walkRight,
				possibleNextStates: [States.walkLeft, States.standRight],
			},
			{
				state: States.walkLeft,
				possibleNextStates: [States.walkRight, States.standLeft],
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
					States.standRight,
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
		return `I've got a bone to pick with you! Just kidding - let's have fun! 💀`;
	}

	constructor(
		app: App,
		petColor: PetColor,
		petSize: PetSize,
		name: string,
		floorString: string = '0%',
		left: number = 100
	) {
		super(app, PetType.skeleton, petColor, petSize, name, floorString, left);
		this.initState();
	}
}

export const SKELETON_NAMES: ReadonlyArray<string> = [
	'Bones', 'Skully', 'Jack', 'Sans', 'Papyrus', 'Dem Bones', 'Rattles',
	'Calcium', 'Marrow', 'Spooky', 'Scary', 'Boney', 'Skellington', 'Grim',
	'Reaper', 'Brook', 'Spine', 'Tibia', 'Fibula', 'Femur', 'Skull',
	'Jawbone', 'Vertebra', 'Clavicle', 'Patella', 'Humerus', 'Radius',
	'Ulna', 'Coccyx', 'Sternum', 'Rib', 'Sacrum', 'Mandible', 'Maxilla',
	'Phalanx', 'Metacarpal', 'Metatarsal', 'Scapula', 'Pelvis', 'Atlas',
];
