<script type="ts">
    import type { Writable } from "svelte/store";
    import type { Group } from "../../common/types";
    import * as api from "../util/api";
    import * as typedApi from "../util/typed-api";

    export let groupsStore: Writable<Group[]>;

    let name: string;

    async function addGroup() {
        const token = await typedApi.post("add-group", {
            name,
        });

        groupsStore.update((groups) => [
            ...groups,
            {
                name,
                token,
                plans: [],
                list: [],
                home: null,
                lights: [],
            },
        ]);
    }
</script>

<div id="top">
    <div id="groups">
        <div id="add_group">
            <form
                on:submit|preventDefault={() => {
                    addGroup();
                }}
            >
                <div id="add_group_form">
                    <input type="text" bind:value={name} />
                    <button type="submit"><i class="icon-plus" /></button>
                </div>
            </form>
        </div>
        {#each $groupsStore as { name, token }, i}
            <div>
                <div
                    class="delete"
                    on:click={() => {
                        api.post("leave-group", {
                            token,
                        });
                        groupsStore.update((groups) => {
                            groups.splice(i, 1);
                            return groups;
                        });
                    }}
                >
                    <i class="icon-logout" />
                </div>
                <div class="group_name">{name}</div>
                <div
                    class="copy"
                    on:click={() => {
                        const { protocol, host } = location;
                        navigator.clipboard.writeText(
                            `${protocol}//${host}/group/${token}`
                        );
                    }}
                >
                    <i class="icon-share" />
                    Skopiuj link&nbsp;
                </div>
            </div>
        {/each}
    </div>
</div>

<style lang="scss">
    @import "../styles/variables.scss";

    #top {
        flex: 1;

        display: flex;
        align-items: center;
        justify-content: center;

        color: white;

        #groups {
            width: 100%;
            display: flex;
            flex-flow: column;
            align-items: center;
            justify-content: center;

            #add_group {
                > form {
                    > div {
                        display: flex;
                        margin-bottom: 10vmin;

                        input {
                            width: 100%;
                            border: 1px solid $p-color;
                            border-radius: 2vmin;
                            font-size: 5vmin;
                            padding-left: 1vmin;
                            padding-right: 1vmin;
                        }

                        input:focus {
                            outline: 1px solid $p-color;
                        }

                        button {
                            border: none;
                            padding: 2vmin 2vmin;
                            margin: 1vmin;
                            border-radius: 10vmin;

                            color: white;
                            background-color: $p-color;
                            box-shadow: -0.5vmin -0.5vmin 1vmin 0vmin #00000040,
                                0.5vmin 0.5vmin 1vmin 0vmin #00000040;
                        }
                    }
                }
            }

            > div {
                display: flex;
                flex-flow: row;

                > div {
                    padding: 2vmin 2vmin;
                    margin: 1vmin;
                    border-radius: 10vmin;

                    display: flex;
                    align-items: center;
                    justify-content: center;

                    background-color: $p-color;
                    box-shadow: -0.5vmin -0.5vmin 1vmin 0vmin #00000040,
                        0.5vmin 0.5vmin 1vmin 0vmin #00000040;

                    font-size: 4vmin;
                }
            }

            .group_name {
                border-radius: 5px;
                background-color: $s-color;

                font-size: 5vmin;
            }
        }
    }
</style>
