# THE SCENE — playable vertical slice

The canonical design and visual handoff is in `docs/handoff/`. The playable browser game is in `app/`. This is a prototype for evaluation, not a public music service or the final 3D art build.

## Run the game

Requires Node.js with `node:sqlite` support (Node 22.13+).

```powershell
cd app
npm ci
npm run dev -- --host 127.0.0.1
```

Open `http://127.0.0.1:5173/`. Use WASD or the touch pad to walk, drag the 3D view to turn, and tap ground to walk there. Use Map or Desk to select a route, then walk to the destination and interact.

## Five-minute demo route

1. Walk to the Music Square listening kiosk. Choose Play to hear the original synthesized Square Sketch, then save it privately.
2. Open Map and route to City Studio. Walk to the studio door and enter.
3. At the producer desk, edit both beat sections, play them, and render a 30-second WAV master.
4. Leave the studio, route to Release House, and create a private sleeve draft at Record Intake.
5. Return to the square, enter Palm Room, and preview your master on stage with lighting. Audio plays on your device only.

The local guest save uses SQLite under ignored `app/data/`. Beat and sleeve drafts are stored on this browser. Connected session avatars are anonymous WebSocket presence, not verified players. No lease, public release, payments, chat, licensed catalogue, or cross-game SDK integration occurs.

## Verify the built game

```powershell
cd app
npm test
npm run build
npm start
```

The built-game server starts at `http://127.0.0.1:4173/` with the guest API and presence service. Set `PORT` and `HOST` for a host that runs Node.js and provides persistent storage for `app/data/`. See [M0 progress](M0_PROGRESS.md) for evidence and open quality gates.
