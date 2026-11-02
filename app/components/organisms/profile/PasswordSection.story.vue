<template>
	<Story title="Organisms/Profile/PasswordSection">
		<Variant title="Update password">
			<div class="max-w-3xl p-4">
				<PasswordSection has-password />
			</div>
		</Variant>
		<Variant title="Create first password">
			<div class="max-w-3xl p-4">
				<PasswordSection :has-password="false" />
			</div>
		</Variant>
	</Story>
</template>
