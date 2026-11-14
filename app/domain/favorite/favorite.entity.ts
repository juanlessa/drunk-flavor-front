import type { Drink } from '../drink/drink.entity';
import type { EntityMetadata } from '../shared/entity.types';
/** A drink a person saved. It is never changed, so it has no `updatedAt`. */
export type Favorite = Omit<EntityMetadata, 'updatedAt'> & {
	drinkId: string;
	userId: string;
};
/** A favorite with its drink, as the list of favorites returns it. */
export type FavoriteWithDrink = Favorite & {
	drink: Drink;
};
