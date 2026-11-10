import { mount } from '@vue/test-utils';
import { describe, it } from 'vitest';
import { expectNoA11yViolations } from '~/test/axe';
import Badge from '~/components/atoms/badge/Badge.vue';
import ReadOnlyField from './ReadOnlyField.vue';

describe('ReadOnlyField accessibility', () => {
	it.each<Record<string, unknown>>([{ value: 'Liqueur' }, {}, { flag: true }, { flag: false }])(
		'has no violations with props %o',
		async (extra) => {
			const wrapper = mount(
				{
					components: { ReadOnlyField },
					template: '<dl><ReadOnlyField label="name" v-bind="extra" /></dl>',
					setup: () => ({ extra })
				},
				{
					global: { components: { Badge }, mocks: { $t: (key: string) => key } },
					attachTo: document.body
				}
			);

			await expectNoA11yViolations(wrapper.element);
			wrapper.unmount();
		}
	);
});
