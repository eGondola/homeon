import type { PostApi, GetApi } from "../../common/api";

export async function post<T extends keyof PostApi>(
    path: T,
    data: PostApi[T]["request"]
) {
    const response = await fetch(`/api/${path}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });
    const responseData: PostApi[T]["response"] = await response.json();
    return responseData;
}

export async function get<T extends keyof GetApi>(path: T) {
    const response = await fetch(`/api/${path}`);
    const responseData: GetApi[T] = await response.json();
    return responseData;
}
