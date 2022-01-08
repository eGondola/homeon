<script type="ts">
    import Calendar from "./components/Calendar.svelte";
    import { Router, Link, Route } from "svelte-routing";

    import Authorization from "./components/Authorization.svelte";
    import List from "./components/list.svelte";
    import { addDays } from "./util/date";

    let plans = [
        {
            start: new Date("2021-12-15 12:54"),
            end: new Date("2021-12-15 23:59"),
            text: "nic nie robienie",
        },
        {
            start: new Date("2021-12-11 5:00"),
            end: new Date("2021-12-14 10:00"),
            text: "Też nic nie robienie",
        },
        {
            start: new Date("2021-12-16 4:00"),
            end: new Date("2021-12-16 13:00"),
            text: "bruh",
        },
        {
            start: new Date("2021-12-18 13:00"),
            end: new Date("2021-12-20 23:00"),
            text: "was",
        },
        {
            start: new Date("2022-01-08 13:00"),
            end: new Date("2022-01-08 20:30"),
            text: "Volper ty kurwooooo"
        }
    ];
    let date = new Date("2021-12-12");
</script>

{#await fetch("/checkLogin").then((response) => response.json()) then user}
    {#if !user.login}
        <Authorization />
    {:else}
        {user.login}
        <button
            on:click={() => {
                fetch("/logout");
                window.location.reload();
            }}>Wyloguj</button
        >
        <Router>
            <h1>Hello world!</h1>
            <nav>
                <ul>
                    <li>
                        <Link to="/">Kalendarz</Link>
                    </li>
                    <li>
                        <Link to="/test">Test</Link>
                    </li>
                </ul>
            </nav>
            <Route path="/">
                <Calendar {plans} {date} />
                <button
                    on:click={() => {
                        date = addDays(date, -7);
                    }}>←</button
                >
                <button
                    on:click={() => {
                        date = addDays(date, 7);
                    }}>→</button
                >
            </Route>
            <nav>
                <Route path="/test">
                    <List />
                </Route>
            </nav>
            <Route>
                <p>404 Not Found</p>
            </Route>
        </Router>
    {/if}
{/await}

<style>
    :global(*, ::before, ::after) {
        box-sizing: border-box;
    }
</style>
