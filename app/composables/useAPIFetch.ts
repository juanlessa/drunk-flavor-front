import { useFetch, type UseFetchOptions } from '#app';

type UseFetchRequest = Parameters<typeof useFetch>[0];

export const useAPIFetch = <ResT>(path: UseFetchRequest, options: UseFetchOptions<ResT> = {}) => {
	const config = useRuntimeConfig();

	options.baseURL = config.public.apiBase;
	options.credentials = 'include';

	return useFetch(path, options);
};
