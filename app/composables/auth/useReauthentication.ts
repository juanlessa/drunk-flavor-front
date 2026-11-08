import { ApiErrorCodes } from '~/domain/shared/api.constants';
import { hasApiErrorCode } from '~/domain/shared/api.helpers';

type SensitiveAction = () => Promise<void>;

/**
 * Runs an action protected by the backend's recent-authentication window.
 * When the backend answers with RECENT_AUTHENTICATION_REQUIRED, the action is kept pending
 * until the user reauthenticates (`confirm`) or gives up (`cancel`). The retry happens once:
 * a second challenge or any other failure propagates to the caller.
 *
 * Retrying is safe because the backend rejects the challenge before running the operation.
 */
export const useReauthentication = () => {
	const isRequired = ref(false);
	let pendingAction: SensitiveAction | undefined;

	const run = async (action: SensitiveAction) => {
		try {
			await action();
		} catch (error) {
			if (!hasApiErrorCode(error, ApiErrorCodes.recentAuthenticationRequired)) throw error;
			pendingAction = action;
			isRequired.value = true;
		}
	};

	const confirm = async () => {
		const action = pendingAction;
		pendingAction = undefined;
		isRequired.value = false;
		if (action) await action();
	};

	const cancel = () => {
		pendingAction = undefined;
		isRequired.value = false;
	};

	return { isRequired, run, confirm, cancel };
};
