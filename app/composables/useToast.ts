import { nanoid } from 'nanoid';
import type { ICreateToast, Toast, ToastState } from '~/components/organisms/toastNotification/ToastNotification.types';

const initState = (): ToastState => ({
	maxToastsOnScreen: 7,
	displayingToasts: [],
	awaitingToasts: [],
	displayedToasts: []
});

export const useToast = () => {
	const state = useState<ToastState>('toastNotification', initState);

	const addToast = (toast: ICreateToast) => {
		const currentTimestamp = new Date();
		const id = nanoid();

		const maxToastsOnScreen = state.value.maxToastsOnScreen;
		const displayingToastsLength = state.value.displayingToasts.length;

		if (displayingToastsLength >= maxToastsOnScreen) {
			state.value.awaitingToasts.push({ ...toast, id, created_at: currentTimestamp });
		} else {
			state.value.displayingToasts = [
				{ ...toast, id, displayed_at: currentTimestamp, created_at: currentTimestamp },
				...state.value.displayingToasts
			];
		}
	};

	const removeToast = (toast: Toast) => {
		const remainingToasts = state.value.displayingToasts.filter((t) => t.id !== toast.id);

		const nextToast = state.value.awaitingToasts.shift();
		if (nextToast) {
			state.value.displayingToasts = [nextToast, ...remainingToasts];
		} else {
			state.value.displayingToasts = [...remainingToasts];
		}

		state.value.displayedToasts.push(toast);
	};

	return {
		state,
		addToast,
		removeToast
	};
};
