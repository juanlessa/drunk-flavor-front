import { afterAll, describe, it } from 'vitest';
import { THEMES, applyTheme, auditInBrowser } from '~/test/browserAxe';
import Button from './Button.vue';

afterAll(() => applyTheme('light'));

describe.each(THEMES)('Button accessibility in the %s theme', (theme) => {
	it.each(['primary', 'secondary', 'delete', 'outline', 'plain'] as const)(
		'has no violations for the %s variant',
		async (variant) => {
			await auditInBrowser(Button, theme, { props: { value: 'Save', variant } });
		}
	);

	it('has no violations when disabled', async () => {
		await auditInBrowser(Button, theme, { props: { value: 'Save', disabled: true } });
	});
});
