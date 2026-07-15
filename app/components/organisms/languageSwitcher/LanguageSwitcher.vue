<template>
	<div class="max-w-20">
		<InputSelect
			:model-value="locale"
			:options="languageOptions"
			@update:model-value="setLocale" />
	</div>
</template>
<script setup lang="ts">
import type { InputSelectOption } from '~/types/InputSelect';

const { locale, setLocale } = useI18n();

const languageOptions: InputSelectOption[] = [
	{ label: 'EN', value: 'en' },
	{ label: 'PT', value: 'pt' }
];
</script>
