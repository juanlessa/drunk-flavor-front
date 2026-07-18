import type { BoxContainerBreakpoint, BoxDirection } from '~/types/Box';

export const validateContainerBreakpoint = (
	value: BoxContainerBreakpoint,
	props: { direction?: BoxDirection }
): boolean => {
	if (value && props.direction !== 'container-responsive') {
		console.warn(
			'[Box] "containerBreakpoint" can only be used with direction="container-responsive".' +
				`Current direction: "${props.direction ?? 'responsive'}".`
		);
		return false;
	}
	return true;
};
