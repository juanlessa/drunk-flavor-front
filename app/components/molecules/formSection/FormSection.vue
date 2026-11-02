<template>
	<Card>
		<section class="flex flex-col gap-6 p-5 tablet:p-6" :aria-labelledby="headingId">
			<div>
				<Heading :id="headingId" as="h2" size="titleSm">{{ props.title }}</Heading>
				<Text v-if="props.description" class="mt-1 text-body-sm text-content-muted">
					{{ props.description }}
				</Text>
			</div>
			<slot />
		</section>
	</Card>
</template>
<script setup lang="ts">
import { useId } from 'vue';

const props = defineProps({
	title: { type: String, required: true },
	description: { type: String, default: '' }
});

const headingId = useId();
</script>
