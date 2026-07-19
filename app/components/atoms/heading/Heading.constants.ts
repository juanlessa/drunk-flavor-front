import {
	HeadingTypeEnum,
	HeadingSizeEnum,
	type HeadingType,
	type HeadingSize
} from './Heading.types';

export const headingTypeOptions = Object.keys(HeadingTypeEnum) as HeadingType[];
export const headingSizeOptions = Object.keys(HeadingSizeEnum) as HeadingSize[];
