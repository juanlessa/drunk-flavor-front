import { describe, expect, it, vi } from 'vitest';
import { useReauthentication } from './useReauthentication';

const challenge = () => ({ data: { code: 'RECENT_AUTHENTICATION_REQUIRED' } });

describe('useReauthentication', () => {
	it('runs the action directly when the session is recently authenticated', async () => {
		const { isRequired, run } = useReauthentication();
		const action = vi.fn().mockResolvedValue(undefined);

		await run(action);

		expect(action).toHaveBeenCalledOnce();
		expect(isRequired.value).toBe(false);
	});

	it('keeps the challenged action pending and retries it once after confirmation', async () => {
		const { isRequired, run, confirm } = useReauthentication();
		const action = vi.fn().mockRejectedValueOnce(challenge()).mockResolvedValue(undefined);

		await run(action);
		expect(isRequired.value).toBe(true);

		await confirm();

		expect(action).toHaveBeenCalledTimes(2);
		expect(isRequired.value).toBe(false);
	});

	it('propagates a second challenge instead of asking again', async () => {
		const { isRequired, run, confirm } = useReauthentication();
		const secondChallenge = challenge();
		const action = vi
			.fn()
			.mockRejectedValueOnce(challenge())
			.mockRejectedValueOnce(secondChallenge);

		await run(action);

		await expect(confirm()).rejects.toBe(secondChallenge);
		expect(isRequired.value).toBe(false);
	});

	it('propagates errors that are not a reauthentication challenge', async () => {
		const { isRequired, run } = useReauthentication();
		const failure = new Error('network');

		await expect(run(vi.fn().mockRejectedValue(failure))).rejects.toBe(failure);
		expect(isRequired.value).toBe(false);
	});

	it('discards the pending action on cancel', async () => {
		const { isRequired, run, confirm, cancel } = useReauthentication();
		const action = vi.fn().mockRejectedValueOnce(challenge());

		await run(action);
		cancel();
		await confirm();

		expect(isRequired.value).toBe(false);
		expect(action).toHaveBeenCalledOnce();
	});
});
