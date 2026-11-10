<template>
	<ReadOnlyFormView
		v-if="drink && canUpdate === false"
		:title="drink.translations[locale].name"
		:back-to="localePath('/drinks')"
		:back-label="$t('organisms.drinkForm.backLink')"
		@back="$router.push(localePath('/drinks'))">
		<!-- Mirrors DrinkForm: the same sections, texts and spacing, with values instead of inputs. -->
		<FormSection
			:title="$t('organisms.drinkForm.namesSection.title')"
			:description="$t('organisms.drinkForm.namesSection.description')">
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
							:label="$t('organisms.drinkForm.nameInput.label')"
							:value="drink.translations[lang].name" />
					</dl>
				</div>
			</div>
		</FormSection>

		<!-- The lines as the form lays them out; there is nothing to search for, so the search is left out. -->
		<FormSection
			v-for="list in recipeLists"
			:key="list.kind"
			:title="$t(`organisms.drinkForm.${list.kind}Section.title`)"
			:description="$t(`organisms.drinkForm.${list.kind}Section.description`)"
			:data-testid="`${list.kind}-section`">
			<ol
				v-if="list.lines.length"
				class="flex flex-col gap-2"
				:aria-label="$t(`organisms.drinkForm.${list.kind}Section.title`)">
				<ReadOnlyRecipeLine
					v-for="(line, index) in list.lines"
					:key="`${line.ingredient.id}-${index}`"
					:line="line"
					:index="index"
					:kind="list.kind" />
			</ol>
			<p
				v-else
				class="rounded-md border border-dashed border-stroke-input px-4 py-6 text-center text-body-sm text-content-muted">
				{{ $t(`organisms.drinkView.empty.${list.kind}`) }}
			</p>
		</FormSection>

		<!-- Shown as written by hand (one text per language), whether the method was written or generated. -->
		<FormSection
			:title="$t('organisms.drinkForm.methodSection.title')"
			:description="$t('organisms.drinkForm.methodSection.description')">
			<dl class="grid grid-cols-1 gap-4 tablet:grid-cols-2 items-start">
				<template v-for="lang in languages" :key="lang">
					<!-- Kept with its line breaks, as typed in the form's text area. -->
					<ReadOnlyInput
						v-if="drink.translations[lang].method"
						:label="methodLabel(lang)"
						:data-testid="`method-${lang}`">
						<span class="whitespace-pre-line">{{
							drink.translations[lang].method
						}}</span>
					</ReadOnlyInput>
					<ReadOnlyInput
						v-else
						:label="methodLabel(lang)"
						:data-testid="`method-${lang}`" />
				</template>
			</dl>
		</FormSection>

		<!-- Laid out like the drop zones of the form: the square thumbnail, then the wide cover beside it. -->
		<FormSection
			:title="$t('organisms.drinkForm.imagesSection.title')"
			:description="$t('organisms.drinkForm.imagesSection.description')">
			<div class="flex flex-col gap-6 tablet:flex-row">
				<figure class="flex flex-col gap-2 tablet:w-50 tablet:shrink-0">
					<figcaption>
						<span class="block text-body font-regular text-content">
							{{ $t('organisms.drinkForm.thumbnailInput.label') }}
						</span>
						<span class="block text-body-sm text-content-muted">
							{{ $t('organisms.drinkForm.thumbnailInput.help') }}
						</span>
					</figcaption>
					<!-- A 200px square on every screen, like the cards that use it; centered on mobile. -->
					<div class="w-50 max-w-full self-center tablet:self-auto">
						<div
							v-if="drink.thumbnail?.url"
							:class="imageFrameClass"
							class="aspect-square">
							<img
								:src="drink.thumbnail.url"
								:alt="
									$t('organisms.drinkView.thumbnailAlt', {
										name: drink.translations[locale].name
									})
								"
								class="size-full rounded-[inherit] object-cover"
								data-testid="thumbnail" />
						</div>
						<div v-else :class="emptyImageClass" class="aspect-square">
							{{ $t('organisms.drinkView.noImage') }}
						</div>
					</div>
				</figure>
				<figure class="flex min-w-0 flex-1 flex-col gap-2">
					<figcaption>
						<span class="block text-body font-regular text-content">
							{{ $t('organisms.drinkForm.coverInput.label') }}
						</span>
						<span class="block text-body-sm text-content-muted">
							{{ $t('organisms.drinkForm.coverInput.help') }}
						</span>
					</figcaption>
					<!-- Wide on mobile; on larger screens it matches the 200px square next to it. -->
					<div
						v-if="drink.cover?.url"
						:class="imageFrameClass"
						class="aspect-video tablet:aspect-auto tablet:h-50">
						<img
							:src="drink.cover.url"
							:alt="
								$t('organisms.drinkView.coverAlt', {
									name: drink.translations[locale].name
								})
							"
							class="size-full rounded-[inherit] object-cover"
							data-testid="cover" />
					</div>
					<div
						v-else
						:class="emptyImageClass"
						class="aspect-video tablet:aspect-auto tablet:h-50">
						{{ $t('organisms.drinkView.noImage') }}
					</div>
				</figure>
			</div>
		</FormSection>
	</ReadOnlyFormView>
</template>
<script setup lang="ts">
import { languages } from '~/domain/shared/translations.constants';
import type { Language } from '~/domain/shared/translations.types';
import ReadOnlyRecipeLine from '../recipeLines/ReadOnlyRecipeLine.vue';

const props = defineProps({
	drinkId: { type: String, required: true }
});

const { $api, $router } = useNuxtApp();
const { t, locale } = useI18n();
const localePath = useLocalePath();

const methodLabel = (lang: Language) =>
	`${t('organisms.drinkForm.methodInput.label')} · ${t(`languages.${lang}`)}`;

// The frame and size of the form's drop zone with an image in it, without its hover, focus or pointer.
const imageFrameClass = 'w-full rounded-dropzone border border-stroke-input bg-surface-input p-2';
const emptyImageClass =
	'w-full flex items-center justify-center rounded-dropzone border border-dashed border-stroke-input text-body-sm text-content-muted';

// Whoever may change the drink has the edit form for it, so this view is only for the others.
const {
	record: drink,
	canUpdate,
	error
} = useAuthoredRecord({
	key: `drink-view-${props.drinkId}`,
	subject: 'Drink',
	fetch: () => $api.drinks.getWithAuthorship(props.drinkId)
});

const recipeLists = computed(() =>
	drink.value
		? [
				{ kind: 'ingredients' as const, lines: drink.value.ingredients },
				{ kind: 'garnishes' as const, lines: drink.value.garnishes ?? [] }
			]
		: []
);

watch(error, (newError) => {
	if (newError) console.error('Failed to fetch drink:', newError);
});
watch(
	canUpdate,
	(allowed) => {
		if (allowed) $router.replace(localePath(`/drinks/${props.drinkId}/edit`));
	},
	{ immediate: true }
);
</script>
