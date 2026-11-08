import { z } from 'zod/v4';
import {
	GlassPreparationModes,
	PreparationActionTypes
} from '~/domain/preparation/preparation.constants';
import type { PreparationAction } from '~/domain/preparation/preparation.entity';

// These checks only cover what can be seen without the backend: that an action has what it needs to be written.
// Whether the actions make sense together (straining before anything was added...) is only known by the backend,
// which the form asks through the preview.
const isWholePositive = (value: unknown) =>
	typeof value === 'number' && Number.isInteger(value) && value > 0;

const hasText = (value: unknown) => typeof value === 'string' && value.trim().length > 0;

/** Checks one action of the plan; the issues point at the field of the action that needs attention. */
export const preparationActionValidation = z
	.custom<PreparationAction>()
	.superRefine((action, ctx) => {
		const add = (path: string, message: string) =>
			ctx.addIssue({ code: 'custom', message, path: [path] });
		const needsItems = () => {
			if (!('items' in action) || !action.items?.length) {
				add('items', 'errors.drinks.preparation.items');
			}
		};
		const checkDuration = (key: 'seconds' | 'revolutions') => {
			const value = (action as Record<string, unknown>)[key];
			if (value !== undefined && !isWholePositive(value)) {
				add(key, 'errors.drinks.preparation.duration');
			}
		};
		switch (action.type) {
			case PreparationActionTypes.prepareGlass:
				if (
					action.mode !== GlassPreparationModes.chill &&
					action.mode !== GlassPreparationModes.warm
				) {
					if (!('item' in action) || !action.item?.ingredientId)
						add('item', 'errors.drinks.preparation.item');
				}
				break;
			case PreparationActionTypes.add:
			case PreparationActionTypes.garnish:
				needsItems();
				break;
			case PreparationActionTypes.top:
				if (!action.item?.ingredientId) add('item', 'errors.drinks.preparation.item');
				break;
			case PreparationActionTypes.shake:
				checkDuration('seconds');
				break;
			case PreparationActionTypes.stir:
				checkDuration('seconds');
				checkDuration('revolutions');
				break;
			case PreparationActionTypes.custom:
				if (!hasText(action.text?.en) || !hasText(action.text?.pt)) {
					add('text', 'errors.drinks.preparation.text');
				}
				break;
			default:
				break;
		}
	});

export const preparationPlanValidation = z.object({
	mixingVessel: z.string().min(1, { error: 'errors.drinks.preparation.mixingVessel' }),
	servingGlass: z.string().min(1, { error: 'errors.drinks.preparation.servingGlass' }),
	actions: z
		.array(preparationActionValidation)
		.min(1, { error: 'errors.drinks.preparation.actions' })
});
