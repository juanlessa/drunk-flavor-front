import type { ApiErrorCodes } from './api.constants';

export type ApiErrorCode = (typeof ApiErrorCodes)[keyof typeof ApiErrorCodes];

/**
 * Status and error group extracted from an ofetch/Nuxt error.
 * `code` stays a plain string because the backend may add codes.
 */
export type NormalizedApiError = { status?: number; code?: string };
