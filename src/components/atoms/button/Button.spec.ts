import { describe, it, expect, beforeEach, afterAll } from 'vitest';
import { render, cleanup } from '@testing-library/vue';
import { Button } from '#components';

describe('Button.vue', () => {
	beforeEach(() => {
		cleanup();
	});
	afterAll(() => {
		cleanup();
	});
	it('renders slot content', () => {
		const { getByText, findAllByTestId } = render(Button, {
			slots: {
				default: 'submit'
			}
		});

		expect(getByText('submit')).toBeDefined();
	});
});
