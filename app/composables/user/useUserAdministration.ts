import type { UserAdministrativeCapabilityAction } from '~/domain/user/user.types';

/**
 * Loads a user together with the administrative actions the current actor may perform on them.
 * The backend computes the capabilities for this actor and target, so the UI only reads them.
 */
export const useUserAdministration = (userId: string) => {
	const { $api } = useNuxtApp();

	const { data, status, error, refresh } = useAsyncData(
		`userAdministration:${userId}`,
		async () => {
			const [user, capabilities] = await Promise.all([
				$api.users.get(userId),
				$api.users.getAdministrativeCapabilities(userId)
			]);
			return { user, capabilities };
		},
		{ server: false, lazy: true }
	);

	const user = computed(() => data.value?.user);
	const capabilities = computed(() => data.value?.capabilities);
	const isLoading = computed(() => status.value === 'pending' && !data.value);
	const hasError = computed(() => !!error.value && !data.value);

	const can = (action: UserAdministrativeCapabilityAction) =>
		!!capabilities.value?.actions.includes(action);

	return { user, capabilities, isLoading, hasError, can, refresh };
};
