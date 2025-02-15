import type { ReadableBoxedValues, WritableBoxedValues } from '$lib/utils/box';
import { Context } from 'runed';
import type { CropArea, DispatchEvents } from 'svelte-easy-crop';
import { getCroppedImg } from './utils';

export type ImageCropperRootProps = WritableBoxedValues<{
	src: string;
	open: boolean;
}> & {
	onCropped: (url: string) => void;
};

class ImageCropperRootState {
	#createdUrls = $state<string[]>([]);
	tempUrl = $state<string>();
	pixelCrop = $state<CropArea>();

	constructor(readonly opts: ImageCropperRootProps) {}

	onUpload(file: File) {
		this.tempUrl = URL.createObjectURL(file);
		this.#createdUrls.push(this.tempUrl);
		this.opts.open.current = true;
	}

	onCancel() {
		this.tempUrl = undefined;
		this.opts.open.current = false;
		this.pixelCrop = undefined;
	}

	async onCrop() {
		if (!this.pixelCrop || !this.tempUrl) return;

		this.opts.src.current = await getCroppedImg(this.tempUrl, this.pixelCrop);

		this.opts.open.current = false;

		this.opts.onCropped(this.opts.src.current);
	}

	dispose() {
		for (const url of this.#createdUrls) {
			URL.revokeObjectURL(url);
		}
	}
}

export type ImageCropperTriggerProps = ReadableBoxedValues<{
	id?: string;
}>;

class ImageCropperTriggerState {
	constructor(
		readonly rootState: ImageCropperRootState,
		readonly opts: ImageCropperTriggerProps
	) {}

	onUpload(file: File) {
		this.rootState.onUpload(file);
	}
}

class ImageCropperDialogState {
	constructor(readonly rootState: ImageCropperRootState) {}
}

class ImageCropperCropperState {
	constructor(readonly rootState: ImageCropperRootState) {
		this.onCropComplete = this.onCropComplete.bind(this);
	}

	onCropComplete(e: DispatchEvents['cropcomplete']) {
		this.rootState.pixelCrop = e.pixels;
	}
}

class ImageCropperCropState {
	constructor(readonly rootState: ImageCropperRootState) {
		this.onclick = this.onclick.bind(this);
	}

	onclick() {
		this.rootState.onCrop();
	}
}

class ImageCropperCancelState {
	constructor(readonly rootState: ImageCropperRootState) {
		this.onclick = this.onclick.bind(this);
	}

	onclick() {
		this.rootState.onCancel();
	}
}

const ImageCropperRootContext = new Context<ImageCropperRootState>('ImageCropper.Root');

export const useImageCropperRoot = (props: ImageCropperRootProps) => {
	return ImageCropperRootContext.set(new ImageCropperRootState(props));
};

export const useImageCropperTrigger = (props: ImageCropperTriggerProps) => {
	const rootState = ImageCropperRootContext.get();

	return new ImageCropperTriggerState(rootState, props);
};

export const useImageCropperDialog = () => {
	const rootState = ImageCropperRootContext.get();

	return new ImageCropperDialogState(rootState);
};

export const useImageCropperCropper = () => {
	const rootState = ImageCropperRootContext.get();

	return new ImageCropperCropperState(rootState);
};

export const useImageCropperCrop = () => {
	const rootState = ImageCropperRootContext.get();

	return new ImageCropperCropState(rootState);
};

export const useImageCropperCancel = () => {
	const rootState = ImageCropperRootContext.get();

	return new ImageCropperCancelState(rootState);
};
