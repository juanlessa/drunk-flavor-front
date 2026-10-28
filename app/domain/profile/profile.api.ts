import { mapEntityMetadata } from '../shared/api.mappers';
import type { ApiResponse } from '../shared/api.types';
import type { Profile } from './profile.entity';

export type ProfileResponse = ApiResponse<Profile>;
export const mapProfileResponse = (response: ProfileResponse): Profile =>
	mapEntityMetadata<Profile>(response);
