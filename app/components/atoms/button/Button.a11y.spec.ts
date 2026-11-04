import { mount } from '@vue/test-utils';
import { describe, it, expect } from 'vitest';
import { expectNoA11yViolations } from '~/test/axe';
import Button from './Button.vue';

describe('Button accessibility', () => {
	it('has no violations with visible text', async () => {
		const wrapper = mount(Button, { props: { value: 'Save' }, attachTo: document.body });

		await expectNoA11yViolations(wrapper.element);
		wrapper.unmount();
	});

	it.each(['primary', 'secondary', 'delete', 'outline', 'plain'] as const)(
		'has no violations for the %s variant',
		async (variant) => {
			const wrapper = mount(Button, {
				props: { value: 'Save', variant },
				attachTo: document.body
			});

			await expectNoA11yViolations(wrapper.element);
			wrapper.unmount();
		}
	);

	it('has no violations when disabled', async () => {
		const wrapper = mount(Button, {
			props: { value: 'Save', disabled: true },
			attachTo: document.body
		});

		await expectNoA11yViolations(wrapper.element);
		wrapper.unmount();
	});

	it('has no violations for the icon variant with an aria-label', async () => {
		const wrapper = mount(Button, {
			props: { variant: 'icon', ariaLabel: 'Close' },
			slots: { default: '<svg aria-hidden="true" width="16" height="16"></svg>' },
			attachTo: document.body
		});

		await expectNoA11yViolations(wrapper.element);
		wrapper.unmount();
	});

	it('reports a violation for the icon variant without an accessible name', async () => {
		const wrapper = mount(Button, {
			props: { variant: 'icon' },
			slots: { default: '<svg aria-hidden="true" width="16" height="16"></svg>' },
			attachTo: document.body
		});

		await expect(expectNoA11yViolations(wrapper.element)).rejects.toThrow('button-name');
		wrapper.unmount();
	});
});
