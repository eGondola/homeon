import type { Schema } from "zod";
import type { User } from "../../common/types";

export function makePostRoute<Request, Response>(
    route: Route<Request, Response>
) {
    return route;
}

export type Route<Request, Response> = {
    handle(request: Request, user: User): Promise<Response>;
    schema: Schema<Request>;
};
