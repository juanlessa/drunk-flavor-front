import { describe, expect, it } from 'vitest';
import type { PreparationAction } from '~/domain/preparation/preparation.entity';
import { emptyItemRef } from '~/helpers/recipe.helpers';
import { preparationPlanValidation } from './preparation';

const item = { list: 'ingredients' as const, ingredientId: 'gin', unitId: 'ml' };
const plan = (...actions: unknown[]) => ({
	mixingVessel: 'shaker',
	servingGlass: 'coupe',
	actions
});

/** Where and why the validation rejected the plan. */
const issuesOf = (input: unknown) => {
	const result = preparationPlanValidation.safeParse(input);
	return result.success
		? []
		: result.error.issues.map(({ path, message }) => ({ path, message }));
};
const prefix = 'errors.drinks.preparation';

describe('preparationPlanValidation', () => {
	it.each<PreparationAction>([
		{ type: 'prepare_glass', mode: 'chill' },
		{ type: 'prepare_glass', mode: 'rinse', item },
		{ type: 'prepare_glass', mode: 'rim', item, coverage: 'half' },
		{ type: 'add', target: 'mixing', items: [item] },
		{ type: 'add_ice', target: 'mixing', kind: 'cubes' },
		{ type: 'muddle' },
		{ type: 'shake', seconds: 10 },
		{ type: 'stir', revolutions: 20 },
		{ type: 'strain', kind: 'single' },
		{ type: 'top', item },
		{ type: 'garnish', items: [item], style: 'float' },
		{ type: 'custom', text: { en: 'Do it.', pt: 'Faça.' } }
	])('accepts a finished $type step', (action) => {
		expect(issuesOf(plan(action))).toEqual([]);
	});

	it('asks for the place of the mixing and the serving glass', () => {
		expect(
			issuesOf({ mixingVessel: '', servingGlass: '', actions: [{ type: 'muddle' }] })
		).toEqual([
			{ path: ['mixingVessel'], message: `${prefix}.mixingVessel` },
			{ path: ['servingGlass'], message: `${prefix}.servingGlass` }
		]);
	});

	it('asks for at least one step', () => {
		expect(issuesOf(plan())).toEqual([{ path: ['actions'], message: `${prefix}.actions` }]);
	});

	it.each([
		{
			title: 'a rinse with no item',
			action: { type: 'prepare_glass', mode: 'rinse', item: emptyItemRef('ingredients') },
			path: 'item',
			message: 'item'
		},
		{
			title: 'a rim with no item',
			action: { type: 'prepare_glass', mode: 'rim', item: emptyItemRef('garnishes') },
			path: 'item',
			message: 'item'
		},
		{
			title: 'an add with no items',
			action: { type: 'add', target: 'mixing', items: [] },
			path: 'items',
			message: 'items'
		},
		{
			title: 'a garnish with no items',
			action: { type: 'garnish', items: [] },
			path: 'items',
			message: 'items'
		},
		{
			title: 'a top with no item',
			action: { type: 'top', item: emptyItemRef('ingredients') },
			path: 'item',
			message: 'item'
		},
		{
			title: 'a custom step with one text missing',
			action: { type: 'custom', text: { en: 'Do it.', pt: '  ' } },
			path: 'text',
			message: 'text'
		},
		{
			title: 'a shake for zero seconds',
			action: { type: 'shake', seconds: 0 },
			path: 'seconds',
			message: 'duration'
		},
		{
			title: 'a shake for a fraction of a second',
			action: { type: 'shake', seconds: 1.5 },
			path: 'seconds',
			message: 'duration'
		},
		{
			title: 'a stir for negative turns',
			action: { type: 'stir', revolutions: -2 },
			path: 'revolutions',
			message: 'duration'
		}
	])('flags $title', ({ action, path, message }) => {
		expect(issuesOf(plan(action))).toEqual([
			{ path: ['actions', 0, path], message: `${prefix}.${message}` }
		]);
	});

	it('does not need the item of a chilled or warmed glass', () => {
		expect(
			issuesOf(
				plan(
					{ type: 'prepare_glass', mode: 'chill' },
					{ type: 'prepare_glass', mode: 'warm' }
				)
			)
		).toEqual([]);
	});

	it('leaves the meaning of the steps to the backend', () => {
		// Straining before anything was added makes no sense, but the form cannot know the recipe well enough.
		expect(issuesOf(plan({ type: 'strain', kind: 'single' }))).toEqual([]);
	});
});
