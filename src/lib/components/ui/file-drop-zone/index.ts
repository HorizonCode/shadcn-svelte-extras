import FileDropZone, {
	type FileRejectedReason,
	type FileDropZoneProps
} from './file-drop-zone.svelte';

export const displaySize = (bytes: number): string => {
	if (bytes < KILOBYTE) return `${bytes.toFixed(0)} B`;

	if (bytes < MEGABYTE) return `${(bytes / KILOBYTE).toFixed(0)} KB`;

	if (bytes < GIGABYTE) return `${(bytes / MEGABYTE).toFixed(0)} MB`;

	return `${(bytes / GIGABYTE).toFixed(0)} GB`;
};

// Utilities for working with file sizes
export const BYTE = 1;
export const KILOBYTE = 1_000;
export const MEGABYTE = 1_000_000;
export const GIGABYTE = 1_000_000_000;

// utilities for limiting accepted files
export const ACCEPT_IMAGE = 'image/*';
export const ACCEPT_VIDEO = 'video/*';
export const ACCEPT_AUDIO = 'audio/*';

export { FileDropZone, type FileRejectedReason, type FileDropZoneProps };
