<template>
	<div class="mx-auto flex w-full max-w-3xl flex-col gap-6 px-4 py-6 tablet:px-6">
		<header class="flex flex-col gap-2">
			<Anchor
				:to="localePath('/categories')"
				class="inline-flex items-center gap-1 text-body-sm">
				<ArrowLeftIcon class="size-4" aria-hidden="true" />
				{{ $t('organisms.categoryForm.backLink') }}
			</Anchor>
			<Heading as="h1" size="headlineSm">{{ props.title }}</Heading>
			<Text class="text-content-muted">{{ $t('organisms.categoryForm.description') }}</Text>
		</header>

		<Form @cancel="handleCancelButton" @submit="handleSubmitButton">
			<div class="flex flex-col gap-6">
				<FormSection
					:title="$t('organisms.categoryForm.namesSection.title')"
					:description="$t('organisms.categoryForm.namesSection.description')">
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
										{{ $t('organisms.categoryForm.nameInput.label') }}
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
						</div>
					</div>
				</FormSection>

				<FormSection
					:title="$t('organisms.categoryForm.classificationSection.title')"
					:description="$t('organisms.categoryForm.classificationSection.description')">
					<div class="flex items-center justify-between gap-4">
						<div class="min-w-0">
							<Label for="is-alcoholic">
								{{ $t('organisms.categoryForm.isAlcoholicInput.label') }}
							</Label>
							<Text id="is-alcoholic-help" class="text-body-sm text-content-muted">
								{{ $t('organisms.categoryForm.isAlcoholicInput.help') }}
							</Text>
						</div>
						<InputSwitch
							id="is-alcoholic"
							v-model:checked="formState.form.isAlcoholic"
							class="shrink-0"
							aria-describedby="is-alcoholic-help" />
					</div>
				</FormSection>
			</div>

			<template #buttons>
				<div
					class="flex flex-col-reverse items-center gap-4 tablet:flex-row tablet:justify-end">
					<Button variant="secondary" class="tablet:w-44" @click="handleCancelButton">
						{{ $t('organisms.categoryForm.cancelButton') }}
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
import type { CategoryForm } from '~/types/category.types';

const props = defineProps({
	categoryForm: { type: Object as PropType<CategoryForm>, default: undefined },
	title: { type: String, required: true },
	submitLabel: { type: String, required: true }
});
const emit = defineEmits<{
	(e: 'submit', value: CategoryForm): void;
	(e: 'cancel'): void;
}>();

const localePath = useLocalePath();
const { formState, updateFormState, checkError, validateForm } = useCategoryForm();

if (props.categoryForm) {
	updateFormState(props.categoryForm);
}

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
