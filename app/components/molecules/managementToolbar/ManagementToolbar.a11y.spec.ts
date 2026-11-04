import { mount } from '@vue/test-utils';
import { describe, it } from 'vitest';
import { expectNoA11yViolations } from '~/test/axe';
import Button from '~/components/atoms/button/Button.vue';
import InputText from '~/components/atoms/inputText/InputText.vue';
import Label from '~/components/atoms/label/Label.vue';
import PlusIcon from '~/components/icons/PlusIcon.vue';
import SearchIcon from '~/components/icons/SearchIcon.vue';
import ManagementToolbar from './ManagementToolbar.vue';

describe('ManagementToolbar accessibility', () => {
	it.each([{}, { searchTerm: 'gin' }])('has no violations with props %o', async (extra) => {
		const wrapper = mount(ManagementToolbar, {
			props: {
				searchId: 'units-search',
				searchLabel: 'Search units',
				searchPlaceholder: 'Search units by name',
				createLabel: 'New unit',
				...extra
			},
			global: { components: { Button, InputText, Label, PlusIcon, SearchIcon } },
			attachTo: document.body
		});

		await expectNoA11yViolations(wrapper.element);
		wrapper.unmount();
	});
});
