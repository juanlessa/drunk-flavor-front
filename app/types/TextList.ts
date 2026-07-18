export enum TextListTypeEnum {
	ul = 'ul',
	ol = 'ol'
}

export enum TextListMarkerEnum {
	none = 'none',
	disc = 'disc',
	circle = 'circle',
	square = 'square',
	decimal = 'decimal',
	'decimal-leading-zero' = 'decimal-leading-zero',
	'lower-alpha' = 'lower-alpha',
	'upper-alpha' = 'upper-alpha',
	'lower-roman' = 'lower-roman',
	'upper-roman' = 'upper-roman'
}

export enum TextListSizeEnum {
	xxs = 'xxs',
	xs = 'xs',
	sm = 'sm',
	md = 'md',
	lg = 'lg',
	xl = 'xl',
	'2xl' = '2xl'
}

export enum TextListWeightEnum {
	regular = 'regular',
	medium = 'medium',
	bold = 'bold'
}

export enum TextListGapEnum {
	none = 'none',
	sm = 'sm',
	md = 'md',
	lg = 'lg',
	xl = 'xl'
}

export type TextListType = keyof typeof TextListTypeEnum;
export type TextListMarker = keyof typeof TextListMarkerEnum;
export type TextListSize = keyof typeof TextListSizeEnum;
export type TextListWeight = keyof typeof TextListWeightEnum;
export type TextListGap = keyof typeof TextListGapEnum;

export const unorderedMarkers: TextListMarker[] = ['none', 'disc', 'circle', 'square'];
export const orderedMarkers: TextListMarker[] = [
	'none',
	'decimal',
	'decimal-leading-zero',
	'lower-alpha',
	'upper-alpha',
	'lower-roman',
	'upper-roman'
];
