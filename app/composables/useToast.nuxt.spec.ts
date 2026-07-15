import { describe, it, expect, beforeEach } from 'vitest';
import { useToast } from './useToast';

describe('useToast', () => {
	let toast: ReturnType<typeof useToast>;

	beforeEach(() => {
		toast = useToast();
		toast.state.value = {
			maxToastsOnScreen: 7,
			displayingToasts: [],
			awaitingToasts: [],
			displayedToasts: []
		};
	});

	describe('initial state', () => {
		it('starts with empty toast arrays', () => {
			expect(toast.state.value.displayingToasts).toEqual([]);
			expect(toast.state.value.awaitingToasts).toEqual([]);
			expect(toast.state.value.displayedToasts).toEqual([]);
		});

		it('has maxToastsOnScreen set to 7', () => {
			expect(toast.state.value.maxToastsOnScreen).toBe(7);
		});
	});

	describe('addToast', () => {
		it('adds a toast to displayingToasts', () => {
			toast.addToast({ type: 'success', title: 'Done', message: 'Item created' });

			expect(toast.state.value.displayingToasts).toHaveLength(1);
			expect(toast.state.value.displayingToasts[0]!.title).toBe('Done');
			expect(toast.state.value.displayingToasts[0]!.type).toBe('success');
		});

		it('assigns an id and created_at', () => {
			toast.addToast({ type: 'info', title: 'Info', message: 'Hello' });

			expect(toast.state.value.displayingToasts[0]!.id).toBeTruthy();
			expect(toast.state.value.displayingToasts[0]!.created_at).toBeInstanceOf(Date);
		});

		it('prepends new toasts (most recent first)', () => {
			toast.addToast({ type: 'success', title: 'First', message: '' });
			toast.addToast({ type: 'success', title: 'Second', message: '' });

			expect(toast.state.value.displayingToasts[0]!.title).toBe('Second');
		});

		it('queues toast when maxToastsOnScreen is reached', () => {
			for (let i = 0; i < 7; i++) {
				toast.addToast({ type: 'info', title: `Toast ${i}`, message: '' });
			}
			toast.addToast({ type: 'info', title: 'Overflow', message: '' });

			expect(toast.state.value.displayingToasts).toHaveLength(7);
			expect(toast.state.value.awaitingToasts).toHaveLength(1);
		});
	});

	describe('removeToast', () => {
		it('removes from displaying and adds to displayed', () => {
			toast.addToast({ type: 'success', title: 'Toast', message: '' });
			const toastToRemove = toast.state.value.displayingToasts[0]!;

			toast.removeToast(toastToRemove);

			expect(toast.state.value.displayingToasts).toHaveLength(0);
			expect(toast.state.value.displayedToasts).toHaveLength(1);
		});

		it('promotes awaiting toast when one is removed', () => {
			for (let i = 0; i < 7; i++) {
				toast.addToast({ type: 'info', title: `Toast ${i}`, message: '' });
			}
			toast.addToast({ type: 'info', title: 'Awaiting', message: '' });

			toast.removeToast(toast.state.value.displayingToasts[0]!);

			expect(toast.state.value.awaitingToasts).toHaveLength(0);
			expect(toast.state.value.displayingToasts).toHaveLength(7);
		});
	});
});
