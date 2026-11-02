/**
 * Minimal typings for the subset of Google Identity Services (GIS) used by the app:
 * the OAuth 2.0 authorization code model in popup mode.
 * Reference: https://developers.google.com/identity/oauth2/web/reference/js-reference
 */
export type GoogleCodeResponse = {
	/** Authorization code to send to the backend, which exchanges it with the client secret. */
	code?: string;
	scope?: string;
	/** OAuth error code, for example `access_denied` when the user declines consent. */
	error?: string;
	error_description?: string;
};

export type GoogleCodeClientError = {
	type: 'popup_failed_to_open' | 'popup_closed' | 'unknown';
};

export type GoogleCodeClientConfig = {
	client_id: string;
	scope: string;
	ux_mode: 'popup';
	callback: (response: GoogleCodeResponse) => void;
	error_callback?: (error: GoogleCodeClientError) => void;
	/** Asks the user to pick an account even when only one Google session exists. */
	select_account?: boolean;
	/** Email of the expected account; skips the account chooser when it matches a session. */
	login_hint?: string;
};

export type GoogleCodeClient = {
	/** Opens the popup. Must run synchronously inside the click handler, or browsers block it. */
	requestCode: () => void;
};

export type GoogleAccountsOAuth2 = {
	initCodeClient: (config: GoogleCodeClientConfig) => GoogleCodeClient;
};

declare global {
	interface Window {
		google?: {
			accounts: {
				oauth2: GoogleAccountsOAuth2;
			};
		};
	}
}
