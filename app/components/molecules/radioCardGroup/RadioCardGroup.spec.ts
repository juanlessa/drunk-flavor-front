import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import RadioCardGroup from './RadioCardGroup.vue';

const options = [
	{ value: 'generic', label: 'Any brand', description: 'Generic, like triple sec.' },
	{ value: 'branded', label: 'Specific brand' }
];

const mountGroup = (props: Record<string, unknown> = {}) =>
	mount(RadioCardGroup, {
		props: { id: 'kind', label: 'Ingredient type', options, modelValue: 'generic', ...props },
		attachTo: document.body
	});

describe('RadioCardGroup', () => {
	it('names the group and offers one radio per option, with its description when there is one', () => {
		const wrapper = mountGroup();

		expect(wrapper.find('[role="radiogroup"]').attributes('aria-label')).toBe(
			'Ingredient type'
		);
		expect(wrapper.findAll('[role="radio"]').map((radio) => radio.attributes('id'))).toEqual([
			'kind-generic',
			'kind-branded'
		]);
		expect(wrapper.text()).toContain('Any brand');
		expect(wrapper.text()).toContain('Generic, like triple sec.');
		expect(wrapper.findAll('label')).toHaveLength(2);
		wrapper.unmount();
	});

	it('marks only the chosen option as checked', async () => {
		const wrapper = mountGroup();
		const checked = () =>
			wrapper.findAll('[role="radio"]').map((radio) => radio.attributes('aria-checked'));

		expect(checked()).toEqual(['true', 'false']);
		await wrapper.setProps({ modelValue: 'branded' });
		expect(checked()).toEqual(['false', 'true']);
		wrapper.unmount();
	});

	it('emits the option that was clicked', async () => {
		const wrapper = mountGroup();

		await wrapper.findAll('[role="radio"]')[1]!.trigger('click');

		expect(wrapper.emitted('update:modelValue')).toEqual([['branded']]);
		wrapper.unmount();
	});

	it('ties each card to its radio, so a click anywhere on the card chooses it', () => {
		const wrapper = mountGroup();

		expect(wrapper.findAll('label').map((label) => label.attributes('for'))).toEqual([
			'kind-generic',
			'kind-branded'
		]);
		wrapper.unmount();
	});
});
