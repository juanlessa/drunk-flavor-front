<template>
	<Story title="Atoms/InputSwitch">
		<template #controls="{ state }">
			<HstCheckbox v-model="(state as State).checked" title="checked" />
			<HstText v-model="(state as State).id" title="id" />
			<HstText v-model="(state as State).name" title="name" />
		</template>

		<Variant title="default" :init-state="initState">
			<template #default="{ state }">
				<div class="p-4">
					<InputSwitch
						:id="(state as State).id"
						:name="(state as State).name"
						:checked="(state as State).checked" />
				</div>
			</template>
		</Variant>

		<Variant title="checked" :init-state="initCheckedState">
			<template #default="{ state }">
				<div class="p-4">
					<InputSwitch :checked="(state as State).checked" />
				</div>
			</template>
		</Variant>
	</Story>
</template>
<script lang="ts" setup>
type State = {
	checked: boolean;
	id: string;
	name: string;
};

function initState(): State {
	return {
		checked: false,
		id: 'switch-demo',
		name: 'toggle'
	};
}

function initCheckedState(): State {
	return {
		checked: true,
		id: 'switch-checked',
		name: 'toggle'
	};
}
</script>
