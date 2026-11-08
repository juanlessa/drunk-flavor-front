import { DrinkMethodModes } from '~/domain/drink/drink.constants';
import { MixingVessels, ServingGlasses } from '~/domain/preparation/preparation.constants';
import type { PreparationPlan } from '~/domain/preparation/preparation.entity';
import type { DrinkForm } from '~/types/drink.types';

export const initEmptyPreparationPlan = (): PreparationPlan => ({
	mixingVessel: MixingVessels.shaker,
	servingGlass: ServingGlasses.coupe,
	actions: []
});

export const initEmptyDrinkForm = (): DrinkForm => ({
	translations: {
		en: { name: '', method: '' },
		pt: { name: '', method: '' }
	},
	ingredients: [],
	garnishes: [],
	methodMode: DrinkMethodModes.generated,
	preparation: initEmptyPreparationPlan()
});
