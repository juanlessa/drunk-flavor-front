import { describe, expect, it } from 'vitest';
import { changeUserRoleFormValidator, userAdministrationReasonFormValidator } from './user';

describe('user validations', () => {
	it('accepts a reason within the limits after trimming', () => {
		expect(userAdministrationReasonFormValidator({ reason: `  ${'a'.repeat(10)}  ` })).toEqual(
			[]
		);
	});

	it.each([
		['a'.repeat(9), 'errors.users.administrationReasonMinSize'],
		[`  ${'a'.repeat(9)}  `, 'errors.users.administrationReasonMinSize'],
		['a'.repeat(501), 'errors.users.administrationReasonMaxSize']
	])('rejects a reason outside the limits', (reason, message) => {
		expect(userAdministrationReasonFormValidator({ reason })).toEqual([
			{ field: 'reason', message }
		]);
	});

	it('accepts a non-owner role', () => {
		expect(changeUserRoleFormValidator({ role: 'partner' })).toEqual([]);
	});

	it.each(['', 'owner'])('rejects a role that is empty or owner', (role) => {
		expect(changeUserRoleFormValidator({ role } as never)).toEqual([
			{ field: 'role', message: 'errors.users.role' }
		]);
	});
});
