import { mount } from '@vue/test-utils';
import { describe, it } from 'vitest';
import { expectNoA11yViolations } from '~/test/axe';
import AnimatedPlaceHolder from '~/components/atoms/animatedPlaceholder/AnimatedPlaceHolder.vue';
import ManagementItemCardSkeleton from './ManagementItemCardSkeleton.vue';

describe('ManagementItemCardSkeleton accessibility', () => {
	it.each<{ media?: boolean }>([{}, { media: true }])(
		'has no violations with props %o',
		async (props) => {
			const wrapper = mount(ManagementItemCardSkeleton, {
				props,
				global: { components: { AnimatedPlaceHolder } },
				attachTo: document.body
			});

			await expectNoA11yViolations(wrapper.element);
			wrapper.unmount();
		}
	);
});
