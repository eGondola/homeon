import type { z, ZodType } from "zod";
import type * as routes from "../backend/api/routes";

type Routes = typeof routes;

export type Api = {
    [Route in keyof Routes as CamelToKebabCase<Route>]: {
        response: Awaited<ReturnType<ReturnType<Routes[Route]>>>;
        request: z.infer<Zod<Get<Routes[Route], "schema">>>;
    };
};

type Get<T, Prop> = Prop extends keyof T ? T[Prop] : never;
type ReturnType<T> = T extends (...args: any[]) => infer R ? R : never;
type Zod<T> = T extends ZodType<any, any, any> ? T : never;

// https://stackoverflow.com/questions/60269936/typescript-convert-generic-object-from-snake-to-camel-case
type CamelToKebabCase<S extends string> = S extends `${infer T}${infer U}`
    ? `${T extends Capitalize<T>
          ? "-"
          : ""}${Lowercase<T>}${CamelToKebabCase<U>}`
    : S;
