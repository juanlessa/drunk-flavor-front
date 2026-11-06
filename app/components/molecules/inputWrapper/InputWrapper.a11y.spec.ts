import { defineComponent, h } from 'vue';
import { mount } from '@vue/test-utils';
import { describe, it } from 'vitest';
import { expectNoA11yViolations } from '~/test/axe';
import Box from '~/components/atoms/box/Box.vue';
import ErrorMessage from '~/components/atoms/errorMessage/ErrorMessage.vue';
import InputText from '~/components/atoms/inputText/InputText.vue';
import Label from '~/components/atoms/label/Label.vue';
import InputWrapper from './InputWrapper.vue';

const WrappedInput = (direction: 'row' | 'col', withError: boolean) =>
	defineComponent({
		render: () =>
			h(
				InputWrapper,
				{ direction },
				{
					label: () => h(Label, { for: 'name', value: 'Name' }),
					default: () => h(InputText, { id: 'name', hasError: withError }),
					error: () =>
						withError ? h(ErrorMessage, { value: 'Required field' }) : undefined
				}
			)
	});

describe('InputWrapper accessibility', () => {
	it.each([
		['col', false],
		['row', false],
		['col', true]
	] as const)(
		'has no violations with direction %s and error %s',
		async (direction, withError) => {
			const wrapper = mount(WrappedInput(direction, withError), {
				global: { components: { Box } },
				attachTo: document.body
			});

			await expectNoA11yViolations(wrapper.element);
			wrapper.unmount();
		}
	);
});
