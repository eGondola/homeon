<script type="ts">
    import Popup from "./Popup";
    import type { Plan } from "../../common/types";

    export let date: Date;
    export let addPlan: (plan: Plan) => Promise<void>;
    export let closePopup: () => void;

    let start = new Date().toISOString().slice(0, 16);
    let end = new Date(new Date(date).setHours(date.getHours() + 1))
        .toISOString()
        .slice(0, 16);
    let text = "";
</script>

<Popup let:Topbar>
    <form
        on:submit|preventDefault={async () => {
            await addPlan({ start, end, text });
            closePopup();
        }}
    >
        <Topbar {closePopup}>
            <div class="save">
                <button type="submit">Zapisz</button>
            </div>
        </Topbar>

        <div class="date">
            <input type="datetime-local" bind:value={start} />
            <input type="datetime-local" bind:value={end} />
        </div>

        <div class="text">
            <input type="text" bind:value={text} />
        </div>
    </form>
</Popup>

<style lang="scss">
    @use "../styles/variables.scss" as *;

    .save {
        button {
            border-radius: 10vmin;

            width: 20vmin;
            height: 100%;

            text-transform: lowercase;
            font-variant: small-caps;

            border: none;
            background-color: $p-color;
            color: white;
        }
    }

    .date {
        margin-bottom: 8vmin;
        text-align: center;

        input {
            border: none;
            width: 100%;
            font-size: 7vmin;
            color: $s-color;
        }
    }

    .text {
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
    }
</style>
