<script type="ts">
    import * as api from "../util/api";

    export let groups: any[];


    let name: string;
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

        //groupSwitch = !groupSwitch;
    }
</script>

<!-- <div id="profile_menage"> -->
    <!-- <div id="profile_icon">
        <div>
            <i class="icon-profile" />
            {user.login}
        </div>
    </div>
    <div id="logout">
        <span
            on:click={async () => {
                await fetch("/logout");
                location.replace("/");
            }}>Wyloguj</span
        >
    </div> -->
    <div id="top">
        <div id="groups">
            <div id="add_group">
                <form
                    on:submit|preventDefault={() => {addGroup()}}
                >
                    <!-- <span on:click={() => {addGroupButton()}}><i class={groupSwitch ? 'icon-plus' : 'icon-x'} /></span> -->
                    <!-- {#if !groupSwitch} -->
                    <div id="add_group_form">
                        <input type="text" bind:value={name} />
                        <button type="submit"><i class="icon-plus" /></button>
                    </div>
                    <!-- {/if} -->
                    
                    
                </form>
            </div>
            {#each groups as { name, token }, i}
                <div>
                    <div
                        class="delete"
                        on:click={() => {
                            api.post("leave-group", {
                                token,
                            });
                            groups.splice(i, 1);
                            groups = groups;
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
                    </div>
                </div>
            {/each}
        </div>
    </div>
<!-- </div> -->

<style lang="scss">
    @import "../styles/variables.scss";

    // #profile_menage {
    //     // height: 100%;
    //     display: flex;
    //     flex-flow: column;

        // #profile_icon {
        //     height: 50vmin;
        //     display: flex;
        //     align-items: center;
        //     justify-content: center;

        //     > div {
        //         height: 30vmin;
        //         width: 30vmin;
        //         border-radius: 50%;
        //         border: 1px solid $p-color-light;

        //         display: flex;
        //         align-items: center;
        //         justify-content: center;

        //         font-size: 10vmin;

        //         i {
        //             color: $s-color;
        //         }
        //     }
        // }

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

        #top {
            flex: 1;

            display: flex;
            align-items: center;
            justify-content: center;

            color: white;
            text-transform: lowercase;
            font-variant: small-caps;

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
                                box-shadow: -0.5vmin -0.5vmin 1vmin 0vmin #00000040, 0.5vmin 0.5vmin 1vmin 0vmin #00000040;
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

                        background-color: $p-color;
                        box-shadow: -0.5vmin -0.5vmin 1vmin 0vmin #00000040,
                            0.5vmin 0.5vmin 1vmin 0vmin #00000040;
                    }
                }
            }
        }
    //}
</style>
