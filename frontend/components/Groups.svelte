<script type="ts">
    import { getContext } from "svelte";
    import type { Writable } from "svelte/store";
    import type { Group } from "../../common/types";

    export let groups: Group[];

    const currentGroup = getContext<Writable<Group>>("group");
</script>

<div id="top">
    <div id="groups">
        {#each groups as group}
            <div>
                <span
                    class:active={group === $currentGroup}
                    on:click={() => {
                        currentGroup.set(group);
                    }}>{group.name}</span
                >
            </div>
        {/each}
    </div>
</div>

<style lang="scss">
    @import "../styles/variables.scss";

    #top {
        display: flex;
        flex-flow: column;
        align-items: center;
        justify-content: center;

        #groups {
            display: inline-block;
            text-align: center;
            line-height: 15vmin;

            padding: 5vmin 4vmin;

            color: white;

            > div {
                display: inline;

                > span {
                    padding: 2vmin 5vmin;
                    margin: 1vmin;
                    border-radius: 10vmin;

                    background-color: $p-color-dark;
                    box-shadow: -0.5vmin -0.5vmin 1vmin 0vmin #00000040,
                        0.5vmin 0.5vmin 1vmin 0vmin #00000040;
                }

                .active {
                    background-color: $p-color;
                }
            }
        }
    }
</style>
