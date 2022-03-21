import type { Express } from "express";
import type { Route } from "./routes/route";

export function addApi(
    app: Express,
    routes: Record<string, Route<unknown, unknown, unknown>>
) {
    for (const [path, route] of Object.entries(routes)) {
        const { get, post } = route;
        if (get) {
            const handle = get;
            app.get(`/api/${path}`, ({ session }, response) => {
                handleErrors(async () => {
                    if (session == null) throw new Error("User not logged in");
                    const { user } = session;
                    response.send(JSON.stringify(await handle(user)));
                });
            });
        }

        if (post) {
            const { handle, schema } = post;
            app.post(`/api/${path}`, ({ body, session }, response) => {
                handleErrors(async () => {
                    if (session == null) throw new Error("User not logged in");
                    const { user } = session;
                    const request = schema.parse(body);
                    response.send(JSON.stringify(await handle(request, user)));
                });
            });
        }
    }
}

async function handleErrors(callback: () => Promise<void>) {
    try {
        await callback();
    } catch (error) {
        console.error(error instanceof Error ? error.message : error);
    }
}
