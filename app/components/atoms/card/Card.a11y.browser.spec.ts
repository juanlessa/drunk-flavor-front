import { defineComponent, h } from 'vue';
import { afterAll, describe, it } from 'vitest';
import { THEMES, applyTheme, auditInBrowser } from '~/test/browserAxe';
import Card from './Card.vue';

afterAll(() => applyTheme('light'));

// Text on the card surface is what matters for contrast, so the card is rendered with a paragraph inside.
const CardWithText = defineComponent({
	render: () =>
		h(Card, null, {
			default: () => h('p', { class: 'text-body text-content p-4' }, 'Card content')
		})
});

describe.each(THEMES)('Card accessibility in the %s theme', (theme) => {
	it('has no violations with text content', async () => {
		await auditInBrowser(CardWithText, theme);
	});
});
