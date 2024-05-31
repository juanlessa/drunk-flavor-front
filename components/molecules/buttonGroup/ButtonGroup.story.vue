<template>
	<Story title="Molecules/ButtonGroup">
		<template #controls="{ state }: { state: State }">
			<HstSelect v-model="state.size" title="Size" :options="buttonSizeOptions" />
			<HstCheckbox v-model="state.disabled" title="Disabled" />
		</template>

		<Variant title="default" :init-state="initState">
			<template #default="{ state }: { state: State }">
				<ButtonGroup>
					<template #cancel>
						<Button variant="secondary" :size="state.size" :disabled="state.disabled">
							cancel
						</Button>
					</template>

					<Button variant="primary" :size="state.size" :disabled="state.disabled">
						submit
					</Button>
				</ButtonGroup>
			</template>
		</Variant>
	</Story>
</template>
<script lang="ts" setup>
import { type ButtonSize, buttonSizeOptions } from '~/components/atoms/button/Button';

type State = {
	size: ButtonSize;
	disabled: boolean;
};

function initState(): State {
	return {
		size: 'md',
		disabled: false
	};
}
</script>
