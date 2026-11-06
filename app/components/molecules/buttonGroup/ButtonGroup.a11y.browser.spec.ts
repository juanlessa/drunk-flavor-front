import { afterAll, describe, it } from 'vitest';
import { THEMES, applyTheme, auditInBrowser } from '~/test/browserAxe';
import ButtonGroup from './ButtonGroup.vue';

afterAll(() => applyTheme('light'));

describe.each(THEMES)('ButtonGroup accessibility in the %s theme', (theme) => {
	it.each<Record<string, unknown>>([{}, { hasCancelButton: false }, { direction: 'row' }])(
		'has no violations with props %o',
		async (props) => {
			await auditInBrowser(ButtonGroup, theme, { props });
		}
	);
});
