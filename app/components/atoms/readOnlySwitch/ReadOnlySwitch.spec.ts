import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import ReadOnlySwitch from './ReadOnlySwitch.vue';

const mountSwitch = (checked?: boolean) =>
	mount(ReadOnlySwitch, {
		props: checked === undefined ? {} : { checked },
		global: { mocks: { $t: (key: string) => key } }
	});

describe('ReadOnlySwitch', () => {
	it('says yes when checked', () => {
		const wrapper = mountSwitch(true);
		expect(wrapper.attributes('data-state')).toBe('checked');
		expect(wrapper.text()).toBe('molecules.readOnlyField.yes');
	});

	it('says no when not checked, which is the default', () => {
		const wrapper = mountSwitch();
		expect(wrapper.attributes('data-state')).toBe('unchecked');
		expect(wrapper.text()).toBe('molecules.readOnlyField.no');
	});

	it('takes the exact size of InputSwitch', () => {
		expect(mountSwitch(true).classes()).toEqual(expect.arrayContaining(['w-14', 'h-8']));
		expect(mountSwitch(false).classes()).toEqual(expect.arrayContaining(['w-14', 'h-8']));
	});

	it('uses the success colors and a check when checked, and neutral colors and an x when not', () => {
		const yes = mountSwitch(true);
		expect(yes.classes()).toEqual(
			expect.arrayContaining(['bg-success-surface', 'text-success'])
		);
		expect(yes.findComponent({ name: 'CheckIcon' }).exists()).toBe(true);
		expect(yes.findComponent({ name: 'CloseIcon' }).exists()).toBe(false);
		const no = mountSwitch(false);
		expect(no.classes()).toEqual(
			expect.arrayContaining(['bg-surface-control', 'text-content-muted'])
		);
		expect(no.findComponent({ name: 'CloseIcon' }).exists()).toBe(true);
		expect(no.findComponent({ name: 'CheckIcon' }).exists()).toBe(false);
	});

	it('is not a control: nothing to focus or toggle', () => {
		const wrapper = mountSwitch(true);
		expect(wrapper.find('button, input, [role="switch"], [tabindex]').exists()).toBe(false);
	});
});
