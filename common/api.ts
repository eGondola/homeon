import type { z, ZodType } from "zod";
import type * as addGroup from "../backend/api/routes/add-group";

export type Api = MakeApi<{
    "add-group": typeof addGroup;
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
