import { describe, expect, it } from 'vitest';
import { mapCommentResponse, type CommentResponse } from '../comment/comment.api';
import { mapDrinkResponse, type DrinkResponse } from '../drink/drink.api';
import { mapProfileResponse, type ProfileResponse } from '../profile/profile.api';
import { mapRatingResponse, type RatingResponse } from '../rating/rating.api';

const createdAt = '2025-01-01T00:00:00.000Z';
const updatedAt = '2025-01-02T00:00:00.000Z';

describe('API response mappers', () => {
	it('maps profile timestamps while preserving camelCase account fields', () => {
		const response: ProfileResponse = {
			id: 'user-id',
			name: 'Jane',
			surname: 'Doe',
			email: 'jane@example.com',
			emailVerified: true,
			role: 'owner',
			status: 'active',
			createdAt,
			updatedAt,
			authenticationMethods: { password: { enabled: true }, providers: ['google'] }
		};

		const profile = mapProfileResponse(response);

		expect(profile.createdAt).toEqual(new Date(createdAt));
		expect(profile.updatedAt).toEqual(new Date(updatedAt));
		expect(profile).toMatchObject({ id: 'user-id', emailVerified: true, role: 'owner' });
	});

	it('maps deeply embedded drink metadata timestamps', () => {
		const response: DrinkResponse = {
			id: 'drink-id',
			translations: {
				en: { name: 'Gimlet', method: 'Shake' },
				pt: { name: 'Gimlet', method: 'Agite' }
			},
			ingredients: [
				{
					quantity: 60,
					ingredient: {
						id: 'ingredient-id',
						translations: { en: { name: 'Lime' }, pt: { name: 'Limão' } },
						category: {
							id: 'category-id',
							translations: { en: { name: 'Fruit' }, pt: { name: 'Fruta' } },
							isAlcoholic: false,
							createdAt,
							updatedAt
						},
						unit: {
							id: 'unit-id',
							translations: {
								en: { name: 'milliliter', namePlural: 'milliliters' },
								pt: { name: 'mililitro', namePlural: 'mililitros' }
							},
							allowDecimal: true,
							kind: 'volume',
							createdAt,
							updatedAt
						},
						createdAt,
						updatedAt
					}
				}
			],
			avgRating: 4,
			ratingsCount: 2,
			createdAt,
			updatedAt
		};

		const drink = mapDrinkResponse(response);

		expect(drink.createdAt).toBeInstanceOf(Date);
		expect(drink.ingredients[0]!.ingredient.createdAt).toBeInstanceOf(Date);
		expect(drink.ingredients[0]!.ingredient.category.createdAt).toBeInstanceOf(Date);
		expect(drink.ingredients[0]!.ingredient.unit.updatedAt).toBeInstanceOf(Date);
	});

	it('maps comment and rating timestamps independently', () => {
		const commentResponse: CommentResponse = {
			id: 'comment-id',
			drinkId: 'drink-id',
			userId: 'user-id',
			content: 'Comment',
			status: 'visible',
			createdAt,
			updatedAt
		};
		const ratingResponse: RatingResponse = {
			id: 'rating-id',
			drinkId: 'drink-id',
			userId: 'user-id',
			value: 4,
			createdAt,
			updatedAt
		};

		expect(mapCommentResponse(commentResponse).createdAt).toEqual(new Date(createdAt));
		expect(mapRatingResponse(ratingResponse).updatedAt).toEqual(new Date(updatedAt));
	});
});
