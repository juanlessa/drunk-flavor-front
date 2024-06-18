export enum ButtonVariantEnum {
	primary = 'primary',
	secondary = 'secondary',
	delete = 'delete'
}

export enum ButtonSizeEnum {
	md = 'md',
	sm = 'sm'
}

export enum ButtonTypeEnum {
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
