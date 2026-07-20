import {
	TextListTypeEnum,
	TextListUnorderedMarkerEnum,
	TextListOrderedMarkerEnum,
	TextListSizeEnum,
	TextListWeightEnum,
	TextListGapEnum,
	type TextListType,
	type TextListUnorderedMarker,
	type TextListOrderedMarker,
	type TextListMarker,
	type TextListSize,
	type TextListWeight,
	type TextListGap
} from './TextList.types';

export const textListTypeOptions = Object.keys(TextListTypeEnum) as TextListType[];
export const textListUnorderedMarkerOptions = Object.keys(
	TextListUnorderedMarkerEnum
) as TextListUnorderedMarker[];
export const textListOrderedMarkerOptions = Object.keys(
	TextListOrderedMarkerEnum
) as TextListOrderedMarker[];
export const textListMarkerOptions: TextListMarker[] = [
	...new Set([...textListUnorderedMarkerOptions, ...textListOrderedMarkerOptions])
];
export const textListSizeOptions = Object.keys(TextListSizeEnum) as TextListSize[];
export const textListWeightOptions = Object.keys(TextListWeightEnum) as TextListWeight[];
export const textListGapOptions = Object.keys(TextListGapEnum) as TextListGap[];

export const unorderedMarkers = textListUnorderedMarkerOptions;
export const orderedMarkers = textListOrderedMarkerOptions;
