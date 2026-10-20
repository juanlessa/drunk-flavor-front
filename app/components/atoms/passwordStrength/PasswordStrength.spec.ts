import { mount } from '@vue/test-utils';
import { describe, it, expect } from 'vitest';
import PasswordStrength from './PasswordStrength.vue';

const CheckIconStub = { template: '<svg data-testid="check-icon" />' };
const CloseIconStub = { template: '<svg data-testid="close-icon" />' };

const mountPasswordStrength = (props = {}) =>
	mount(PasswordStrength, {
		props,
		global: {
			stubs: { CheckIcon: CheckIconStub, CloseIcon: CloseIconStub },
			mocks: { $t: (key: string) => key }
		}
	});

describe('PasswordStrength', () => {
	describe('visibility', () => {
		it('renders nothing when inactive and password is empty', () => {
			const wrapper = mountPasswordStrength({ active: false, password: '' });

			expect(wrapper.find('[role="progressbar"]').exists()).toBe(false);
		});

		it('renders when active even with empty password', () => {
			const wrapper = mountPasswordStrength({ active: true, password: '' });

			expect(wrapper.find('[role="progressbar"]').exists()).toBe(true);
		});

		it('renders when password has content even if inactive', () => {
			const wrapper = mountPasswordStrength({ active: false, password: 'abc' });

			expect(wrapper.find('[role="progressbar"]').exists()).toBe(true);
		});
	});

	describe('progressbar', () => {
		it('exposes the met count via aria-valuenow', () => {
			const wrapper = mountPasswordStrength({ active: true, password: 'Password123!' });
			const bar = wrapper.find('[role="progressbar"]');

			expect(bar.attributes('aria-valuenow')).toBe('5');
			expect(bar.attributes('aria-valuemin')).toBe('0');
			expect(bar.attributes('aria-valuemax')).toBe('5');
		});

		it('uses the danger color for weak passwords', () => {
			const wrapper = mountPasswordStrength({ active: true, password: 'ab' });

			expect(wrapper.find('[class*="bg-danger"]').exists()).toBe(true);
		});

		it('uses the warning color for medium passwords', () => {
			const wrapper = mountPasswordStrength({ active: true, password: 'Abcdef1' });

			expect(wrapper.find('[class*="bg-warning"]').exists()).toBe(true);
		});

		it('uses the success color for strong passwords', () => {
			const wrapper = mountPasswordStrength({ active: true, password: 'Password123!' });

			expect(wrapper.find('[class*="bg-success"]').exists()).toBe(true);
		});
	});

	describe('checklist', () => {
		it('renders the five strength criteria when no confirmation is provided', () => {
			const wrapper = mountPasswordStrength({ active: true, password: 'abc' });

			expect(wrapper.findAll('li')).toHaveLength(5);
		});

		it('adds the match line only when confirmPassword is non-empty', () => {
			const wrapper = mountPasswordStrength({
				active: true,
				password: 'Password123!',
				confirmPassword: 'Password123!'
			});

			expect(wrapper.findAll('li')).toHaveLength(6);
		});

		it('marks met criteria with the check icon', () => {
			const wrapper = mountPasswordStrength({ active: true, password: 'Password123!' });

			expect(wrapper.findAll('[data-testid="check-icon"]')).toHaveLength(5);
			expect(wrapper.find('[data-testid="close-icon"]').exists()).toBe(false);
		});

		it('marks unmet criteria with the close icon', () => {
			const wrapper = mountPasswordStrength({ active: true, password: '' });

			expect(wrapper.findAll('[data-testid="close-icon"]')).toHaveLength(5);
		});
	});
});
