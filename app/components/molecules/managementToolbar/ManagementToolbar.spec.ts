import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import ManagementToolbar from './ManagementToolbar.vue';

const mountToolbar = (searchTerm = '') =>
	mount(ManagementToolbar, {
		props: {
			searchId: 'units-search',
			searchLabel: 'Search units',
			searchPlaceholder: 'Search units by name',
			createLabel: 'New unit',
			searchTerm
		},
		global: {
			stubs: {
				Label: { template: '<label><slot /></label>' },
				InputText: {
					props: ['modelValue', 'id', 'placeholder'],
					emits: ['update:modelValue'],
					template:
						'<input :id="id" :placeholder="placeholder" :value="modelValue" @input="$emit(\'update:modelValue\', $event.target.value)" />'
				},
				Button: { template: '<button data-testid="create-desktop"><slot /></button>' },
				SearchIcon: true,
				PlusIcon: true
			}
		}
	});

describe('ManagementToolbar', () => {
	it('labels the search field and shows its placeholder', () => {
		const wrapper = mountToolbar();

		expect(wrapper.find('label').text()).toBe('Search units');
		expect(wrapper.find('#units-search').attributes('placeholder')).toBe(
			'Search units by name'
		);
	});

	it('emits the typed search term', async () => {
		const wrapper = mountToolbar();

		await wrapper.find('#units-search').setValue('gram');

		expect(wrapper.emitted('update:searchTerm')).toEqual([['gram']]);
	});

	it('emits create from the desktop button and from the mobile icon button', async () => {
		const wrapper = mountToolbar();

		await wrapper.find('[data-testid="create-desktop"]').trigger('click');
		await wrapper.find('button[aria-label="New unit"]').trigger('click');

		expect(wrapper.emitted('create')).toHaveLength(2);
		expect(wrapper.find('[data-testid="create-desktop"]').text()).toContain('New unit');
	});
});
