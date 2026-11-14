import type { AbilityBuilder } from '@casl/ability';
import type { Role } from '~/domain/user/user.types';
import type { User } from '~/domain/user/user.entity';
import type { AppAbility } from './accessControl.types';

type PermissionsByRole = (user: User, builder: AbilityBuilder<AppAbility>) => void;

/** Every subject of the catalog. */
const CATALOG_SUBJECTS = ['Category', 'Unit', 'Ingredient', 'Drink'] as const;

const defineAdministratorPermissions: PermissionsByRole = (user, { can, cannot }) => {
	can('manage', 'all');
	can('manage', 'User');
	cannot('update', ['Comment', 'Rating'], { userId: { $ne: user.id } });
};

export const permissions: Record<Role, PermissionsByRole> = {
	owner: defineAdministratorPermissions,
	admin: defineAdministratorPermissions,
	partner(user, { can }) {
		// A partner contributes to the whole catalog but changes only what they created. The check by type
		// alone ("may update a Drink?") passes; the check of a record tells whether it is theirs.
		for (const subject of CATALOG_SUBJECTS) {
			can(['create', 'list', 'listWithAuthorship', 'get', 'getWithAuthorship'], subject);
			can(['update', 'delete'], subject, { createdBy: { $eq: user.id } });
		}
		can(['create', 'list', 'get'], 'Comment');
		can(['create', 'list', 'get'], 'Rating');
		// A favorite is always the person's own (the routes are under `/me`), so there is no record to check.
		can(['create', 'list', 'delete'], 'Favorite');
		can(['update', 'delete'], 'Comment', { userId: { $eq: user.id } });
		can(['update', 'delete'], 'Rating', { userId: { $eq: user.id } });
	},
	member(user, { can }) {
		can(['list', 'get'], 'Category');
		can(['list', 'get'], 'Unit');
		can(['list', 'get'], 'Ingredient');
		can(['list', 'get'], 'Drink');
		can(['create', 'list', 'get'], 'Comment');
		can(['create', 'list', 'get'], 'Rating');
		can(['create', 'list', 'delete'], 'Favorite');
		can(['update', 'delete'], 'Comment', { userId: { $eq: user.id } });
		can(['update', 'delete'], 'Rating', { userId: { $eq: user.id } });
	}
};
