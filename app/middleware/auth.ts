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

	// Keep the requested page (e.g. an ownership-transfer link from an email) so sign-in can return to it.
	// The sign-in page only follows same-origin paths.
	if (!isAuthenticated) {
		return navigateTo({
			path: localePath('/signin').toString(),
			query: { redirect: to.fullPath }
		});
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
			return navigateTo(localePath('/').toString());
		}
	}
});
