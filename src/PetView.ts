import { ItemView, WorkspaceLeaf, setIcon } from "obsidian";
import { BasePetType } from "./pet";
import { createPet, getRandomName } from './pets-factory';
import { Ball } from "./ball";
import { PetSize, PetType, PetColor } from "./types";
import { PetSuggestModal } from "./PetSuggestModal";
import { RemovePetModal } from "./RemovePetModal";
import { ThemeSuggestModal } from "./ThemeSuggestModal";
import { EffectSuggestModal } from "./EffectSuggestModal";
import { THEME_FLOOR_MAP } from './themes';
import { PLUGIN_ID, MAX_BALLS, MAX_PETS } from './constants';
import { getPlugin } from './obsidian-types';
import { Effect } from './effects/effect';
import { SnowEffect } from './effects/snow';
import { StarEffect } from './effects/stars';
import { LeafEffect } from './effects/leaves';

export const PET_VIEW_TYPE = "pet-view";

/**
 * Main view for displaying and managing pets in Obsidian
 */
export class PetView extends ItemView {
	private pets: BasePetType[] = [];
	private balls: Ball[] = [];
	private animationFrameId: number;
	private backgroundCanvas?: HTMLCanvasElement;
	private foregroundCanvas?: HTMLCanvasElement;
	private currentEffect?: Effect;
	private throwWithMouse: boolean = true;
	private effectsDisabled: boolean = false;
	private isPaused: boolean = false;
	private _mouseDownHandler?: (e: MouseEvent) => void;
	private _mouseUpHandler?: (e: MouseEvent) => void;

	constructor(leaf: WorkspaceLeaf) {
		super(leaf);
	}

	getViewType() { return PET_VIEW_TYPE; }
	getDisplayText() { return "Pet View"; }
	getIcon() { return "dog"; }

	private gameLoop = () => {
		// Skip updates if paused
		if (!this.isPaused) {
			const viewWidth = this.contentEl.offsetWidth;
			const viewHeight = this.contentEl.offsetHeight;

			// Update containerWidth for all pets in case viewport was resized
			this.pets.forEach(pet => {
				pet.containerWidth = viewWidth;
			});

			const plugin = getPlugin(this.app, PLUGIN_ID);
			if (!plugin) return;

			const theme = (plugin as any).settings.theme;
			const petSize = (plugin as any).settings.petSize as PetSize;
			const floorPercentString = THEME_FLOOR_MAP[theme]?.[petSize] ?? '0%';
			const floorPercent = parseFloat(floorPercentString);
			const floorY = viewHeight - (viewHeight * (floorPercent / 100));

			// Track which balls were caught to remove them
			const ballsToRemove: Ball[] = [];

			this.pets.forEach(pet => {
				// If there are balls, check if pet should chase them
				if (this.balls.length > 0) {
					for (const ball of this.balls) {
						const event = pet.update(viewWidth, viewHeight, floorY, ball);
						if (event === 'caught_ball') {
							ballsToRemove.push(ball);
							break; // Pet caught a ball, stop checking other balls for this pet
						}
					}
				} else {
					// No balls present, update pet with null to allow normal walking behavior
					pet.update(viewWidth, viewHeight, floorY, null);
				}
			});

			// Remove caught balls
			ballsToRemove.forEach(ball => {
				ball.remove();
				this.balls = this.balls.filter(b => b !== ball);
			});

			// Update all remaining balls and remove off-screen or expired ones
			this.balls = this.balls.filter(ball => {
				// Check if ball has expired
				if (ball.isExpired()) {
					ball.remove();
					return false;
				}

				// Check if ball is still in bounds
				const stillInBounds = ball.update(viewHeight, viewWidth, floorY);
				if (!stillInBounds) {
					ball.remove();
				}
				return stillInBounds;
			});

			// Seek new friends
			this.seekNewFriends();
		}

		this.animationFrameId = window.requestAnimationFrame(this.gameLoop);
	};


	/**
	 * Get all pets currently in the view
	 */
	getPets(): BasePetType[] {
		return this.pets;
	}

	/**
	 * Remove a specific pet by its ID
	 * @param petId - Unique identifier of the pet to remove
	 */
	async removePetById(petId: number) {
		const petToRemove = this.pets.find(p => p.id === petId);
		if (petToRemove) {
			petToRemove.el.remove();
			this.pets = this.pets.filter(p => p.id !== petId);
			// Save pets after removal
			await this.savePetsToSettings();
		}
	}

