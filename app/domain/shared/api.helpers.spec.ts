import { describe, expect, it } from 'vitest';
import { ApiErrorCodes } from './api.constants';
import { hasApiErrorCode, normalizeApiError, readApiErrorCode } from './api.helpers';

const recentCode = ApiErrorCodes.recentAuthenticationRequired;

describe('normalizeApiError', () => {
	it('reads a complete response envelope', () => {
		expect(
			normalizeApiError({ response: { status: 401, _data: { code: recentCode } } })
		).toEqual({ status: 401, code: recentCode });
	});

	it('uses fallback fields only when response is undefined', () => {
		expect(normalizeApiError({ statusCode: 401, data: { code: recentCode } })).toEqual({
			status: 401,
			code: recentCode
		});
	});

	it.each([
		{ response: {}, statusCode: 401, data: { code: recentCode } },
		{ response: null, statusCode: 401, data: { code: recentCode } },
		{ response: [], statusCode: 401, data: { code: recentCode } },
		{ response: { status: 401 }, data: { code: recentCode } }
	])('never reads the fallback body when a response envelope exists', (error) => {
		expect(normalizeApiError(error).code).toBeUndefined();
	});

	it('ignores the localized locale key and message', () => {
		expect(
			normalizeApiError({
				response: {
					status: 401,
					_data: {
						localeKey: 'apiResponses.auth.sessionRevoked',
						message: 'Sessão revogada'
					}
				}
			})
		).toEqual({ status: 401 });
	});

	it.each([42, null, 'error', { response: { _data: { code: 123 } } }])(
		'returns no code for malformed errors',
		(error) => {
			expect(readApiErrorCode(error)).toBeUndefined();
		}
	);
});

describe('hasApiErrorCode', () => {
	it('matches the error group regardless of the response language', () => {
		expect(
			hasApiErrorCode(
				{ data: { code: ApiErrorCodes.profileIncomplete, message: 'Perfil incompleto' } },
				ApiErrorCodes.profileIncomplete
			)
		).toBe(true);
	});

	it('does not match a different group', () => {
		expect(
			hasApiErrorCode(
				{ data: { code: ApiErrorCodes.unauthorized } },
				ApiErrorCodes.sessionRevoked
			)
		).toBe(false);
	});
});
