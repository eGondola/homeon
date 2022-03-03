<script type="ts">
    export let click: () => void;
</script>

<button type="button" on:click={click}><i class="icon-x" /></button>

<style lang="scss">
    @use "../styles/variables.scss" as *;

    button {
        font-size: 7vmin;

        border: none;
        background-color: white;
        color: $p-color;
    }
</style>
