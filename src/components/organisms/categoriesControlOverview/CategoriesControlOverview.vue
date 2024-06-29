<template>
	<ButtonGroup class="py-4">
		<Button @click="handleCreateCategory">
			{{ $t('organisms.categoriesControlOverview.createButton.value') }}
		</Button>
	</ButtonGroup>

	<div ref="infinityScrollContainer" class="flex-1">
		<ClientOnly>
			<InfinityScroll
				:items="overviewState.categories"
				:height="infinityScrollHeight"
				:item-height="remToPixels(2.5)"
				:items-gap="remToPixels(1)"
				:item-columns="screenType === 'mobile' ? 1 : 2"
				@load-more="() => nextPage()">
				<template #default="{ list }">
					<div
						v-for="{ data: categoryRow, index } in list"
						:key="index"
						class="flex gap-4 justify-center w-full max-w-screen-desktop mx-auto">
						<ItemControlCard
							v-for="category in categoryRow"
							:key="category._id"
							ref="itemControlCard"
							:content="category.translations[$i18n.locale as Language].name"
							@click="() => handleEditCategory(category._id)"
							@action="() => handleDeleteCategory(category)" />
					</div>
				</template>
			</InfinityScroll>
		</ClientOnly>
	</div>

	<template v-if="overviewState.loading">
		<ItemControlCardSkeleton
			v-for="idx in Array.from({ length: overviewState.filter.limit }, (_, i) => i)"
			:key="idx" />
	</template>
	<DeleteModal
		v-model:open="isDeleteModalOpen"
		@cancel="handleCancelDeleteCategory"
		@delete="handleConfirmDeleteCategory">
		<template #title>
			{{
				`${$t('organisms.categoriesControlOverview.deleteModal.title')} ${categoryToDelete.translations[$i18n.locale as Language].name}`
			}}
		</template>
		<template #description>
			{{ `${$t('organisms.categoriesControlOverview.deleteModal.description')}` }}
		</template>
	</DeleteModal>
</template>
<script setup lang="ts">
import { initEmptyCategory } from '~/constants/category';
import { remToPixels } from '~/helpers/sizes';
import type { ICategory } from '~/types/category';
import type { Language } from '~/types/translations';

const { $router } = useNuxtApp();
const localePath = useLocalePath();
const { addToast } = useToast();
const { overviewState, deleteCategory, nextPage } = useCategoriesOverview();
const { screenType } = useScreenType();

const infinityScrollContainer = ref<HTMLDivElement | null>(null);
const infinityScrollHeight = ref(0);
const isDeleteModalOpen = ref(false);
const categoryToDelete = ref(initEmptyCategory());

let resizeObserver: ResizeObserver | null = null;

onMounted(() => {
	if (infinityScrollContainer.value) {
		resizeObserver = new ResizeObserver(() => {
			if (infinityScrollContainer.value) {
				infinityScrollHeight.value = infinityScrollContainer.value.offsetHeight;
			}
		});

		resizeObserver.observe(infinityScrollContainer.value);
	}
});
onBeforeUnmount(() => {
	if (resizeObserver) {
		if (infinityScrollContainer.value) {
			resizeObserver.unobserve(infinityScrollContainer.value);
		}
		resizeObserver.disconnect();
	}
});

const handleCreateCategory = () => {
	$router.push(localePath('/categories/new'));
};
const handleEditCategory = (id: string) => {
	$router.push(localePath(`/categories/${id}/edit`));
};
const handleDeleteCategory = (category: ICategory) => {
	categoryToDelete.value = { ...category };
	isDeleteModalOpen.value = true;
};

const handleCancelDeleteCategory = () => {
	categoryToDelete.value = initEmptyCategory();
};
const handleConfirmDeleteCategory = async () => {
	try {
		await deleteCategory(categoryToDelete.value._id);
		addToast({ type: 'success', title: 'SUCCESS!', message: 'category deleted' });
	} catch (error) {
		addToast({ type: 'error', title: 'ERROR!', message: 'failed to delete category' });
	} finally {
		categoryToDelete.value = initEmptyCategory();
	}
};
</script>
