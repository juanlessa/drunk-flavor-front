import type { ApiErrorCodes } from './api.constants';

export type ApiErrorCode = (typeof ApiErrorCodes)[keyof typeof ApiErrorCodes];

/**
 * Status and error group extracted from an ofetch/Nuxt error.
 * `code` stays a plain string because the backend may add codes.
 */
export type NormalizedApiError = { status?: number; code?: string };

/**
 * One invalid field of a request, as listed in the `errors` of a validation error body. The same shape describes
 * the warnings of a generated method. `message` is already translated to the request locale.
 */
export type ApiFieldError = {
	/** Request part that failed validation. */
	location: 'body' | 'querystring' | 'params' | 'headers';
	/** Dot-separated path of the invalid field inside `location`; empty when the whole part is invalid. */
	path: string;
	localeKey: string;
	/** Values behind the message, so clients never parse the text for them. */
	params?: Readonly<Record<string, string | number>>;
	message: string;
};
