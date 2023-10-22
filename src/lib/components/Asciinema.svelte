<script lang="ts">
  export let recordingName: string;
  export let size: number[];
</script>

<svelte:head>
  <script src="/js/asciinema-player.min.js"></script>
  <link rel="stylesheet" type="text/css" href="/css/asciinema-player.css" />
  {@html `<script>
    window.addEventListener('load', () => {
      AsciinemaPlayer.create(
        '/asciinema/${recordingName}.cast',
        document.getElementById('asciinema-player-${recordingName}'),
        { 
          theme: 'tango',
          rows: ${size[0]},
          cols: ${size[1]}
        }
      )
    },
    false)
  </script>`}
</svelte:head>

<div class="asciinema" id="asciinema-player-{recordingName}"></div>

<style>
  .asciinema {
    border: 1px solid var(--color-tint)
  }
</style>
