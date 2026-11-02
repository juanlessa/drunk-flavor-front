import { mount } from '@vue/test-utils';
import { describe, expect, it, vi } from 'vitest';
import GoogleConnectionSection from './GoogleConnectionSection.vue';

vi.mock('vue-i18n', () => ({ useI18n: () => ({ t: (key: string) => key }) }));
const mountSection = (connected: boolean) =>
	mount(GoogleConnectionSection, {
		props: { connected },
		global: {
			stubs: {
				ProfileSection: {
					props: ['title', 'description'],
					template:
						'<section><span>{{ title }}</span><span>{{ description }}</span><slot name="icon"/><slot name="action"/></section>'
				},
				GoogleIcon: true,
				CheckIcon: true,
				Text: { template: '<span><slot /></span>' },
				Button: {
					template: '<button @click="$emit(\'click\')"><slot /></button>',
					emits: ['click']
				},
				GoogleConnectionDialog: {
					props: ['open'],
					template: '<div data-testid="dialog" :data-open="open" />'
				}
			},
			mocks: { $t: (key: string) => key }
		}
	});

describe('GoogleConnectionSection', () => {
	it('shows connected status for a linked identity', () => {
		const wrapper = mountSection(true);
		expect(wrapper.text()).toContain('organisms.profile.google.connectedLabel');
		expect(wrapper.find('button').exists()).toBe(false);
	});

	it('opens the connection dialog when Google is not linked', async () => {
		const wrapper = mountSection(false);
		await wrapper.find('button').trigger('click');
		expect(wrapper.find('[data-testid="dialog"]').attributes('data-open')).toBe('true');
	});
});
