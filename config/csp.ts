export const GOOGLE_IDENTITY_ORIGIN_PATH = 'https://accounts.google.com/gsi/';
export const GOOGLE_AVATAR_IMAGE_ORIGIN = 'https://*.googleusercontent.com';

type CspOrigins = { apiBase: string; imageHost: string };

/**
 * Production CSP directives that depend on the public origins. Shared by the build-time security
 * options and the server plugin that applies the real origins when the server starts.
 */
export const buildOriginCspDirectives = ({ apiBase, imageHost }: CspOrigins) => ({
	'img-src': ["'self'", 'data:', 'blob:', imageHost, GOOGLE_AVATAR_IMAGE_ORIGIN],
	// The Google Identity Services client library calls its own endpoints under /gsi/.
	'connect-src': ["'self'", apiBase, GOOGLE_IDENTITY_ORIGIN_PATH]
});
