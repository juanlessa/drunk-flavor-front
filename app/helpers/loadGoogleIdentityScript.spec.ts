// @vitest-environment happy-dom
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

const fakeAccountsId = { initialize: vi.fn(), renderButton: vi.fn() };

// happy-dom refuses to download external scripts, so appended scripts are captured instead
// of being attached to the document, and the tests drive their load/error events.
let appendedScripts: HTMLScriptElement[] = [];

const lastScript = () => appendedScripts[appendedScripts.length - 1];

const finishLoad = () => {
	window.google = { accounts: { id: fakeAccountsId } };
	lastScript()?.onload?.(new Event('load'));
};

describe('loadGoogleIdentityScript', () => {
	let loadGoogleIdentityScript: (language: string) => Promise<unknown>;

	beforeEach(async () => {
		vi.resetModules();
		appendedScripts = [];
		delete window.google;
		vi.spyOn(document.head, 'appendChild').mockImplementation(<T extends Node>(node: T) => {
			appendedScripts.push(node as unknown as HTMLScriptElement);
			return node;
		});
		({ loadGoogleIdentityScript } = await import('./loadGoogleIdentityScript'));
	});

	afterEach(() => {
		vi.restoreAllMocks();
	});

	it('injects the GIS script with the requested hl language', async () => {
		const promise = loadGoogleIdentityScript('pt_BR');
		finishLoad();

		await expect(promise).resolves.toBe(fakeAccountsId);
		expect(appendedScripts).toHaveLength(1);
		expect(lastScript()?.src).toBe('https://accounts.google.com/gsi/client?hl=pt_BR');
	});

	it('reuses the loaded library for the same language', async () => {
		const first = loadGoogleIdentityScript('en');
		finishLoad();
		await first;

		await expect(loadGoogleIdentityScript('en')).resolves.toBe(fakeAccountsId);
		expect(appendedScripts).toHaveLength(1);
	});

	it('loads a new script when a different language is requested', async () => {
		const first = loadGoogleIdentityScript('en');
		finishLoad();
		await first;

		const second = loadGoogleIdentityScript('pt_BR');
		expect(appendedScripts).toHaveLength(2);
		expect(lastScript()?.src).toContain('hl=pt_BR');
		expect(window.google).toBeUndefined();
		finishLoad();

		await expect(second).resolves.toBe(fakeAccountsId);
	});

	it('rejects when the script fails to load and retries on the next call', async () => {
		const failed = loadGoogleIdentityScript('en');
		lastScript()?.onerror?.(new Event('error'));
		await expect(failed).rejects.toThrow('Failed to load Google Identity Services');

		const retry = loadGoogleIdentityScript('en');
		expect(appendedScripts).toHaveLength(2);
		finishLoad();
		await expect(retry).resolves.toBe(fakeAccountsId);
	});
});
