import { AbilityBuilder, createMongoAbility, type CreateAbility } from '@casl/ability';
import type { User } from '~/domain/user/user.entity';
import { permissions } from './permissions';
import type { AppAbility } from './accessControl.types';

export const createAppAbility = createMongoAbility as CreateAbility<AppAbility>;

// Build the raw CASL rules for a given user. Unlike the backend, an unknown or undefined
// role does NOT throw: on the client an unauthenticated (anonymous) state is normal, so it
// simply yields an empty rule set (no abilities granted).
export function defineRulesForUser(user?: User) {
	const builder = new AbilityBuilder(createAppAbility);

	if (user && typeof permissions[user.role] === 'function') {
		permissions[user.role](user, builder);
	}

	return builder.rules;
}

export function defineAbilityForUser(user?: User): AppAbility {
	const rules = defineRulesForUser(user);

	const ability = createAppAbility(rules, {
		detectSubjectType: (subject) => subject.__typename
	});

	ability.can = ability.can.bind(ability);
	ability.cannot = ability.cannot.bind(ability);

	return ability;
}
