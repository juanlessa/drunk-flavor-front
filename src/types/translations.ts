export enum LanguagesEnum {
	en = 'en',
	pt = 'pt'
}

export type Language = keyof typeof LanguagesEnum;

export type ITranslations<T> = {
	[key in Language]: T;
};

export type ITranslationName = {
	name: string;
};

export type ITranslationAnyWithNameKey = {
	[key: string]: unknown;
	name: string;
};
