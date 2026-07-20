<template>
	<Story title="Atoms/ImageAvatar">
		<template #controls>
			<HstText v-model="state.alt" title="alt" />
			<HstText v-model="state.width" title="width" />
			<HstText v-model="state.height" title="height" />
			<HstSelect
				v-model="state.rounded"
				title="rounded"
				:options="imageAvatarRoundedOptions" />
		</template>

		<Variant title="With Image">
			<div class="m-3">
				<ImageAvatar
					class="bg-blue-100"
					:src="avatarSrc"
					:alt="state.alt"
					:width="state.width"
					:height="state.height"
					:rounded="state.rounded" />
			</div>
		</Variant>

		<Variant title="Fallback">
			<div class="m-3">
				<ImageAvatar
					class="bg-blue-100"
					src="/invalid-source.png"
					:alt="state.alt"
					:width="state.width"
					:height="state.height"
					:rounded="state.rounded">
					<template #fallback>
						<ProfileIcon />
					</template>
				</ImageAvatar>
			</div>
		</Variant>
	</Story>
</template>

<script lang="ts" setup>
import { reactive } from 'vue';
import type { ImageAvatarRounded } from './ImageAvatar.types';
import { imageAvatarRoundedOptions } from './ImageAvatar.constants';
import avatarSrc from '~/assets/avatar.webp';
import ProfileIcon from '~/components/icons/ProfileIcon.vue';

const state = reactive({
	alt: 'avatar alt',
	width: '6rem',
	height: '8rem',
	rounded: 'md' as ImageAvatarRounded
});
</script>
