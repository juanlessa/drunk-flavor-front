<template>
	<!-- Same insets and maximum width as a grid row, so the toolbar is measured from the same edges as the cards. -->
	<div class="w-full px-4 py-4">
		<div class="w-full max-w-screen-desktop mx-auto">
			<!--
				The cards take 45% (tablet) or 30% (desktop) of the row each, centered, so the block they
				form is narrower than the row. The toolbar takes the width of that block (columns x share
				+ gaps) to start and end where the cards do.
			-->
			<div
				class="mx-auto flex flex-col gap-3 tablet:flex-row tablet:items-center tablet:w-[calc(90%+1rem)] desktop:w-[calc(90%+2rem)]">
				<div class="w-full tablet:flex-1 tablet:min-w-0">
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
				<!-- Mobile: compact, under the search, aligned right. From tablet: end of the row. -->
				<div class="max-w-full w-fit self-end tablet:self-auto tablet:w-80 tablet:shrink-0">
					<SortSelect
						:id="props.sortId"
						v-model="sort"
						name="sort"
						:label="props.sortLabel"
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
