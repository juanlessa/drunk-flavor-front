import {
	ButtonSizeEnum,
	ButtonTypeEnum,
	ButtonVariantEnum,
	type ButtonSize,
	type ButtonType,
	type ButtonVariant
} from './Button.types';

export const buttonVariantOptions = Object.keys(ButtonVariantEnum) as ButtonVariant[];
export const buttonSizeOptions = Object.keys(ButtonSizeEnum) as ButtonSize[];
export const buttonTypeOptions = Object.keys(ButtonTypeEnum) as ButtonType[];
