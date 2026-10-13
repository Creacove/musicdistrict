# M0 progress — 12 October 2026

## Repository audit

- **Existing THE SCENE code:** absent. Founder confirmed that there is no existing repository. This repository was initialized from the v2.1 handoff and a new Vite/TypeScript app.
- **Design:** present in `docs/handoff/`, including the Master GDD, Chapters 0–10, quality gates, asset brief, and 27 reference images.
- **Runtime assets:** absent from the handoff. No GLB rigs, animations, licensed tracks, or loop packs were supplied.
- **Deployment, hosting, database, auth, SDK:** absent or unverified. No staging URL exists.
- **Reusable game code:** absent. The new prototype uses Three.js and authored primitive geometry.

## Implemented locally

- Small actual 3D Music Square with a controllable placeholder avatar, camera, mobile touch pad, listening kiosk, studio door, and contextual Desk route hint.
- Separate Play, Stop, and Save controls for the kiosk's original synthesized preview. Save lasts for the current page session only.
- Browser audio starts on the user's Play action; generated notes use no audio file or external rights claim.
- No economy, contracts, user uploads, official charts, or fake multiplayer counts.

## Verified

- `npm run build` in `app/` succeeded after the browser fixes on 12 October 2026. Output JS was 544.29 kB uncompressed / 137.25 kB gzip; CSS was 3.63 kB / 1.39 kB gzip. Vite warned that the main JS chunk exceeds 500 kB.
- Local Vite server started at `http://127.0.0.1:5173/`.
- In-app browser inspection confirmed the rendered mobile scene, touch movement, kiosk proximity panel, Play changing audio state to ON, explicit Save changing to Saved, Stop changing audio state to OFF, and Desk showing a contextual route after the save. The browser screenshot revealed a touch-pad/Desk overlap and a bench beneath the spawn; both were corrected and visually rechecked.
- The browser log contained two historical Three.js deprecation warnings from before the code fix. No browser error was observed in the tested flow. A separate desktop Chrome session timed out, so desktop rendering remains unverified.
- Audio output itself, FPS, cold load, and phone thermals are **not yet measured**.

## Risks and blockers

1. Prototype collision and navigation are rudimentary; camera can intersect geometry and the avatar can walk through props.
2. Audio is a placeholder tone, not cleared music; rights-approved test tracks and loop packs are needed for song discovery and creation.
3. No suitable rigged avatar or locomotion clips; authored placeholders cannot validate the final asset pipeline.
4. No server, identity, real player presence, chat safety, or reconnect path; multiplayer must use authoritative state and real people.
5. No actual mobile hardware measurements; renderer and scene budget are provisional.
6. No hosting or staging deployment to verify.

## Next visual and interaction slice — 12 October 2026

The repository now has a root `AGENTS.md` pointing to the authoritative handoff. This slice follows `docs/handoff/AGENTS.md`, the Master GDD, Chapter 01 Venue Operator, `implementation/REFERENCE_LOOKUP.md`, `implementation/REFERENCE_TRUTH_TABLE.md`, the visual and screen-state notes, and the asset and animation brief. References V26 and V27 guided composition only; no screenshot was used as a runtime texture or source of prices, capacity, or presence.

- Authored a richer low-poly Music Square and a separate Palm Room interior with stage, bar, seating, mixing desk, and exit. Players use world movement and a physical entrance to reach the hall.
- Added a venue information card and rule-based Desk Today/Ask/Plans guidance. Lease remains disabled because there is no authoritative quote, ledger, contract, or server state. No fabricated player count or venue capacity is shown.
- Added a stage floor-light snap-point **preview**. The light can be shown or hidden locally; it is explicitly not owned, installed, or saved. Actual placement awaits authorised inventory and server persistence.
- Added hotspot model tests for physical entrance proximity and venue-only interactions. The live in-app browser displayed the Music Square and Palm Room stage, and showed the preview state and explanatory copy after interaction.
- Simplified Palm Room dynamic lighting by removing five spotlights, the violet fill light, and four candle point lights. Real device performance remains unmeasured.
- `npm.cmd test`: 2 hotspot tests passed. `npm.cmd run build`: succeeded; JS 559.46 kB / 142.89 kB gzip and CSS 13.14 kB / 3.69 kB gzip. Vite still warns that the main JS chunk exceeds 500 kB.

**Remaining:** These are stylized blockout scenes, well short of V26/V27 production art. The current browser inspection does not establish a complete normal walk from square to hall; the `?qa=palm` and `?qa=stage` query flags are local visual test entries. Scene assets are not yet split into scene-specific downloads, and there are no rigged characters, cleared music, multiplayer, server-backed lease/equipment state, FPS or network measurements, or real-device checks. None of the M0 exit gates are claimed complete.

## M0 measurement slice — 13 October 2026

