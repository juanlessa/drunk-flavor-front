import { mount } from '@vue/test-utils';
import { describe, expect, it, vi } from 'vitest';
import { ref } from 'vue';
import PreparationActionCard from './PreparationActionCard.vue';
import type { ApiFieldError } from '~/domain/shared/api.types';
import type { PreparationAction, RecipeList } from '~/domain/preparation/preparation.entity';
import { buildItemChoices } from '~/helpers/recipe.helpers';
import { buildIngredient, buildLine } from '~/test/drink.fixtures';

vi.stubGlobal('useI18n', () => ({
	t: (key: string) => key,
	locale: ref('en')
}));

const EditorStub = {
	props: ['action', 'choices', 'idPrefix', 'errorOf'],
	emits: ['update:action'],
	template: '<div data-testid="editor" />'
};

const gin = buildIngredient('gin', 'Gin');
const salt = buildIngredient('salt', 'Salt', []);
const choices: Record<RecipeList, ReturnType<typeof buildItemChoices>> = {
	ingredients: buildItemChoices({ ingredients: [buildLine(gin)] }, ['ingredients'], 'en'),
	garnishes: buildItemChoices(
		{ garnishes: [buildLine(salt, { type: 'none' })] },
		['garnishes'],
		'en'
	)
};
const ginRef = { list: 'ingredients' as const, ingredientId: 'gin', unitId: 'ml' };

const issue = (message: string): ApiFieldError => ({
	location: 'body',
	path: 'preparation.actions.1',
	localeKey: `key.${message}`,
	message
});

const mountCard = (action: PreparationAction, props: Record<string, unknown> = {}) =>
	mount(PreparationActionCard, {
		props: { action, index: 1, total: 3, idPrefix: 'action-1', choices, ...props },
		global: {
			stubs: {
				PreparationActionEditor: EditorStub,
				Badge: {
					props: ['value', 'tone'],
					template: '<span data-testid="badge" :data-tone="tone">{{ value }}</span>'
				},
				ArrowUpIcon: true,
				ArrowDownIcon: true,
				TrashIcon: true
			},
			mocks: { $t: (key: string) => key }
		}
	});

