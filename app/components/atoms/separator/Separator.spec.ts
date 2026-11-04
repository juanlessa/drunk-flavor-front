import { mount } from '@vue/test-utils';
import { describe, it, expect } from 'vitest';
import Separator from './Separator.vue';

describe('Separator', () => {
	it('renders a decorative line hidden from assistive technologies', () => {
		const wrapper = mount(Separator);

		expect(wrapper.attributes('aria-hidden')).toBe('true');
	});
});
