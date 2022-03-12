<script context="module" type="ts">
    declare const io: typeof import("socket.io-client").io;
</script>

<script type="ts">
    import type { Writable } from "svelte/store";
    import { Router, link, Route } from "svelte-routing";
    import HomeManage from "./pages/HomeManage.svelte";
    import List from "./components/list.svelte";
    import Plans from "./pages/Plans.svelte";
    import Profile from "./pages/Profile.svelte";
    import Groups from "./components/Groups.svelte";
    import { setContext, getContext } from "svelte";
    import { writable } from "svelte/store";
    import type { Group, User } from "../common/types";
    import Localization from "./components/Localization.svelte";

    export let groups: Group[];

    const groupsStore = writable(groups);

    const socket = io();
    const currentGroup = writable(groups[0]);
    setContext("group", currentGroup);

    const positions = writable([]);
    setContext("positions", positions);

    socket.on("Group", (group) => {
        currentGroup.set(group);
    });

    socket.on("position", (obj) => {
        positions.set(obj);
        console.log(obj);
    });

    currentGroup.subscribe((newGroup) => {
        socket.emit("newGroup", newGroup);
        socket.emit("getPositions", newGroup);
    });

    let showGroups = true;
    let editProfile = false;

    const user = getContext<Writable<User>>("user");
    const d = new Date();

    navigator.geolocation.watchPosition(
        (pos) => {
            let obj = {
                user: $user,
                position: { x: pos.coords.latitude, y: pos.coords.longitude },
                time: d.getTime(),
                group: $currentGroup,
            };
            socket.emit("newPosition", obj);
        },
        (err) => {
            let obj = {
                user: $user,
                positions: err.message,
                time: d.getTime(),
                groups,
                $currentGroup,
            };
            socket.emit("newPosition", obj);
        }
    );
</script>

<svelte:head>
    <script
        async
        defer
        src="https://maps.googleapis.com/maps/api/js?key=AIzaSyABA_utwjiBnqR4aUOIbCTieCBZO7gryKM">
    </script>
</svelte:head>

{#if editProfile}
    <div id="profile_menage">
        <div id="profile_icon">
            <div>
                <div>
                    <span
                        on:click={() => {
                            editProfile = !editProfile;
                        }}><i class="icon-home" /></span
                    >
                </div>
            </div>
            <div>
                <div>
                    <i class="icon-profile" />
                </div>
                <span>moj_login</span>
            </div>
            <div>
                <div
                    on:click={async () => {
                        await fetch("/logout");
                        location.replace("/");
                    }}
                >
                    <i class="icon-logout" />
                </div>
            </div>
        </div>
        <Profile {groupsStore} />
    </div>
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
            {#if showGroups}
                <Groups groups={$groupsStore} />
            {/if}
            <Route path="/">
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

            <Route path="/home-manage">
                <HomeManage />
            </Route>

            <Route path="/plans">
                <Plans />
            </Route>

            <Route path="/shopping-list">
                <List />
            </Route>

            <Route path="/household-duties">
                <Localization />
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

    #profile_menage {
        height: 100%;
        display: flex;
        flex-flow: column;

        #profile_icon {
            height: 50vmin;
            display: flex;
            align-items: center;
            justify-content: center;

            > div {
                flex: 1;

                display: flex;
                align-items: center;
                justify-content: center;

                i {
                    color: white;
                }

                > div {
                    border: 2px solid $s-color-light;

                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                &:nth-child(1) {
                    > div {
                        height: 15vmin;
                        width: 15vmin;
                        font-size: 6vmin;
                        border-radius: 50%;
                        background-color: $p-color-dark;
                    }
                }

                &:nth-child(2) {
                    display: flex;
                    flex-flow: column;

                    > div {
                        height: 30vmin;
                        width: 30vmin;
                        font-size: 10vmin;
                        border-radius: 50%;

                        margin-bottom: 4vmin;

                        i {
                            color: $s-color;
                        }
                    }

                    > span {
                        font-size: 6vmin;
                        color: $p-color-dark;
                    }
                }

                &:nth-child(3) {
                    > div {
                        height: 15vmin;
                        width: 15vmin;
                        font-size: 6vmin;
                        border-radius: 50%;
                        background-color: $s-color-dark;
                    }
                }
            }
        }
    }

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
