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

The production browser playthrough exposed a planter blocking a direct tap target. Tap-to-walk and Map/Desk routes now find walkable waypoints around scene obstacles and move the avatar to the physical interaction point; manual movement still takes control. Browser verification followed the Map route to City Studio, walked to the beat desk, rendered a 30-second master, routed through the studio exit to Release House, and entered Palm Room. The stage preview initially stopped during its own sheet refresh; that shared close behavior is now separated. The rebuilt browser showed the Palm Room stage, active preview lights, audio ON, and a Stop preview control while the local master played. Seventeen automated tests pass, including three pathfinding tests. This remains local playback, not a concert broadcast.

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

## Interior scene and audio renderer bundle splitting slice — 13 October 2026

Addressing PR sequence #1 and low-data mobile performance requirements (`PERFORMANCE_MEDIA_BUDGET.md` §3 "Initial JS/CSS transfer ≤550 KiB compressed / break into route chunks"):

- **Vendor separation:** Configured Vite/Rolldown build with dynamic module chunking separating Three.js (`dist/assets/three-*.js`, 542 kB uncompressed / 135 kB gzip) into a cached vendor chunk so app code updates don't invalidate engine cache.
- **Dynamic room geometry loading:** Extracted Palm Room into `palmWorld.ts` (`dist/assets/palmWorld-*.js`, 4.9 kB uncompressed / 2.45 kB gzip). Interiors for Palm Room, City Studio (`studioWorld-*.js`, 1.8 kB), and Release House (`releaseWorld-*.js`, 1.8 kB) are now loaded strictly on demand via dynamic `import()` upon entrance.
- **Async audio export:** Extracted the 30-second WAV PCM synthesis engine into `renderMaster.ts` (`dist/assets/renderMaster-*.js`, 0.9 kB). This heavy numerical synthesis module is loaded only when the player triggers master rendering at the City Studio producer desk.
- **Initial app bundle reduced to 58.05 kB:** The main application entry chunk dropped from **~600 kB** to **58.05 kB** (20.47 kB gzip) — well below Vite's 500 kB advisory threshold and well within the mobile cold-load budget.
- **Verification:** All 18 automated tests pass (`npm test`). Production build succeeds cleanly (`npm run build`).

## Live social presence emotes and reactions slice — 13 October 2026

Addressing Chapter 05 Fan & Social Experience (§1.1 Invariants, §2 "Be with people", and Quality Gates M1 social controls):

- **Live presence emote broadcast:** Extended the WebSocket presence server (`presence.mjs`) to handle validated social reaction messages (`type: 'emote'`). Permitted emotes (`cheer`, `wave`, `heart`, `fire`) broadcast in real time to all connected players in the instance without fabricating artificial player reactions.
- **Client presence communication:** Upgraded `connectPresence` in `presence.ts` to expose `sendEmote(emote: EmoteType)` and receive remote peer emotes via an `onEmote` event callback.
- **3D overhead emote bubble billboards:** Created an emote rendering system in Three.js with dynamic canvas textures for Cheer 🙌, Wave 👋, Love ❤️, and Fire 🔥. Overhead billboards appear above the reacting avatar (both local avatar and remote connected players) with auto-dismissal after 3.2 seconds.
- **Responsive mobile reaction HUD:** Added a mobile-accessible reaction tray with quick-tap reaction buttons (`cheer`, `wave`, `heart`, `fire`) positioned above the bottom nav and alongside the dance toggle.
- **Automated test suite:** Added real-time emote broadcast and validation tests in `presence.test.mjs`. All 18 automated tests pass (`npm test`). Production build succeeds cleanly (`npm run build`).

## Music Discovery and persistent catalogue save slice — 13 October 2026

Addressing Chapter 07 Music Discovery & Charts (§1 ID MUS-01/06/11/15, §2 "Walk -> Notice -> Hear -> Choose -> Remember", and Quality Gates M1 discovery):

- **Catalogue API & multi-track discovery:** Added `/api/catalogue` endpoint in `guestStore.mjs` serving verified music metadata (Title, Artist, Genre, Duration) for playable recordings (`Square Sketch` and `Golden Hour Jam`).
- **Interactive Listening Kiosk:** Upgraded the physical Music Square listening kiosk interaction (`interact()`) to show real metadata for the selected catalogue track, with immediate playback previews and save state inspection.
- **Personal mini-player track controls:** Enhanced the persistent HUD mini-player with `Previous` and `Next` track buttons, allowing continuous private soundtrack listening and exploration across the district.
- **Idempotent save & remove persistence:** Added `DELETE /api/saves/:id` endpoint and updated SQLite guest storage. Players can bookmark tracks privately (`♥` / `♡`) with changes synced to the server without fabricating public popularity counts or forcing purchases.
- **Synthesized track melodies:** Added audio synthesis variations per track (`sine` for Square Sketch, `triangle` for Golden Hour Jam) ensuring zero external audio preloading before user interaction.
- **Verification:** All 18 automated tests pass (`npm test`), including catalogue retrieval and save deletion assertions in `guestStore.test.mjs`. Production build succeeds cleanly (`npm run build`).

## Smallest next PR sequence

1. **M0 asset/audio proof:** licensed prototype avatar/animations and cleared test song; manifest with source, rights, expiry, size, and device measurements.
2. **M1 identity/presence:** trusted server, two real players in one square, reconnect and basic safety controls (chat/emotes/reporting).
3. **M2 creation preview:** walk to City Studio and use a small workstation with approved loops.

Do not claim M0 exit until the device, audio, reconnect, rights, and staging checks in `docs/handoff/implementation/QUALITY_GATES.md` pass.

## Reconnect resilience and presence health indicator — 13 October 2026

Addressing M1 identity/presence quality gate (reconnect path) and QUALITY_GATES.md §M1 social controls:

- **Exponential backoff:** WebSocket reconnect delay doubles on each successive close: 1500 ms → 3000 → 6000 → 12000 → 24000 → 30000 ms cap. Backoff resets to 1500 ms on successful open.
- **Attempt counter:** `reconnectAttempts` increments on each scheduled retry, resets to 0 on open. Passed as a third argument to the `onPlayers` callback so the UI can display it without a separate event channel.
- **Status copy:** Presence status div now shows `"Connecting to Music Square."` on first connect, `"X other connected sessions here"` when live, and `"Offline · reconnecting (attempt N)…"` with the live attempt number during outages.
- **Server reconnect test:** Added `reconnecting client gets fresh welcome without stale avatars` — closes socket A, waits 50 ms for the server to remove it, verifies socket B receives an empty player list (no ghost avatars from terminated sessions).
- **Pure backoff logic test:** `exponential backoff doubles delay up to 30 s cap` — asserts the sequence `[1500, 3000, 6000, 12000, 24000, 30000]` without any WebSocket dependency.
- **Verification:** All 20 automated tests pass (`npm test`). Production build succeeds cleanly (`npm run build`). App bundle: 65.42 kB / 22.49 kB gzip.

## Avatar appearance customisation slice — 13 October 2026

Addressing M1 identity differentiation (Chapter 05 Fan & Social §1.1 "be distinct") with a fully local, zero-rights-required feature:

- **Appearance sheet:** Tapping the People nav button now opens an "Appearance" panel (previously just toasted presence status). The sheet shows a swatch grid for skin tone (5 options), shirt colour (6 options), and trouser colour (6 options).
- **Live Three.js material update:** `applyAppearance()` calls `material.color.set(hex)` on the `skin`, `shirt`, and `trousers` MeshStandardMaterial instances — changes are visible on the avatar in the 3D scene immediately without a reload.
- **localStorage persistence:** Each selection writes to `scene-skin`, `scene-shirt`, and `scene-trousers` keys and is reapplied on every page load before the first frame renders.
- **aria-pressed ring:** The active swatch in each row gets `aria-pressed="true"` and a white border + glow ring via CSS so the selection is accessible and clear.
- **Preview label:** The panel includes a clear disclosure: "Saved locally — not visible to others until real multiplayer identity exists." No server state, no account identity, no fabricated presence.
- **Verification:** All 20 automated tests pass (`npm test`). Production build succeeds cleanly (`npm run build`). CSS bundle: 25.25 kB / 6.29 kB gzip.

