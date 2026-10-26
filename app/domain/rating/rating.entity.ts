import type { DatabaseCommonInfo } from '../shared/database.types';

/**
 * Rating =
 *     _id: string
 *     drink_id: string (references Drink._id)
 *     user_id: string (references User._id; the rater)
 *     value: number (integer 1..5)
 *     created_at: Date
 *     updated_at: Date
 */
export type Rating = DatabaseCommonInfo & {
	drink_id: string;
	user_id: string;
	value: number;
};
