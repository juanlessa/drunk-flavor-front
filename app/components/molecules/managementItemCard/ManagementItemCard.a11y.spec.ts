import { mount } from '@vue/test-utils';
import { describe, it } from 'vitest';
import { expectNoA11yViolations } from '~/test/axe';
import LockIcon from '~/components/icons/LockIcon.vue';
import TrashIcon from '~/components/icons/TrashIcon.vue';
import ManagementItemCard from './ManagementItemCard.vue';

const global = {
	components: { LockIcon, TrashIcon },
	mocks: {
		$t: (key: string, params?: { name?: string }) =>
			params?.name ? `${key}:${params.name}` : key
	}
};

describe('ManagementItemCard accessibility', () => {
	it.each([{}, { description: 'Spirit' }, { readonly: true }, { selectable: false }])(
		'has no violations with props %o',
		async (extra) => {
			const wrapper = mount(ManagementItemCard, {
				props: { title: 'Gin', ...extra },
				global,
				attachTo: document.body
			});

			await expectNoA11yViolations(wrapper.element);
			wrapper.unmount();
		}
	);

	it('has no violations with a media slot', async () => {
		const wrapper = mount(ManagementItemCard, {
			props: { title: 'Gin' },
			slots: { media: '<span aria-hidden="true"></span>' },
			global,
			attachTo: document.body
		});

		await expectNoA11yViolations(wrapper.element);
		wrapper.unmount();
	});
});
