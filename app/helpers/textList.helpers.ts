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
