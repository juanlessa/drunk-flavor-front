import { isIncompleteProfile } from '~/helpers/profile.helpers';

/**
 * Guards the complete-profile page. Run after `auth`, which already guarantees an
 * authenticated user. An account whose profile is already complete has nothing to do
 * there, so it is sent home.
 */
export default defineNuxtRouteMiddleware(() => {
	const { $auth } = useNuxtApp();

	if (!isIncompleteProfile($auth.state.value.user)) {
		return navigateTo('/');
	}
});
