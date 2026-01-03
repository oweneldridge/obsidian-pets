import { App, Plugin, PluginSettingTab, Setting, Notice } from 'obsidian';
import { PetView, PET_VIEW_TYPE } from './src/PetView';
import { PetSuggestModal } from './src/PetSuggestModal';
import { ImportPetsModal } from './src/ImportPetsModal';
import { PetSize, PetType } from "./src/types";
import { DEFAULT_PET_SIZE, DEFAULT_PET_TYPE, DEFAULT_PET_COLOR, DEFAULT_THEME } from './src/constants';
import { availableColors } from './src/pets-factory';
import { initializeLocale } from './src/localize';

interface SavedPet {
	type: string;
	color: string;
	size: string;
	name: string;
}

interface PetPluginSettings {
	petType: string;
	petColor: string;
	petSize: string;
	theme: string;
	effect: string;
	throwBallWithMouse: boolean;
	disableEffects: boolean;
	savedPets: SavedPet[];
}

const DEFAULT_SETTINGS: PetPluginSettings = {
	petType: DEFAULT_PET_TYPE,
	petColor: DEFAULT_PET_COLOR,
	petSize: DEFAULT_PET_SIZE,
	theme: DEFAULT_THEME,
	effect: 'none',
	throwBallWithMouse: false,
	disableEffects: false,
	savedPets: [],
}

// Get valid color for a pet, fallback to first available color
function getValidColorForPet(petType: string, currentColor: string): string {
	const colors = availableColors(petType as PetType);
	const colorStrings = colors.map(c => c.toString());
	return colorStrings.includes(currentColor) ? currentColor : colorStrings[0];
}


export default class VaultPetsPlugin extends Plugin {
	settings: PetPluginSettings;

	async onload() {
		await this.loadSettings();

		// Initialize localization
		await initializeLocale();

		// This registers our custom view with Obsidian
		this.registerView(
			PET_VIEW_TYPE,
			(leaf) => new PetView(leaf)
		);

		// This creates an icon in the left ribbon.
		this.addRibbonIcon('dog', 'Open pet view', () => {
			void this.activateView();
		});

		// This adds a simple command that can be triggered anywhere
		this.addCommand({
			id: 'open-pet-view',
			name: 'Open pet view',
			callback: () => {
				void this.activateView();
			}
		});

		this.addCommand({
			id: 'spawn-additional-pet',
			name: 'Spawn an additional pet',
			callback: () => {
				const leaf = this.app.workspace.getLeavesOfType(PET_VIEW_TYPE)[0];
				if (leaf) {
					const petView = leaf.view as PetView;
					// Open the selection modal, just like the '+' button does.
					new PetSuggestModal(this.app, petView).open();
				} else {
					// If the pet view is not open, we could optionally open it first.
					// For now, it does nothing if the view is not open.
					void this.activateView(); // Let's open the view if it's not already.
				}
			}
		});

		this.addCommand({
			id: 'remove-all-pets',
			name: 'Remove all pets',
			callback: () => {
				const leaf = this.app.workspace.getLeavesOfType(PET_VIEW_TYPE)[0];
				if (leaf) {
					const petView = leaf.view as PetView;
					petView.clearAllPets();
				}
			}
		});

		this.addCommand({
			id: 'throw-ball',
			name: 'Throw ball',
			callback: () => {
				const leaf = this.app.workspace.getLeavesOfType(PET_VIEW_TYPE)[0];
				if (leaf) {
					const petView = leaf.view as PetView;
					petView.throwBall();
				}
			}
		});

		this.addCommand({
			id: 'export-pet-list',
			name: 'Export pet list',
			callback: async () => {
				const petListJson = JSON.stringify(this.settings.savedPets, null, 2);
				const fileName = `pets-${Date.now()}.json`;

				try {
					// Create a new note with the pet data
					await this.app.vault.create(fileName, petListJson);
					console.debug(`Pets exported to ${fileName}`);
				} catch (error) {
					console.error('Failed to export pets:', error);
				}
			}
		});

		this.addCommand({
			id: 'import-pet-list',
			name: 'Import pet list',
			callback: () => {
				new ImportPetsModal(this.app, async (pets) => {
					// Replace current pets with imported pets
					this.settings.savedPets = pets;
					await this.saveSettings();

					// Reload pets in the view
					const leaf = this.app.workspace.getLeavesOfType(PET_VIEW_TYPE)[0];
					if (leaf) {
						const petView = leaf.view as PetView;
						petView.loadPetsFromSettings();
					}
				}).open();
			}
		});

		this.addCommand({
			id: 'roll-call',
			name: 'Roll call',
			callback: () => {
				const leaf = this.app.workspace.getLeavesOfType(PET_VIEW_TYPE)[0];
				if (leaf) {
					const petView = leaf.view as PetView;
					petView.rollCall();
				}
			}
		});

		this.addCommand({
			id: 'toggle-pause',
			name: 'Toggle pause',
			callback: () => {
				const leaf = this.app.workspace.getLeavesOfType(PET_VIEW_TYPE)[0];
				if (leaf) {
					const petView = leaf.view as PetView;
					petView.togglePause();
				}
			}
		});

		this.addCommand({
			id: 'reset-pets',
			name: 'Reset pets',
			callback: () => {
				const leaf = this.app.workspace.getLeavesOfType(PET_VIEW_TYPE)[0];
				if (leaf) {
					const petView = leaf.view as PetView;
					petView.clearAllPets();
				}
			}
		});

		this.addCommand({
			id: 'throw-with-mouse',
			name: 'Toggle throw ball with mouse',
			callback: async () => {
				this.settings.throwBallWithMouse = !this.settings.throwBallWithMouse;
				await this.saveSettings();

				const leaf = this.app.workspace.getLeavesOfType(PET_VIEW_TYPE)[0];
				if (leaf) {
					const petView = leaf.view as PetView;
					petView.setThrowWithMouse(this.settings.throwBallWithMouse);
				}

				new Notice(`Throw ball with mouse: ${this.settings.throwBallWithMouse ? 'enabled' : 'disabled'}`);
			}
		});

		this.addCommand({
			id: 'delete-pet',
			name: 'Delete a pet',
			callback: () => {
				const leaf = this.app.workspace.getLeavesOfType(PET_VIEW_TYPE)[0];
				if (leaf) {
					const petView = leaf.view as PetView;
					petView.openRemovePetModal();
				} else {
					new Notice('Please open the pet view first');
				}
			}
		});

		// This adds a settings tab so the user can configure various aspects of the plugin
		this.addSettingTab(new PetSettingTab(this.app, this));
	}

