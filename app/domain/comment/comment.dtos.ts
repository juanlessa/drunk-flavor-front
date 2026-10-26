import type { CommentStatus } from './comment.entity';

export type CreateComment = {
	drink_id: string;
	content: string;
};

export type UpdateComment = {
	id: string;
	content: string;
};

export type ModerateComment = {
	id: string;
	status: CommentStatus;
};

export type CreateCommentResponse = {
	id: string;
};
