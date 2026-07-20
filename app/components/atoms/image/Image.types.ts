export enum ImageRoundedEnum {
	none = 'none',
	px = 'px',
	xs = 'xs',
	sm = 'sm',
	md = 'md',
	lg = 'lg',
	full = 'full'
}

export type ImageRounded = keyof typeof ImageRoundedEnum;

/**
 * ImageWidth and ImageHeight accept any valid CSS dimension value.
 * Examples: '100px', '8rem', '50%', '10vw', 'auto', 'fit-content'
 */
export type ImageWidth = string;
export type ImageHeight = string;
