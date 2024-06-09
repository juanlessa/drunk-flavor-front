<template>
	<div class="max-w-20">
		<SelectInput
			:model-value="locale"
			:options="languageOptions"
			@update:model-value="setLocale" />
	</div>
</template>
<script setup lang="ts">
import type { SelectInputOption } from '~/types/SelectInput';

const { locale, setLocale } = useI18n();

const languageOptions: SelectInputOption[] = [
	{ label: 'EN', value: 'en' },
	{ label: 'PT', value: 'pt' }
];
</script>
