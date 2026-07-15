export enum LanguagesEnum {
	en = 'en',
	pt = 'pt'
}

export type Language = keyof typeof LanguagesEnum;

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
