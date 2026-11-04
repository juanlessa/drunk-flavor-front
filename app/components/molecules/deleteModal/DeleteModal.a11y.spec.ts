import { flushPromises, mount } from '@vue/test-utils';
import { describe, it, expect } from 'vitest';
import { expectNoA11yViolations } from '~/test/axe';
import Box from '~/components/atoms/box/Box.vue';
import Button from '~/components/atoms/button/Button.vue';
import Heading from '~/components/atoms/heading/Heading.vue';
import Text from '~/components/atoms/text/Text.vue';
import ButtonGroup from '~/components/molecules/buttonGroup/ButtonGroup.vue';
import DeleteModal from './DeleteModal.vue';

const global = {
	components: { Box, Button, Heading, Text, ButtonGroup },
	mocks: { $t: (key: string) => key }
};

describe('DeleteModal accessibility', () => {
	// The dialog renders in a portal outside the component root, so the whole body is audited.
	// The portal content only exists after pending promises flush, so every case awaits it first.
	it('has no violations when open', async () => {
		const wrapper = mount(DeleteModal, {
			props: {
				open: true,
				title: 'Delete drink',
				description: 'This action cannot be undone.'
			},
			global,
			attachTo: document.body
		});
		await flushPromises();

		expect(document.body.querySelector('[role="alertdialog"]')).not.toBeNull();
		await expectNoA11yViolations(document.body);
		wrapper.unmount();
	});

	it('renders no dialog when closed', async () => {
		const wrapper = mount(DeleteModal, {
			props: { open: false },
			global,
			attachTo: document.body
		});
		await flushPromises();

		expect(document.body.querySelector('[role="alertdialog"]')).toBeNull();
		await expectNoA11yViolations(document.body);
		wrapper.unmount();
	});
});
