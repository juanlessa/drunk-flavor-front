import { beforeEach, describe, expect, it, vi } from 'vitest';
import { registerEndpoint } from '@nuxt/test-utils/runtime';
import { getQuery, readBody } from 'h3';
import { DRINK_COMMENTS_PAGE_SIZE } from '~/domain/comment/comment.constants';
import type { CommentWithAuthor } from '~/domain/comment/comment.entity';
import type { Profile } from '~/domain/profile/profile.entity';
import { useDrinkComments } from './drinkComments';

const DRINK_ID = 'drink-1';

const buildComment = (id: string, userId = 'author-1'): CommentWithAuthor => ({
	id,
	drinkId: DRINK_ID,
	userId,
	content: `content ${id}`,
	status: 'visible',
	createdAt: new Date('2026-10-01T10:00:00.000Z'),
	updatedAt: new Date('2026-10-01T10:00:00.000Z'),
	author: { id: userId, name: 'Ada', surname: 'Lovelace' }
});

const fullPage = (prefix: string) =>
	Array.from({ length: DRINK_COMMENTS_PAGE_SIZE }, (_, index) =>
		buildComment(`${prefix}-${index}`)
	);

let pages: Record<string, CommentWithAuthor[]> = {};
let failing: Record<string, boolean> = {};
const received: Record<string, unknown[]> = {
	list: [],
	create: [],
	update: [],
	moderate: [],
	delete: []
};

// Stays failing for the whole test: ofetch retries a failed GET once before rejecting.
const respond = <T>(key: string, value: T) => {
	if (failing[key]) throw new Error(`${key} failed`);
	return value;
};

registerEndpoint(`/drinks/${DRINK_ID}/comments`, {
	method: 'GET',
	handler: (event) => {
		const query = getQuery(event);
		received.list!.push(query);
		return respond('list', pages[String(query.page)] ?? []);
	}
});
registerEndpoint('/comments', {
	method: 'POST',
	handler: async (event) => {
		received.create!.push(await readBody(event));
		return respond('create', { id: 'new-comment' });
	}
});
// registerEndpoint matches literal paths only, so each listed comment gets its own routes.
for (const id of ['c1', 'c2']) {
	registerEndpoint(`/comments/${id}/status`, {
		method: 'PATCH',
		handler: async (event) => {
			received.moderate!.push({ id, ...(await readBody(event)) });
			return respond('moderate', null);
		}
	});
	registerEndpoint(`/comments/${id}`, {
		method: 'PATCH',
		handler: async (event) => {
			received.update!.push({ id, ...(await readBody(event)) });
			return respond('update', null);
		}
	});
	registerEndpoint(`/comments/${id}`, {
		method: 'DELETE',
		handler: () => {
			received.delete!.push(id);
			return respond('delete', null);
		}
	});
}

const viewer = {
	id: 'viewer-1',
	name: 'Grace',
	surname: 'Hopper',
	avatarUrl: 'https://example.com/grace.png',
	email: 'grace@example.com',
	emailVerified: true,
	role: 'member',
	status: 'active',
	createdAt: new Date(),
	updatedAt: new Date(),
	authenticationMethods: { password: { enabled: true }, providers: [] }
} as Profile;

describe('useDrinkComments', () => {
	let thread: ReturnType<typeof useDrinkComments>;

	beforeEach(() => {
		vi.spyOn(console, 'error').mockImplementation(() => undefined);
		pages = { '1': [buildComment('c1'), buildComment('c2')] };
		failing = {};
		Object.values(received).forEach((list) => (list.length = 0));
		useNuxtApp().$auth.state.value = { isAuthenticated: true, user: viewer };
		thread = useDrinkComments(DRINK_ID);
	});

	it('loads the first page with the page size and knows when it is the last one', async () => {
		expect(await thread.load()).toBe(true);

		expect(received.list).toEqual([{ page: '1', limit: String(DRINK_COMMENTS_PAGE_SIZE) }]);
		expect(thread.comments.value.map(({ id }) => id)).toEqual(['c1', 'c2']);
		expect(thread.hasMore.value).toBe(false);
	});

	it('flags a failed load', async () => {
		failing.list = true;

		expect(await thread.load()).toBe(false);
		expect(thread.hasLoadError.value).toBe(true);
	});

	it('appends the next page and skips comments already listed', async () => {
		pages = { '1': fullPage('p1'), '2': [buildComment('p1-9'), buildComment('p2-0')] };
		await thread.load();
		expect(thread.hasMore.value).toBe(true);

		expect(await thread.loadMore()).toBe(true);

		expect(thread.comments.value).toHaveLength(DRINK_COMMENTS_PAGE_SIZE + 1);
		expect(thread.comments.value.at(-1)?.id).toBe('p2-0');
		expect(thread.hasMore.value).toBe(false);
	});

	it('prepends a created comment authored by the viewer', async () => {
		await thread.load();

		expect(await thread.create('Great drink')).toBe(true);

		expect(received.create).toEqual([{ drinkId: DRINK_ID, content: 'Great drink' }]);
		expect(thread.comments.value[0]).toMatchObject({
			id: 'new-comment',
			userId: viewer.id,
			content: 'Great drink',
			author: { id: viewer.id, name: 'Grace', surname: 'Hopper', avatarUrl: viewer.avatarUrl }
		});
	});

	it('keeps the list untouched when creating fails', async () => {
		await thread.load();
		failing.create = true;

		expect(await thread.create('Great drink')).toBe(false);
		expect(thread.comments.value).toHaveLength(2);
	});

	it('updates the content and the edit time of a comment', async () => {
		await thread.load();

		expect(await thread.update('c1', 'Edited')).toBe(true);

		expect(received.update).toEqual([{ id: 'c1', content: 'Edited' }]);
		const [edited] = thread.comments.value;
		expect(edited?.content).toBe('Edited');
		expect(new Date(edited!.updatedAt).getTime()).toBeGreaterThan(
			new Date(edited!.createdAt).getTime()
		);
		expect(thread.isPending('c1')).toBe(false);
	});

	it('keeps the original content when updating fails', async () => {
		await thread.load();
		failing.update = true;

		expect(await thread.update('c1', 'Edited')).toBe(false);
		expect(thread.comments.value[0]?.content).toBe('content c1');
	});

	it('removes a deleted comment', async () => {
		await thread.load();

		expect(await thread.remove('c1')).toBe(true);

		expect(received.delete).toEqual(['c1']);
		expect(thread.comments.value.map(({ id }) => id)).toEqual(['c2']);
	});

	it('hides a comment through moderation and drops it from the thread', async () => {
		await thread.load();

		expect(await thread.hide('c2')).toBe(true);

		expect(received.moderate).toEqual([{ id: 'c2', status: 'hidden' }]);
		expect(thread.comments.value.map(({ id }) => id)).toEqual(['c1']);
	});

	it('keeps a comment listed when deleting fails', async () => {
		await thread.load();
		failing.delete = true;

		expect(await thread.remove('c1')).toBe(false);
		expect(thread.comments.value).toHaveLength(2);
	});
});
