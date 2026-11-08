import { flushPromises, mount } from '@vue/test-utils';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import CreateDrink from './CreateDrink.vue';
import { initEmptyDrinkForm } from '~/factories/drink.factory';
import { mapFormToCreateDrink } from '~/mappers/drink.mappers';
import { buildIngredient, buildLine } from '~/test/drink.fixtures';
import type { DrinkForm } from '~/types/drink.types';

const DrinkFormStub = {
	props: ['title', 'submitLabel', 'serverErrors'],
	emits: ['submit', 'cancel'],
	template: '<div data-testid="drink-form" />'
};

const mockCreate = vi.fn();
const mockUpdateCover = vi.fn();
const mockUpdateThumbnail = vi.fn();
const mockRouterBack = vi.fn();
const mockAddToast = vi.fn();

vi.stubGlobal('useNuxtApp', () => ({
	$api: {
		drinks: {
			create: mockCreate,
			updateCover: mockUpdateCover,
			updateThumbnail: mockUpdateThumbnail
		}
	},
	$router: { back: mockRouterBack }
}));
vi.stubGlobal('useI18n', () => ({ t: (key: string) => key }));
vi.stubGlobal('useToast', () => ({ addToast: mockAddToast }));

const form: DrinkForm = {
	...initEmptyDrinkForm(),
	translations: {
		en: { name: 'Mojito', method: 'Shake.' },
		pt: { name: 'Mojito', method: 'Bata.' }
	},
	ingredients: [buildLine(buildIngredient('rum', 'Rum'))]
};
const cover = new File(['c'], 'cover.png', { type: 'image/png' });
const thumbnail = new File(['t'], 'thumb.png', { type: 'image/png' });

const mountCreate = () =>
	mount(CreateDrink, {
		global: { stubs: { DrinkForm: DrinkFormStub }, mocks: { $t: (key: string) => key } }
	});

const submit = async (payload: Record<string, unknown>) => {
	const wrapper = mountCreate();
	wrapper.findComponent(DrinkFormStub).vm.$emit('submit', payload);
	await flushPromises();
	return wrapper;
};

describe('CreateDrink', () => {
	beforeEach(() => {
		vi.clearAllMocks();
		mockCreate.mockResolvedValue({ id: 'drink-1' });
		mockUpdateCover.mockResolvedValue(undefined);
		mockUpdateThumbnail.mockResolvedValue(undefined);
	});

	it('passes the create title and submit label to the form', () => {
		const form = mountCreate().findComponent(DrinkFormStub);

		expect(form.props('title')).toBe('organisms.drinkForm.createTitle');
		expect(form.props('submitLabel')).toBe('organisms.drinkForm.createButton');
	});

	it('creates the drink, then uploads the cover and the thumbnail to their own endpoints', async () => {
		await submit({ form, cover, thumbnail });

		expect(mockCreate).toHaveBeenCalledWith(mapFormToCreateDrink(form));
		expect(mockUpdateCover).toHaveBeenCalledWith('drink-1', cover);
		expect(mockUpdateThumbnail).toHaveBeenCalledWith('drink-1', thumbnail);
		expect(mockAddToast).toHaveBeenCalledWith(expect.objectContaining({ type: 'success' }));
		expect(mockRouterBack).toHaveBeenCalled();
	});

	it('skips the uploads when no image was chosen', async () => {
		await submit({ form, cover: undefined, thumbnail: undefined });

		expect(mockUpdateCover).not.toHaveBeenCalled();
		expect(mockUpdateThumbnail).not.toHaveBeenCalled();
	});

	it('keeps the user on the form when the drink cannot be created', async () => {
		mockCreate.mockRejectedValue(new Error('boom'));
		vi.spyOn(console, 'error').mockImplementation(() => {});

		await submit({ form, cover, thumbnail });

		expect(mockAddToast).toHaveBeenCalledWith(
			expect.objectContaining({ type: 'error', message: 'organisms.drinkForm.createError' })
		);
		expect(mockUpdateCover).not.toHaveBeenCalled();
		expect(mockRouterBack).not.toHaveBeenCalled();
	});

	it('reports a failed image upload without undoing the created drink', async () => {
		mockUpdateThumbnail.mockRejectedValue(new Error('boom'));
		vi.spyOn(console, 'error').mockImplementation(() => {});

		await submit({ form, cover: undefined, thumbnail });

		expect(mockAddToast).toHaveBeenCalledWith(
			expect.objectContaining({
				type: 'error',
				message: 'organisms.drinkForm.thumbnailError'
			})
		);
		expect(mockRouterBack).toHaveBeenCalled();
	});
	describe('what the API says about the steps', () => {
		const fieldError = {
			location: 'body',
			path: 'preparation.actions.0',
			localeKey: 'apiResponses.drinks.preparation.nothingToShake',
			message: 'Nothing to shake'
		};

		it('hands the form the errors the API listed when the drink cannot be created', async () => {
			mockCreate.mockRejectedValue({ data: { errors: [fieldError] } });
			vi.spyOn(console, 'error').mockImplementation(() => {});
			const wrapper = await submit({ form, cover, thumbnail });

			expect(wrapper.findComponent(DrinkFormStub).props('serverErrors')).toEqual([
				fieldError
			]);
		});

		it('clears them when the next attempt starts', async () => {
			mockCreate.mockRejectedValueOnce({ data: { errors: [fieldError] } });
			vi.spyOn(console, 'error').mockImplementation(() => {});
			const wrapper = await submit({ form, cover, thumbnail });

			wrapper.findComponent(DrinkFormStub).vm.$emit('submit', { form, cover, thumbnail });
			await flushPromises();

			expect(wrapper.findComponent(DrinkFormStub).props('serverErrors')).toEqual([]);
		});
	});
});
