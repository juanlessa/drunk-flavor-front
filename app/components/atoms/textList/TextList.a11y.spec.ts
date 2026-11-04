import { mount } from '@vue/test-utils';
import { describe, it } from 'vitest';
import { expectNoA11yViolations } from '~/test/axe';
import TextList from './TextList.vue';

describe('TextList accessibility', () => {
	it.each(['ul', 'ol'] as const)('has no violations as %s', async (as) => {
		const wrapper = mount(TextList, {
			props: { as, marker: as === 'ol' ? 'decimal' : 'disc', items: ['One', 'Two', 'Three'] },
			attachTo: document.body
		});

		await expectNoA11yViolations(wrapper.element);
		wrapper.unmount();
	});
});
