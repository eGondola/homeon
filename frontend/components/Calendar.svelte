<script type="ts">
    import type { Writable } from "svelte/store";
    import { getContext } from "svelte";
    import DateText from "./DateText.svelte";
    import * as api from "../util/api";
    import { addDays } from "../util/date";

    export let showPlan: Writable<Plan | false>;
    export let date: Date;

    const group = getContext<any>("group");

    let plans: Plans = $group.plans.map(({ start, end, text }: any) => ({
        start: new Date(start),
        end: new Date(end),
        text,
    }));

    let popupShown = false;
    let innerWidth: number;
    let start = Date.now();
    let end = Date.now();
    let text = "";

    $: monday = getMonday(date);
    $: nextMonday = addDays(monday, 7);
    $: dayPlans = generateDayPlans(plans, monday, nextMonday).map((plans) => {
        plans.sort((left, right) => right.top - left.top);
        let columns: Rectangle[][] = [];
        while (plans.length > 0) {
            let currentColumn: Rectangle[] = [takeRectangle(plans.length - 1)];
            for (let i = plans.length - 1; i >= 0; --i) {
                const { top } = plans[i];
                if (1 - top < currentColumn[currentColumn.length - 1].bottom) {
                    currentColumn.push(takeRectangle(i));
                }
            }
            columns.push(currentColumn);
        }
        columns.forEach((currentColumn, i) => {
            for (let j = i + 1; j < columns.length; ++j) {
                for (const left of currentColumn) {
                    if (j > i + left.width) {
                        continue;
                    }

                    if (
                        columns[j].every(
                            (right) =>
                                right.bottom < 1 - left.top &&
                                left.bottom > 1 - right.top
                        )
                    ) {
                        ++left.width;
                    }
                }
            }
        });
        return columns;

        type Rectangle = DayPlan & {
            width: number;
        };

        function takeRectangle(index: number) {
            const [plan] = plans.splice(index, 1);
            return {
                ...plan,
                width: 1,
            };
        }
    });

    $: {
        let arr = document.querySelectorAll<HTMLElement>(".day");
        let tab = document.querySelectorAll<HTMLElement>(".day-header");
        if (innerWidth < 800) {
            let day = date.getDay() ? date.getDay() - 1 : 6;
            for (let i = 0; i < arr.length; i++) {
                if (day != i) {
                    arr[i].style.display = "none";
                    tab[i].style.display = "none";
                } else {
                    arr[i].style.display = "flex";
                    tab[i].style.display = "block";
                }
            }
        } else {
            for (let i = 0; i < arr.length; i++) {
                arr[i].style.display = "flex";
                tab[i].style.display = "block";
            }
        }
    }

    function generateDayPlans(plans: Plans, weekBegin: Date, weekEnd: Date) {
        const dayPlans: DayPlan[][] = Array.from({ length: 7 }, () => []);
        for (const { start, end, text } of plans.filter(isThisWeek)) {
            let i = start <= monday ? 0 : start.getDay() - 1;
            let current: Date;
            do {
                current = addDays(monday, i);
                dayPlans[i].push({
                    top: isSameDate(current, start)
                        ? getFractionOfDayPassed(start)
                        : 0,
                    bottom: isSameDate(current, end)
                        ? 1 - getFractionOfDayPassed(end)
                        : 0,
                    text,
                });
                ++i;
            } while (!isSameDate(current, end) && i < 7);
        }
        return dayPlans;

        function isThisWeek({ start, end }: Plan) {
            return (
                (start >= weekBegin && start <= weekEnd) ||
                (end >= weekBegin && end <= weekEnd) ||
                (start <= weekBegin && end >= weekEnd)
            );
        }
    }

    function generateHours() {
        const hours: string[] = [];
        for (let i = 0; i < 24; i++) {
            hours.push(i > 12 ? i - 12 + ` PM` : i + ` AM`);
        }
        return hours;
    }

    function getFractionOfDayPassed(date: Date) {
        const hours = date.getHours();
        const minutes = date.getMinutes();
        return (hours + minutes / 60) / 24;
    }

    function getMonday(date: Date) {
        return new Date(
            date.getFullYear(),
            date.getMonth(),
            date.getDay() == 0
                ? date.getDate() - 6
                : date.getDate() - date.getDay() + 1
        );
    }

    function isSameDate(first: Date, second: Date) {
        return (
            first.getFullYear() == second.getFullYear() &&
            first.getMonth() == second.getMonth() &&
            first.getDate() == second.getDate()
        );
    }

    const daysOfWeek = [
        "Poniedziałek",
        "Wtorek",
        "Środa",
        "Czwartek",
        "Piątek",
        "Sobota",
        "Niedziela",
    ];

    function PlanClick(text: string) {
        plans.forEach((plan) => {
            if (plan.text == text) {
                showPlan.set(plan);
                console.log(plan);
            }
        });
    }

    type DayPlan = {
        top: number;
        bottom: number;
        text: string;
    };

    type Plans = Plan[];

    type Plan = {
        start: Date;
        end: Date;
        text: string;
    };
