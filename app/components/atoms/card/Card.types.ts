export enum CardRoundedEnum {
	px = 'px',
	xs = 'xs',
	sm = 'sm',
	md = 'md',
	lg = 'lg',
	full = 'full'
}

export type CardRounded = keyof typeof CardRoundedEnum;
