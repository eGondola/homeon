<script type="ts">
    import { getContext } from "svelte";
    import type { Writable } from "svelte/store";

    let text: string;
    let count: number;
    let message: string = "";

    const currentGroup = getContext<Writable<any>>("group");

    function deleteItem(id: number) {
        $currentGroup.list = $currentGroup.list.filter((item: any) => {
            return item.id != id;
        });
        updateList();
    }
    function updateList() {
        let group = JSON.stringify({group: $currentGroup});
        fetch("/updateList", {
            method: "POST",
            body: group,
        })
    }

    function sendForm() {
        if (text.trim().length > 2 && count > 0) {
            let max = 0;
            for (let i = 0; i < $currentGroup.list.length; i++)
                if (max < $currentGroup.list[i].id)
                    max = $currentGroup.list[i].id;
            max++;
            $currentGroup.list.push({
                text: text,
                count: count,
                id: max,
                checked: false,
            });
            $currentGroup.list = $currentGroup.list;
            updateList();
            text = "";
            count = 0;
            message = "";
        } else {
            message = "Podaj dłuższą nazwę, podaj ilość większą od zera";
        }
    }
</script>

<div id="cards">
{#each $currentGroup.list as item}
    <div class="card">
        <input
            class="checkbox"
            type="checkbox"
            on:click={() => {
                item.checked = !item.checked;
                updateList();
            }}
            checked={item.checked}
        />

        <div class="count">{item.count}</div>

        <div class="name">{item.text}</div>

        <div class="delete" on:click={() => deleteItem(item.id)}><i class="icon-x"/></div>
    </div>
{/each}
</div>

<div id="cardsForm">
    <div>
        <input id="nameForm" type="text" placeholder="Nazwa produktu" bind:value={text} />
        <input id="countForm" type="number" placeholder="np. 3" bind:value={count} />
        <button type="submit" on:click={sendForm} id="submit"><i class="icon-plus"/></button>
    </div>
    <div id="cardsMessage">
        {message}
    </div>
</div>

<style lang="scss">
    @import "../styles/variables.scss";

    #cards {
        // display: flex;
        // flex-flow: column;
        // align-items: center;
        // justify-content: center;

        margin: 4vmin;
        
        .card {
            margin: 2vmin;

            //background-color: red;
            border-bottom: 0.2vmin solid $s-color-light;
            display: flex;
            flex-flow: row;

            font-size: 5vmin;

            .checkbox {
                width: 7vmin;
                height: 7vmin;
            }

            .count {
                margin-left: 3vmin;
            }

            .name {
                flex: 1
            }

            .delete {
                margin-right: 3vmin;
                color: $p-color-dark;
            }

            > div {
                display: flex;
                align-items: center;
                justify-content: center;
            }
        }
    }

    #cardsForm {
        display: flex;
        flex-flow: column;
        align-items: center;
        justify-content: center;

        > div {
            display: flex;
            flex-flow: row;

            #countForm {
                width: 14vmin;
                text-align: center;
            }

            input {
                width: 100%;
                border: 1px solid $p-color;
                border-radius: 2vmin;
                font-size: 5vmin;
                padding-left: 1vmin;
                padding-right: 1vmin;

                margin-right: 2vmin;
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

        #cardsMessage {
            margin-top: 3vmin;
        }
    }
</style>