	/**
	 * Spawn a new pet in the view
	 * @param type - Type of pet (dog, cat, etc.)
	 * @param color - Color of the pet
	 * @param size - Size of the pet
	 * @param name - Name to display for the pet
	 * @returns true if pet was spawned, false if max limit reached
	 */
	async spawnPet(type: string, color: string, size: PetSize, name: string): Promise<boolean> {
		// Check if we've reached the maximum number of pets
		if (this.pets.length >= MAX_PETS) {
			console.warn(`Maximum number of pets (${MAX_PETS}) reached`);
			return false;
		}

		const plugin = getPlugin(this.app, PLUGIN_ID);
		if (!plugin) return false;

		const theme = (plugin as any).settings.theme;
		const floor = THEME_FLOOR_MAP[theme]?.[size] ?? '0%';
		const randomLeft = this.randomStartPosition();

		// Use factory to create pet with proper typing
		const newPet = createPet(
			this.app,
			type as PetType,
			color as PetColor,
			size,
			name,
			floor,
			randomLeft
		);

		if (!newPet) {
			console.error(`Failed to create pet of type ${type}`);
			return false;
		}

		this.pets.push(newPet);

		// Set container width for boundary detection
		newPet.containerWidth = this.contentEl.offsetWidth;

		newPet.spawn(this.contentEl);

		// Add mouseover event listener for swipe interaction
		this.setupSwipeInteraction(newPet);

		// Save pets after spawning
		await this.savePetsToSettings();
		return true;
	}

	/**
	 * Remove all pets and spawn a new one with default settings
	 * @param type - Type of pet to spawn
	 * @param color - Color of the pet
	 * @param size - Size of the pet
	 */
	async resetAndSpawnPet(type: string, color: string, size: PetSize) {
		this.clearAllPets();
		const randomName = getRandomName(type as PetType);
		await this.spawnPet(type, color, size, randomName);
	}

	/**
	 * Remove all pets from the view
	 */
	clearAllPets() {
		if (this.animationFrameId) {
			window.cancelAnimationFrame(this.animationFrameId);
		}
		this.pets.forEach(pet => {
			if (pet.el) pet.el.remove();
		});
		this.pets = [];
		this.animationFrameId = window.requestAnimationFrame(this.gameLoop);
	}

	/**
	 * Throw a new ball into the view for pets to chase
	 * @returns true if ball was thrown, false if max limit reached
	 */
	throwBall(): boolean {
		// Check if we've reached the maximum number of balls
		if (this.balls.length >= MAX_BALLS) {
			// Remove the oldest ball to make room for the new one
			const oldestBall = this.balls.shift();
			if (oldestBall) {
				oldestBall.remove();
			}
		}

		const plugin = getPlugin(this.app, PLUGIN_ID);
		if (!plugin) return false;

		const petSize = (plugin as any).settings.petSize as PetSize;
		const newBall = new Ball(this.app, this.contentEl.offsetWidth / 2, this.contentEl.offsetHeight / 2, petSize);
		this.balls.push(newBall);
		newBall.spawn(this.contentEl);
		return true;
	}

	/**
	 * Open the modal to select and remove a pet
	 */
	openRemovePetModal() {
		new RemovePetModal(this.app, this).open();
	}

	/**
	 * Save current pets to plugin settings with enhanced state persistence
	 */
	async savePetsToSettings() {
		const plugin = getPlugin(this.app, PLUGIN_ID);
		if (!plugin) return;

		const savedPets = this.pets.map(pet => ({
			type: pet.petType,
			color: pet.petColor,
			size: pet.petSize,
			name: pet.name,
			// Enhanced state: friend relationships and positions
			friend: pet.friend?.name,
			left: pet.left,
			bottom: pet.bottom
		}));

		(plugin as any).settings.savedPets = savedPets;
		await (plugin as any).saveSettings();
	}

