/**
 * Minimal typings for the subset of Google Identity Services (GIS) used by the app.
 * Reference: https://developers.google.com/identity/gsi/web/reference/js-reference
 */

export type GoogleCredentialResponse = {
	/** The Google ID token (JWT) to send to the backend. */
	credential: string;
	select_by?: string;
};

export type GoogleIdConfiguration = {
	client_id: string;
	callback: (response: GoogleCredentialResponse) => void;
	ux_mode?: 'popup' | 'redirect';
	context?: 'signin' | 'signup' | 'use';
	/** Use the browser-mediated FedCM button flow on supported Chrome versions. */
	use_fedcm_for_button?: boolean;
	itp_support?: boolean;
};

export type GoogleButtonConfiguration = {
	type?: 'standard' | 'icon';
	theme?: 'outline' | 'filled_blue' | 'filled_black';
	size?: 'small' | 'medium' | 'large';
	text?: 'signin_with' | 'signup_with' | 'continue_with' | 'signin';
	shape?: 'rectangular' | 'pill' | 'circle' | 'square';
	logo_alignment?: 'left' | 'center';
	/** Minimum button width in pixels; Google caps it at 400. */
	width?: string;
	locale?: string;
};

export type GoogleAccountsId = {
	initialize: (config: GoogleIdConfiguration) => void;
	renderButton: (parent: HTMLElement, options: GoogleButtonConfiguration) => void;
};

declare global {
	interface Window {
		google?: {
			accounts: {
				id: GoogleAccountsId;
			};
		};
	}
}
