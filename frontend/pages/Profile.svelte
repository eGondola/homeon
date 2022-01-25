<script type="ts">
    import * as api from "../util/api";
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
            {#await api.get("groups") then groups}
                {#each groups as group}
                    <div>
                        <div class="delete"><i class="icon-x" /></div>
                        <div class="group_name">{group.name}</div>
                        <div class="copy"><i class="icon-share" /></div>
                    </div>
                    <!-- <input
                        type="text"
                        value={`${location.protocol}//${location.host}/group/${group.token}`}
                        disabled
                    /> -->
                {/each}
            {/await}
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
                        box-shadow: -0.5vmin -0.5vmin 1vmin 0vmin #00000040, 0.5vmin 0.5vmin 1vmin 0vmin #00000040;
                    }
                }
            }
        }
    }
    
    // #top {
    //     display: flex;
    //     flex-flow: column;
    //     align-items: center;
    //     justify-content: center;
    //     height: 100%;

    //     #groups {
    //         display: inline-block;
    //         text-align: center;
    //         line-height: 15vmin;

    //         padding: 5vmin 4vmin;

    //         color: white;
    //         text-transform: lowercase;
    //         font-variant: small-caps;

    //        > div {
    //             display: inline;

    //             > form {
    //                 display: inline;

    //                 > span {

    //                     &:nth-child(1) {
    //                         background-color: $s-color-light;
    //                     }
    //                 }

    //                 #add_group_form {
    //                     position: relative;
                        
    //                     input {
    //                         width: 37vmin;
    //                         margin-right: 28vmin;

    //                         border: none;
    //                         border-bottom: 1px solid $p-color-dark;

    //                         background-color: unset;
    //                         color: white;
    //                         text-transform: lowercase;
    //                         font-variant: small-caps;
    //                     }

    //                     input:focus {
    //                         outline:none;
    //                     }

    //                     button {
    //                         height: 100%;

    //                         position: absolute;
    //                         top: 0;
    //                         right: 0;

    //                         border: none;
    //                         border-radius: 0vmin 10vmin 10vmin 0vmin;

    //                         padding-right: 4vmin;
    //                         padding-left: 4vmin;

    //                         background-color: unset;
    //                         border-left: 3px double $p-color-light;
                            
    //                         color: white;
    //                         text-transform: lowercase;
    //                         font-variant: small-caps;
    //                     }
    //                 }
    //             }

    //             > form > span, > span {
    //                 padding: 2vmin 5vmin;
    //                 margin: 1vmin;
    //                 border-radius: 10vmin;

    //                 background-color: $p-color;
    //                 box-shadow: -0.5vmin -0.5vmin 1vmin 0vmin #00000040, 0.5vmin 0.5vmin 1vmin 0vmin #00000040;
    //             }

    //             > form > span {
    //                 &:nth-child(1) {
    //                     padding: 2vmin;
    //                 }
    //             }

    //             .active {
    //                 background-color: $p-color-light;
    //             }
    //         }
    //     }
    // }
</style>