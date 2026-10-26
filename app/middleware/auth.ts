import { defineAbilityForUser } from '~/domain/accessControl';
import type { AppCanParameters } from '~/domain/accessControl/accessControl.types';
import { COMPLETE_PROFILE_PATH, isIncompleteProfile } from '~/helpers/profile.helpers';

export default defineNuxtRouteMiddleware(async (to) => {
	const { $auth } = useNuxtApp();
	const localePath = useLocalePath();

	let isAuthenticated = $auth.state.value.isAuthenticated;
	if (!isAuthenticated) {
		isAuthenticated = await $auth.authenticate();
	}

	if (!isAuthenticated) {
		return navigateTo('/');
	}

	// An incomplete account must add its name before reaching any other page.
	const completeProfilePath = localePath(COMPLETE_PROFILE_PATH).toString();
	if (isIncompleteProfile($auth.state.value.user) && to.path !== completeProfilePath) {
		return navigateTo(completeProfilePath);
	}

	const can = to.meta.can;
	if (can) {
		const ability = defineAbilityForUser($auth.state.value.user);
		if (ability.cannot(...([can.action, can.subject] as AppCanParameters))) {
			return navigateTo('/');
		}
	}
});
