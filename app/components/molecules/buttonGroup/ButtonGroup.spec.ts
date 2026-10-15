import { mount } from '@vue/test-utils';
import { describe, it, expect } from 'vitest';
import ButtonGroup from './ButtonGroup.vue';

const ButtonStub = {
	template:
		'<button :disabled="disabled" @click="$emit(\'click\')"><slot>{{ value }}</slot></button>',
	props: ['value', 'variant', 'size', 'type', 'disabled']
};

const mountButtonGroup = (props = {}, slots = {}) =>
	mount(ButtonGroup, {
		props,
		slots,
		global: {
			stubs: { Button: ButtonStub },
			mocks: { $t: (key: string) => key }
		}
	});

describe('ButtonGroup', () => {
	describe('rendering', () => {
		it('renders two buttons by default (cancel + action)', () => {
			const wrapper = mountButtonGroup();
			const buttons = wrapper.findAll('button');

			expect(buttons).toHaveLength(2);
		});

		it('renders only action button when hasCancelButton is false', () => {
			const wrapper = mountButtonGroup({ hasCancelButton: false });
			const buttons = wrapper.findAll('button');

			expect(buttons).toHaveLength(1);
		});

		it('renders slot content instead of default buttons', () => {
			const wrapper = mountButtonGroup({}, { default: '<button>Custom</button>' });

			expect(wrapper.text()).toContain('Custom');
		});
	});

	describe('events', () => {
		it('emits cancel when cancel button is clicked', async () => {
			const wrapper = mountButtonGroup();
			const buttons = wrapper.findAll('button');
			const [cancelButton] = buttons;

			expect(cancelButton).toBeDefined();
			await cancelButton!.trigger('click');

			expect(wrapper.emitted('cancel')).toBeTruthy();
		});

		it('emits action when action button is clicked', async () => {
			const wrapper = mountButtonGroup();
			const buttons = wrapper.findAll('button');
			const actionButton = buttons[1];

			expect(actionButton).toBeDefined();
			await actionButton!.trigger('click');

			expect(wrapper.emitted('action')).toBeTruthy();
		});
	});

	describe('styling', () => {
		it('applies responsive direction by default', () => {
			const wrapper = mountButtonGroup();

			expect(wrapper.classes()).toContain('flex-col-reverse');
		});

		it('applies row direction', () => {
			const wrapper = mountButtonGroup({ direction: 'row' });

			expect(wrapper.classes()).toContain('flex-row');
		});

		it('applies column direction', () => {
			const wrapper = mountButtonGroup({ direction: 'column' });

			expect(wrapper.classes()).toContain('flex-col-reverse');
		});
	});
});
