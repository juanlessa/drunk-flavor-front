import { flushPromises, mount } from '@vue/test-utils';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import CreateDrink from './CreateDrink.vue';

const DrinkFormStub = {
	props: ['title', 'submitLabel'],
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

const form = {
	translations: {
		en: { name: 'Mojito', method: 'Shake.' },
		pt: { name: 'Mojito', method: 'Bata.' }
	},
	ingredients: [{ ingredientId: 'rum', quantity: 60 }]
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

		expect(mockCreate).toHaveBeenCalledWith(form);
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
});
