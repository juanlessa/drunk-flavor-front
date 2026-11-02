import { mount } from '@vue/test-utils';
import { describe, expect, it, vi } from 'vitest';
import type { User } from '~/domain/user/user.entity';
import UserCard from './UserCard.vue';

vi.stubGlobal('useI18n', () => ({ t: (key: string) => key }));

const baseUser = {
	id: 'user-1',
	email: 'bruno.costa@example.com',
	emailVerified: true,
	role: 'partner',
	createdAt: new Date(),
	updatedAt: new Date()
} as const;

const mountCard = (user: User) =>
	mount(UserCard, {
		props: { user },
		global: {
			stubs: {
				Avatar: true,
				Text: { template: '<span><slot /></span>' },
				Badge: {
					props: ['value', 'tone'],
					template: '<span :data-tone="tone">{{ value }}</span>'
				}
			},
			mocks: { $t: (key: string) => key }
		}
	});

describe('UserCard', () => {
	it('shows the name, email, role and status', () => {
		const wrapper = mountCard({
			...baseUser,
			name: 'Bruno',
			surname: 'Costa',
			status: 'active'
		});

		expect(wrapper.text()).toContain('Bruno Costa');
		expect(wrapper.text()).toContain('bruno.costa@example.com');
		expect(wrapper.text()).toContain('users.roles.partner');
		expect(wrapper.find('[data-tone="success"]').text()).toBe('users.statuses.active');
	});

	it('uses the email as the primary line for an incomplete profile', () => {
		const wrapper = mountCard({ ...baseUser, status: 'incomplete_profile' });

		expect(wrapper.text()).toContain('bruno.costa@example.com');
		expect(wrapper.text()).toContain('organisms.usersControlOverview.noName');
	});

	it('emits click when selected', async () => {
		const wrapper = mountCard({
			...baseUser,
			name: 'Bruno',
			surname: 'Costa',
			status: 'active'
		});

		await wrapper.find('button').trigger('click');

		expect(wrapper.emitted('click')).toHaveLength(1);
	});
});
