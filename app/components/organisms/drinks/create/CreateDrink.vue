<template>
	<DrinkForm
		:server-errors="serverErrors"
		:title="$t('organisms.drinkForm.createTitle')"
		:submit-label="$t('organisms.drinkForm.createButton')"
		@cancel="handleCancel"
		@submit="handleSubmit" />
</template>
<script setup lang="ts">
import type { ApiFieldError } from '~/domain/shared/api.types';
import { readApiFieldErrors } from '~/domain/shared/api.helpers';
import type { DrinkFormAndMedia } from '~/types/drink.types';
import { mapFormToCreateDrink } from '~/mappers/drink.mappers';

const { $api, $router } = useNuxtApp();
const { t } = useI18n();
const { addToast } = useToast();
// What the API said about the plan when saving failed, so the form can show where it went wrong.
const serverErrors = ref<ApiFieldError[]>([]);

const handleCancel = () => {
	$router.back();
};

const reportError = (key: string, error: unknown) => {
	addToast({
		type: 'error',
		title: t('organisms.drinkForm.errorTitle'),
		message: t(`organisms.drinkForm.${key}`)
	});
	console.error(error);
};

const handleSubmit = async ({ form, cover, thumbnail }: DrinkFormAndMedia) => {
	let drinkId = '';
	serverErrors.value = [];
	try {
		const { id } = await $api.drinks.create(mapFormToCreateDrink(form));
		drinkId = id;
	} catch (error) {
		serverErrors.value = readApiFieldErrors(error);
		reportError('createError', error);
		return;
	}

	// The drink exists from here on; a failed image upload is reported but does not undo it.
	if (cover) {
		try {
			await $api.drinks.updateCover(drinkId, cover);
		} catch (error) {
			reportError('coverError', error);
		}
	}
	if (thumbnail) {
		try {
			await $api.drinks.updateThumbnail(drinkId, thumbnail);
		} catch (error) {
			reportError('thumbnailError', error);
		}
	}

	addToast({
		type: 'success',
		title: t('organisms.drinkForm.createSuccess.title'),
		message: t('organisms.drinkForm.createSuccess.message')
	});
	$router.back();
};
</script>
