import { App, SuggestModal } from "obsidian";
import { PetView } from "./PetView";
import { PLUGIN_ID } from "./constants";
import { getPlugin } from "./obsidian-types";
import type VaultPetsPlugin from "../main";

/**
 * Modal for selecting a theme for the pet view background
 */
export class ThemeSuggestModal extends SuggestModal<string> {
	private view: PetView;

	constructor(app: App, view: PetView) {
		super(app);
		this.view = view;
		this.setPlaceholder('Choose a theme...');
	}

	getSuggestions(query: string): string[] {
		const themes = ['none', 'castle', 'forest', 'beach', 'winter', 'autumn'];
		return themes.filter(theme =>
			theme.toLowerCase().includes(query.toLowerCase())
		);
	}

	renderSuggestion(theme: string, el: HTMLElement) {
		el.createEl('div', { text: theme });
	}

	onChooseSuggestion(theme: string, evt: MouseEvent | KeyboardEvent): void {
		// Apply the theme
		this.view.applyTheme(theme);

		// Update plugin settings
		const plugin = getPlugin<VaultPetsPlugin>(this.app, PLUGIN_ID);
		if (plugin) {
			plugin.settings.theme = theme;
			void plugin.saveSettings();
		}
	}
}
