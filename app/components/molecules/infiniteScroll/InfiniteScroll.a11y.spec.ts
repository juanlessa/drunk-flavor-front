import { mount } from '@vue/test-utils';
import { describe, it } from 'vitest';
import { expectNoA11yViolations } from '~/test/axe';
import InfiniteScroll from './InfiniteScroll.vue';

describe('InfiniteScroll accessibility', () => {
	it('has no violations with content', async () => {
		const wrapper = mount(InfiniteScroll, {
			slots: { default: '<p>First</p><p>Second</p>' },
			attachTo: document.body
		});

		await expectNoA11yViolations(wrapper.element);
		wrapper.unmount();
	});
});
