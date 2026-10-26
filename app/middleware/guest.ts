import { COMPLETE_PROFILE_PATH, isIncompleteProfile } from '~/helpers/profile.helpers';

export default defineNuxtRouteMiddleware(async (to) => {
	const { $auth } = useNuxtApp();
	const localePath = useLocalePath();

	let isAuthenticated = $auth.state.value.isAuthenticated;
	if (!isAuthenticated) {
		isAuthenticated = await $auth.authenticate();
	}

	if (isAuthenticated && isIncompleteProfile($auth.state.value.user)) {
		return navigateTo(localePath(COMPLETE_PROFILE_PATH).toString());
	}

	if (isAuthenticated && to.path === localePath('/signin').toString()) {
		return navigateTo('/');
	}
});
