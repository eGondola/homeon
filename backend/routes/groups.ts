import type { Database } from "backend/database";
import { makeGetEndpoint } from "./route";

export function groups(database: Database) {
    return {
        get: makeGetEndpoint(async ({ login }) => {
            const user = await database.users.findOne({
                login,
            });
            return await database.groups
                .find({ token: { $in: user?.groups } })
                .toArray();
        }),
    };
}
