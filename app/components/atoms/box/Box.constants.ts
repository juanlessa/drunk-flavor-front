import { BoxAsEnum, BoxDirectionEnum, type BoxAs, type BoxDirection } from './Box.types';

export const boxAsOptions = Object.keys(BoxAsEnum) as BoxAs[];
export const boxDirectionOptions = Object.keys(BoxDirectionEnum) as BoxDirection[];
