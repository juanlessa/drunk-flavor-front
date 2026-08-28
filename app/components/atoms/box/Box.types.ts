export enum BoxAsEnum {
	div = 'div',
	main = 'main',
	nav = 'nav',
	header = 'header',
	footer = 'footer',
	section = 'section',
	article = 'article',
	aside = 'aside',
	form = 'form',
	fieldset = 'fieldset',
	figure = 'figure',
	address = 'address'
}

export enum BoxDirectionEnum {
	row = 'row',
	col = 'col',
	responsive = 'responsive',
	wrap = 'wrap',
	'container-responsive' = 'container-responsive'
}

export enum BoxContainerBreakpointEnum {
	xs = 'xs',
	sm = 'sm',
	md = 'md',
	lg = 'lg',
	xl = 'xl',
	'2xl' = '2xl',
	'3xl' = '3xl',
	'4xl' = '4xl',
	'5xl' = '5xl'
}

export type BoxAs = keyof typeof BoxAsEnum;
export type BoxDirection = keyof typeof BoxDirectionEnum;
export type BoxContainerBreakpoint = keyof typeof BoxContainerBreakpointEnum;
