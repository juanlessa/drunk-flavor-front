import {
	AnchorSizeEnum,
	AnchorWeightEnum,
	type AnchorSize,
	type AnchorWeight
} from '~/types/Anchor';

export const anchorWeightOptions = Object.keys(AnchorWeightEnum) as AnchorWeight[];
export const anchorSizeOptions = Object.keys(AnchorSizeEnum) as AnchorSize[];
