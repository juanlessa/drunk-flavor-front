export default defineNuxtRouteMiddleware(async () => {
	const { $auth } = useNuxtApp();

	let isAuthenticated = $auth.state.value.isAuthenticated;

	if (!isAuthenticated) {
		isAuthenticated = await $auth.authenticate();
	}

	if (!isAuthenticated) {
		return navigateTo('/');
	}
});