- Audited the source ZIP against the extracted `docs/handoff/`: all 71 archive files are present. The 70 content entries in `FILE_INVENTORY.json` match extracted file sizes and SHA-256 hashes; the remaining archive entry is the inventory itself.
- Followed `implementation/QUALITY_GATES.md` M0 and `implementation/PERFORMANCE_MEDIA_BUDGET.md` by adding browser-session frame median/p95, reported transfer, and first rendered avatar time to a Phone display panel. Data Saver, Balanced, and Quality adjust render pixel ratio and shadow use; the selected tier persists locally.
- In the live in-app browser, the panel showed the three quality controls and measurements. Data Saver became selected after clicking it. One development-server session reported roughly 19 ms median frame time, 32 ms p95, 6,184 KiB browser-reported transfer, and 3.71 s until the first avatar render. This is **not** a cold production build or a real-device result; the development server serves unbundled code.
- `npm.cmd test` passed 3 tests. `npm.cmd run build` passed with JS 562.02 kB / 143.79 kB gzip and CSS 14.18 kB / 3.89 kB gzip. The >500 kB JS warning remains.

**Still required for M0:** measured production cold and return visits on target Android and iPhone hardware, sustained frame times and heat, quality fallback, actual byte transfer, audio behavior, rigged avatar/animations, cleared music, one reliable travel transition, and authoritative multiplayer/reconnect. The in-browser measurements only establish a starting baseline.

## Release House and local master — 13 October 2026

Following Chapter 02 Artist §7.3 and the V10 reference, Music Square now has a Release House entrance and a separate walkable 3D intake room with an artwork wall, record counter and listening station. The intake screen supports a private sleeve title, artist name and draft colour, stored locally. Its checklist identifies missing items and keeps public submission and Friday scheduling unavailable until authorised rights, contributor and server services exist. V10's pictured listener forecasts, player count and money figures were not implemented as game data.

City Studio now has distinct A/B beat sections and renders an original 30-second mono WAV. A changed second section is required. The private master is stored in IndexedDB and can be played at Release House; a successful local render removes the master blocker there. This is an original synthesized prototype, not a cleared production loop pack or public song. The browser showed the Studio render success, then showed the local master available at Release House with the rights and server blockers still present. The browser also showed playback start.

Verification after the final audio-control change: 8 tests passed, the production build succeeded, and the in-app browser showed the master loading after reload, Play changing audio to ON, and the header control returning it to OFF. The main JS bundle remains above Vite's 500 kB warning threshold; mobile production transfer and device performance remain unmeasured.

The world now supports tap-to-walk on the ground, with manual movement cancelling the target. In the browser, the avatar walked through Music Square to the physical Release House entrance, opened its interaction, and entered the room. The Release House and Studio exits were moved beside the entry camera path; the browser shows the Release House counter, artwork wall and listening station unobstructed on entry. The ordinary Studio and Palm Room exterior walks still need browser passes.

## District map and connected routes — 13 October 2026

The Map controls now open a district map with the avatar's current square position and the four playable destinations: City Studio, Release House, Palm Room and the listening station. Selecting a place creates a physical route to its hotspot and a visible ground marker; it does not enter a room or spend currency. From an interior, selecting another destination first directs the player to the physical exit, then continues the route from Music Square after they interact with that exit. Cancel clears both route legs. In the browser, the map and a City Studio route rendered in Music Square; selecting City Studio inside Release House displayed the Release Exit as the first leg. The full two-leg walk still needs a browser pass.

The Music Square blockout also gained paved approaches to all three doors, timber awnings, a physical direction sign and edge seating. The browser showed the revised square and the map at a narrow mobile viewport. These are authored prototype meshes, not the production assets or final reference fidelity.

## Voluntary listening and private save — 13 October 2026

The Music Square kiosk now presents the original synthesized demo as “Square Sketch.” Choosing Play opens a compact personal player; saving adds one private item to this browser's local storage. The player can pause and resume while exploring. The save does not create a public artist follow, chart credit, qualified listen or server catalogue record. In the browser, walking to the kiosk exposed Interact, Play changed audio to ON and opened the personal player, Save changed to a saved state, and reload preserved the save while audio remained OFF. The authorised song catalogue, rights review and account-level saved collection still require backend and cleared media.

A free Dance control now animates the local avatar in place, with a Stop control and walking interruption. The mobile browser showed the control enter its active state and the avatar motion. It is a local player expression; other players cannot see it until real multiplayer state exists.

Music Square gained a layered street edge with warm window materials, arcade columns and a secondary sign line. The browser showed a fuller skyline behind the walkable stage at mobile width. This remains hand-built blockout art; rigged characters, real crowd presence, baked lighting and device performance need production work.

## Local connected-session presence foundation — 13 October 2026

A small WebSocket service attached to the Vite development and preview servers now sends guest session join, movement, dance and leave messages. The browser renders other connected sessions as local avatar clones in the same room and shows a count based on active sockets. Reconnection clears stale local avatars. The server validates message shape, location and coordinates and limits move broadcasts; a two-client protocol test verified empty welcome, join, movement and leave. The in-app browser showed the live connected-session count after restarting the development server. This is **anonymous guest-session presence**, not verified distinct humans, persistent identity, account-level social state or production multiplayer infrastructure. Text chat, privacy/safety controls, server-authenticated movement, 20-player load testing and database-backed identity remain open M1 work.

