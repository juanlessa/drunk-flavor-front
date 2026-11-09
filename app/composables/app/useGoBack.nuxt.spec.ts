import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { useGoBack } from './useGoBack';

const click = (init: MouseEventInit = {}) =>
	new MouseEvent('click', { button: 0, cancelable: true, ...init });

describe('useGoBack', () => {
	let previousState: unknown;
	let back: ReturnType<typeof vi.spyOn>;
	let push: ReturnType<typeof vi.spyOn>;

	beforeEach(() => {
		previousState = window.history.state;
		const router = useRouter();
		back = vi.spyOn(router, 'back').mockImplementation(() => {});
		push = vi.spyOn(router, 'push').mockResolvedValue(undefined);
	});
	afterEach(() => {
		window.history.replaceState(previousState, '');
		vi.restoreAllMocks();
	});

	it('returns to the page the drink was opened from', () => {
		window.history.replaceState({ ...window.history.state, back: '/bar' }, '');
		const event = click();

		useGoBack('/')(event);

		expect(event.defaultPrevented).toBe(true);
		expect(back).toHaveBeenCalledOnce();
		expect(push).not.toHaveBeenCalled();
	});

	it('goes to the fallback when the page was opened directly', () => {
		window.history.replaceState({ ...window.history.state, back: null }, '');

		useGoBack(() => '/pt')(click());

		expect(push).toHaveBeenCalledWith('/pt');
		expect(back).not.toHaveBeenCalled();
	});

	it.each([
		{ title: 'the command key', init: { metaKey: true } },
		{ title: 'the control key', init: { ctrlKey: true } },
		{ title: 'the shift key', init: { shiftKey: true } },
		{ title: 'the middle button', init: { button: 1 } }
	])('leaves a click with $title to the browser', ({ init }) => {
		window.history.replaceState({ ...window.history.state, back: '/bar' }, '');
		const event = click(init);

		useGoBack('/')(event);

		expect(event.defaultPrevented).toBe(false);
		expect(back).not.toHaveBeenCalled();
		expect(push).not.toHaveBeenCalled();
	});
});
