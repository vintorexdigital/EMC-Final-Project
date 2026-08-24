# Peer Project Hub

An MVP implementation of the EMC Final Assessment: students publish coding projects, discover projects, and comment on projects shared by peers.

## Run locally

1. Copy `server/.env.example` to `server/.env` and add MongoDB/Firebase values.
2. Copy `client/.env.example` to `client/.env` and add Firebase web-app values.
3. Run `npm install` followed by `npm run dev`.

The API runs on `http://localhost:5000` and the Vite client on `http://localhost:5173`.

Firebase authentication is optional during initial UI development: when Firebase values are absent, the client uses a clearly labelled demo session. Production deployments must configure Firebase and enable backend token verification.
