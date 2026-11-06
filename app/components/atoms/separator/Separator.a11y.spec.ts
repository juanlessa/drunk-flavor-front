import { mount } from '@vue/test-utils';
import { describe, it } from 'vitest';
import { expectNoA11yViolations } from '~/test/axe';
import Separator from './Separator.vue';

describe('Separator accessibility', () => {
	it('has no violations', async () => {
		const wrapper = mount(Separator, { attachTo: document.body });

		await expectNoA11yViolations(wrapper.element);
		wrapper.unmount();
	});
});
