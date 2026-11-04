import { mount } from '@vue/test-utils';
import { describe, it } from 'vitest';
import { expectNoA11yViolations } from '~/test/axe';
import StarIcon from '~/components/icons/StarIcon.vue';
import RatingStars from './RatingStars.vue';

describe('RatingStars accessibility', () => {
	it.each([0, 2.5, 5])('has no violations for value %s', async (value) => {
		const wrapper = mount(RatingStars, {
			props: { value, label: `Rated ${value} out of 5` },
			global: { components: { StarIcon } },
			attachTo: document.body
		});

		await expectNoA11yViolations(wrapper.element);
		wrapper.unmount();
	});
});
