<template>
	<Story title="Atoms/Text">
		<template #controls="{ state }">
			<HstSelect v-model="state.size" title="size" :options="textSizeOptions" />
			<HstSelect v-model="state.weight" title="weight" :options="textWeightOptions" />
			<HstSelect v-model="state.type" title="type" :options="textTypeOptions" />
		</template>

		<Variant title="default" :init-state="initState">
			<template #default="{ state }">
				<Text :type="state.type" :size="state.size" :weight="state.weight"
					>sample text</Text
				>
			</template>
		</Variant>
	</Story>
</template>
<script lang="ts" setup>
const textSizeOptions = [
	'xxs',
	'xs',
	'sm',
	'md',
	'lg',
	'xl',
	'2xl',
	'4xl',
	'5xl',
	'6xl',
	'7xl',
	'8xl',
	'9xl'
];
const textTypeOptions = ['p', 'span', 'strong'];
const textWeightOptions = ['regular', 'medium', 'bold'];

function initState() {
	return {
		size: 'md',
		type: 'p',
		weight: 'regular'
	};
}
</script>
