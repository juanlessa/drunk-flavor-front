import { defineComponent, h } from 'vue';
import { afterAll, describe, it } from 'vitest';
import { THEMES, applyTheme, auditInBrowser } from '~/test/browserAxe';
import Label from './Label.vue';

afterAll(() => applyTheme('light'));

const LabelledInput = defineComponent({
	render: () =>
		h('div', [
			h(Label, { for: 'name', value: 'Name' }),
			h('input', { id: 'name', type: 'text' })
		])
});

describe.each(THEMES)('Label accessibility in the %s theme', (theme) => {
	it('has no violations when associated with an input', async () => {
		await auditInBrowser(LabelledInput, theme);
	});
});
