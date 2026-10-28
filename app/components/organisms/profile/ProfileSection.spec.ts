import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import ProfileSection from './ProfileSection.vue';

const mountSection = (props = {}) =>
	mount(ProfileSection, {
		props: { title: 'Account section', description: 'Section description', ...props },
		slots: { icon: '<svg data-testid="icon" />', default: '<div>Section content</div>' },
		global: {
			stubs: {
				Card: { name: 'Card', template: '<div><slot /></div>' },
				Heading: { props: ['id'], template: '<h2 :id="id"><slot /></h2>' },
				Text: { template: '<p><slot /></p>' }
			}
		}
	});

describe('ProfileSection', () => {
	it('associates the section with its heading and renders slots', () => {
		const wrapper = mountSection();
		const section = wrapper.find('section');

		expect(wrapper.text()).toContain('Account section');
		expect(wrapper.text()).toContain('Section content');
		expect(section.attributes('aria-labelledby')).toBe(wrapper.find('h2').attributes('id'));
	});

	it('applies danger treatment without changing its content contract', () => {
		const wrapper = mountSection({ tone: 'danger' });

		expect(wrapper.findComponent({ name: 'Card' }).classes()).toContain('border-danger-stroke');
		expect(wrapper.find('h2').classes()).toContain('text-danger');
	});
});
