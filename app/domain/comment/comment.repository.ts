import type { $Fetch } from 'nitropack';
import type { PaginatedQueryParams } from '../shared/query.types';
import { serializeListQuery } from '../shared/query.helpers';
import type {
	CreateComment,
	CreateCommentResponse,
	ModerateComment,
	UpdateComment
} from './comment.dtos';
import type { Comment } from './comment.entity';

const path = '/comments';

export const commentsRepository = ($fetch: $Fetch) => ({
	async create(body: CreateComment) {
		return $fetch<CreateCommentResponse>(path, {
			method: 'POST',
			body
		});
	},
	async update({ id, ...body }: UpdateComment) {
		return $fetch<undefined>(`${path}/${id}`, {
			method: 'PATCH',
			body
		});
	},
	async moderate({ id, ...body }: ModerateComment) {
		return $fetch<undefined>(`${path}/${id}/status`, {
			method: 'PATCH',
			body
		});
	},
	async delete(id: string) {
		return $fetch<undefined>(`${path}/${id}`, {
			method: 'DELETE'
		});
	},
	async get(id: string) {
		return $fetch<Comment>(`${path}/${id}`);
	},
	async list(query: PaginatedQueryParams) {
		return $fetch<Comment[]>(path, { query: serializeListQuery(query) });
	},
	async listByDrink(drinkId: string, query: PaginatedQueryParams) {
		return $fetch<Comment[]>(`/drinks/${drinkId}/comments`, {
			query: serializeListQuery(query)
		});
	},
	async listMine(query: PaginatedQueryParams) {
		return $fetch<Comment[]>('/me/comments', { query: serializeListQuery(query) });
	}
});
