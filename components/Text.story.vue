<template>
	<Story title="Atoms/Text">
		<template #controls="{ state }: { state: State }">
			<HstText v-model="state.value" title="value" />
			<HstSelect v-model="state.size" title="size" :options="textSizeOptions" />
			<HstSelect v-model="state.weight" title="weight" :options="textWeightOptions" />
			<HstSelect v-model="state.type" title="type" :options="textTypeOptions" />
		</template>

		<Variant title="default" :init-state="initState">
			<template #default="{ state }: { state: State }">
				<Text :type="state.type" :size="state.size" :weight="state.weight">
					{{ state.value }}
				</Text>
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

type TextType = 'p' | 'span' | 'strong';
type TextWeight = 'regular' | 'medium' | 'bold';
type TextSize =
	| 'xxs'
	| 'xs'
	| 'sm'
	| 'md'
	| 'lg'
	| 'xl'
	| '2xl'
	| '4xl'
	| '5xl'
	| '6xl'
	| '7xl'
	| '8xl'
	| '9xl';

type State = {
	value: string;
	size: TextSize;
	type: TextType;
	weight: TextWeight;
};

function initState(): State {
	return {
		value: 'sample text',
		size: 'md',
		type: 'p',
		weight: 'regular'
	};
}
</script>
