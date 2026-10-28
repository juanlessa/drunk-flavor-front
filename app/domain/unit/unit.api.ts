import { mapEntityMetadata } from '../shared/api.mappers';
import type { ApiResponse } from '../shared/api.types';
import type { Unit } from './unit.entity';

export type UnitResponse = ApiResponse<Unit>;
export const mapUnitResponse = (response: UnitResponse): Unit => mapEntityMetadata<Unit>(response);
