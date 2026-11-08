import { mount } from '@vue/test-utils';
import { describe, expect, it, vi } from 'vitest';
import { ref } from 'vue';
import PreparationActionCard from './PreparationActionCard.vue';
import PreparationPlanBuilder from './PreparationPlanBuilder.vue';
import PreparationPreview from './PreparationPreview.vue';
import type { ApiFieldError } from '~/domain/shared/api.types';
import type { PreparationAction, PreparationPlan } from '~/domain/preparation/preparation.entity';
import { buildIngredient, buildLine } from '~/test/drink.fixtures';
import type { PreparationPreviewState } from '~/types/drink.types';

vi.stubGlobal('useI18n', () => ({ t: (key: string) => key, locale: ref('en') }));

const SelectStub = {
	props: ['id', 'modelValue', 'options', 'placeholder', 'hasError'],
	emits: ['update:modelValue'],
	template: '<div :id="id" data-testid="select" :data-value="modelValue" />'
};
const CardStub = {
	props: [
		'action',
		'index',
		'total',
		'open',
		'idPrefix',
		'choices',
		'errorOf',
		'errors',
		'warnings'
	],
	emits: ['update:action', 'toggle', 'moveUp', 'moveDown', 'remove'],
	template: '<li data-testid="card" :data-open="String(open)">{{ index }}:{{ action.type }}</li>'
};
const PreviewStub = {
	props: ['preview'],
	emits: ['generate'],
	template: '<div data-testid="preview" />'
};

const emptyPreview = (): PreparationPreviewState => ({
	loading: false,
	method: undefined,
	sentences: undefined,
	errors: [],
	warnings: [],
	stale: false
});
const plan = (...actions: PreparationAction[]): PreparationPlan => ({
	mixingVessel: 'shaker',
	servingGlass: 'coupe',
	actions
});
const issue = (path: string, message = 'problem'): ApiFieldError => ({
	location: 'body',
	path,
	localeKey: `key.${path}`,
	message
});

const gin = buildIngredient('gin', 'Gin');
const mountBuilder = (props: Record<string, unknown> = {}) =>
	mount(PreparationPlanBuilder, {
		props: {
			plan: plan(),
			ingredients: [buildLine(gin)],
			garnishes: [],
			preview: emptyPreview(),
			...props
		},
		global: {
			stubs: {
				InputWrapper: {
					template: '<div><slot name="label" /><slot /><slot name="error" /></div>'
				},
				Label: { props: ['for'], template: '<label :for="$props.for"><slot /></label>' },
				Text: { template: '<p><slot /></p>' },
				ErrorMessage: {
					props: ['value'],
					template: '<span data-testid="error">{{ value }}</span>'
				},
				InputSelect: SelectStub,
				PreparationActionCard: CardStub,
				PreparationPreview: PreviewStub
			},
			mocks: { $t: (key: string) => key }
		}
	});
const lastPlan = (wrapper: ReturnType<typeof mountBuilder>) =>
	wrapper.emitted('update:plan')?.at(-1)?.[0] as PreparationPlan;
const select = (wrapper: ReturnType<typeof mountBuilder>, id: string) =>
	wrapper.findAllComponents(SelectStub).find((item) => item.props('id') === id)!;