	// This function is responsible for opening the view
	async activateView() {
		// First, we detach any existing leaves of our view type
		this.app.workspace.detachLeavesOfType(PET_VIEW_TYPE);

		// Then, we get a new leaf in the right sidebar
		const leaf = this.app.workspace.getRightLeaf(false);
		if (leaf) {
			await leaf.setViewState({
				type: PET_VIEW_TYPE,
				active: true,
			});

			// Finally, we reveal the leaf to make it visible
			void this.app.workspace.revealLeaf(leaf);
		}
	}

	async respawnPet() {
		const leaf = this.app.workspace.getLeavesOfType(PET_VIEW_TYPE)[0];
		if (leaf) {
			const petView = leaf.view as PetView;
			await petView.spawnPet(this.settings.petType, this.settings.petColor, this.settings.petSize as PetSize, `${this.settings.petColor} ${this.settings.petType}`);
		}
	}

	onunload() {
		// Cleanup is handled automatically by Obsidian
		// Views will be reinitialized at their original position on plugin update
	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData() as Partial<PetPluginSettings>);
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}


// in main.ts, at the bottom

class PetSettingTab extends PluginSettingTab {
	plugin: VaultPetsPlugin;

	constructor(app: App, plugin: VaultPetsPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const { containerEl } = this;

		containerEl.empty();

		new Setting(containerEl)
			.setName('Obsidian pets')
			.setHeading();

		new Setting(containerEl)
			.setName('Pet type')
			.setDesc('Choose your pet!')
			.addDropdown(dropdown => dropdown
				.addOption('chicken', 'Chicken')
				.addOption('clippy', 'Clippy')
				.addOption('cockatiel', 'Cockatiel')
				.addOption('crab', 'Crab')
				.addOption('deno', 'Deno')
				.addOption('dog', 'Dog')
				.addOption('fox', 'Fox')
				.addOption('horse', 'Horse')
				.addOption('mod', 'Mod')
				.addOption('morph', 'Morph')
				.addOption('panda', 'Panda')
				.addOption('rat', 'Rat')
				.addOption('rocky', 'Rocky')
				.addOption('rubber-duck', 'Rubber duck')
				.addOption('skeleton', 'Skeleton')
				.addOption('snail', 'Snail')
				.addOption('snake', 'Snake')
				.addOption('totoro', 'Totoro')
				.addOption('turtle', 'Turtle')
				.addOption('zappy', 'Zappy')
				.setValue(this.plugin.settings.petType)
				.onChange(async (value) => {
					this.plugin.settings.petType = value;
					// Validate and update color if needed
					this.plugin.settings.petColor = getValidColorForPet(value, this.plugin.settings.petColor);
					await this.plugin.saveSettings();
					// Refresh the settings display to update available colors
					this.display();
					const leaf = this.app.workspace.getLeavesOfType(PET_VIEW_TYPE)[0];
					if (leaf) {
						const petView = leaf.view as PetView;
						void petView.resetAndSpawnPet(this.plugin.settings.petType, this.plugin.settings.petColor, this.plugin.settings.petSize as PetSize);
					}
				}));

		// Build color dropdown dynamically based on available colors for current pet
		const petAvailableColors = availableColors(this.plugin.settings.petType as PetType);
		const availableColorStrings = petAvailableColors.map(c => c.toString());
		const colorMapping: Record<string, string> = {
			'brown': 'Brown',
			'lightbrown': 'Light brown',
			'black': 'Black',
			'red': 'Red',
			'green': 'Green',
			'yellow': 'Yellow',
			'gray': 'Gray',
			'white': 'White',
			'orange': 'Orange',
			'pink': 'Pink',
			'blue': 'Blue',
			'purple': 'Purple',
			'akita': 'Akita',
			'socksblack': 'Socks black',
			'socksbeige': 'Socks beige',
			'socksbrown': 'Socks brown',
			'paintbeige': 'Paint beige',
			'paintblack': 'Paint black',
			'paintbrown': 'Paint brown',
			'magical': 'Magical',
			'warrior': 'Warrior'
		};

		new Setting(containerEl)
			.setName('Pet color')
			.setDesc('Choose the color of your pet.')
			.addDropdown(dropdown => {
				// Add only available colors for current pet type
				availableColorStrings.forEach(color => {
					dropdown.addOption(color, colorMapping[color] || color);
				});
				return dropdown
					.setValue(this.plugin.settings.petColor)
					.onChange(async (value) => {
						this.plugin.settings.petColor = value;
						await this.plugin.saveSettings();
						const leaf = this.app.workspace.getLeavesOfType(PET_VIEW_TYPE)[0];
						if (leaf) {
							const petView = leaf.view as PetView;
							void petView.resetAndSpawnPet(this.plugin.settings.petType, this.plugin.settings.petColor, this.plugin.settings.petSize as PetSize);
						}
					});
			});

		new Setting(containerEl)
			.setName('Pet size')
			.setDesc('Choose the size of your pets.')
			.addDropdown(dropdown => dropdown
				.addOption('nano', 'Nano')
				.addOption('small', 'Small')
				.addOption('medium', 'Medium')
				.addOption('large', 'Large')
				.setValue(this.plugin.settings.petSize)
				.onChange(async (value) => {
					this.plugin.settings.petSize = value;
					await this.plugin.saveSettings();

					// Respawn the pet with the new size
					const leaf = this.app.workspace.getLeavesOfType(PET_VIEW_TYPE)[0];
					if (leaf) {
						const petView = leaf.view as PetView;
						void petView.resetAndSpawnPet(this.plugin.settings.petType, this.plugin.settings.petColor, this.plugin.settings.petSize as PetSize);
					}
				}));

		new Setting(containerEl)
			.setName('Theme')
			.setDesc('Choose a background theme for your pets.')
			.addDropdown(dropdown => dropdown
				.addOption('none', 'None')
				.addOption('castle', 'Castle')
				.addOption('forest', 'Forest')
				.addOption('beach', 'Beach')
				.addOption('winter', 'Winter')
				.addOption('autumn', 'Autumn')
				.setValue(this.plugin.settings.theme)
				.onChange(async (value) => {
					this.plugin.settings.theme = value;
					await this.plugin.saveSettings();

					// Tell the view to update its theme
					const leaf = this.app.workspace.getLeavesOfType(PET_VIEW_TYPE)[0];
					if (leaf) {
						const petView = leaf.view as PetView;
						petView.applyTheme(this.plugin.settings.theme);
					}
				}));

		new Setting(containerEl)
			.setName('Visual effect')
			.setDesc('Choose a visual effect to display (snow, stars, or leaves).')
			.addDropdown(dropdown => dropdown
				.addOption('none', 'None')
				.addOption('snow', 'Snow')
				.addOption('stars', 'Stars')
				.addOption('leaves', 'Leaves')
				.setValue(this.plugin.settings.effect)
				.onChange(async (value) => {
					this.plugin.settings.effect = value;
					await this.plugin.saveSettings();

					// Tell the view to update its effect
					const leaf = this.app.workspace.getLeavesOfType(PET_VIEW_TYPE)[0];
					if (leaf) {
						const petView = leaf.view as PetView;
						petView.setEffect(this.plugin.settings.effect);
					}
				}));

		new Setting(containerEl)
			.setName('Throw ball with mouse')
			.setDesc('Enable click-and-drag to throw balls for pets to chase.')
			.addToggle(toggle => toggle
				.setValue(this.plugin.settings.throwBallWithMouse)
				.onChange(async (value) => {
					this.plugin.settings.throwBallWithMouse = value;
					await this.plugin.saveSettings();

					const leaf = this.app.workspace.getLeavesOfType(PET_VIEW_TYPE)[0];
					if (leaf) {
						const petView = leaf.view as PetView;
						petView.setThrowWithMouse(value);
					}
				}));

		new Setting(containerEl)
			.setName('Disable effects')
			.setDesc('Disable all visual effects for better performance.')
			.addToggle(toggle => toggle
				.setValue(this.plugin.settings.disableEffects)
				.onChange(async (value) => {
					this.plugin.settings.disableEffects = value;
					await this.plugin.saveSettings();

					const leaf = this.app.workspace.getLeavesOfType(PET_VIEW_TYPE)[0];
					if (leaf) {
						const petView = leaf.view as PetView;
						petView.setDisableEffects(value);
					}
				}));

	}
}
