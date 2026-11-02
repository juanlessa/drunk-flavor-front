<template>
	<Story title="Organisms/Profile/GoogleConnectionSection">
		<Variant title="Available"
			><div class="max-w-3xl p-4"><GoogleConnectionSection :connected="false" /></div
		></Variant>
		<Variant title="Connected"
			><div class="max-w-3xl p-4"><GoogleConnectionSection connected /></div
		></Variant>
	</Story>
</template>
