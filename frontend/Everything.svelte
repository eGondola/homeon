<script type="ts">
    import { Router, link, Route } from "svelte-routing";
    import List from "./components/list.svelte";
    import CalendarPage from "./pages/CalendarPage.svelte";
    import Profile from "./pages/Profile.svelte";
    import Groups from "./components/Groups.svelte";
    import { setContext } from "svelte";
    import { writable } from "svelte/store";

    export let groups: any[];
    var socket = io();
    const currentGroup = writable(groups[0]);
    setContext("group", currentGroup);

    socket.on("Group", (group:any) => {
        currentGroup.set(group) 
    })

    currentGroup.subscribe(newGroup => {
        socket.emit("newGroup", newGroup)
    })

    let showGroups = true;
    let editProfile = false;
    //const io = require("socket.io-client");
   
</script>

{#if editProfile}
    <button
        on:click={() => {
            editProfile = !editProfile;
        }}
        style="position: fixed; top: 0; left: 0;">Wróć</button
    >
    <Profile {groups} />
{:else}
    <Router>
        <div class="home">
            <div class="user-profile">
                <div
                    id="profile"
                    on:click={() => {
                        editProfile = !editProfile;
                    }}
                >
                    <i class="icon-profile" />
                    <!-- {user.login}
                                <button
                                    on:click={async () => {
                                        await fetch("/logout");
                                        location.replace("/");
                                    }}>Wyloguj</button
                                > -->
                </div>
                <div
                    id="show_groups"
                    on:click={() => {
                        showGroups = !showGroups;
                    }}
                >
                    Pokaż grupy
                </div>
                <div id="go_home">
                    <a href="/" use:link><i class="icon-home" /></a>
                </div>
            </div>
            <Groups {groups} {showGroups} />
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
                                <a href="/household-duties" use:link>
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
        </div>
    </Router>
{/if}

<style lang="scss">
    @import "./styles/variables.scss";

    .home {
        height: 100%;
        display: flex;
        flex-flow: column;

        .user-profile {
            display: flex;
            flex-flow: row;
            justify-content: center;
            height: 13vmin;

            font-size: 5vmin;

            > div {
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
            }

            #show_groups {
                flex: 1;
            }

            #show_groups,
            #go_home {
                height: 12vmin;
                margin-right: 1vmin;

                a {
                    color: white;
                    text-decoration: none;

                    width: 12vmin;
                    height: 12vmin;

                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
            }
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
