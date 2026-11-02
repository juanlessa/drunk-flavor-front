import { describe, it, expect } from 'vitest';
import type { CompleteUser } from '~/domain/user/user.entity';
import { defineAbilityForUser } from './index';

const buildProfile = (overrides: Partial<CompleteUser>): CompleteUser => ({
	id: 'user-1',
	createdAt: new Date(),
	updatedAt: new Date(),
	name: 'Test',
	surname: 'User',
	email: 'test@example.com',
	emailVerified: true,
	status: 'active',
	role: 'member',
	...overrides
});

describe('defineAbilityForUser', () => {
	it.each(['owner', 'admin'] as const)('grants %s manage on all subjects and User', (role) => {
		const ability = defineAbilityForUser(buildProfile({ role }));

		expect(ability.can('manage', 'all')).toBe(true);
		expect(ability.can('manage', 'User')).toBe(true);
		expect(ability.can('delete', 'Drink')).toBe(true);
	});

	it('grants partner manage on Category, Ingredient and Drink but not User', () => {
		const ability = defineAbilityForUser(buildProfile({ role: 'partner' }));

		expect(ability.can('manage', 'Category')).toBe(true);
		expect(ability.can('manage', 'Ingredient')).toBe(true);
		expect(ability.can('manage', 'Drink')).toBe(true);
		expect(ability.can('manage', 'User')).toBe(false);
	});

	it('grants member read-only access to catalog subjects', () => {
		const ability = defineAbilityForUser(buildProfile({ role: 'member' }));

		expect(ability.can('list', 'Category')).toBe(true);
		expect(ability.can('get', 'Ingredient')).toBe(true);
		expect(ability.can('list', 'Drink')).toBe(true);
		expect(ability.can('manage', 'Drink')).toBe(false);
		expect(ability.can('create', 'Drink')).toBe(false);
	});

	it('grants member create/list/get on Comment', () => {
		const ability = defineAbilityForUser(buildProfile({ role: 'member' }));

		expect(ability.can('create', 'Comment')).toBe(true);
		expect(ability.can('list', 'Comment')).toBe(true);
		expect(ability.can('get', 'Comment')).toBe(true);
	});

	it('lets a member update/delete only their own Comment', () => {
		const ability = defineAbilityForUser(buildProfile({ id: 'owner-1', role: 'member' }));

		const ownComment = { __typename: 'Comment' as const, userId: 'owner-1' };
		const otherComment = { __typename: 'Comment' as const, userId: 'owner-2' };

		expect(ability.can('update', ownComment)).toBe(true);
		expect(ability.can('delete', ownComment)).toBe(true);
		expect(ability.can('update', otherComment)).toBe(false);
		expect(ability.can('delete', otherComment)).toBe(false);
	});

	it('grants no abilities for an anonymous (undefined) user', () => {
		const ability = defineAbilityForUser(undefined);

		expect(ability.can('list', 'Drink')).toBe(false);
		expect(ability.can('manage', 'all')).toBe(false);
		expect(ability.can('get', 'Category')).toBe(false);
	});
});
