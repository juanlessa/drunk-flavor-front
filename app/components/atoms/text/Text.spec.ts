import { mount } from '@vue/test-utils';
import { describe, it, expect } from 'vitest';
import Text from './Text.vue';

describe('Text', () => {
	describe('rendering', () => {
		it('renders a <p> element by default', () => {
			const wrapper = mount(Text);

			expect(wrapper.element.tagName).toBe('P');
		});

		it('renders the value prop as text content', () => {
			const wrapper = mount(Text, { props: { value: 'Hello world' } });

			expect(wrapper.text()).toBe('Hello world');
		});

		it('renders slot content over value prop', () => {
			const wrapper = mount(Text, {
				props: { value: 'Fallback' },
				slots: { default: 'Slot Content' }
			});

			expect(wrapper.text()).toBe('Slot Content');
		});
	});

	describe('semantic element', () => {
		it('renders a <span> when as is span', () => {
			const wrapper = mount(Text, { props: { as: 'span' } });

			expect(wrapper.element.tagName).toBe('SPAN');
		});

		it('renders a <strong> when as is strong', () => {
			const wrapper = mount(Text, { props: { as: 'strong' } });

			expect(wrapper.element.tagName).toBe('STRONG');
		});
	});
});
