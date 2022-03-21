import type { GetRoute, PostRoute } from "../backend/routes/route";
import type { Routes } from "./routes";

export type GetApi = {
    [Path in keyof Routes as Routes[Path] extends GetRoute<any>
        ? Path
        : never]: Routes[Path] extends GetRoute<infer Response>
        ? Response
        : never;
};

export type PostApi = {
    [Path in keyof Routes as Routes[Path] extends PostRoute<any, any>
        ? Path
        : never]: Routes[Path] extends PostRoute<infer Request, infer Response>
        ? {
              request: Request;
              response: Response;
          }
        : never;
};
