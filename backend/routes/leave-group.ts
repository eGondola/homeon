import { z } from "zod";
import { makePostEndpoint } from "./route";
import type { Database } from "../database";

export function leaveGroup(database: Database) {
    return {
        post: makePostEndpoint({
            schema: z.object({
                token: z.string(),
            }),

            async handle({ token }, { login }) {
                await database.users.updateOne(
                    { login },
                    { $pull: { groups: token } }
                );
                const user = await database.users.findOne({
                    groups: token,
                });
                if (!user) {
                    await database.groups.deleteOne({ token });
                }
            },
        }),
    };
}
