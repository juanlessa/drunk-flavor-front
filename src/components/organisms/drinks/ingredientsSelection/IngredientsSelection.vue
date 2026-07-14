<template>
	<Box direction="col" class="gap-4 flex-1">
		<Label class="text-center">
			{{ $t('drinkForm.ingredients.label') }}
		</Label>
		<Search
			id="search-ingredients"
			v-model:search-term="searchTerm"
			:options="mapToSelectOptions(options, $i18n.locale as Language)"
			infinite-scroll
			:loading="loading"
			@load-more="loadNextPage"
			@select="handleSelect" />

		<Box direction="col" class="gap-2">
			<Box v-for="sel in selected" :key="sel._id" direction="row" class="gap-6 items-center">
				<Box>
					<Text>{{ sel.translations[$i18n.locale as Language].name }}</Text>
				</Box>

				<InputNumber
					suffix-outside
					:suffix="sel.translations[$i18n.locale as Language].unit" />

				<TrashIcon />
			</Box>
		</Box>
	</Box>
</template>
<script setup lang="ts">
import type { Language } from '~/types/translations';
import { mapToSelectOptions } from '~/helpers/inputSelect.helpers';

const { options, searchTerm, loading, selected, handleSelect, loadNextPage } =
	useIngredientSearch();
</script>