## Smallest next PR sequence (updated)

1. **M0 asset/audio proof:** licensed prototype avatar/animations and cleared test song; manifest with source, rights, expiry, size, and device measurements.
2. **M1 identity/presence safety controls:** mute/block UI for connected players, basic chat safety.
3. **M1 trusted server:** authenticated WebSocket session token, server-authoritative position.
4. **M2 creation preview:** walk to City Studio and use a small workstation with approved loops.

Do not claim M0 exit until the device, audio, reconnect, rights, and staging checks in `docs/handoff/implementation/QUALITY_GATES.md` pass.

## M2 private release preview export — 13 October 2026

Following the M2 release-flow slice: Record Intake now exports an original, locally rendered 1200 × 1200 PNG sleeve from the selected Lagos palette, title, artist, and genre. When a private 30-second master exists, the player can also download its WAV. Both exports stay on-device; neither action submits or publishes a release. The sleeve source is authored SVG with escaped player text, and a unit test checks its markup and escaping. The rights checklist and authoritative server submission gate remain in place.

## Safety controls: mute / ignore a connected session — 13 October 2026

Addressing Chapter 05 Fan & Social §1.1 Invariants and QUALITY_GATES.md M1 social controls (mute/block/report preview):

- **Tap-to-mute:** Tapping a remote avatar in the 3D scene opens a floating "Player options" popover above the tap point. The popover shows a **🔇 Mute** button and a Cancel button. Tapping Mute a second time shows **🔊 Unmute**. No accidental mutes — a dedicated button is required.
- **Emote suppression:** Once muted, incoming emote broadcasts for that session ID are discarded in `handleIncomingEmote` before any bubble is created or shown.
- **Visual dim:** Muted remote avatar meshes have their material color scaled to 0.35 (dark ghost appearance) so the player knows who is muted. The dim is applied immediately on mute and re-applied if the session rejoins while still muted.
- **Local only:** `mutedIds` is a runtime `Set<string>` — not persisted, not sent to the server, not visible to other players. The popover explicitly states "Local only · not visible to others · no server action."
- **Avatar raycasting:** The `pointerup` handler now raycasts against all remote avatar meshes before checking the ground plane — a hit shows the popover instead of issuing a walk command.
- **Popover dismiss:** Tapping anywhere outside the popover (next `pointerup` event) dismisses it. The touch pad is unaffected.
- **Verification:** All 20 automated tests pass (`npm test`). Production build succeeds cleanly (`npm run build`). App bundle: 67.02 kB / 23.07 kB gzip.

## Player display name & overhead 3D name tag slice — 13 October 2026

Addressing Chapter 05 Fan & Social §1.1 Invariants, "Be with people", and Quality Gates M1 identity differentiation:

- **Display name field:** Added a "Display name" input (max 16 chars) to the Appearance sheet (`nav-people`). Persisted in `localStorage` under `scene-player-name` with fallback to `"Guest"`.
- **Overhead 3D billboard name tag:** Created dynamic 256x64 2D canvas textures rendered onto Three.js `Sprite` billboards positioned at `y = 2.88` directly above the avatar's head and below emote reaction bubbles.
- **Presence name synchronization:** Updated the WebSocket server (`presence.mjs`) to store and broadcast sanitized 16-character player names on join and move events. Verified with an automated test in `presence.test.mjs`.
- **Contextual player safety:** The safety popover (`showMutePopover`) now highlights the specific player's display name (`targetPlayer.name`) when inspecting or muting a connected session.
- **Remote avatar isolation:** Remote avatar cloning now strips sprite children to prevent duplicate name tags, managing dedicated billboards through the `nameTags` collection with automatic cleanup on disconnect/room transition.
- **Verification:** All 21 automated tests pass (`npm test`), including display name clamping and broadcast assertions. Production build succeeds cleanly (`npm run build`). App bundle: 68.55 kB / 23.44 kB gzip.

## Proximity quick-chat & 3D speech bubble slice — 13 October 2026

Addressing Chapter 05 Fan & Social §11.2 "Local text chat", §1.1 Invariants ("Blocks, privacy settings, rights withdrawals and moderation checks apply across world interaction, chat"), and Quality Gates M1 social controls:

- **Proximity speech bubbles:** Authored a dynamic 512×128 canvas speech bubble renderer (`createSpeechBubbleTexture`) generating stylized dark rounded speech bubbles with bottom tails, rendered as Three.js `Sprite` billboards directly above avatars (`y = 3.45`) with 4.2-second auto-dismiss timers.
- **Quick phrases & custom shout tray:** Added a chat trigger (`💬 Chat`) adjacent to the emote bar opening a quick-phrase panel featuring 6 music-scene quick phrases ("Yo! 👋", "Nice beat! 🔥", "Heading to Studio 🎧", "Meet at Palm Room 🌴", "Vibing here ✨", "Check out the sound! 🎶") plus a sanitized custom shout input (max 40 chars).
- **Transient chat feed:** Integrated a mobile-friendly overlay HUD displaying the last 4 recent messages with author attribution and smooth fade-out.
- **Server rate limiting & validation:** Upgraded `presence.mjs` to handle `{ type: 'chat', text }` with server-side 600 ms throttles and 40-character length clamping, broadcasting author name and message across the instance. Verified via an automated test in `presence.test.mjs`.
- **Full safety mute suppression:** When a player mutes an avatar (via tap-to-mute), both their 3D overhead speech bubbles and their incoming chat feed entries are immediately suppressed, and any active bubble is dismissed.
- **Verification:** All 22 automated tests pass (`npm test`). Production build succeeds cleanly (`npm run build`). App bundle: 71.81 kB / 24.29 kB gzip; CSS bundle: 27.90 kB / 6.82 kB gzip.

## Authored daylight / evening / night atmosphere modes slice — 13 October 2026

Addressing `QUALITY_GATES.md` §M1 requirement ("One attractive daylight/evening Music Square (both authored lighting variants)") and Founder design checkpoints ("Founder approves: main day & night palettes"):

- **Authored lighting presets (`lighting.ts`):** Created 3 authored time-of-day atmospheric presets:
  1. **Daylight (☀):** Azure Lagos morning sky (`#5a7e9e`), bright high sun (`[-4, 22, 6]`, intensity 2.3), crisp balanced hemisphere fill (`#f0f5fc` / `#8a7460`), exposure 1.12.
  2. **Golden Hour (🌅):** Rich warm sunset palette (`#413243`), peach low sun angle (`[-8, 16, 9]`, intensity 2.0), amber warm ambient (`#d9e2ed` / `#72523d`), exposure 1.16.
  3. **Night Vibe (🌙):** Deep nocturnal Lagos purple (`#161320`), indigo lunar directional backlight (`[10, 14, -8]`, intensity 0.9), violet street mood ambient (`#3a2d55` / `#1a1422`), exposure 1.25.
- **Top bar clock toggle:** Turned the top bar `.clock` pill into an interactive quick-toggle (`#time-toggle`) with active feedback. Tapping the clock smoothly cycles between Daylight ☀, Golden Hour 🌅, and Night Neon 🌙 with toast feedback.
- **Display & data settings selector:** Added dedicated lighting atmosphere buttons (`[data-lighting]`) to the Display & Data settings sheet (`Phone` nav button) with `aria-pressed` indicators matching render quality controls.
- **Persistence:** Time-of-day choice is saved locally under `scene-lighting` in `localStorage` and restored automatically on load.
- **Automated test coverage:** Created `lighting.test.ts` asserting non-empty labels, positive light intensities, distinct sun angles/background colors between daylight and golden hour, and clean mode cycling.
- **Verification:** All 24 automated tests pass (`npm test`). Production build succeeds cleanly (`npm run build`). App bundle: 73.88 kB / 25.01 kB gzip; CSS bundle: 28.04 kB / 6.84 kB gzip.

## M1 trusted server & authoritative validation slice — 13 October 2026

