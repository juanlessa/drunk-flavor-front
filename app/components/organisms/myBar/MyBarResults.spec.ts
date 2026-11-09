import { mount } from '@vue/test-utils';
import { describe, expect, it, vi } from 'vitest';
import type { Drink, DrinkMatch } from '~/domain/drink/drink.entity';
import MyBarResults from './MyBarResults.vue';

const translate = (key: string, params?: Record<string, unknown>, plural?: number) =>
	[key, plural === undefined ? '' : `#${plural}`, params ? JSON.stringify(params) : '']
		.filter(Boolean)
		.join(' ');
vi.stubGlobal('useI18n', () => ({ t: translate }));

const match = (id: string, missingCount = 0): DrinkMatch => ({
	drink: { id } as Drink,
	missingCount,
	missingIngredientIds: Array.from({ length: missingCount }, (_, index) => `${id}-${index}`)
});

const DrinkCardStub = {
	props: ['drink', 'missingIngredientIds'],
	template: '<div data-testid="drink">{{ drink.id }}</div>'
};
const ButtonStub = {
	props: ['variant', 'size'],
	emits: ['click'],
	template: '<button type="button" @click="$emit(\'click\')"><slot /></button>'
};

const mountResults = (props: Record<string, unknown> = {}) =>
	mount(MyBarResults, {
		props: { hasIngredients: true, hasLoaded: true, ...props },
		global: {
			stubs: { DrinkCard: DrinkCardStub, DrinkCardSkeleton: true, Button: ButtonStub },
			mocks: { $t: translate }
		}
	});

const button = (wrapper: ReturnType<typeof mountResults>, label: string) =>
	wrapper.findAll('button').find((item) => item.text() === label);

describe('MyBarResults', () => {
	it('invites to add ingredients while the bar is empty', async () => {
		const wrapper = mountResults({ hasIngredients: false, hasLoaded: false });

		expect(wrapper.find('[data-testid="my-bar-start"]').exists()).toBe(true);
		await button(wrapper, 'organisms.myBar.empty.addMore')!.trigger('click');

		expect(wrapper.emitted('addMore')).toEqual([[]]);
	});

	it.each([
		{ maxMissing: 0, wider: 1 },
		{ maxMissing: 1, wider: 2 },
		{ maxMissing: 2, wider: 'any' }
	])(
		'offers to allow more missing when nothing is found with $maxMissing missing',
		async ({ maxMissing, wider }) => {
			const wrapper = mountResults({ maxMissing });

			expect(wrapper.find('[data-testid="my-bar-empty"]').text()).toContain(
				`organisms.myBar.empty.title.${maxMissing}`
			);
			await button(wrapper, `organisms.myBar.empty.widen.${wider}`)!.trigger('click');

			expect(wrapper.emitted('widen')).toEqual([[wider]]);
		}
	);

	it('only offers to add ingredients when nothing is found with any missing', () => {
		const wrapper = mountResults({ maxMissing: 'any' });
		const empty = wrapper.get('[data-testid="my-bar-empty"]');

		expect(empty.text()).toContain('organisms.myBar.empty.description.none');
		expect(empty.findAll('button').map((item) => item.text())).toEqual([
			'organisms.myBar.empty.addMore'
		]);
	});

	it('shows nothing found only after the first page arrived', () => {
		const wrapper = mountResults({ hasLoaded: false, loading: true });

		expect(wrapper.find('[data-testid="my-bar-empty"]').exists()).toBe(false);
		expect(wrapper.find('[data-testid="my-bar-loading"]').exists()).toBe(true);
	});

	it('groups the drinks under a heading per number of missing ingredients', () => {
		const wrapper = mountResults({
			maxMissing: 'any',
			matches: [match('a'), match('b'), match('c', 2)]
		});

		const groups = wrapper.findAll('section section');
		expect(
			groups.map((group) => [
				group.get('h3').text(),
				group.findAll('[data-testid="drink"]').map((drink) => drink.text())
			])
		).toEqual([
			['organisms.myBar.results.groups.ready', ['a', 'b']],
			['organisms.myBar.results.groups.missing #2 {"count":2}', ['c']]
		]);
		expect(
			wrapper
				.findAllComponents(DrinkCardStub)
				.map((card) => card.props('missingIngredientIds'))
		).toEqual([[], [], ['c-0', 'c-1']]);
	});

	it('asks for more drinks until the last page', async () => {
		const wrapper = mountResults({ matches: [match('a')], isLastPage: false });

		await button(wrapper, 'organisms.myBar.results.loadMore')!.trigger('click');
		expect(wrapper.emitted('loadMore')).toEqual([[]]);

		await wrapper.setProps({ isLastPage: true });
		expect(button(wrapper, 'organisms.myBar.results.loadMore')).toBeUndefined();
	});

	it('keeps the drinks it has while the next page loads', () => {
		const wrapper = mountResults({ matches: [match('a')], loading: true });

		expect(wrapper.findAll('[data-testid="drink"]')).toHaveLength(1);
		expect(wrapper.find('[data-testid="my-bar-loading"]').exists()).toBe(true);
		expect(button(wrapper, 'organisms.myBar.results.loadMore')).toBeUndefined();
	});
});
