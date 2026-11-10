import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import SearchSortToolbar from './SearchSortToolbar.vue';

const sortOptions = [
	{ label: 'Best rated', value: 'rating' },
	{ label: 'Name (A–Z)', value: 'name' },
	{ label: 'Newest', value: 'recent' }
];

const mountToolbar = (props: Record<string, unknown> = {}) =>
	mount(SearchSortToolbar, {
		props: {
			searchId: 'drinks-search',
			searchLabel: 'Search drinks',
			searchPlaceholder: 'Search drinks by name',
			sortId: 'drinks-sort',
			sortLabel: 'Sort by',
			sortOptions,
			sort: 'rating',
			...props
		},
		global: {
			stubs: {
				Label: { props: ['for'], template: '<label :for="$props.for"><slot /></label>' },
				InputText: {
					props: ['modelValue', 'id', 'placeholder'],
					emits: ['update:modelValue'],
					template:
						'<input :id="id" :placeholder="placeholder" :value="modelValue" @input="$emit(\'update:modelValue\', $event.target.value)" />'
				},
				SortSelect: {
					props: ['modelValue', 'id', 'options', 'label'],
					emits: ['update:modelValue'],
					template:
						'<div><span>{{ label }}</span><select :id="id" :value="modelValue" @change="$emit(\'update:modelValue\', $event.target.value)"><option v-for="option in options" :key="option.value" :value="option.value">{{ option.label }}</option></select></div>'
				},
				SearchIcon: true
			}
		}
	});

describe('SearchSortToolbar', () => {
	it('labels the search field and shows its placeholder', () => {
		const wrapper = mountToolbar();

		expect(wrapper.find('label[for="drinks-search"]').text()).toBe('Search drinks');
		expect(wrapper.find('#drinks-search').attributes('placeholder')).toBe(
			'Search drinks by name'
		);
	});

	it('labels the sort control with a visible label', () => {
		const wrapper = mountToolbar();
		expect(wrapper.text()).toContain('Sort by');
	});
	it('hides the search label from sight only', () => {
		const wrapper = mountToolbar();

		expect(wrapper.find('label[for="drinks-search"]').classes()).toContain('sr-only');
	});

	it('offers every sort option', () => {
		const wrapper = mountToolbar();

		expect(wrapper.findAll('#drinks-sort option').map((option) => option.text())).toEqual([
			'Best rated',
			'Name (A–Z)',
			'Newest'
		]);
	});

	it('shows the current search and the current sort', () => {
		const wrapper = mountToolbar({ searchTerm: 'gin', sort: 'recent' });

		expect((wrapper.find('#drinks-search').element as HTMLInputElement).value).toBe('gin');
		expect((wrapper.find('#drinks-sort').element as HTMLSelectElement).value).toBe('recent');
	});

	it('emits the typed search term', async () => {
		const wrapper = mountToolbar();

		await wrapper.find('#drinks-search').setValue('mar');

		expect(wrapper.emitted('update:searchTerm')).toEqual([['mar']]);
	});

	it('emits the picked sort', async () => {
		const wrapper = mountToolbar();

		await wrapper.find('#drinks-sort').setValue('name');

		expect(wrapper.emitted('update:sort')).toEqual([['name']]);
	});

	it('starts without a search term', () => {
		const wrapper = mountToolbar();

		expect((wrapper.find('#drinks-search').element as HTMLInputElement).value).toBe('');
	});
});
