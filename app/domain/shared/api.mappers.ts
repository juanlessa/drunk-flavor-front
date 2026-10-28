import type { ApiResponse } from './api.types';
import type { EntityMetadata } from './entity.types';

export const mapEntityMetadata = <Entity extends EntityMetadata>(
	response: ApiResponse<Entity>,
	overrides: Partial<Entity> = {}
): Entity =>
	({
		...response,
		...overrides,
		createdAt: new Date(response.createdAt),
		updatedAt: new Date(response.updatedAt)
	}) as Entity;
