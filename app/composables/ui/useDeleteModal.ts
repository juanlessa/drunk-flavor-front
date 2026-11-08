import type { Language } from '~/domain/shared/translations.types';

export type UseDeleteModalOptions<T extends { id: string }> = {
	/**
	 * Prefix of the i18n keys. The `deleteModal` (`title` with a `{name}` param, `description`),
	 * `deleteSuccess` and `deleteError` (`title`, `message`) groups live under it.
	 */
	i18nPrefix: string;
	/** Creates the empty placeholder held while no item is selected. */
	initEmpty: () => T;
	/** Display name shown in the modal title. */
	getName: (item: T, locale: Language) => string;
	/** Deletes the item. A rejection shows the error toast instead of the success one. */
	remove: (id: string) => Promise<unknown>;
};

/**
 * State and handlers of the "delete this item?" confirmation modal shared by the management lists.
 *
 * `triggerDeleteModal` selects an item and opens the modal; `handleDelete` runs `remove`, reports
 * the result in a toast and clears the selection either way.
 */
export const useDeleteModal = <T extends { id: string }>(options: UseDeleteModalOptions<T>) => {
	const { t, locale } = useI18n();
	const { addToast } = useToast();

	const isOpen = ref(false);
	// Replaced as a whole and never mutated, so a shallow ref keeps `T` intact.
	const itemToDelete = shallowRef<T>(options.initEmpty());

	const modalContent = computed(() => ({
		title: t(`${options.i18nPrefix}.deleteModal.title`, {
			name: options.getName(itemToDelete.value, locale.value as Language)
		}),
		description: t(`${options.i18nPrefix}.deleteModal.description`)
	}));

	const triggerDeleteModal = (item: T) => {
		itemToDelete.value = { ...item };
		isOpen.value = true;
	};

	const handleCancel = () => {
		itemToDelete.value = options.initEmpty();
	};

	const handleDelete = async () => {
		try {
			await options.remove(itemToDelete.value.id);
			addToast({
				type: 'success',
				title: t(`${options.i18nPrefix}.deleteSuccess.title`),
				message: t(`${options.i18nPrefix}.deleteSuccess.message`)
			});
		} catch {
			addToast({
				type: 'error',
				title: t(`${options.i18nPrefix}.deleteError.title`),
				message: t(`${options.i18nPrefix}.deleteError.message`)
			});
		} finally {
			itemToDelete.value = options.initEmpty();
		}
	};

	return { isOpen, handleCancel, handleDelete, triggerDeleteModal, modalContent };
};
