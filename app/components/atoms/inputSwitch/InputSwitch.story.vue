<template>
	<Story title="Atoms/InputSwitch">
		<template #controls>
			<HstCheckbox v-model="state.checked" title="checked" />
			<HstText v-model="state.id" title="id" />
			<HstText v-model="state.name" title="name" />
		</template>

		<Variant title="default">
			<div class="p-4">
				<InputSwitch :id="state.id" :name="state.name" :checked="state.checked" />
			</div>
		</Variant>
	</Story>
</template>

<script lang="ts" setup>
import { reactive } from 'vue';

const state = reactive({
	checked: false,
	id: 'switch-demo',
	name: 'toggle'
});
</script>
