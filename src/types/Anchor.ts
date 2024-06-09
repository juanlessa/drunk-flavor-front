export enum AnchorWeightEnum {
	regular = 'regular',
	medium = 'medium',
	bold = 'bold'
}

export enum AnchorSizeEnum {
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

export type AnchorWeight = keyof typeof AnchorWeightEnum;
export type AnchorSize = keyof typeof AnchorSizeEnum;
