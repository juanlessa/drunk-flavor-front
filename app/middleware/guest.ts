import { COMPLETE_PROFILE_PATH, isIncompleteProfile } from '~/helpers/profile.helpers';
import { isServerRuntime } from '~/helpers/runtime.helpers';

export default defineNuxtRouteMiddleware(async (to) => {
	const { $auth } = useNuxtApp();
	const localePath = useLocalePath();

	let isAuthenticated = $auth.state.value.isAuthenticated;
	// The session cookie belongs to the API host, so the Nuxt server never receives it and the call
	// would always fail. Public pages stay guest-only on the server (identical HTML and payload for
	// everyone); the browser resolves the real session when this middleware runs again there.
	if (!isAuthenticated && !isServerRuntime()) {
		isAuthenticated = await $auth.authenticate();
	}

	if (isAuthenticated && isIncompleteProfile($auth.state.value.user)) {
		return navigateTo(localePath(COMPLETE_PROFILE_PATH).toString());
	}

	if (isAuthenticated && to.path === localePath('/signin').toString()) {
		return navigateTo('/');
	}
});
