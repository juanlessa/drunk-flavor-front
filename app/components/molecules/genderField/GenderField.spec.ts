import { mount } from '@vue/test-utils';
import { describe, expect, it, vi } from 'vitest';
import { ref } from 'vue';
import GenderField from './GenderField.vue';

vi.stubGlobal('useI18n', () => ({ t: (key: string) => key, locale: ref('en') }));

const InputSelectStub = {
	props: ['id', 'name', 'modelValue', 'options', 'placeholder', 'hasError'],
	emits: ['update:modelValue', 'blur'],
	template: '<div data-testid="select" :data-value="modelValue" :data-error="String(hasError)" />'
};

const mountField = (props: Record<string, unknown> = {}) =>
	mount(GenderField, {
		props: { id: 'pt-gender', ...props },
		global: {
			stubs: {
				InputWrapper: {
					template: '<div><slot name="label" /><slot /><slot name="error" /></div>'
				},
				Label: { props: ['for'], template: '<label :for="$props.for"><slot /></label>' },
				Text: { template: '<p data-testid="help"><slot /></p>' },
				ErrorMessage: {
					props: ['value'],
					template: '<span data-testid="error">{{ value }}</span>'
				},
				InputSelect: InputSelectStub
			},
			mocks: { $t: (key: string) => key }
		}
	});

describe('GenderField', () => {
	it('labels the select, explains what the gender is for and offers both genders', () => {
		const wrapper = mountField();

		expect(wrapper.find('label').attributes('for')).toBe('pt-gender');
		expect(wrapper.find('label').text()).toBe('molecules.genderField.label');
		expect(wrapper.find('[data-testid="help"]').text()).toBe('molecules.genderField.help');
		expect(wrapper.findComponent(InputSelectStub).props('options')).toEqual([
			{ label: 'molecules.genderField.options.masculine', value: 'masculine' },
			{ label: 'molecules.genderField.options.feminine', value: 'feminine' }
		]);
	});

	it('shows the placeholder until a gender is picked, then the picked one', async () => {
		const wrapper = mountField();
		expect(wrapper.findComponent(InputSelectStub).props('modelValue')).toBe('');
		expect(wrapper.findComponent(InputSelectStub).props('placeholder')).toBe(
			'molecules.genderField.placeholder'
		);

		await wrapper.setProps({ modelValue: 'feminine' });

		expect(wrapper.findComponent(InputSelectStub).props('modelValue')).toBe('feminine');
	});

	it('emits the picked gender and ignores any other value', () => {
		const wrapper = mountField();
		const select = wrapper.findComponent(InputSelectStub);

		select.vm.$emit('update:modelValue', 'masculine');
		select.vm.$emit('update:modelValue', 'neuter');

		expect(wrapper.emitted('update:modelValue')).toEqual([['masculine']]);
	});

	it('passes the blur up so the form can validate', () => {
		const wrapper = mountField();

		wrapper.findComponent(InputSelectStub).vm.$emit('blur');

		expect(wrapper.emitted('blur')).toHaveLength(1);
	});

	it('flags the select and shows the message when there is an error', () => {
		const wrapper = mountField({ error: 'errors.units.gender' });

		expect(wrapper.findComponent(InputSelectStub).props('hasError')).toBe(true);
		expect(wrapper.find('[data-testid="error"]').text()).toBe('errors.units.gender');
	});
});
