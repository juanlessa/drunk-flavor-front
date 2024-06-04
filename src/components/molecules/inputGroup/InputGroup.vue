<template>
	<div>
		<div class="pl-2 mb-1">
			<slot name="label"></slot>
		</div>

		<slot></slot>
		<div class="pl-2">
			<slot name="error"></slot>
		</div>
	</div>
</template>