Addressing `QUALITY_GATES.md` §M1 requirement ("Trusted-server boundaries: position/movement validation on server; clients cannot spoof player count or bypass room rules"):

- **Authenticated WebSocket session handshakes:**
  - Extended `/presence` WebSocket connection handler in `presence.mjs` to accept `?token=` query parameters checked against the SQLite guest store (`store.resume(token)`).
  - Implemented `{ type: 'auth', token }` post-handshake message allowing client apps to seamlessly promote active WebSocket connections to authenticated guest sessions once tokens resolve or renew.
  - Bound client guest session initialization in `main.ts` directly into the presence connection via `presence.auth(guest.token)`.
  - Wired SQLite guest store persistence directly into both production standalone server (`start.mjs`) and development server (`vite.config.ts`).
- **Server-authoritative position delta & speed clamp:**
  - Presence server tracks `lastMove` timestamps and enforces physics-based maximum distance caps per movement packet (`Math.max(10.0 * dt, 6.0)`).
  - Speed-hack attempts or impossible instant teleports across the world boundaries are rejected and dropped without broadcast.
- **Server-authoritative doorway transition validation:**
  - Maintained canonical server-side doorway coordinates for Music Square, Palm Room, City Studio, and Release House (`DOORWAYS`).
  - Room changes (`location !== player.location`) are validated against proximity to the corresponding entrance hotspot (`<= 5.5 m`); illegal room leaps without reaching the doorway are dropped.
- **Automated test coverage:**
  - Added unit test in `presence.test.mjs` verifying initial handshake authentication via token query string and post-connection `auth` promotion with persistent SQLite guest ID assignment.
  - Added unit test verifying observer streams drop teleport jumps and unvalidated room leap packets while cleanly accepting legitimate physical movement.
- **Verification:** All 26 automated tests pass (`npm test`). Production build succeeds cleanly (`npm run build`). App bundle: 74.13 kB / 25.09 kB gzip; CSS bundle: 28.04 kB / 6.84 kB gzip.

## M2 City Studio beat workstation preview slice — 13 October 2026

Addressing `QUALITY_GATES.md` §M2–M3 requirement ("V1 City Studio simple beat loops and authorised uploaded music → Release Hall for approved releases → listening") and Reference V03 ("City Studio / context help — Beat station and Desk contextual actions"):

- **Three authored sound kits (`beatPattern.ts`):**
  - **Afrobeats Core (104 BPM):** Punchy sweeping sub kick, snappy rim shot, rhythmic shaker hat, resonant log/bass.
  - **Piano Groove (112 BPM):** Deep sub kick, crisp rim/clap, shaker roll, pitched warm log drum.
  - **Highlife Vibe (96 BPM):** Organic talking kick, acoustic woodblock, bright hi-hat, melodic highlife bassline.
  - Kits dynamically update pad row labels, synthesized timbre in `beatVoice()`, and default BPM.
- **Dynamic tempo control & timing synchronization:**
  - Added an interactive tempo slider (80–140 BPM) with real-time numerical display.
  - Added `clampBpm()` and `bpmToStepMs()` to calculate precise 8th-note step playback intervals (`30000 / bpm`).
  - Playback loop adapts step pulse timing immediately when tempo adjusts.
- **Enhanced workstation UI & workflow (`main.ts`, `style.css`):**
  - Added kit selection tabs with active `aria-pressed` states and BPM sub-tags.
  - Added a "Clear" button (`clearPattern()`) to reset the active section's 32 steps.
  - Persisted `kit` and `bpm` parameters within `scene-beat-arrangement` in `localStorage`, restoring smoothly on load.
  - Enhanced WAV master renderer (`renderMasterWav`) to synthesize kit-specific timbres and tempo-scaled bar structures into the 30-second PCM WAV file.
- **Automated test coverage (`beatPattern.test.ts`):**
  - Added unit test asserting `clearPattern()` properly zeroes all 32 steps across 4 lanes.
  - Added unit test asserting `clampBpm()` clamps to 80–140 BPM bounds and `bpmToStepMs()` computes accurate step millisecond durations.
  - Added unit test asserting sound kits declare valid names, labels, and tempo ranges.
  - Added unit test verifying `renderMasterWav()` generates a valid 30-second RIFF/WAVE PCM buffer with custom kits and BPM.
- **Verification:** 29 automated tests pass across test suites (`npm test`). Production build succeeds cleanly (`npm run build`). App bundle: 77.18 kB / 26.02 kB gzip; CSS bundle: 29.24 kB / 7.07 kB gzip.

## Smallest next PR sequence (updated)

1. **M0 asset/audio proof:** licensed prototype avatar/animations and cleared test song; manifest with source, rights, expiry, size, and device measurements.
2. **M2 release flow:** intake submission validation with local preview export, release sleeve artwork selection, and rights check checklist.
3. **M3 concert stage separation:** real attendance/ticket separation preview in Palm Room.

Do not claim M0 exit until the device, audio, reconnect, rights, and staging checks in `docs/handoff/implementation/QUALITY_GATES.md` pass.




## M3 Palm Room rehearsal metric separation — 13 October 2026

The stage interaction labels local playback as a rehearsal preview. It shows other connected sessions separately from ticket sales (not a ticketed event) and checked-in humans (not recorded). Disconnected presence shows live status unavailable instead of a false zero. This keeps event admission and settlement outside this slice.

## Map route visibility and live People panel — 13 October 2026

The district map now draws the player-to-destination route and marks the active destination. At a 390 × 844 browser viewport, the route remained visible and legible across the district map while the player walked. Choosing a place still starts physical movement; it does not teleport, enter or book it.

The People navigation now shows only real connected sessions in the player's current place. It distinguishes an empty place from unavailable presence, displays current dancing state, and offers the existing room-wide wave only when another player is actually present. Avatar customization remains available from the People panel. No friendship, private messaging, or simulated population is claimed.

Verification: 34 automated tests pass and the production build succeeds. Browser verification at 390 × 844 showed the route line and active destination, followed by the true Music Square empty state and disabled wave action. External avatar/animation and cleared-track evidence remain M0 asset/rights blockers.

## Music Square materials and avatar profile pass — 13 October 2026

- Added seeded tonal variation and shallow surface relief to the authored plaza pavers, plus warmer glass, sills, and plinths to give the surrounding storefronts more depth. All textures are generated from project-owned geometry and canvas drawing; handoff screenshots are still used only as visual references.
- Reshaped the prototype shirt into a tapered garment and changed its fabric from large dot repeats to a quieter woven geometric pattern. Tuned the head and facial details and kept the existing walking and dance gait. This is still original stylized placeholder geometry, not a licensed production character or rig.
- Updated the display panel's transfer note to distinguish the local uncompressed preview from CDN delivery. The local build reports 650 KiB transferred; the compiled JavaScript totals about 187 KiB gzip and CSS about 8 KiB gzip.
- Verification: all 37 tests pass and the production build succeeds. At a 390 × 844 emulated mobile viewport, the live app rendered the new scene with no browser console errors. Balanced quality measured 16.8 ms median / 20.7 ms p95 (about 60 FPS) after closing a second test tab; Data Saver measured about 56 FPS. First rendered avatar was 4.15 s. These are desktop-browser viewport measurements, not real-device results.

## Articulated avatar and instanced Music Square baseline — 13 October 2026

- Split the prototype arms and legs into upper/lower segments with elbow, knee and foot pivots. Local and connected-player walk/dance poses now share alternating knee lift and elbow flex. Added gait tests for the joint motion.
- Batched static plaza box geometry into instanced meshes grouped by equivalent material. A focused test verifies nested transforms, dimensions, batching and leaving non-box geometry alone. The device panel now reports live draw calls, triangle count and WebGL textures.
- Browser measurement at 390 × 844 (one connected client, Balanced): 832 → 182 draw calls (about 78% fewer); 34,046 scene triangles; 12 textures; 16.6 ms median / 19.6 ms p95 (about 60 FPS); avatar rendered in 0.95 s; 653 KiB local uncompressed transfer; 0 B track audio before Play. The batching includes off-screen boxes in the triangle total. Browser console reported no errors. Dance articulation and the idle return were inspected in the running scene.
- Verification: all 39 tests pass and `npm run build` succeeds. This is desktop Chromium at an emulated mobile viewport; physical Android/iPhone and 5-/20-avatar checks remain outstanding. The production rig and commercially cleared recorded track remain documented asset gates.

