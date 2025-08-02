/**
 * Extended type definitions for Obsidian API types that aren't fully exposed
 * in the official type definitions.
 */

import { App, Plugin } from 'obsidian';

/**
 * Extended App interface with access to the plugins system
 */
export interface ObsidianApp extends App {
	plugins: {
		/** Map of plugin IDs to plugin instances */
		plugins: Record<string, Plugin>;
		/** Get a specific plugin by ID */
		getPlugin(id: string): Plugin | undefined;
	};
}

/**
 * Type guard to check if an App instance has the plugins property
 */
export function isObsidianApp(app: App): app is ObsidianApp {
	return 'plugins' in app &&
	       typeof (app as any).plugins === 'object' &&
	       'plugins' in (app as any).plugins;
}

/**
 * Safely get a plugin from the Obsidian app
 */
export function getPlugin<T extends Plugin = Plugin>(app: App, pluginId: string): T | undefined {
	if (!isObsidianApp(app)) {
		return undefined;
	}
	return app.plugins.plugins[pluginId] as T | undefined;
}
