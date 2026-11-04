<template>
	<UnitForm
		:unit-form="unitForm"
		:title="$t('organisms.unitForm.editTitle')"
		:submit-label="$t('organisms.unitForm.saveButton')"
		@cancel="handleCancel"
		@submit="handleSubmit" />
</template>

<script setup lang="ts">
import { mapUnitToForm, mapFormToUpdateUnit } from '~/mappers/unit.mappers';
import type { UnitForm } from '~/types/unit.types';

const props = defineProps({
	unitId: { type: String, required: true }
});

const { $api, $router } = useNuxtApp();
const { t } = useI18n();
const { addToast } = useToast();

const unitForm = ref<UnitForm | undefined>(undefined);

const { data, error } = await useAsyncData(() => $api.units.get(props.unitId));

if (error.value) {
	console.error('Failed to fetch unit:', error.value);
}

if (data.value) {
	unitForm.value = mapUnitToForm(data.value);
}

const handleCancel = () => {
	$router.back();
};

const handleSubmit = async (unitForm: UnitForm) => {
	const updateUnit = mapFormToUpdateUnit(props.unitId, unitForm);

	try {
		await $api.units.update(updateUnit);
		addToast({
			type: 'success',
			title: t('organisms.unitForm.updateSuccess.title'),
			message: t('organisms.unitForm.updateSuccess.message')
		});
		$router.back();
	} catch (error) {
		addToast({
			type: 'error',
			title: t('organisms.unitForm.updateError.title'),
			message: t('organisms.unitForm.updateError.message')
		});
		console.error(error);
	}
};
</script>
