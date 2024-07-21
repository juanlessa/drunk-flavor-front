import en from '@/locales/en.json';
import pt from '@/locales/pt.json';
import type { Language } from '~/types/translations';

export default defineI18nConfig(() => ({
	legacy: false,
	locale: 'en' as Language,
	fallbackLocale: 'en' as Language,
	messages: { en, pt }
}));
