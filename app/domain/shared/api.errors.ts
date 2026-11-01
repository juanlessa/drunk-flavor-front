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

export type ApiErrorCode = (typeof ApiErrorCodes)[keyof typeof ApiErrorCodes];

/**
 * Status and error group extracted from an ofetch/Nuxt error.
 * `code` stays a plain string because the backend may add codes.
 */
export type NormalizedApiError = { status?: number; code?: string };

const isRecord = (value: unknown): value is Record<string, unknown> =>
	typeof value === 'object' && value !== null && !Array.isArray(value);

const normalizeEnvelope = (status: unknown, data: unknown): NormalizedApiError => ({
	...(typeof status === 'number' ? { status } : {}),
	...(isRecord(data) && typeof data.code === 'string' ? { code: data.code } : {})
});

/**
 * Reads the error from the response envelope (`response.status` / `response._data`) when present,
 * otherwise from the flattened fields (`statusCode` / `data`). The two sources are never mixed.
 */
export const normalizeApiError = (error: unknown): NormalizedApiError => {
	if (!isRecord(error)) return {};

	const response = error.response;
	if (response !== undefined) {
		if (!isRecord(response)) return {};
		return normalizeEnvelope(response.status, response._data);
	}

	return normalizeEnvelope(error.statusCode, error.data);
};

export const readApiErrorCode = (error: unknown): string | undefined =>
	normalizeApiError(error).code;

export const hasApiErrorCode = (error: unknown, code: ApiErrorCode): boolean =>
	readApiErrorCode(error) === code;
