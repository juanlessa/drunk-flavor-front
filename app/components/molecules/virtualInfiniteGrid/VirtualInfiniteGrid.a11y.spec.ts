import { mount } from '@vue/test-utils';
import { describe, it } from 'vitest';
import { expectNoA11yViolations } from '~/test/axe';
import VirtualInfiniteGrid from './VirtualInfiniteGrid.vue';

const items = Array.from({ length: 6 }, (_, index) => ({ id: index, name: `Item ${index}` }));

describe('VirtualInfiniteGrid accessibility', () => {
	it.each([{}, { loading: true }])('has no violations with props %o', async (extra) => {
		const wrapper = mount(VirtualInfiniteGrid, {
			props: { items, height: 200, itemHeight: 40, gridColumns: 2, ...extra },
			slots: {
				default:
					'<template #default="{ list }"><p v-for="row in list" :key="row.index">Row {{ row.index }}</p></template>',
				loading: '<p>Loading</p>'
			},
			attachTo: document.body
		});

		await expectNoA11yViolations(wrapper.element);
		wrapper.unmount();
	});
});
