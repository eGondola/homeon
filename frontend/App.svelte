<script type="ts">
    import Everything from "./Everything.svelte";
    import Authorization from "./components/Authorization.svelte";
    import * as api from "./util/api";
</script>


{#await api.get("checkLogin") then user}
    {#if !user.login}
        <Authorization />
    {:else}
        {#await api.get("groups") then groups}
            <Everything {groups} />
        {/await}
    {/if}
{/await}

<style>
:global(*, ::before, ::after) {
    box-sizing: border-box;
}
</style>
