<template>
	<!-- Same horizontal insets as the grid rows, so the toolbar lines up with the cards. -->
	<div class="w-full px-4 py-4">
		<div class="max-w-screen-desktop mx-auto flex items-center gap-3">
			<div class="flex-1 tablet:max-w-sm">
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
			<div class="hidden tablet:block ml-auto shrink-0">
				<Button @click="emit('create')">
					<span class="inline-flex items-center gap-2">
						<PlusIcon class="fill-current" aria-hidden="true" />
						{{ props.createLabel }}
					</span>
				</Button>
			</div>
			<!-- Mobile keeps the search wide and collapses the create action into an icon button. -->
			<button
				type="button"
				class="tablet:hidden inline-flex shrink-0 size-10 items-center justify-center rounded-full bg-accent text-content-on-accent cursor-pointer hover:bg-accent-hover active:bg-accent-active focus-visible:outline-hidden focus-visible:shadow-focus-ring"
				:aria-label="props.createLabel"
				@click="emit('create')">
				<PlusIcon class="fill-current" aria-hidden="true" />
			</button>
		</div>
	</div>
</template>
<script setup lang="ts">
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
	createLabel: {
		type: String,
		required: true
	}
});

const emit = defineEmits<{
	(e: 'create'): void;
}>();

const searchTerm = defineModel<string>('searchTerm', { default: '' });
</script>
