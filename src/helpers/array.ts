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
