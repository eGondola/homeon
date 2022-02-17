<script type="ts">
    import { getContext, onMount } from "svelte";
    import type { Writable } from "svelte/store";

    const group = getContext<Writable<any>>("group");
    let text: string;
    let count: number;
    let message: string = "";

    const currentGroup = getContext<any>("group");

    function deleteItem(id: number) {
        $group.list = $group.list.filter((item: any) => {
            return item.id != id;
        });
        updateList();
    }
    function updateList() {
        fetch("/updateList", {
            method: "POST",
            body: JSON.stringify([$group.list, $currentGroup]),
        });
    }

    function sendForm() {
        if (text.trim().length > 2 && count > 0) {
            let max = 0;
            for (let i = 0; i < $group.list.length; i++)
                if (max < $group.list[i].id) max = $group.list[i].id;
            max++;
            $group.list.push({ text: text, count: count, id: max });
            $group.list = $group.list;
            updateList()
            text = "";
            count = 0;
            message = "";
        } else {
            message = "Podaj dłuższą nazwe lub ilość większą od zera!";
        }
    }
</script>

{#each $group.list as item}
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
