<template>
	<Card>
		<section
			id="comments"
			class="flex flex-col gap-4 p-5 tablet:p-6 scroll-mt-4"
			:aria-labelledby="headingId">
			<Heading :id="headingId" as="h2" size="titleSm">
				{{ $t('drinkDetailPage.comments.title') }}
			</Heading>
			<div v-if="isAuthenticated" class="flex gap-3">
				<!-- The avatar only fits next to the text area from tablet up. -->
				<div class="hidden tablet:block shrink-0 pt-0.5">
					<Avatar size="sm" :src="viewer?.avatarUrl ?? ''" :alt="viewerName" />
				</div>
				<CommentComposer
					id="new-comment"
					ref="composerRef"
					v-model="draft"
					class="flex-1 min-w-0"
					:label="$t('drinkDetailPage.comments.composerLabel')"
					:placeholder="$t('drinkDetailPage.comments.placeholder')"
					:submit-label="$t('drinkDetailPage.comments.publish')"
					:is-submitting="isCreating"
					@submit="handleCreate" />
			</div>
			<div
				v-else
				class="flex flex-col items-center gap-3 rounded-card bg-surface-sunken p-4 text-center tablet:flex-row tablet:justify-between tablet:text-left">
				<Text class="text-body-sm text-content-secondary">
					{{ $t('drinkDetailPage.comments.signInPrompt') }}
				</Text>
				<Button variant="outline" size="sm" class="tablet:w-auto" @click="handleSignIn">
					{{ $t('drinkDetailPage.comments.signIn') }}
				</Button>
			</div>
			<div
				v-if="isLoading"
				:aria-label="$t('drinkDetailPage.comments.loading')"
				role="status">
				<div class="divide-y divide-stroke">
					<CommentItemSkeleton v-for="index in 3" :key="index" />
				</div>
			</div>
			<div
				v-else-if="hasLoadError"
				class="flex flex-col items-center gap-3 py-4 text-center"
				role="alert">
				<Text class="text-body-sm text-danger">
					{{ $t('drinkDetailPage.comments.loadError') }}
				</Text>
				<Button variant="outline" size="sm" class="tablet:w-auto" @click="load">
					{{ $t('drinkDetailPage.comments.retry') }}
				</Button>
			</div>
			<Text
				v-else-if="comments.length === 0"
				class="py-4 text-body-sm text-content-muted text-center">
				{{ $t('drinkDetailPage.comments.empty') }}
			</Text>
			<template v-else>
				<ul class="divide-y divide-stroke border-t border-stroke">
					<li v-for="comment in comments" :key="comment.id">
						<CommentItem
							:comment="comment"
							:is-own="isOwn(comment)"
							:can-edit="canOnComment('update', comment)"
							:can-delete="canOnComment('delete', comment)"
							:can-hide="!isOwn(comment) && canOnComment('moderate', comment)"
							:is-pending="isPending(comment.id)"
							@update="(content, done) => handleUpdate(comment.id, content, done)"
							@hide="handleHide(comment.id)"
							@delete="requestDelete(comment.id)" />
					</li>
				</ul>
				<Button
					v-if="hasMore"
					variant="outline"
					size="sm"
					class="self-center tablet:w-auto"
					:disabled="isLoadingMore"
					@click="handleLoadMore">
					{{
						isLoadingMore
							? $t('drinkDetailPage.comments.loadingMore')
							: $t('drinkDetailPage.comments.loadMore')
					}}
				</Button>
			</template>
		</section>
		<DeleteModal
			v-model:open="isDeleteDialogOpen"
			:title="$t('drinkDetailPage.comments.deleteDialog.title')"
			:description="$t('drinkDetailPage.comments.deleteDialog.description')"
			@delete="handleDelete" />
	</Card>
</template>
<script setup lang="ts">
import { useId } from 'vue';
import type { AppActions } from '~/domain/accessControl/accessControl.types';
import type { CommentWithAuthor } from '~/domain/comment/comment.entity';
import { getUserFullName } from '~/helpers/user.helpers';
import type CommentComposer from './CommentComposer.vue';

const COMMENT_INTENT = 'comment';

const props = defineProps({
	drinkId: { type: String, required: true }
});

const { $router } = useNuxtApp();
const route = useRoute();
const localePath = useLocalePath();
const { t } = useI18n();
const { can } = useAppAbility();
const { addToast } = useToast();
const headingId = useId();

const {
	comments,
	hasMore,
	isLoading,
	isLoadingMore,
	hasLoadError,
	isCreating,
	isAuthenticated,
	viewer,
	load,
	loadMore,
	create,
	update,
	remove,
	hide,
	isPending
} = useDrinkComments(() => props.drinkId);

const draft = ref('');
const isDeleteDialogOpen = ref(false);
/**
 * Kept apart from the open state on purpose: the dialog's action button closes it
 * (`update:open` false) before emitting `delete`, so clearing the id on close would
 * make the confirmation a silent no-op.
 */
const commentToDeleteId = ref<string | null>(null);
const composerRef = ref<InstanceType<typeof CommentComposer> | null>(null);

const viewerName = computed(() => (viewer.value ? getUserFullName(viewer.value) : ''));

const isOwn = (comment: CommentWithAuthor) => comment.userId === viewer.value?.id;

const canOnComment = (action: AppActions, comment: CommentWithAuthor) =>
	can(action, { __typename: 'Comment', userId: comment.userId });

const notifyError = (key: string) =>
	addToast({
		type: 'error',
		title: t(`drinkDetailPage.comments.${key}.title`),
		message: t(`drinkDetailPage.comments.${key}.message`)
	});

const notifySuccess = (key: string) =>
	addToast({
		type: 'success',
		title: t(`drinkDetailPage.comments.${key}.title`),
		message: t(`drinkDetailPage.comments.${key}.message`)
	});

const handleCreate = async (content: string) => {
	if (await create(content)) {
		draft.value = '';
	} else {
		notifyError('createError');
	}
};

const handleUpdate = async (id: string, content: string, done: (saved: boolean) => void) => {
	const saved = await update(id, content);
	if (!saved) notifyError('updateError');
	done(saved);
};

const handleHide = async (id: string) => {
	if (await hide(id)) {
		notifySuccess('hideSuccess');
	} else {
		notifyError('hideError');
	}
};

const requestDelete = (id: string) => {
	commentToDeleteId.value = id;
	isDeleteDialogOpen.value = true;
};

const handleDelete = async () => {
	const id = commentToDeleteId.value;
	commentToDeleteId.value = null;
	isDeleteDialogOpen.value = false;
	if (!id) return;
	if (await remove(id)) {
		notifySuccess('deleteSuccess');
	} else {
		notifyError('deleteError');
	}
};

const handleLoadMore = async () => {
	if (!(await loadMore())) notifyError('loadMoreError');
};

const handleSignIn = () => {
	void $router.push({
		path: localePath('/signin').toString(),
		query: { redirect: route.fullPath, intent: COMMENT_INTENT }
	});
};

/**
 * Back from sign-in with the comment intent: drop it from the URL and focus the composer,
 * which also scrolls it into view (the mobile keyboard opens right below it).
 */
const consumeCommentIntent = async () => {
	if (!isAuthenticated.value || route.query.intent !== COMMENT_INTENT) return;
	const query = { ...route.query };
	Reflect.deleteProperty(query, 'intent');
	void $router.replace({ query });
	await nextTick();
	composerRef.value?.focus();
};

onMounted(async () => {
	await load();
	await consumeCommentIntent();
});
</script>
