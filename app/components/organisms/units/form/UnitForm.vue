<template>
	<Form
		:title="$t('organisms.unitForm.title')"
		class="p-form-page"
		@cancel="handleCancelButton"
		@submit="handleSubmitButton">
		<Box direction="col" class="gap-4">
			<Box direction="responsive" class="gap-4">
				<GroupWrapper
					v-for="lang in languages"
					:key="lang"
					class="flex-1"
					:title="$t(`languages.${lang}`)">
					<InputWrapper>
						<template #label>
							<Label :for="`${lang}-name`">
								{{ $t('organisms.unitForm.nameInput.label') }}
							</Label>
						</template>
						<InputText
							:id="`${lang}-name`"
							v-model="formState.form.translations[lang].name"
							:name="`${lang}_name`"
							type="text"
							pattern=".{1,}"
							:placeholder="$t('organisms.unitForm.nameInput.placeholder')"
							:has-error="!!checkError(`translations.${lang}.name`)"
							@blur="validateForm" />
						<template #error>
							<ErrorMessage :value="checkError(`translations.${lang}.name`)" />
						</template>
					</InputWrapper>
					<InputWrapper>
						<template #label>
							<Label :for="`${lang}-name-plural`">
								{{ $t('organisms.unitForm.namePluralInput.label') }}
							</Label>
						</template>
						<InputText
							:id="`${lang}-name-plural`"
							v-model="formState.form.translations[lang].namePlural"
							:name="`${lang}_namePlural`"
							type="text"
							pattern=".{1,}"
							:placeholder="$t('organisms.unitForm.namePluralInput.placeholder')"
							:has-error="!!checkError(`translations.${lang}.namePlural`)"
							@blur="validateForm" />
						<template #error>
							<ErrorMessage :value="checkError(`translations.${lang}.namePlural`)" />
						</template>
					</InputWrapper>
				</GroupWrapper>
			</Box>
			<GroupWrapper :title="$t('organisms.unitForm.generalSection.title')">
				<div class="grid grid-cols-1 tablet:grid-cols-2 gap-4 items-start">
					<InputWrapper>
						<template #label>
							<Label for="symbol">
								{{ $t('organisms.unitForm.symbolInput.label') }}
							</Label>
						</template>
						<InputText
							id="symbol"
							v-model="formState.form.symbol"
							name="symbol"
							type="text"
							:placeholder="$t('organisms.unitForm.symbolInput.placeholder')"
							:has-error="!!checkError('symbol')"
							@blur="validateForm" />
						<template #error>
							<ErrorMessage :value="checkError('symbol')" />
						</template>
					</InputWrapper>
					<InputWrapper>
						<template #label>
							<Label for="kind">
								{{ $t('organisms.unitForm.kindInput.label') }}
							</Label>
						</template>
						<InputSelect
							id="kind"
							name="kind"
							:model-value="formState.form.kind"
							:options="kindOptions"
							:placeholder="$t('organisms.unitForm.kindInput.placeholder')"
							:has-error="!!checkError('kind')"
							@update:model-value="handleKindUpdate"
							@blur="validateForm" />
						<template #error>
							<ErrorMessage :value="checkError('kind')" />
						</template>
					</InputWrapper>
					<InputWrapper direction="row">
						<template #label>
							<Label for="space-before-symbol">
								{{ $t('organisms.unitForm.spaceBeforeSymbolInput.label') }}
							</Label>
						</template>
						<InputSwitch
							id="space-before-symbol"
							v-model:checked="formState.form.spaceBeforeSymbol" />
					</InputWrapper>
					<InputWrapper direction="row">
						<template #label>
							<Label for="allow-decimal">
								{{ $t('organisms.unitForm.allowDecimalInput.label') }}
							</Label>
						</template>
						<InputSwitch
							id="allow-decimal"
							v-model:checked="formState.form.allowDecimal" />
					</InputWrapper>
				</div>
			</GroupWrapper>
		</Box>
	</Form>
</template>

<script setup lang="ts">
import { languages } from '~/domain/shared/translations.constants';
import { unitKinds } from '~/domain/unit/unit.constants';
import type { UnitKind } from '~/domain/unit/unit.entity';
import type { UnitForm } from '~/types/unit.types';
import type { InputSelectOption } from '~/components/atoms/inputSelect/InputSelect.types';

const props = defineProps({
	unitForm: { type: Object as PropType<UnitForm>, default: undefined }
});

const emit = defineEmits<{
	(e: 'submit', value: UnitForm): void;
	(e: 'cancel'): void;
}>();

const { t } = useI18n();
const { formState, updateFormState, checkError, validateForm } = useUnitForm();

if (props.unitForm) {
	updateFormState(props.unitForm);
}

// The kind values are fixed English identifiers; only the labels are translated.
const kindOptions = computed<InputSelectOption[]>(() =>
	unitKinds.map((kind) => ({
		label: t(`organisms.unitForm.kindInput.options.${kind}`),
		value: kind
	}))
);

const isUnitKind = (value: string): value is UnitKind =>
	(unitKinds as readonly string[]).includes(value);

const handleKindUpdate = (value: string) => {
	if (isUnitKind(value)) {
		formState.value.form.kind = value;
	}
};

const handleCancelButton = () => {
	emit('cancel');
};

const handleSubmitButton = async () => {
	formState.value.displayErrors = true;
	validateForm();

	if (formState.value.errors.length !== 0) {
		return;
	}

	emit('submit', formState.value.form);
};
</script>
