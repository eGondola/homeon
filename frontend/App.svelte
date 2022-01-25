<script type="ts">
    import { Router, link, Route } from "svelte-routing";

    import Authorization from "./components/Authorization.svelte";
    import List from "./components/list.svelte";
    import CalendarPage from "./pages/CalendarPage.svelte";
    import Profile from "./pages/Profile.svelte";
    import * as api from "./util/api";

    import Groups from "./components/Groups.svelte";
    let showGroups = true;

    let editProfile = true
</script>

{#await api.get("checkLogin") then user}
    {#if !user.login}
        <Authorization />
    {:else}
        {#if editProfile}
            <button
                on:click={() => {editProfile = !editProfile}} style="position: fixed; top: 0; left: 0;">Wróć</button
            >
            <Profile />
        {:else}
            {#await api.get("groups") then groups}
                <Router>
                    <div class="home">
                        <div class="user-profile">
                            <div id="profile" on:click={() => {editProfile = !editProfile}}>
                                <i class="icon-profile" />
                                <!-- {user.login}
                                <button
                                    on:click={async () => {
                                        await fetch("/logout");
                                        location.replace("/");
                                    }}>Wyloguj</button
                                > -->
                            </div>
                            <div id="show_groups" on:click={() => { showGroups = !showGroups }}>Pokaż grupy</div>
                            <div id="go_home">
                                <a href="/" use:link><i class="icon-home" /></a>
                            </div>
                        </div>
                        <Groups {groups} {showGroups}>
                            <Route path="/">
                                <div class="info-block">
                                    <div>
                                        <div />
                                        <div />
                                    </div>
                                </div>

                                <div class="navigation">
                                    <div>
                                        <div>
                                            <div>
                                                <a href="/home-manage" use:link>
                                                    <div class="home-manage" />
                                                </a>
                                                <a href="/plans" use:link>
                                                    <div class="plans" />
                                                </a>
                                            </div>
                                        </div>
                                        <div>
                                            <div>
                                                <a href="/shopping-list" use:link>
                                                    <div class="shopping-list" />
                                                </a>
                                            </div>
                                        </div>
                                        <div>
                                            <div>
                                                <a
                                                    href="/household-duties"
                                                    use:link
                                                >
                                                    <div class="household-duties" />
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Route>

                            <Route path="/plans">
                                <CalendarPage />
                            </Route>

                            <Route path="/shopping-list">
                                <List />
                            </Route>

                            <Route path="/confirm/:token">
                                <p>Udało się potwierdzić email</p>
                            </Route>

                            <Route>
                                <p style="text-align: center">404 Not Found</p>
                            </Route>
                        </Groups>
                    </div>
                </Router>
            {/await}
        {/if}
    {/if}
{/await}

<style lang="scss">
    @import "./styles/variables.scss";

    :global(*, ::before, ::after) {
        box-sizing: border-box;
    }

    .home {
        height: 100%;
        display: flex;
        flex-flow: column;

        .user-profile {
            display: flex;
            flex-flow: row;
            //align-items: center;
            justify-content: center;
            //padding: 4vmin;
            height: 13vmin;

            font-size: 5vmin;

            //background-color: $p-color-dark;

            > div {
                //height: 100%;

                display: flex;
                align-items: center;
                justify-content: center;
                color: white;

                background-color: $p-color-dark;
                border-radius: 0vmin 0vmin 2vmin 2vmin;

                text-transform: lowercase;
                font-variant: small-caps;
            }
            

            #profile {
                height: 11vmin;
                width: 11vmin;
                margin: 1vmin;
                border-radius: 50%;
                //border: 1px solid red;
                //border-radius: 50%;

                //margin-left: 2vmin;
                //margin-right: 2vmin;
            }

            #show_groups {
                flex: 1;
            }

            #show_groups, #go_home {
                height: 12vmin;
                margin-right: 1vmin;
                //border-left: 3px double $p-color-light;

                a {
                    color: white;
                    text-decoration: none;

                    width: 12vmin;
                    height: 12vmin;

                    display: flex;
                    align-items: center;
                    justify-content: center;

                    // #home {
                    //     width: 100%;
                    //     height: 100%;
                    //     background-repeat: no-repeat;
                    //     background-position: center;
                    //     background-image: url("icons/home.png");
                    //     background-size: 65%;
                    // }
                }
            }

            // > div {
            //     flex: 1;

            //     &:nth-child(1) {
            //         display: flex;

            //         > div {
            //             display: flex;
            //             flex-flow: column;
            //             align-items: center;
            //             justify-content: left;

            //             font-variant: small-caps;
            //             color: white;

            //             button {
            //                 border: none;
            //                 //border-radius: 2vmin;

            //                 //padding: 3vmin 7.5vmin;
            //                 //margin: 1.5vmin;

            //                 box-shadow: -0.5vmin -0.5vmin 1vmin 0vmin #00000040,
            //                     0.5vmin 0.5vmin 1vmin 0vmin #00000040;

            //                 background-color: $s-color-dark;
            //                 color: white;
            //                 //font-size: 3vmin;
            //                 text-transform: lowercase;
            //                 font-variant: small-caps;
            //             }
            //         }
            //     }

            //     &:nth-child(2) {
            //         display: flex;
            //         justify-content: right;

            //         .home {
            //             width: 10vmin;
            //             background-repeat: no-repeat;
            //             background-position: center;
            //             background-image: url("icons/home.png");
            //             background-size: 90%;
            //         }
            //     }
            // }
        }

        .info-block {
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

        .navigation {
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

                        .home-manage {
                            margin-left: 2.5vmin;
                            margin-right: 4vmin;
                            background-image: url("icons/home-manage.png");
                            background-size: 40%;
                        }

                        .plans {
                            margin-left: 4vmin;
                            margin-right: 2.5vmin;
                            background-image: url("icons/plans.png");
                            background-size: 40%;
                        }

                        .shopping-list {
                            margin-left: 2.5vmin;
                            margin-right: 2.5vmin;
                            background-image: url("icons/shopping-list.png");
                            background-size: 18%;
                        }

                        .household-duties {
                            margin-left: 2.5vmin;
                            margin-right: 2.5vmin;
                            background-image: url("icons/clean.png");
                            background-size: 18%;
                        }
                    }
                }
            }
        }
    }
</style>
