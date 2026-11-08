import { mount } from '@vue/test-utils';
import { describe, it } from 'vitest';
import { expectNoA11yViolations } from '~/test/axe';
import Badge from './Badge.vue';

describe('Badge accessibility', () => {
	it.each(['accent', 'success', 'warning', 'danger', 'neutral'] as const)(
		'has no violations for the %s tone',
		async (tone) => {
			const wrapper = mount(Badge, {
				props: { value: 'Label', tone },
				attachTo: document.body
			});

			await expectNoA11yViolations(wrapper.element);
			wrapper.unmount();
		}
	);
});
