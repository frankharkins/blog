<script>
  export let title = '';
  export let description = '';
  export let url = '';
  export let date = '';
</script>

<a href="{url}">
  <div>
    <div class="date">{date}</div>
    <h2>{title}</h2>
    <p>{description}</p>
  </div>
</a>

<style lang="scss">
  a {
    text-decoration: none;
    color: unset;
    &:hover, &:focus {
      font-weight: normal;
      outline-offset: 1rem;
    }
  }

  h2 {
    margin-top: .5rem;
  }

  .date {
    font-size: .8rem;
    margin-top: 3rem;
  }

  p {
    margin-bottom: 3rem;
  }
</style>
