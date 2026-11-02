import type { AbilityBuilder } from '@casl/ability';
import type { Role } from '~/domain/user/user.types';
import type { User } from '~/domain/user/user.entity';
import type { AppAbility } from './accessControl.types';

type PermissionsByRole = (user: User, builder: AbilityBuilder<AppAbility>) => void;

const defineAdministratorPermissions: PermissionsByRole = (user, { can, cannot }) => {
	can('manage', 'all');
	can('manage', 'User');
	cannot('update', ['Comment', 'Rating'], { userId: { $ne: user.id } });
};

export const permissions: Record<Role, PermissionsByRole> = {
	owner: defineAdministratorPermissions,
	admin: defineAdministratorPermissions,
	partner(user, { can }) {
		can('manage', 'Category');
		can('manage', 'Unit');
		can('manage', 'Ingredient');
		can('manage', 'Drink');
		can(['create', 'list', 'get'], 'Comment');
		can(['create', 'list', 'get'], 'Rating');
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
		can(['update', 'delete'], 'Comment', { userId: { $eq: user.id } });
		can(['update', 'delete'], 'Rating', { userId: { $eq: user.id } });
	}
};
