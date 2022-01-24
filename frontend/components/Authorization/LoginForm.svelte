<script type="ts">
    async function postJson(url: any, data: any) {
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });

        return response.text();
    }

    let info = "";
    let login = "";
    let password = "";

    async function submit() {
        const response = await postJson("/login", { login, password });
        if (response) {
            info = response;
        } else {
            location.reload();
        }
    }
</script>

<form class="form" on:submit|preventDefault={submit}>
    <span>
        <input id="login" type="text" bind:value={login} required />
        <label for="login">Login</label>
    </span>
    <span>
        <input id="password" type="password" bind:value={password} required />
        <label for="password">Hasło</label>
    </span>
    <p>{info}</p>
    <button type="submit">Zaloguj</button>
</form>

<style lang="scss">
    @import "../../styles/Authorization.scss";
</style>
