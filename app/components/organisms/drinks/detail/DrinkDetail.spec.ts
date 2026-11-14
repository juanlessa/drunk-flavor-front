import { mount } from '@vue/test-utils';
import { describe, expect, it, vi } from 'vitest';
import { computed, ref } from 'vue';
import type { Drink } from '~/domain/drink/drink.entity';
import { initEmptyDrink } from '~/domain/drink/drink.factory';
import DrinkDetail from './DrinkDetail.vue';
vi.stubGlobal('useLocalePath', () => (path: string) => path);
vi.stubGlobal('useGoBack', () => vi.fn());
vi.stubGlobal('useDrinkSummary', () => ({
	name: ref('Mojito'),
	method: ref(''),
	ingredientItems: computed(() => []),
	garnishItems: computed(() => []),
	ingredientCountLabel: ref(''),
	matchStatus: ref(undefined),
	hasRatings: ref(false),
	ratingSummaryText: ref(''),
	ratingSummaryLabel: ref('')
}));
const buildDrink = (withCover: boolean): Drink => ({
	...initEmptyDrink(),
	id: 'mojito',
	cover: withCover ? { name: 'c.jpg', mimetype: 'image/jpeg', url: '/c.jpg' } : undefined
});
const mountDetail = (withCover: boolean) =>
	mount(DrinkDetail, {
		props: { drink: buildDrink(withCover) },
		global: {
			stubs: {
				ArrowLeftIcon: true,
				StarIcon: true,
				Card: { template: '<div><slot /></div>' },
				Heading: { template: '<h1><slot /></h1>' },
				Text: { template: '<p><slot /></p>' },
				Badge: true,
				ImageThumbnail: true,
				FavoriteButton: {
					props: ['drinkId', 'drinkName', 'variant'],
					template: '<button data-testid="favorite" :data-variant="variant" />'
				}
			},
			mocks: { $t: (key: string) => key }
		}
	});
describe('DrinkDetail', () => {
	it('puts the heart over the cover photo, once, when the drink has a cover', () => {
		const hearts = mountDetail(true).findAll('[data-testid="favorite"]');
		expect(hearts.map((heart) => heart.attributes('data-variant'))).toEqual(['media']);
	});
	it('puts a labelled heart in the header, once, when the drink has no cover', () => {
		const hearts = mountDetail(false).findAll('[data-testid="favorite"]');
		expect(hearts.map((heart) => heart.attributes('data-variant'))).toEqual(['pill']);
	});
});
