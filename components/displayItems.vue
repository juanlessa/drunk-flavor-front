<template>
	<div class="cards-group">
		<div v-for="i in props.items" :key="i._id" class="card-item">
			<div @click="handleItemClick(i)" class="item-name">
				{{ i.translations[$i18n.locale as LANGUAGES].name }}
			</div>
			<div @click="handleDeleteButton(i)" class="delete-button">
				<IconsGarbage :size="24" :color="themeState.colors.iconsColor" alt="delete" />
			</div>
		</div>
	</div>
</template>
<script setup lang="ts">
import { IItem } from "@/types/item";
import { LANGUAGES } from "@/types/translations";

const { $getTheme } = useNuxtApp();

const themeState = $getTheme();

const props = defineProps({
	items: {
		type: Array as PropType<IItem[]>,
		default: [],
	},
});

const emit = defineEmits<{
	(e: "itemClick", value: IItem): void;
	(e: "delete", value: IItem): void;
}>();

const handleItemClick = (item: IItem): void => {
	emit("itemClick", item);
};

const handleDeleteButton = (item: IItem): void => {
	emit("delete", item);
};
</script>
<style scoped>
.cards-group {
	width: 100%;
	display: flex;
	flex-wrap: wrap;
	align-items: center;
	justify-content: center;
	gap: 1rem;
}
.card-item {
	width: 100%;
	max-width: 40rem;
	height: 3rem;
	background-color: var(--primary-background);
	box-shadow: 0 0.25rem 0.25rem var(--box-shadow-color);
	border-radius: 1rem;
	display: flex;
	align-items: center;
}
.item-name {
	height: 100%;
	flex: 1;
	cursor: pointer;
	display: flex;
	align-items: center;
	padding-left: 1rem;
}
.delete-button {
	width: 3rem;
	height: 100%;
	display: flex;
	align-items: center;
	justify-content: center;
	cursor: pointer;
}
</style>
