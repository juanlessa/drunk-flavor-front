import { mount } from '@vue/test-utils';
import { describe, expect, it, vi } from 'vitest';
import type { User } from '~/domain/user/user.entity';
import UserAdministrationSummary from './UserAdministrationSummary.vue';

vi.stubGlobal('useI18n', () => ({ t: (key: string) => key }));

const user: User = {
	id: 'user-1',
	name: 'Bruno',
	surname: 'Costa',
	email: 'bruno.costa@example.com',
	emailVerified: false,
	role: 'partner',
	status: 'suspended',
	createdAt: new Date(),
	updatedAt: new Date()
};

describe('UserAdministrationSummary', () => {
	it('shows the identity, role, status and email verification', () => {
		const wrapper = mount(UserAdministrationSummary, {
			props: { user },
			global: {
				stubs: {
					Card: { template: '<div><slot /></div>' },
					Avatar: true,
					Heading: { template: '<h2><slot /></h2>' },
					Text: { template: '<p><slot /></p>' },
					Badge: {
						props: ['value', 'tone'],
						template: '<span :data-tone="tone">{{ value }}</span>'
					}
				},
				mocks: { $t: (key: string) => key }
			}
		});

		expect(wrapper.text()).toContain('Bruno Costa');
		expect(wrapper.text()).toContain('bruno.costa@example.com');
		expect(wrapper.find('[data-tone="warning"]').text()).toBe('users.statuses.suspended');
		expect(wrapper.text()).toContain('organisms.userAdministration.fields.notVerified');
	});
});
