import { mount } from '@vue/test-utils';
import { describe, it, expect } from 'vitest';
import TextList from './TextList.vue';

describe('TextList', () => {
	describe('rendering', () => {
		it('renders a <ul> element by default', () => {
			const wrapper = mount(TextList);

			expect(wrapper.element.tagName).toBe('UL');
		});

		it('renders an <ol> element when as is ol', () => {
			const wrapper = mount(TextList, { props: { as: 'ol' } });

			expect(wrapper.element.tagName).toBe('OL');
		});

		it('renders items from the items prop', () => {
			const wrapper = mount(TextList, {
				props: { items: ['Apple', 'Banana', 'Cherry'] }
			});
			const items = wrapper.findAll('li');

			expect(items).toHaveLength(3);
			expect(items[0]!.text()).toBe('Apple');
			expect(items[1]!.text()).toBe('Banana');
			expect(items[2]!.text()).toBe('Cherry');
		});

		it('renders slot content over items prop', () => {
			const wrapper = mount(TextList, {
				props: { items: ['Should not appear'] },
				slots: { default: '<li>Slot Item</li>' }
			});

			expect(wrapper.text()).toContain('Slot Item');
			expect(wrapper.text()).not.toContain('Should not appear');
		});

		it('renders empty list when no items or slot', () => {
			const wrapper = mount(TextList);
			const items = wrapper.findAll('li');

			expect(items).toHaveLength(0);
		});
	});

	describe('reversed', () => {
		it('applies reversed attribute on ol', () => {
			const wrapper = mount(TextList, {
				props: { as: 'ol', reversed: true, marker: 'decimal' }
			});

			expect(wrapper.attributes('reversed')).toBeDefined();
		});

		it('does not apply reversed attribute on ul', () => {
			const wrapper = mount(TextList, {
				props: { as: 'ul', reversed: true }
			});

			expect(wrapper.attributes('reversed')).toBeUndefined();
		});
	});

	describe('styling', () => {
		it('applies default text-body class', () => {
			const wrapper = mount(TextList);

			expect(wrapper.classes()).toContain('text-body');
		});

		it('applies default font-regular class', () => {
			const wrapper = mount(TextList);

			expect(wrapper.classes()).toContain('font-regular');
		});

		it('applies disc marker class', () => {
			const wrapper = mount(TextList, { props: { marker: 'disc' } });

			expect(wrapper.classes()).toContain('list-disc');
		});

		it('applies none marker class with no padding', () => {
			const wrapper = mount(TextList, { props: { marker: 'none' } });

			expect(wrapper.classes()).toContain('list-none');
			expect(wrapper.classes()).toContain('pl-0');
		});

		it('applies decimal marker class for ol', () => {
			const wrapper = mount(TextList, { props: { as: 'ol', marker: 'decimal' } });

			expect(wrapper.classes()).toContain('list-decimal');
		});

		it('applies gap-0 for none gap', () => {
			const wrapper = mount(TextList, { props: { gap: 'none' } });

			expect(wrapper.classes()).toContain('gap-0');
		});

		it('applies default gap class (md)', () => {
			const wrapper = mount(TextList);

			expect(wrapper.classes()).toContain('gap-2');
		});
	});
});
