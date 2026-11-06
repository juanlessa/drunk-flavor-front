import { defineComponent, h } from 'vue';
import { afterAll, describe, it } from 'vitest';
import { THEMES, applyTheme, auditInBrowser } from '~/test/browserAxe';
import ErrorMessage from '~/components/atoms/errorMessage/ErrorMessage.vue';
import InputText from '~/components/atoms/inputText/InputText.vue';
import Label from '~/components/atoms/label/Label.vue';
import InputWrapper from './InputWrapper.vue';

afterAll(() => applyTheme('light'));

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

describe.each(THEMES)('InputWrapper accessibility in the %s theme', (theme) => {
	it.each([
		['col', false],
		['row', false],
		['col', true]
	] as const)(
		'has no violations with direction %s and error %s',
		async (direction, withError) => {
			await auditInBrowser(WrappedInput(direction, withError), theme);
		}
	);
});