	/**
	 * Load pets from plugin settings with enhanced state restoration
	 */
	async loadPetsFromSettings() {
		const plugin = getPlugin(this.app, PLUGIN_ID);
		if (!plugin) return;

		const savedPets = (plugin as any).settings.savedPets || [];

		// Clear existing pets first
		this.pets.forEach(pet => {
			if (pet.el) pet.el.remove();
		});
		this.pets = [];

		// Map to track pets by name for friend recovery
		const petsByName = new Map<string, BasePetType>();

		// First pass: Spawn each saved pet
		for (const saved of savedPets) {
			const theme = (plugin as any).settings.theme;
			const petSize = saved.size as PetSize;
			const floor = THEME_FLOOR_MAP[theme]?.[petSize] ?? '0%';
			const left = saved.left ?? 100; // Use saved position or default

			// Use factory to create pet with proper typing
			const newPet = createPet(
				this.app,
				saved.type as PetType,
				saved.color as PetColor,
				petSize,
				saved.name,
				floor,
				left
			);

			if (!newPet) {
				console.error(`Failed to restore pet of type ${saved.type}`);
				continue;
			}

			this.pets.push(newPet);
			petsByName.set(newPet.name, newPet);

			// Set container width for boundary detection
			newPet.containerWidth = this.contentEl.offsetWidth;

			newPet.spawn(this.contentEl);

			// Add mouseover event listener for swipe interaction
			this.setupSwipeInteraction(newPet);
		}

		// Second pass: Restore friend relationships
		for (let i = 0; i < savedPets.length; i++) {
			const saved = savedPets[i];
			if (saved.friend) {
				const pet = this.pets[i];
				const friendPet = petsByName.get(saved.friend);
				if (pet && friendPet) {
					pet.recoverFriend(friendPet);
				}
			}
		}
	}

	/**
	 * Apply a theme to the view background
	 * @param theme - Theme name (none, castle, forest, beach, winter)
	 */
	applyTheme(theme: string) {
		this.contentEl.style.backgroundImage = '';
		this.contentEl.removeClass('pet-view-with-theme');

		// Remove any existing foreground layer
		const existingForeground = this.contentEl.querySelector('.pet-view-foreground-layer');
		if (existingForeground) {
			existingForeground.remove();
		}

		if (theme !== 'none') {
			const isDarkMode = document.body.classList.contains('theme-dark');
			const themeKind = isDarkMode ? 'dark' : 'light';

			const viewWidth = this.contentEl.offsetWidth;
			let size: PetSize;
			if (viewWidth < 300) { size = PetSize.nano; }
			else if (viewWidth < 500) { size = PetSize.small; }
			else if (viewWidth < 800) { size = PetSize.medium; }
			else { size = PetSize.large; }

			const backgroundUrl = this.app.vault.adapter.getResourcePath(
				`${(this.app as any).plugins.plugins['vault-pets'].app.vault.configDir}/plugins/vault-pets/media/backgrounds/${theme}/background-${themeKind}-${size}.png`
			);

			this.contentEl.addClass('pet-view-with-theme');
			this.contentEl.style.backgroundImage = `url('${backgroundUrl}')`;

			// Add theme-aware foreground layer for depth
			const foregroundUrl = this.app.vault.adapter.getResourcePath(
				`${(this.app as any).plugins.plugins['vault-pets'].app.vault.configDir}/plugins/vault-pets/media/backgrounds/${theme}/foreground-${themeKind}-${size}.png`
			);

			const foregroundLayer = this.contentEl.createDiv({
				cls: 'pet-view-foreground-layer'
			});
			foregroundLayer.style.backgroundImage = `url('${foregroundUrl}')`;
		}

		// Update the floor position for all existing pets without recreating them
		this.pets.forEach(pet => {
			const newFloor = THEME_FLOOR_MAP[theme]?.[pet.petSize as PetSize] ?? '0%';
			pet.setFloor(newFloor);
		});
	}

	/**
	 * Initialize canvas elements for effects
	 */
	private initializeCanvases() {
		// Background canvas (for stars)
		this.backgroundCanvas = this.contentEl.createEl('canvas', {
			cls: 'pet-view-background-canvas'
		});
		this.backgroundCanvas.width = this.contentEl.offsetWidth;
		this.backgroundCanvas.height = this.contentEl.offsetHeight;

		// Foreground canvas (for snow and leaves)
		this.foregroundCanvas = this.contentEl.createEl('canvas', {
			cls: 'pet-view-foreground-canvas'
		});
		this.foregroundCanvas.width = this.contentEl.offsetWidth;
		this.foregroundCanvas.height = this.contentEl.offsetHeight;
	}

