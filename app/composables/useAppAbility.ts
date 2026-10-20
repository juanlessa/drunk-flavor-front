import { useAbility } from '@casl/vue';
import type { AppAbility } from '~/domain/accessControl/accessControl.types';

export const useAppAbility = () => useAbility<AppAbility>();
