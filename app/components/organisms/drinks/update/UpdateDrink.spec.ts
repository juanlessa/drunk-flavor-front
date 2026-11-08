import { flushPromises, mount } from '@vue/test-utils';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { Suspense, defineComponent, h, ref } from 'vue';
import UpdateDrink from './UpdateDrink.vue';
import { initEmptyDrinkForm } from '~/factories/drink.factory';
import type { DrinkForm } from '~/types/drink.types';

const DrinkFormStub = {
	props: ['drink', 'title', 'submitLabel', 'serverErrors'],
	emits: ['submit', 'cancel'],
	template: '<div data-testid="drink-form" />'
};

const mockUpdate = vi.fn();
const mockUpdateCover = vi.fn();
const mockUpdateThumbnail = vi.fn();
const mockRouterBack = vi.fn();
const mockAddToast = vi.fn();

const drink = {
	id: 'drink-1',
	translations: {
		en: { name: 'Mojito', method: 'Shake.' },
		pt: { name: 'Mojito', method: 'Bata.' }
	},
	ingredients: []
};

vi.stubGlobal('useNuxtApp', () => ({
	$api: {
		drinks: {
			get: vi.fn(),
			update: mockUpdate,
			updateCover: mockUpdateCover,
			updateThumbnail: mockUpdateThumbnail
		}
	},
	$router: { back: mockRouterBack }
}));
vi.stubGlobal('useAsyncData', () => ({ data: ref(drink), error: ref(null) }));
vi.stubGlobal('useI18n', () => ({ t: (key: string) => key }));
vi.stubGlobal('useToast', () => ({ addToast: mockAddToast }));

const mountUpdate = async () => {
	const SuspenseWrapper = defineComponent({
		render: () => h(Suspense, null, { default: () => h(UpdateDrink, { drinkId: 'drink-1' }) })
	});
	const wrapper = mount(SuspenseWrapper, {
		global: { stubs: { DrinkForm: DrinkFormStub }, mocks: { $t: (key: string) => key } }
	});
	await flushPromises();
	return wrapper;
};

const updateForm: DrinkForm = {
	...initEmptyDrinkForm(),
	translations: drink.translations
};
describe('UpdateDrink', () => {
	beforeEach(() => {
		vi.clearAllMocks();
		mockUpdate.mockResolvedValue(undefined);
		mockUpdateCover.mockResolvedValue(undefined);
		mockUpdateThumbnail.mockResolvedValue(undefined);
	});

	it('passes the drink, the edit title and the submit label to the form', async () => {
		const form = (await mountUpdate()).findComponent(DrinkFormStub);

		expect(form.props('drink')).toEqual(drink);
		expect(form.props('title')).toBe('organisms.drinkForm.editTitle');
		expect(form.props('submitLabel')).toBe('organisms.drinkForm.saveButton');
	});

	it('updates the drink and uploads only the images that were replaced', async () => {
		const thumbnail = new File(['t'], 'thumb.png', { type: 'image/png' });
		const wrapper = await mountUpdate();

		wrapper.findComponent(DrinkFormStub).vm.$emit('submit', {
			form: updateForm,
			cover: undefined,
			thumbnail
		});
		await flushPromises();

		expect(mockUpdate).toHaveBeenCalledWith(expect.objectContaining({ id: 'drink-1' }));
		expect(mockUpdateCover).not.toHaveBeenCalled();
		expect(mockUpdateThumbnail).toHaveBeenCalledWith('drink-1', thumbnail);
		expect(mockAddToast).toHaveBeenCalledWith(expect.objectContaining({ type: 'success' }));
		expect(mockRouterBack).toHaveBeenCalled();
	});

	it('keeps the user on the form when the drink cannot be updated', async () => {
		mockUpdate.mockRejectedValue(new Error('boom'));
		vi.spyOn(console, 'error').mockImplementation(() => {});
		const wrapper = await mountUpdate();

		wrapper.findComponent(DrinkFormStub).vm.$emit('submit', {
			form: updateForm,
			cover: undefined,
			thumbnail: undefined
		});
		await flushPromises();

		expect(mockAddToast).toHaveBeenCalledWith(
			expect.objectContaining({ type: 'error', message: 'organisms.drinkForm.updateError' })
		);
		expect(mockRouterBack).not.toHaveBeenCalled();
	});
	it('hands the form the errors the API listed when the drink cannot be updated, and clears them next time', async () => {
		const fieldError = {
			location: 'body',
			path: 'preparation',
			localeKey: 'apiResponses.drinks.preparation.nothingServed',
			message: 'Nothing was served'
		};
		mockUpdate.mockRejectedValueOnce({ data: { errors: [fieldError] } });
		vi.spyOn(console, 'error').mockImplementation(() => {});
		const wrapper = await mountUpdate();
		const payload = { form: updateForm, cover: undefined, thumbnail: undefined };

		wrapper.findComponent(DrinkFormStub).vm.$emit('submit', payload);
		await flushPromises();
		expect(wrapper.findComponent(DrinkFormStub).props('serverErrors')).toEqual([fieldError]);

		wrapper.findComponent(DrinkFormStub).vm.$emit('submit', payload);
		await flushPromises();
		expect(wrapper.findComponent(DrinkFormStub).props('serverErrors')).toEqual([]);
	});
});
