<script lang="ts">
	import type { WithChildren } from "bits-ui";

    let { children }: WithChildren = $props()
</script>

{@render children?.()}