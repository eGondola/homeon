<script type="ts">
    import Calendar from "../components/Calendar.svelte";
    import { addDays } from "../util/date";
    import * as api from "../util/api";

    export let groups: any;

    $: currentGroup = groups[0];

    $: plans = currentGroup.plans.map(({ start, end, text }: any) => ({
        start: new Date(start),
        end: new Date(end),
        text,
    }));

    let date = new Date("2021-12-12");
    let groupName = "";
    let start = Date.now();
    let end = Date.now();
    let text = "";
    let innerWidth: number;
</script>

<svelte:window bind:innerWidth />
<Calendar {plans} {date} />
<button
    on:click={() => {
        if(innerWidth < 800)
            date = addDays(date, -1);
        else
            date = addDays(date, -7);
    }}>←</button
>
<button
    on:click={() => {
        if(innerWidth < 800)
            date = addDays(date, 1);
        else
            date = addDays(date, 7);
    }}>→</button
>
<form
    on:submit|preventDefault={() => {
        api.post("add-group", {
            name: groupName,
        });
    }}
>
    <input type="text" bind:value={groupName} />
    <button type="submit">Dodaj grupę</button>
</form>
<ul>
    {#each groups as group}
        <li>
            <button
                on:click={() => {
                    currentGroup = group
                }}>{group.name}</button
            >
            <form
                on:submit|preventDefault={() => {
                    api.post("add-plan", {
                        token: group.token,
                        plan: {
                            start,
                            end,
                            text,
                        },
                    });
                }}
            >
                <input type="datetime-local" bind:value={start} />
                <input type="datetime-local" bind:value={end} />
                <input type="text" bind:value={text} />
                <button type="submit">Dodaj plan</button>
            </form>
            <input type="text" value={`${location.protocol}//${location.host}/group/${group.token}`} disabled>
        </li>
    {/each}
</ul>
