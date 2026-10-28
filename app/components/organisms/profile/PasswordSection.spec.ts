import { mount } from '@vue/test-utils';
import { describe, expect, it, vi } from 'vitest';
import PasswordSection from './PasswordSection.vue';

vi.mock('vue-i18n', () => ({ useI18n: () => ({ t: (key: string) => key }) }));
const mountSection = (hasPassword: boolean) =>
	mount(PasswordSection, {
		props: { hasPassword, providers: ['google'] },
		global: {
			stubs: {
				ProfileSection: {
					props: ['title', 'description'],
					template:
						'<section><span>{{ title }}</span><span>{{ description }}</span><slot name="icon" /><slot name="action" /></section>'
				},
				LockIcon: true,
				Button: {
					template: '<button @click="$emit(\'click\')"><slot /></button>',
					emits: ['click']
				},
				UpdatePasswordDialog: {
					props: ['open'],
					template: '<div data-testid="update-dialog" />'
				},
				CreatePasswordDialog: {
					props: ['open', 'providers'],
					template: '<div data-testid="create-dialog" />'
				}
			}
		}
	});

describe('PasswordSection', () => {
	it('presents update password for an account with credentials', () => {
		const wrapper = mountSection(true);

		expect(wrapper.text()).toContain('organisms.profile.password.update.openButton');
		expect(wrapper.find('[data-testid="update-dialog"]').exists()).toBe(true);
		expect(wrapper.find('[data-testid="create-dialog"]').exists()).toBe(false);
	});

	it('presents create password for a provider-only account', () => {
		const wrapper = mountSection(false);

		expect(wrapper.text()).toContain('organisms.profile.password.create.openButton');
		expect(wrapper.find('[data-testid="create-dialog"]').exists()).toBe(true);
		expect(wrapper.find('[data-testid="update-dialog"]').exists()).toBe(false);
	});
});
