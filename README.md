# Home ON
## Setup
1. Make sure you have run `git lfs install` before
2. Clone
3. `npm i`
4. Create file .env with: `SESSION_SECRET=<secret>`, where `<secret>` is an unguessable secret string
## Development
1. Make sure you have MongoDB running
2. `npm run dev`
3. Open `localhost:3000` in the browser

## Python generate App
`auto-py-to-exe`

## Database

#### list
`
"id": ,
"text": ,
"count": ,
`

### light

#### check
`
"name": "check",
"check": false,
"isset": false
`

#### light
`
"name": "lights",
"lights": [
  {
    "name": "salon",
    "work": true
  },
  {
    "name": "kuchnia",
    "work": false
  },
  {
    "name": "sypialnia",
    "work": false
  },
  {
    "name": "łazienka",
    "work": true
  }
]
`

## Adding a POST endpoint to the typed API
1. Create file `backend/routes/my-endpoint.ts`:
```ts
import { z } from "zod";
import { makePostEndpoint } from "./route";

export function myEndpoint(/* pass objects like database here */) {
    return {
        post: makePostEndpoint({
            schema: z.object({
                // example begin
                name: z.string(),
                id: z.number(),
                // example end
            }),
            async handle({ /* params from schema */ }, { login, email }) {
                // DO STUFF HERE
                // return value is sent to the client as JSON
            },
        });
    };
}
```
2. Add this to `backend/routes/index.ts`:
```ts
export * from "./my-endpoint";
```
3. Add this to `app.ts` inside the `addApi` call:
```ts
    "my-endpoint": routes.myEndpoint(/* pass objects like database here */),
```
4. Use the endpoint in frontend code:
```ts
import * as typedApi from "../util/typed-api";

// in an async function
const json = await typedApi.post("my-endpoint", {
    // example begin
    name: "Volper",
    id: 1,
    // example end
});
```