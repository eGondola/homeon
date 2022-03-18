import type { Schema } from "zod";
import type { User } from "../../common/types";

export function makePostRoute<Request, Response>(
    handle: (request: Request, user: User) => Promise<Response>,
    schema: Schema<Request>
) {
    return async (request: unknown, session?: Session) => {
        if (session == null) throw new Error("User not logged in");
        const { user } = session;
        return handle(schema.parse(request), user);
    };
}

export type Session = {
    user: User;
};

export type Route<Response> = (
    request: unknown,
    session?: Session
) => Promise<Response>;
