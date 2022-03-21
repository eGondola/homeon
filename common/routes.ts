import type * as routes from "../backend/routes";

export type Routes = {
    [Name in keyof RouteFactories as CamelToKebabCase<Name>]: ReturnType<
        RouteFactories[Name]
    >;
};

type RouteFactories = typeof routes;

// https://stackoverflow.com/questions/60269936/typescript-convert-generic-object-from-snake-to-camel-case
type CamelToKebabCase<S extends string> = S extends `${infer T}${infer U}`
    ? `${T extends Capitalize<T>
          ? "-"
          : ""}${Lowercase<T>}${CamelToKebabCase<U>}`
    : S;
