import { mount } from '@vue/test-utils';
import { describe, it, expect } from 'vitest';
import InputTextArea from './InputTextArea.vue';

describe('InputTextArea', () => {
	describe('rendering', () => {
		it('renders a <textarea> element', () => {
			const wrapper = mount(InputTextArea);

			expect(wrapper.find('textarea').exists()).toBe(true);
		});

		it('applies the id attribute', () => {
			const wrapper = mount(InputTextArea, { props: { id: 'description' } });

			expect(wrapper.find('textarea').attributes('id')).toBe('description');
		});

		it('applies the name attribute', () => {
			const wrapper = mount(InputTextArea, { props: { name: 'bio' } });

			expect(wrapper.find('textarea').attributes('name')).toBe('bio');
		});

		it('applies the placeholder attribute', () => {
			const wrapper = mount(InputTextArea, { props: { placeholder: 'Write here' } });

			expect(wrapper.find('textarea').attributes('placeholder')).toBe('Write here');
		});

		it('applies the rows attribute', () => {
			const wrapper = mount(InputTextArea, { props: { rows: 10 } });

			expect(wrapper.find('textarea').attributes('rows')).toBe('10');
		});

		it('renders with 6 rows by default', () => {
			const wrapper = mount(InputTextArea);

			expect(wrapper.find('textarea').attributes('rows')).toBe('6');
		});

		it('renders the modelValue as textarea value', () => {
			const wrapper = mount(InputTextArea, { props: { modelValue: 'Hello' } });

			expect(wrapper.find('textarea').element.value).toBe('Hello');
		});
	});

	describe('events', () => {
		it('emits update:modelValue on input', async () => {
			const wrapper = mount(InputTextArea);
			const textarea = wrapper.find('textarea');

			await textarea.setValue('New text');

			expect(wrapper.emitted('update:modelValue')).toBeTruthy();
			expect(wrapper.emitted('update:modelValue')![0]).toEqual(['New text']);
		});

		it('emits blur on blur', async () => {
			const wrapper = mount(InputTextArea);
			const textarea = wrapper.find('textarea');

			await textarea.trigger('blur');

			expect(wrapper.emitted('blur')).toHaveLength(1);
		});
	});

	describe('styling', () => {
		it('applies error border when hasError is true', () => {
			const wrapper = mount(InputTextArea, { props: { hasError: true } });

			expect(wrapper.find('textarea').classes().some((c) => c.includes('border-red'))).toBe(true);
		});

		it('does not apply error border by default', () => {
			const wrapper = mount(InputTextArea);

			expect(wrapper.find('textarea').classes().some((c) => c.includes('border-red'))).toBe(
				false
			);
		});
	});
});
