<template>
	<div class="form-container">
		<h2 class="form-title">Drink</h2>
		<div class="flex-container">
			<div v-for="lang in languages" :key="lang" class="flex-column content-mt">
				<h3 class="language-title">{{ $t(`language.${lang}`) }}</h3>

				<div>
					<label class="input-label input-label-margin-bottom" for="name">{{
						$t("drinkForm.nameInput.label")
					}}</label>
					<input
						v-model="drinkFormState.form.translations[lang].name"
						:class="{
							'text-input': true,
							'has-error': checkFieldError(drinkFormState.errors, `translations.${lang}.name`),
						}"
						type="text"
						id="name"
						@blur="validateForm"
					/>
				</div>
				<div>
					<label class="input-label input-label-margin-bottom" for="unit">
						{{ $t("drinkForm.methodInput.label") }}</label
					>
					<textarea
						v-model="drinkFormState.form.translations[lang].method"
						:class="{
							'textarea-input': true,
							'has-error': checkFieldError(drinkFormState.errors, `translations.${lang}.method`),
						}"
						type="text"
						id="method"
						rows="6"
						@blur="validateForm"
					/>
				</div>
			</div>
		</div>
		<h3 class="language-title content-mt">{{ $t("drinkForm.generalSection.label") }}</h3>

		<div class="flex-container">
			<div class="flex-column mb-8 md:mb-0">
				<div>
					<label class="input-label input-label-margin-bottom" for="cover">
						{{ $t("drinkForm.coverInput.label") }}
					</label>
					<DropZone @file="handleCoverFileUpdate" id="cover" />
				</div>
				<div>
					<label class="input-label input-label-margin-bottom" for="thumbnail">
						{{ $t("drinkForm.thumbnailInput.label") }}
					</label>
					<DropZone @file="handleThumbnailFileUpdate" id="thumbnail" />
				</div>
			</div>

			<div class="flex-column">
				<div class="input-search-ingredient-group">
					<div class="input-search-ingredient-row">
						<label class="search-ingredient-label" for="searchIngredient">
							{{ $t("drinkForm.ingredientsInput.label") }}
						</label>
						<NuxtLink href="/ingredients/new" class="new-ingredient-link">
							{{ $t("drinkForm.ingredientsInput.new.message") }}
						</NuxtLink>
					</div>
					<div class="input-search-ingredient-row">
						<SearchInput
							:items="availableIngredients(ingredientState.ingredients)"
							@update:value="addIngredient"
						/>
					</div>
				</div>
				<div class="ingredients-list-container">
					<div class="ingredients-list-row input-group-margin-top">
						<div class="ingredient-list-name-column text-center">
							{{ $t("drinkForm.ingredientsInput.name.label") }}
						</div>
						<div class="ingredient-list-quantity-column text-center">
							{{ $t("drinkForm.ingredientsInput.quantity.label") }}
						</div>
						<div class="ingredient-list-delete-column"></div>
					</div>

					<div
						v-for="(ing, index) in drinkFormState.form.ingredients"
						:key="ing.ingredient_id"
						class="ingredients-list-row"
					>
						<div class="ingredient-list-name-column">
							{{ getItemName(ingredientState.ingredients, ing.ingredient_id, $i18n.locale as LANGUAGES) }}
						</div>
						<div class="ingredient-list-quantity-column">
							<input
								v-model="ing.quantity"
								:class="{
									'has-error': checkFieldError(
										drinkFormState.errors,
										`ingredients.${index}.quantity`
									),
									'ingredient-quantity-text-input': true,
								}"
								type="number"
								@blur="validateForm"
							/>
							<span class="ingredient-unit-text">{{
								getIngredientUnit(
									ingredientState.ingredients,
									ing.ingredient_id,
									$i18n.locale as LANGUAGES
								)
							}}</span>
						</div>
						<div
							class="ingredient-list-delete-column drink-delete-box"
							@click="removeIngredient(ing.ingredient_id)"
						>
							<IconsGarbage :size="24" :color="themeState.colors.iconsColor" alt="delete" />
						</div>
					</div>
				</div>
			</div>
		</div>
		<div class="form-buttons-container">
			<button @click="handleCancelButton" class="action-button cancel-button-color form-button-size">
				{{ $t("drinkForm.cancelButton.message") }}
			</button>
			<button @click="handleSubmitButton" class="action-button primary-button-color form-button-size">
				{{ $t("drinkForm.submitButton.message") }}
			</button>
		</div>
	</div>
