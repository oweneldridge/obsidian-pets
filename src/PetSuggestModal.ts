import { App, SuggestModal } from 'obsidian';
import { PetView } from './PetView';
import { ColorSuggestModal } from './ColorSuggestModal';
import { t } from './localize';

const PET_TYPES = [
	'chicken', 'clippy', 'cockatiel', 'crab', 'deno',
	'dog', 'fox', 'horse', 'mod', 'morph',
	'panda', 'rat', 'rocky', 'rubber-duck', 'skeleton',
	'snail', 'snake', 'totoro', 'turtle', 'zappy'
];

export const PET_COLOR_MAP: Record<string, string[]> = {
	'chicken': ['white'],
	'clippy': ['black', 'brown', 'green', 'yellow'],
	'cockatiel': ['brown', 'gray'],
	'crab': ['red'],
	'deno': ['green'],
	'dog': ['brown', 'black', 'red', 'white', 'akita'],
	'fox': ['red', 'white'],
	'horse': ['black', 'brown', 'white', 'magical', 'paint beige', 'paint black', 'paint brown', 'socks beige', 'socks black', 'socks brown', 'warrior'],
	'mod': ['purple'],
	'morph': ['purple'],
	'panda': ['black', 'brown'],
	'rat': ['brown', 'gray', 'white'],
	'rocky': ['gray'],
	'rubber-duck': ['yellow'],
	'skeleton': ['blue', 'brown', 'green', 'orange', 'pink', 'purple', 'red', 'warrior', 'white', 'yellow'],
	'snail': ['brown'],
	'snake': ['green'],
	'totoro': ['gray'],
	'turtle': ['green', 'orange'],
	'zappy': ['yellow']
};

export class PetSuggestModal extends SuggestModal<string> {
	view: PetView;

	constructor(app: App, view: PetView) {
		super(app);
		this.view = view;
		this.setPlaceholder(t("Choose a pet to add..."));
	}

	getSuggestions(query: string): string[] {
		return PET_TYPES.filter(
			(pet) => pet.toLowerCase().includes(query.toLowerCase())
		);
	}

	renderSuggestion(pet: string, el: HTMLElement) {
		el.createEl("div", { text: t(pet) });
	}

	onChooseSuggestion(petType: string, evt: MouseEvent | KeyboardEvent) {
		this.close();
		new ColorSuggestModal(this.app, this.view, petType).open();
	}
}
