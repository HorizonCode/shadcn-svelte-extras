<script lang="ts">
	import * as pdfjs from 'pdfjs-dist';
	import { onMount } from 'svelte';

	type Props = {
		src: string;
	};

	let { src }: Props = $props();

	let canvas = $state<HTMLCanvasElement>();

	console.log(src);

	pdfjs.GlobalWorkerOptions.workerSrc = new URL(
		'pdfjs-dist/build/pdf.worker.mjs',
		import.meta.url
	).toString();

	onMount(async () => {
		if (!canvas) return;
		const loadingTask = pdfjs.getDocument(src);

		const pdf = await loadingTask.promise;

		const page = await pdf.getPage(1);

		const viewport = page.getViewport({ scale: 1 });

		const outputScale = window.devicePixelRatio || 1;

		const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;

		canvas.width = Math.floor(viewport.width * outputScale);
		canvas.height = Math.floor(viewport.height * outputScale);
		canvas.style.width = Math.floor(viewport.width) + 'px';
		canvas.style.height = Math.floor(viewport.height) + 'px';

		const transform = outputScale !== 1 ? [outputScale, 0, 0, outputScale, 0, 0] : undefined;

		const renderContext = {
			canvasContext: ctx,
			transform: transform,
			viewport: viewport
		};

		page.render(renderContext);
	});
</script>

<canvas bind:this={canvas}> </canvas>
