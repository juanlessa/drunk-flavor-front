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
