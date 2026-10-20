import {
	ref,
	shallowRef,
	computed,
	watch,
	reactive,
	toRef,
	toRefs,
	nextTick,
	onMounted,
	onUnmounted,
	onBeforeUnmount
} from 'vue';

// Provide Vue auto-imports as globals for unit tests
// This simulates what Nuxt does at build time
Object.assign(globalThis, {
	ref,
	shallowRef,
	computed,
	watch,
	reactive,
	toRef,
	toRefs,
	nextTick,
	onMounted,
	onUnmounted,
	onBeforeUnmount
});
