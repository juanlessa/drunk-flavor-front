<template>
	<ReadOnlyFormView
		v-if="category && canUpdate === false"
		:title="category.translations[locale].name"
		:back-to="localePath('/categories')"
		:back-label="$t('organisms.categoryForm.backLink')"
		@back="$router.push(localePath('/categories'))">
		<!-- Mirrors CategoryForm: the same sections, texts and spacing, with values instead of inputs. -->
		<FormSection
			:title="$t('organisms.categoryForm.namesSection.title')"
			:description="$t('organisms.categoryForm.namesSection.description')">
			<!-- Stacked with a divider on mobile, side by side from tablet up. -->
			<div
				class="grid grid-cols-1 divide-y divide-stroke tablet:grid-cols-2 tablet:gap-6 tablet:divide-y-0">
				<div
					v-for="lang in languages"
					:key="lang"
					class="flex flex-col gap-4 py-6 first:pt-0 last:pb-0 tablet:py-0">
					<h3 class="text-body-sm font-bold uppercase tracking-wide text-content-muted">
						{{ $t(`languages.${lang}`) }}
					</h3>
					<dl class="flex flex-col gap-4">
						<ReadOnlyInput
							:label="$t('organisms.categoryForm.nameInput.label')"
							:value="category.translations[lang].name" />
					</dl>
				</div>
			</div>
		</FormSection>
		<FormSection
			:title="$t('organisms.categoryForm.classificationSection.title')"
			:description="$t('organisms.categoryForm.classificationSection.description')">
			<div class="flex items-center justify-between gap-4" data-testid="toggle-isAlcoholic">
				<div class="min-w-0">
					<p class="text-body font-regular text-content">
						{{ $t('organisms.categoryForm.isAlcoholicInput.label') }}
					</p>
					<Text class="text-body-sm text-content-muted">
						{{ $t('organisms.categoryForm.isAlcoholicInput.help') }}
					</Text>
				</div>
				<ReadOnlySwitch :checked="category.isAlcoholic === true" />
			</div>
		</FormSection>
	</ReadOnlyFormView>
</template>
<script setup lang="ts">
import { languages } from '~/domain/shared/translations.constants';

const props = defineProps({
	categoryId: { type: String, required: true }
});

const { $api, $router } = useNuxtApp();
const { locale } = useI18n();
const localePath = useLocalePath();

// Whoever may change the category has the edit form for it, so this view is only for the others.
const {
	record: category,
	canUpdate,
	error
} = useAuthoredRecord({
	key: `category-view-${props.categoryId}`,
	subject: 'Category',
	fetch: () => $api.categories.getWithAuthorship(props.categoryId)
});

watch(error, (newError) => {
	if (newError) console.error('Failed to fetch category:', newError);
});
watch(
	canUpdate,
	(allowed) => {
		if (allowed) $router.replace(localePath(`/categories/${props.categoryId}/edit`));
	},
	{ immediate: true }
);
</script>
