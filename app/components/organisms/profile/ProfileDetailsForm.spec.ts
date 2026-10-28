import { flushPromises, mount } from '@vue/test-utils';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import ProfileDetailsForm from './ProfileDetailsForm.vue';
import type { Profile } from '~/domain/profile/profile.entity';

vi.mock('vue-i18n', () => ({ useI18n: () => ({ t: (key: string) => key }) }));

const update = vi.fn();
const updateAvatar = vi.fn();
const authenticate = vi.fn();
const addToast = vi.fn();

vi.stubGlobal('useNuxtApp', () => ({
	$api: { profile: { update, updateAvatar } },
	$auth: { authenticate }
}));
vi.stubGlobal('useI18n', () => ({ t: (key: string) => key }));
vi.stubGlobal('useToast', () => ({ addToast }));

const profile: Profile = {
	id: 'user-1',
	name: 'Juan',
	surname: 'Lessa',
	email: 'juan@example.com',
	emailVerified: true,
	role: 'member',
	status: 'active',
	createdAt: new Date(),
	updatedAt: new Date(),
	authenticationMethods: { password: { enabled: true }, providers: [] }
};

const FieldStub = {
	props: ['modelValue', 'id', 'readonly', 'disabled', 'suffix'],
	emits: ['update:modelValue', 'blur'],
	template:
		'<div><input :id="id" :value="modelValue" :readonly="readonly" :disabled="disabled" @input="$emit(\'update:modelValue\', $event.target.value)" @blur="$emit(\'blur\')" /><span v-if="suffix">{{ suffix }}</span></div>'
};
const AvatarInputStub = {
	name: 'AvatarInput',
	props: ['modelValue'],
	emits: ['update:modelValue', 'invalid'],
	template: '<button type="button" data-testid="avatar-input">avatar</button>'
};

const mountForm = () =>
	mount(ProfileDetailsForm, {
		props: { profile },
		global: {
			stubs: {
				ProfileSection: { template: '<section><slot name="icon" /><slot /></section>' },
				ProfileIcon: true,
				AvatarInput: AvatarInputStub,
				InputWrapper: {
					template: '<div><slot name="label" /><slot /><slot name="error" /></div>'
				},
				Label: { template: '<label><slot /></label>' },
				InputText: FieldStub,
				ErrorMessage: { props: ['value'], template: '<span>{{ value }}</span>' },
				Button: {
					props: ['disabled'],
					template: '<button :disabled="disabled"><slot /></button>'
				}
			},
			mocks: { $t: (key: string) => key }
		}
	});

describe('ProfileDetailsForm', () => {
	beforeEach(() => {
		vi.clearAllMocks();
		update.mockResolvedValue(undefined);
		updateAvatar.mockResolvedValue(undefined);
		authenticate.mockResolvedValue(true);
	});

	it('renders email as visibly identified disabled data', () => {
		const wrapper = mountForm();
		const email = wrapper.find('#profile-email');

		expect(email.attributes('disabled')).toBeDefined();
		expect(wrapper.text()).toContain('organisms.profile.details.emailLocked');
	});

	it('keeps save disabled while the profile is unchanged', () => {
		const wrapper = mountForm();

		expect(wrapper.find('button[type="submit"]').attributes('disabled')).toBeDefined();
	});

	it('updates trimmed names and refreshes the authenticated profile', async () => {
		const wrapper = mountForm();
		await wrapper.find('#profile-name').setValue('  Jane  ');
		await wrapper.find('form').trigger('submit');
		await flushPromises();

		expect(update).toHaveBeenCalledWith({ name: 'Jane', surname: 'Lessa' });
		expect(authenticate).toHaveBeenCalledOnce();
		expect(addToast).toHaveBeenCalledWith(expect.objectContaining({ type: 'success' }));
	});

	it('uploads a selected avatar through the profile repository', async () => {
		const wrapper = mountForm();
		const file = { name: 'avatar.png', type: 'image/png', size: 6 } as File;
		wrapper.findComponent(AvatarInputStub).vm.$emit('update:modelValue', file);
		await wrapper.vm.$nextTick();
		await wrapper.find('form').trigger('submit');
		await flushPromises();

		expect(updateAvatar).toHaveBeenCalledWith(file);
		expect(update).not.toHaveBeenCalled();
	});

	it('blocks invalid details', async () => {
		const wrapper = mountForm();
		await wrapper.find('#profile-name').setValue('');
		await wrapper.find('form').trigger('submit');

		expect(update).not.toHaveBeenCalled();
	});

	it('shows error feedback when persistence fails', async () => {
		vi.spyOn(console, 'error').mockImplementation(() => {});
		update.mockRejectedValue(new Error('network'));
		const wrapper = mountForm();
		await wrapper.find('#profile-name').setValue('Jane');
		await wrapper.find('form').trigger('submit');
		await flushPromises();

		expect(addToast).toHaveBeenCalledWith(expect.objectContaining({ type: 'error' }));
	});
});
