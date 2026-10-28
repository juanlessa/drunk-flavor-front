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
		const isHistoire = useRuntimeConfig().public.histoire;
		const { $api } = useNuxtApp();

		const state = useState<AuthState>('auth', initState);

		const authenticate = async () => {
			if (isHistoire) return false;
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

		const clear = () => {
			state.value = initState();
		};

		const signout = async () => {
			if (!isHistoire) await $api.auth.signout();
			clear();
		};

		return {
			provide: {
				auth: {
					state,
					authenticate,
					clear,
					signout
				}
			}
		};
	}
});
