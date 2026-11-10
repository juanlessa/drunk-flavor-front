import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import ManagementGroupRow from './ManagementGroupRow.vue';

const global = {
	stubs: {
		Button: {
			template: '<button data-testid="create"><slot /></button>'
		}
	},
	mocks: { $t: (key: string) => key }
};

describe('ManagementGroupRow', () => {
	it.each(['own', 'others'] as const)('renders the %s group header', (group) => {
		const wrapper = mount(ManagementGroupRow, { props: { variant: 'header', group }, global });

		expect(wrapper.find('h2').text()).toBe(`molecules.managementGroupRow.${group}.title`);
		expect(wrapper.text()).toContain(`molecules.managementGroupRow.${group}.description`);
	});

	it('renders the empty placeholder with a create action', async () => {
		const wrapper = mount(ManagementGroupRow, {
			props: { variant: 'empty-own', createLabel: 'New unit' },
			global
		});

		expect(wrapper.text()).toContain('molecules.managementGroupRow.emptyOwn.message');
		expect(wrapper.find('h2').exists()).toBe(false);

		await wrapper.find('[data-testid="create"]').trigger('click');

		expect(wrapper.text()).toContain('New unit');
		expect(wrapper.emitted('create')).toHaveLength(1);
	});
});
