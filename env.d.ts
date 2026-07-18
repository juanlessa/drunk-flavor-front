/// <reference types="@histoire/plugin-vue/components" />

import type { Language } from './app/types/translations';
import type en from './app/locales/en.json';

type MessageSchema = typeof en;

declare module '@intlify/core-base' {
	interface GeneratedTypeConfig {
		locale: Language;
	}
}

declare module 'vue-i18n' {
	// eslint-disable-next-line @typescript-eslint/no-empty-object-type
	export interface DefineLocaleMessage extends MessageSchema {}
}
