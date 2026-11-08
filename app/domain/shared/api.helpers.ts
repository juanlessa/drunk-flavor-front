import type { ApiErrorCode, ApiFieldError, NormalizedApiError } from './api.types';

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

const isFieldError = (value: unknown): value is ApiFieldError =>
	isRecord(value) && typeof value.path === 'string' && typeof value.localeKey === 'string';

/**
 * The invalid fields listed in the `errors` of an error body, in the order the API sent them. Empty when the
 * error carries none (an error that is not a validation error, or one that is not from the API at all).
 */
export const readApiFieldErrors = (error: unknown): ApiFieldError[] => {
	if (!isRecord(error)) return [];
	const response = error.response;
	const body =
		response !== undefined ? (isRecord(response) ? response._data : undefined) : error.data;
	if (!isRecord(body) || !Array.isArray(body.errors)) return [];
	return body.errors.filter(isFieldError);
};
