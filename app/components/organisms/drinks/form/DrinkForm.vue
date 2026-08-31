<template>
	<Form
		:title="$t('organisms.drinkForm.title')"
		@cancel="handleCancelButton"
		@submit="handleSubmitButton">
		<Box direction="col" class="gap-4">
			<Box class="gap-4">
				<Box v-for="lang in languages" :key="lang" direction="col" class="flex-1">
					<Heading as="h2" class="text-center">
						{{ $t(`languages.${lang}`) }}
					</Heading>
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
							pattern=".{1,}"
							:placeholder="$t('organisms.drinkForm.nameInput.placeholder')"
							:has-error="!!checkError(`translations.${lang}.name`)"
							@blur="validateForm" />
						<template #error>
							<ErrorMessage :value="checkError(`translations.${lang}.name`)" />
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
							type="text"
							pattern=".{1,}"
							:placeholder="$t('organisms.drinkForm.methodInput.placeholder')"
							:has-error="!!checkError(`translations.${lang}.method`)"
							@blur="validateForm" />
						<template #error>
							<ErrorMessage :value="checkError(`translations.${lang}.method`)" />
						</template>
					</InputWrapper>
				</Box>
			</Box>
			<Box direction="col">
				<Heading as="h2" class="text-center">
					{{ $t('organisms.drinkForm.generalSection.title') }}
				</Heading>
				<Box class="gap-4">
					<Box direction="col" class="gap-4 flex-1">
						<InputWrapper>
							<template #label>
								<Label>
									{{ $t('organisms.drinkForm.thumbnailInput.label') }}
								</Label>
							</template>
							<DropZone id="thumbnail" v-model="formState.thumbnail" />
						</InputWrapper>
						<InputWrapper>
							<template #label>
								<Label>
									{{ $t('organisms.drinkForm.coverInput.label') }}
								</Label>
							</template>
							<DropZone id="cover" v-model="formState.cover" />
						</InputWrapper>
					</Box>
					<Box class="gap-4 flex-1">
						<IngredientsSelection
							v-model="formState.form.ingredients"
							:initial-ingredients="drinkIngredients" />
					</Box> </Box
			></Box>
		</Box>
	</Form>
</template>
<script setup lang="ts">
import { languages } from '~/domain/shared/translations.constants';
import { mapDrinkToForm } from '~/mappers/drink.mappers.js';
import type { Drink, DrinkFormAndMedia } from '~/types/drink.types.js';
import IngredientsSelection from '../ingredientsSelection/IngredientsSelection.vue';

const props = defineProps({
	drink: { type: Object as PropType<Drink>, default: undefined }
});
const emit = defineEmits<{
	(e: 'submit', value: DrinkFormAndMedia): void;
	(e: 'cancel'): void;
}>();

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
