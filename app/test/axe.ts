import axe from 'axe-core';
import type { AxeResults, Result } from 'axe-core';
import { defineComponent, h } from 'vue';
import type { Component } from 'vue';

/**
 * Rule tags checked by default: WCAG 2.0/2.1 levels A and AA plus axe best practices.
 */
const DEFAULT_TAGS = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'best-practice'];

/**
 * Rules disabled for component-level tests, with the reason for each:
 * - color-contrast: happy-dom does no layout or rendering, so axe cannot measure contrast
 *   (it reports "incomplete" instead of pass/fail). Contrast must be covered in a real browser.
 * - region: requires all content inside landmarks, which only makes sense for a full page.
 * - landmark-one-main / page-has-heading-one: page-level rules that never apply to an isolated component.
 */
const DISABLED_RULES = ['color-contrast', 'region', 'landmark-one-main', 'page-has-heading-one'];

export interface RunAxeOptions {
	/**
	 * Enables the color-contrast rule. Only meaningful in a real browser (Vitest Browser Mode):
	 * happy-dom does no layout or rendering, so leave it off there.
	 */
	checkContrast?: boolean;
	/** Extra rule ids to disable for a specific case. Always justify it in a comment at the call site. */
	disableRules?: string[];
	/** Replaces the default rule tags. */
	tags?: string[];
}

export async function runAxe(element: Element, options: RunAxeOptions = {}): Promise<AxeResults> {
	const baseDisabled = options.checkContrast
		? DISABLED_RULES.filter((id) => id !== 'color-contrast')
		: DISABLED_RULES;
	const disabled = [...baseDisabled, ...(options.disableRules ?? [])];

	return axe.run(element, {
		runOnly: { type: 'tag', values: options.tags ?? DEFAULT_TAGS },
		rules: Object.fromEntries(disabled.map((id) => [id, { enabled: false }]))
	});
}

/**
 * Wraps a form control with a visible <label for=...> so axe can verify its accessible name.
 * Form-control atoms render a bare input, which is only valid when the consumer provides the label.
 * The control receives `id` as a prop, so it must forward `id` to the underlying input.
 */
export function withLabel(
	component: Component,
	props: Record<string, unknown> = {},
	label = 'Field',
	id = 'a11y-field'
): Component {
	return defineComponent({
		render: () => h('div', [h('label', { for: id }, label), h(component, { ...props, id })])
	});
}

function formatViolation(violation: Result): string {
	const nodes = violation.nodes
		.map((node) => {
			// axe explains the failure, e.g. the measured contrast ratio and the foreground/background colors.
			const reason = (node.failureSummary ?? '').split('\n').slice(1).join(' ').trim();
			return `    - ${node.target.join(' ')}\n      ${node.html}${reason ? `\n      ${reason}` : ''}`;
		})
		.join('\n');

	return `[${violation.impact ?? 'unknown'}] ${violation.id}: ${violation.help}\n  ${violation.helpUrl}\n${nodes}`;
}

/**
 * Fails with a readable list of axe violations (rule, impact, selector, HTML and help link).
 * Accepts a DOM element, so it works with `wrapper.element` from @vue/test-utils.
 * The component must be mounted with `attachTo: document.body` for accurate results.
 */
export async function expectNoA11yViolations(
	element: Element,
	options: RunAxeOptions = {}
): Promise<void> {
	const { violations } = await runAxe(element, options);

	if (violations.length > 0) {
		throw new Error(
			`Found ${violations.length} accessibility violation(s):\n\n${violations.map(formatViolation).join('\n\n')}`
		);
	}
}
