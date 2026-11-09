import { mount } from '@vue/test-utils';
import { describe, expect, it, vi } from 'vitest';
import { ref, toValue } from 'vue';
import { useDrinkSummary } from '~/composables/drink/useDrinkSummary';
import type { Drink } from '~/domain/drink/drink.entity';
import { initEmptyDrink } from '~/domain/drink/drink.factory';
import { buildIngredient } from '~/test/drink.fixtures';
import DrinkPreview from './DrinkPreview.vue';

// Mirrors vue-i18n: a number as the second argument picks the plural form.
const translate = (key: string, plural?: unknown) =>
	typeof plural === 'number' ? `${key} #${plural}` : key;
vi.stubGlobal('useI18n', () => ({ t: translate, locale: ref('en') }));
vi.stubGlobal('toValue', toValue);
vi.stubGlobal('useDrinkSummary', useDrinkSummary);

const line = (id: string, name: string, optional = false) => ({
	ingredient: buildIngredient(id, name),
	amount: { quantity: 30, unit: buildIngredient(id).units[0] },
	optional
});

const buildDrink = (): Drink =>
	({
		...initEmptyDrink(),
		id: 'gimlet',
		translations: {
			en: { name: 'Gimlet', method: 'Shake.' },
			pt: { name: 'Gimlet', method: '' }
		},
		ingredients: [line('gin', 'Gin'), line('lime', 'Lime'), line('soda', 'Soda', true)]
	}) as unknown as Drink;

const mountPreview = (props: Record<string, unknown> = {}) =>
	mount(DrinkPreview, {
		props: { drink: buildDrink(), ...props },
		global: {
			stubs: {
				StarIcon: true,
				Badge: {
					props: ['tone', 'value'],
					template:
						'<span class="badge" :data-tone="tone"><slot>{{ value }}</slot></span>'
				}
			},
			mocks: { $t: translate }
		}
	});

const status = (wrapper: ReturnType<typeof mountPreview>) =>
	wrapper.find('[data-testid="drink-match-status"]');
const missingBadges = (wrapper: ReturnType<typeof mountPreview>) =>
	wrapper
		.findAll('li')
		.filter((item) => item.find('.badge[data-tone="warning"]').exists())
		.map((item) => item.text());

describe('DrinkPreview', () => {
	it('shows the plain recipe when it was not matched by ingredients', () => {
		const wrapper = mountPreview();

		expect(status(wrapper).exists()).toBe(false);
		expect(wrapper.text()).toContain('drinkDetailPage.ingredients.count #3');
		expect(missingBadges(wrapper)).toEqual([]);
	});

	it('lists the optional ingredients too, marked as optional', () => {
		const wrapper = mountPreview({ missingIngredientIds: [] });
		const soda = wrapper.findAll('li').find((item) => item.text().includes('Soda'));

		expect(soda?.find('.badge').text()).toBe('drinkDetailPage.ingredients.optional');
		expect(soda?.find('.badge[data-tone="warning"]').exists()).toBe(false);
	});

	it('says the drink can be made when nothing is missing', () => {
		const wrapper = mountPreview({ missingIngredientIds: [] });

		expect(status(wrapper).attributes('data-tone')).toBe('success');
		expect(status(wrapper).text()).toContain('drinkDetailPage.ingredients.matchReady');
		expect(missingBadges(wrapper)).toEqual([]);
	});

	it('counts and marks each missing ingredient', () => {
		const wrapper = mountPreview({ missingIngredientIds: ['lime'] });

		expect(status(wrapper).attributes('data-tone')).toBe('warning');
		expect(status(wrapper).text()).toBe('drinkDetailPage.ingredients.matchMissing #1');
		expect(missingBadges(wrapper)).toHaveLength(1);
		expect(missingBadges(wrapper)[0]).toContain('Lime');
		expect(missingBadges(wrapper)[0]).toContain('drinkDetailPage.ingredients.missing');
	});
});
