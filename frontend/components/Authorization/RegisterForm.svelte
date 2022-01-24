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
    let email = "";

    async function submit() {
        info = await postJson("/register", { login, password, email });
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
    <span>
        <input id="email" type="email" bind:value={email} required />
        <label for="email">Email</label>
    </span>

    <p>{info}</p>
    <button type="submit">Zarejestruj</button>
</form>

<style lang="scss">
    @import "../../styles/Authorization.scss";
</style>
