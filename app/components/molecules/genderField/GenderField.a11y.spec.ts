import { mount } from '@vue/test-utils';
import { describe, it, vi } from 'vitest';
import { ref } from 'vue';
import { expectNoA11yViolations } from '~/test/axe';
import ErrorMessage from '~/components/atoms/errorMessage/ErrorMessage.vue';
import InputSelect from '~/components/atoms/inputSelect/InputSelect.vue';
import Label from '~/components/atoms/label/Label.vue';
import Text from '~/components/atoms/text/Text.vue';
import ChevronDownIcon from '~/components/icons/ChevronDownIcon.vue';
import InputWrapper from '~/components/molecules/inputWrapper/InputWrapper.vue';
import Box from '~/components/atoms/box/Box.vue';
import GenderField from './GenderField.vue';

vi.stubGlobal('useI18n', () => ({ t: (key: string) => key, locale: ref('en') }));

describe('GenderField accessibility', () => {
	it.each<Record<string, unknown>>([
		{},
		{ modelValue: 'feminine' },
		{ error: 'gender must be selected' }
	])('has no violations with props %o', async (props) => {
		const wrapper = mount(GenderField, {
			props: { id: 'pt-gender', ...props },
			global: {
				components: {
					Box,
					ChevronDownIcon,
					ErrorMessage,
					InputSelect,
					InputWrapper,
					Label,
					Text
				},
				mocks: { $t: (key: string) => key }
			},
			attachTo: document.body
		});

		await expectNoA11yViolations(wrapper.element);
		wrapper.unmount();
	});
});