## 20-client presence stress test — 13 October 2026

Added an integration test that connects 20 real WebSocket test clients to an isolated server, verifies the room snapshot contains exactly those 20 sessions, then verifies one movement update reaches all 19 peers and an observer with the same server-assigned player id and position. Test sockets are terminated at cleanup and do not add simulated players to the running game. In a separate 390 × 844 desktop-Chromium run with 19 temporary clients plus the browser player, remote-shadow optimization reduced the 20-avatar scene from 1,911 draws / 374,868 triangles and ~41–43 FPS to 1,113 draws / 209,264 triangles and ~56–60 FPS. After disconnect, texture use returned from 31 to the 12-texture baseline; no browser console errors remained. Physical-device results are still required.

## M1 local public-place chat, M2 Lagos release calendar and articulated emotes — 14 October 2026

- **Local public-place chat (Chapter 05 §11.2):** Chat starts muted. Players can opt in from the quick-chat menu; only the six authored phrases are sent, and only opted-in sessions in the same public place receive them. The server rejects custom text, rate-limits attempts, and does not relay emotes across place boundaries. Turning chat off hides the local feed and current speech bubbles. This safe prototype path does not claim to replace a production moderation service.
- **Release calendar (Master GDD §11):** Added a read-only `/api/release-window` based on server time in `Africa/Lagos`. The Release House preview shows the next eligible Friday, Wednesday 18:00 submission cutoff, Thursday 18:00 moderation checkpoint, and Friday 19:00 premiere. It explicitly says no date is reserved and submission/approval are unavailable.
- **Articulated gestures:** Wave, cheer, heart and fire emotes now animate the avatar's shoulder and elbow joints with eased entry/return, overlaying walk or dance poses for both local and connected avatars. Pure pose tests cover gesture shape, symmetry, clamping and neutral return.
- **Verification:** Full suite passes 50 tests. Three calendar unit tests cover the Wednesday cutoff and rollover. Chat policy tests cover opt-in, same-place delivery rules, curated phrases and custom-message rejection; server integration verifies the subscription flow. Production TypeScript/Vite build succeeds. In the running 390 × 844 browser, the Release House displayed Friday 16 October 19:00 with the documented Wednesday and Thursday checkpoints; chat opt-in sent a curated greeting and muting cleared it. The avatar wave pose was inspected in the live 3D scene. Browser console had zero errors after the favicon was added.
- **Build output:** Main app JS 103.78 kB (34.83 kB gzip), CSS 33.06 kB (7.85 kB gzip), Three.js vendor chunk 567.38 kB (140.97 kB gzip). Vite reports its nonfatal >500 kB vendor-chunk warning. Physical Android/iPhone, low-end data/thermal, production CDN and licensed-audio checks remain outstanding.

## M3 Palm Room stagecraft and local lighting preview — 14 October 2026

- Replaced the bare Palm Room stage blockout with authored truss and spot fixtures, a custom palm-room backdrop, a front-facing drum kit, keyboard, amp stack, floor monitors, road cases and stage cabling. The venue camera now leaves more room around the player and frames the stage at mobile width. These remain compact, project-owned procedural meshes and canvas art, not imported reference pixels or licensed GLBs.
- Added three lighting tests at the physical stage interaction: Warm wash, Sunset and Spot. Selecting one updates the stage lights and beams in the running scene. The panel explicitly labels these as local previews; it does not claim purchased gear, an installed package, ticket sales or human check-ins. The rehearsal ledger continues to report other live sessions separately from admission.
- Added a versioned, validated stage preview template stored in this browser. Players can save the selected light look and temporary floor-light preview, then restore those choices after reloading and walking back into Palm Room. Saving this preview does not create venue ownership, equipment inventory or a server booking.
- **GDD trace:** Chapter 06 §11.2's stage-planning rehearsal; the asset brief's limited snap-point gear preview; visual intent from V06 and preferred V27. Commercial leases, inventory, tickets and public performances remain unavailable without their required server, payment and rights systems.
- **Live browser:** At 390 × 844 in the production preview, walked the district-map route to the Palm Room, entered at its physical door, walked to the stage, selected Sunset and showed the floor-light preview. Saved the preview, reloaded the app, walked back to the stage, and confirmed Sunset was selected and the preview was visible. The save notice appeared; browser console errors: 0.
- **Performance:** One-player Balanced desktop Chromium at the mobile viewport measured 31.4 ms median / 32.4 ms p95 (~32 FPS), 181 draws, 22,938 triangles and 18 textures in the venue. This is only just above the 30 FPS engineering target, so the stage needs further headroom work and physical Android testing. It is not a release-performance claim.
- **After saved-preview restore:** 31.2 ms median / 32.4 ms p95 (~32 FPS), 186 draws, 23,590 triangles, 19 textures and 106 KiB reported transfer. The metrics are from embedded desktop Chromium at 390 × 844, not from a physical phone.
- **Build:** Production TypeScript/Vite build succeeds. Latest app JS 105.33 kB (35.37 kB gzip), CSS 33.64 kB (7.96 kB gzip), Palm Room chunk 10.07 kB (4.53 kB gzip), Three.js vendor 567.38 kB (140.97 kB gzip). Vite's >500 kB vendor warning remains nonfatal.

## Player textile finish — 14 October 2026

- Reworked the player's ochre shirt texture into a finer repeated floral print with dark teal and terracotta marks; added directional weave to the purple trousers, a subtle back-yoke seam and a cuff hem. The silhouette, face, segmented joints, emotes and colors remain consistent with the preferred V27 avatar reference.
- The live production preview at 390 × 844 shows the updated outfit in Music Square. The locally generated clothing adds no external images or model downloads. The prototype is still stylized geometry; it is not a production human rig or photoreal character.
- **Verification:** Full suite passes 53 tests; production TypeScript/Vite build succeeds. Browser console errors: 0. One-player Balanced browser metrics from the pass before saving stage templates: 31.4 ms median / 32.7 ms p95 (~32 FPS), 186 draws, 34,686 triangles, 13 textures and 105 KiB reported transfer. This embedded desktop-browser reading is only slightly above the documented 30 FPS target; entry Android and iPhone tests remain necessary.
- **Latest build:** Main app JS 106.46 kB (35.69 kB gzip), CSS 33.84 kB (8.01 kB gzip), Palm Room chunk 10.07 kB (4.53 kB gzip), Three.js vendor 567.38 kB (140.97 kB gzip). Vite's vendor-chunk warning remains nonfatal.

## M2 Release House physical preparation journey — 14 October 2026

- Split the single record-intake overlay into six physical Release House stations in the Chapter 02 order: Record Intake → Artwork Frame → Title Sleeve → Listening Booth → Rights Console → Release Calendar. Each station has its own authored world marker, proximity interaction, focus panel and walking route. The Desk can guide the next move without teleporting.
- Added a compact mobile step strip, previous/next walking cues, editable title/artist/genre metadata, an original local sleeve preview and PNG export, local master audition/export when available, rights declarations, and a read-only Lagos Friday window at the final station. The local calendar preflight remains blocked unless its asset and rights requirements are present; even a local pass never uploads, reserves a date, approves rights or publishes a song.
- **GDD trace:** Chapter 02 §§5.4, 6 and 7.3; Chapter 09 §§4, 5 and 24; `QUALITY_GATES.md` M2–M3. Rights claims remain declarations awaiting review; no real-song upload or public catalogue action was added.
- **Live browser:** In production Chromium at 390 × 844, walked from Music Square through the physical Release House door and through all six in-room stations. Saved and read back a title, artist and genre locally; confirmed the Rights Console begins with unchecked declarations and the calendar says “no date reserved” with submission unavailable. Browser console errors: 0.
- **Performance:** Release House measured 16.7 ms median / 18.6 ms p95 (~60 FPS), 173 draws, 19,454 triangles, 21 textures and 112 KiB reported transfer at the emulated mobile viewport. First avatar rendered in 1.03 s. These are desktop-Chromium measurements, not physical-phone evidence.
- **Verification:** Full suite passes 57 tests; `npm run build` succeeds. Main app JS 111.50 kB (37.39 kB gzip), CSS 35.79 kB (8.40 kB gzip), Release House chunk 2.78 kB (1.54 kB gzip), Three.js vendor 567.38 kB (140.97 kB gzip). Vite’s nonfatal vendor-chunk warning remains.

