import { mount } from '@vue/test-utils';
import { describe, it } from 'vitest';
import { expectNoA11yViolations } from '~/test/axe';
import Button from '~/components/atoms/button/Button.vue';
import ManagementGroupRow from './ManagementGroupRow.vue';

const global = {
	components: { Button },
	mocks: { $t: (key: string) => key }
};

describe('ManagementGroupRow accessibility', () => {
	it.each<InstanceType<typeof ManagementGroupRow>['$props']>([
		{ variant: 'header', group: 'own' },
		{ variant: 'header', group: 'others' },
		{ variant: 'empty-own', createLabel: 'New unit' }
	])('has no violations with props %o', async (props) => {
		const wrapper = mount(ManagementGroupRow, { props, global, attachTo: document.body });

		await expectNoA11yViolations(wrapper.element);
		wrapper.unmount();
	});
});
