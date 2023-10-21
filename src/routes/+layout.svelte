<svelte:head>
  <title>Frank Harkins / blog</title>
</svelte:head>

<header>
  <BreadCrumbs url={$page.url} />
</header>

<main>
  <slot />
</main>

<footer>
</footer>

<script lang="ts">
  import "$lib/styles/style.css"
  import "$lib/styles/syntax.css"
  import BreadCrumbs from "$lib/components/BreadCrumbs.svelte";
  import { page } from '$app/stores';
</script>
