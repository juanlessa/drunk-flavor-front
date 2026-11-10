import { mount } from '@vue/test-utils';
import { describe, it } from 'vitest';
import { expectNoA11yViolations } from '~/test/axe';
import ReadOnlyInput from './ReadOnlyInput.vue';

describe('ReadOnlyInput accessibility', () => {
	it.each<Record<string, unknown>>([{ value: 'Milliliter' }, {}, { value: 'x', help: 'Help' }])(
		'has no violations with props %o',
		async (extra) => {
			// dt and dd are only valid inside a description list.
			const wrapper = mount(
				{
					components: { ReadOnlyInput },
					template: '<dl><ReadOnlyInput label="name" v-bind="extra" /></dl>',
					setup: () => ({ extra })
				},
				{ attachTo: document.body }
			);
			await expectNoA11yViolations(wrapper.element);
			wrapper.unmount();
		}
	);
});
