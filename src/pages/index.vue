<template>
	<div class="m-6 p-2 bg-gray-400 min-h-40">
		<Button @click="handleAuthenticate">Authenticate</Button>
		<Button variant="secondary" @click="handleCategories">GET categories</Button>
	</div>
</template>
<script setup lang="ts">
const handleAuthenticate = async () => {
	console.log('handleAuthenticate');

	const response = await useAPIFetch('/sessions', {
		method: 'POST',
		body: {
			email: 'juanvlessa@ua.pt',
			password: '12345678'
		}
	});
	console.log('response');
	console.log(response);
	console.log('data');
	console.log(response.data);
};

const handleCategories = async () => {
	console.log('handleCategories');

	const response = await useAPIFetch('/categories', {
		method: 'GET'
	});
	console.log('response');
	console.log(response);
	console.log('data');
	console.log(response.data);
};
</script>
