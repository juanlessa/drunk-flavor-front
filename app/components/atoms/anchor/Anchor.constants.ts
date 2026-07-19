import {
	AnchorSizeEnum,
	AnchorWeightEnum,
	type AnchorSize,
	type AnchorWeight
} from './Anchor.types';

export const anchorWeightOptions = Object.keys(AnchorWeightEnum) as AnchorWeight[];
export const anchorSizeOptions = Object.keys(AnchorSizeEnum) as AnchorSize[];
