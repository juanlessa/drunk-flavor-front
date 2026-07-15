import { mount } from '@vue/test-utils';
import { describe, it, expect } from 'vitest';
import InputWrapper from './InputWrapper.vue';

describe('InputWrapper', () => {
	describe('rendering', () => {
		it('renders a container div', () => {
			const wrapper = mount(InputWrapper);

			expect(wrapper.element.tagName).toBe('DIV');
		});

		it('renders default slot content', () => {
			const wrapper = mount(InputWrapper, {
				slots: { default: '<input type="text" />' }
			});

			expect(wrapper.find('input').exists()).toBe(true);
		});

		it('renders label slot', () => {
			const wrapper = mount(InputWrapper, {
				slots: { label: '<label>Name</label>' }
			});

			expect(wrapper.find('label').text()).toBe('Name');
		});

		it('renders error slot', () => {
			const wrapper = mount(InputWrapper, {
				slots: { error: '<span>Required field</span>' }
			});

			expect(wrapper.text()).toContain('Required field');
		});
	});

	describe('styling', () => {
		it('applies column direction by default', () => {
			const wrapper = mount(InputWrapper);
			const innerContainer = wrapper.find('.flex.gap-2');

			expect(innerContainer.classes()).toContain('flex-col');
		});

		it('applies row direction when direction is row', () => {
			const wrapper = mount(InputWrapper, { props: { direction: 'row' } });
			const innerContainer = wrapper.find('.flex.gap-2');

			expect(innerContainer.classes()).toContain('flex-row');
		});
	});
});
