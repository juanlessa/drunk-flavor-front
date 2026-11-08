import { mount } from '@vue/test-utils';
import { describe, it } from 'vitest';
import { expectNoA11yViolations } from '~/test/axe';
import RadioCardGroup from './RadioCardGroup.vue';

const options = [
	{ value: 'generic', label: 'Any brand', description: 'Generic, like triple sec.' },
	{ value: 'branded', label: 'Specific brand', description: 'Needs one product.' }
];

describe('RadioCardGroup accessibility', () => {
	it.each([{ modelValue: '' }, { modelValue: 'generic' }, { modelValue: 'branded' }])(
		'has no violations with props %o',
		async (props) => {
			const wrapper = mount(RadioCardGroup, {
				props: { id: 'kind', label: 'Ingredient type', options, ...props },
				attachTo: document.body
			});

			await expectNoA11yViolations(wrapper.element);
			wrapper.unmount();
		}
	);
});
