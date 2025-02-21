<script lang="ts">
	import * as PDFViewer from "$lib/components/ui/pdf-preview";
	import { onMount } from "svelte";
</script>

<PDFViewer.Root>
	<PDFViewer.Preview src="/demos/Brochure.pdf"/>
</PDFViewer.Root>