	/**
	 * Set the visual effect (snow, stars, leaves, or none)
	 */
	setEffect(effectType: string) {
		console.log(`🎨 setEffect called with: ${effectType}`);

		// Disable current effect if any
		if (this.currentEffect) {
			console.log(`🛑 Disabling current effect: ${this.currentEffect.name}`);
			this.currentEffect.disable();
			this.currentEffect = undefined;
		}

		// Clear canvases when switching effects (always clear to remove old effect residue)
		console.log('🧹 Clearing both canvases');
		if (this.foregroundCanvas) {
			const ctx = this.foregroundCanvas.getContext('2d');
			if (ctx) {
				ctx.clearRect(0, 0, this.foregroundCanvas.width, this.foregroundCanvas.height);
				console.log(`✅ Cleared foreground canvas (${this.foregroundCanvas.width}x${this.foregroundCanvas.height})`);
			}
		}
		if (this.backgroundCanvas) {
			const ctx = this.backgroundCanvas.getContext('2d');
			if (ctx) {
				ctx.clearRect(0, 0, this.backgroundCanvas.width, this.backgroundCanvas.height);
				console.log(`✅ Cleared background canvas (${this.backgroundCanvas.width}x${this.backgroundCanvas.height})`);
			}
		}

		// Return early if switching to 'none'
		if (effectType === 'none') {
			console.log('⛔ Effect set to none, returning early');
			return;
		}

		// Don't enable effects if they are disabled
		if (this.effectsDisabled) {
			return;
		}

		if (!this.foregroundCanvas || !this.backgroundCanvas) {
			return;
		}

		const plugin = getPlugin(this.app, PLUGIN_ID);
		if (!plugin) return;

		const petSize = (plugin as any).settings.petSize as PetSize;
		const theme = (plugin as any).settings.theme;
		const floorPercentString = THEME_FLOOR_MAP[theme]?.[petSize] ?? '0%';
		const floorPercent = parseFloat(floorPercentString);
		const viewHeight = this.contentEl.offsetHeight;
		const floorPixels = (viewHeight * (floorPercent / 100));

		const isDarkTheme = document.body.classList.contains('theme-dark');

		// Create the appropriate effect
		let effect: Effect | undefined;
		switch (effectType) {
			case 'snow':
				effect = new SnowEffect();
				break;
			case 'stars':
				effect = new StarEffect();
				break;
			case 'leaves':
				effect = new LeafEffect();
				break;
		}

		if (effect) {
			effect.init(
				this.foregroundCanvas,
				this.backgroundCanvas,
				petSize,
				floorPixels,
				isDarkTheme
			);
			effect.enable();
			this.currentEffect = effect;
		}
	}

	/**
	 * Enable or disable mouse-based ball throwing
	 * @param enabled - Whether to enable mouse throwing
	 */
	setThrowWithMouse(enabled: boolean) {
		this.throwWithMouse = enabled;

		if (enabled) {
			this.enableMouseThrow();
		} else {
			this.disableMouseThrow();
		}
	}

	/**
	 * Enable mouse-based ball throwing with click-and-drag
	 */
	private enableMouseThrow() {
		let startX = 0;
		let startY = 0;
		let isDragging = false;

		const handleMouseDown = (e: MouseEvent) => {
			if (this.balls.length >= MAX_BALLS) {
				// Remove oldest ball to make room
				const oldestBall = this.balls.shift();
				if (oldestBall) {
					oldestBall.remove();
				}
			}

			const rect = this.contentEl.getBoundingClientRect();
			startX = e.clientX - rect.left;
			startY = e.clientY - rect.top;
			isDragging = true;
		};

		const handleMouseUp = (e: MouseEvent) => {
			if (!isDragging) return;
			isDragging = false;

			const rect = this.contentEl.getBoundingClientRect();
			const endX = e.clientX - rect.left;
			const endY = e.clientY - rect.top;

			// Calculate velocity from drag distance (reduced multiplier for smoother control)
			const velocityX = (endX - startX) * 0.15;
			const velocityY = (endY - startY) * 0.15;

			const plugin = getPlugin(this.app, PLUGIN_ID);
			if (!plugin) return;

			const petSize = (plugin as any).settings.petSize as PetSize;
			const newBall = new Ball(this.app, startX, startY, petSize, velocityX, velocityY);
			this.balls.push(newBall);
			newBall.spawn(this.contentEl);
		};

		this.contentEl.addEventListener('mousedown', handleMouseDown);
		this.contentEl.addEventListener('mouseup', handleMouseUp);

		// Store handlers so we can remove them later
		this._mouseDownHandler = handleMouseDown;
		this._mouseUpHandler = handleMouseUp;
	}

