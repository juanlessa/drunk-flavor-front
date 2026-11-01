import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import Badge from './Badge.vue';

describe('Badge', () => {
	it('renders the value', () => {
		expect(mount(Badge, { props: { value: 'Active' } }).text()).toBe('Active');
	});

	it.each([
		['accent', 'bg-accent-subtle'],
		['success', 'bg-success-surface'],
		['warning', 'bg-warning-surface'],
		['neutral', 'bg-surface-control']
	] as const)('applies the %s tone', (tone, expectedClass) => {
		expect(mount(Badge, { props: { value: 'Label', tone } }).classes()).toContain(
			expectedClass
		);
	});
});
