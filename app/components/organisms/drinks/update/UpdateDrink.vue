<template>
	<DrinkForm
		:drink="drink"
		:title="$t('organisms.drinkForm.editTitle')"
		:submit-label="$t('organisms.drinkForm.saveButton')"
		@cancel="handleCancel"
		@submit="handleSubmit" />
</template>
<script setup lang="ts">
import { mapFormToUpdateDrink } from '~/mappers/drink.mappers';
import type { Drink } from '~/domain/drink/drink.entity';
import type { DrinkFormAndMedia } from '~/types/drink.types';

const props = defineProps({
	drinkId: { type: String, required: true }
});

const { $api, $router } = useNuxtApp();
const { t } = useI18n();
const { addToast } = useToast();

const drink = ref<Drink | undefined>(undefined);

const { data, error } = await useAsyncData(() => $api.drinks.get(props.drinkId));

if (error.value) {
	console.error('Failed to fetch drink:', error.value);
}

if (data.value) {
	drink.value = data.value;
}

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
	try {
		await $api.drinks.update(mapFormToUpdateDrink(props.drinkId, form));
	} catch (error) {
		reportError('updateError', error);
		return;
	}

	if (cover) {
		try {
			await $api.drinks.updateCover(props.drinkId, cover);
		} catch (error) {
			reportError('coverError', error);
		}
	}
	if (thumbnail) {
		try {
			await $api.drinks.updateThumbnail(props.drinkId, thumbnail);
		} catch (error) {
			reportError('thumbnailError', error);
		}
	}

	addToast({
		type: 'success',
		title: t('organisms.drinkForm.updateSuccess.title'),
		message: t('organisms.drinkForm.updateSuccess.message')
	});
	$router.back();
};
</script>
