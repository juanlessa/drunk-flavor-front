import { afterAll, describe, it } from 'vitest';
import { THEMES, applyTheme, auditInBrowser, clickElement } from '~/test/browserAxe';
import InputSelect from './InputSelect.vue';

afterAll(() => applyTheme('light'));

const options = [
	{ label: 'Whiskey', value: 'whiskey' },
	{ label: 'Rum', value: 'rum' }
];

describe.each(THEMES)('InputSelect accessibility in the %s theme', (theme) => {
	it.each<Record<string, unknown>>([{}, { modelValue: 'rum' }, { hasError: true }])(
		'has no violations when closed with props %o',
		async (props) => {
			await auditInBrowser(InputSelect, theme, {
				props: { options, placeholder: 'Select one', ...props },
				label: true
			});
		}
	);

	// The option list renders in a portal, so the whole document is audited after opening it.
	// aria-hidden-focus is disabled on purpose: while the Select is open, Radix wraps the rest of the page
	// in aria-hidden and traps focus, so the trigger (which stays focusable) sits inside the hidden region.
	// This is the library's documented modal pattern, not a defect in this component.
	it('has no violations when open', async () => {
		await auditInBrowser(InputSelect, theme, {
			props: { options, placeholder: 'Select one' },
			label: true,
			root: 'body',
			expectPresent: '[role="option"]',
			disableRules: ['aria-hidden-focus'],
			prepare: () => clickElement('button[role="combobox"]')
		});
	});
});