## M2 Service NPC ambience and Palm Room visual pass — 14 October 2026

- Added one venue usher and one City Studio technician using original procedural 3D geometry and locally generated clothing and role textures. Each has a readable NPC/role marker, a light breathing cycle and a small authored idle gesture. Both are explicitly cosmetic (`actorType: NPC`, `countsAsHuman: false`, `financialEffect: none`) and remain outside player counts, tickets, attendance, wallet, and presence systems.
- Reworked the Palm Room’s roofline into an open dusk view with a locally generated Lagos skyline. Added subtle tile variation and floor relief; stage light beams now appear only while a local performance preview is playing. Adjusted the City Studio signage to keep the in-world sign clear of the HUD and monitor.
- **GDD trace:** Chapter 09 §11 (venue usher and studio technician roles) and §28 (visible NPC identification and no false player counts); `PERFORMANCE_MEDIA_BUDGET.md` entry-device target of 30 FPS. No staff payments, access control, real attendance, leases or purchases were added.
- **Live browser:** Production preview at 390 × 844. Walked into Palm Room and City Studio from the map; verified both staff characters and their role tags in their respective rooms. Browser console errors: 0. Captures: `C:\Users\USER\Desktop\the-scene-palm-room-npc.png` and `C:\Users\USER\Desktop\the-scene-studio-final.png`.
- **Performance:** One active desktop Chromium tab, Balanced quality. Palm Room: 16.6 ms median / 19.0 ms p95 (~60 FPS), 262 draws, 28,240 triangles, 25 textures, 129 KiB reported transfer and 1.09 s avatar-ready. City Studio: 16.7 ms median / 18.7 ms p95 (~60 FPS), 189 draws, 22,172 triangles, 22 textures, 113 KiB transfer and 0.94 s avatar-ready. Mobile viewport emulation is not a physical-device result.
- **Verification:** Full suite previously passed 59 tests; final visual edits passed the two focused NPC tests, final `npm run build`, and direct browser checks of both rooms. Main app JS 111.61 kB (37.44 kB gzip), CSS 35.79 kB (8.40 kB gzip), Palm Room chunk 12.19 kB (5.29 kB gzip), City Studio chunk 1.90 kB (1.11 kB gzip), NPC module 5.18 kB (2.15 kB gzip), Three.js vendor 567.38 kB (140.97 kB gzip). Vite's large vendor-chunk warning remains nonfatal.

## M2 Desk Bot first-track journey — 14 October 2026

- Turned the Today tab into a rules-based four-step private music path: save a beat → render a local 30-second WAV → save a private sleeve draft → play it on the Palm Room stage. Each step derives from the existing local game state and links to a real walkable hotspot; it does not teleport or advance without the corresponding player action.
- Today remains capped at three current options. Release House keeps its separate six-station route; the completion state promises no cash, popularity, approval, or publication. The saved journey marker is local to this device.
- **GDD trace:** Chapter 10 §§5 and 8.2 (Today cards, structured state and physical navigation); Master GDD §35 M2–M3; `QUALITY_GATES.md` M2–M3. Audio remains local, and the stage preview still reports no ticket sales or recorded attendance.
- **Live browser:** In production Chromium at 390 × 844, opened Today, followed “Take me there” from Music Square to City Studio on foot, entered the studio and opened the beat workstation. The card showed Step 1 of 4 without changing progress before the player saves a beat. Browser console errors: 0. Captures: `C:\Users\USER\Desktop\the-scene-studio-journey.png` and `C:\Users\USER\Desktop\the-scene-beat-desk-open.png`.
- **Verification:** Full suite passes 63 tests, including four journey transition tests and server/room integration tests. Production TypeScript/Vite build succeeds. `git diff --check` passes after trimming four inherited trailing blank lines; Git still emits its usual LF-to-CRLF working-copy notices.
- **Studio performance after journey integration:** With the beat desk open in one production browser tab at 390 × 844, 16.7 ms median / 17.1 ms p95 (~60 FPS), 159 draws, 19,336 triangles, 22 textures, 148 KiB reported transfer and 2.63 s avatar-ready. These browser-only measurements do not replace physical-phone testing.
- **Latest bundle:** Main app JS 112.95 kB (38.12 kB gzip), CSS 36.32 kB (8.49 kB gzip), Palm Room 12.19 kB (5.29 kB gzip), City Studio 1.90 kB (1.11 kB gzip), NPC module 5.18 kB (2.15 kB gzip), Three.js vendor 567.38 kB (140.97 kB gzip). The vendor warning remains nonfatal.

## M2 Desk Bot private master audition — 14 October 2026

- Expanded the Today first-track path to five steps: save a beat → render a private 30-second master → save a private release sleeve → audition at the Release House Listening Booth → preview on the Palm Room stage. Each card targets an existing physical station; interior-to-interior travel still goes through the room exit.
- The booth step advances only after browser audio playback successfully starts. Completion is saved in this browser only. The release panel says the master is not submitted, scheduled, or counted as a public listen. No catalogue, chart, sales, ticket or attendance state changes.
- Playback feedback now changes to “Private audition complete” when the 30-second audio ends or “Private audition stopped” when the player stops it, so the booth cannot remain stuck in a playing state.
- **GDD trace:** Chapter 02 §§5.4 and 7.3 (local listening booth), Chapter 07 §5.11 (private demos do not count as public discovery), Chapter 10 §§5 and 8.2 (Today cards use verified local state and physical routes), and `QUALITY_GATES.md` M2–M3.
- **Live browser:** Used a separate `localhost` origin to protect the existing `127.0.0.1` local save. Walked from Music Square into City Studio, changed Section B, saved the pattern and rendered the local WAV. Walked through the studio exit to Release House, saved a private title/artist draft, routed to the physical Listening Booth and started playback. The visible status read “Playing your private master. Not submitted, scheduled, or counted as a public listen”; the local audition flag became `true`. Audio ended locally; the user's original local data was untouched.
- **Verification:** All 63 tests pass, including four music-journey transition tests for the booth route and stage continuation. `npm run build` succeeds. `git diff --check` exits 0; Git reports only existing LF-to-CRLF working-copy notices.
- **Latest bundle:** Main app JS 113.75 kB (38.28 kB gzip), CSS 36.32 kB (8.49 kB gzip), Palm Room 12.19 kB (5.29 kB gzip), City Studio 1.90 kB (1.11 kB gzip), NPC 5.18 kB (2.15 kB gzip), Three.js 567.38 kB (140.97 kB gzip). Vite's nonfatal vendor-chunk warning remains; this logic-only slice adds no external asset or audio requests.

## M2 Desk Bot Ask routes — 14 October 2026

- Replaced the static Ask panel with a deterministic local guide for four supported activities: make a beat, prepare a private release draft, listen to an original discovery preview, or explore Palm Room. The answer explains the relevant privacy/cost boundary and offers a real walking route. Requests across rooms direct the player to the current room exit first.
- Unknown questions return “I could not match that yet” and four visible starter prompts. No AI, API, prediction, commitment, payment, or invented opportunity is involved.
- **GDD trace:** Chapter 10 §§8.1–8.3 (simple keyword matches, truthful fallback, approved action routes and clear reasons), Chapter 10 §9 (`MAKE_BEAT`, `PREPARE_RELEASE`, and `PLAY_NEW_MUSIC` stay linked to real game flows), and the handoff's no-LLM Phase 1 requirement.
- **Live browser:** At the 390 × 844 mobile viewport, Ask returned “Make a beat” for “Where can I make a beat?”, with the local-only explanation and a City Studio route. Selecting the route started physical movement through the world. An unsupported fame question showed the honest fallback with no route. Browser console: zero errors and warnings. Capture: `C:\Users\USER\Desktop\the-scene-ask-desk-live.png`.
- **Verification:** Full test suite passes 67 tests, including four new query/fallback/physical-route tests. `npm run build` succeeds; `git diff --check` exits 0 aside from Git's existing LF-to-CRLF notices.
- **Latest bundle:** Main app JS 116.45 kB (39.20 kB gzip), CSS 37.12 kB (8.65 kB gzip), Palm Room 12.19 kB (5.29 kB gzip), City Studio 1.90 kB (1.11 kB gzip), NPC 5.18 kB (2.15 kB gzip), Three.js 567.38 kB (140.97 kB gzip). This adds no external data, image, or audio request. Vite's nonfatal vendor-chunk warning remains.

