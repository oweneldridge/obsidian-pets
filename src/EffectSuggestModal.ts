import { App, SuggestModal } from "obsidian";
import { PetView } from "./PetView";

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

	onChooseSuggestion(effect: string, evt: MouseEvent | KeyboardEvent) {
		// Apply the effect
		this.view.setEffect(effect);

		// Update plugin settings
		const plugin = (this.app as any).plugins.plugins['vault-pets'];
		if (plugin) {
			plugin.settings.effect = effect;
			plugin.saveSettings();
		}
	}
}
