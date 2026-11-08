import { genderedLanguages } from './gender.constants';
import type { Language } from './translations.types';

/** Whether the words of this language need a grammatical gender. */
export const isGenderedLanguage = (language: Language): boolean =>
	(genderedLanguages as readonly Language[]).includes(language);
