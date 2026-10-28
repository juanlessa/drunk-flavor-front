import { z } from 'zod/v4';
import { UnitKinds } from '~/domain/unit/unit.constants';
import { getZodTranslationsSchema } from '~/helpers/getZodTranslationsSchema';
import { validateSchema } from '~/helpers/validateSchema';
import type { UnitForm } from '~/types/unit.types';

export const unitNameValidation = z.string().trim().min(1, { error: 'errors.units.name' });
export const unitNamePluralValidation = z
	.string()
	.trim()
	.min(1, { error: 'errors.units.namePlural' });
export const unitSymbolValidation = z.string().trim();
export const unitSpaceBeforeSymbolValidation = z.boolean();
export const unitAllowDecimalValidation = z.boolean();
export const unitKindValidation = z.enum(UnitKinds, { error: 'errors.units.kind' });

export const unitTranslationSchema = z.object({
	name: unitNameValidation,
	namePlural: unitNamePluralValidation
});

export const unitFormSchema = z.object({
	translations: getZodTranslationsSchema(unitTranslationSchema),
	symbol: unitSymbolValidation,
	spaceBeforeSymbol: unitSpaceBeforeSymbolValidation,
	allowDecimal: unitAllowDecimalValidation,
	kind: unitKindValidation
});

export const unitFormValidator = validateSchema<UnitForm>(unitFormSchema);
