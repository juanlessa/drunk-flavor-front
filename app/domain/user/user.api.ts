import { mapEntityMetadata } from '../shared/api.mappers';
import type { ApiResponse } from '../shared/api.types';
import type { User } from './user.entity';

export type UserResponse = ApiResponse<User>;
export const mapUserResponse = (response: UserResponse): User => mapEntityMetadata<User>(response);
