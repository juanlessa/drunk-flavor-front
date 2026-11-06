import { mount } from '@vue/test-utils';
import { describe, it } from 'vitest';
import { expectNoA11yViolations } from '~/test/axe';
import StarIcon from '~/components/icons/StarIcon.vue';
import RatingInput from './RatingInput.vue';

const valueLabels = ['1 star', '2 stars', '3 stars', '4 stars', '5 stars'];

describe('RatingInput accessibility', () => {
	it.each([{}, { modelValue: 3 }, { disabled: true }])(
		'has no violations with props %o',
		async (props) => {
			const wrapper = mount(RatingInput, {
				props: { name: 'rating', label: 'Rating', valueLabels, ...props },
				global: { components: { StarIcon } },
				attachTo: document.body
			});

			await expectNoA11yViolations(wrapper.element);
			wrapper.unmount();
		}
	);
});
