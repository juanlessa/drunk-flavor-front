import { mount } from '@vue/test-utils';
import { describe, it } from 'vitest';
import { expectNoA11yViolations } from '~/test/axe';
import ReadOnlyChoiceCards from './ReadOnlyChoiceCards.vue';

const options = [
	{ value: 'generic', label: 'Any brand', description: 'Generic.' },
	{ value: 'branded', label: 'Specific brand' }
];

describe('ReadOnlyChoiceCards accessibility', () => {
	it.each(['generic', 'branded', ''])('has no violations with %o chosen', async (modelValue) => {
		const wrapper = mount(ReadOnlyChoiceCards, {
			props: { modelValue, options, label: 'ingredient type' },
			global: { mocks: { $t: (key: string) => key } },
			attachTo: document.body
		});
		await expectNoA11yViolations(wrapper.element);
		wrapper.unmount();
	});
});
