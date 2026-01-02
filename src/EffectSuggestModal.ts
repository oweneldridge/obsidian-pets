import { App, SuggestModal } from "obsidian";
import { PetView } from "./PetView";
import { PLUGIN_ID } from "./constants";
import { getPlugin } from "./obsidian-types";
import type VaultPetsPlugin from "../main";

/**
 * Modal for selecting a visual effect (snow, stars, leaves)
 */
export class EffectSuggestModal extends SuggestModal<string> {
	private view: PetView;

	constructor(app: App, view: PetView) {
		super(app);
		this.view = view;
		this.setPlaceholder('Choose a visual effect...');
	}

	getSuggestions(query: string): string[] {
		const effects = ['none', 'snow', 'stars', 'leaves'];
		return effects.filter(effect =>
			effect.toLowerCase().includes(query.toLowerCase())
		);
	}

	renderSuggestion(effect: string, el: HTMLElement) {
		el.createEl('div', { text: effect });
	}

	onChooseSuggestion(effect: string, evt: MouseEvent | KeyboardEvent): void {
		// Apply the effect
		this.view.setEffect(effect);

		// Update plugin settings
		const plugin = getPlugin<VaultPetsPlugin>(this.app, PLUGIN_ID);
		if (plugin) {
			plugin.settings.effect = effect;
			void plugin.saveSettings();
		}
	}
}
