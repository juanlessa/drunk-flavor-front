import { defineAbilityForUser } from '~/domain/accessControl';
import type { AppCanParameters } from '~/domain/accessControl/accessControl.types';

export default defineNuxtRouteMiddleware(async (to) => {
	const { $auth } = useNuxtApp();

	let isAuthenticated = $auth.state.value.isAuthenticated;

	if (!isAuthenticated) {
		isAuthenticated = await $auth.authenticate();
	}

	if (!isAuthenticated) {
		return navigateTo('/');
	}

	const can = to.meta.can;

	if (can) {
		const ability = defineAbilityForUser($auth.state.value.user);

		if (ability.cannot(...([can.action, can.subject] as AppCanParameters))) {
			return navigateTo('/');
		}
	}
});
