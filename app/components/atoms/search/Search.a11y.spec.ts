import { mount } from '@vue/test-utils';
import { describe, it, expect } from 'vitest';
import { expectNoA11yViolations, withLabel } from '~/test/axe';
import ChevronDownIcon from '~/components/icons/ChevronDownIcon.vue';
import ThinCloseIcon from '~/components/icons/ThinCloseIcon.vue';
import Text from '~/components/atoms/text/Text.vue';
import Search from './Search.vue';

const options = [
	{ label: 'Whiskey', value: 'whiskey', description: 'Spirit' },
	{ label: 'Rum', value: 'rum' }
];

const global = {
	components: { ChevronDownIcon, ThinCloseIcon, Text },
	mocks: { $t: (key: string) => key }
};

const mountSearch = (props: { hasError?: boolean } = {}) =>
	mount(withLabel(Search, { options, placeholder: 'Search', noResult: 'No results', ...props }), {
		global,
		attachTo: document.body
	});

describe('Search accessibility', () => {
	it.each<{ hasError?: boolean }>([{}, { hasError: true }])(
		'has no violations with props %o',
		async (props) => {
			const wrapper = mountSearch(props);

			await expectNoA11yViolations(wrapper.element);
			wrapper.unmount();
		}
	);

	// The id must land on the text input so the associated <label for> names the field, not the arrow button.
	it('applies the id to the text input', () => {
		const wrapper = mountSearch();

		expect(wrapper.find('#a11y-field').element.tagName).toBe('INPUT');
		wrapper.unmount();
	});

	it('names the clear button so it is announced by assistive technology', () => {
		const wrapper = mountSearch();

		expect(wrapper.find('button[aria-label="atoms.search.clearButton.label"]').exists()).toBe(
			true
		);
		wrapper.unmount();
	});
});
