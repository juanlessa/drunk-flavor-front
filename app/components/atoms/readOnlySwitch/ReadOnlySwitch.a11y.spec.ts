import { mount } from '@vue/test-utils';
import { describe, it } from 'vitest';
import { expectNoA11yViolations } from '~/test/axe';
import ReadOnlySwitch from './ReadOnlySwitch.vue';

describe('ReadOnlySwitch accessibility', () => {
	it.each([true, false])('has no violations when checked is %s', async (checked) => {
		const wrapper = mount(ReadOnlySwitch, {
			props: { checked },
			global: { mocks: { $t: (key: string) => key } },
			attachTo: document.body
		});
		await expectNoA11yViolations(wrapper.element);
		wrapper.unmount();
	});
});
