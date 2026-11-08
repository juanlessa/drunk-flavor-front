import type { Genders } from './gender.constants';
export type Gender = (typeof Genders)[keyof typeof Genders];
