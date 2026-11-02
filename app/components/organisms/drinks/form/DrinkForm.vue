<template>
	<div class="mx-auto flex w-full max-w-3xl flex-col gap-6 px-4 py-6 tablet:px-6">
		<header class="flex flex-col gap-2">
			<Anchor :to="localePath('/drinks')" class="inline-flex items-center gap-1 text-body-sm">
				<ArrowLeftIcon class="size-4" aria-hidden="true" />
				{{ $t('organisms.drinkForm.backLink') }}
			</Anchor>
			<Heading as="h1" size="headlineSm">{{ props.title }}</Heading>
			<Text class="text-content-muted">{{ $t('organisms.drinkForm.description') }}</Text>
		</header>

		<Form @cancel="handleCancelButton" @submit="handleSubmitButton">
			<div class="flex flex-col gap-6">
				<FormSection
					:title="$t('organisms.drinkForm.recipeSection.title')"
					:description="$t('organisms.drinkForm.recipeSection.description')">
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
										{{ $t('organisms.drinkForm.nameInput.label') }}
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
									<Label :for="`${lang}-method`">
										{{ $t('organisms.drinkForm.methodInput.label') }}
									</Label>
								</template>
								<InputTextArea
									:id="`${lang}-method`"
									v-model="formState.form.translations[lang].method"
									:name="`${lang}_method`"
									:has-error="!!checkError(`translations.${lang}.method`)"
									@blur="validateForm" />
								<template #error>
									<ErrorMessage
										:value="checkError(`translations.${lang}.method`)" />
								</template>
							</InputWrapper>
						</div>
					</div>
				</FormSection>

				<FormSection
					:title="$t('organisms.drinkForm.ingredientsSection.title')"
					:description="$t('organisms.drinkForm.ingredientsSection.description')">
					<IngredientsSelection
						v-model="formState.form.ingredients"
						:initial-ingredients="drinkIngredients"
						:check-error="checkError"
						@update:model-value="validateForm"
						@blur="validateForm" />
				</FormSection>

				<FormSection
					:title="$t('organisms.drinkForm.imagesSection.title')"
					:description="$t('organisms.drinkForm.imagesSection.description')">
					<div class="flex flex-col gap-6 tablet:flex-row">
						<div class="flex flex-col gap-2 tablet:w-50 tablet:shrink-0">
							<div>
								<Label for="thumbnail">
									{{ $t('organisms.drinkForm.thumbnailInput.label') }}
								</Label>
								<Text class="text-body-sm text-content-muted">
									{{ $t('organisms.drinkForm.thumbnailInput.help') }}
								</Text>
							</div>
							<!-- A 200px square on every screen, like the cards that use it; centered on mobile. -->
							<div class="w-50 max-w-full self-center tablet:self-auto">
								<DropZone
									id="thumbnail"
									v-model="formState.thumbnail"
									aspect="square"
									:preview-url="props.drink?.thumbnail?.url"
									:preview-alt="$t('organisms.drinkForm.thumbnailInput.label')" />
							</div>
						</div>
						<div class="flex min-w-0 flex-1 flex-col gap-2">
							<div>
								<Label for="cover">
									{{ $t('organisms.drinkForm.coverInput.label') }}
								</Label>
								<Text class="text-body-sm text-content-muted">
									{{ $t('organisms.drinkForm.coverInput.help') }}
								</Text>
							</div>
							<DropZone
								id="cover"
								v-model="formState.cover"
								aspect="wide"
								:preview-url="props.drink?.cover?.url"
								:preview-alt="$t('organisms.drinkForm.coverInput.label')" />
						</div>
					</div>
				</FormSection>
			</div>

			<template #buttons>
				<div
					class="flex flex-col-reverse items-center gap-4 tablet:flex-row tablet:justify-end">
					<Button variant="secondary" class="tablet:w-44" @click="handleCancelButton">
						{{ $t('organisms.drinkForm.cancelButton') }}
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
import { mapDrinkToForm } from '~/mappers/drink.mappers';
import type { Drink } from '~/domain/drink/drink.entity';
import type { DrinkFormAndMedia } from '~/types/drink.types';
import IngredientsSelection from '../ingredientsSelection/IngredientsSelection.vue';

const props = defineProps({
	drink: { type: Object as PropType<Drink>, default: undefined },
	title: { type: String, required: true },
	submitLabel: { type: String, required: true }
});
const emit = defineEmits<{
	(e: 'submit', value: DrinkFormAndMedia): void;
	(e: 'cancel'): void;
}>();

const localePath = useLocalePath();
const { formState, updateFormState, checkError, validateForm } = useDrinkForm();

const drinkIngredients = computed(() => (props.drink ? props.drink.ingredients : []));

if (props.drink) {
	updateFormState(mapDrinkToForm(props.drink));
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
	emit('submit', {
		form: formState.value.form,
		cover: formState.value.cover,
		thumbnail: formState.value.thumbnail
	});
};
</script>
