import { mount } from '@vue/test-utils';
import { describe, it, vi } from 'vitest';
import { ref } from 'vue';
import { expectNoA11yViolations } from '~/test/axe';
import ReadOnlySwitch from '~/components/atoms/readOnlySwitch/ReadOnlySwitch.vue';
import Text from '~/components/atoms/text/Text.vue';
import ReadOnlyInput from '~/components/molecules/readOnlyInput/ReadOnlyInput.vue';
import ReadOnlyRecipeLine from './ReadOnlyRecipeLine.vue';

vi.stubGlobal('useI18n', () => ({ t: (key: string) => key, locale: ref('en') }));

const ml = {
	id: 'ml',
	symbol: 'ml',
	kind: 'volume',
	translations: { en: { name: 'Milliliter' }, pt: { name: 'Mililitro' } }
};
const dash = {
	id: 'dash',
	kind: 'count',
	translations: { en: { name: 'Dash' }, pt: { name: 'Dash' } }
};
const ingredient = {
	id: 'licor',
	translations: { en: { name: 'Licor 43' }, pt: { name: 'Licor 43' } },
	category: { id: 'c', translations: { en: { name: 'Liqueur' }, pt: { name: 'Licor' } } },
	units: [ml, dash],
	kind: 'generic'
};

describe('ReadOnlyRecipeLine accessibility', () => {
	it.each([
		{ type: 'exact', quantity: 75, unit: ml },
		{ type: 'qualitative', qualifier: 'top_up', quantity: 120, unit: ml },
		{ type: 'qualitative', qualifier: 'to_taste' },
		{ type: 'none' }
	])('has no violations for the amount %o', async (amount) => {
		const wrapper = mount(
			{
				components: { ReadOnlyRecipeLine },
				template:
					'<ol><ReadOnlyRecipeLine :line="line" :index="0" kind="ingredients" /></ol>',
				setup: () => ({ line: { ingredient, amount, optional: false } })
			},
			{
				global: {
					components: { ReadOnlyInput, ReadOnlySwitch, Text },
					mocks: { $t: (key: string) => key }
				},
				attachTo: document.body
			}
		);
		await expectNoA11yViolations(wrapper.element);
		wrapper.unmount();
	});
});
