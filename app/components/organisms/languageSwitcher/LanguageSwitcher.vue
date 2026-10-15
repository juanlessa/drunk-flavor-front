<template>
	<div class="max-w-20">
		<InputSelect
			:model-value="locale"
			:options="languageOptions"
			@update:model-value="handleUpdateLocale" />
	</div>
</template>
<script setup lang="ts">
import type { InputSelectOption } from '~/components/atoms/inputSelect/InputSelect.types';

const { locale, setLocale } = useI18n();

/** InputSelect emits a plain string; setLocale only accepts a configured locale. */
type AppLocale = Parameters<typeof setLocale>[0];

const languageOptions: InputSelectOption[] = [
	{ label: 'EN', value: 'en' },
	{ label: 'PT', value: 'pt' }
];

const handleUpdateLocale = (value: string) => setLocale(value as AppLocale);
</script>
