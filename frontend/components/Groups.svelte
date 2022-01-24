<script type="ts">
    import { setContext } from "svelte";
    import { writable } from "svelte/store";
    import * as api from "../util/api";

    export let groups: any;
    let name: string;

    const currentGroup = writable(groups[0]);
    setContext("group", currentGroup);
</script>

<ul>
    {#each groups as group}
        <li>
            <button
                on:click={() => {
                    currentGroup.set(group);
                }}>{group.name}</button
            >
            <input
                type="text"
                value={`${location.protocol}//${location.host}/group/${group.token}`}
                disabled
            />
        </li>
    {/each}
</ul>
<form
    on:submit|preventDefault={async () => {
        const token = await api.post("add-group", {
            name,
        });
 
        groups = [
            ...groups,
            {
                name,
                token,
            },
        ];
    }}
>
    <input type="text" bind:value={name} />
    <button type="submit">Dodaj grupę</button>
</form>
<slot />
