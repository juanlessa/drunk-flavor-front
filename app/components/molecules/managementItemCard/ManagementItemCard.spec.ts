import { mount } from '@vue/test-utils';
import { describe, it, expect } from 'vitest';
import ManagementItemCard from './ManagementItemCard.vue';

const TrashIconStub = { template: '<svg data-testid="trash-icon" />' };

const deleteButtonSelector =
	'button[aria-label="molecules.managementItemCard.deleteButton.label:Gin"]';

const mountCard = (props: { title: string; description?: string }) =>
	mount(ManagementItemCard, {
		props,
		global: {
			stubs: { TrashIcon: TrashIconStub },
			mocks: {
				$t: (key: string, params?: { name?: string }) =>
					params?.name ? `${key}:${params.name}` : key
			}
		}
	});

describe('ManagementItemCard', () => {
	describe('rendering', () => {
		it('renders the title and the description', () => {
			const wrapper = mountCard({ title: 'Gin', description: 'Spirit · ml' });

			expect(wrapper.text()).toContain('Gin');
			expect(wrapper.text()).toContain('Spirit · ml');
		});

		it('omits the description line when it is empty', () => {
			const wrapper = mountCard({ title: 'Gin' });

			expect(wrapper.findAll('span.text-body-sm')).toHaveLength(0);
		});

		it('renders the media slot inside the content button, before the title', () => {
			const wrapper = mount(ManagementItemCard, {
				props: { title: 'Mojito' },
				slots: { media: '<img data-testid="thumbnail" alt="" />' },
				global: { stubs: { TrashIcon: TrashIconStub }, mocks: { $t: (key: string) => key } }
			});
			const content = wrapper.findAll('button').at(0)!;

			expect(content.element.firstElementChild?.getAttribute('data-testid')).toBe(
				'thumbnail'
			);
			expect(content.classes()).toContain('pl-3');
		});

		it('keeps the wider inset when there is no media', () => {
			const wrapper = mountCard({ title: 'Gin' });

			expect(wrapper.findAll('button').at(0)!.classes()).toContain('pl-4');
		});

		it('names the delete button after the item', () => {
			const wrapper = mountCard({ title: 'Gin' });

			expect(wrapper.find(deleteButtonSelector).exists()).toBe(true);
			expect(wrapper.find('[data-testid="trash-icon"]').exists()).toBe(true);
		});

		it('renders the content and the delete action as sibling buttons', () => {
			const wrapper = mountCard({ title: 'Gin' });

			expect(wrapper.findAll('button')).toHaveLength(2);
			expect(wrapper.find('button button').exists()).toBe(false);
		});
	});

	describe('events', () => {
		it('emits select when the content is clicked', async () => {
			const wrapper = mountCard({ title: 'Gin' });

			await wrapper.findAll('button').at(0)!.trigger('click');

			expect(wrapper.emitted('select')).toHaveLength(1);
			expect(wrapper.emitted('delete')).toBeUndefined();
		});

		it('emits delete without select when the delete button is clicked', async () => {
			const wrapper = mountCard({ title: 'Gin' });

			await wrapper.find(deleteButtonSelector).trigger('click');

			expect(wrapper.emitted('delete')).toHaveLength(1);
			expect(wrapper.emitted('select')).toBeUndefined();
		});
	});
});
