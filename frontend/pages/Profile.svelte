<script type="ts">
    import * as api from "../util/api";

    export let groups: any[];
</script>

<div id="profile_menage">
    <div id="profile_icon">
        <div>
            <i class="icon-profile" />
            <!-- {user.login}
            <button
                on:click={async () => {
                    await fetch("/logout");
                    location.replace("/");
                }}>Wyloguj</button
            > -->
        </div>
    </div>
    <div id="top">
        <div id="groups">
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
                        <i class="icon-x" />
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
</div>

<style lang="scss">
    @import "../styles/variables.scss";

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
                height: 30vmin;
                width: 30vmin;
                border-radius: 50%;
                border: 1px solid red;

                display: flex;
                align-items: center;
                justify-content: center;

                font-size: 10vmin;

                i {
                    color: orange;
                }
            }
        }

        #top {
            flex: 1;

            display: flex;
            align-items: center;
            justify-content: center;

            color: white;
            text-transform: lowercase;
            font-variant: small-caps;

            #groups {
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
    }
</style>
