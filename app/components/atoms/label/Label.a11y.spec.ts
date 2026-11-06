import { defineComponent, h } from 'vue';
import { mount } from '@vue/test-utils';
import { describe, it } from 'vitest';
import { expectNoA11yViolations } from '~/test/axe';
import Label from './Label.vue';

const LabelledInput = defineComponent({
	render: () =>
		h('div', [
			h(Label, { for: 'name', value: 'Name' }),
			h('input', { id: 'name', type: 'text' })
		])
});

describe('Label accessibility', () => {
	it('has no violations when associated with an input', async () => {
		const wrapper = mount(LabelledInput, { attachTo: document.body });

		await expectNoA11yViolations(wrapper.element);
		wrapper.unmount();
	});
});
