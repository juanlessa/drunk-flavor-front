import {
	TextListTypeEnum,
	TextListMarkerEnum,
	TextListSizeEnum,
	TextListWeightEnum,
	TextListGapEnum,
	type TextListType,
	type TextListMarker,
	type TextListSize,
	type TextListWeight,
	type TextListGap
} from './TextList.types';

export const textListTypeOptions = Object.keys(TextListTypeEnum) as TextListType[];
export const textListMarkerOptions = Object.keys(TextListMarkerEnum) as TextListMarker[];
export const textListSizeOptions = Object.keys(TextListSizeEnum) as TextListSize[];
export const textListWeightOptions = Object.keys(TextListWeightEnum) as TextListWeight[];
export const textListGapOptions = Object.keys(TextListGapEnum) as TextListGap[];
