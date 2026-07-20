import { describe, it, expect, vi } from 'vitest';
import { mount, flushPromises } from '@vue/test-utils';
import { nextTick } from 'vue';
import DropZone from './DropZone.vue';
import Box from '~/components/atoms/box/Box.vue';
import Text from '~/components/atoms/text/Text.vue';
import Button from '~/components/atoms/button/Button.vue';
import CloseIcon from '~/components/icons/CloseIcon.vue';

const createFile = (name: string, size: number, type: string): File => {
	const content = new Array(size).fill('a').join('');
	return new File([content], name, { type });
};

const globalConfig = {
	components: { Box, Text, Button, CloseIcon },
	mocks: { $t: (key: string) => key }
};

const mountDropZone = (props = {}) => {
	return mount(DropZone, {
		global: globalConfig,
		props,
		attachTo: document.body
	});
};

describe('DropZone', () => {
	describe('rendering', () => {
		it('renders the drop zone container', () => {
			const wrapper = mountDropZone();

			expect(wrapper.find('div').exists()).toBe(true);
		});

		it('renders drag message by default', () => {
			const wrapper = mountDropZone();

			expect(wrapper.text()).toContain('molecules.dropZone.drag.message');
		});

		it('renders the select file button', () => {
			const wrapper = mountDropZone();

			expect(wrapper.text()).toContain('molecules.dropZone.selectFile.message');
		});

		it('renders a hidden file input', () => {
			const wrapper = mountDropZone();
			const input = wrapper.find('input[type="file"]');

			expect(input.exists()).toBe(true);
			expect(input.classes()).toContain('hidden');
		});

		it('sets accept attribute from props', () => {
			const wrapper = mountDropZone({ accept: ['image/png', 'image/jpeg'] });
			const input = wrapper.find('input[type="file"]');

			expect(input.attributes('accept')).toBe('image/png,image/jpeg');
		});

		it('applies the id prop to the file input', () => {
			const wrapper = mountDropZone({ id: 'my-dropzone' });
			const input = wrapper.find('input[type="file"]');

			expect(input.attributes('id')).toBe('my-dropzone');
		});
	});

	describe('file name display', () => {
		it('hides file name box when no file is selected', () => {
			const wrapper = mountDropZone();
			const boxes = wrapper.findAllComponents(Box);
			const fileNameBox = boxes.at(2);

			expect(fileNameBox).toBeDefined();
			expect(fileNameBox!.classes()).toContain('invisible');
		});

		it('shows file name when a file is provided via modelValue', () => {
			const file = createFile('photo.png', 1024, 'image/png');
			const wrapper = mountDropZone({ modelValue: file });

			expect(wrapper.text()).toContain('photo.png');
		});
	});

	describe('file input selection', () => {
		it('has a clickable drop area that contains the file input', () => {
			const wrapper = mountDropZone();
			const dropArea = wrapper.find('.rounded-md.cursor-pointer');
			const input = dropArea.find('input[type="file"]');

			expect(dropArea.exists()).toBe(true);
			expect(input.exists()).toBe(true);
		});

		it('emits update:modelValue when a valid file is selected', async () => {
			const wrapper = mountDropZone();
			const input = wrapper.find('input[type="file"]');
			const file = createFile('photo.png', 1024, 'image/png');

			Object.defineProperty(input.element, 'files', { value: [file], writable: false });
			await input.trigger('change');
			await nextTick();

			expect(wrapper.emitted('update:modelValue')).toHaveLength(1);
			expect(wrapper.emitted('update:modelValue')![0]).toEqual([file]);
		});

		it('does not emit when file exceeds maxFileSize', async () => {
			const wrapper = mountDropZone({ maxFileSize: 1024 });
			const input = wrapper.find('input[type="file"]');
			const file = createFile('large.png', 2048, 'image/png');

			Object.defineProperty(input.element, 'files', { value: [file], writable: false });
			await input.trigger('change');
			await nextTick();

			expect(wrapper.emitted('update:modelValue')).toBeUndefined();
		});

		it('does not emit when file type is not accepted', async () => {
			const wrapper = mountDropZone({ accept: ['image/png'] });
			const input = wrapper.find('input[type="file"]');
			const file = createFile('doc.pdf', 1024, 'application/pdf');

			Object.defineProperty(input.element, 'files', { value: [file], writable: false });
			await input.trigger('change');
			await nextTick();

			expect(wrapper.emitted('update:modelValue')).toBeUndefined();
		});

		it('does not emit when no files are selected', async () => {
			const wrapper = mountDropZone();
			const input = wrapper.find('input[type="file"]');

			Object.defineProperty(input.element, 'files', { value: [], writable: false });
			await input.trigger('change');
			await nextTick();

			expect(wrapper.emitted('update:modelValue')).toBeUndefined();
		});
	});

	describe('clear file', () => {
		it('emits undefined when clear icon is clicked', async () => {
			const file = createFile('photo.png', 1024, 'image/png');
			const wrapper = mountDropZone({ modelValue: file });

			await wrapper.findComponent(CloseIcon).trigger('click');
			await nextTick();

			expect(wrapper.emitted('update:modelValue')).toHaveLength(1);
			expect(wrapper.emitted('update:modelValue')![0]).toEqual([undefined]);
		});

		it('hides file name after clearing', async () => {
			const file = createFile('photo.png', 1024, 'image/png');
			const wrapper = mountDropZone({ modelValue: file });

			await wrapper.findComponent(CloseIcon).trigger('click');
			await nextTick();
			await flushPromises();

			const boxes = wrapper.findAllComponents(Box);
			const fileNameBox = boxes.at(2);
			expect(fileNameBox).toBeDefined();
			expect(fileNameBox!.classes()).toContain('invisible');
		});
	});

	describe('props reactivity', () => {
		it('updates internal state when modelValue prop changes', async () => {
			const wrapper = mountDropZone();
			const file = createFile('new.png', 1024, 'image/png');

			await wrapper.setProps({ modelValue: file });
			await nextTick();

			expect(wrapper.text()).toContain('new.png');
		});

		it('uses default maxFileSize of 5MB', () => {
			const wrapper = mountDropZone();

			expect(wrapper.props('maxFileSize')).toBe(5 * 1024 * 1024);
		});

		it('uses image accept types by default', () => {
			const wrapper = mountDropZone();
			const accept = wrapper.props('accept') as string[];

			expect(accept).toContain('image/jpeg');
			expect(accept).toContain('image/png');
			expect(accept).toContain('image/webp');
		});
	});
});
