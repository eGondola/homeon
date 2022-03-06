<script type="ts">
    import Topbar from "./Topbar.svelte";
</script>

<div class="popup">
    <slot {Topbar} />
</div>

<style lang="scss">
    .popup {
        position: fixed;

        height: 100%;
        width: 100%;

        @media (min-width: 800px) {
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%);

            height: 60%;
            width: 80%;
        }

        padding: 5vmin;
        background-color: white;
    }
</style>
