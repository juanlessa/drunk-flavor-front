<template>
	<UnitForm :unit-form="unitForm" @cancel="handleCancel" @submit="handleSubmit" />
</template>

<script setup lang="ts">
import { mapUnitToForm, mapFormToUpdateUnit } from '~/mappers/unit.mappers';
import type { UnitForm } from '~/types/unit.types';

const props = defineProps({
	unitId: { type: String, required: true }
});

const { $api, $router } = useNuxtApp();
const { resetFormState } = useUnitForm();
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
	resetFormState();
	$router.back();
};

const handleSubmit = async (unitForm: UnitForm) => {
	const updateUnit = mapFormToUpdateUnit(props.unitId, unitForm);

	try {
		await $api.units.update(updateUnit);
		resetFormState();
		addToast({ type: 'success', title: 'Success', message: 'unit has been updated' });
		$router.back();
	} catch (error) {
		addToast({ type: 'error', title: 'Error', message: 'unit has not been updated' });
		console.error(error);
	}
};
</script>
