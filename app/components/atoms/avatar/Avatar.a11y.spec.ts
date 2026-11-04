import { mount } from '@vue/test-utils';
import { describe, it } from 'vitest';
import { expectNoA11yViolations } from '~/test/axe';
import Avatar from './Avatar.vue';

describe('Avatar accessibility', () => {
	it('has no violations for the fallback state', async () => {
		const wrapper = mount(Avatar, {
			props: { alt: 'User avatar', fallbackDelay: 0 },
			attachTo: document.body
		});

		await expectNoA11yViolations(wrapper.element);
		wrapper.unmount();
	});

	it.each(['xs', 'sm', 'md', 'lg'] as const)(
		'has no violations for the %s size',
		async (size) => {
			const wrapper = mount(Avatar, {
				props: { alt: 'User avatar', size, fallbackDelay: 0 },
				attachTo: document.body
			});

			await expectNoA11yViolations(wrapper.element);
			wrapper.unmount();
		}
	);
});
