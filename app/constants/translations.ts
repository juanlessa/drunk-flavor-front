import { LanguagesEnum, type Language } from '~/types/translations';

export const languages = Object.keys(LanguagesEnum) as Language[];
