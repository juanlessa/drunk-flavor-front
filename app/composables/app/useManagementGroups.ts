import { computed, toValue, type MaybeRefOrGetter } from 'vue';
import type { CatalogSubjectName } from '~/domain/accessControl/accessControl.types';
import {
	type ManagementEntry,
	buildManagementEntries,
	chunkManagementEntries
} from '~/helpers/managementGroups.helpers';

export type UseManagementGroupsOptions<T extends { id: string; createdBy?: string }> = {
	/** Items of a `GET .../me` list. */
	items: MaybeRefOrGetter<T[]>;
	/** Subject the per-record permission checks run against. */
	subject: CatalogSubjectName;
	/** A search is active, which hides the "nothing created yet" placeholder. */
	searching: MaybeRefOrGetter<boolean>;
};

/**
 * The two groups of a management list ("yours" and "created by others") and what the user can do
 * with each record.
 *
 * Which actions are offered comes from the ability checked against the record, not from the group:
 * an admin or the owner can change records of others, a partner cannot.
 */
export const useManagementGroups = <T extends { id: string; createdBy?: string }>(
	options: UseManagementGroupsOptions<T>
) => {
	const { $auth } = useNuxtApp();
	const { can } = useAppAbility();

	const userId = computed(() => $auth.state.value.user?.id);

	const entries = computed(() =>
		buildManagementEntries(toValue(options.items), userId.value, {
			searching: toValue(options.searching)
		})
	);

	const canChange = (action: 'update' | 'delete', item: T) =>
		can(action, { __typename: options.subject, createdBy: item.createdBy });

	// Typed to the item so the grid slot keeps the type of the entries.
	const chunk = (list: ManagementEntry<T>[], columns: number) =>
		chunkManagementEntries(list, columns);

	return { entries, chunk, canChange };
};
