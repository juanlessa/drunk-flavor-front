export type CreateRating = {
	drink_id: string;
	value: number;
};

export type UpdateRating = {
	id: string;
	value: number;
};

export type CreateRatingResponse = {
	id: string;
};
