import type { Route } from "../backend/api/make-route";
import type * as routes from "../backend/api/routes";

type Routes = typeof routes;

export type Api = {
    [Path in keyof Routes as CamelToKebabCase<Path>]: Endpoint<
        ReturnTypeConditional<Routes[Path]>
    >;
};

type Endpoint<Endpoint> = Endpoint extends Route<infer Request, infer Response>
    ? {
          request: Request;
          response: Response;
      }
    : never;

type ReturnTypeConditional<T> = T extends (...args: never[]) => infer Return
    ? Return
    : never;

// https://stackoverflow.com/questions/60269936/typescript-convert-generic-object-from-snake-to-camel-case
type CamelToKebabCase<S extends string> = S extends `${infer T}${infer U}`
    ? `${T extends Capitalize<T>
          ? "-"
          : ""}${Lowercase<T>}${CamelToKebabCase<U>}`
    : S;
