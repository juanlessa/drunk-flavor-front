import { mount } from '@vue/test-utils';
import { describe, it, expect } from 'vitest';
import Button from './Button.vue';

describe('Button', () => {
	describe('rendering', () => {
		it('renders with default props', () => {
			const wrapper = mount(Button);
			const button = wrapper.find('button');

			expect(button.exists()).toBe(true);
			expect(button.attributes('type')).toBe('button');
			expect(button.attributes('disabled')).toBeUndefined();
		});

		it('renders the value prop as text content', () => {
			const wrapper = mount(Button, { props: { value: 'Click me' } });

			expect(wrapper.text()).toContain('Click me');
		});

		it('renders slot content over value prop', () => {
			const wrapper = mount(Button, {
				props: { value: 'Fallback' },
				slots: { default: 'Slot Content' }
			});

			expect(wrapper.text()).toContain('Slot Content');
			expect(wrapper.text()).not.toContain('Fallback');
		});
	});

	describe('props', () => {
		it('applies disabled attribute when disabled is true', () => {
			const wrapper = mount(Button, { props: { disabled: true } });

			expect(wrapper.find('button').attributes('disabled')).toBeDefined();
		});

		it('sets the correct type attribute', () => {
			const wrapper = mount(Button, { props: { type: 'submit' } });

			expect(wrapper.find('button').attributes('type')).toBe('submit');
		});

		it('applies primary variant classes by default', () => {
			const wrapper = mount(Button);

			expect(wrapper.find('button').classes()).toContain('bg-accent');
		});

		it('applies secondary variant classes', () => {
			const wrapper = mount(Button, { props: { variant: 'secondary' } });

			expect(wrapper.find('button').classes()).toContain('bg-surface-input');
		});

		it('applies delete variant classes', () => {
			const wrapper = mount(Button, { props: { variant: 'delete' } });

			expect(wrapper.find('button').classes()).toContain('bg-danger-emphasis');
		});

		it('applies outline variant classes', () => {
			const wrapper = mount(Button, { props: { variant: 'outline' } });

			expect(wrapper.find('button').classes()).toContain('bg-surface-transparent');
		});

		// Regression: tailwind-merge used to treat the custom `text-body` size and
		// the custom `text-content*` colours as one conflict group, so the size
		// silently stripped the text colour and buttons fell back to the browser
		// default (visible as dark text in dark theme).
		it.each([
			['primary', 'text-content-on-accent'],
			['secondary', 'text-content'],
			['delete', 'text-content-on-accent'],
			['outline', 'text-content']
		] as const)('keeps both the text colour and the font size on %s', (variant, colour) => {
			const wrapper = mount(Button, { props: { variant } });
			const classes = wrapper.find('button').classes();

			expect(classes).toContain(colour);
			expect(classes).toContain('text-body');
		});

		it('applies sm size classes', () => {
			const wrapper = mount(Button, { props: { size: 'sm' } });

			expect(wrapper.find('button').classes()).toContain('py-1');
			expect(wrapper.find('button').classes()).toContain('text-body-sm');
		});

		it('applies md size classes by default', () => {
			const wrapper = mount(Button);

			expect(wrapper.find('button').classes()).toContain('py-2');
			expect(wrapper.find('button').classes()).toContain('text-body');
		});

		it('applies the ariaLabel as aria-label', () => {
			const wrapper = mount(Button, { props: { ariaLabel: 'remove ingredient' } });

			expect(wrapper.attributes('aria-label')).toBe('remove ingredient');
		});

		it('omits aria-label when no ariaLabel is given', () => {
			const wrapper = mount(Button, { props: { value: 'done' } });

			expect(wrapper.attributes('aria-label')).toBeUndefined();
		});
	});

	// The icon and plain variants replace the former IconButton and mimic Anchor.
	// Both must stay free of the filled pill geometry that lives in the other
	// variants, otherwise they render full width with pill padding.
	describe('bare variants', () => {
		it('gives the icon variant a square hit area and hover surface', () => {
			const wrapper = mount(Button, { props: { variant: 'icon' } });
			const classes = wrapper.find('button').classes();

			expect(classes).toContain('p-1');
			expect(classes).toContain('rounded-icon-action');
			expect(classes).toContain('enabled:hover:bg-surface-hover');
			expect(classes).toContain('disabled:opacity-disabled');
		});

		it('renders the plain variant with bare content colour, like an Anchor', () => {
			const wrapper = mount(Button, { props: { variant: 'plain' } });
			const classes = wrapper.find('button').classes();

			expect(classes).toContain('text-content');
			expect(classes).toContain('text-body');
			expect(classes).toContain('bg-surface-transparent');
		});

		it.each(['icon', 'plain'] as const)('keeps %s free of the pill geometry', (variant) => {
			const wrapper = mount(Button, { props: { variant } });
			const classes = wrapper.find('button').classes();

			expect(classes).not.toContain('w-full');
			expect(classes).not.toContain('rounded-full');
			expect(classes).not.toContain('px-4');
			expect(classes).not.toContain('py-2');
			expect(classes).not.toContain('text-center');
		});

		it.each(['primary', 'secondary', 'delete', 'outline'] as const)(
			'keeps the pill geometry on %s',
			(variant) => {
				const wrapper = mount(Button, { props: { variant } });
				const classes = wrapper.find('button').classes();

				expect(classes).toContain('w-full');
				expect(classes).toContain('rounded-full');
				expect(classes).toContain('px-4');
				expect(classes).toContain('py-2');
			}
		);
	});

	describe('events', () => {
		it('emits click event when clicked', async () => {
			const wrapper = mount(Button);
			await wrapper.find('button').trigger('click');

			expect(wrapper.emitted('click')).toHaveLength(1);
		});

		it('does not emit click event when disabled', async () => {
			const wrapper = mount(Button, { props: { disabled: true } });
			await wrapper.find('button').trigger('click');

			expect(wrapper.emitted('click')).toBeUndefined();
		});
	});
});
