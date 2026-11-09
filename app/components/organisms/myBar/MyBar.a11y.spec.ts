import { mount } from '@vue/test-utils';
import { describe, it, vi } from 'vitest';
import { computed, ref } from 'vue';
import RadioCardGroup from '~/components/molecules/radioCardGroup/RadioCardGroup.vue';
import type { Drink, DrinkMatch } from '~/domain/drink/drink.entity';
import { buildIngredient } from '~/test/drink.fixtures';
import { expectNoA11yViolations } from '~/test/axe';
import MyBarPanel from './MyBarPanel.vue';
import MyBarResults from './MyBarResults.vue';

const translate = (key: string) => key;
vi.stubGlobal('useI18n', () => ({ t: translate, locale: ref('en') }));
vi.stubGlobal('useIngredientSearch', () => ({
	options: computed(() => [buildIngredient('gin', 'Gin')]),
	searchTerm: ref(''),
	loading: ref(false),
	loadNextPage: vi.fn()
}));

// The search atom has its own accessibility specs; here it only needs to be the labelled field.
const SearchStub = { props: ['id'], template: '<input :id="id" type="search" />' };
const DrinkCardStub = {
	props: ['drink'],
	template: '<article><h4><a :href="`/drinks/${drink.id}`">{{ drink.id }}</a></h4></article>'
};
const ButtonStub = { template: '<button type="button"><slot /></button>' };

const bar = [
	{ id: 'gin', translations: { en: { name: 'Gin' }, pt: { name: 'Gin' } } },
	{ id: 'lime', translations: { en: { name: 'Lime' }, pt: { name: 'Limão' } } }
];
type A11yCase = { title: string; props: Record<string, unknown> };

const match = (id: string, missingCount: number): DrinkMatch => ({
	drink: { id } as Drink,
	missingCount,
	missingIngredientIds: []
});

describe('MyBarPanel accessibility', () => {
	it.each<A11yCase>([
		{ title: 'empty', props: { ingredients: [] } },
		{ title: 'with ingredients', props: { ingredients: bar, maxMissing: 1 } },
		{ title: 'full', props: { ingredients: bar, isFull: true, maxMissing: 'any' } }
	])('has no violations when $title', async ({ props }) => {
		const wrapper = mount(MyBarPanel, {
			props,
			attachTo: document.body,
			global: {
				components: { RadioCardGroup },
				stubs: {
					Label: {
						props: ['for'],
						template: '<label :for="$props.for"><slot /></label>'
					},
					Search: SearchStub,
					SearchIcon: true
				},
				mocks: { $t: translate }
			}
		});
		await expectNoA11yViolations(wrapper.element);
		wrapper.unmount();
	});
});

describe('MyBarResults accessibility', () => {
	it.each<A11yCase>([
		{ title: 'the bar is empty', props: { hasIngredients: false } },
		{ title: 'nothing is found', props: { hasIngredients: true, hasLoaded: true } },
		{ title: 'the first page loads', props: { hasIngredients: true, loading: true } },
		{
			title: 'drinks are found',
			props: {
				hasIngredients: true,
				hasLoaded: true,
				maxMissing: 'any',
				matches: [match('a', 0), match('b', 1)]
			}
		}
	])('has no violations when $title', async ({ props }) => {
		const wrapper = mount(MyBarResults, {
			props,
			attachTo: document.body,
			global: {
				stubs: { DrinkCard: DrinkCardStub, DrinkCardSkeleton: true, Button: ButtonStub },
				mocks: { $t: translate }
			}
		});
		await expectNoA11yViolations(wrapper.element);
		wrapper.unmount();
	});
});
