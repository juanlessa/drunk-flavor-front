import { mount } from '@vue/test-utils';
import { describe, it } from 'vitest';
import { expectNoA11yViolations, withLabel } from '~/test/axe';
import Avatar from '~/components/atoms/avatar/Avatar.vue';
import Button from '~/components/atoms/button/Button.vue';
import Text from '~/components/atoms/text/Text.vue';
import AvatarInput from './AvatarInput.vue';

const props = {
	alt: 'Profile picture',
	buttonLabel: 'Change photo',
	helpText: 'JPEG, PNG or WebP up to 3 MB'
};

describe('AvatarInput accessibility', () => {
	it.each([{}, { disabled: true }])('has no violations with extra props %o', async (extra) => {
		const wrapper = mount(withLabel(AvatarInput, { ...props, ...extra }, 'Profile picture'), {
			global: { components: { Avatar, Button, Text } },
			attachTo: document.body
		});

		await expectNoA11yViolations(wrapper.element);
		wrapper.unmount();
	});
});
