import { mount } from '@vue/test-utils';
import { describe, it } from 'vitest';
import { expectNoA11yViolations } from '~/test/axe';
import AnimatedPlaceHolder from './AnimatedPlaceHolder.vue';

describe('AnimatedPlaceHolder accessibility', () => {
	it('has no violations', async () => {
		const wrapper = mount(AnimatedPlaceHolder, { attachTo: document.body });

		await expectNoA11yViolations(wrapper.element);
		wrapper.unmount();
	});
});
