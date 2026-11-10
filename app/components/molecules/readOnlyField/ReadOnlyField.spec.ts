import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import ReadOnlyField from './ReadOnlyField.vue';

const global = {
	stubs: {
		Badge: {
			props: ['tone', 'value'],
			template: '<span data-testid="badge" :data-tone="tone">{{ value }}</span>'
		}
	},
	mocks: { $t: (key: string) => key }
};
const mountField = (props: Record<string, unknown>, slots = {}) =>
	mount(ReadOnlyField, { props: { label: 'name', ...props }, slots, global });

describe('ReadOnlyField', () => {
	it('shows the label and the value', () => {
		const wrapper = mountField({ value: 'Liqueur' });

		expect(wrapper.find('dt').text()).toBe('name');
		expect(wrapper.find('dd').text()).toBe('Liqueur');
	});

	it('shows a dash for an empty value', () => {
		expect(mountField({}).find('dd').text()).toBe('—');
	});

	it('shows a success badge for a true flag', () => {
		const badge = mountField({ flag: true }).find('[data-testid="badge"]');

		expect(badge.attributes('data-tone')).toBe('success');
		expect(badge.text()).toContain('molecules.readOnlyField.yes');
	});

	it('shows a neutral badge for a false flag', () => {
		const badge = mountField({ flag: false }).find('[data-testid="badge"]');

		expect(badge.attributes('data-tone')).toBe('neutral');
		expect(badge.text()).toBe('molecules.readOnlyField.no');
	});

	it('renders the slot instead of the value', () => {
		const wrapper = mountField({ value: 'ignored' }, { default: '<em>custom</em>' });

		expect(wrapper.find('dd').text()).toBe('custom');
	});
});