	/**
	 * Disable mouse-based ball throwing
	 */
	private disableMouseThrow() {
		if (this._mouseDownHandler) {
			this.contentEl.removeEventListener('mousedown', this._mouseDownHandler);
			this.contentEl.removeEventListener('mouseup', this._mouseUpHandler!);
			this._mouseDownHandler = undefined;
			this._mouseUpHandler = undefined;
		}
	}

	/**
	 * Enable or disable visual effects
	 * @param disabled - Whether to disable effects
	 */
	setDisableEffects(disabled: boolean) {
		this.effectsDisabled = disabled;

		if (disabled && this.currentEffect) {
			// Disable and clear current effect
			this.currentEffect.disable();
			this.currentEffect = undefined;

			// Clear canvases
			if (this.foregroundCanvas) {
				const ctx = this.foregroundCanvas.getContext('2d');
				if (ctx) {
					ctx.clearRect(0, 0, this.foregroundCanvas.width, this.foregroundCanvas.height);
				}
			}
			if (this.backgroundCanvas) {
				const ctx = this.backgroundCanvas.getContext('2d');
				if (ctx) {
					ctx.clearRect(0, 0, this.backgroundCanvas.width, this.backgroundCanvas.height);
				}
			}
		}
	}

	/**
	 * Make all pets show their speech bubbles (roll call)
	 */
	rollCall() {
		this.pets.forEach((pet, index) => {
			// Stagger the speech bubbles slightly so they don't all appear at once
			setTimeout(() => {
				pet.showSpeechBubble(`${pet.name}!`, 3000);
			}, index * 500);
		});
	}

	/**
	 * Generate a random starting position for a new pet
	 * Ensures pets don't spawn too close to edges
	 * @returns Random x position in pixels
	 */
	private randomStartPosition(): number {
		// Use 70% of container width to avoid edges
		const safeWidth = this.contentEl.offsetWidth * 0.7;
		return Math.floor(Math.random() * safeWidth);
	}

	/**
	 * Setup swipe interaction on mouseover for a pet
	 * @param pet - Pet to setup swipe interaction for
	 */
	private setupSwipeInteraction(pet: BasePetType): void {
		// Add mouseover event to collision element
		const handleMouseOver = () => {
			if (pet.canSwipe) {
				pet.swipe();
			}
		};

		pet.collision.addEventListener('mouseover', handleMouseOver);
	}

	/**
	 * Setup window resize handler to update canvas and pet positions
	 */
	private setupResizeHandler(): void {
		const handleResize = () => {
			// Update canvas dimensions
			if (this.backgroundCanvas) {
				this.backgroundCanvas.width = this.contentEl.offsetWidth;
				this.backgroundCanvas.height = this.contentEl.offsetHeight;
			}
			if (this.foregroundCanvas) {
				this.foregroundCanvas.width = this.contentEl.offsetWidth;
				this.foregroundCanvas.height = this.contentEl.offsetHeight;
			}

			// Update container width for all pets
			this.pets.forEach(pet => {
				pet.containerWidth = this.contentEl.offsetWidth;
			});

			// If current effect is active, handle resize
			if (this.currentEffect) {
				this.currentEffect.handleResize();
			}

			// Reapply theme to update background/foreground for new size
			const plugin = getPlugin(this.app, PLUGIN_ID);
			if (plugin) {
				const theme = (plugin as any).settings.theme;
				if (theme) {
					this.applyTheme(theme);
				}
			}
		};

		window.addEventListener('resize', handleResize);
	}

	/**
	 * Seek new friends for pets that don't have friends yet
	 * When pets are near each other, they can become friends
	 */
	private seekNewFriends(): void {
		if (this.pets.length <= 1) {
			return; // Can't be friends with yourself
		}

		// Find pets without friends
		const friendless = this.pets.filter(pet => !pet.hasFriend);
		if (friendless.length <= 1) {
			return; // Nobody to be friends with
		}

		// Try to match friendless pets
		friendless.forEach(lonelyPet => {
			const potentialFriends = friendless.filter(pet => pet !== lonelyPet);

			potentialFriends.forEach(potentialFriend => {
				// Check if potential friend is available (not chasing ball)
				if (!potentialFriend.canChase) {
					return;
				}

				// Check if pets are close to each other (overlapping horizontally)
				const lonelyLeft = lonelyPet.left;
				const friendLeft = potentialFriend.left;
				const lonelyWidth = lonelyPet.width;

				if (friendLeft > lonelyLeft && friendLeft < lonelyLeft + lonelyWidth) {
					// Pets are near each other, make friends!
					if (lonelyPet.makeFriendsWith(potentialFriend)) {
						// Show heart speech bubbles
						potentialFriend.showSpeechBubble('❤️', 2000);
						lonelyPet.showSpeechBubble('❤️', 2000);
					}
				}
			});
		});
	}