describe('PreparationActionCard', () => {
	it('shows the position, the kind of step and what it does', () => {
		const wrapper = mountCard({ type: 'add', target: 'mixing', items: [ginRef] });

		expect(wrapper.text()).toContain('2');
		expect(wrapper.text()).toContain('organisms.preparationBuilder.actionTypes.add.title');
		expect(wrapper.text()).toContain('Gin');
	});

	it.each([
		{
			action: { type: 'add_ice', target: 'mixing', kind: 'crushed' } as const,
			text: 'iceKind.crushed'
		},
		{ action: { type: 'strain', kind: 'double' } as const, text: 'strainKind.double' },
		{
			action: { type: 'shake', intensity: 'vigorous' } as const,
			text: 'intensity.shake.vigorous'
		},
		{ action: { type: 'prepare_glass', mode: 'chill' } as const, text: 'glassMode.chill' },
		{ action: { type: 'top', item: ginRef } as const, text: 'Gin' },
		{
			action: { type: 'custom', text: { en: 'Stir once.', pt: 'Mexa uma vez.' } } as const,
			text: 'Stir once.'
		}
	])('summarizes a $action.type step', ({ action, text }) => {
		expect(mountCard(action).text()).toContain(text);
	});

	it('does not name an item that was not chosen yet', () => {
		const wrapper = mountCard({ type: 'top', item: { list: 'ingredients', ingredientId: '' } });

		expect(wrapper.text()).not.toContain('Gin');
	});

	describe('opening', () => {
		it('hides the fields while closed and shows them when open, saying so to assistive technology', () => {
			const closed = mountCard({ type: 'shake' });
			const open = mountCard({ type: 'shake' }, { open: true });

			expect(closed.find('[aria-expanded]').attributes('aria-expanded')).toBe('false');
			expect(closed.find('#action-1-body').attributes('style')).toContain('display: none');
			expect(open.find('[aria-expanded]').attributes('aria-expanded')).toBe('true');
			expect(open.find('#action-1-body').attributes('style') ?? '').not.toContain(
				'display: none'
			);
		});

		it('asks to be toggled from the header', async () => {
			const wrapper = mountCard({ type: 'shake' });

			await wrapper.find('[aria-expanded]').trigger('click');

			expect(wrapper.emitted('toggle')).toHaveLength(1);
		});

		it('stays open while one of its fields has an error, so the error is not hidden', () => {
			const wrapper = mountCard(
				{ type: 'add', target: 'mixing', items: [] },
				{
					errorOf: (field: string) =>
						field === 'items' ? 'errors.drinks.preparation.items' : ''
				}
			);

			expect(wrapper.find('#action-1-body').attributes('style') ?? '').not.toContain(
				'display: none'
			);
			expect(wrapper.find('[data-testid="badge"]').attributes('data-tone')).toBe('danger');
		});
	});

	describe('what the API said', () => {
		it('lists the errors of the step, marks it and keeps them visible while closed', () => {
			const wrapper = mountCard({ type: 'shake' }, { errors: [issue('Nothing to shake')] });

			expect(wrapper.find('[role="alert"]').text()).toBe('Nothing to shake');
			expect(wrapper.find('[data-testid="badge"]').attributes('data-tone')).toBe('danger');
			expect(wrapper.classes()).toContain('border-danger-stroke');
		});

		it('lists the warnings of the step without calling it an error', () => {
			const wrapper = mountCard(
				{ type: 'shake' },
				{ warnings: [issue('No ice in the shaker')] }
			);

			expect(wrapper.text()).toContain('No ice in the shaker');
			expect(wrapper.find('[role="alert"]').exists()).toBe(false);
			expect(wrapper.find('[data-testid="badge"]').attributes('data-tone')).toBe('warning');
		});

		it('shows the error badge when there are both', () => {
			const wrapper = mountCard(
				{ type: 'shake' },
				{ errors: [issue('a')], warnings: [issue('b')] }
			);

			expect(wrapper.findAll('[data-testid="badge"]')).toHaveLength(1);
			expect(wrapper.find('[data-testid="badge"]').attributes('data-tone')).toBe('danger');
		});

		it('shows no badge and no list for a step without remarks', () => {
			const wrapper = mountCard({ type: 'shake' });

			expect(wrapper.find('[data-testid="badge"]').exists()).toBe(false);
			expect(wrapper.find('ul').exists()).toBe(false);
		});
	});

	describe('moves and removal', () => {
		it('cannot move the first step up or the last one down', () => {
			const first = mountCard({ type: 'shake' }, { index: 0 });
			const last = mountCard({ type: 'shake' }, { index: 2 });
			const title = 'organisms.preparationBuilder.actionTypes.shake.title';

			expect(
				first.find(`button[aria-label="organisms.preparationBuilder.card.moveUp"]`).exists()
			).toBe(true);
			expect(title).toBeTruthy();
			expect(first.findAll('button[disabled]')).toHaveLength(1);
			expect(last.findAll('button[disabled]')).toHaveLength(1);
		});

		it('emits the moves and the removal', async () => {
			const wrapper = mountCard({ type: 'shake' });
			const [, up, down, remove] = wrapper.findAll('button');

			await up!.trigger('click');
			await down!.trigger('click');
			await remove!.trigger('click');

			expect(wrapper.emitted('moveUp')).toHaveLength(1);
			expect(wrapper.emitted('moveDown')).toHaveLength(1);
			expect(wrapper.emitted('remove')).toHaveLength(1);
		});
	});

	it('hands the changes of the editor up', () => {
		const wrapper = mountCard({ type: 'shake' });

		wrapper.findComponent(EditorStub).vm.$emit('update:action', { type: 'shake', seconds: 10 });

		expect(wrapper.emitted('update:action')).toEqual([[{ type: 'shake', seconds: 10 }]]);
	});
});