</template>
<script setup lang="ts">
import { useI18n } from "vue-i18n";
import { LANGUAGES } from "@/types/translations";
import { getItemName } from "@/helpers/getItemName";
import { IIngredient } from "~/types/ingredient";

const { $router, $toast, $getTheme } = useNuxtApp();
const { t } = useI18n();
const {
	getDrinkFormState,
	resetDrinkFormState,
	availableIngredients,
	addIngredient,
	removeIngredient,
	validateForm,
	checkFieldError,
} = useDrinkForm();
const { getIngredientState, loadIngredients } = useIngredient();

const themeState = $getTheme();
const drinkFormState = getDrinkFormState();
const ingredientState = getIngredientState();

const languages = Object.values(LANGUAGES);

const getIngredientUnit = (items: IIngredient[], itemId: string, locale: LANGUAGES) => {
	const item = items.find((i) => i._id === itemId);
	return item?.translations[locale].unit_plural ?? "";
};

onMounted(async () => {
	try {
		await loadIngredients();
	} catch (error) {
		$toast.error(t("ingredientsPage.loadIngredients.errorMessage"));
		console.error(error);
		navigateTo("/");
	}
});
const emit = defineEmits<{
	(e: "submit"): void;
}>();

const handleCancelButton = () => {
	resetDrinkFormState();
	return $router.back();
};

const handleSubmitButton = async () => {
	drinkFormState.value.displayErrors = true;
	validateForm();

	if (drinkFormState.value.errors.length !== 0) {
		return;
	}

	emit("submit");
};

const handleThumbnailFileUpdate = (file: File | undefined) => {
	drinkFormState.value.thumbnail = file;
};
const handleCoverFileUpdate = (file: File | undefined) => {
	drinkFormState.value.cover = file;
};
</script>
<style scoped>
.input-search-ingredient-group {
	display: flex;
	flex-direction: column;
	gap: 0.5rem;
}

.input-search-ingredient-row {
	display: flex;
	align-items: center;
	justify-content: center;
	position: relative;
}

.search-ingredient-label {
	font-size: 1.25rem;
}

.new-ingredient-link {
	position: absolute;
	bottom: 0.1rem;
	right: 2%;
	font-size: 0.8rem;
}
.ingredients-list-container {
	display: flex;
	gap: 0.75rem;
	flex-direction: column;
	min-height: 9rem;
}

.ingredients-list-row {
	display: flex;
	align-items: center;
	gap: 0.5rem;
}

.ingredient-list-name-column {
	flex: 4;
}

.ingredient-list-quantity-column {
	flex: 3;
}

.ingredient-list-delete-column {
	flex: 1;
}

.text-center {
	text-align: center;
}

.ingredient-quantity-text-input {
	font-size: 1rem;
	background-color: var(--secondary-background);
	border: 0.5px solid var(--secondary-background);
	border-radius: 0.75rem;
	padding: 0.5rem;
	width: 60%;
}

.ingredient-unit-text {
	margin-left: 0.3rem;
}

.drink-delete-box {
	height: 100%;
	display: flex;
	align-items: center;
	justify-content: center;
	cursor: pointer;
}

@media (min-width: 780px) {
	.new-ingredient-link {
		right: 5%;
	}

	.ingredients-list-container {
		overflow-y: scroll;
	}
}

@media (min-width: 1190px) {
	.new-ingredient-link {
		right: 20%;
	}
}
</style>
