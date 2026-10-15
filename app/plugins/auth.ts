import type { AuthState } from '~/types/auth.types';

const initState = (): AuthState => {
	return {
		user: undefined,
		isAuthenticated: false
	};
};

export default defineNuxtPlugin({
	name: 'auth',
	dependsOn: ['api-fetch'],
	parallel: true,
	setup() {
		const { $api } = useNuxtApp();

		const state = useState<AuthState>('auth', initState);

		const authenticate = async () => {
			try {
				const userProfile = await $api.profile.get();

				state.value.isAuthenticated = true;
				state.value.user = userProfile;
				return true;
			} catch (error) {
				console.error(error);
				return false;
			}
		};

		const signout = async () => {
			await $api.auth.signout();
			state.value = initState();
		};

		return {
			provide: {
				auth: {
					state,
					authenticate,
					signout
				}
			}
		};
	}
});
