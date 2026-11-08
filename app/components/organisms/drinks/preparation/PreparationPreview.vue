<template>
	<div
		class="flex flex-col gap-4 rounded-md bg-accent-subtle p-4"
		data-testid="preparation-preview">
		<div class="flex flex-col gap-3 tablet:flex-row tablet:items-start tablet:justify-between">
			<div class="min-w-0">
				<p class="text-caption font-bold uppercase tracking-wide text-accent-content">
					{{ $t('organisms.preparationBuilder.preview.label') }}
				</p>
				<Text class="text-body-sm text-content-muted">
					{{ $t('organisms.preparationBuilder.preview.help') }}
				</Text>
			</div>
			<Button
				type="button"
				variant="secondary"
				class="tablet:w-52 tablet:shrink-0"
				:disabled="props.preview.loading"
				@click="emit('generate')">
				{{
					props.preview.loading
						? $t('organisms.preparationBuilder.preview.generating')
						: $t('organisms.preparationBuilder.preview.generate')
				}}
			</Button>
		</div>
		<Text
			v-if="props.preview.stale"
			class="text-body-sm text-warning"
			data-testid="preview-stale">
			{{ $t('organisms.preparationBuilder.preview.stale') }}
		</Text>
		<!-- Both languages are shown, whatever the interface language is. -->
		<div v-if="props.preview.method" class="grid grid-cols-1 gap-4 tablet:grid-cols-2">
			<div v-for="lang in languages" :key="lang" class="flex flex-col gap-1">
				<h4 class="text-body-sm font-bold uppercase tracking-wide text-content-muted">
					{{ $t(`languages.${lang}`) }}
				</h4>
				<p class="text-body text-content" :lang="lang" :data-testid="`preview-${lang}`">
					{{ props.preview.method[lang] }}
				</p>
			</div>
		</div>
		<ul v-if="issues.length" class="flex flex-col gap-1 text-body-sm">
			<li
				v-for="issue in issues"
				:key="`${issue.severity}-${issue.path}-${issue.localeKey}`"
				:role="issue.severity === 'error' ? 'alert' : undefined"
				:class="issue.severity === 'error' ? 'text-danger' : 'text-warning'">
				<span v-if="issue.step" class="font-bold">
					{{ $t('organisms.preparationBuilder.preview.step', { number: issue.step }) }}:
				</span>
				{{ issue.message }}
			</li>
		</ul>
	</div>
</template>
<script setup lang="ts">
import type { ApiFieldError } from '~/domain/shared/api.types';
import { languages } from '~/domain/shared/translations.constants';
import type { PreparationPreviewState } from '~/types/drink.types';

const props = defineProps({
	preview: { type: Object as PropType<PreparationPreviewState>, required: true }
});
const emit = defineEmits<{
	(e: 'generate'): void;
}>();

type Issue = ApiFieldError & { severity: 'error' | 'warning'; step?: number };

const stepOf = (issue: ApiFieldError) => {
	const match = /preparation\.actions\.(\d+)/.exec(issue.path);
	return match ? Number(match[1]) + 1 : undefined;
};

// Every error and warning of the API, with the step it points at so it can be found in the list above.
const issues = computed<Issue[]>(() => [
	...props.preview.errors.map((issue) => ({
		...issue,
		severity: 'error' as const,
		step: stepOf(issue)
	})),
	...props.preview.warnings.map((issue) => ({
		...issue,
		severity: 'warning' as const,
		step: stepOf(issue)
	}))
]);
</script>
