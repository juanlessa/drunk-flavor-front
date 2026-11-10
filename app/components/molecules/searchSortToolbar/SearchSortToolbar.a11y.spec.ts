import { mount } from '@vue/test-utils';
import { describe, it } from 'vitest';
import { expectNoA11yViolations } from '~/test/axe';
import InputSelect from '~/components/atoms/inputSelect/InputSelect.vue';
import InputText from '~/components/atoms/inputText/InputText.vue';
import Label from '~/components/atoms/label/Label.vue';
import ChevronDownIcon from '~/components/icons/ChevronDownIcon.vue';
import SearchIcon from '~/components/icons/SearchIcon.vue';
import SearchSortToolbar from './SearchSortToolbar.vue';

const props = {
	searchId: 'drinks-search',
	searchLabel: 'Search drinks',
	searchPlaceholder: 'Search drinks by name',
	sortId: 'drinks-sort',
	sortLabel: 'Sort by',
	sortOptions: [
		{ label: 'Best rated', value: 'rating' },
		{ label: 'Name (A–Z)', value: 'name' },
		{ label: 'Newest', value: 'recent' }
	]
};

describe('SearchSortToolbar accessibility', () => {
	it.each<Record<string, unknown>>([{ sort: 'rating' }, { sort: 'name', searchTerm: 'gin' }])(
		'has no violations with props %o',
		async (extra) => {
			const wrapper = mount(SearchSortToolbar, {
				props: { ...props, sort: 'rating', ...extra },
				global: {
					components: { InputSelect, InputText, Label, ChevronDownIcon, SearchIcon }
				},
				attachTo: document.body
			});

			await expectNoA11yViolations(wrapper.element);
			wrapper.unmount();
		}
	);
});
