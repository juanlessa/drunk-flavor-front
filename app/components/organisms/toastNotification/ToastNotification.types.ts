export type Toast = {
	id: string;
	type: 'error' | 'info' | 'success';
	title: string;
	message: string;
	duration?: number;
	createdAt: Date;
	displayedAt?: Date;
};

export type ICreateToast = {
	title: string;
	message: string;
	type: 'error' | 'info' | 'success';
};

export type ToastState = {
	maxToastsOnScreen: number;
	displayingToasts: Toast[];
	awaitingToasts: Toast[];
	displayedToasts: Toast[];
};

export type ToastConfig = {
	duration: number;
	labelI18nKey: string;
	swipeThreshold: number;
	hotkey: string[];
};
