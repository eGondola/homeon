<style lang="scss">
    @import "./styles/variables.scss";

    :global(*, ::before, ::after) {
        box-sizing: border-box;
    }

    #home {
        height: 100%;
        display: flex;
        flex-flow: column;

        #user_profile {
            display: flex;
            flex-flow: row;
            padding: 4vmin;

            background-color: $p-color-dark;

            > div {
                flex: 1;

                &:nth-child(1) {
                    display: flex;
                    
                    > div {
                        display: flex;
                        flex-flow: column;
                        align-items: center;
                        justify-content: left;

                        font-variant: small-caps;
                        color: white;

                        button {
                            border: none;
                            border-radius: 2vmin;
                            
                            padding: 3vmin 7.5vmin;
                            margin: 1.5vmin;

                            box-shadow: -0.5vmin -0.5vmin 1vmin 0vmin #00000040, 0.5vmin 0.5vmin 1vmin 0vmin #00000040;
                            
                            background-color: $s-color-dark;
                            color: white;
                            font-size: 3vmin;
                            text-transform: lowercase;
                            font-variant: small-caps;
                        }
                    }
                }

                &:nth-child(2) {
                    display: flex;
                    justify-content: right;

                    #home {
                        width: 10vmin;
                        background-repeat: no-repeat;
                        background-position: center;
                        background-image: url('icons/home.png');
                        background-size: 90%;
                    }
                }
            }
        }

        #info_block {
            flex: 1;
            display: flex;
            align-items: center;
            justify-content: center;

            > div {
                flex: 1;
                display: flex;
                flex-flow: column;

                height: 40vmin;
                > div {
                    flex: 1;
                    margin: 1vmin 4vmin 1vmin;

                    border-radius: 2vmin;
                    background-color: $p-color;
                }
            }
        }

        #navigation {
            flex: 2.5;
            display: flex;
            align-items: center;

            > div {
                flex: 1;
                display: flex;
                flex-flow: column;

                > div {
                    flex: 1;
                    
                    display: flex;
                    flex-flow: row;
                    align-items: center;
                    justify-content: center;

                    padding-top: 4vmin;
                    padding-bottom: 4vmin;

                    > div {
                        height: 35vmin;
                        width: 90vmin;

                        display: flex;
                        flex-flow: row;
                        justify-content: center;
                        
                        > a {
                            display: contents;

                            > div {
                                flex: 1;
                                background-color: $p-color;
                                border-radius: 2vmin;

                                background-repeat: no-repeat;
                                background-position: center;
                            }
                        }

                        #home_menage {
                            margin-left: 2.5vmin;
                            margin-right: 4vmin;
                            background-image: url('icons/home_menage.png');
                            background-size: 40%;
                        }

                        #plans {
                            margin-left: 4vmin;
                            margin-right: 2.5vmin;
                            background-image: url('icons/plans.png');
                            background-size: 40%;
                        }

                        #shopping_list {
                            margin-left: 2.5vmin;
                            margin-right: 2.5vmin;
                            background-image: url('icons/shopping_list.png');
                            background-size: 18%;
                        }

                        #household_duties {
                            margin-left: 2.5vmin;
                            margin-right: 2.5vmin;
                            background-image: url('icons/clean.png');
                            background-size: 18%;
                        }
                    }
                }
            }
        }
    }
</style>
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
        <Router>
            <div id="home">
                <div id="user_profile">
                    <div>
                        <div>
                            {user.login}
                            <button
                                on:click={() => {
                                    fetch("/logout");
                                    window.location.reload();
                                }}>Wyloguj</button
                            >
                        </div>
                    </div>
                    <div>
                        <a href="/"><div id="home"></div></a>
                    </div>
                </div>
                <Route path="/">
                    <div id="info_block">
                        <div>
                            <div></div>
                            <div></div>
                        </div>
                    </div>
                
                    <div id="navigation">
                        <div>
                            <div>
                                <div>
                                    <a href="/home_menage"><div id="home_menage"></div></a>
                                    <a href="/plans"><div id="plans"></div></a>
                                </div>
                            </div>
                            <div>
                                <div>
                                    <a href="/shopping_list"><div id="shopping_list"></div></a>
                                </div>
                            </div>
                            <div>
                                <div>
                                    <a href="/household_duties"><div id="household_duties"></div></a>
                                </div>
                            </div>
                        </div>
                    </div>
                </Route>

                <Route path="/plans">
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

                <Route path="/test">
                    <List />
                </Route>

                <Route>
                    <p style="text-align: center">404 Not Found</p>
                </Route>
            </div>
        </Router>
    {/if}
{/await}
