import { mount } from '@vue/test-utils';
import { describe, it } from 'vitest';
import { expectNoA11yViolations } from '~/test/axe';
import ActionMenu from './ActionMenu.vue';

const items = [
	{ key: 'edit', label: 'Edit' },
	{ key: 'delete', label: 'Delete', tone: 'danger' as const }
];

describe('ActionMenu accessibility', () => {
	it.each([{}, { disabled: true }])(
		'has no violations when closed with props %o',
		async (props) => {
			const wrapper = mount(ActionMenu, {
				props: { label: 'More actions', items, ...props },
				attachTo: document.body
			});

			await expectNoA11yViolations(wrapper.element);
			wrapper.unmount();
		}
	);
});
