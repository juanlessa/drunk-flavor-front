<template>
	<UnitForm @cancel="handleCancel" @submit="handleSubmit" />
</template>

<script setup lang="ts">
import type { UnitForm } from '~/types/unit.types';
import { mapFormToCreateUnit } from '~/mappers/unit.mappers';

const { $api, $router } = useNuxtApp();
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
		addToast({ type: 'success', title: 'Success', message: 'unit has been created' });
		$router.back();
	} catch (error) {
		addToast({ type: 'error', title: 'Error', message: 'unit has not been created' });
		console.error(error);
	}
};
</script>
