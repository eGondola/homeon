<script type="ts">
    import type { Writable } from "svelte/store";
    import { getContext } from "svelte";
    import * as api from "../util/api";
    import {
        addDays,
        getFractionOfDayPassed,
        getMonday,
        isSameDate,
        makeDateText,
        padZero,
    } from "../util/date";
    import type { Group, SerializedPlan } from "../../common/types";
    import AddPlanPopup from "./AddPlanPopup.svelte";
    import PlanPopup from "./PlanPopup.svelte";

    export let date: Date;

    let selectedPlan: Plan | false = false;

    const group = getContext<Writable<Group>>("group");

    $: plans = $group.plans.map(deserializePlan);

    let addPlanPopupShown = false;
    let innerWidth: number;

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

    function generateDayPlans(plans: Plan[], weekBegin: Date, weekEnd: Date) {
        const dayPlans: DayPlan[][] = Array.from({ length: 7 }, () => []);
        for (const { start, end, text, weekDays } of plans.filter(isThisWeek)) {
            if (weekDays) {
                weekDays.forEach((repeats, weekDay) => {
                    if (!repeats) return;
                    const today = addDays(monday, weekDay);
                    const endDay = addDays(
                        today,
                        getDaysBetweenDates(start, end)
                    );
                    generateDayPlan({
                        start: new Date(
                            today.getFullYear(),
                            today.getMonth(),
                            today.getDate(),
                            start.getHours(),
                            start.getMinutes()
                        ),
                        end: new Date(
                            endDay.getFullYear(),
                            endDay.getMonth(),
                            endDay.getDate(),
                            end.getHours(),
                            end.getMinutes()
                        ),
                        text,
                    });
                });
            } else {
                generateDayPlan({ start, end, text });
            }
        }
        return dayPlans;

        function isThisWeek({ start, end, weekDays }: Plan) {
            return (
                weekDays ||
                (start >= weekBegin && start <= weekEnd) ||
                (end >= weekBegin && end <= weekEnd) ||
                (start <= weekBegin && end >= weekEnd)
            );
        }

        function generateDayPlan({
            start,
            end,
            text,
        }: {
            start: Date;
            end: Date;
            text: string;
        }) {
            let i = start <= monday ? 0 : (start.getDay() - 1 + 7) % 7;
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

        function getDaysBetweenDates(start: Date, end: Date) {
            const startDay = start.getDay();
            const endDay = end.getDay();
            return endDay - startDay + (startDay <= endDay ? 0 : 7);
        }
    }

    function generateHours() {
        return Array.from({ length: 24 }, (_, i) => `${padZero(i)}:00`);
    }

    function getPseudoRandomColor(text: string) {
        return `hsl(${
            ([...text].reduce((total, char) => total * char.charCodeAt(0), 1) *
                16807) %
            360
        }, 100%, 70%)`;
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

    function clickPlan(text: string) {
        plans.forEach((plan) => {
            if (plan.text == text) {
                selectedPlan = plan;
            }
        });
    }

    function deserializePlan({ start, end, ...rest }: SerializedPlan): Plan {
        return {
            start: new Date(start),
            end: new Date(end),
            ...rest,
        };
    }

    type DayPlan = {
        top: number;
        bottom: number;
        text: string;
    };

    type Plan = {
        start: Date;
        end: Date;
        text: string;
        weekDays?: boolean[];
    };
</script>

<svelte:window bind:innerWidth />
<div class="calendar">
    <div class="calendar__header">
        <div class="date-texts">
            {#if innerWidth < 800}
                {makeDateText(date)}
            {:else}
                {makeDateText(monday)}
                <br />
                {makeDateText(nextMonday)}
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
                        addPlanPopupShown = true;
                    }}
                >
                    {#each columns as column}
                        <div class="column">
                            {#each column as { top, bottom, width, text }}
                                {#if top < 1 && bottom < 1}
                                    <div
                                        on:click|stopPropagation={() =>
                                            clickPlan(text)}
                                        class="plan"
                                        style="top: {top *
                                            100}%; bottom: {bottom *
                                            100}%; width: calc({width *
                                            100}% - 0.5rem); background: {getPseudoRandomColor(
                                            text
                                        )}"
                                    >
                                        {text}
                                    </div>
                                {/if}
                            {/each}
                        </div>
                    {/each}
                </div>
            {/each}
        </div>
    </div>
</div>

{#if selectedPlan}
    <PlanPopup
        removePlan={async (plan) => {
            await api.post("remove-plan", [$group.token, plan]);
        }}
        plan={selectedPlan}
        closePopup={() => {
            selectedPlan = false;
        }}
    />
{/if}

{#if addPlanPopupShown}
    <AddPlanPopup
        {date}
        addPlan={async (plan) => {
            await api.post("add-plan", {
                token: $group.token,
                plan,
            });
            plans = [...plans, deserializePlan(plan)];
        }}
        closePopup={() => {
            addPlanPopupShown = false;
        }}
    />
{/if}

<style lang="scss">
    @import "../styles/variables.scss";

    .calendar {
        padding-top: 0.5rem;
        font-size: 5vmin;

        @media (min-width: 800px) {
            font-size: 3vmin;
        }

        &__header {
            border-top: 0.2vmin solid $s-color-light;
            display: flex;
            flex-flow: row;

            .date-texts {
                width: 15vmin;
                @media (min-width: 800px) {
                    width: 10vmin;
                }
                text-align: center;
                display: flex;
                flex-flow: column;
                justify-content: center;
            }

            .days-header {
                flex: 1;
                display: flex;
                flex-flow: row;
                justify-content: center;
                text-align: center;

                > .day-header {
                    padding-top: 1rem;
                    padding-bottom: 1rem;
                    border-left: 0.2vmin solid $s-color-light;
                    flex: 1;
                }
            }
        }

        &__body {
            border-top: 0.2vmin solid $s-color-light;
            border-bottom: 0.2vmin solid $s-color-light;
            display: flex;
            flex-flow: row;

            .hours {
                padding: 1rem 0;
                width: 15vmin;
                @media (min-width: 800px) {
                    width: 10vmin;
                }

                .hour {
                    margin: 1vmin;
                    text-align: center;
                    font-size: 3.5vmin;
                    min-height: 1.85rem;
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
                    padding: 1rem 0.5rem 1rem 0;
                    flex: 1;
                    border-left: 0.2vmin solid $s-color-light;
                    text-align: center;
                    justify-content: space-between;
                    align-items: stretch;

                    .column {
                        flex: 1;
                        position: relative;

                        .plan {
                            padding: 0.2rem;
                            border-radius: 0.5rem;
                            background-color: aqua;
                            position: absolute;
                            transform: translate(0.5rem);
                            overflow: hidden;
                            white-space: nowrap;
                            text-overflow: ellipsis;
                        }
                    }
                }
            }
        }
    }
</style>
