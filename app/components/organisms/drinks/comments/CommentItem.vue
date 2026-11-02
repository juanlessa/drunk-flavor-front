<template>
	<article class="flex gap-3 py-4" :aria-labelledby="authorId" :aria-busy="props.isPending">
		<Avatar
			size="sm"
			:src="props.comment.author?.avatarUrl ?? ''"
			:alt="authorName"
			class="mt-0.5" />
		<div class="flex-1 min-w-0 flex flex-col gap-1.5">
			<header class="flex items-start gap-2">
				<div class="flex-1 min-w-0">
					<p class="flex items-center gap-2 min-w-0">
						<span
							:id="authorId"
							class="text-body-sm font-bold truncate"
							:class="props.comment.author ? 'text-content' : 'text-content-muted'">
							{{ authorName }}
						</span>
						<Badge v-if="props.isOwn" tone="accent" class="py-0">
							{{ $t('drinkDetailPage.comments.you') }}
						</Badge>
					</p>
					<p class="text-caption text-content-muted">
						<time :datetime="createdAtIso" :title="createdAtTitle">
							{{ relativeCreatedAt }}
						</time>
						<template v-if="isEdited">
							<span aria-hidden="true"> · </span>
							<span>{{ $t('drinkDetailPage.comments.edited') }}</span>
						</template>
					</p>
				</div>
				<!-- Pulled into the corner so the 44px target does not push the text down. -->
				<ActionMenu
					v-if="menuItems.length && !isEditing"
					class="-mt-2 -mr-2"
					:label="$t('drinkDetailPage.comments.actions', { name: authorName })"
					:items="menuItems"
					:disabled="props.isPending"
					@select="handleMenuSelect" />
			</header>
			<CommentComposer
				v-if="isEditing"
				:id="`comment-edit-${props.comment.id}`"
				ref="editorRef"
				v-model="draft"
				:label="$t('drinkDetailPage.comments.editLabel')"
				:submit-label="$t('drinkDetailPage.comments.save')"
				:initial-value="props.comment.content"
				:is-submitting="props.isPending"
				cancelable
				@submit="handleSave"
				@cancel="handleCancelEdit" />
			<Text
				v-else
				class="text-body text-content-secondary whitespace-pre-line wrap-break-word">
				{{ props.comment.content }}
			</Text>
		</div>
	</article>
</template>
<script setup lang="ts">
import { useId } from 'vue';
import HideIcon from '~/components/icons/HideIcon.vue';
import PencilIcon from '~/components/icons/PencilIcon.vue';
import TrashIcon from '~/components/icons/TrashIcon.vue';
import type { ActionMenuItem } from '~/components/molecules/actionMenu/ActionMenu.types';
import type { CommentWithAuthor } from '~/domain/comment/comment.entity';
import { formatDateTime, formatRelativeTime } from '~/helpers/date.helpers';
import { getUserFullName } from '~/helpers/user.helpers';
import type CommentComposer from './CommentComposer.vue';

/** `updatedAt` must trail `createdAt` by more than this to count as an edit. */
const EDIT_THRESHOLD_MS = 1000;

type CommentItemAction = 'edit' | 'hide' | 'delete';

const props = defineProps({
	comment: { type: Object as PropType<CommentWithAuthor>, required: true },
	isOwn: { type: Boolean, default: false },
	canEdit: { type: Boolean, default: false },
	canDelete: { type: Boolean, default: false },
	canHide: { type: Boolean, default: false },
	isPending: { type: Boolean, default: false }
});

const emit = defineEmits<{
	(e: 'update', content: string, done: (saved: boolean) => void): void;
	(e: 'hide' | 'delete'): void;
}>();

const { t, locale } = useI18n();
const authorId = useId();
const isEditing = ref(false);
const draft = ref('');
const editorRef = ref<InstanceType<typeof CommentComposer> | null>(null);

const authorName = computed(
	() =>
		(props.comment.author && getUserFullName(props.comment.author)) ||
		t('drinkDetailPage.comments.unknownAuthor')
);
const createdAtIso = computed(() => new Date(props.comment.createdAt).toISOString());
const createdAtTitle = computed(() => formatDateTime(props.comment.createdAt, locale.value));
const relativeCreatedAt = computed(() => formatRelativeTime(props.comment.createdAt, locale.value));
const isEdited = computed(
	() =>
		new Date(props.comment.updatedAt).getTime() - new Date(props.comment.createdAt).getTime() >
		EDIT_THRESHOLD_MS
);

const menuItems = computed<ActionMenuItem[]>(() => {
	const items: ActionMenuItem[] = [];
	if (props.canEdit) {
		items.push({ key: 'edit', label: t('drinkDetailPage.comments.edit'), icon: PencilIcon });
	}
	if (props.canHide) {
		items.push({ key: 'hide', label: t('drinkDetailPage.comments.hide'), icon: HideIcon });
	}
	if (props.canDelete) {
		items.push({
			key: 'delete',
			label: t('drinkDetailPage.comments.delete'),
			icon: TrashIcon,
			tone: 'danger'
		});
	}
	return items;
});

const startEditing = async () => {
	draft.value = props.comment.content;
	isEditing.value = true;
	await nextTick();
	editorRef.value?.focus();
};

const handleMenuSelect = (key: string) => {
	const action = key as CommentItemAction;
	if (action === 'edit') {
		void startEditing();
	} else {
		emit(action);
	}
};

const handleCancelEdit = () => {
	isEditing.value = false;
	draft.value = '';
};

const handleSave = (content: string) => {
	emit('update', content, (saved) => {
		if (saved) handleCancelEdit();
	});
};
</script>
