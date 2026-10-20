import { describe, it, expect } from 'vitest';
import type { Profile } from '~/domain/profile/profile.entity';
import { defineAbilityForUser } from './index';

const buildProfile = (overrides: Partial<Profile>): Profile => ({
	_id: 'user-1',
	created_at: new Date(),
	updated_at: new Date(),
	name: 'Test',
	surname: 'User',
	email: 'test@example.com',
	role: 'member',
	...overrides
});

describe('defineAbilityForUser', () => {
	it('grants admin manage on all subjects and User', () => {
		const ability = defineAbilityForUser(buildProfile({ role: 'admin' }));

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
		const ability = defineAbilityForUser(buildProfile({ _id: 'owner-1', role: 'member' }));

		const ownComment = { __typename: 'Comment' as const, user_id: 'owner-1' };
		const otherComment = { __typename: 'Comment' as const, user_id: 'owner-2' };

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
