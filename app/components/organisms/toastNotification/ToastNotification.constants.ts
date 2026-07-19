import type { ToastConfig } from './ToastNotification.types';

export const toastConfig: ToastConfig = {
	duration: 5000, // time in milliseconds that each toast should remain visible
	labelI18nKey: 'organisms.toastNotification.label', // localized label, used to help screen reader users
	swipeThreshold: 50, // distance in pixels that the swipe must pass before a close is triggered
	hotkey: ['F8'] // The keys to use as the keyboard shortcut that will move focus to the toast viewport.
};
