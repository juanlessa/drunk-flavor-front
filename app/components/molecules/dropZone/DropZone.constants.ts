import { DropZoneAcceptEnum, type DropZoneAccept } from './DropZone.types';

export const dropZoneAcceptOptions = Object.keys(DropZoneAcceptEnum) as DropZoneAccept[];

export const dropZoneImageAcceptOptions: DropZoneAccept[] = [
	'image/jpeg',
	'image/png',
	'image/webp',
	'image/gif',
	'image/svg+xml',
	'image/bmp',
	'image/tiff',
	'image/avif'
];
