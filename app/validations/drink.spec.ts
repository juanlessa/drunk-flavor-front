import { describe, it, expect } from 'vitest';
import { drinkFormValidator } from './drink';
import type { DrinkForm } from '~/types/drink.types';
import type { PreparationPlan } from '~/domain/preparation/preparation.entity';
import { buildIngredient, buildLine } from '~/test/drink.fixtures';

const gin = buildIngredient('gin', 'Gin');
const mint = buildIngredient('mint', 'Mint');
const exact = (quantity: number, optional = false) =>
	buildLine(gin, { type: 'exact', quantity, unitId: 'ml' }, optional);

const plan: PreparationPlan = {
	mixingVessel: 'shaker',
	servingGlass: 'coupe',
	actions: [{ type: 'shake' }]
};

const buildForm = (overrides: Partial<DrinkForm> = {}): DrinkForm => ({
	translations: {
		en: { name: 'Gin drink', method: 'Shake' },
		pt: { name: 'Drink de gin', method: 'Agite' }
	},
	ingredients: [exact(60)],
	garnishes: [],
	methodMode: 'manual',
	preparation: plan,
	...overrides
});
const fieldsOf = (form: DrinkForm) => drinkFormValidator(form).map(({ field }) => field);

describe('drinkFormValidator', () => {
	it('accepts a complete drink', () => {
		expect(drinkFormValidator(buildForm())).toEqual([]);
	});

	describe('ingredients', () => {
		it('flags a zero quantity at the ingredient index with a translatable key', () => {
			expect(drinkFormValidator(buildForm({ ingredients: [exact(0), exact(30)] }))).toEqual([
				{ field: 'ingredients.0.amount.quantity', message: 'errors.drinks.quantity' }
			]);
		});

		it('flags an exact amount that has no unit', () => {
			const line = buildLine(gin, { type: 'exact', quantity: 5, unitId: '' });

			expect(fieldsOf(buildForm({ ingredients: [line] }))).toEqual([
				'ingredients.0.amount.unitId'
			]);
		});

		it('flags an empty ingredient list', () => {
			expect(drinkFormValidator(buildForm({ ingredients: [] }))).toEqual([
				{ field: 'ingredients', message: 'errors.drinks.ingredients' }
			]);
		});

		it('flags a recipe whose ingredients are all optional', () => {
			expect(drinkFormValidator(buildForm({ ingredients: [exact(60, true)] }))).toEqual([
				{ field: 'ingredients', message: 'errors.drinks.requiredIngredient' }
			]);
		});

		it('accepts an optional ingredient next to a required one', () => {
			expect(fieldsOf(buildForm({ ingredients: [exact(60), exact(10, true)] }))).toEqual([]);
		});

		it('does not check the quantity of an amount with nothing to measure', () => {
			const form = buildForm({
				ingredients: [exact(60), buildLine(mint, { type: 'none' })]
			});

			expect(fieldsOf(form)).toEqual([]);
		});

		it('needs the qualifier of a qualitative amount', () => {
			const line = buildLine(mint, { type: 'qualitative' } as never);

			expect(drinkFormValidator(buildForm({ ingredients: [exact(60), line] }))).toEqual([
				{ field: 'ingredients.1.amount.qualifier', message: 'errors.drinks.qualifier' }
			]);
		});

		it('needs the unit of the hint of a qualitative amount, but not the hint', () => {
			const withoutHint = buildLine(mint, { type: 'qualitative', qualifier: 'top_up' });
			const withHint = buildLine(mint, {
				type: 'qualitative',
				qualifier: 'top_up',
				quantity: 100
			});

			expect(fieldsOf(buildForm({ ingredients: [exact(60), withoutHint] }))).toEqual([]);
			expect(fieldsOf(buildForm({ ingredients: [exact(60), withHint] }))).toEqual([
				'ingredients.1.amount.unitId'
			]);
		});
	});

	describe('garnishes', () => {
		it('may be empty', () => {
			expect(fieldsOf(buildForm({ garnishes: [] }))).toEqual([]);
		});

		it('are checked like the ingredients', () => {
			const bad = buildLine(mint, { type: 'exact', quantity: 0, unitId: 'ml' });

			expect(fieldsOf(buildForm({ garnishes: [bad] }))).toEqual([
				'garnishes.0.amount.quantity'
			]);
		});

		it('are not asked to leave one required', () => {
			expect(fieldsOf(buildForm({ garnishes: [buildLine(mint, undefined, true)] }))).toEqual(
				[]
			);
		});
	});

	describe('method', () => {
		it('asks for the method of each language when it is written by hand', () => {
			const form = buildForm({
				translations: {
					en: { name: 'Gin drink', method: '  ' },
					pt: { name: 'Drink de gin', method: '' }
				}
			});

			expect(drinkFormValidator(form)).toEqual([
				{ field: 'translations.en.method', message: 'errors.drinks.method' },
				{ field: 'translations.pt.method', message: 'errors.drinks.method' }
			]);
		});

		it('does not ask for the methods when a plan writes them', () => {
			const form = buildForm({
				methodMode: 'generated',
				translations: {
					en: { name: 'Gin drink', method: '' },
					pt: { name: 'Drink de gin', method: '' }
				}
			});

			expect(fieldsOf(form)).toEqual([]);
		});

		it('does not check the plan when the method is written by hand', () => {
			const form = buildForm({ preparation: { ...plan, actions: [] } });

			expect(fieldsOf(form)).toEqual([]);
		});

		it('asks for at least one step when the method is generated', () => {
			const form = buildForm({
				methodMode: 'generated',
				preparation: { ...plan, actions: [] }
			});

			expect(drinkFormValidator(form)).toEqual([
				{ field: 'preparation.actions', message: 'errors.drinks.preparation.actions' }
			]);
		});

		it('points at the step and the field of a step that is not finished', () => {
			const form = buildForm({
				methodMode: 'generated',
				preparation: {
					...plan,
					actions: [
						{ type: 'shake' },
						{ type: 'add', target: 'mixing', items: [] },
						{ type: 'shake', seconds: 1.5 }
					]
				}
			});

			expect(drinkFormValidator(form)).toEqual([
				{
					field: 'preparation.actions.1.items',
					message: 'errors.drinks.preparation.items'
				},
				{
					field: 'preparation.actions.2.seconds',
					message: 'errors.drinks.preparation.duration'
				}
			]);
		});
	});

	it('flags an empty name in each language', () => {
		const form = buildForm({
			translations: {
				en: { name: ' ', method: 'Shake' },
				pt: { name: '', method: 'Agite' }
			}
		});

		expect(fieldsOf(form)).toEqual(['translations.en.name', 'translations.pt.name']);
	});
});
