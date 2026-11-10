import { defineComponent, h } from 'vue';
import { afterAll, describe, it } from 'vitest';
import { THEMES, applyTheme, auditInBrowser } from '~/test/browserAxe';
import ReadOnlyField from './ReadOnlyField.vue';

afterAll(() => applyTheme('light'));

describe.each(THEMES)('ReadOnlyField accessibility in the %s theme', (theme) => {
	it.each<Record<string, unknown>>([{ value: 'Liqueur' }, { flag: true }, { flag: false }])(
		'has no violations with extra props %o',
		async (extra) => {
			// dt and dd are only valid inside a description list.
			const InList = defineComponent({
				render: () => h('dl', null, [h(ReadOnlyField, { label: 'name', ...extra })])
			});
			await auditInBrowser(InList, theme, { props: {} });
		}
	);
});
