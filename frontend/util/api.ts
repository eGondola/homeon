const apiPath = "/api/";

export async function get(path: string) {
    const response = await fetch(apiPath + path);
    return response.json();
}

export async function post(path: string, data: object) {
    await fetch(apiPath + path, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });
}
