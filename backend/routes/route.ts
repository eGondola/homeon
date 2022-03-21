import type { Schema } from "zod";
import type { User } from "../../common/types";

export type Route<GetResponse, PostRequest, PostResponse> = Partial<
    GetRoute<GetResponse> & PostRoute<PostRequest, PostResponse>
>;

export type GetRoute<Response> = {
    get: GetEndpoint<Response>;
};

export type PostRoute<Request, Response> = {
    post: PostEndpoint<Request, Response>;
};

export function makeGetEndpoint<Response>(endpoint: GetEndpoint<Response>) {
    return endpoint;
}

export function makePostEndpoint<Request, Response>(
    endpoint: PostEndpoint<Request, Response>
) {
    return endpoint;
}

type GetEndpoint<Response> = (user: User) => Promise<Response>;

type PostEndpoint<Request, Response> = {
    handle(request: Request, user: User): Promise<Response>;
    schema: Schema<Request>;
};
