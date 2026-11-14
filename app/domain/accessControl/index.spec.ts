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

	describe.each(['Category', 'Unit', 'Ingredient', 'Drink'] as const)(
		'a partner over %s',
		(subject) => {
			const partner = () =>
				defineAbilityForUser(buildProfile({ id: 'partner-1', role: 'partner' }));
			const own = { __typename: subject, createdBy: 'partner-1' };
			const foreign = { __typename: subject, createdBy: 'someone-else' };
			const withoutCreator = { __typename: subject };

			it('creates, lists and gets, with or without authorship', () => {
				const ability = partner();
				for (const action of [
					'create',
					'list',
					'listWithAuthorship',
					'get',
					'getWithAuthorship'
				] as const) {
					expect(ability.can(action, subject)).toBe(true);
				}
			});

			it('updates and deletes what they created', () => {
				const ability = partner();
				expect(ability.can('update', own)).toBe(true);
				expect(ability.can('delete', own)).toBe(true);
			});

			it('does not update or delete what someone else created', () => {
				const ability = partner();
				expect(ability.can('update', foreign)).toBe(false);
				expect(ability.can('delete', foreign)).toBe(false);
			});

			it('does not update or delete what has no creator, because that account was closed', () => {
				const ability = partner();
				expect(ability.can('update', withoutCreator)).toBe(false);
				expect(ability.can('delete', withoutCreator)).toBe(false);
			});

			it('passes the check by type alone, so the page can open and the record decides', () => {
				const ability = partner();
				expect(ability.can('update', subject)).toBe(true);
				expect(ability.can('delete', subject)).toBe(true);
			});

			it('has no blanket manage over it', () => {
				expect(partner().can('manage', subject)).toBe(false);
			});
		}
	);

	it('does not give a partner the User subject', () => {
		const ability = defineAbilityForUser(buildProfile({ role: 'partner' }));
		expect(ability.can('manage', 'User')).toBe(false);
		expect(ability.can('list', 'User')).toBe(false);
	});

	it.each(['owner', 'admin'] as const)(
		'lets %s change any catalog record, whoever created it',
		(role) => {
			const ability = defineAbilityForUser(buildProfile({ id: 'admin-1', role }));
			for (const subject of ['Category', 'Unit', 'Ingredient', 'Drink'] as const) {
				expect(
					ability.can('update', { __typename: subject, createdBy: 'someone-else' })
				).toBe(true);
				expect(ability.can('delete', { __typename: subject })).toBe(true);
				expect(ability.can('listWithAuthorship', subject)).toBe(true);
				expect(ability.can('getWithAuthorship', subject)).toBe(true);
			}
		}
	);

	it('does not give a member the reads with authorship', () => {
		const ability = defineAbilityForUser(buildProfile({ role: 'member' }));
		for (const subject of ['Category', 'Unit', 'Ingredient', 'Drink'] as const) {
			expect(ability.can('listWithAuthorship', subject)).toBe(false);
			expect(ability.can('getWithAuthorship', subject)).toBe(false);
			expect(ability.can('update', { __typename: subject, createdBy: 'member-1' })).toBe(
				false
			);
		}
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

	it.each(['member', 'partner', 'admin', 'owner'] as const)(
		'lets %s add, list and remove their favorites',
		(role) => {
			const ability = defineAbilityForUser(buildProfile({ role }));
			expect(ability.can('create', 'Favorite')).toBe(true);
			expect(ability.can('list', 'Favorite')).toBe(true);
			expect(ability.can('delete', 'Favorite')).toBe(true);
		}
	);
	it('grants no favorites to an anonymous (undefined) user', () => {
		const ability = defineAbilityForUser(undefined);
		expect(ability.can('create', 'Favorite')).toBe(false);
		expect(ability.can('list', 'Favorite')).toBe(false);
	});
	it('grants no abilities for an anonymous (undefined) user', () => {
		const ability = defineAbilityForUser(undefined);

		expect(ability.can('list', 'Drink')).toBe(false);
		expect(ability.can('manage', 'all')).toBe(false);
		expect(ability.can('get', 'Category')).toBe(false);
	});
});
