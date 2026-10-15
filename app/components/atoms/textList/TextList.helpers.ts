import { textListOrderedMarkerOptions, textListUnorderedMarkerOptions } from './TextList.constants';
import type { TextListMarker } from './TextList.types';

type TextListElement = 'ul' | 'ol';

export const validateMarker = (value: TextListMarker, props: { as?: TextListElement }): boolean => {
	const listType = props.as ?? 'ul';
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
