<template>
	<InputWrapper>
		<template #label>
			<Label :for="props.id">
				{{ props.label || $t('organisms.preparationBuilder.fields.target') }}
			</Label>
		</template>
		<InputSelect
			:id="props.id"
			:model-value="props.modelValue"
			:options="options"
			@update:model-value="(value) => emit('update:modelValue', value as VesselRole)" />
	</InputWrapper>
</template>
<script setup lang="ts">
import type { InputSelectOption } from '~/components/atoms/inputSelect/InputSelect.types';
import { vesselRoles } from '~/domain/preparation/preparation.constants';
import type { VesselRole } from '~/domain/preparation/preparation.entity';

const props = defineProps({
	modelValue: { type: String as PropType<VesselRole>, required: true },
	id: { type: String, required: true },
	label: { type: String, default: '' }
});
const emit = defineEmits<{
	(e: 'update:modelValue', value: VesselRole): void;
}>();

const { t } = useI18n();

// Actions point at the vessel by role: the one the drink is mixed in, or the one it is served in.
const options = computed<InputSelectOption[]>(() =>
	vesselRoles.map((role) => ({
		label: t(`organisms.preparationBuilder.options.role.${role}`),
		value: role
	}))
);
</script>
