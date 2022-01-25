<script type="ts">
    import { setContext } from "svelte";
    import { writable } from "svelte/store";
    import * as api from "../util/api";

    export let groups: any;
    export let showGroups: any;
    let name: string;

    const currentGroup = writable(groups[0]);
    setContext("group", currentGroup);

    
    async function addGroup() {
        const token = await api.post("add-group", {
            name,
        });
 
        groups = [
            ...groups,
            {
                name,
                token,
            },
        ];

        groupSwitch = !groupSwitch;
    }
    
    let groupSwitch = true;

    function addGroupButton() {
        groupSwitch = !groupSwitch;
    }
</script>
{#if showGroups}
<div id="top">
    <div id="groups">
        <div>
            <form
                on:submit|preventDefault={() => {addGroup()}}
            >
                <span on:click={() => {addGroupButton()}}>{groupSwitch ? "+" : "x"}</span>
                {#if !groupSwitch}
                <span id="add_group_form">
                    <input type="text" bind:value={name} />
                    <button type="submit">Dodaj grupę</button>
                </span>
                {/if}
                
                
            </form>
        </div>
        {#if groupSwitch}
            {#each groups as group}
                <div class:active={group == $currentGroup}>
                    <span
                        on:click={() => {
                            currentGroup.set(group);
                        }}>{group.name}</span
                    >
                </div>
                <!-- <input
                    type="text"
                    value={`${location.protocol}//${location.host}/group/${group.token}`}
                    disabled
                /> -->
            {/each}
        {/if}
    </div>
</div>
{/if}
<slot />

<style lang="scss">
    @import "../styles/variables.scss";
    .active {
        color: rebeccapurple ;
    }
    #top {
        display: flex;
        flex-flow: column;
        height: 100%;

        #groups {
            display: inline-block;
            text-align: center;
            line-height: 15vmin;

            padding: 5vmin 4vmin;

            color: white;
            text-transform: lowercase;
            font-variant: small-caps;

           > div {
                display: inline;

                > form {
                    display: inline;

                    > span {

                        &:nth-child(1) {
                            background-color: $s-color-light;
                        }
                    }

                    #add_group_form {
                        position: relative;
                        
                        input {
                            width: 37vmin;
                            margin-right: 28vmin;

                            border: none;
                            border-bottom: 1px solid $p-color-dark;

                            background-color: unset;
                            color: white;
                            text-transform: lowercase;
                            font-variant: small-caps;
                        }

                        input:focus {
                            outline:none;
                        }

                        button {
                            height: 100%;

                            position: absolute;
                            top: 0;
                            right: 0;

                            border: none;
                            border-radius: 0vmin 10vmin 10vmin 0vmin;

                            padding-right: 4vmin;
                            padding-left: 4vmin;

                            background-color: unset;
                            border-left: 3px double $p-color-light;
                            
                            color: white;
                            text-transform: lowercase;
                            font-variant: small-caps;
                        }
                    }
                }

                > form > span, > span {
                    padding: 2vmin 5vmin;
                    margin: 1vmin;
                    border-radius: 10vmin;

                    background-color: $p-color;
                    box-shadow: -0.5vmin -0.5vmin 1vmin 0vmin #00000040, 0.5vmin 0.5vmin 1vmin 0vmin #00000040;
                }
            }
        }
    }

    #arrows {
        display: flex;
        flex-flow: row;

        > div {
            flex: 1;

            display: flex;
            align-items: center;
            padding-top: 2.5vmin;
            padding-bottom: 2.5vmin;

            &:nth-child(1) {
                justify-content: right;
                padding-right: 2.5vmin;

                button {
                    margin-right: 1.5vmin;
                }
            }

            &:nth-child(2) {
                padding-left: 2.5vmin;

                button {
                    margin-left: 1.5vmin;
                }
            }

            button {
                border: none;
                border-radius: 50%;
                height: 13vmin;
                width: 13vmin;

                background-color: $s-color;
                font-size: 5vmin;
                color: white;
            }
        }
    }
</style>
