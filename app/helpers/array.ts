/**
 * Splits an array into chunks of a specified size.
 *
 * @param array - The array to chunk.
 * @param chunkSize - The size of each chunk.
 * @returns A new array containing chunks.
 */
export const chunkArray = <T = unknown>(array: T[], chunkSize: number) => {
	if (chunkSize <= 0) {
		throw new Error('Chunk size must be greater than 0');
	}

	return array.reduce<T[][]>((resultArray, item, index) => {
		const chunkIndex = Math.floor(index / chunkSize);

		if (!resultArray[chunkIndex]) {
			resultArray[chunkIndex] = []; // start a new chunk
		}

		resultArray[chunkIndex].push(item);

		return resultArray;
	}, []);
};

/**
 * Returns a copy of the array with the item at `from` moved to position `to`. Positions outside the array
 * leave the order as it is.
 */
export const moveItem = <T>(array: readonly T[], from: number, to: number): T[] => {
	const copy = [...array];
	const isInside = (index: number) => index >= 0 && index < copy.length;
	if (from === to || !isInside(from) || !isInside(to)) return copy;
	const [item] = copy.splice(from, 1);
	copy.splice(to, 0, item as T);
	return copy;
};
