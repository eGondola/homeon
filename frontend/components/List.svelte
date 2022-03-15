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
        fetch("/updateList", {
            method: "POST",
            body: JSON.stringify([$currentGroup.list, $currentGroup]),
        });
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
            message = "Podaj dłuższą nazwe lub ilość większą od zera!";
        }
    }
</script>

{#each $currentGroup.list as item}
    <div class="card">
        <div class="num-display">
            {item.count}
        </div>
        <div class="close" on:click={() => deleteItem(item.id)}>X</div>
        <p class="text-display">
            {item.text}
            <br />
        </p>
        <input
            type="checkbox"
            class="checkbox"
            on:click={() => {
                item.checked = !item.checked;
                updateList();
            }}
            checked={item.checked}
        />
    </div>
{/each}
<div class="input-group">
    <div>Nazwa: <input type="text" bind:value={text} /></div>
    <div>Sztuki: <input type="number" bind:value={count} /></div>
    <input type="submit" on:click={sendForm} id="submit" />
</div>
{message}

<style>
    .text-display {
        text-align: center;
        margin-left: 40px;
    }

    .checkbox {
        width: 30px;
        height: 30px;
    }

    .num-display {
        position: absolute;
        left: -5px;
        top: -3px;
        width: 50px;
        height: 50px;
        background: #546e7a;
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
        background-color: #c63f17;
        color: rgb(233, 233, 255);
        border-radius: 15px;
        padding: 25px 10px;
        margin: 5px 0;
        position: relative;
    }

    .input-group {
        background-color: #c63f17;
        display: flex;
        flex-direction: column;
        border: 1px solid #ccc;
        padding: 8px 10px;
        border-radius: 8px;
    }

    input {
        margin: 5px;
        font-size: 16px;
        float: right;
        border-radius: 2px;
    }

    input:focus {
        outline: none;
    }

    #submit {
        border: black 1px solid;
        border-radius: 15%;
        width: 100px;
        background-color: #ffa270;
        color: white;
    }
</style>
