<script type="ts">
    import CloseButton from "./CloseButton.svelte";

    export let closePopup: () => void;
</script>

<div class="topbar">
    <CloseButton click={closePopup} />
    <slot />
</div>

<style lang="scss">
    .topbar {
        display: flex;
        justify-content: space-between;
        padding-bottom: 10vmin;
    }
</style>
