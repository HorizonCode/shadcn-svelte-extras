<script lang="ts">
	import { Kbd } from '$lib/components/ui/kbd';
	import { Button } from '$lib/components/ui/button';
	import { Search, Command } from 'lucide-svelte';
	import { cn } from '$lib/utils/utils';
	import { commandContext } from '$lib/context';

	type Props = {
		class?: string;
	};

	let { class: className }: Props = $props();

	const commandState = commandContext.get();
</script>

<Button
	variant="outline"
	class={cn('flex w-full place-items-center justify-between px-2', className)}
	onclick={commandState.setTrue}
>
	<span class="flex place-items-center gap-2 text-muted-foreground">
		<Search class="inline size-4" />
		Search
	</span>
	<Kbd size="sm" variant="secondary">
		<Command class="inline" />
		+ K
	</Kbd>
</Button>
