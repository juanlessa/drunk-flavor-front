type ICreateToast = {
	title: string;
	message: string;
	type: 'error' | 'info' | 'success';
};
type Toast = {
	id: string;
	type: 'error' | 'info' | 'success';
	title: string;
	message: string;
	created_at: Date;
	displayed_at?: Date;
};

type ToastState = {
	maxToastsOnScreen: number;
	displayingToasts: Toast[];
	awaitingToasts: Toast[];
	displayedToasts: Toast[];
};

function generateId() {
	return `alert-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
}

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

		const id = generateId();

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
