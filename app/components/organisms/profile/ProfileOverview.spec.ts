import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import ProfileOverview from './ProfileOverview.vue';
import type { Profile } from '~/domain/profile/profile.entity';

const profile: Profile = {
	_id: 'user-1',
	name: 'Juan',
	surname: 'Lessa',
	email: 'juan@example.com',
	email_verified: true,
	role: 'member',
	status: 'active',
	created_at: new Date(),
	updated_at: new Date(),
	authentication_methods: { password: { enabled: true }, providers: ['google'] }
};

const mountOverview = () =>
	mount(ProfileOverview, {
		props: { profile },
		global: {
			stubs: {
				Heading: { template: '<h1><slot /></h1>' },
				Text: { template: '<p><slot /></p>' },
				ProfileDetailsForm: {
					props: ['profile'],
					template: '<div data-testid="details">{{ profile.email }}</div>'
				},
				PasswordSection: { template: '<div data-testid="password" />' },
				GoogleConnectionSection: {
					props: ['connected'],
					template: '<div data-testid="google" :data-connected="connected" />'
				},
				DeleteAccountSection: { template: '<div data-testid="deletion" />' }
			},
			mocks: { $t: (key: string) => key }
		}
	});

describe('ProfileOverview', () => {
	it('uses the standard page inset around the profile sections', () => {
		const wrapper = mountOverview();

		expect(wrapper.classes()).toContain('py-6');
		expect(wrapper.classes()).not.toContain('py-8');
		expect(wrapper.classes()).not.toContain('tablet:py-12');
	});

	it('composes all profile organisms from its profile prop', () => {
		const wrapper = mountOverview();

		expect(wrapper.find('[data-testid="details"]').text()).toContain('juan@example.com');
		expect(wrapper.find('[data-testid="password"]').exists()).toBe(true);
		expect(wrapper.find('[data-testid="google"]').attributes('data-connected')).toBe('true');
		expect(wrapper.find('[data-testid="deletion"]').exists()).toBe(true);
	});
});
