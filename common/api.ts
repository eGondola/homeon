import type { z, ZodType } from "zod";

export type Api = MakeApi<{
    "add-group": typeof import("route:add-group");
}>;

type MakeApi<T> = {
    [K in keyof T]: {
        response: Awaited<ReturnType<ReturnType<Get<"default", T[K]>>>>;
        request: z.infer<Zod<Get<"schema", T[K]>>>;
    };
};

type Get<Prop, T> = Prop extends keyof T ? T[Prop] : never;
type ReturnType<T> = T extends (...args: any[]) => infer R ? R : never;
type Zod<T> = T extends ZodType<any, any, any> ? T : never;