## M1 social safety controls — 14 October 2026

- **Block:** Added authenticated, persistent guest-to-guest blocks in SQLite. Blocking immediately removes both sessions from one another's visible roster and suppresses chat, emotes, movement updates and join visibility in either direction. The People panel lists blocked sessions and supports unblocking; local mute remains separate and only hides that session's chat and reactions on this device.
- **Report:** Added an authenticated, private report queue with four documented safety categories, an optional 240-character context field, and a five-per-hour limit. The form is reachable from People without walking to or selecting a 3D avatar, and from avatar inspection. It acknowledges receipt truthfully and states that no moderation team is connected; no report browsing or moderation console is claimed.
- **GDD trace:** Fan & Social §§11.1, 25.1–25.2 and FS-038; Master GDD §35 M1; `QUALITY_GATES.md` M1. Blocks take precedence over in-world contact and visibility. The server accepts reports but public launch remains gated on age policy, human response staffing, escalation and appeals.
- **Live browser:** Two authenticated guest sessions on the running Node server at a 390 × 844 mobile viewport. Verified local mute, report submission and queue acknowledgement, block removal in both clients, persisted blocked-session controls and unblock/reappearance. Browser console: 0 current-page errors. Screenshots: `docs/evidence/m1-safety-people.png` and `docs/evidence/m1-safety-report.png`.
- **Verification:** Full automated suite passes 71 tests, including authenticated API validation, private report storage, report rate limiting, directional block/unblock and two-client chat/emote suppression. `npm run build` and `git diff --check` succeed. The manual report and its temporary test guest were removed from the local prototype database after browser verification.
- **Build output:** App JS 122.08 kB (40.87 kB gzip), CSS 39.42 kB (9.09 kB gzip), Three.js vendor 567.38 kB (140.97 kB gzip). No new scene assets were added. Vite retains the existing nonfatal >500 kB vendor-chunk warning.
- **Hosting boundary:** Netlify remains a static, solo preview. Shared guest identity, WebSocket presence, persistent blocks and report intake require the self-hosted Node server; the staging URL does not have those backend services.

## M1 mutual friend requests — 14 October 2026

- **Friend requests:** Added authenticated SQLite-backed friend requests and mutual friend edges. Only a recipient can accept or decline; the sender can cancel; either friend can unfriend. Acceptance is idempotent. Pending requests expire after seven days, outgoing requests cap at 20, repeated requests after decline are rejected, and a block removes friendship and overrides pending requests. Unblocking never recreates friendship.
- **People UI:** Added friends, incoming requests, sent requests, accept/decline/cancel, and unfriend actions. Connected clients receive updates when a request is sent or accepted.
- **GDD trace:** Fan & Social Chapter 05 §§10–11; FS-016, FS-017 and FS-019. Follow, friendship, and fan-community membership remain separate actions.
- **Live browser:** Tested two authenticated sessions against an isolated local Node/SQLite server at 390 × 844. Sent a request, confirmed it appeared to the recipient, accepted it, and confirmed both sessions showed the friendship over live updates. Browser console errors: 0. Capture: `docs/evidence/m1-friends-accepted.png`.
- **Verification:** Full suite passes 74 tests. Production TypeScript/Vite build succeeds; `git diff --check` succeeds. App JS is 127.10 kB (42.15 kB gzip), CSS 40.54 kB (9.31 kB gzip), Three.js vendor 567.38 kB (140.97 kB gzip). Vite's existing >500 kB vendor-chunk warning remains nonfatal.
- **Hosting boundary:** Netlify is a static solo preview and does not run the guest database or WebSocket server. Friend requests and live updates work on the self-hosted prototype server, not on the static phone-testing URL.

## M1 friend direct messages — 14 October 2026

- **Server:** Added authenticated SQLite conversation storage and endpoints restricted to current mutual friends. Sends fail if either user has blocked the other or either person disables friend messages. Messages are plain text, capped at 500 characters, and limited to 20 per sender per minute. A conversation cannot be fetched by a third guest or after block/unfriend.
- **Privacy:** Friend messages are on by default with a per-account switch to disable sending and receiving. Privacy changes notify connected friends; open conversations close and their Message action becomes unavailable. WebSocket notifications carry only participant and message IDs; message contents stay behind authenticated HTTP.
- **People UI:** Added friend-only Message buttons, a private conversation view with safe text rendering, character count, live delivery, and a visible disclosure that reports have no connected moderation team in this preview. Direct message content is never broadcast in the room.
- **GDD trace:** Fan & Social Chapter 05 §§11.1–11.2 and FS-017. Message requests remain unavailable because the optional professional contact channel is not implemented. The prototype does not claim human moderation; reports and blocks remain accessible from People.
- **Live browser:** Two authenticated local guests at 390 × 844 exchanged a private message. Verified the recipient's live notice and retrieved history, disabled messaging on one account and saw both clients close the thread and disable Message. A markup-shaped message rendered as literal text with no image element. Browser console errors: 0. Capture: `docs/evidence/m1-dm-conversation.png`.
- **Verification:** Full suite passes 78 tests. TypeScript/Vite build and `git diff --check` succeed. App JS is 132.74 kB (43.70 kB gzip), CSS 43.19 kB (9.73 kB gzip), Three.js vendor 567.38 kB (140.97 kB gzip). Vite's >500 kB vendor-chunk warning remains nonfatal.
- **Hosting boundary:** Netlify is still a static solo preview. Direct messages, friend privacy settings and shared live notices are available only through the self-hosted Node/SQLite/WebSocket prototype; no shared backend is deployed to the phone-testing URL.

## M1 lightweight party membership — 15 October 2026

- **Server:** Added authenticated SQLite party membership for at most four guests, friend-only leader invitations, explicit recipient acceptance/decline, ten-minute invitation expiry, party capacity reservation, member departure and longest-present leadership transfer. Blocks cancel pending invitations and remove a blocked member from a shared party. A party with every member offline expires after 30 minutes; a late reconnect cannot revive it.
- **People UI:** Added party creation, live invitation notice, Join/Decline, member and pending-invite lists, leader-only friend invites, leave, and expiry refresh. A user already in a party cannot accept another invite. Group chat and travel remain clearly marked unavailable.
- **GDD trace:** Fan & Social Chapter 05 §12, FS-017, and M1 quality gates. A party is temporary and does not pool money or grant event access.
- **Live browser:** At a 390 × 844 viewport, two distinct authenticated guest tabs created a party, sent an invite, received it live, joined by choice and saw 2/4 membership. The leader left; the remaining member became leader and received the corresponding live update. Browser console errors: 0.
- **Verification:** Full suite passes 84/84; all six focused party tests pass, including friend-only invitations, the four-member limit, ten-minute expiry, leadership transfer, dissolution, 30-minute idle expiry/late reconnect, rejoin after a fresh invite, and pending invites across leadership transfer. TypeScript/Vite production build and `git diff --check` succeed. App JS is 138.54 kB (45.17 kB gzip), CSS 44.11 kB (9.87 kB gzip), and Three.js vendor 567.38 kB (140.97 kB gzip); Vite retains its existing nonfatal vendor-chunk warning. Capture: `docs/evidence/m1-party-membership.png`.
- **Hosting boundary:** Netlify remains a static solo preview; this social loop requires the self-hosted Node/SQLite/WebSocket server.

