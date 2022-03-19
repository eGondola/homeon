import { z } from "zod";
import { makePostRoute } from "../make-route";
import type { Database } from "../../database";
import { nanoid } from "nanoid";

export function addGroup(database: Database) {
    return makePostRoute({
        schema: z.object({
            name: z.string(),
        }),

        async handle({ name }, { login }) {
            const token = nanoid();
            await Promise.all([
                database.groups.insertOne({
                    name,
                    token,
                    plans: [],
                    list: [],
                    home: null,
                    lights: [],
                }),
                database.users.updateOne(
                    { login },
                    { $push: { groups: token } }
                ),
            ]);
            return token;
        },
    });
}
