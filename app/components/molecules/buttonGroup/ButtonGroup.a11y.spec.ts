import { mount } from '@vue/test-utils';
import { describe, it } from 'vitest';
import { expectNoA11yViolations } from '~/test/axe';
import Button from '~/components/atoms/button/Button.vue';
import ButtonGroup from './ButtonGroup.vue';

const global = { components: { Button }, mocks: { $t: (key: string) => key } };

describe('ButtonGroup accessibility', () => {
	it.each<{ hasCancelButton?: boolean; direction?: 'row' | 'column' | 'responsive' }>([
		{},
		{ hasCancelButton: false },
		{ direction: 'row' }
	])('has no violations with props %o', async (props) => {
		const wrapper = mount(ButtonGroup, { props, global, attachTo: document.body });

		await expectNoA11yViolations(wrapper.element);
		wrapper.unmount();
	});
});
