/**
 * Whether the code is running in the Nuxt server render. Wrapped in a function so specs can
 * mock it: `import.meta.server` is a compile-time flag and cannot be toggled per test.
 */
export const isServerRuntime = (): boolean => import.meta.server;
