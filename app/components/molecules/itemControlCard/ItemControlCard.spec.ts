import { mount } from '@vue/test-utils';
import { describe, it, expect } from 'vitest';
import ItemControlCard from './ItemControlCard.vue';
import Button from '~/components/atoms/button/Button.vue';

const TrashIconStub = { template: '<svg data-testid="trash-icon" />' };
const TextStub = { template: '<p><slot /></p>', props: ['value'] };

const deleteButtonSelector = 'button[aria-label="molecules.itemControlCard.deleteButton.label"]';

const mountItemControlCard = (props = {}, slots = {}) =>
	mount(ItemControlCard, {
		props,
		slots,
		global: {
			components: { Button },
			stubs: { TrashIcon: TrashIconStub, Text: TextStub },
			mocks: { $t: (key: string) => key }
		}
	});

describe('ItemControlCard', () => {
	describe('rendering', () => {
		it('renders the content prop as text', () => {
			const wrapper = mountItemControlCard({ content: 'Category name' });

			expect(wrapper.text()).toContain('Category name');
		});

		it('renders slot content over content prop', () => {
			const wrapper = mountItemControlCard(
				{ content: 'Fallback' },
				{ default: '<span>Custom</span>' }
			);

			expect(wrapper.text()).toContain('Custom');
		});

		it('renders a delete button with trash icon', () => {
			const wrapper = mountItemControlCard({ content: 'Item' });

			expect(wrapper.find(deleteButtonSelector).exists()).toBe(true);
			expect(wrapper.find('[data-testid="trash-icon"]').exists()).toBe(true);
		});
	});

	describe('events', () => {
		it('emits click when card is clicked', async () => {
			const wrapper = mountItemControlCard({ content: 'Item' });

			await wrapper.trigger('click');

			expect(wrapper.emitted('click')).toHaveLength(1);
		});

		it('emits action when delete button is clicked', async () => {
			const wrapper = mountItemControlCard({ content: 'Item' });
			const deleteButton = wrapper.find(deleteButtonSelector);

			await deleteButton.trigger('click');

			expect(wrapper.emitted('action')).toHaveLength(1);
		});

		it('does not emit click when delete button is clicked (stopPropagation)', async () => {
			const wrapper = mountItemControlCard({ content: 'Item' });
			const deleteButton = wrapper.find(deleteButtonSelector);

			await deleteButton.trigger('click');

			expect(wrapper.emitted('click')).toBeUndefined();
		});
	});
});
