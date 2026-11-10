import { mount } from '@vue/test-utils';
import { describe, it } from 'vitest';
import { expectNoA11yViolations } from '~/test/axe';
import ChevronDownIcon from '~/components/icons/ChevronDownIcon.vue';
import SortIcon from '~/components/icons/SortIcon.vue';
import SortSelect from './SortSelect.vue';

describe('SortSelect accessibility', () => {
	it('has no violations', async () => {
		const wrapper = mount(SortSelect, {
			props: {
				modelValue: 'rating',
				label: 'Sort by',
				id: 'sort',
				options: [
					{ label: 'Best rated', value: 'rating' },
					{ label: 'Name (A–Z)', value: 'name' }
				]
			},
			global: { components: { ChevronDownIcon, SortIcon } },
			attachTo: document.body
		});

		await expectNoA11yViolations(wrapper.element);
		wrapper.unmount();
	});
});
