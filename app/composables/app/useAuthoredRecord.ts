import { computed } from 'vue';
import type { CatalogSubjectName } from '~/domain/accessControl/accessControl.types';

export type UseAuthoredRecordOptions<T extends { createdBy?: string }> = {
	/** Key of the request. Include the id, so two records never share a cache entry. */
	key: string;
	/** Subject the permission is checked against. */
	subject: CatalogSubjectName;
	/** Reads the record with authorship (`GET .../me/:id`). */
	fetch: () => Promise<T>;
};

/**
 * Loads one catalog record with its authorship and tells whether the signed-in user may change it.
 *
 * The read needs the session cookie, which the Nuxt server never receives, so it runs in the browser
 * only. `canUpdate` stays `undefined` until the record arrives, so a page can wait before deciding
 * between the edit form and the read-only view. The result is never reused from a previous visit,
 * because who may edit it can change in between.
 */
export const useAuthoredRecord = <T extends { createdBy?: string }>(
	options: UseAuthoredRecordOptions<T>
) => {
	const { can } = useAppAbility();

	const { data, error, status } = useAsyncData<T>(options.key, options.fetch, {
		server: false,
		lazy: true,
		getCachedData: () => undefined
	});

	const record = computed<T | undefined>(() => (data.value as T | null | undefined) ?? undefined);
	const canUpdate = computed(() =>
		record.value
			? can('update', { __typename: options.subject, createdBy: record.value.createdBy })
			: undefined
	);

	return { record, canUpdate, error, status };
};
