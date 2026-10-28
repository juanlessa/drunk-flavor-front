<template>
	<Story title="Molecules/AvatarInput">
		<Variant title="Placeholder">
			<div class="max-w-md p-4">
				<AvatarInput
					v-model="file"
					alt="Profile avatar"
					button-label="Change photo"
					help-text="JPG, PNG or WebP · max 3 MB" />
			</div>
		</Variant>
		<Variant title="Existing avatar">
			<div class="max-w-md p-4">
				<AvatarInput
					v-model="file"
					src="https://i.pravatar.cc/160"
					alt="Profile avatar"
					button-label="Change photo"
					help-text="JPG, PNG or WebP · max 3 MB" />
			</div>
		</Variant>
		<Variant title="Disabled">
			<div class="max-w-md p-4">
				<AvatarInput
					alt="Profile avatar"
					button-label="Change photo"
					help-text="JPG, PNG or WebP · max 3 MB"
					disabled />
			</div>
		</Variant>
	</Story>
</template>

<script setup lang="ts">
const file = shallowRef<File>();
</script>
