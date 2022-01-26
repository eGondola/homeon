<script type="ts">
    import { Router, link, Route } from "svelte-routing";

    import Authorization from "./components/Authorization.svelte";
    import List from "./components/list.svelte";
    import CalendarPage from "./pages/CalendarPage.svelte";
    import Profile from "./pages/Profile.svelte";
    import * as api from "./util/api";

    import Groups from "./components/Groups.svelte";
    let showGroups = true;
    let editProfile = false;
</script>

{#await api.get("checkLogin") then user}
    {#if !user.login}
        <Authorization />
    {:else if editProfile}
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
                        }}><i class="icon-logout" /></div
                    >
                </div>
            </div>
            {#await api.get("groups") then groups}
                <Profile {groups} />
            {/await}
        </div>
    {:else}
        {#await api.get("groups") then groups}
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
{/await}

<style lang="scss">
    @import "./styles/variables.scss";

    :global(*, ::before, ::after) {
        box-sizing: border-box;
    }

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



                // #logout {
                //     display: flex;
                //     align-items: center;
                //     justify-content: center;

                //     span {
                //         padding: 2vmin 5vmin;
                //         margin: 1vmin;
                //         border-radius: 10vmin;
                //         box-shadow: -0.5vmin -0.5vmin 1vmin 0vmin #00000040, 0.5vmin 0.5vmin 1vmin 0vmin #00000040;
                        
                //         background-color: $s-color-dark;
                //         color: white;
                //         text-transform: lowercase;
                //         font-variant: small-caps;
                //     }
                // }
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
