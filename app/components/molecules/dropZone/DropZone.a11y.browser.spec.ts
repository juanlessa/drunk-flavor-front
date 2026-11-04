import { afterAll, describe, it } from 'vitest';
import { THEMES, applyTheme, auditInBrowser } from '~/test/browserAxe';
import DropZone from './DropZone.vue';

afterAll(() => applyTheme('light'));

describe.each(THEMES)('DropZone accessibility in the %s theme', (theme) => {
	it('has no violations in the empty state', async () => {
		await auditInBrowser(DropZone, theme, { label: true });
	});
});
