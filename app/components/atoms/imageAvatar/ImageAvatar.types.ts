export enum ImageAvatarRoundedEnum {
	none = 'none',
	px = 'px',
	xs = 'xs',
	sm = 'sm',
	md = 'md',
	lg = 'lg',
	full = 'full'
}

export type ImageAvatarRounded = keyof typeof ImageAvatarRoundedEnum;

/**
 * ImageAvatarWidth and ImageAvatarHeight accept any valid CSS dimension value.
 * Examples: '100px', '8rem', '50%', '10vw', 'auto', 'fit-content'
 */
export type ImageAvatarWidth = string;
export type ImageAvatarHeight = string;
