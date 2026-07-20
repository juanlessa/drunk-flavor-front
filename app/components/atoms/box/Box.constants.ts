import {
	BoxContainerBreakpointEnum,
	BoxDirectionEnum,
	type BoxContainerBreakpoint,
	type BoxDirection
} from './Box.types';

export const boxDirectionOptions = Object.keys(BoxDirectionEnum) as BoxDirection[];
export const boxContainerBreakpointOptions = Object.keys(
	BoxContainerBreakpointEnum
) as BoxContainerBreakpoint[];
