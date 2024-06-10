import type { FieldError } from '~/types/form';

export const checkFieldError = (errors: Array<FieldError>, field: string): string => {
	const error = errors.find((err) => err.field === field);
	return error === undefined ? '' : error.message;
};
