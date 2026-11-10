import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import ReadOnlyView from './ReadOnlyView.vue';

const mountView = () =>
	mount(ReadOnlyView, {
		props: { title: 'Liqueur', backTo: '/categories', backLabel: 'Categories' },
		slots: { default: '<section data-testid="content" />' },
		global: {
			stubs: {
				Anchor: { props: ['to'], template: '<a :href="to"><slot /></a>' },
				Heading: { template: '<h1><slot /></h1>' },
				Button: { template: '<button data-testid="back-button"><slot /></button>' },
				ArrowLeftIcon: true,
				InfoIcon: true,
				LockIcon: true
			},
			mocks: {
				$t: (key: string, params?: { section?: string }) =>
					params ? `${key}:${params.section}` : key
			}
		}
	});

describe('ReadOnlyView', () => {
	it('shows the title with the read-only badge', () => {
		const wrapper = mountView();

		expect(wrapper.find('h1').text()).toBe('Liqueur');
		expect(wrapper.text()).toContain('organisms.readOnlyView.badge');
	});

	it('explains why the record cannot be edited', () => {
		expect(mountView().find('[role="note"]').text()).toBe('organisms.readOnlyView.notice');
	});

	it('links back to the list', () => {
		const link = mountView().find('a');

		expect(link.attributes('href')).toBe('/categories');
		expect(link.text()).toBe('Categories');
	});

	it('renders the sections', () => {
		expect(mountView().find('[data-testid="content"]').exists()).toBe(true);
	});

	it('names the section in the back button and emits back when clicked', async () => {
		const wrapper = mountView();
		const button = wrapper.find('[data-testid="back-button"]');

		expect(button.text()).toBe('organisms.readOnlyView.backButton:Categories');

		await button.trigger('click');

		expect(wrapper.emitted('back')).toHaveLength(1);
	});

	it('offers no save or cancel action', () => {
		expect(mountView().findAll('button')).toHaveLength(1);
	});
});
