import { beforeEach, describe, expect, it, vi } from 'vitest';
import { registerEndpoint } from '@nuxt/test-utils/runtime';
import { readBody, setResponseStatus } from 'h3';
import { nextTick, ref } from 'vue';
import { usePreparationPreview } from './usePreparationPreview';
import { initEmptyDrinkForm } from '~/factories/drink.factory';
import { buildIngredient, buildLine } from '~/test/drink.fixtures';
import type { ToastState } from '~/components/organisms/toastNotification/ToastNotification.types';
import type { DrinkForm } from '~/types/drink.types';

// The composable talks to the real app; only the endpoint of the backend is replaced.
const sentBodies: unknown[] = [];
let respond: () => Promise<{ status: number; body: unknown }> = async () => ({
	status: 200,
	body: null
});

registerEndpoint('/drinks/method', {
	method: 'POST',
	handler: async (event) => {
		sentBodies.push(await readBody(event));
		const { status, body } = await respond();
		setResponseStatus(event, status);
		return body;
	}
});

const buildForm = (): DrinkForm => ({
	...initEmptyDrinkForm(),
	ingredients: [buildLine(buildIngredient('gin', 'Gin'))],
	preparation: {
		mixingVessel: 'shaker',
		servingGlass: 'coupe',
		actions: [{ type: 'shake' }]
	}
});
const fieldError = {
	location: 'body',
	path: 'preparation.actions.0',
	localeKey: 'apiResponses.drinks.preparation.dryShakeWithoutWetShake',
	message: 'Dry shake'
};
const success = {
	method: { en: 'Shake.', pt: 'Agite.' },
	sentences: { en: ['Shake.'], pt: ['Agite.'] },
	warnings: []
};

const toasts = () => useState<ToastState>('toastNotification').value.displayingToasts;
const toastTypes = () => toasts().map(({ type }) => type);

const setup = () => {
	const form = ref(buildForm());
	return { form, ...usePreparationPreview(form) };
};

describe('usePreparationPreview', () => {
	beforeEach(() => {
		sentBodies.length = 0;
		// `useToast` creates the state of the toasts the first time it is used.
		useToast();
		useState<ToastState>('toastNotification').value.displayingToasts = [];
		respond = async () => ({ status: 200, body: success });
		vi.spyOn(console, 'error').mockImplementation(() => undefined);
	});

	it('starts with nothing generated', () => {
		const { preview } = setup();

		expect(preview.value).toEqual({
			loading: false,
			method: undefined,
			sentences: undefined,
			errors: [],
			warnings: [],
			stale: false
		});
	});

	it('sends the recipe lines and the plan of the form', async () => {
		const { generate } = setup();

		await generate();

		expect(sentBodies).toEqual([
			{
				ingredients: [
					{
						ingredientId: 'gin',
						amount: { type: 'exact', quantity: 60, unitId: 'ml' },
						optional: false
					}
				],
				garnishes: [],
				preparation: buildForm().preparation
			}
		]);
	});

	it('is loading while the backend answers', async () => {
		let release: () => void = () => undefined;
		respond = () =>
			new Promise((resolve) => {
				release = () => resolve({ status: 200, body: success });
			});
		const { preview, generate } = setup();

		const pending = generate();
		expect(preview.value.loading).toBe(true);
		await vi.waitFor(() => expect(sentBodies).toHaveLength(1));
		release();
		await pending;

		expect(preview.value.loading).toBe(false);
	});

	describe('when the backend writes the method', () => {
		it('keeps the method in both languages and reports success', async () => {
			const { preview, generate } = setup();

			await generate();

			expect(preview.value.method).toEqual({ en: 'Shake.', pt: 'Agite.' });
			expect(preview.value.sentences).toEqual({ en: ['Shake.'], pt: ['Agite.'] });
			expect(toastTypes()).toEqual(['success']);
		});

		it('also reports a warning when the backend had remarks', async () => {
			respond = async () => ({ status: 200, body: { ...success, warnings: [fieldError] } });
			const { preview, generate } = setup();

			await generate();

			expect(preview.value.warnings).toEqual([fieldError]);
			expect(toastTypes().sort()).toEqual(['success', 'warning']);
		});

		it('clears what the last attempt had said', async () => {
			respond = async () => ({ status: 400, body: { errors: [fieldError] } });
			const { preview, generate } = setup();
			await generate();
			expect(preview.value.errors).toHaveLength(1);

			respond = async () => ({ status: 200, body: success });
			await generate();

			expect(preview.value.errors).toEqual([]);
		});
	});

	describe('when the backend refuses the plan', () => {
		it('keeps the errors, with where they happened, and reports an error', async () => {
			respond = async () => ({ status: 400, body: { errors: [fieldError, fieldError] } });
			const { preview, generate } = setup();

			await generate();

			expect(preview.value.errors).toEqual([fieldError, fieldError]);
			expect(preview.value.method).toBeUndefined();
			expect(preview.value.loading).toBe(false);
			expect(toastTypes()).toEqual(['error']);
		});

		it('reports an error also when the failure says nothing about the plan', async () => {
			respond = async () => ({ status: 500, body: { message: 'boom' } });
			const { preview, generate } = setup();

			await generate();

			expect(preview.value.errors).toEqual([]);
			expect(preview.value.loading).toBe(false);
			expect(toastTypes()).toEqual(['error']);
		});
	});

	describe('keeping up with the form', () => {
		it('marks the preview out of date once the plan changes', async () => {
			const { form, preview, generate } = setup();
			await generate();

			form.value.preparation.actions.push({ type: 'muddle' });
			await nextTick();

			expect(preview.value.stale).toBe(true);
		});

		it('marks it out of date once a recipe line changes', async () => {
			const { form, preview, generate } = setup();
			await generate();

			form.value.ingredients = [];
			await nextTick();

			expect(preview.value.stale).toBe(true);
		});

		it('is not out of date when the names or the methods change, which the plan does not use', async () => {
			const { form, preview, generate } = setup();
			await generate();

			form.value.translations.en.name = 'Another name';
			await nextTick();

			expect(preview.value.stale).toBe(false);
		});

		it('has nothing to be out of date before a preview exists', async () => {
			const { form, preview } = setup();

			form.value.preparation.actions.push({ type: 'muddle' });
			await nextTick();

			expect(preview.value.stale).toBe(false);
		});

		it('keeps the errors until the next preview, so they can be read while fixing the plan', async () => {
			respond = async () => ({ status: 400, body: { errors: [fieldError] } });
			const { form, preview, generate } = setup();
			await generate();

			form.value.preparation.actions.push({ type: 'muddle' });
			await nextTick();

			expect(preview.value.errors).toEqual([fieldError]);
		});
	});
});
