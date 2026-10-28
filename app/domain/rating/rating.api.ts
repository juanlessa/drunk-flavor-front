import { mapEntityMetadata } from '../shared/api.mappers';
import type { ApiResponse } from '../shared/api.types';
import type { Rating } from './rating.entity';

export type RatingResponse = ApiResponse<Rating>;
export const mapRatingResponse = (response: RatingResponse): Rating =>
	mapEntityMetadata<Rating>(response);
