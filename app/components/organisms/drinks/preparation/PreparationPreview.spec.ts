import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import PreparationPreview from './PreparationPreview.vue';
import type { ApiFieldError } from '~/domain/shared/api.types';
import type { PreparationPreviewState } from '~/types/drink.types';

const emptyPreview = (): PreparationPreviewState => ({
	loading: false,
	method: undefined,
	sentences: undefined,
	errors: [],
	warnings: [],
	stale: false
});
const issue = (path: string, message: string): ApiFieldError => ({
	location: 'body',
	path,
	localeKey: `key.${message}`,
	message
});

const mountPreview = (preview: Partial<PreparationPreviewState> = {}) =>
	mount(PreparationPreview, {
		props: { preview: { ...emptyPreview(), ...preview } },
		global: {
			stubs: {
				Text: { template: '<p><slot /></p>' },
				Button: {
					props: ['type', 'variant', 'disabled'],
					template: '<button :type="type" :disabled="disabled"><slot /></button>'
				}
			},
			mocks: {
				$t: (key: string, params?: { number?: number }) =>
					params ? `${key}:${params.number}` : key
			}
		}
	});

describe('PreparationPreview', () => {
	it('asks to generate the preview', async () => {
		const wrapper = mountPreview();

		await wrapper.find('button').trigger('click');

		expect(wrapper.find('button').text()).toBe('organisms.preparationBuilder.preview.generate');
		expect(wrapper.emitted('generate')).toHaveLength(1);
	});

	it('cannot be asked again while it is being generated', () => {
		const wrapper = mountPreview({ loading: true });

		expect(wrapper.find('button').attributes('disabled')).toBeDefined();
		expect(wrapper.find('button').text()).toBe(
			'organisms.preparationBuilder.preview.generating'
		);
	});

	it('shows nothing but the button before there is a preview', () => {
		const wrapper = mountPreview();

		expect(wrapper.find('[data-testid="preview-en"]').exists()).toBe(false);
		expect(wrapper.find('ul').exists()).toBe(false);
		expect(wrapper.find('[data-testid="preview-stale"]').exists()).toBe(false);
	});

	it('shows the method in both languages, whatever the interface language is', () => {
		const wrapper = mountPreview({
			method: { en: 'In a shaker, add gin.', pt: 'Em uma coqueteleira, adicione o gin.' }
		});

		expect(wrapper.find('[data-testid="preview-en"]').text()).toBe('In a shaker, add gin.');
		expect(wrapper.find('[data-testid="preview-en"]').attributes('lang')).toBe('en');
		expect(wrapper.find('[data-testid="preview-pt"]').text()).toBe(
			'Em uma coqueteleira, adicione o gin.'
		);
		expect(wrapper.find('[data-testid="preview-pt"]').attributes('lang')).toBe('pt');
	});

	it('says when the preview is out of date', () => {
		const wrapper = mountPreview({ method: { en: 'a', pt: 'b' }, stale: true });

		expect(wrapper.find('[data-testid="preview-stale"]').text()).toBe(
			'organisms.preparationBuilder.preview.stale'
		);
	});

	describe('remarks of the API', () => {
		it('lists the errors as alerts and the warnings as plain remarks, naming the step', () => {
			const wrapper = mountPreview({
				errors: [issue('preparation.actions.2', 'Nothing to shake')],
				warnings: [issue('preparation.actions.0', 'Muddling with ice')]
			});
			const items = wrapper.findAll('li');

			// The browser collapses the whitespace between the step and the message; the test does it too.
			expect(items.map((item) => item.text().replace(/\s+/g, ' '))).toEqual([
				'organisms.preparationBuilder.preview.step:3: Nothing to shake',
				'organisms.preparationBuilder.preview.step:1: Muddling with ice'
			]);
			expect(items[0]!.attributes('role')).toBe('alert');
			expect(items[0]!.classes()).toContain('text-danger');
			expect(items[1]!.attributes('role')).toBeUndefined();
			expect(items[1]!.classes()).toContain('text-warning');
		});

		it('does not name a step for a problem of the plan as a whole', () => {
			const wrapper = mountPreview({ errors: [issue('preparation', 'Nothing was served')] });

			expect(wrapper.find('li').text()).toBe('Nothing was served');
		});
	});
});
