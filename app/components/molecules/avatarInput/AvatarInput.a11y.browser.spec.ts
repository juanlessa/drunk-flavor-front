import { afterAll, describe, it } from 'vitest';
import { THEMES, applyTheme, auditInBrowser } from '~/test/browserAxe';
import AvatarInput from './AvatarInput.vue';

afterAll(() => applyTheme('light'));

const props = {
	alt: 'Profile picture',
	buttonLabel: 'Change photo',
	helpText: 'JPEG, PNG or WebP up to 3 MB'
};

describe.each(THEMES)('AvatarInput accessibility in the %s theme', (theme) => {
	it.each<Record<string, unknown>>([{}, { disabled: true }])(
		'has no violations with extra props %o',
		async (extra) => {
			await auditInBrowser(AvatarInput, theme, {
				props: { ...props, ...extra },
				label: true
			});
		}
	);
});
