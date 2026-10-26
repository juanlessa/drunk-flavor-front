<template>
	<section
		class="pt-6 border-t border-stroke flex flex-col items-center @detail-layout:items-start gap-4">
		<Heading as="h2" size="titleSm" class="text-center @detail-layout:text-left">
			{{ $t('drinkDetailPage.rating.title') }}
		</Heading>

		<Text v-if="isLoading" class="text-body-sm text-content-muted">
			{{ $t('drinkDetailPage.rating.loading') }}
		</Text>
		<Text v-else-if="hasLoadError" class="text-body-sm text-danger">
			{{ $t('drinkDetailPage.rating.loadError') }}
		</Text>
		<div v-else class="w-fit flex flex-col items-start gap-1">
			<div class="flex items-center gap-2">
				<Text v-if="summary.count" as="span" class="text-title font-bold">
					{{ formattedAverage }}
				</Text>
				<RatingStars :value="summary.average" :label="summaryAriaLabel" />
			</div>
			<Text class="text-body-sm text-content-muted whitespace-nowrap">
				{{ summary.count ? ratingCountLabel : $t('drinkDetailPage.rating.noRatings') }}
			</Text>
		</div>

		<Collapsible.Root v-if="isAuthenticated" v-model:open="isEditorOpen">
			<Collapsible.Trigger as-child>
				<Button
					variant="outline"
					size="sm"
					:disabled="isLoading || hasLoadError"
					:aria-label="editorTriggerLabel">
					{{ editorTriggerLabel }}
				</Button>
			</Collapsible.Trigger>
			<Collapsible.Content
				class="pt-4 flex flex-col items-center @detail-layout:items-start gap-3">
				<RatingInput
					:model-value="selectedValue"
					name="drink-rating"
					:label="$t('drinkDetailPage.rating.yourRating')"
					:value-labels="ratingValueLabels"
					:disabled="isSaving"
					@update:model-value="handleSave" />
				<Button
					v-if="myRating"
					variant="plain"
					size="sm"
					class="min-h-11 px-3 !text-danger hover:bg-danger-surface"
					:disabled="isSaving"
					@click="handleRemove">
					{{ $t('drinkDetailPage.rating.remove') }}
				</Button>
			</Collapsible.Content>
		</Collapsible.Root>
		<Button v-else variant="outline" size="sm" @click="handleSignIn">
			{{ $t('drinkDetailPage.rating.signIn') }}
		</Button>

		<Text
			v-if="statusMessage"
			class="text-body-sm text-center @detail-layout:text-left"
			:class="hasMutationError ? 'text-danger' : 'text-content-muted'"
			aria-live="polite">
			{{ statusMessage }}
		</Text>
	</section>
</template>

<script setup lang="ts">
import { Collapsible } from 'radix-vue/namespaced';
import { RATING_MAX_VALUE, RATING_MIN_VALUE } from '~/domain/rating/rating.constants';

const props = defineProps({
	drinkId: { type: String, required: true }
});

const { $router } = useNuxtApp();
const route = useRoute();
const localePath = useLocalePath();
const { t, locale } = useI18n();
const {
	summary,
	myRating,
	selectedValue,
	isAuthenticated,
	isLoading,
	isSaving,
	load,
	save,
	remove
} = useDrinkRating(() => props.drinkId);

const isEditorOpen = ref(false);
const hasLoadError = ref(false);
const hasMutationError = ref(false);
const statusMessage = ref('');

const formattedAverage = computed(() =>
	new Intl.NumberFormat(locale.value === 'pt' ? 'pt-BR' : 'en-US', {
		minimumFractionDigits: 1,
		maximumFractionDigits: 1
	}).format(summary.value.average)
);
const ratingCountLabel = computed(() => t('drinkDetailPage.rating.count', summary.value.count));
const summaryAriaLabel = computed(() =>
	summary.value.count === 0
		? t('drinkDetailPage.rating.noRatings')
		: t('drinkDetailPage.rating.summaryLabel', {
				value: formattedAverage.value,
				count: summary.value.count
			})
);
const ratingValueLabels = computed(() =>
	Array.from({ length: RATING_MAX_VALUE - RATING_MIN_VALUE + 1 }, (_, index) =>
		t('drinkDetailPage.rating.valueLabel', { value: index + RATING_MIN_VALUE })
	)
);
const editorTriggerLabel = computed(() =>
	myRating.value
		? t('drinkDetailPage.rating.myRating', { value: myRating.value.value })
		: t('drinkDetailPage.rating.rateDrink')
);

const handleSave = async (value: number) => {
	if (isSaving.value) return;

	hasMutationError.value = false;
	statusMessage.value = '';
	const didSave = await save(value);
	hasMutationError.value = !didSave;
	statusMessage.value = t(
		didSave ? 'drinkDetailPage.rating.saved' : 'drinkDetailPage.rating.saveError'
	);
};

const handleRemove = async () => {
	hasMutationError.value = false;
	statusMessage.value = '';
	const didRemove = await remove();
	hasMutationError.value = !didRemove;
	statusMessage.value = t(
		didRemove ? 'drinkDetailPage.rating.removed' : 'drinkDetailPage.rating.removeError'
	);
};

const handleSignIn = () => {
	void $router.push({
		path: localePath('/signin').toString(),
		query: { redirect: route.fullPath, intent: 'rate' }
	});
};

const consumeRatingIntent = () => {
	if (!isAuthenticated.value || route.query.intent !== 'rate') return;

	isEditorOpen.value = true;
	const query = { ...route.query };
	Reflect.deleteProperty(query, 'intent');
	void $router.replace({ query });
};

onMounted(async () => {
	hasLoadError.value = !(await load());
	consumeRatingIntent();
});
</script>
