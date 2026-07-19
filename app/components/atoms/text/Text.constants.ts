import {
	TextTypeEnum,
	TextSizeEnum,
	TextWeightEnum,
	type TextType,
	type TextSize,
	type TextWeight
} from './Text.types';

export const textTypeOptions = Object.keys(TextTypeEnum) as TextType[];
export const textSizeOptions = Object.keys(TextSizeEnum) as TextSize[];
export const textWeightOptions = Object.keys(TextWeightEnum) as TextWeight[];
