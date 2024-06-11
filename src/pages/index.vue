<template>
	<NuxtLayout>
		<button
			class="inline-flex items-center justify-center rounded font-medium text-[15px] px-[15px] leading-[35px] h-[35px] bg-white text-grass11 shadow-[0_2px_10px] shadow-blackA7 outline-none hover:bg-mauve3 focus:shadow-[0_0_0_2px] focus:shadow-black"
			@click="handleClick">
			Add to calendar
		</button></NuxtLayout
	>
</template>
<script setup lang="ts">
const { addToast } = useToast();

const choices = ['info', 'success', 'error'] as ('info' | 'success' | 'error')[];

function getRandomChoice(array: ('info' | 'success' | 'error')[]): 'info' | 'success' | 'error' {
	const randomIndex = Math.floor(Math.random() * array.length);
	return array[randomIndex];
}

const handleClick = () => {
	addToast({ title: 'title', message: 'message', type: getRandomChoice(choices) });
};
</script>
