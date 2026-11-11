import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import ReadOnlyInput from './ReadOnlyInput.vue';

const mountInput = (props: Record<string, unknown>, slots = {}) =>
	mount(ReadOnlyInput, { props: { label: 'name', ...props }, slots });

describe('ReadOnlyInput', () => {
	it('shows the label and the value', () => {
		const wrapper = mountInput({ value: 'Milliliter' });
		expect(wrapper.find('dt').text()).toBe('name');
		expect(wrapper.find('dd').text()).toBe('Milliliter');
	});

	it('styles the label like the form label and the value like the text of an input', () => {
		const wrapper = mountInput({ value: 'Milliliter' });
		expect(wrapper.find('dt').classes()).toEqual(
			expect.arrayContaining(['text-body', 'font-regular', 'text-content'])
		);
		expect(wrapper.find('dd').classes()).toEqual(
			expect.arrayContaining(['text-body', 'font-regular', 'text-content', 'border-b-stroke'])
		);
	});

	it('shows a muted dash for an empty value', () => {
		const value = mountInput({}).find('dd');
		expect(value.text()).toBe('—');
		expect(value.classes()).toContain('text-content-muted');
	});

	it('shows the help under the value only when given', () => {
		expect(mountInput({ value: 'x' }).findAll('dd')).toHaveLength(1);
		const help = mountInput({ value: 'x', help: 'Used in Portuguese' }).findAll('dd')[1];
		expect(help?.text()).toBe('Used in Portuguese');
	});

	it('renders the slot instead of the value', () => {
		const wrapper = mountInput({ value: 'ignored' }, { default: '<em>custom</em>' });
		expect(wrapper.find('dd').text()).toBe('custom');
	});

	it('styles a slot value like a typed value, not like an empty one', () => {
		const value = mountInput({}, { default: '<em>custom</em>' }).find('dd');
		expect(value.classes()).toContain('text-content');
		expect(value.classes()).not.toContain('text-content-muted');
	});

	it('renders the content of the after slot under the value', () => {
		const wrapper = mountInput({ value: 'x' }, { after: '<ol data-testid="rest" />' });
		const items = wrapper.findAll('dd');
		expect(items).toHaveLength(2);
		expect(items[1]?.find('[data-testid="rest"]').exists()).toBe(true);
	});
});
