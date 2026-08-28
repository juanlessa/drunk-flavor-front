import {
	BoxAsEnum,
	BoxContainerBreakpointEnum,
	BoxDirectionEnum,
	type BoxAs,
	type BoxContainerBreakpoint,
	type BoxDirection
} from './Box.types';

export const boxAsOptions = Object.keys(BoxAsEnum) as BoxAs[];
export const boxDirectionOptions = Object.keys(BoxDirectionEnum) as BoxDirection[];
export const boxContainerBreakpointOptions = Object.keys(
	BoxContainerBreakpointEnum
) as BoxContainerBreakpoint[];
