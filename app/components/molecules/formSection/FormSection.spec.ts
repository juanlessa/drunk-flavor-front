import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import FormSection from './FormSection.vue';

const mountSection = (props = {}) =>
	mount(FormSection, {
		props: { title: 'Names', ...props },
		slots: { default: '<div>Section fields</div>' },
		global: {
			stubs: {
				Card: { template: '<div><slot /></div>' },
				Heading: { props: ['id'], template: '<h2 :id="id"><slot /></h2>' },
				Text: { template: '<p><slot /></p>' }
			}
		}
	});

describe('FormSection', () => {
	it('labels the section with its heading and renders the fields', () => {
		const wrapper = mountSection({ description: 'Singular and plural' });
		const section = wrapper.find('section');

		expect(section.attributes('aria-labelledby')).toBe(wrapper.find('h2').attributes('id'));
		expect(wrapper.text()).toContain('Names');
		expect(wrapper.text()).toContain('Singular and plural');
		expect(wrapper.text()).toContain('Section fields');
	});

	it('omits the description when there is none', () => {
		expect(mountSection().find('p').exists()).toBe(false);
	});
});
