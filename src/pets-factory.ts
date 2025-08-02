import { App } from "obsidian";
import { BasePetType } from "./pet";
import { PetColor, PetSize, PetType } from "./types";
import {
	Dog, DOG_NAMES,
	Crab, CRAB_NAMES,
	Chicken, CHICKEN_NAMES,
	Clippy, CLIPPY_NAMES,
	Fox, FOX_NAMES,
	Snake, SNAKE_NAMES,
	Snail, SNAIL_NAMES,
	Deno, DENO_NAMES,
	Zappy, ZAPPY_NAMES,
	Morph, MORPH_NAMES,
	Mod, MOD_NAMES,
	RubberDuck, RUBBER_DUCK_NAMES,
	Rocky, ROCKY_NAMES,
	Turtle, TURTLE_NAMES,
	Panda, PANDA_NAMES,
	Cockatiel, COCKATIEL_NAMES,
	Rat, RAT_NAMES,
	Horse, HORSE_NAMES,
	Skeleton, SKELETON_NAMES,
	Totoro, TOTORO_NAMES
} from "./pets";

/**
 * Pet factory for creating pet instances based on type
 */

/**
 * Get available colors for a specific pet type
 */
export function availableColors(petType: PetType): PetColor[] {
	switch (petType) {
		case PetType.dog:
			return Dog.possibleColors;
		case PetType.crab:
			return Crab.possibleColors;
		case PetType.chicken:
			return Chicken.possibleColors;
		case PetType.clippy:
			return Clippy.possibleColors;
		case PetType.fox:
			return Fox.possibleColors;
		case PetType.snake:
			return Snake.possibleColors;
		case PetType.snail:
			return Snail.possibleColors;
		case PetType.deno:
			return Deno.possibleColors;
		case PetType.zappy:
			return Zappy.possibleColors;
		case PetType.morph:
			return Morph.possibleColors;
		case PetType.mod:
			return Mod.possibleColors;
		case PetType.rubberduck:
			return RubberDuck.possibleColors;
		case PetType.rocky:
			return Rocky.possibleColors;
		case PetType.turtle:
			return Turtle.possibleColors;
		case PetType.panda:
			return Panda.possibleColors;
		case PetType.cockatiel:
			return Cockatiel.possibleColors;
		case PetType.rat:
			return Rat.possibleColors;
		case PetType.horse:
			return Horse.possibleColors;
		case PetType.skeleton:
			return Skeleton.possibleColors;
		case PetType.totoro:
			return Totoro.possibleColors;
		default:
			// For unimplemented pets, return default color set
			return [PetColor.brown, PetColor.black];
	}
}

/**
 * Get available names for a specific pet type
 */
export function availableNames(petType: PetType): ReadonlyArray<string> {
	switch (petType) {
		case PetType.dog:
			return DOG_NAMES;
		case PetType.crab:
			return CRAB_NAMES;
		case PetType.chicken:
			return CHICKEN_NAMES;
		case PetType.clippy:
			return CLIPPY_NAMES;
		case PetType.fox:
			return FOX_NAMES;
		case PetType.snake:
			return SNAKE_NAMES;
		case PetType.snail:
			return SNAIL_NAMES;
		case PetType.deno:
			return DENO_NAMES;
		case PetType.zappy:
			return ZAPPY_NAMES;
		case PetType.morph:
			return MORPH_NAMES;
		case PetType.mod:
			return MOD_NAMES;
		case PetType.rubberduck:
			return RUBBER_DUCK_NAMES;
		case PetType.rocky:
			return ROCKY_NAMES;
		case PetType.turtle:
			return TURTLE_NAMES;
		case PetType.panda:
			return PANDA_NAMES;
		case PetType.cockatiel:
			return COCKATIEL_NAMES;
		case PetType.rat:
			return RAT_NAMES;
		case PetType.horse:
			return HORSE_NAMES;
		case PetType.skeleton:
			return SKELETON_NAMES;
		case PetType.totoro:
			return TOTORO_NAMES;
		default:
			return ['Pet'];
	}
}

/**
 * Create a pet instance of the specified type
 * @param app - Obsidian App instance
 * @param petType - Type of pet to create
 * @param petColor - Color variant
 * @param petSize - Size of the pet
 * @param name - Pet's name
 * @param floorString - Floor position as CSS value (e.g., "10%")
 * @param left - Starting left position in pixels
 * @returns Pet instance or null if type not implemented
 */
export function createPet(
	app: App,
	petType: PetType,
	petColor: PetColor,
	petSize: PetSize,
	name: string,
	floorString: string = '0%',
	left: number = 100
): BasePetType | null {
	// Validate color is available for this pet type
	const colors = availableColors(petType);
	if (!colors.includes(petColor)) {
		console.warn(`Color ${petColor} not available for ${petType}, using first available color`);
		petColor = colors[0];
	}

	switch (petType) {
		case PetType.dog:
			return new Dog(app, petColor, petSize, name, floorString, left);
		case PetType.crab:
			return new Crab(app, petColor, petSize, name, floorString, left);
		case PetType.chicken:
			return new Chicken(app, petColor, petSize, name, floorString, left);
		case PetType.clippy:
			return new Clippy(app, petColor, petSize, name, floorString, left);
		case PetType.fox:
			return new Fox(app, petColor, petSize, name, floorString, left);
		case PetType.snake:
			return new Snake(app, petColor, petSize, name, floorString, left);
		case PetType.snail:
			return new Snail(app, petColor, petSize, name, floorString, left);
		case PetType.deno:
			return new Deno(app, petColor, petSize, name, floorString, left);
		case PetType.zappy:
			return new Zappy(app, petColor, petSize, name, floorString, left);
		case PetType.morph:
			return new Morph(app, petColor, petSize, name, floorString, left);
		case PetType.mod:
			return new Mod(app, petColor, petSize, name, floorString, left);
		case PetType.rubberduck:
			return new RubberDuck(app, petColor, petSize, name, floorString, left);
		case PetType.rocky:
			return new Rocky(app, petColor, petSize, name, floorString, left);
		case PetType.turtle:
			return new Turtle(app, petColor, petSize, name, floorString, left);
		case PetType.panda:
			return new Panda(app, petColor, petSize, name, floorString, left);
		case PetType.cockatiel:
			return new Cockatiel(app, petColor, petSize, name, floorString, left);
		case PetType.rat:
			return new Rat(app, petColor, petSize, name, floorString, left);
		case PetType.horse:
			return new Horse(app, petColor, petSize, name, floorString, left);
		case PetType.skeleton:
			return new Skeleton(app, petColor, petSize, name, floorString, left);
		case PetType.totoro:
			return new Totoro(app, petColor, petSize, name, floorString, left);
		default:
			console.error(`Pet type ${petType} not yet implemented`);
			return null;
	}
}

/**
 * Get a random name for a pet type
 */
export function getRandomName(petType: PetType): string {
	const names = availableNames(petType);
	return names[Math.floor(Math.random() * names.length)];
}

/**
 * Check if a pet type is implemented
 */
export function isPetTypeImplemented(petType: PetType): boolean {
	return [
		PetType.dog,
		PetType.crab,
		PetType.chicken,
		PetType.clippy,
		PetType.fox,
		PetType.snake,
		PetType.snail,
		PetType.deno,
		PetType.zappy,
		PetType.morph,
		PetType.mod,
		PetType.rubberduck,
		PetType.rocky,
		PetType.turtle,
		PetType.panda,
		PetType.cockatiel,
		PetType.rat,
		PetType.horse,
		PetType.skeleton,
		PetType.totoro,
	].includes(petType);
}
