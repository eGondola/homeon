<script type="ts">
    import type { Writable } from "svelte/store";
    import { getContext } from 'svelte';
    import type { User, position } from "../../common/types";

    const user = getContext<Writable<User>>("user");
    const positions = getContext<Writable<position[]>>("positions");
    console.log($positions);
    
</script>
{$user.login}
<br>
{$user.email}
<br>
{#each $positions as position}
    {position.login}
    <br>
    x: {position.position.x}
    y: {position.position.y}
    <br>
{/each}