<template>
	<UnitForm
		:title="$t('organisms.unitForm.createTitle')"
		:submit-label="$t('organisms.unitForm.createButton')"
		@cancel="handleCancel"
		@submit="handleSubmit" />
</template>

<script setup lang="ts">
import type { UnitForm } from '~/types/unit.types';
import { mapFormToCreateUnit } from '~/mappers/unit.mappers';

const { $api, $router } = useNuxtApp();
const { t } = useI18n();
const { resetFormState } = useUnitForm();
const { addToast } = useToast();

const handleCancel = () => {
	resetFormState();
	$router.back();
};

const handleSubmit = async (unitForm: UnitForm) => {
	const createUnit = mapFormToCreateUnit(unitForm);

	try {
		await $api.units.create(createUnit);
		resetFormState();
		addToast({
			type: 'success',
			title: t('organisms.unitForm.createSuccess.title'),
			message: t('organisms.unitForm.createSuccess.message')
		});
		$router.back();
	} catch (error) {
		addToast({
			type: 'error',
			title: t('organisms.unitForm.createError.title'),
			message: t('organisms.unitForm.createError.message')
		});
		console.error(error);
	}
};
</script>
