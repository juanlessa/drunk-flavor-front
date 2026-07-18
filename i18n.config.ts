import en from './app/locales/en.json';
import pt from './app/locales/pt.json';

export default defineI18nConfig(() => ({
	legacy: false,
	locale: 'en',
	fallbackLocale: 'en',
	messages: { en, pt }
}));
