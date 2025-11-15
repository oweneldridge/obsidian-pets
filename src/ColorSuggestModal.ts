// src/ColorSuggestModal.ts

import { App, SuggestModal } from 'obsidian';
import { PetView } from './PetView';
import { PET_COLOR_MAP } from './PetSuggestModal';
import {NameInputModal} from "./NameInputModal";
import { t } from './localize';

export class ColorSuggestModal extends SuggestModal<string> {
	view: PetView;
	petType: string;

	constructor(app: App, view: PetView, petType: string) {
		super(app);
		this.view = view;
		this.petType = petType;
		this.setPlaceholder(t("Choose a color..."));
	}

	// Returns all the available colors for the selected pet type
	getSuggestions(query: string): string[] {
		const colors = PET_COLOR_MAP[this.petType] || [];
		return colors.filter(
			(color) => color.toLowerCase().includes(query.toLowerCase())
		);
	}

	// Renders each color suggestion
	renderSuggestion(color: string, el: HTMLElement) {
		el.createEl("div", { text: t(color) });
	}

	// Called when the user clicks a color
	onChooseSuggestion(color: string, evt: MouseEvent | KeyboardEvent) {
		this.close();
		new NameInputModal(this.app, this.view, this.petType, color).open();
	}
}
