import type { DatabaseCommonInfo } from '../shared/database.types';
import type { CommentStatuses } from './comment.constants';

export type CommentStatus = (typeof CommentStatuses)[keyof typeof CommentStatuses];

/**
 * Comment =
 *     _id: string
 *     drink_id: string (references Drink._id)
 *     user_id: string (references User._id; the author)
 *     content: string (1..2000 characters)
 *     status: CommentStatus ("visible" | "hidden" | "flagged")
 *     created_at: Date
 *     updated_at: Date
 */
export type Comment = DatabaseCommonInfo & {
	drink_id: string;
	user_id: string;
	content: string;
	status: CommentStatus;
};