## M1 temporary party group chat — 15 October 2026

- **Server:** Added authenticated party-only message history and sending. Only accepted current members can read or send; each member's history begins at their latest join and closes when the party dissolves. Text is limited to 280 characters and 20 sends per minute. Blocked messages are hidden, rate limits are server-enforced, and chat events are sent only to current members.
- **People UI:** Added a mobile party thread with safe `textContent` rendering, live messages, a character count, and report actions that open the existing report flow with the message context. The interface states that the preview has no connected moderation team.
- **GDD trace:** Fan & Social Chapter 05 §§11.2 and 12. History boundaries, current membership, visible join/leave changes and block precedence follow the temporary-group requirements. Chat messages are removed when a party closes.
- **Live browser:** Two authenticated local guests at 390 × 844 joined the same party. Sent a message in one client and confirmed live delivery in the other. A markup-shaped message appeared literally with zero `<img>` elements. Opened Report and verified it targets the sender and includes the message context. Capture: `docs/evidence/m1-party-chat-scrolled.png`.
- **Verification:** Full suite passes 88/88; focused party/presence suite passes 21/21. TypeScript/Vite production build and `git diff --check` succeed. Main app JS is 142.90 kB (46.31 kB gzip), CSS 45.97 kB (10.18 kB gzip), and Three.js vendor 567.38 kB (140.97 kB gzip); the existing vendor-chunk warning remains nonfatal.
- **Hosting boundary:** Netlify remains a static solo preview. Party chat and live updates require the self-hosted Node/SQLite/WebSocket server and are not available at the phone-testing URL.

## M1 consent-based public destination proposals — 15 October 2026

- **Server:** Added temporary party travel proposals for the existing public demo destinations (City Studio, Palm Room, Release House, and the listening kiosk). Only the leader can propose. Every current member must be connected and explicitly approve; one decline cancels, proposals expire after five minutes, and server restarts pause voting until every member reconnects. Membership changes and disconnects cancel pending proposals.
- **Travel behavior:** Unanimous approval reveals the existing physical walking route to each guest. It does not teleport avatars, reserve capacity, grant tickets, or create event instances. The UI states this limitation.
- **GDD trace:** Fan & Social Chapter 05 §12, FS-017, and FAN-12. Consent and physical travel are implemented; authoritative destination-instance availability, capacity, and ticket-entitlement checks remain unavailable because this preview has no such service.
- **Live browser:** At 390 × 844, created a party, proposed City Studio, approved with the other guest, and opened the physical route. The avatar remained in place and the browser reported zero console errors.
- **Verification:** The preceding full suite passed 91/91 before the final server-restart test was added. The reconnect-focused run passes 2/2, and the production TypeScript/Vite build succeeds. `git diff --check` is part of the publish check.
- **Hosting boundary:** The Netlify URL is a static solo demo. Shared parties, proposals, and live updates require the self-hosted Node/SQLite/WebSocket server and are not available on that URL.

## M1 mobile render lifecycle and Data Saver — 15 October 2026

- **Fix:** The renderer set the saved quality preset and then unconditionally re-enabled shadows. Initialization now sets the shadow type before applying the selected preset, so Data Saver keeps shadows disabled.
- **Live browser:** Production asset `index-DQxtolbZ` tested at 390 × 844. With device pixel ratio simulated at 3, Balanced rendered at 585 px canvas width; Data Saver rendered at 390 px, persisted `scene-quality=saver`, and selected the correct button. Browser reported zero console errors.
- **Verification:** TypeScript/Vite production build passes with the Netlify solo-demo flag; production deploy `6ad09a3aa467e7fe7bfd1628` is live. The browser check demonstrates render-scale behavior, not physical-phone thermals or sustained frame rate; those still need the user's device.
- **Background-tab behavior:** The WebGL frame loop now cancels its pending animation frame when the page is hidden and restarts with a fresh time baseline when visible again. In the live WebGL2 browser at 390 × 844, instrumented draw calls stayed at 3,161 across a 350 ms hidden interval, then resumed to 3,270 after 800 ms visible; no console errors. Deploy `6ad09c2ca3b78eeaf07b9bae` is live.

## M1 district map follows the walkable route — 15 October 2026

- **Map:** Replaced the straight connector with an SVG polyline projected from the same collision-checked `findWalkPath` used by tap-to-walk. The route now bends around blocked objects and keeps destination pins in front.
- **Verification:** TypeScript/Vite build passes and navigation tests pass 4/4. The live 390 × 844 browser selected City Studio from the map and showed a four-vertex route with the active destination; the walking guidance remained active and the browser reported zero console errors. Deploy `6ad09d3f5afcde2c75a55529` is live.

## M1 City Concierge and Music Square ambience — 15 October 2026

- **Concierge:** Added the Chapter 09 §11.1 City Concierge at the spawn plaza. Its labeled interaction explains movement and opens the real free-destination map; it does not grant money, change reputation, or move the avatar. The action was confirmed in the production 390 × 844 browser.
- **Ambient life:** Added two distinctly dressed, clearly labeled `NPC · PASSERBY` figures on slow looping routes along the outer plaza. Their paths stay clear of world obstacles and all interaction hotspots. They are nonblocking cosmetic actors with no finance, attendance, presence, or analytics effect. Data Saver hides them.
- **References:** Chapter 09 §11.1–11.2 and Master GDD §9; the Music Square composition follows V26 while authored characters remain original geometry and clothing.
- **Verification:** Full suite passes 96/96, including three ambient-actor/motion tests and five navigation tests. Netlify-mode TypeScript/Vite production build passes. Production deploy `6ad0a82366535a0fbc251f8e` serves `index-zBrJ5gEV.js` at the stable phone URL. The 390 × 844 Balanced/Daylight browser view loads the Concierge and square with zero console errors. Screenshot: `docs/evidence/m1-city-ambience-balanced.png`.
- **Visual follow-up:** The initial production frame hid most ambient figures; the follow-up slice below reorients the avatar and stages both walkers on separate, visible sightlines.

## M1 Music Square facing and ambient sightlines — 15 October 2026

