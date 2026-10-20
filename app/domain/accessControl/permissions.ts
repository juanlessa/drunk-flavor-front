import type { AbilityBuilder } from '@casl/ability';
import type { Role } from '~/domain/user/user.types';
import type { Profile } from '~/domain/profile/profile.entity';
import type { AppAbility } from './accessControl.types';

type PermissionsByRole = (user: Profile, builder: AbilityBuilder<AppAbility>) => void;

export const permissions: Record<Role, PermissionsByRole> = {
	admin(_, { can }) {
		can('manage', 'all');
		// User management is admin-only. `manage all` already covers it, but this explicit
		// grant documents the intent and keeps `User` admin-only if `manage all` is ever narrowed.
		can('manage', 'User');
	},
	partner(_, { can }) {
		can('manage', 'Category');
		can('manage', 'Ingredient');
		can('manage', 'Drink');
	},
	member(user, { can }) {
		can(['list', 'get'], 'Category');
		can(['list', 'get'], 'Ingredient');
		can(['list', 'get'], 'Drink');
		can(['create', 'list', 'get'], 'Comment');
		// Frontend has no separate `id`; the profile `_id` maps to the backend `user.id`.
		can(['update', 'delete'], 'Comment', { user_id: { $eq: user._id } });
	}
};
