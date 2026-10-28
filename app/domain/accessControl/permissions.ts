import type { AbilityBuilder } from '@casl/ability';
import type { Role } from '~/domain/user/user.types';
import type { User } from '~/domain/user/user.entity';
import type { AppAbility } from './accessControl.types';

type PermissionsByRole = (user: User, builder: AbilityBuilder<AppAbility>) => void;

// Mirrors the backend `shared/accessControl/permissions.ts`. The frontend has no separate
// `id`; the profile `_id` maps to the backend `user.id` in ownership conditions.
export const permissions: Record<Role, PermissionsByRole> = {
	admin(user, { can, cannot }) {
		can('manage', 'all');
		// User management is admin-only. `manage all` already covers it, but this explicit
		// grant documents the intent and keeps `User` admin-only if `manage all` is ever narrowed.
		can('manage', 'User');
		// Admins can moderate and delete any comment/rating, but never edit someone else's.
		cannot('update', ['Comment', 'Rating'], { user_id: { $ne: user._id } });
	},
	partner(user, { can }) {
		can('manage', 'Category');
		can('manage', 'Unit');
		can('manage', 'Ingredient');
		can('manage', 'Drink');
		can(['create', 'list', 'get'], 'Comment');
		can(['create', 'list', 'get'], 'Rating');
		can(['update', 'delete'], 'Comment', { user_id: { $eq: user._id } });
		can(['update', 'delete'], 'Rating', { user_id: { $eq: user._id } });
	},
	member(user, { can }) {
		can(['list', 'get'], 'Category');
		can(['list', 'get'], 'Unit');
		can(['list', 'get'], 'Ingredient');
		can(['list', 'get'], 'Drink');
		can(['create', 'list', 'get'], 'Comment');
		can(['create', 'list', 'get'], 'Rating');
		can(['update', 'delete'], 'Comment', { user_id: { $eq: user._id } });
		can(['update', 'delete'], 'Rating', { user_id: { $eq: user._id } });
	}
};
