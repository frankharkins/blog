<script lang="ts">
  export let recordingName: string;
  export let size: number[];
</script>

<!--
  Warning: I've hard-coded the basename (`/blog`) on each path; probably
  something silly I'm doing but it's the only way I can get it to work on
  GitHub pages.
-->
<svelte:head>
  {@html `
    <script src="/blog/js/asciinema-player.min.js"></script>
    <link rel="stylesheet" type="text/css" href="/blog/css/asciinema-player.css" />
    <script>
      window.addEventListener('load', () => {
        AsciinemaPlayer.create(
          '/blog/asciinema/${recordingName}.cast',
          document.getElementById('asciinema-player-${recordingName}'),
          { 
            theme: 'tango',
            rows: ${size[0]},
            cols: ${size[1]}
          }
        )
      },
      false)
    </script>
  `}
</svelte:head>

<div class="asciinema" id="asciinema-player-{recordingName}"></div>

<style>
  .asciinema {
    border: 1px solid var(--color-tint)
  }
</style>
