import { mount } from '@vue/test-utils';
import { describe, expect, it, vi } from 'vitest';
import { ref } from 'vue';
import type { Drink } from '~/domain/drink/drink.entity';
import { initEmptyDrink } from '~/domain/drink/drink.factory';
import DrinkCard from './DrinkCard.vue';

// Mirrors vue-i18n: a third argument picks the plural form, "one | many".
vi.stubGlobal('useI18n', () => ({
	t: (key: string, params?: Record<string, unknown>, plural?: number) =>
		[key, plural === undefined ? '' : `#${plural}`, params ? JSON.stringify(params) : '']
			.filter(Boolean)
			.join(' '),
	locale: ref('en')
}));
vi.stubGlobal('useLocalePath', () => (path: string) => path);

const line = (id: string, name: string, optional = false) =>
	({
		ingredient: { id, translations: { en: { name }, pt: { name } } },
		optional
	}) as unknown as Drink['ingredients'][number];

const buildDrink = (): Drink => ({
	...initEmptyDrink(),
	id: 'negroni',
	translations: { en: { name: 'Negroni', method: '' }, pt: { name: 'Negroni', method: '' } },
	ingredients: [
		line('gin', 'Gin'),
		line('campari', 'Campari'),
		line('vermouth', 'Vermouth'),
		line('orange', 'Orange', true)
	]
});

const DrinkPreviewStub = {
	name: 'DrinkPreview',
	props: ['drink', 'missingIngredientIds'],
	template: '<div />'
};

const mountCard = (props: Record<string, unknown> = {}) =>
	mount(DrinkCard, {
		props: { drink: buildDrink(), ...props },
		global: {
			stubs: {
				HoverCard: { template: '<div><slot name="trigger" /><slot /></div>' },
				Card: { template: '<div><slot /></div>' },
				Heading: { template: '<h3><slot /></h3>' },
				Text: {
					props: ['as'],
					template: '<component :is="as || \'p\'"><slot /></component>'
				},
				Badge: {
					props: ['tone'],
					template: '<span data-testid="match-badge" :data-tone="tone"><slot /></span>'
				},
				NuxtLink: { props: ['to'], template: '<a :href="to"><slot /></a>' },
				ImageThumbnail: true,
				StarIcon: true,
				DrinkPreview: DrinkPreviewStub
			},
			mocks: { $t: (key: string) => key, $i18n: { locale: 'en' } }
		}
	});

const badge = (wrapper: ReturnType<typeof mountCard>) =>
	wrapper.find('[data-testid="match-badge"]');

describe('DrinkCard', () => {
	it('shows the ingredient count and no match status outside a match', () => {
		const wrapper = mountCard();

		expect(badge(wrapper).exists()).toBe(false);
		expect(wrapper.text()).toContain('organisms.drinkCard.ingredientsCount');
	});

	it('says the drink can be made when nothing is missing', () => {
		const wrapper = mountCard({ missingIngredientIds: [] });

		expect(badge(wrapper).attributes('data-tone')).toBe('success');
		expect(badge(wrapper).text()).toContain('✓');
		expect(badge(wrapper).text()).toContain('organisms.drinkCard.matchReady');
		expect(wrapper.text()).not.toContain('organisms.drinkCard.ingredientsCount');
	});

	it('names the one missing ingredient', () => {
		const wrapper = mountCard({ missingIngredientIds: ['campari'] });

		expect(badge(wrapper).attributes('data-tone')).toBe('warning');
		expect(badge(wrapper).text()).toBe(
			'organisms.drinkCard.matchMissing #1 {"names":"Campari","count":1}'
		);
	});

	it('previews the required ingredients as plain names, missing or not', () => {
		const wrapper = mountCard({ missingIngredientIds: ['campari'] });

		expect(wrapper.text()).toContain('Gin · Campari · Vermouth');
		expect(wrapper.text()).not.toContain('Orange');
	});

	it.each([
		{ title: 'matched by ingredients', missingIngredientIds: ['campari'] },
		{ title: 'not matched', missingIngredientIds: undefined }
	])('hands what is missing to the hover preview when $title', ({ missingIngredientIds }) => {
		const wrapper = mountCard({ missingIngredientIds });

		expect(wrapper.findComponent(DrinkPreviewStub).props('missingIngredientIds')).toEqual(
			missingIngredientIds
		);
	});

	it('lists every missing ingredient in recipe order with the plural wording', () => {
		const wrapper = mountCard({ missingIngredientIds: ['vermouth', 'gin'] });

		expect(badge(wrapper).text()).toBe(
			'organisms.drinkCard.matchMissing #2 {"names":"Gin, Vermouth","count":2}'
		);
	});
});
