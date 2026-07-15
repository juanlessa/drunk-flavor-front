export enum HeadingSizeEnum {
	sm = 'sm',
	md = 'md',
	lg = 'lg',
	'2xl' = '2xl',
	'3xl' = '3xl',
	'4xl' = '4xl',
	'5xl' = '5xl',
	'6xl' = '6xl'
}
export enum HeadingTypeEnum {
	h1 = 'h1',
	h2 = 'h2',
	h3 = 'h3',
	h4 = 'h4',
	h5 = 'h5',
	h6 = 'h6'
}

export type HeadingType = keyof typeof HeadingTypeEnum;
export type HeadingSize = keyof typeof HeadingSizeEnum;
