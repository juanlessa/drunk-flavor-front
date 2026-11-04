import { mount } from '@vue/test-utils';
import { describe, it } from 'vitest';
import { expectNoA11yViolations, withLabel } from '~/test/axe';
import Box from '~/components/atoms/box/Box.vue';
import Button from '~/components/atoms/button/Button.vue';
import Text from '~/components/atoms/text/Text.vue';
import CloseIcon from '~/components/icons/CloseIcon.vue';
import DropZone from './DropZone.vue';

const global = {
	components: { Box, Button, Text, CloseIcon },
	mocks: { $t: (key: string) => key }
};

describe('DropZone accessibility', () => {
	it('has no violations in the empty state', async () => {
		const wrapper = mount(withLabel(DropZone, {}, 'Image'), {
			global,
			attachTo: document.body
		});

		await expectNoA11yViolations(wrapper.element);
		wrapper.unmount();
	});
});
