import type { TextListMarker, TextListType } from '~/types/TextList';
import { unorderedMarkers, orderedMarkers } from '~/types/TextList';

export const validateMarker = (value: TextListMarker, props: { type?: TextListType }): boolean => {
	const listType = props.type ?? 'ul';
	const allowedMarkers = listType === 'ol' ? orderedMarkers : unorderedMarkers;

	if (!allowedMarkers.includes(value)) {
		console.warn(
			`[TextList] marker "${value}" is not valid for type "${listType}". ` +
				`Allowed markers: ${allowedMarkers.join(', ')}`
		);
		return false;
	}
	return true;
};

export const validateReversed = (value: boolean, props: { type?: TextListType }): boolean => {
	if (value && props.type !== 'ol') {
		console.warn('[TextList] "reversed" can only be used with type "ol".');
		return false;
	}
	return true;
};
