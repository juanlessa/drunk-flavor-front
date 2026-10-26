<template>
	<Box
		as="article"
		direction="col"
		class="w-full max-w-4xl mx-auto gap-10 px-4 py-10 tablet:px-8 tablet:py-16">
		<Box as="header" direction="col" class="gap-4">
			<Heading as="h1" size="headlineSm">{{ document.title }}</Heading>
			<Text class="text-content-subtle">{{ document.lastUpdated }}</Text>
			<Text v-for="paragraph in document.introduction" :key="paragraph">
				{{ paragraph }}
			</Text>
		</Box>

		<Box
			v-for="section in document.sections"
			:id="section.id"
			:key="section.id"
			as="section"
			direction="col"
			class="gap-4 scroll-mt-6">
			<Heading as="h2" size="titleLg">{{ section.title }}</Heading>

			<Text v-for="paragraph in section.paragraphs" :key="paragraph">
				{{ paragraph }}
			</Text>

			<ul v-if="section.items?.length" class="list-disc space-y-3 pl-6 text-content">
				<li v-for="item in section.items" :key="item" class="text-body font-regular">
					{{ item }}
				</li>
			</ul>

			<ul v-if="section.links?.length" class="space-y-2">
				<li v-for="link in section.links" :key="link.href">
					<Anchor :to="link.href" class="underline underline-offset-4">
						{{ link.label }}
					</Anchor>
				</li>
			</ul>
		</Box>
	</Box>
</template>

<script setup lang="ts">
import type { LegalDocument } from '~/constants/legalDocuments.constants';

defineProps<{
	document: LegalDocument;
}>();
</script>
