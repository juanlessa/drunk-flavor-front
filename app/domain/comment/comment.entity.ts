import type { EntityMetadata } from '../shared/entity.types';
import type { CommentStatuses } from './comment.constants';

export type CommentStatus = (typeof CommentStatuses)[keyof typeof CommentStatuses];

export type Comment = EntityMetadata & {
	drinkId: string;
	userId: string;
	content: string;
	status: CommentStatus;
};

/** Public identity of a comment's author, as returned by the drink comments list. */
export type CommentAuthor = {
	id: string;
	name?: string;
	surname?: string;
	avatarUrl?: string;
};

/** A comment of a drink thread; `author` is `null` when the account no longer exists. */
export type CommentWithAuthor = Comment & {
	author: CommentAuthor | null;
};
