import { mount } from '@vue/test-utils';
import { describe, it, expect } from 'vitest';
import TextList from './TextList.vue';

describe('TextList', () => {
	describe('rendering', () => {
		it('renders a <ul> element by default', () => {
			const wrapper = mount(TextList);

			expect(wrapper.element.tagName).toBe('UL');
		});

		it('renders an <ol> element when type is ol', () => {
			const wrapper = mount(TextList, { props: { type: 'ol' } });

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
				props: { type: 'ol', reversed: true, marker: 'decimal' }
			});

			expect(wrapper.attributes('reversed')).toBeDefined();
		});

		it('does not apply reversed attribute on ul', () => {
			const wrapper = mount(TextList, {
				props: { type: 'ul', reversed: true }
			});

			expect(wrapper.attributes('reversed')).toBeUndefined();
		});
	});

	describe('styling', () => {
		it('applies md size class by default', () => {
			const wrapper = mount(TextList);

			expect(wrapper.classes()).toContain('text-md');
		});

		it('applies lg size class', () => {
			const wrapper = mount(TextList, { props: { size: 'lg' } });

			expect(wrapper.classes()).toContain('text-lg');
		});

		it('applies regular weight class by default', () => {
			const wrapper = mount(TextList);

			expect(wrapper.classes()).toContain('font-regular');
		});

		it('applies bold weight class', () => {
			const wrapper = mount(TextList, { props: { weight: 'bold' } });

			expect(wrapper.classes()).toContain('font-bold');
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
			const wrapper = mount(TextList, { props: { type: 'ol', marker: 'decimal' } });

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
