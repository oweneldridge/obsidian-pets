import { App } from "obsidian";
import { PetSize } from "./types";
import { BALL_MAX_LIFETIME_MS } from "./constants";

/**
 * Represents a throwable ball that pets can chase and catch
 */
export class Ball {
	el: HTMLElement;
	app: App;
	position: { x: number; y: number };
	private velocity: { x: number; y: number };
	private readonly createdAt: number;
	paused: boolean = false; // Flag to indicate if ball has been caught

	constructor(app: App, startX: number, startY: number, petSize: PetSize, velocityX?: number, velocityY?: number) {
		this.app = app;
		this.position = { x: startX, y: startY };
		// Use provided velocity or generate random velocity
		this.velocity = {
			x: velocityX !== undefined ? velocityX : (Math.random() * 10) - 5,
			y: velocityY !== undefined ? velocityY : -10
		};
		this.createdAt = Date.now();

		// Ball radius values match vscode-pets
		const radius = {
			[PetSize.nano]: 2,
			[PetSize.small]: 3,
			[PetSize.medium]: 4,
			[PetSize.large]: 8,
		}[petSize];
		const size = radius * 2; // Diameter for width/height

		this.el = document.createElement('div');
		this.el.addClass('pet-ball');
		// Dynamic sizing based on pet size
		this.el.style.width = `${size}px`;
		this.el.style.height = `${size}px`;
	}

	/**
	 * Add the ball element to the DOM container
	 */
	spawn(container: HTMLElement) {
		container.appendChild(this.el);
		this.updatePosition();
	}

	/**
	 * Check if the ball has exceeded its maximum lifetime
	 * @returns true if the ball should be removed due to age
	 */
	isExpired(): boolean {
		return Date.now() - this.createdAt > BALL_MAX_LIFETIME_MS;
	}

	private updatePosition() {
		this.el.style.left = `${this.position.x}px`;
		this.el.style.top = `${this.position.y}px`;
	}

	/**
	 * Update ball physics and position
	 * @param viewHeight - Height of the viewport
	 * @param viewWidth - Width of the viewport
	 * @param floorY - Y-coordinate of the floor (theme-dependent)
	 * @returns true if ball is still in bounds, false if off-screen
	 */
	update(viewHeight: number, viewWidth: number, floorY: number): boolean {
		// Gravity
		this.velocity.y += 0.5;

		this.position.x += this.velocity.x;
		this.position.y += this.velocity.y;

		const size = parseInt(this.el.style.width);

		// --- THIS IS THE FIX ---
		// Bounce off the theme's floor instead of the absolute bottom of the view
		if (this.position.y > floorY - size) {
			this.position.y = floorY - size;
			this.velocity.y *= -0.7; // Lose some energy on bounce
		}

		// Bounce off walls
		if (this.position.x < 0 || this.position.x > viewWidth - size) {
			this.velocity.x *= -1;
		}

		// Check if ball went off-screen (fell below the view)
		if (this.position.y > viewHeight + size) {
			return false; // Ball is off-screen
		}

		this.updatePosition();
		return true; // Ball is still in bounds
	}

	/**
	 * Remove the ball element from the DOM
	 */
	remove() {
		if (this.el) {
			this.el.remove();
		}
	}
}
