import { mount } from '@vue/test-utils';
import { describe, expect, it, vi } from 'vitest';
import { ref } from 'vue';
import { COMMENT_CONTENT_MAX_LENGTH } from '~/domain/comment/comment.constants';
import CommentComposer from './CommentComposer.vue';

vi.stubGlobal('useI18n', () => ({
	t: (key: string, params?: { count?: string; max?: string }) =>
		params ? `${key}:${params.count}/${params.max}` : key,
	n: (value: number) => String(value),
	locale: ref('en')
}));

const stubs = {
	InputTextArea: {
		props: ['modelValue'],
		emits: ['update:modelValue'],
		template:
			'<textarea :value="modelValue" @input="$emit(\'update:modelValue\', $event.target.value)" />'
	},
	Button: {
		props: ['type', 'disabled', 'variant'],
		template: '<button :type="type || \'button\'" :disabled="disabled"><slot /></button>'
	},
	Text: { template: '<p><slot /></p>' }
};

const mountComposer = (props: Record<string, unknown> = {}) =>
	mount(CommentComposer, {
		props: { id: 'composer', label: 'Write', submitLabel: 'Post', ...props },
		global: { stubs, mocks: { $t: (key: string) => key } }
	});

const submitButton = (wrapper: ReturnType<typeof mountComposer>) =>
	wrapper.find('button[type="submit"]');

describe('CommentComposer', () => {
	it('keeps submit disabled while the content is blank', () => {
		expect(
			submitButton(mountComposer({ modelValue: '   ' })).attributes('disabled')
		).toBeDefined();
	});

	it('submits the trimmed content', async () => {
		const wrapper = mountComposer({ modelValue: '  Lovely drink  ' });

		await wrapper.find('form').trigger('submit');

		expect(wrapper.emitted('submit')).toEqual([['Lovely drink']]);
	});

	it('does not submit an edit that leaves the content unchanged', async () => {
		const wrapper = mountComposer({ modelValue: 'Same ', initialValue: 'Same' });

		await wrapper.find('form').trigger('submit');

		expect(submitButton(wrapper).attributes('disabled')).toBeDefined();
		expect(wrapper.emitted('submit')).toBeUndefined();
	});

	it('submits with Ctrl or Cmd + Enter and cancels an edit with Escape', async () => {
		const wrapper = mountComposer({ modelValue: 'Hi', cancelable: true });
		const textarea = wrapper.find('textarea');

		await textarea.trigger('keydown', { key: 'Enter', metaKey: true });
		await textarea.trigger('keydown', { key: 'Escape' });

		expect(wrapper.emitted('submit')).toEqual([['Hi']]);
		expect(wrapper.emitted('cancel')).toHaveLength(1);
	});

	it('only shows the cancel action when cancelable', () => {
		expect(mountComposer().text()).not.toContain('drinkDetailPage.comments.cancel');
		expect(mountComposer({ cancelable: true }).text()).toContain(
			'drinkDetailPage.comments.cancel'
		);
	});

	it('counts characters and warns close to the limit', () => {
		const nearLimit = 'a'.repeat(COMMENT_CONTENT_MAX_LENGTH - 10);
		const counter = mountComposer({ modelValue: nearLimit }).find('p');

		expect(counter.text()).toBe(
			`drinkDetailPage.comments.counter:${nearLimit.length}/${COMMENT_CONTENT_MAX_LENGTH}`
		);
		expect(counter.classes()).toContain('text-warning');
		expect(mountComposer({ modelValue: 'short' }).find('p').classes()).toContain(
			'text-content-muted'
		);
	});
});
