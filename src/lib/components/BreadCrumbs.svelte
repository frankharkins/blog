<script lang="ts">
  import type { URL } from "url"
  export let url: URL
  const pathParts = url.pathname.split("/").slice(1).filter(x => x !== '')
</script>

<style>
.container {
  --color-link: var(--color-body);
  font-size: .8rem;
}
</style>

<div class="container">
  {#each pathParts as part, index}
    <a href={"../".repeat(pathParts.length - index - 1)}>{part}</a>
    {#if index < pathParts.length-1}
      /&nbsp;
    {/if}
  {/each}
</div>
