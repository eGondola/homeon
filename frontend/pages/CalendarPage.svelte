<link rel="stylesheet" href="fontello/css/fontello.css">
<style lang="scss">
    @import "../styles/variables.scss";

    #arrows {
        display: flex;
        flex-flow: row;

        > div {
            flex: 1;
            
            display: flex;
            align-items: center;
            padding-top: 2.5vmin;
            padding-bottom: 2.5vmin;

            &:nth-child(1) {
                justify-content: right;
                padding-right: 2.5vmin;

                button {
                    margin-right: 1.5vmin;
                }
            }

            &:nth-child(2) {
                padding-left: 2.5vmin;

                button {
                    margin-left: 1.5vmin;
                }
            }

            button {
                border: none;
                border-radius: 50%;
                height: 13vmin;
                width: 13vmin;

                background-color: $s-color;
                font-size: 5vmin;
                color: white;
            }
        }
    }
</style>

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
<div id="arrows">
    <div>
        <button><i class="icon-left-open"></i></button>
        <button
            on:click={() => {
                if(innerWidth < 800)
                    date = addDays(date, -1);
                else
                    date = addDays(date, -7);
            }}><i class="icon-left-dir"></i></button
        >
    </div>
    <div>
        <button
            on:click={() => {
                if(innerWidth < 800)
                    date = addDays(date, 1);
                else
                    date = addDays(date, 7);
            }}><i class="icon-right-dir"></i></button
        >
        <button><i class="icon-right-open"></i></button>
    </div>
</div>
<Calendar {plans} {date} />
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
