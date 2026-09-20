import {
	TextListUnorderedMarkerEnum,
	TextListOrderedMarkerEnum,
	TextListGapEnum,
	type TextListUnorderedMarker,
	type TextListOrderedMarker,
	type TextListMarker,
	type TextListGap
} from './TextList.types';

export const textListUnorderedMarkerOptions = Object.keys(
	TextListUnorderedMarkerEnum
) as TextListUnorderedMarker[];
export const textListOrderedMarkerOptions = Object.keys(
	TextListOrderedMarkerEnum
) as TextListOrderedMarker[];
export const textListMarkerOptions: TextListMarker[] = [
	...new Set([...textListUnorderedMarkerOptions, ...textListOrderedMarkerOptions])
];
export const textListGapOptions = Object.keys(TextListGapEnum) as TextListGap[];

export const unorderedMarkers = textListUnorderedMarkerOptions;
export const orderedMarkers = textListOrderedMarkerOptions;
