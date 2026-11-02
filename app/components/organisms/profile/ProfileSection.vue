<template>
	<Card :class="sectionStyles({ tone: props.tone })">
		<section class="flex flex-col gap-6 p-5 tablet:p-6" :aria-labelledby="headingId">
			<div class="flex flex-col tablet:flex-row tablet:items-start gap-4">
				<div
					v-if="$slots.icon"
					:class="iconStyles({ tone: props.tone })"
					aria-hidden="true">
					<slot name="icon" />
				</div>
				<div class="min-w-0 flex-1">
					<Heading
						:id="headingId"
						as="h2"
						size="titleSm"
						:class="titleStyles({ tone: props.tone })">
						{{ props.title }}
					</Heading>
					<Text v-if="props.description" class="mt-1 text-body-sm text-content-muted">
						{{ props.description }}
					</Text>
				</div>
				<div
					v-if="$slots.action"
					class="flex w-full shrink-0 justify-center tablet:block tablet:w-auto">
					<slot name="action" />
				</div>
			</div>
			<slot />
		</section>
	</Card>
</template>

<script setup lang="ts">
import { useId } from 'vue';
import { tv } from '~/utils/tv';

const props = defineProps({
	title: { type: String, required: true },
	description: { type: String, default: '' },
	tone: { type: String as PropType<'default' | 'danger'>, default: 'default' }
});

const headingId = useId();
const sectionStyles = tv({
	variants: { tone: { default: '', danger: 'border-danger-stroke' } }
});
const iconStyles = tv({
	base: 'size-11 shrink-0 rounded-lg flex items-center justify-center [&>svg]:size-6',
	variants: {
		tone: {
			default: 'bg-accent-subtle text-accent-content',
			danger: 'bg-danger-surface text-danger'
		}
	}
});
const titleStyles = tv({
	variants: { tone: { default: '', danger: 'text-danger' } }
});
</script>
