export enum TextTypeEnum {
	p = 'p',
	span = 'span',
	strong = 'strong'
}
export enum TextSizeEnum {
	xxs = 'xxs',
	xs = 'xs',
	sm = 'sm',
	md = 'md',
	lg = 'lg',
	xl = 'xl',
	'2xl' = '2xl',
	'4xl' = '4xl',
	'5xl' = '5xl',
	'6xl' = '6xl',
	'7xl' = '7xl',
	'8xl' = '8xl',
	'9xl' = '9xl'
}
export enum TextWeightEnum {
	regular = 'regular',
	medium = 'medium',
	bold = 'bold'
}

export type TextType = keyof typeof TextTypeEnum;
export type TextSize = keyof typeof TextSizeEnum;
export type TextWeight = keyof typeof TextWeightEnum;
