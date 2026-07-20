import { mount } from '@vue/test-utils';
import { describe, it, expect } from 'vitest';
import InputWrapper from './InputWrapper.vue';
import Box from '~/components/atoms/box/Box.vue';

describe('InputWrapper', () => {
	describe('rendering', () => {
		it('renders a container div', () => {
			const wrapper = mount(InputWrapper, {
				global: { components: { Box } }
			});

			expect(wrapper.element.tagName).toBe('DIV');
		});

		it('renders default slot content', () => {
			const wrapper = mount(InputWrapper, {
				global: { components: { Box } },
				slots: { default: '<input type="text" />' }
			});

			expect(wrapper.find('input').exists()).toBe(true);
		});

		it('renders label slot', () => {
			const wrapper = mount(InputWrapper, {
				global: { components: { Box } },
				slots: { label: '<label>Name</label>' }
			});

			expect(wrapper.find('label').text()).toBe('Name');
		});

		it('renders error slot', () => {
			const wrapper = mount(InputWrapper, {
				global: { components: { Box } },
				slots: { error: '<span>Required field</span>' }
			});

			expect(wrapper.text()).toContain('Required field');
		});
	});

	describe('styling', () => {
		it('applies column direction by default', () => {
			const wrapper = mount(InputWrapper, {
				global: { components: { Box } }
			});
			const innerBox = wrapper.findAllComponents(Box).at(1);

			expect(innerBox).toBeDefined();
			expect(innerBox!.classes()).toContain('flex-col');
		});

		it('applies row direction when direction is row', () => {
			const wrapper = mount(InputWrapper, {
				global: { components: { Box } },
				props: { direction: 'row' }
			});
			const innerBox = wrapper.findAllComponents(Box).at(1);

			expect(innerBox).toBeDefined();
			expect(innerBox!.classes()).toContain('flex-row');
		});
	});
});
