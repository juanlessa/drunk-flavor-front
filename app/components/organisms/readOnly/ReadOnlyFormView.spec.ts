import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import ReadOnlyFormView from './ReadOnlyFormView.vue';

const mountView = () =>
	mount(ReadOnlyFormView, {
		props: { title: 'Milliliter', backTo: '/units', backLabel: 'Units' },
		slots: { default: '<section data-testid="content" />' },
		global: {
			stubs: {
				Anchor: { props: ['to'], template: '<a :href="to"><slot /></a>' },
				Heading: { template: '<h1><slot /></h1>' },
				Button: { template: '<button data-testid="back-button"><slot /></button>' },
				ArrowLeftIcon: true,
				InfoIcon: true
			},
			mocks: {
				$t: (key: string, params?: { section?: string }) =>
					params ? `${key}:${params.section}` : key
			}
		}
	});

describe('ReadOnlyFormView', () => {
	it('is titled with the record name, without a read-only badge', () => {
		const wrapper = mountView();
		expect(wrapper.find('h1').text()).toBe('Milliliter');
		expect(wrapper.text()).not.toContain('organisms.readOnlyView.badge');
	});

	it('says why the record cannot be edited, in the header', () => {
		const note = mountView().find('header [role="note"]');
		expect(note.text()).toBe('organisms.readOnlyFormView.notice');
	});

	it('links back to the list', () => {
		const link = mountView().find('a');
		expect(link.attributes('href')).toBe('/units');
		expect(link.text()).toBe('Units');
	});

	it('renders the sections', () => {
		expect(mountView().find('[data-testid="content"]').exists()).toBe(true);
	});

	it('offers only a way back, which emits back', async () => {
		const wrapper = mountView();
		const buttons = wrapper.findAll('button');
		expect(buttons).toHaveLength(1);
		expect(buttons[0]?.text()).toBe('organisms.readOnlyView.backButton:Units');
		await buttons[0]?.trigger('click');
		expect(wrapper.emitted('back')).toHaveLength(1);
	});
});
