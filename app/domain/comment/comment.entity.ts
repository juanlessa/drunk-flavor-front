import type { EntityMetadata } from '../shared/entity.types';
import type { CommentStatuses } from './comment.constants';

export type CommentStatus = (typeof CommentStatuses)[keyof typeof CommentStatuses];

export type Comment = EntityMetadata & {
	drinkId: string;
	userId: string;
	content: string;
	status: CommentStatus;
};