</script>

<svelte:window bind:innerWidth />
<div class="calendar">
    <div class="calendar-header">
        <div class="date-texts">
            {#if innerWidth < 800}
                <DateText {date} />
            {:else}
                <DateText date={monday} />
                <br />
                <DateText date={nextMonday} />
            {/if}
        </div>
        <div class="days-header">
            {#each daysOfWeek as day}
                <div class="day-header">{day}</div>
            {/each}
        </div>
    </div>
    <div class="calendar__body">
        <div class="hours">
            {#each generateHours() as hour}
                <div class="hour">{hour}</div>
            {/each}
        </div>
        <div class="week">
            {#each dayPlans as columns}
                <div
                    class="day"
                    on:click={() => {
                        popupShown = true;
                    }}
                >
                    {#each columns as column}
                        <div class="column">
                            {#each column as { top, bottom, width, text }}
                                <div
                                    on:click|stopPropagation={() =>
                                        PlanClick(text)}
                                    class="plan"
                                    style="top: {top * 100}%; bottom: {bottom *
                                        100}%; width: {width *
                                        100}%; background: {`hsl(${
                                        ([...text].reduce(
                                            (total, char) =>
                                                total * char.charCodeAt(0),
                                            1
                                        ) *
                                            16807) %
                                        360
                                    }, 100%, 70%)`}"
                                >
                                    {text}
                                </div>
                            {/each}
                        </div>
                    {/each}
                </div>
            {/each}
        </div>
    </div>
</div>
<div class="popup" class:shown={popupShown}>
    <form
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
        <input type="datetime-local" bind:value={start} />
        <input type="datetime-local" bind:value={end} />
        <input type="text" bind:value={text} />
        <button type="submit">Dodaj plan</button>
    </form>
    <button
        type="button"
        on:click={() => {
            popupShown = false;
        }}>X</button
    >
</div>

<style lang="scss">
    @import "../styles/variables.scss";

    .popup {
        display: none;

        &.shown {
            display: block;
        }
    }

    .calendar {
        font-size: 5vmin;
        @media (min-width: 800px) {
            font-size: 3vmin;
        }

        font-variant: small-caps;

        .calendar-header {
            display: flex;
            flex-flow: row;

            .date-texts {
                width: 15vmin;
                @media (min-width: 800px) {
                    width: 10vmin;
                }
                text-align: center;
            }

            .days-header {
                flex: 1;
                display: flex;
                flex-flow: row;
                justify-content: center;
                text-align: center;

                @media (min-width: 800px) {
                    > div {
                        flex: 1;
                    }
                }
            }
        }

        .calendar__body {
            display: flex;
            flex-flow: row;

            .hours {
                width: 15vmin;
                @media (min-width: 800px) {
                    width: 10vmin;
                }

                .hour {
                    margin: 1vmin;
                    text-align: center;
                    font-size: 3.5vmin;
                    @media (min-width: 800px) {
                        font-size: 2.5vmin;
                    }
                }
            }

            .week {
                flex: 1;

                display: flex;
                flex-flow: row;

                .day {
                    flex: 1;
                    border-left: 0.2vmin solid $s-color-light;
                    text-align: center;
                    margin-left: 0.2vmin;
                    margin-right: 0.2vmin;
                    padding: 2.5vmin;
                    justify-content: space-between;
                    align-items: stretch;

                    .column {
                        flex: 1;
                        position: relative;

                        .plan {
                            background-color: aqua;
                            position: absolute;
                            width: 100%;
                        }
                    }
                }
            }
        }
    }
</style>
