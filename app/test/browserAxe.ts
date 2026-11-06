import { expect } from 'vitest';
import { nextTick } from 'vue';
import type { Component } from 'vue';
import { page } from 'vitest/browser';
// Registers page.render and the automatic cleanup between tests (Nuxt environment, real Chromium).
import '@nuxt/test-utils/browser';
import { expectNoA11yViolations, withLabel } from './axe';
import type { RunAxeOptions } from './axe';

// Overlays fade in with opacity animations; auditing mid-animation blends colors and reports contrast values
// that never exist at rest. Animations are disabled so the audit always sees the final, settled colors.
const disableMotion = document.createElement('style');
disableMotion.textContent =
	'*, *::before, *::after { animation: none !important; transition: none !important; }';
document.head.appendChild(disableMotion);

export const THEMES = ['light', 'dark'] as const;
export type Theme = (typeof THEMES)[number];

/** The app switches theme through the `dark` class on <html> (VueUse `useDark`). */
export const applyTheme = (theme: Theme) =>
	document.documentElement.classList.toggle('dark', theme === 'dark');

export interface BrowserAuditOptions extends RunAxeOptions {
	props?: Record<string, unknown>;
	slots?: Record<string, unknown>;
	/** Wraps a form control with a visible <label for>, like the layer 1 `withLabel` helper. */
	label?: boolean;
	/**
	 * `container` audits only the rendered component. `body` audits the whole document, which is required
	 * for portal content (dialogs, menus, popovers) that renders outside the component root.
	 */
	root?: 'container' | 'body';
	/** Runs after render and before the audit, e.g. to open a menu by clicking its trigger. */
	prepare?: () => Promise<void>;
	/**
	 * Selector that must exist in the document before auditing. Guards open-state tests: without it, a portal that
	 * never opened would be audited as an empty page and pass for the wrong reason.
	 */
	expectPresent?: string;
	/** Allows a component that legitimately renders nothing (e.g. a feature that is not configured). */
	allowEmpty?: boolean;
}

const queryRequired = (selector: string) => {
	const element = document.querySelector(selector);
	if (!element) throw new Error(`Element not found for selector: ${selector}`);
	return element;
};

/** Real pointer click (Radix opens menus and selects on pointerdown, which a synthetic `.click()` does not fire). */
export const clickElement = (selector: string) =>
	page.elementLocator(queryRequired(selector)).click();

/** Types into an input like a user would, which opens comboboxes and filters their options. */
export const typeInto = (selector: string, text: string) =>
	page.elementLocator(queryRequired(selector)).fill(text);

/**
 * Renders the component in real Chromium with the app styles, applies the theme and runs axe
 * with the color-contrast rule enabled (happy-dom cannot measure it).
 */
export async function auditInBrowser(
	component: Component,
	theme: Theme,
	options: BrowserAuditOptions = {}
) {
	const {
		props,
		slots,
		label,
		root = 'container',
		prepare,
		expectPresent,
		allowEmpty,
		...axeOptions
	} = options;
	applyTheme(theme);

	const target = label ? withLabel(component, props) : component;
	const screen = await page.render(target, label ? undefined : { props, slots });
	await nextTick();
	// An empty container means the component silently failed to render (e.g. a plain functional component,
	// or a conditionally hidden one); auditing it would pass for the wrong reason.
	if (!allowEmpty)
		expect(screen.container.innerHTML.trim(), 'component rendered nothing').not.toBe('');
	await prepare?.();
	await nextTick();
	if (expectPresent) {
		await expect
			.poll(() => document.querySelector(expectPresent), {
				message: `Missing: ${expectPresent}`
			})
			.not.toBeNull();
	}

	await expectNoA11yViolations(root === 'body' ? document.body : screen.container, {
		...axeOptions,
		checkContrast: true
	});
}
