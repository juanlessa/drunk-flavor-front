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
					:title="$t('organisms.drinkForm.namesSection.title')"
					:description="$t('organisms.drinkForm.namesSection.description')">
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
						</div>
					</div>
				</FormSection>
				<FormSection
					:title="$t('organisms.drinkForm.ingredientsSection.title')"
					:description="$t('organisms.drinkForm.ingredientsSection.description')">
					<RecipeLinesSelection
						v-model:lines="formState.form.ingredients"
						kind="ingredients"
						:check-error="checkError"
						@update:lines="validateForm"
						@blur="validateForm" />
				</FormSection>
				<FormSection
					:title="$t('organisms.drinkForm.garnishesSection.title')"
					:description="$t('organisms.drinkForm.garnishesSection.description')">
					<RecipeLinesSelection
						v-model:lines="formState.form.garnishes"
						kind="garnishes"
						:check-error="checkError"
						@update:lines="validateForm"
						@blur="validateForm" />
				</FormSection>
				<FormSection
					:title="$t('organisms.drinkForm.methodSection.title')"
					:description="$t('organisms.drinkForm.methodSection.description')">
					<RadioCardGroup
						id="method-mode"
						name="method_mode"
						:label="$t('organisms.drinkForm.methodMode.legend')"
						:model-value="formState.form.methodMode"
						:options="methodModeOptions"
						@update:model-value="handleMethodModeUpdate" />
					<!-- Written by hand: one text per language. -->
					<div
						v-if="formState.form.methodMode === DrinkMethodModes.manual"
						class="grid grid-cols-1 gap-4 tablet:grid-cols-2">
						<InputWrapper v-for="lang in languages" :key="lang">
							<template #label>
								<Label :for="`${lang}-method`">
									{{ $t('organisms.drinkForm.methodInput.label') }} ·
									{{ $t(`languages.${lang}`) }}
								</Label>
							</template>
							<InputTextArea
								:id="`${lang}-method`"
								v-model="formState.form.translations[lang].method"
								:name="`${lang}_method`"
								:has-error="!!checkError(`translations.${lang}.method`)"
								@blur="validateForm" />
							<template #error>
								<ErrorMessage :value="checkError(`translations.${lang}.method`)" />
							</template>
						</InputWrapper>
					</div>
					<!-- Generated: the plan is edited here and the backend writes the methods from it. -->
					<PreparationPlanBuilder
						v-else
						v-model:plan="formState.form.preparation"
						:ingredients="formState.form.ingredients"
						:garnishes="formState.form.garnishes"
						:check-error="checkError"
						:preview="builderPreview"
						@update:plan="validateForm"
						@generate="handlePreview" />
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
import type { RadioCardOption } from '~/components/molecules/radioCardGroup/RadioCardGroup.types';
import { DrinkMethodModes, drinkMethodModes } from '~/domain/drink/drink.constants';
import type { Drink } from '~/domain/drink/drink.entity';
import type { ApiFieldError } from '~/domain/shared/api.types';
import { languages } from '~/domain/shared/translations.constants';
import { mapDrinkToForm } from '~/mappers/drink.mappers';
import type {
	DrinkFormAndMedia,
	DrinkMethodMode,
	PreparationPreviewState
} from '~/types/drink.types';
import PreparationPlanBuilder from '../preparation/PreparationPlanBuilder.vue';
import RecipeLinesSelection from '../recipeLines/RecipeLinesSelection.vue';

const props = defineProps({
	drink: { type: Object as PropType<Drink>, default: undefined },
	title: { type: String, required: true },
	submitLabel: { type: String, required: true },
	/** What the API said about the plan when the drink was submitted, to show where it went wrong. */
	serverErrors: { type: Array as PropType<ApiFieldError[]>, default: () => [] }
});
const emit = defineEmits<{
	(e: 'submit', value: DrinkFormAndMedia): void;
	(e: 'cancel'): void;
}>();

const { t } = useI18n();
const { addToast } = useToast();
const localePath = useLocalePath();
const { formState, updateFormState, checkError, validateForm } = useDrinkForm();
const form = computed({
	get: () => formState.value.form,
	set: (value) => (formState.value.form = value)
});
const { preview, generate } = usePreparationPreview(form);

if (props.drink) {
	updateFormState(mapDrinkToForm(props.drink));
}

// What the API said at submit time is shown next to what it said for the preview.
const builderPreview = computed<PreparationPreviewState>(() => ({
	...preview.value,
	errors: [...preview.value.errors, ...props.serverErrors]
}));

const methodModeOptions = computed<RadioCardOption[]>(() =>
	drinkMethodModes.map((mode) => ({
		value: mode,
		label: t(`organisms.drinkForm.methodMode.options.${mode}.label`),
		description: t(`organisms.drinkForm.methodMode.options.${mode}.description`)
	}))
);

const isMethodMode = (value: string): value is DrinkMethodMode =>
	(drinkMethodModes as readonly string[]).includes(value);

const handleMethodModeUpdate = (value: string) => {
	if (isMethodMode(value)) {
		formState.value.form.methodMode = value;
		validateForm();
	}
};

// The parts of the form the backend needs to write the method; the names and the methods are not among them.
const RECIPE_FIELDS = ['ingredients', 'garnishes', 'preparation'];

const handlePreview = async () => {
	formState.value.displayErrors = true;
	validateForm();
	const blocking = formState.value.errors.some(({ field }) =>
		RECIPE_FIELDS.some((prefix) => field === prefix || field.startsWith(`${prefix}.`))
	);
	if (blocking) {
		addToast({
			type: 'error',
			title: t('organisms.drinkForm.preview.invalid.title'),
			message: t('organisms.drinkForm.preview.invalid.message')
		});
		return;
	}
	await generate();
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
	emit('submit', {
		form: formState.value.form,
		cover: formState.value.cover,
		thumbnail: formState.value.thumbnail
	});
};
</script>
