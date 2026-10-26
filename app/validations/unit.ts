import { z } from 'zod/v4';
import { getZodTranslationsSchema } from '~/helpers/getZodTranslationsSchema';
import { validateSchema } from '~/helpers/validateSchema';
import { UnitKinds } from '~/domain/unit/unit.constants';
import type { UnitForm } from '~/types/unit.types';

// fields validation
export const unitNameValidation = z.string().trim().min(1, { error: 'errors.units.name' });

export const unitNamePluralValidation = z
	.string()
	.trim()
	.min(1, { error: 'errors.units.namePlural' });

// Optional: an empty string means "no symbol". Not lowercased, so "mL" stays "mL".
export const unitSymbolValidation = z.string().trim();

export const unitSpaceBeforeSymbolValidation = z.boolean();

export const unitAllowDecimalValidation = z.boolean();

export const unitKindValidation = z.enum(UnitKinds, { error: 'errors.units.kind' });

// schemas
export const unitTranslationSchema = z.object({
	name: unitNameValidation,
	name_plural: unitNamePluralValidation
});

export const unitFormSchema = z.object({
	translations: getZodTranslationsSchema(unitTranslationSchema),
	symbol: unitSymbolValidation,
	space_before_symbol: unitSpaceBeforeSymbolValidation,
	allow_decimal: unitAllowDecimalValidation,
	kind: unitKindValidation
});

//validators
export const unitFormValidator = validateSchema<UnitForm>(unitFormSchema);
