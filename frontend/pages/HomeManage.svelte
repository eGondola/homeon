<script type="ts">
    import { getContext } from "svelte";
    import type { Writable } from "svelte/store";
    import type { Group, Light } from "../../common/types";
    import * as api from "../util/api";

    const currentGroup = getContext<Writable<Group>>("group");

    $: ({ token } = $currentGroup);

    let lights: Light[] = [];
    function getLights() {
        fetch("/get-lights", {
            method: "POST",
            body: token,
        })
            .then((odp) => odp.json())
            .then((v) => {
                lights = v;

                lights.forEach(({ id, name, work }, i) => {
                    allLights[i] = {
                        id,
                        name,
                        work,
                    };

                    allLightsNames[i] = name;
                });
            });
    }
    $: {
        token;
        getLights();
    }

    function addLight() {
        fetch("/get-lights", {
            method: "POST",
            body: token,
        })
            .then((odp) => odp.json())
            .then(async () => {
                await api.post("add-light", {
                    token,
                });

                getLights();
            });
    }

    async function onOffLight(id: number, work: boolean) {
        await api.post("switch-light", {
            id,
            token,
            work,
        });
    }

    async function resetLight(id: number) {
        await api.post("remove-light", {
            id,
            token,
        });

        editLights();
    }

    let editLightSwitch = false;

    let allLights: Light[] = [];
    let allLightsNames: string[] = [];

    function editLights() {
        allLights.forEach(({ id, name }, i) => {
            if (name != allLightsNames[i]) {
                api.post("edit-light", {
                    id,
                    token,
                    name,
                });
            }
        });

        getLights();
    }
</script>

<div id="all">
    <div>
        {#each lights as light, i}
            <div class="light">
                <div class="title">
                    {#if !editLightSwitch}
                        {allLights[i].name}
                    {:else}
                        <input type="text" bind:value={allLights[i].name} />
                    {/if}
                </div>
                {#if editLightSwitch}
                    <div
                        on:click={() => {
                            resetLight(allLights[i].id);
                        }}
                    >
                        <i class="icon-x" />
                    </div>
                {:else}
                    <div class="light_switch">
                        <input
                            type="checkbox"
                            id="switch{i}"
                            class="switch"
                            bind:checked={allLights[i].work}
                            on:change={() => {
                                onOffLight(allLights[i].id, allLights[i].work);
                            }}
                        />
                        <label for="switch{i}" class="lbl-off">Off</label>
                        <label for="switch{i}" class="lbl-on">On</label>
                    </div>
                {/if}
            </div>
        {/each}
    </div>
    <div id="add">
        {#if !editLightSwitch}
            <div on:click={addLight}><i class="icon-plus" /></div>
            <div
                class="edit"
                on:click={() => {
                    editLightSwitch = !editLightSwitch;
                }}
            >
                <i class="icon-edit" />
            </div>
        {:else}
            <div
                class="edit"
                on:click={() => {
                    editLightSwitch = !editLightSwitch;
                    editLights();
                }}
            >
                <i class="icon-v" />
            </div>
        {/if}
    </div>
</div>

<style lang="scss">
    @use "sass:math";
    @import "../styles/variables.scss";

    $height: math.div(30, 16) * 1em;
    $width: math.div(72, 16) * 1em;

    $transition-default: 0.25s ease-out 0.1s;

    #all {
        margin-top: 15vmin;

        display: flex;
        flex-flow: column;
        align-items: center;
        justify-content: center;

        > div {
            display: flex;
            flex-flow: column;
            align-items: end;
            justify-content: center;

            .light {
                display: flex;
                flex-flow: row;
                align-items: center;
                justify-content: center;

                > div {
                    margin: 2vmin;
                }

                .title {
                    border-radius: 2vmin;
                    padding: 3vmin 6vmin;

                    background-color: $p-color;
                    color: white;

                    font-size: 6vmin;
                    font-variant: small-caps;

                    input {
                        width: 100%;
                        border: 1px solid $p-color;
                        border-radius: 2vmin;
                        font-size: 5vmin;
                        padding-left: 1vmin;
                        padding-right: 1vmin;
                    }

                    input:focus {
                        outline: 1px solid white;
                    }
                }

                .light_switch {
                    font-size: 1.5em;
                    height: $height;
                    position: relative;
                    width: $width;

                    .lbl-off,
                    .lbl-on {
                        cursor: pointer;
                        display: block;
                        font-size: 0.9em;
                        font-weight: bold;
                        line-height: 1em;
                        position: absolute;
                        top: math.div(8, 16) * 1em;
                        transition: opacity $transition-default;
                        text-transform: uppercase;
                    }

                    .lbl-off {
                        right: math.div(7, 16) * 1em;
                    }

                    .lbl-on {
                        color: white;
                        opacity: 0;
                        left: math.div(7, 16) * 1em;
                    }

                    .switch {
                        -webkit-appearance: none;
                        -moz-appearance: none;
                        appearance: none;

                        height: 0;
                        font-size: 1em;
                        left: 0;
                        line-height: 0;
                        outline: none;
                        position: absolute;
                        top: 0;
                        width: 0;

                        &:before,
                        &:after {
                            content: "";
                            font-size: 1em;
                            position: absolute;
                        }

                        &:before {
                            border-radius: math.div(20, 16) * 1em;
                            background: $s-color-light;
                            height: $height;
                            left: math.div(4, 16) * -1em;
                            top: math.div(3, 16) * -1em;
                            transition: background-color $transition-default;
                            width: $width;
                        }

                        &:after {
                            box-shadow: 0 0.0625em 0.375em 0 #666;
                            border-radius: 50%;
                            background: white;
                            height: math.div(24, 16) * 1em;
                            transform: translate(0, 0);
                            transition: transform $transition-default;
                            width: math.div(24, 16) * 1em;
                        }

                        &:checked {
                            &:after {
                                transform: translate(math.div(40, 16) * 1em, 0);
                            }

                            & ~ .lbl-off {
                                opacity: 0;
                            }

                            & ~ .lbl-on {
                                opacity: 1;
                            }
                        }

                        &.switch {
                            &:checked:before {
                                background: $p-color;
                            }
                        }
                    }
                }
            }
        }

        #add {
            margin-top: 5vmin;

            display: flex;
            flex-flow: row;

            color: white;

            > div {
                border-radius: 15vmin;

                padding: 4vmin;
                margin-right: 2vmin;
                margin-left: 2vmin;

                background-color: $s-color-light;
            }
        }

        #load {
            margin-top: 5vmin;
            font-size: 10vmin;
            color: $s-color-light;
        }
    }
</style>
