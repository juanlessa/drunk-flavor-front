import { CommentStatuses, DRINK_COMMENTS_PAGE_SIZE } from '~/domain/comment/comment.constants';
import type { CommentWithAuthor } from '~/domain/comment/comment.entity';

/**
 * Thread of a drink's visible comments, newest first, with paginated loading and the
 * viewer's mutations. Every mutation resolves to `true` on success and `false` on failure
 * (logged), leaving the list untouched when the request fails.
 */
export const useDrinkComments = (drinkId: MaybeRefOrGetter<string>) => {
	const { $api, $auth } = useNuxtApp();

	const comments = ref<CommentWithAuthor[]>([]);
	const page = ref(0);
	const hasMore = ref(false);
	const isLoading = ref(false);
	const isLoadingMore = ref(false);
	const hasLoadError = ref(false);
	const isCreating = ref(false);
	/** Ids of comments with an update, deletion or moderation in flight. */
	const pendingIds = ref<Set<string>>(new Set());

	const viewer = computed(() => $auth.state.value.user);
	const isAuthenticated = computed(() => $auth.state.value.isAuthenticated);

	const fetchPage = (pageNumber: number) =>
		$api.comments.listByDrink(toValue(drinkId), {
			page: pageNumber,
			limit: DRINK_COMMENTS_PAGE_SIZE
		});

	const load = async (): Promise<boolean> => {
		isLoading.value = true;
		hasLoadError.value = false;
		try {
			const firstPage = await fetchPage(1);
			comments.value = firstPage;
			page.value = 1;
			hasMore.value = firstPage.length === DRINK_COMMENTS_PAGE_SIZE;
			return true;
		} catch (error) {
			console.error(error);
			hasLoadError.value = true;
			return false;
		} finally {
			isLoading.value = false;
		}
	};

	const loadMore = async (): Promise<boolean> => {
		if (isLoadingMore.value || !hasMore.value) return false;
		isLoadingMore.value = true;
		try {
			const nextPage = await fetchPage(page.value + 1);
			// Comments created in this session shift the server pages, so skip any already listed.
			const knownIds = new Set(comments.value.map(({ id }) => id));
			comments.value = [...comments.value, ...nextPage.filter(({ id }) => !knownIds.has(id))];
			page.value += 1;
			hasMore.value = nextPage.length === DRINK_COMMENTS_PAGE_SIZE;
			return true;
		} catch (error) {
			console.error(error);
			return false;
		} finally {
			isLoadingMore.value = false;
		}
	};

	const create = async (content: string): Promise<boolean> => {
		const user = viewer.value;
		if (isCreating.value || !user) return false;
		isCreating.value = true;
		try {
			const { id } = await $api.comments.create({ drinkId: toValue(drinkId), content });
			const now = new Date();
			comments.value = [
				{
					id,
					drinkId: toValue(drinkId),
					userId: user.id,
					content,
					status: CommentStatuses.visible,
					createdAt: now,
					updatedAt: now,
					author: {
						id: user.id,
						name: user.name,
						surname: user.surname,
						avatarUrl: user.avatarUrl
					}
				},
				...comments.value
			];
			return true;
		} catch (error) {
			console.error(error);
			return false;
		} finally {
			isCreating.value = false;
		}
	};

	const withPending = async (id: string, action: () => Promise<void>): Promise<boolean> => {
		if (pendingIds.value.has(id)) return false;
		pendingIds.value = new Set(pendingIds.value).add(id);
		try {
			await action();
			return true;
		} catch (error) {
			console.error(error);
			return false;
		} finally {
			const next = new Set(pendingIds.value);
			next.delete(id);
			pendingIds.value = next;
		}
	};

	const removeFromList = (id: string) => {
		comments.value = comments.value.filter((comment) => comment.id !== id);
	};

	const update = (id: string, content: string) =>
		withPending(id, async () => {
			await $api.comments.update({ id, content });
			const updatedAt = new Date();
			comments.value = comments.value.map((comment) =>
				comment.id === id ? { ...comment, content, updatedAt } : comment
			);
		});

	const remove = (id: string) =>
		withPending(id, async () => {
			await $api.comments.delete(id);
			removeFromList(id);
		});

	/** Moderation: hides the comment from the public thread. */
	const hide = (id: string) =>
		withPending(id, async () => {
			await $api.comments.moderate({ id, status: CommentStatuses.hidden });
			removeFromList(id);
		});

	const isPending = (id: string) => pendingIds.value.has(id);

	return {
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
	};
};
