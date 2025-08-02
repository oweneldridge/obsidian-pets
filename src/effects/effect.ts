import { PetSize } from "../types";

/**
 * Base interface for all visual effects
 */
export interface Effect {
    /** Display name of the effect */
    name: string;

    /** Description of what the effect does */
    description: string;

    /**
     * Initialize the effect with canvas contexts and settings
     * @param foregroundCanvas - Canvas for particles rendered above pets
     * @param backgroundCanvas - Canvas for particles rendered behind pets
     * @param scale - Pet size to adjust particle parameters
     * @param floor - Floor position in pixels from bottom
     * @param isDarkTheme - Whether dark theme is active
     */
    init(
        foregroundCanvas: HTMLCanvasElement,
        backgroundCanvas: HTMLCanvasElement,
        scale: PetSize,
        floor: number,
        isDarkTheme: boolean
    ): void;

    /** Start the effect animation loop */
    enable(): void;

    /** Stop the effect and clear particles */
    disable(): void;

    /** Handle canvas resize events */
    handleResize(): void;
}
