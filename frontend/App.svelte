<script type="ts">
    import { Router, Link, Route } from "svelte-routing";

    import Authorization from "./components/Authorization.svelte";
    import List from "./components/list.svelte";
    import CalendarPage from "./pages/CalendarPage.svelte";
    import * as api from "./util/api";
</script>

{#await api.get("checkLogin") then user}
    {#if !user.login}
        <Authorization />
    {:else}
        {user.login}
        <button
            on:click={async () => {
                await fetch("/logout");
                location.reload();
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
                {#await api.get("groups") then groups}
                    <CalendarPage {groups} />
                {/await}
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
