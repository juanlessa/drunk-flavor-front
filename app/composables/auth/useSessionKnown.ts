import { onBeforeMount, onMounted, ref } from 'vue';
/**
 * Whether the page can show the real session. The session cookies belong to the API host, so the Nuxt server
 * never sees them: the server-rendered HTML always describes a guest, while the browser already knows the user by
 * the time it hydrates. Rendering the real state in that first pass would not match the server HTML, so while
 * hydrating this is `false` (show a neutral placeholder) and becomes `true` right after mount. Later navigations
 * mount the page with the state known from the start, so nothing flickers.
 */
export const useSessionKnown = () => {
	const nuxtApp = useNuxtApp();
	const isSessionKnown = ref(false);
	onBeforeMount(() => {
		isSessionKnown.value = !nuxtApp.isHydrating;
	});
	onMounted(() => {
		isSessionKnown.value = true;
	});
	return isSessionKnown;
};
