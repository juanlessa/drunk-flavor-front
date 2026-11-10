/** The two groups of a management list. */
export type ManagementGroup = 'own' | 'others';

/**
 * One entry of a grouped management list: a real item, a group header, or the placeholder shown
 * when the user has not created anything yet. Headers and the placeholder fill a whole row.
 */
export type ManagementEntry<T extends { id: string }> =
	| { kind: 'item'; key: string; item: T }
	| { kind: 'header'; key: string; group: ManagementGroup }
	| { kind: 'empty-own'; key: string };

export type BuildManagementEntriesOptions = {
	/** A search is active. The empty placeholder and the group of an empty result are hidden. */
	searching: boolean;
};

/**
 * Splits the items of a `GET .../me` list into the user's own items and everyone else's, keeping
 * the order within each group, and adds the headers.
 *
 * The own group is shown when it has items, or, with no search, when the others have items: that
 * is the only case where the user can tell they have created nothing yet.
 */
export const buildManagementEntries = <T extends { id: string; createdBy?: string }>(
	items: readonly T[],
	userId: string | undefined,
	{ searching }: BuildManagementEntriesOptions
): ManagementEntry<T>[] => {
	const own = userId ? items.filter((item) => item.createdBy === userId) : [];
	const others = userId ? items.filter((item) => item.createdBy !== userId) : [...items];

	const toEntry = (item: T): ManagementEntry<T> => ({ kind: 'item', key: item.id, item });
	const entries: ManagementEntry<T>[] = [];

	const showOwnEmpty = !searching && !own.length && !!others.length && !!userId;
	if (own.length || showOwnEmpty) {
		entries.push({ kind: 'header', key: 'header-own', group: 'own' });
		entries.push(...own.map(toEntry));
		if (showOwnEmpty) entries.push({ kind: 'empty-own', key: 'empty-own' });
	}
	// Without a signed-in user nothing is "own", so a single list needs no header.
	if (others.length) {
		if (userId) entries.push({ kind: 'header', key: 'header-others', group: 'others' });
		entries.push(...others.map(toEntry));
	}

	return entries;
};

/**
 * Splits entries into rows of `columns` items. A header or the placeholder closes the current row
 * and takes a row of its own, so every row keeps the same height.
 */
export const chunkManagementEntries = <T extends { id: string }>(
	entries: ManagementEntry<T>[],
	columns: number
): ManagementEntry<T>[][] => {
	const size = Math.max(1, Math.floor(columns));
	const rows: ManagementEntry<T>[][] = [];
	let current: ManagementEntry<T>[] = [];

	const flush = () => {
		if (current.length) rows.push(current);
		current = [];
	};

	for (const entry of entries) {
		if (entry.kind !== 'item') {
			flush();
			rows.push([entry]);
			continue;
		}
		current.push(entry);
		if (current.length === size) flush();
	}
	flush();

	return rows;
};
