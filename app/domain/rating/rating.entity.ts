import type { EntityMetadata } from '../shared/entity.types';

export type Rating = EntityMetadata & {
	drinkId: string;
	userId: string;
	value: number;
};

export type RatingSummary = { average: number; count: number };
