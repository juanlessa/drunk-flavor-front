import { mount } from '@vue/test-utils';
import { describe, it } from 'vitest';
import { expectNoA11yViolations } from '~/test/axe';
import Text from './Text.vue';

describe('Text accessibility', () => {
	it.each(['p', 'span'] as const)('has no violations as %s', async (as) => {
		const wrapper = mount(Text, { props: { as, value: 'Some text' }, attachTo: document.body });

		await expectNoA11yViolations(wrapper.element);
		wrapper.unmount();
	});
});
