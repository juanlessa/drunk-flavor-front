export enum ButtonVariantEnum {
	primary = 'primary',
	secondary = 'secondary',
	delete = 'delete',
	outline = 'outline',
	/** Icon-only action: no fill, square hit area, hover surface. Needs `ariaLabel`. */
	icon = 'icon',
	/** Bare text action, visually like an Anchor. For signin/signout style actions. */
	plain = 'plain'
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
	ariaLabel: string;
}>;
