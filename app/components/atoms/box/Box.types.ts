export enum BoxDirectionEnum {
	row = 'row',
	col = 'col',
	responsive = 'responsive',
	wrap = 'wrap',
	'container-responsive' = 'container-responsive'
}

export enum BoxContainerBreakpointEnum {
	xs = 'xs',
	sm = 'sm',
	md = 'md',
	lg = 'lg',
	xl = 'xl',
	'2xl' = '2xl',
	'3xl' = '3xl',
	'4xl' = '4xl',
	'5xl' = '5xl'
}

export type BoxDirection = keyof typeof BoxDirectionEnum;
export type BoxContainerBreakpoint = keyof typeof BoxContainerBreakpointEnum;
