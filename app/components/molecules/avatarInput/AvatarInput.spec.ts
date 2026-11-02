import { mount } from '@vue/test-utils';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import AvatarInput from './AvatarInput.vue';

const AvatarStub = {
	props: ['src', 'alt'],
	template: '<div data-testid="avatar" :data-src="src" :aria-label="alt" />'
};
const ButtonStub = {
	template: '<button type="button" @click="$emit(\'click\')"><slot /></button>',
	emits: ['click']
};

const mountInput = (props = {}) =>
	mount(AvatarInput, {
		props: {
			alt: 'Profile avatar',
			buttonLabel: 'Change photo',
			helpText: 'Image help',
			...props
		},
		global: {
			stubs: {
				Avatar: AvatarStub,
				Button: ButtonStub,
				Text: { template: '<span><slot /></span>' },
				CameraIcon: true
			}
		}
	});

const selectFile = async (wrapper: ReturnType<typeof mountInput>, file: File) => {
	const input = wrapper.find('input[type="file"]');
	Object.defineProperty(input.element, 'files', { configurable: true, value: [file] });
	await input.trigger('change');
};

describe('AvatarInput', () => {
	beforeEach(() => {
		vi.stubGlobal('URL', {
			createObjectURL: vi.fn(() => 'blob:avatar-preview'),
			revokeObjectURL: vi.fn()
		});
	});

	it('renders distinct avatar controls for mobile and desktop layouts', () => {
		const wrapper = mountInput();
		const buttons = wrapper.findAll('button');

		expect(buttons).toHaveLength(2);
		expect(buttons[0]?.classes()).toContain('tablet:inline-flex');
		expect(wrapper.find('.tablet\\:hidden').find('button').exists()).toBe(true);
	});

	it('opens the native picker from the visible button', async () => {
		const wrapper = mountInput();
		const click = vi.spyOn(wrapper.find('input').element as HTMLInputElement, 'click');

		await wrapper.find('button').trigger('click');

		expect(click).toHaveBeenCalledOnce();
	});

	it('emits a valid image and renders its local preview', async () => {
		const wrapper = mountInput({ src: '/current.png' });
		const file = new File(['avatar'], 'avatar.png', { type: 'image/png' });

		await selectFile(wrapper, file);

		expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([file]);
		expect(wrapper.find('[data-testid="avatar"]').attributes('data-src')).toBe(
			'blob:avatar-preview'
		);
	});

	it('rejects unsupported files', async () => {
		const wrapper = mountInput();

		await selectFile(wrapper, new File(['text'], 'avatar.txt', { type: 'text/plain' }));

		expect(wrapper.emitted('invalid')?.[0]).toEqual(['unsupported-file-type']);
		expect(wrapper.emitted('update:modelValue')).toBeUndefined();
	});

	it('rejects files larger than the configured limit', async () => {
		const wrapper = mountInput({ maxFileSize: 2 });

		await selectFile(wrapper, new File(['large'], 'avatar.png', { type: 'image/png' }));

		expect(wrapper.emitted('invalid')?.[0]).toEqual(['file-too-large']);
	});

	it('revokes preview URLs when unmounted', async () => {
		const wrapper = mountInput();
		await selectFile(wrapper, new File(['avatar'], 'avatar.png', { type: 'image/png' }));

		wrapper.unmount();

		expect(URL.revokeObjectURL).toHaveBeenCalledWith('blob:avatar-preview');
	});
});
