import { textListOrderedMarkerOptions, textListUnorderedMarkerOptions } from './TextList.constants';
import type { TextListMarker, TextListType } from './TextList.types';

export const validateMarker = (value: TextListMarker, props: { type?: TextListType }): boolean => {
	const listType = props.type ?? 'ul';
	const allowedMarkers = [
		...(listType === 'ol' ? textListOrderedMarkerOptions : textListUnorderedMarkerOptions)
	];

	if (!allowedMarkers.includes(value)) {
		console.warn(
			`[TextList] marker "${value}" is not valid for type "${listType}". ` +
				`Allowed markers: ${allowedMarkers.join(', ')}`
		);
		return false;
	}
	return true;
};
