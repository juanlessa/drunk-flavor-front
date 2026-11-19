import { useFetch, type UseFetchOptions } from '#app';

type UseFetch = typeof useFetch;

/** `useFetch` bound to the API origin, sending the session cookie. */
export const useAPIFetch = ((
	path: Parameters<UseFetch>[0],
	options: UseFetchOptions<unknown> = {}
) => {
	const config = useRuntimeConfig();
	return useFetch(path, { ...options, baseURL: config.public.apiBase, credentials: 'include' });
}) as UseFetch;
