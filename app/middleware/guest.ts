export default defineNuxtRouteMiddleware(async (to) => {
	const { $auth } = useNuxtApp();
	const localePath = useLocalePath();

	let isAuthenticated = $auth.state.value.isAuthenticated;

	if (!isAuthenticated) {
		isAuthenticated = await $auth.authenticate();
	}

	if (isAuthenticated && to.path === localePath('/signin').toString()) {
		return navigateTo('/');
	}
});
