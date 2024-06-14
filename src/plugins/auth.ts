import type { AuthState } from '~/types/authentication';

const initState = (): AuthState => {
	return {
		user: undefined,
		isAuthenticated: false
	};
};

export default defineNuxtPlugin(() => {
	const state = useState<AuthState>('auth', initState);

	const authenticate = async () => {
		const { $api } = useNuxtApp();
		try {
			const userProfile = await $api.users.me();

			state.value.isAuthenticated = true;
			state.value.user = userProfile;
			return true;
		} catch (error) {
			console.error(error);
			return false;
		}
	};

	return {
		provide: {
			auth: {
				state,
				authenticate
			}
		}
	};
});
