import type { z } from 'zod';
import type { FieldError } from '@/types/form';

export const validateSchema =
	<T>(schema: z.ZodTypeAny) =>
	(data: T): FieldError[] => {
		let errors: Array<FieldError> = [];

		const result = schema.safeParse(data);

		if (!result.success) {
			const issues = result.error.issues;
			issues.forEach((issue) => {
				errors = [...errors, { field: issue.path.join('.'), message: issue.message }];
			});
		}

		return errors;
	};
