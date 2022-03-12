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

#### lights
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