	/**
	 * Toggle animation pause state
	 */
	togglePause() {
		this.isPaused = !this.isPaused;
	}

	async onOpen() {
		this.addAction('circle', 'Throw ball', () => this.throwBall());
		this.addAction('plus', 'Add a new pet', () => new PetSuggestModal(this.app, this).open());
		this.addAction('minus', 'Remove a pet', () => new RemovePetModal(this.app, this).open());
		this.addAction('palette', 'Change theme', () => new ThemeSuggestModal(this.app, this).open());
		this.addAction('sparkles', 'Change effect', () => new EffectSuggestModal(this.app, this).open());

		this.contentEl.empty();
		this.contentEl.addClass('pet-view-content');

		// Initialize canvas elements for effects
		this.initializeCanvases();

		const buttonContainer = this.contentEl.createDiv({ cls: 'pet-view-button-container' });

		const removeButton = buttonContainer.createEl('button', { cls: 'pet-view-action-button' });
		removeButton.setAttribute('aria-label', 'Remove a pet');
		setIcon(removeButton, 'minus');
		removeButton.addEventListener('click', () => new RemovePetModal(this.app, this).open());

		const throwBallButton = buttonContainer.createEl('button', { cls: 'pet-view-action-button' });
		throwBallButton.setAttribute('aria-label', 'Throw ball');
		setIcon(throwBallButton, 'circle');
		throwBallButton.addEventListener('click', () => this.throwBall());

		const addButton = buttonContainer.createEl('button', { cls: 'pet-view-action-button' });
		addButton.setAttribute('aria-label', 'Add a new pet');
		setIcon(addButton, 'plus');
		addButton.addEventListener('click', () => new PetSuggestModal(this.app, this).open());

		const themeButton = buttonContainer.createEl('button', { cls: 'pet-view-action-button' });
		themeButton.setAttribute('aria-label', 'Change theme');
		setIcon(themeButton, 'palette');
		themeButton.addEventListener('click', () => new ThemeSuggestModal(this.app, this).open());

		const effectButton = buttonContainer.createEl('button', { cls: 'pet-view-action-button' });
		effectButton.setAttribute('aria-label', 'Change effect');
		setIcon(effectButton, 'sparkles');
		effectButton.addEventListener('click', () => new EffectSuggestModal(this.app, this).open());

		const plugin = (this.app as any).plugins.plugins['vault-pets'];
		if (plugin) {
			this.applyTheme(plugin.settings.theme);

			// Initialize throwWithMouse and effectsDisabled from settings
			this.setThrowWithMouse(plugin.settings.throwBallWithMouse ?? true);
			this.effectsDisabled = plugin.settings.disableEffects ?? false;

			// Load saved pets from settings
			await this.loadPetsFromSettings();

			// If no pets were saved, spawn a default pet
			if (this.pets.length === 0) {
				const randomName = getRandomName(plugin.settings.petType as PetType);
				await this.spawnPet(plugin.settings.petType, plugin.settings.petColor, plugin.settings.petSize as PetSize, randomName);
			}

			// Initialize effect from settings (only if effects are not disabled)
			if (!this.effectsDisabled && plugin.settings.effect && plugin.settings.effect !== 'none') {
				this.setEffect(plugin.settings.effect);
			}

			// Setup resize handler
			this.setupResizeHandler();
		}

		this.animationFrameId = window.requestAnimationFrame(this.gameLoop);
	}

	async onClose() {
		// Save pets before closing
		await this.savePetsToSettings();

		// Disable effect
		if (this.currentEffect) {
			this.currentEffect.disable();
			this.currentEffect = undefined;
		}

		if (this.animationFrameId) {
			window.cancelAnimationFrame(this.animationFrameId);
		}
		// Clean up all balls
		this.balls.forEach(ball => ball.remove());
		this.balls = [];
	}
}