describe('PreparationPlanBuilder', () => {
	it('references the real card and preview components it composes', () => {
		expect(PreparationActionCard).toBeDefined();
		expect(PreparationPreview).toBeDefined();
	});

	describe('where the drink is made and served', () => {
		it('offers the vessels and the glasses and shows the ones in the plan', () => {
			const wrapper = mountBuilder();

			expect(select(wrapper, 'mixing-vessel').props('modelValue')).toBe('shaker');
			expect(
				select(wrapper, 'mixing-vessel')
					.props('options')
					.map((o: { value: string }) => o.value)
			).toEqual(['shaker', 'mixing_glass', 'pitcher', 'serving_glass']);
			expect(select(wrapper, 'serving-glass').props('modelValue')).toBe('coupe');
			expect(select(wrapper, 'serving-glass').props('options')).toHaveLength(16);
		});

		it('writes the picked vessel and glass in the plan, keeping the steps', () => {
			const wrapper = mountBuilder({ plan: plan({ type: 'shake' }) });

			select(wrapper, 'mixing-vessel').vm.$emit('update:modelValue', 'pitcher');
			expect(lastPlan(wrapper)).toEqual({
				...plan({ type: 'shake' }),
				mixingVessel: 'pitcher'
			});
			select(wrapper, 'serving-glass').vm.$emit('update:modelValue', 'rocks');
			expect(lastPlan(wrapper)).toMatchObject({
				servingGlass: 'rocks',
				actions: [{ type: 'shake' }]
			});
		});
	});

	describe('the steps', () => {
		it('explains that there are none yet', () => {
			const wrapper = mountBuilder();

			expect(wrapper.findAll('[data-testid="card"]')).toHaveLength(0);
			expect(wrapper.text()).toContain('organisms.preparationBuilder.actions.empty');
		});

		it('renders a card per step, in order, closed', () => {
			const wrapper = mountBuilder({ plan: plan({ type: 'muddle' }, { type: 'shake' }) });

			expect(wrapper.findAll('[data-testid="card"]').map((card) => card.text())).toEqual([
				'0:muddle',
				'1:shake'
			]);
			expect(
				wrapper.findAll('[data-testid="card"]').map((card) => card.attributes('data-open'))
			).toEqual(['false', 'false']);
		});

		it('offers every kind of step', () => {
			expect(
				select(mountBuilder(), 'add-action')
					.props('options')
					.map((o: { value: string }) => o.value)
			).toEqual([
				'prepare_glass',
				'add',
				'add_ice',
				'muddle',
				'shake',
				'stir',
				'strain',
				'top',
				'garnish',
				'custom'
			]);
		});

		it.each([
			['prepare_glass', { type: 'prepare_glass', mode: 'chill' }],
			['add', { type: 'add', target: 'mixing', items: [] }],
			['add_ice', { type: 'add_ice', target: 'mixing', kind: 'cubes' }],
			['muddle', { type: 'muddle' }],
			['shake', { type: 'shake' }],
			['stir', { type: 'stir' }],
			['strain', { type: 'strain', kind: 'single' }],
			['top', { type: 'top', item: { list: 'ingredients', ingredientId: '' } }],
			['garnish', { type: 'garnish', items: [] }],
			['custom', { type: 'custom', text: { en: '', pt: '' } }]
		])('adds a %s step with only what it needs to start', (type, expected) => {
			const wrapper = mountBuilder({ plan: plan({ type: 'shake' }) });

			select(wrapper, 'add-action').vm.$emit('update:modelValue', type);

			expect(lastPlan(wrapper).actions).toEqual([{ type: 'shake' }, expected]);
		});

		it('ignores a kind of step that does not exist', () => {
			const wrapper = mountBuilder();

			select(wrapper, 'add-action').vm.$emit('update:modelValue', 'blend');

			expect(wrapper.emitted('update:plan')).toBeUndefined();
		});

		it('opens the step it just added, and only that one', async () => {
			const wrapper = mountBuilder({ plan: plan({ type: 'shake' }) });

			select(wrapper, 'add-action').vm.$emit('update:modelValue', 'muddle');
			await wrapper.setProps({ plan: lastPlan(wrapper) });

			expect(
				wrapper.findAll('[data-testid="card"]').map((card) => card.attributes('data-open'))
			).toEqual(['false', 'true']);
		});

		it('replaces the step that changed', () => {
			const wrapper = mountBuilder({ plan: plan({ type: 'muddle' }, { type: 'shake' }) });

			wrapper
				.findAllComponents(CardStub)[1]!
				.vm.$emit('update:action', { type: 'shake', seconds: 10 });

			expect(lastPlan(wrapper).actions).toEqual([
				{ type: 'muddle' },
				{ type: 'shake', seconds: 10 }
			]);
		});

		it('moves a step and keeps open the card that was open', async () => {
			const wrapper = mountBuilder({ plan: plan({ type: 'muddle' }, { type: 'shake' }) });
			await wrapper.findAllComponents(CardStub)[1]!.vm.$emit('toggle');
			await wrapper.vm.$nextTick();

			wrapper.findAllComponents(CardStub)[1]!.vm.$emit('moveUp');
			await wrapper.setProps({ plan: lastPlan(wrapper) });

			expect(lastPlan(wrapper).actions.map(({ type }) => type)).toEqual(['shake', 'muddle']);
			expect(
				wrapper.findAll('[data-testid="card"]').map((card) => card.attributes('data-open'))
			).toEqual(['true', 'false']);
		});

		it('ignores moves past the ends', () => {
			const wrapper = mountBuilder({ plan: plan({ type: 'muddle' }, { type: 'shake' }) });

			wrapper.findAllComponents(CardStub)[0]!.vm.$emit('moveUp');
			wrapper.findAllComponents(CardStub)[1]!.vm.$emit('moveDown');

			expect(wrapper.emitted('update:plan')).toBeUndefined();
		});

		it('removes a step', () => {
			const wrapper = mountBuilder({ plan: plan({ type: 'muddle' }, { type: 'shake' }) });

			wrapper.findAllComponents(CardStub)[0]!.vm.$emit('remove');

			expect(lastPlan(wrapper).actions).toEqual([{ type: 'shake' }]);
		});

		it('shows the error of the list of steps', () => {
			const wrapper = mountBuilder({
				checkError: (field: string) =>
					field === 'preparation.actions' ? 'errors.drinks.preparation.actions' : ''
			});

			expect(wrapper.text()).toContain('errors.drinks.preparation.actions');
		});

		it('asks the form for the error of a field of a step by its path', () => {
			const checkError = vi.fn(() => '');
			const wrapper = mountBuilder({
				plan: plan({ type: 'muddle' }, { type: 'shake' }),
				checkError
			});

			const errorOf = wrapper.findAllComponents(CardStub)[1]!.props('errorOf') as (
				field: string
			) => string;
			errorOf('seconds');

			expect(checkError).toHaveBeenCalledWith('preparation.actions.1.seconds');
		});
	});

	describe('what the API said', () => {
		it('hands each step only its own errors and warnings', () => {
			const wrapper = mountBuilder({
				plan: plan({ type: 'muddle' }, { type: 'shake' }),
				preview: {
					...emptyPreview(),
					errors: [issue('preparation.actions.1', 'nothing to shake')],
					warnings: [issue('preparation.actions.0', 'muddling with ice')]
				}
			});
			const [first, second] = wrapper.findAllComponents(CardStub);

			expect(first!.props('errors')).toEqual([]);
			expect(first!.props('warnings').map((w: ApiFieldError) => w.message)).toEqual([
				'muddling with ice'
			]);
			expect(second!.props('errors').map((e: ApiFieldError) => e.message)).toEqual([
				'nothing to shake'
			]);
		});

		it('opens the steps the API had remarks about', async () => {
			const wrapper = mountBuilder({ plan: plan({ type: 'muddle' }, { type: 'shake' }) });

			await wrapper.setProps({
				preview: { ...emptyPreview(), errors: [issue('preparation.actions.1')] }
			});

			expect(
				wrapper.findAll('[data-testid="card"]').map((card) => card.attributes('data-open'))
			).toEqual(['false', 'true']);
		});

		it('lists the problems of the plan as a whole, which belong to no step', () => {
			const wrapper = mountBuilder({
				preview: {
					...emptyPreview(),
					errors: [
						issue('preparation', 'Nothing was served'),
						issue('preparation.actions.0', 'step problem')
					]
				}
			});

			expect(wrapper.findAll('[role="alert"]').map((item) => item.text())).toEqual([
				'Nothing was served'
			]);
		});
	});

	describe('the preview', () => {
		it('hands the preview down and asks the form to generate it', () => {
			const preview = { ...emptyPreview(), stale: true };
			const wrapper = mountBuilder({ preview });

			expect(wrapper.findComponent(PreviewStub).props('preview')).toEqual(preview);
			wrapper.findComponent(PreviewStub).vm.$emit('generate');
			expect(wrapper.emitted('generate')).toHaveLength(1);
		});
	});
});
