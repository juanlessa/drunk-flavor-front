export enum HeadingTypeEnum {
	h1 = 'h1',
	h2 = 'h2',
	h3 = 'h3',
	h4 = 'h4',
	h5 = 'h5',
	h6 = 'h6'
}

export type HeadingType = keyof typeof HeadingTypeEnum;

export type HeadingSize =
	'titleSm' | 'title' | 'titleLg' | 'headlineSm' | 'headline' | 'headlineLg';