- **Avatar facing:** The authored avatar's face points along local +Z while forward movement advances toward -Z. Default square and room spawns now face toward the stage, and movement headings keep the avatar facing its travel direction. Idle and dance poses preserve that base orientation.
- **Plaza staging:** The two labeled `NPC · PASSERBY` loops now occupy separate left and right sightlines around spawn. The second passerby has a distinct blue and terracotta outfit. Both remain outside obstacles and interaction hotspots and stay cosmetic-only.
- **References:** Chapter 09 §5.2 and §11.2; V26 is the visual reference for the player facing into Music Square with other figures visible. The references are not shipped as runtime assets.
- **Verification:** Full test suite passes 98/98; the final route adjustment passes the four focused ambient-motion tests. Netlify-mode TypeScript/Vite production build passes. Production deploy `6ad0ad164d74f55ec58d8f30` serves `index-Bj8owLO1.js` at [musicdistrict.netlify.app](https://musicdistrict.netlify.app/). At 390 × 844, the live browser shows the avatar from behind with both labeled passersby visible and zero browser console errors. Screenshot: `docs/evidence/m1-avatar-heading-staging-live.png`.
- **Device caveat:** This is desktop Chromium at a mobile viewport. Physical Android/iPhone FPS, thermal behavior, touch comfort, and network recovery remain untested.

## M1 avatar idle motion — 15 October 2026

- **Animation:** Added subtle breathing, weight shift, arm drift, and a small facing glance. The idle pose preserves the avatar's last travel direction, stays within small bounds, and resets cleanly for walking, dancing, and room transitions.
- **References:** Chapter 09 §5.2's readable idle and walk states; original procedural animation, with no third-party rig or motion clip.
- **Verification:** Full suite passes 99/99; focused avatar motion tests pass 9/9. Netlify-mode production build succeeds. Production deploy `6ad0af4a20f6a5e5cee7c5a1` serves `index-DtTz3ju2.js` at [musicdistrict.netlify.app](https://musicdistrict.netlify.app/). The 390 × 844 browser shows the latest build with zero console errors. Screenshot: `docs/evidence/m1-avatar-idle-live.png`.
- **Device caveat:** Idle timing and physical-device battery/thermal behavior still need Android/iPhone testing.

## M1 public room runtime instances — 15 October 2026

- **Public room routing:** Added a self-hosted runtime directory for Music Square, City Studio, Release House, and Palm Room's public preview. It groups actual connected human sessions up to the tested 20-client cap, opens another technical instance at capacity, prefers a compatible instance containing current party members, and removes empty overflow shards.
- **Isolation and travel:** Presence snapshots, movement, quick chat, and emotes are scoped to one runtime instance. Players change instances only after the existing server-validated physical doorway transition. NPCs never enter occupancy counts.
- **Event safety:** Ticketed event/session IDs are not accepted by this public room resolver. The global event ticket roster and admission cap remain outside this prototype until the documented EventService exists.
- **Verification:** Full suite passes 104/104 when test files are serialized; the parallel run overloaded an existing timed WebSocket notice test. The focused presence suite passes 13/13. Netlify-mode TypeScript/Vite production build passes. WebSocket integration opened 21 clients, confirmed the first 20 share one instance, the 21st is isolated, and movement does not cross instances.
- **Hosting boundary:** The stable Netlify phone preview remains solo/static. Runtime instance routing runs only on the self-hosted Node/SQLite/WebSocket server and is not active at that URL.

## Current next slices — updated 15 October 2026

1. Connect approved party travel to public room capacity with a group-compatible destination result; keep ticketed admission blocked until the authoritative Chapter 06 EventService validates each attendee and global capacity.
2. Validate FPS, thermals, touch comfort, and network recovery on physical Android/iPhone devices.
3. Keep public chat and reports gated until age policy, moderation staffing, emergency escalation, and appeals have real owners.
## Music Square demo camera and stage pass — 16 October 2026

- Brought the default third-person camera closer to the avatar and stage, tightened its follow response, and added constrained vertical drag and wheel zoom while preserving tap-to-walk and joystick movement.
- Added a visible stage performer, warm light beams, and layered palm fronds to make the square read more like a live music venue.
- Built the production client and opened it in headed Edge at 390 × 844. The 3D canvas rendered with no page errors. Evidence: `docs/evidence/music-square-camera-stage-mobile.png`.
- The screenshot still falls substantially short of V26: the world uses simple procedural geometry, the mobile HUD crowds the lower view, and character materials and lighting lack the reference's detail. The next demo work should replace the stage/storefront and avatar blockouts with authored art and simplify the on-screen controls before adding more backend features.
- Follow-up presentation slice: removed the local avatar's stage-obscuring name tag, kept other human players visibly identified, reduced NPC role plates, moved the Concierge off the spawn line, and staged four clearly labeled ambient NPCs on clear routes. The Concierge, kiosk, doors and other hotspots remain physically reachable; focused navigation and NPC route tests pass.
- Collapsed social reactions behind a 42px touch control, with explicit expanded state; Dance stays one tap away. In headed Edge at 390 × 844 the reaction tray opened and closed and the default frame rendered without page errors (`docs/evidence/music-square-clean-mobile.png`).
- Gave the open Desk a separate third-person camera framing. At phone size the avatar, kiosk and live stage remain visible above the Today panel (`docs/evidence/music-square-desk-mobile.png`), while closing Desk restores the closer exploration view.
- Added a suspended City Studio arrow within the actual plaza, visible from spawn in both camera modes. It points toward the existing walkable Studio entrance and avoids made-up distance or travel-time claims.
- Published the solo preview to `https://musicdistrict.netlify.app/` (Netlify deploy `6ad21a142dddc92db7e5b04b`). Opened the deployed game in headed Edge at 390 × 844: 3D canvas present, no page errors, reaction tray toggled and Desk opened. Live captures: `docs/evidence/netlify-music-square-clean-mobile.png` and `docs/evidence/netlify-music-square-desk-mobile.png`. The separate multiplayer Node/WebSocket runtime is still not hosted by Netlify.
- Added an original authored Music Square mural as a compressed 186 KB texture on the real stage wall, retaining separate 3D stage geometry and a text overlay. Added stage depth and a drum kit, and changed the default dusk palette to a lighter Lagos evening. Browser capture at 390 × 844 shows the new wall art and no page errors. Asset provenance is in `app/src/assets/README.md`. This improves the focal area, but the overall facade and avatar are still stylized blockouts compared with V26.

## Palm Room rehearsal setup — 16 October 2026

- At the walkable Palm Room stage, players can now place or remove three visible trial pieces: a floor light, two stage monitors, and a backdrop. The stage panel shows placement progress and keeps the existing lighting looks and local master audition.
- Saving the rehearsal setup restores the pieces and lighting on this device after reload. This is a physical arrangement preview guided by Chapters 01 and 06; it makes no claim of equipment ownership, venue lease, ticket sales, or an official event.
- TypeScript and Vite production build pass. Browser automation of the local Vite page did not complete because Chrome stalled during navigation, so visual interaction validation remains open for the deployed preview.
- Added a private Palm Room show draft at the physical stage: title, open mic/listening-session format, and planned start time save locally. The stage panel identifies whether the player's City Studio master is available for a local audition. This is a planning step only; the canonical Chapter 06 booking, rights, lineup confirmations, and EventService gates still control any future publication.
- Live Chrome QA followed the map route from Music Square into Palm Room, used the in-world stage route, placed all 3 rehearsal pieces, saved a show draft, and closed the stage panel at 390 × 844. The long panel initially put its close button above the screen; capped scrolling and a sticky close button fixed this. Captures: `docs/evidence/netlify-palm-room-stage-plan-mobile.png` and `docs/evidence/netlify-palm-room-stage-placed-mobile.png`. The repeatable check is `app/venue-browser-check.mjs`.
- Desk Plans now carries the saved show draft, its format and planned time, plus a route back to the physical Palm Room stage. Without a draft it offers a clear route to create one. This connects stage planning to the square's existing player journey.
- The live Chrome route check confirms the saved draft appears in Desk Plans after closing the stage interaction and that a stage route remains available.
- Added local Stage Mode rehearsal cues: with a rendered City Studio master, the player can run its 30-second playback in Palm Room, tap warm/sunset/spot light changes as the audio progresses, save those time cues locally on stop/end, and replay the same light sequence. The compact cue bar keeps the 3D stage visible; this is a private rehearsal, not a published concert or shared audio session.
- Live Chrome at 390 × 844 walked from Music Square to City Studio, rendered a master, travelled to Palm Room, recorded two timed cues and replayed them. The first browser frame caught the cue bar appearing before the audio promise resolved; fixed the start sequence so the action sheet closes before the cue bar appears. Repeatable route check: `app/rehearsal-browser-check.mjs`; live capture: `docs/evidence/netlify-palm-room-cue-rehearsal-mobile.png`.
- Self-hosted Node/SQLite now stores one authenticated private Palm Room show draft per guest, validates format/title/time, and exposes it only to that guest. The client keeps an offline device copy and syncs it when the guest service is available. A live local Chrome run followed the world route, saved a show draft, and read the same title from the authenticated endpoint. Focused tests prove guest isolation and persistence across SQLite restart. No venue calendar hold, public event, attendee count, or booking is created. The Netlify phone link remains a solo preview and keeps the draft on its device until a persistent Node host is deployed.
- Rebuilt the Netlify artifact with `VITE_SCENE_DEMO_MODE=true`. The first live check caught an early presence callback reading the show draft before state initialization; the stage panel now waits until that state exists. The corrected solo artifact opens in Chrome with a rendered 3D canvas and no page errors.
- Deployed the corrected solo artifact to `https://musicdistrict.netlify.app/` (Netlify deploy `6ad29d3a0147acd54c77e725`). Headed Chrome at 390 × 844 loaded the exact live URL, rendered the 3D canvas, opened Desk and the reactions control, and reported no page errors. The hosted link remains solo while the SQLite/WebSocket server needs a persistent host.
