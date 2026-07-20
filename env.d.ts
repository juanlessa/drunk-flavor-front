/// <reference types="@histoire/plugin-vue/components" />

import type { Locale } from './app/types/i18n.types';
import type en from './i18n/locales/en.json';

type MessageSchema = typeof en;

declare module '@intlify/core-base' {
	interface GeneratedTypeConfig {
		locale: Locale;
	}
}

declare module 'vue-i18n' {
	// eslint-disable-next-line @typescript-eslint/no-empty-object-type
	export interface DefineLocaleMessage extends MessageSchema {}
}
