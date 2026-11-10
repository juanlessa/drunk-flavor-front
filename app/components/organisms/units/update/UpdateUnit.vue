<template>
	<UnitForm
		v-if="unitForm && canUpdate"
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
const localePath = useLocalePath();
const { addToast } = useToast();

// Read with authorship: only who may change the record gets the form, anyone else is sent to the read-only view.
const {
	record: unit,
	canUpdate,
	error
} = useAuthoredRecord({
	key: `unit-edit-${props.unitId}`,
	subject: 'Unit',
	fetch: () => $api.units.getWithAuthorship(props.unitId)
});
const unitForm = computed(() => (unit.value ? mapUnitToForm(unit.value) : undefined));

watch(error, (newError) => {
	if (newError) console.error('Failed to fetch unit:', newError);
});
watch(
	canUpdate,
	(allowed) => {
		if (allowed === false) $router.replace(localePath(`/units/${props.unitId}`));
	},
	{ immediate: true }
);

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
