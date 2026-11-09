/**
 * Stable, language-independent error groups returned by the API in the `code` field of every error body.
 * Mirrors the backend's append-only `ERROR_CODES` contract. Branch on these codes, never on `localeKey`
 * or `message`: the message is translated to the request locale and the locale key is an implementation detail.
 */
export const ApiErrorCodes = {
	validationFailed: 'VALIDATION_FAILED',
	badRequest: 'BAD_REQUEST',
	unauthorized: 'UNAUTHORIZED',
	forbidden: 'FORBIDDEN',
	notFound: 'NOT_FOUND',
	conflict: 'CONFLICT',
	tooManyRequests: 'TOO_MANY_REQUESTS',
	internalError: 'INTERNAL_ERROR',
	invalidCredentials: 'INVALID_CREDENTIALS',
	sessionRevoked: 'SESSION_REVOKED',
	recentAuthenticationRequired: 'RECENT_AUTHENTICATION_REQUIRED',
	profileIncomplete: 'PROFILE_INCOMPLETE',
	googleEmailNotVerified: 'GOOGLE_EMAIL_NOT_VERIFIED',
	accountLinkRequired: 'ACCOUNT_LINK_REQUIRED'
} as const;

/**
 * CSRF header the API requires on the endpoints that receive an authorization code from the Google popup,
 * as recommended by Google for the popup code flow. A cross-site form cannot set it, and the API's CORS
 * allowlist rejects the preflight a cross-origin script would need to send it.
 */
export const GOOGLE_CODE_REQUEST_HEADERS = { 'X-Requested-With': 'XmlHttpRequest' } as const;

/**
 * The HTTP QUERY method (RFC 10008): a safe, idempotent read whose input travels in the body. The fetch types
 * (h3) predate it and only list the older methods, while ofetch sends any method as written, so its type is
 * widened here once instead of at every call.
 */
export const HTTP_QUERY_METHOD = 'QUERY' as unknown as 'GET';
