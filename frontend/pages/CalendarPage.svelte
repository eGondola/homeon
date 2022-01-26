<script type="ts">
    import Calendar from "../components/Calendar.svelte";
    import { addDays } from "../util/date";
    import { writable } from "svelte/store";
    import DateText from "../components/DateText.svelte"

    let date = new Date();
    let innerWidth: number;
    let showPlan = writable<false | Plan>(false);
    type Plan = {
        start: Date;
        end: Date;
        text: string;
    };
</script>

<svelte:window bind:innerWidth />
<div id="arrows">
    <div>
        <button
            on:click={() => {
                date = addDays(date, -7);
            }}><i class="icon-left-open" /></button
        >
        <button
            on:click={() => {
                if (innerWidth < 800) date = addDays(date, -1);
                else date = addDays(date, -7);
            }}><i class="icon-left-dir" /></button
        >
    </div>
    <div>
        <button
            on:click={() => {
                if (innerWidth < 800) date = addDays(date, 1);
                else date = addDays(date, 7);
            }}><i class="icon-right-dir" /></button
        >
        <button
            on:click={() => {
                date = addDays(date, 7);
            }}><i class="icon-right-open" /></button
        >
    </div>
</div>

<Calendar {date} {showPlan}/> 
{#if $showPlan}
<div class="popup">
    <!-- <DateText date={$showPlan.start} /><br>
    <DateText date={$showPlan.end} /><br>
    {$showPlan.text}
    <button on:click={() => {showPlan.set(false)}}>cofnij</button> -->

    <div>
        <div class="exit_save">
            <div class="popup_exit">
                <button type="button" on:click={() => {
                    showPlan.set(false)
                }}><i class="icon-x" /></button>
            </div>
        </div>
        <div class="popup_date">
            <DateText date={$showPlan.start} />
            <DateText date={$showPlan.end} />
            {$showPlan.text}
        </div>
        <!-- <form
            on:submit|preventDefault={() => {
                api.post("add-plan", {
                    token: $group.token,
                    plan: {
                        start,
                        end,
                        text,
                    },
                });
                plans = [
                    ...plans,
                    {
                        start: new Date(start),
                        end: new Date(end),
                        text,
                    },
                ];
            }}
        >
            <div class="popup_date">
                <input type="datetime-local" bind:value={start} />
                <input type="datetime-local" bind:value={end} />
            </div>
            <div class="popup_title">
                <input type="text" bind:value={text} />
            </div>
        </form> -->
    </div>
</div>
{/if}

<style lang="scss">
    @import "../styles/variables.scss";
    @import "../styles/popup.scss";
    
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
