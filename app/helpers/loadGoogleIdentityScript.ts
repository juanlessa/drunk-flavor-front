import type { GoogleAccountsId } from '~/types/googleIdentity.types';

export const GOOGLE_IDENTITY_SCRIPT_URL = 'https://accounts.google.com/gsi/client';

const SCRIPT_ID = 'google-identity-services';

let loadedLanguage: string | null = null;
let loadingLanguage: string | null = null;
let loadingPromise: Promise<GoogleAccountsId> | null = null;

const removeLoadedLibrary = () => {
	document.getElementById(SCRIPT_ID)?.remove();
	delete window.google;
	loadedLanguage = null;
};

/**
 * Loads the Google Identity Services client library and resolves with `google.accounts.id`.
 *
 * GIS only honors the button `locale` when the library itself is loaded with the matching
 * `hl` query parameter, and that language is fixed for the lifetime of the loaded script.
 * So the library is cached per language: asking for a different language removes the
 * current script and loads it again with the new `hl`. Callers must re-run `initialize`
 * and `renderButton` on the returned instance. A failed load is not cached.
 */
export const loadGoogleIdentityScript = (language: string): Promise<GoogleAccountsId> => {
	if (loadedLanguage === language && window.google?.accounts?.id) {
		return Promise.resolve(window.google.accounts.id);
	}

	if (loadingPromise && loadingLanguage === language) {
		return loadingPromise;
	}

	removeLoadedLibrary();
	loadingLanguage = language;

	const promise = new Promise<GoogleAccountsId>((resolve, reject) => {
		const script = document.createElement('script');
		script.id = SCRIPT_ID;
		script.src = `${GOOGLE_IDENTITY_SCRIPT_URL}?hl=${encodeURIComponent(language)}`;
		script.async = true;
		script.defer = true;

		script.onload = () => {
			const accountsId = window.google?.accounts?.id;
			if (accountsId) {
				loadedLanguage = language;
				resolve(accountsId);
				return;
			}
			reject(new Error('Google Identity Services loaded without google.accounts.id'));
		};

		script.onerror = () => {
			script.remove();
			reject(new Error('Failed to load Google Identity Services'));
		};

		document.head.appendChild(script);
	});

	loadingPromise = promise;
	const clearIfCurrent = () => {
		if (loadingPromise === promise) {
			loadingPromise = null;
			loadingLanguage = null;
		}
	};
	promise.then(clearIfCurrent, clearIfCurrent);

	return promise;
};
