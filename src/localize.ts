import { moment, requestUrl } from 'obsidian';

// Localization translations loaded from l10n files
let translations: Record<string, string> = {};
let currentLocale = 'en';

// Supported locales (26 languages from vscode-pets)
const SUPPORTED_LOCALES = [
	'ar', 'cs', 'da', 'de', 'en', 'es', 'fr', 'hi', 'hu', 'id',
	'it', 'ja', 'ko', 'nl', 'pl', 'pt-br', 'pt', 'ro', 'ru',
	'sv', 'th', 'tr', 'uk', 'zh-cn', 'zh-tw'
];

/**
 * Initialize localization by loading translations for the current locale
 */
export async function initializeLocale(): Promise<void> {
	// Get current locale from Obsidian's moment instance
	currentLocale = moment.locale();

	// Normalize locale (e.g., 'en-US' -> 'en', 'zh-CN' -> 'zh-cn')
	let normalizedLocale = currentLocale.toLowerCase().split('-')[0];

	// Special handling for Chinese variants and Portuguese
	if (currentLocale.toLowerCase() === 'zh-cn') {
		normalizedLocale = 'zh-cn';
	} else if (currentLocale.toLowerCase() === 'zh-tw') {
		normalizedLocale = 'zh-tw';
	} else if (currentLocale.toLowerCase().startsWith('pt-br')) {
		normalizedLocale = 'pt-br';
	} else if (currentLocale.toLowerCase().startsWith('pt')) {
		normalizedLocale = 'pt';
	}

	// Use English as fallback if locale not supported
	if (!SUPPORTED_LOCALES.includes(normalizedLocale)) {
		normalizedLocale = 'en';
	}

	// Load translations
	try {
		const response = await requestUrl(`l10n/bundle.l10n.${normalizedLocale}.json`);
		if (response.status === 200) {
			translations = response.json as Record<string, string>;
		} else {
			// Fallback to English
			const fallbackResponse = await requestUrl('l10n/bundle.l10n.en.json');
			translations = fallbackResponse.json as Record<string, string>;
		}
	} catch (error) {
		console.error('Failed to load localization files:', error);
		// Use empty translations as final fallback
		translations = {};
	}
}

/**
 * Translate a key to the current locale
 * @param key - Translation key to look up
 * @returns Translated string, or the key itself if translation not found
 */
export function t(key: string): string {
	return translations[key] || key;
}

/**
 * Get current locale
 */
export function getLocale(): string {
	return currentLocale;
}

/**
 * Get list of supported locales
 */
export function getSupportedLocales(): string[] {
	return SUPPORTED_LOCALES;
}
