import type { Api } from "../../common/api";

export async function post<T extends keyof Api>(path: T, data: Api[T]["request"]) {
    const response = await fetch(`/api/${path}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });
    const responseData: Api[T]["response"] = await response.json();
    return responseData;
}