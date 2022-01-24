<script type="ts">
    import { onMount } from "svelte";

    interface ListElement {
        id: number;
        count: number;
        text: string;
    }

    let list: ListElement[] = [];
    let text: string;
    let count: number;
    let message: string = "";

    onMount(async () => {
        const rawResponse = await fetch("/shopping-list", {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
        });
        list = await rawResponse.json();
    });

    function deleteItem(id: number) {
        list = list.filter((item) => {
            return item.id != id;
        });
        updateList(list);
    }

    function updateList(list: Item[]) {
        fetch("/updateList", {
            method: "POST",
            body: JSON.stringify(list),
        });
    }

    function sendForm() {
        if (text.trim().length > 2 && count > 0) {
            let max = 0;
            for (let i = 0; i < list.length; i++)
                if (max < list[i].id) max = list[i].id;
            max++;
            list.push({ text: text, count: count, id: max });
            list = list;

            fetch("/addToList", {
                method: "POST",
                body: JSON.stringify({ text: text, count: count }),
            });
            text = "";
            count = 0;
            message = "";
        } else {
            message = "Kurwa co ty robisz pecie pierdolony";
        }
    }
</script>

{#each list as item}
    <div class="card">
        <div class="num-display">
            {item.count}
        </div>
        <div class="close" on:click={() => deleteItem(item.id)}>X</div>
        <p class="text-display">
            {item.text}
            <br />
        </p>
    </div>
{/each}
<div class="input-group">
    <input type="text" bind:value={text} />
    <input type="number" bind:value={count} />
    <input type="submit" on:click={sendForm} />
</div>
{message}

<style>
    .num-display {
        position: absolute;
        top: -10px;
        left: -10px;
        width: 50px;
        height: 50px;
        background: #ff6a95;
        color: #fff;
        border: 1px #eee solid;
        border-radius: 50%;
        padding: 10px;
        text-align: center;
        font-size: 19px;
    }

    .close {
        position: absolute;
        top: 10px;
        right: 20px;
        cursor: pointer;
        background: none;
        border: none;
    }

    .card {
        background-color: rgb(121, 3, 121);
        color: rgb(233, 233, 255);
        border-radius: 15px;
        padding: 40px 50px;
        margin: 20px 0;
        position: relative;
    }

    .input-group {
        background-color: rgb(121, 3, 121);
        display: flex;
        flex-direction: row;
        border: 1px solid #ccc;
        padding: 8px 10px;
        border-radius: 8px;
    }

    input {
        margin: 5px;
        font-size: 16px;
    }

    input:focus {
        outline: none;
    }
</style>
