import { mount } from '@vue/test-utils';
import { describe, it } from 'vitest';
import { expectNoA11yViolations } from '~/test/axe';
import InputText from '~/components/atoms/inputText/InputText.vue';
import Label from '~/components/atoms/label/Label.vue';
import ChevronDownIcon from '~/components/icons/ChevronDownIcon.vue';
import SortIcon from '~/components/icons/SortIcon.vue';
import SortSelect from '~/components/molecules/sortSelect/SortSelect.vue';
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
					components: {
						SortSelect,
						InputText,
						Label,
						ChevronDownIcon,
						SearchIcon,
						SortIcon
					}
				},
				attachTo: document.body
			});

			await expectNoA11yViolations(wrapper.element);
			wrapper.unmount();
		}
	);
	it('has no violations with a link in the leading slot', async () => {
		const wrapper = mount(SearchSortToolbar, {
			props: { ...props, sort: 'rating' },
			slots: { leading: '<a href="/bar">My bar</a>' },
			global: {
				components: { SortSelect, InputText, Label, ChevronDownIcon, SearchIcon, SortIcon }
			},
			attachTo: document.body
		});
		await expectNoA11yViolations(wrapper.element);
		wrapper.unmount();
	});
});
