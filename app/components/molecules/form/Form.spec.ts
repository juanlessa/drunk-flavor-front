import { mount } from '@vue/test-utils';
import { describe, it, expect } from 'vitest';
import Form from './Form.vue';

const HeadingStub = {
	template: '<h1><slot>{{ value }}</slot></h1>',
	props: ['value', 'type', 'size']
};
const ButtonGroupStub = {
	template: '<div data-testid="button-group" @click="$emit(\'cancel\')"><slot /></div>',
	props: ['cancelButtonProps', 'actionButtonProps'],
	emits: ['cancel']
};

const mountForm = (props = {}, slots = {}) =>
	mount(Form, {
		props,
		slots,
		global: {
			stubs: { Heading: HeadingStub, ButtonGroup: ButtonGroupStub }
		}
	});

describe('Form', () => {
	describe('rendering', () => {
		it('renders a <form> element', () => {
			const wrapper = mountForm();

			expect(wrapper.element.tagName).toBe('FORM');
		});

		it('renders the title prop via Heading', () => {
			const wrapper = mountForm({ title: 'Create Item' });

			expect(wrapper.text()).toContain('Create Item');
		});

		it('does not render title section when no title or title slot', () => {
			const wrapper = mountForm();
			const headings = wrapper.findAll('h1');

			expect(headings).toHaveLength(0);
		});

		it('renders default slot content', () => {
			const wrapper = mountForm({}, { default: '<input type="text" />' });

			expect(wrapper.find('input').exists()).toBe(true);
		});

		it('renders ButtonGroup by default', () => {
			const wrapper = mountForm();

			expect(wrapper.find('[data-testid="button-group"]').exists()).toBe(true);
		});

		it('has novalidate attribute', () => {
			const wrapper = mountForm();

			expect(wrapper.attributes('novalidate')).toBeDefined();
		});
	});

	describe('events', () => {
		it('emits submit on form submit', async () => {
			const wrapper = mountForm();

			await wrapper.trigger('submit');

			expect(wrapper.emitted('submit')).toHaveLength(1);
		});

		it('emits cancel from ButtonGroup', async () => {
			const wrapper = mountForm();
			const buttonGroup = wrapper.find('[data-testid="button-group"]');

			await buttonGroup.trigger('click');

			expect(wrapper.emitted('cancel')).toHaveLength(1);
		});
	});
});
