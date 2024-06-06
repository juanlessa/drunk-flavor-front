enum ButtonVariantEnum {
	primary = 'primary',
	secondary = 'secondary',
	delete = 'delete'
}

enum ButtonSizeEnum {
	md = 'md',
	sm = 'sm'
}

enum ButtonTypeEnum {
	button = 'button',
	submit = 'submit',
	reset = 'reset'
}

export type ButtonVariant = keyof typeof ButtonVariantEnum;
export type ButtonSize = keyof typeof ButtonSizeEnum;
export type ButtonType = keyof typeof ButtonTypeEnum;

export type ButtonProps = Partial<{
	size: ButtonSize;
	variant: ButtonVariant;
	type: ButtonType;
	disabled: boolean;
	value: string;
}>;

export const buttonVariantOptions = Object.keys(ButtonVariantEnum) as ButtonVariant[];
export const buttonSizeOptions = Object.keys(ButtonSizeEnum) as ButtonSize[];
export const buttonTypeOptions: ButtonType[] = Object.keys(ButtonTypeEnum) as ButtonType[];
