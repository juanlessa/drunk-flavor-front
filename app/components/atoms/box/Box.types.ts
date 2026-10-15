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
	wrap = 'wrap'
}

export type BoxAs = keyof typeof BoxAsEnum;
export type BoxDirection = keyof typeof BoxDirectionEnum;
