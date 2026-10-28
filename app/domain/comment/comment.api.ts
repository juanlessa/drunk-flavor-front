import { mapEntityMetadata } from '../shared/api.mappers';
import type { ApiResponse } from '../shared/api.types';
import type { Comment } from './comment.entity';

export type CommentResponse = ApiResponse<Comment>;
export const mapCommentResponse = (response: CommentResponse): Comment =>
	mapEntityMetadata<Comment>(response);
