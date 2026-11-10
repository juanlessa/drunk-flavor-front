<template>
	<DrinkForm
		v-if="drink && canUpdate"
		:server-errors="serverErrors"
		:drink="drink"
		:title="$t('organisms.drinkForm.editTitle')"
		:submit-label="$t('organisms.drinkForm.saveButton')"
		@cancel="handleCancel"
		@submit="handleSubmit" />
</template>
<script setup lang="ts">
import { mapFormToUpdateDrink } from '~/mappers/drink.mappers';
import type { ApiFieldError } from '~/domain/shared/api.types';
import { readApiFieldErrors } from '~/domain/shared/api.helpers';
import type { DrinkFormAndMedia } from '~/types/drink.types';

const props = defineProps({
	drinkId: { type: String, required: true }
});

const { $api, $router } = useNuxtApp();
const { t } = useI18n();
const localePath = useLocalePath();
const { addToast } = useToast();
// What the API said about the plan when saving failed, so the form can show where it went wrong.
const serverErrors = ref<ApiFieldError[]>([]);

// Read with authorship: only who may change the drink gets the form, anyone else is sent to the read-only view.
const {
	record: drink,
	canUpdate,
	error
} = useAuthoredRecord({
	key: `drink-edit-${props.drinkId}`,
	subject: 'Drink',
	fetch: () => $api.drinks.getWithAuthorship(props.drinkId)
});

watch(error, (newError) => {
	if (newError) console.error('Failed to fetch drink:', newError);
});
watch(
	canUpdate,
	(allowed) => {
		if (allowed === false) $router.replace(localePath(`/drinks/${props.drinkId}/view`));
	},
	{ immediate: true }
);

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
	serverErrors.value = [];
	try {
		await $api.drinks.update(mapFormToUpdateDrink(props.drinkId, form));
	} catch (error) {
		serverErrors.value = readApiFieldErrors(error);
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
