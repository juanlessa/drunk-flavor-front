import type { Languages } from './translations.constants';

export type Language = (typeof Languages)[keyof typeof Languages];

export type Translations<T> = {
	[key in Language]: T;
};

export type TranslationName = {
	name: string;
};

export type TranslationAnyWithNameKey = {
	[key: string]: unknown;
	name: string;
};
