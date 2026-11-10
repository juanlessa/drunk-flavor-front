<template>
	<!-- Same horizontal insets as the grid rows, so the toolbar lines up with the cards. -->
	<div class="w-full px-4 py-4">
		<div
			class="max-w-screen-desktop mx-auto flex flex-col gap-3 tablet:flex-row tablet:items-center">
			<div class="w-full tablet:flex-1 tablet:max-w-sm">
				<Label :for="props.searchId" class="sr-only">{{ props.searchLabel }}</Label>
				<InputText
					:id="props.searchId"
					v-model="searchTerm"
					name="search"
					:placeholder="props.searchPlaceholder">
					<template #prefix>
						<SearchIcon
							class="shrink-0 fill-current text-content-muted"
							aria-hidden="true" />
					</template>
				</InputText>
			</div>
			<!-- On mobile the order sits under the search and takes the whole width. -->
			<div class="flex items-center gap-2 tablet:ml-auto tablet:shrink-0">
				<Label :for="props.sortId" class="shrink-0 whitespace-nowrap">
					{{ props.sortLabel }}
				</Label>
				<div class="min-w-0 flex-1 tablet:w-56 tablet:flex-none">
					<InputSelect
						:id="props.sortId"
						v-model="sort"
						name="sort"
						:options="props.sortOptions" />
				</div>
			</div>
		</div>
	</div>
</template>
<script setup lang="ts">
import type { InputSelectOption } from '~/components/atoms/inputSelect/InputSelect.types';
const props = defineProps({
	searchId: {
		type: String,
		required: true
	},
	searchLabel: {
		type: String,
		required: true
	},
	searchPlaceholder: {
		type: String,
		default: ''
	},
	sortId: {
		type: String,
		required: true
	},
	sortLabel: {
		type: String,
		required: true
	},
	sortOptions: {
		type: Array as PropType<InputSelectOption[]>,
		required: true
	}
});
const searchTerm = defineModel<string>('searchTerm', { default: '' });
const sort = defineModel<string>('sort', { required: true });
</script>
