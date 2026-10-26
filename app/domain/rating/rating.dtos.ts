import type { RatingSummary } from './rating.entity';

export type CreateRating = {
	drink_id: string;
	value: number;
};

export type UpdateRating = {
	id: string;
	value: number;
};

export type RatingMutationResponse = {
	summary: RatingSummary;
};

export type CreateRatingResponse = RatingMutationResponse & {
	id: string;
};
