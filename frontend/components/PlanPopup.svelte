<script type="ts">
    import Popup from "./Popup";
    import DateText from "./DateText.svelte";

    export let removePlan: (plan: Plan) => Promise<void>;
    export let closePopup: () => void;

    export let plan: Plan;

    const { start, end, text } = plan;

    type Plan = {
        start: Date;
        end: Date;
        text: string;
    };
</script>

<Popup let:Topbar>
    <Topbar {closePopup} />
    <div class="content">
        <div
            class="delete-plan"
            on:click={async () => {
                await removePlan(plan);
                closePopup();
            }}
        >
            <i class="icon-delete" />
        </div>

        <DateText date={start} />
        {start.getHours()}:{start.getMinutes()} -
        <DateText date={end} />
        {end.getHours()}:{end.getMinutes()}<br />
        {text}
    </div>
</Popup>

<style lang="scss">
    @use "../styles/variables.scss" as *;

    .content {
        text-align: center;

        .delete-plan {
            font-size: 10vmin;
            margin-bottom: 5vmin;
            color: $s-color-dark;
        }
    }
</style>