## Local SQLite guest saves — 13 October 2026

The Vite development/preview process now serves a small guest API backed by a local SQLite file under ignored `app/data/`. It creates or resumes an opaque guest token, stores only a unique saved item ID for Square Sketch, and rejects unauthenticated save reads/writes. Existing device saves sync once when the browser loads. If the API is unavailable, the local demo save remains usable and explicitly reports that server sync failed. In the browser, the game rendered after the API was added; the local database contained one guest and one saved item after loading the existing saved preview. The API test verified unauthorised rejection, duplicate-save idempotency, and resume. Node's SQLite module is experimental in this runtime. This is not a production account, moderation database, cleared song catalogue or verified human identity.

## City Studio playable slice — 13 October 2026

Following Master GDD §§3, 6 and Chapter 02 Artist (ART-21 and Slice 0/1), City Studio is now a separate walkable 3D room reached through the physical square door. Its producer desk opens an eight-step, four-lane beat pattern. Players can change pads, play original synthesized sounds, stop playback, and save one private pattern in browser local storage. Desk routes to the studio door or desk. The vocal booth is a spatial landmark only; no microphone request, public release, chart entry, or rights claim is made.

Five tests pass and the production build succeeds. In the live browser, the studio and beat desk rendered, a pad changed, Play switched to Stop, Save confirmed a private local draft, and the changed pad remained after reload. The browser used the development-only `?qa=beat` entry to inspect the room; the full ordinary walk from the square door remains to be browser-verified. This is a short pattern prototype, not the Chapter 02 submit-ready 30-second, two-section saved arrangement or a server-backed project. Cleared loop packs, render/export, consent, rights review and device audio checks remain open.

## World solidity and Palm Room stage performance slice — 13 October 2026

Addressing Risk #1 from the repository audit (rudimentary collision and camera clipping), the world now enforces obstacle boundaries and continuous sliding collision across Music Square and all three interiors:

- **Obstacle bounds & sliding physics:** Defined exact bounding boxes and cylindrical obstacles in `worldModel.ts` matching the visual geometry:
  - **Music Square:** Kiosk structure, covered stage platform and backdrop, Palm Room/City Studio/Release House building fronts, planters, benches, and signpost.
  - **Palm Room:** Stage wings, backstage barrier, bar counter, lounge tables, and mixing workstation.
  - **City Studio:** Producer desk and vocal booth structure.
  - **Release House:** Record intake counter and listening booth.
- **Direction-aware sliding:** Avatar motion resolves axis-by-axis against obstacles so pushing into walls, desks, or planters smoothly preserves motion along the open axis without penetration or sticking.
- **Tap-to-walk obstacle rejection:** Clicking inside or too close to an obstacle rejects the walk target with an immediate user toast notification.
- **Camera boundary clamping:** The third-person follow camera clamps against room perimeters, preventing clipping outside interior walls when rotating yaw.
- **Palm Room stage performance loop:**
  - Added physical access steps to the Palm Room stage platform so avatars can walk directly up onto the stage.
  - When on the stage platform (`location === 'venue'` and on the stage platform), the avatar's vertical height smoothly rises onto the 0.78 m platform.
  - Added stage performance lighting (spotlight, fill light, stage glow).
  - When a player has rendered a 30-second WAV master in City Studio, stepping up to the stage enables a local stage preview. Audio plays on that player's device with active stage lighting; it is not broadcast to other sessions.
  - Desk Phase 1 guidance now highlights stage performance when a master exists.
- **Presence room filtering:** Remote player avatar instances now re-filter immediately upon entering or leaving any interior room.
- **Verification:** 14 automated tests pass (`npm test`), including 4 new obstacle collision and boundary tests. Production build (`npm run build`) succeeded with TypeScript compilation. Local Vite server verified responsive on port 5173.

**Remaining gaps:** Scene bundle splitting (main JS chunk is ~598 kB uncompressed / 154 kB gzip, exceeding Vite's 500 kB advisory limit); licensed 3D avatar rig and locomotion animations; cleared production loop packs and licensed tracks; mobile production transfer and hardware thermal testing; persistent player identity and authoritative server-side multiplayer state.

## Smallest next PR sequence

1. **M0/M1 bundle & scene splitting:** Dynamically load interior rooms and audio synthesis modules to bring initial client JS below 500 kB uncompressed.
2. **M0 asset/audio proof:** licensed prototype avatar/animations and cleared test song; manifest with source, rights, expiry, size, and device measurements.
3. **M1 identity/presence:** trusted server, two real players in one square, reconnect and basic safety controls (chat/emotes/reporting).
4. **M1 discovery:** kiosk with explicit playback and a persisted save action, failure/expiry states, and zero-money path.
5. **M2 creation preview:** walk to City Studio and use a small workstation with approved loops.

Do not claim M0 exit until the device, audio, reconnect, rights, and staging checks in `docs/handoff/implementation/QUALITY_GATES.md` pass.

