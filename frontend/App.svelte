<script type="ts">
    import Everything from "./Everything.svelte";
    import Authorization from "./components/Authorization.svelte";
    import * as api from "./util/api";
    import { setContext } from "svelte";
    import { writable } from "svelte/store";

    let u = writable("");
    setContext("user", u);
    api.get("checkLogin").then(res => $u = res)
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

<style lang="scss">
    @import "./styles/variables.scss";

    :global(*, ::before, ::after) {
        box-sizing: border-box;
    }

    :global(input:not([type=datetime-local]), button) {
        font-family: inherit;
    }
</style>
