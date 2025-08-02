/**
 * Application-wide constants for the Vault Pets plugin
 */

/** Plugin identifier used for registration with Obsidian */
export const PLUGIN_ID = 'vault-pets';

/** Maximum number of balls allowed in the view simultaneously */
export const MAX_BALLS = 10;

/** Maximum number of pets allowed in the view simultaneously */
export const MAX_PETS = 20;

/** Maximum lifetime of a ball in milliseconds before automatic cleanup */
export const BALL_MAX_LIFETIME_MS = 60000; // 1 minute

/** Animation frame rate target in milliseconds */
export const ANIMATION_FRAME_MS = 16.67; // ~60 FPS

/** Default pet size if not specified */
export const DEFAULT_PET_SIZE = 'nano';

/** Default pet type if not specified */
export const DEFAULT_PET_TYPE = 'dog';

/** Default pet color if not specified */
export const DEFAULT_PET_COLOR = 'brown';

/** Default theme if not specified */
export const DEFAULT_THEME = 'none';
