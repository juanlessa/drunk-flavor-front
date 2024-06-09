import { useI18n } from '#imports';
import type { FieldError } from '~/types/form';

export const checkFieldError = (errors: Array<FieldError>, field: string): string => {
	const { t } = useI18n();

	const error = errors.find((err) => err.field === field);
	return error === undefined ? '' : t(error.message);
};
