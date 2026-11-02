<template>
	<div class="mx-auto flex w-full max-w-3xl flex-col gap-6 px-4 py-6 tablet:px-6">
		<header class="flex flex-col gap-2">
			<Anchor :to="localePath('/units')" class="inline-flex items-center gap-1 text-body-sm">
				<ArrowLeftIcon class="size-4" aria-hidden="true" />
				{{ $t('organisms.unitForm.backLink') }}
			</Anchor>
			<Heading as="h1" size="headlineSm">{{ props.title }}</Heading>
			<Text class="text-content-muted">{{ $t('organisms.unitForm.description') }}</Text>
		</header>

		<Form @cancel="handleCancelButton" @submit="handleSubmitButton">
			<div class="flex flex-col gap-6">
				<FormSection
					:title="$t('organisms.unitForm.namesSection.title')"
					:description="$t('organisms.unitForm.namesSection.description')">
					<!-- Stacked with a divider on mobile, side by side from tablet up. -->
					<div
						class="grid grid-cols-1 divide-y divide-stroke tablet:grid-cols-2 tablet:gap-6 tablet:divide-y-0">
						<div
							v-for="lang in languages"
							:key="lang"
							class="flex flex-col gap-4 py-6 first:pt-0 last:pb-0 tablet:py-0">
							<h3
								class="text-body-sm font-bold uppercase tracking-wide text-content-muted">
								{{ $t(`languages.${lang}`) }}
							</h3>
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
									:has-error="!!checkError(`translations.${lang}.name`)"
									@blur="validateForm" />
								<template #error>
									<ErrorMessage
										:value="checkError(`translations.${lang}.name`)" />
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
									:has-error="!!checkError(`translations.${lang}.namePlural`)"
									@blur="validateForm" />
								<template #error>
									<ErrorMessage
										:value="checkError(`translations.${lang}.namePlural`)" />
								</template>
							</InputWrapper>
						</div>
					</div>
				</FormSection>

				<FormSection
					:title="$t('organisms.unitForm.formatSection.title')"
					:description="$t('organisms.unitForm.formatSection.description')">
					<div class="grid grid-cols-1 gap-4 tablet:grid-cols-2 items-start">
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
					</div>

					<div class="flex flex-col gap-5 border-t border-stroke pt-5">
						<div
							v-for="toggle in toggles"
							:key="toggle.id"
							class="flex items-center justify-between gap-4">
							<div class="min-w-0">
								<Label :for="toggle.id">
									{{ $t(`organisms.unitForm.${toggle.i18nKey}.label`) }}
								</Label>
								<Text
									:id="`${toggle.id}-help`"
									class="text-body-sm text-content-muted">
									{{ $t(`organisms.unitForm.${toggle.i18nKey}.help`) }}
								</Text>
							</div>
							<InputSwitch
								:id="toggle.id"
								v-model:checked="formState.form[toggle.field]"
								class="shrink-0"
								:aria-describedby="`${toggle.id}-help`" />
						</div>
					</div>

					<div class="rounded-md bg-accent-subtle px-4 py-3" data-testid="unit-preview">
						<p
							class="text-caption font-bold uppercase tracking-wide text-accent-content">
							{{ $t('organisms.unitForm.preview.label') }}
						</p>
						<Text v-if="previewItems.length" class="mt-1 font-medium">
							{{ previewItems.join(' · ') }}
						</Text>
						<Text v-else class="mt-1 text-body-sm text-content-muted">
							{{ $t('organisms.unitForm.preview.empty') }}
						</Text>
					</div>
				</FormSection>
			</div>

			<template #buttons>
				<div
					class="flex flex-col-reverse items-center gap-4 tablet:flex-row tablet:justify-end">
					<Button variant="secondary" class="tablet:w-44" @click="handleCancelButton">
						{{ $t('organisms.unitForm.cancelButton') }}
					</Button>
					<Button type="submit" class="tablet:w-44">{{ props.submitLabel }}</Button>
				</div>
			</template>
		</Form>
	</div>
</template>

<script setup lang="ts">
import ArrowLeftIcon from '~/components/icons/ArrowLeftIcon.vue';
import { languages } from '~/domain/shared/translations.constants';
import { unitKinds } from '~/domain/unit/unit.constants';
import type { UnitKind } from '~/domain/unit/unit.entity';
import { getUnitPreviewItems } from '~/helpers/unit.helpers';
import type { UnitForm } from '~/types/unit.types';
import type { InputSelectOption } from '~/components/atoms/inputSelect/InputSelect.types';

type UnitFormToggle = {
	id: string;
	field: 'spaceBeforeSymbol' | 'allowDecimal';
	i18nKey: 'spaceBeforeSymbolInput' | 'allowDecimalInput';
};

const toggles: UnitFormToggle[] = [
	{ id: 'space-before-symbol', field: 'spaceBeforeSymbol', i18nKey: 'spaceBeforeSymbolInput' },
	{ id: 'allow-decimal', field: 'allowDecimal', i18nKey: 'allowDecimalInput' }
];

const props = defineProps({
	unitForm: { type: Object as PropType<UnitForm>, default: undefined },
	title: { type: String, required: true },
	submitLabel: { type: String, required: true }
});

const emit = defineEmits<{
	(e: 'submit', value: UnitForm): void;
	(e: 'cancel'): void;
}>();

const { t, locale } = useI18n();
const localePath = useLocalePath();
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

// How a quantity in this unit will read, in the interface language, as the form is filled in.
const previewItems = computed(() => getUnitPreviewItems(formState.value.form, locale.value));

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
