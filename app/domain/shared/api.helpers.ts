import type { ApiErrorCode, NormalizedApiError } from './api.types';

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
