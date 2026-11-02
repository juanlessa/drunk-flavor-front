import type { Component } from 'vue';

export type ActionMenuItemTone = 'default' | 'danger';

export type ActionMenuItem = {
	/** Emitted on `select`; unique within the menu. */
	key: string;
	label: string;
	icon?: Component;
	tone?: ActionMenuItemTone;
	disabled?: boolean;
};
