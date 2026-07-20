import { defineSetupVue3 } from '@histoire/plugin-vue';
import { createI18n } from 'vue-i18n';
import en from '../i18n/locales/en.json';
import pt from '../i18n/locales/pt.json';

export const setupVue3 = defineSetupVue3(({ app }) => {
	const i18n = createI18n({
		legacy: false,
		locale: 'en',
		fallbackLocale: 'en',
		messages: { en, pt }
	});

	app.use(i18n);
});
