<script type="ts">
    let lights: any = { 0: {} };
    fetch("/get-lights", {
        method: "POST",
    })
        .then((odp) => odp.json())
        .then((v) => {
            lights = v;

            Object.values(lights).forEach((light: any, key) => {
                name[key] = {
                    name: light.name,
                    work: light.work,
                };
            });
        });

    let search = false;
    function addLight() {
        search = true;
        fetch("/add-light", {
            method: "POST",
        });

        let checkLight = setInterval(() => {
            fetch("/check-add-light", {
                method: "POST",
            })
                .then((odp) => odp.json())
                .then((v) => {
                    if (v) {
                        console.log("get");
                        clearInterval(checkLight);

                        fetch("/get-lights", {
                            method: "POST",
                        })
                            .then((odp) => odp.json())
                            .then((v) => {
                                lights = v;
                            });

                        search = false;
                    }
                });
        }, 2000);
    }

    let editLightSwitch = false;

    let name: any = [Object.values(lights).length];

    function editLight() {
        fetch("/edit-lights", {
            method: "POST",
            body: JSON.stringify(name),
        });
    }
</script>

<div id="all">
    <div>
        {#if !editLightSwitch}
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
                    editLight();
                }}
            >
                <i class="icon-v" />
            </div>
        {/if}
        {#each Object.values(lights) as light, key}
            <div class="light">
                <div class="title">
                    {#if !editLightSwitch}
                        {name[key].name}
                    {:else}
                        <input type="text" bind:value={name[key].name} />
                    {/if}
                </div>
                {#if !editLightSwitch}
                    <div class="light_switch">
                        <input
                            type="checkbox"
                            id="switch{key}"
                            class="switch"
                            bind:checked={name[key].work}
                            on:change={editLight}
                        />
                        <label for="switch{key}" class="lbl-off">Off</label>
                        <label for="switch{key}" class="lbl-on">On</label>
                    </div>
                {/if}
            </div>
        {/each}
    </div>
    {#if search}
        <div id="load"><i class="icon-load animate-spin" /></div>
    {:else}
        <div id="add" on:click={addLight}>
            <div><i class="icon-plus" /></div>
        </div>
    {/if}
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

            .edit {
                position: absolute;
                left: 2vmin;
                background-color: $s-color;
                color: white;

                padding: 2vmin;
                border-radius: 15vmin;
            }

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
            padding: 4vmin;

            border-radius: 15vmin;

            background-color: $s-color-light;
            color: white;
            font-size: 4vmin;
        }

        #load {
            margin-top: 5vmin;
            font-size: 10vmin;
            color: $s-color-light;
        }
    }
</style>
