# THE SCENE — Prototype Asset Provenance


Scope: assets authored in the current local prototype. Reference screenshots are documentation only and are not shipped or sampled into textures.

This is a provenance record, not a commercial clearance certificate. No third-party model, rig, song, loop pack, or sound-effect file is currently bundled. The project owner must confirm the repository chain of title before an external commercial release.

## Local browser baseline

At a 390 × 844 viewport in the local Balanced build, measured in desktop Chromium:

| Connected players | Frame time | Draws / triangles / textures |
|---:|---|---|
| 1 | 16.6 ms median / 20.4 ms p95 (~60 FPS) | 182 / 34,046 / 12 |
| 5 | 16.6 ms median / 20.0 ms p95 (~60 FPS) | 546 / 105,798 / 16 |
| 20 before remote-shadow optimization | 23.0–24.1 ms median / 34.3–36.3 ms p95 (~41–43 FPS) | 1,911 / 374,868 / 31 |
| 20 after remote-shadow optimization | 16.8–17.3 ms median / 24.4–27.6 ms p95 (~56–60 FPS) | 1,113 / 209,264 / 31 |

The 20-player run used 19 temporary WebSocket test clients plus the browser player. They were moved into one nearby cluster, sent repeated movement updates, and closed after measurement. Texture use returned from 31 to the 12-texture baseline after disconnect; no console errors were reported. First avatar render was 0.82 s; local uncompressed transfer was 653 KiB; track audio before Play was 0 B.

These are desktop Chromium measurements with a mobile viewport, not physical Android/iPhone or thermal results. A separate automated server test verifies that a 20-session room snapshot and movement fan-out work. Low-end-device data, thermal behavior, and production CDN transfer still need testing.

After the Palm Room stagecraft slice, the one-player 390 × 844 Balanced scene measured 31.4 ms median / 32.4 ms p95 (~32 FPS), 181 draws, 22,938 triangles, 18 textures, and 115 KiB locally reported transfer. This desktop-browser result is just above the 30 FPS engineering target; it is not a physical-device result and still needs headroom validation on entry phones.

The latest Music Square browser pass after the avatar cloth update measured 31.4 ms median / 32.7 ms p95 (~32 FPS), 186 draws, 34,686 triangles, 13 textures and 105 KiB reported transfer. These per-view readings use the embedded desktop Chromium at a mobile viewport and are not directly interchangeable with the earlier stress-test session; entry-phone profiling remains required.

After local stage-template restore, the Palm Room view measured 31.2 ms median / 32.4 ms p95 (~32 FPS), 186 draws, 23,590 triangles, 19 textures and 106 KiB reported transfer. This remains a desktop-browser result just above the 30 FPS target, not entry-phone evidence.

After the Release House station slice, the one-player 390 × 844 desktop-Chromium view measured 16.7 ms median / 18.6 ms p95 (~60 FPS), 173 draws, 19,454 triangles, 21 textures, 112 KiB reported transfer and 1.03 s to first avatar. Do not compare these embedded desktop-browser readings with physical phone performance.

After the service NPC and Palm Room visual pass, one active browser tab at the 390 × 844 Balanced viewport measured 16.6 ms median / 19.0 ms p95 (~60 FPS), 262 draws, 28,240 triangles, 25 textures, 129 KiB reported transfer and 1.09 s to first avatar in Palm Room. City Studio measured 16.7 ms median / 18.7 ms p95 (~60 FPS), 189 draws, 22,172 triangles, 22 textures, 113 KiB reported transfer and 0.94 s to first avatar. These are desktop-Chromium viewport measurements only; physical Android/iPhone performance remains untested.

After the Desk Bot first-track journey was integrated, the City Studio workstation view at the same mobile viewport measured 16.7 ms median / 17.1 ms p95 (~60 FPS), 159 draws, 19,336 triangles, 22 textures, 148 KiB reported transfer and 2.63 s to first avatar in one active desktop-Chromium tab. The live beat editor was open for this reading. Browser transfer and avatar-ready timings vary by session; this is not a physical-device result.

## Authored assets

| Asset | Source / creator | Rights and expiry | Transfer / format | Geometry, materials and animation | Target |
|---|---|---|---|---|---|
| Music Square environment | `app/src/world.ts` and `app/src/instanceBoxes.ts`; original project code, Codex-assisted | No third-party asset license applied; no license expiry. Commercial release still needs project-owner review. | No standalone image or model request. Paving, mural, signs and relief are generated in browser canvases; static boxes are instanced. | At the 390 × 844 Balanced baseline, the whole visible scene recorded 182 draw calls, 34,046 triangles and 12 WebGL textures. This includes the player avatar; environment-only mesh/material totals are not separately counted. | Music Square |
| Prototype avatar and cloth | `app/src/main.ts`, `app/src/avatarMotion.ts`, and `app/src/avatarLifecycle.ts`; original project code, Codex-assisted | No third-party rig or appearance asset applied; no license expiry. This stylized prototype does not establish commercial rights to any external likeness or game asset. | No standalone model or texture request; procedural Ankara-style shirt print and trouser weave are CanvasTextures in the JavaScript bundle. | Parent-group articulation for shoulders, elbows, hips, knees and feet; procedural idle, walk, and dance poses; yoke seam and trouser hem. Remote avatars skip the shadow-map casting pass. No GLB, skinned mesh, or reusable production skeleton. Avatar-only triangle/material totals are not separately counted. | Music Square and connected-player prototype |
| Synthesized beat preview | `app/src/beatPattern.ts` and `app/src/renderMaster.ts`; original project code, Codex-assisted | No third-party recording or sample pack. No license expiry. The generated preview is not a cleared commercial song or proof of upload/distribution rights. | 0 track-audio bytes before Play. Browser-generated oscillator voices; local WAV rendering is an export, not a licensed catalogue master. | Afrobeats Core, Piano Groove, and Highlife Vibe synth definitions; arrangement tempo is adjustable. No external audio file or compressed audio format. | City Studio workstation preview |
| Palm Room stage and rehearsal preview | `app/src/palmWorld.ts`, `app/src/stageTemplate.ts`, `app/src/main.ts`, and `app/src/style.css`; original procedural geometry and canvas textures, Codex-assisted | No third-party models, posters, performers, or tracks. No license expiry. Gear shown is a visual preview, not purchased or installed inventory. Saved stage preferences stay in this browser's local storage. | Lazy-loaded Palm Room scene module is 12.19 kB (5.29 kB gzip) in this build. No external image or model request. | Stage truss and fixtures, drum kit, keyboard, amp stack, floor monitors, road cases, cables, open-roof dusk skyline, textured floor and venue backdrop, three local light looks, and versioned local preview template. No rigged performer or production GLB. | Palm Room venue and stage setup |
| Service and ambient NPCs | `app/src/serviceNpc.ts`, `app/src/ambientNpcMotion.ts`, `app/src/world.ts`, `app/src/palmWorld.ts`, and `app/src/studioWorld.ts`; original procedural geometry and textures, Codex-assisted | No third-party model, likeness, rig or motion capture. No license expiry. Service and ambient NPCs are clearly labeled and never represent connected users or affect money, inventory, tickets, attendance, presence or analytics. | Authored geometry and one locally generated role-label texture; no external image, model, or audio request. Data Saver hides Music Square ambient walkers. | One venue usher, one studio technician, one City Concierge, and two low-cost looping Music Square pedestrians with distinct outfits. Ambient paths avoid obstacles and interaction hotspots; the figures have no interaction prompts and do not block the player. | Music Square, Palm Room, and City Studio |
| Desk Bot first-track and Ask journeys | `app/src/musicJourney.ts`, `app/src/deskQuery.ts`, `app/src/main.ts`, and `app/src/style.css`; original rules-based navigation, Codex-assisted | Uses only the player's existing local beat, master, release-draft, booth-audition and stage-preview state. Four fixed Ask intents use no third-party data or LLM; no reward, upload, publication or public-listen count. | Logic and cards ship in the main app bundle. No additional image, audio or model request. | Five optional creation steps connect City Studio, the Release House Title Sleeve and Listening Booth, and Palm Room through physical routes. Ask supports beat making, private release prep, approved discovery previews and venue exploration; unknown requests show a fallback. | Desk Bot Today / Ask |
| Release House preparation stations | `app/src/releaseWorld.ts`, `app/src/releaseJourney.ts`, `app/src/worldModel.ts`, `app/src/main.ts`, and `app/src/style.css`; original procedural meshes and canvas signs, Codex-assisted | No third-party cover art, master recordings, licences or identities. No license expiry. Rights checkboxes are player declarations, not verification; the calendar is read-only and no upload, reservation or publication occurs. | Lazy-loaded scene module is 2.78 kB (1.54 kB gzip); generated sleeve PNG is an explicit local export. No external image or audio request. | Six walkable stations with collision-tested routes: intake, artwork, metadata, listening, rights and calendar. Room test: 173 draws, 19,454 triangles and 21 textures at the desktop mobile viewport. | Release House |
| Browser favicon | `app/public/favicon.svg`; original project vector, Codex-assisted | No third-party marks or fonts; no license expiry. | 270-byte inline SVG file. | 64 × 64 crown mark on a charcoal field; static vector. | Browser tab |

## Source hashes

SHA-256 hashes identify the recorded source snapshot; regenerate them when those files change.

| Source file | SHA-256 |
|---|---|
| `app/src/world.ts` | `1A9EC456F3DC410C8BE0130BD9E6AC6A5E7E3079DC60EAF6411E923A9D4F8380` |
| `app/src/instanceBoxes.ts` | `E8B1FA074C60A568A209E6DCDFC4111AA7ABDBC3D5DB3C3115C0C4E6CB66576F` |
| `app/src/main.ts` | `655B791ABB4C019BDF949E542A4EA0A75E28F22FD15036145FE1FD3333A554C9` |
| `app/src/deskQuery.ts` | `EA401520522358459CD1F72EE0B7C1862B72882AC1690508620521F0D3F9EDAE` |
| `app/src/palmWorld.ts` | `8B26B1CF97FC868931B866815D9C70468824C405B6D3FFD12BF2FC134F0BA63C` |
| `app/src/serviceNpc.ts` | `747256F5E9D93E68749333285804ADB5232E5A55AFE72FD286407A6C6BF6154F` |
| `app/src/studioWorld.ts` | `7A810CCF8AED24EDB5A35707E68FA3ED4F2101827730E4C0B10A655E762B02E6` |
| `app/src/style.css` | `5B50D04F247E7636E181C693FF61A31F09D6882F6208790333140BA0820FBA0D` |
| `app/src/stageTemplate.ts` | `005470F811CE0D8D946D97825064E4A46AFEE14AF5A2BB4CCF9F53C311F71F04` |
| `app/src/releaseWorld.ts` | `54AC79FAAFE334A6FFFA6A9816E9F71CB5E89086B6031171CB50D7FB677A518C` |
| `app/src/releaseJourney.ts` | `B9A86E26A24A34EA2CE788D6DCEE23F8568A7BB73507322A1BCBDBE7EF258DE2` |
| `app/src/worldModel.ts` | `B9042A24366C1062CD56254CA3AA71EA5DD1F0219118D0E0FCE06E0974FCF46A` |
| `app/src/ambientNpcMotion.ts` | `498C54071C92F311B90F0966652228D581A317C62438B2C6AC17EC3770F84216` |
| `app/src/avatarMotion.ts` | `280F9B4298573FA712250F0A8CF02D7BFA4FFA3C8D36949AC57AA9E043667F98` |
| `app/src/avatarLifecycle.ts` | `2B47D5F195C311D105B48B7FF8FAC98D1E3729CCA88186D6D9CDF3B38C6A1B68` |
| `app/src/beatPattern.ts` | `10A6965C16F2ABB6E213F4C7ED42780D999E1E5013D637479C7F5A39B0A473C7` |
| `app/src/renderMaster.ts` | `2AE21717DE64565BB75BF0BDDCD68AC3318343294133DB73E603139418C14FE5` |
| `app/server/releaseCalendar.mjs` | `9601F527FFA88492038279B1FB296C9C5EE98ABE34F5D0D4C3983115CB13419F` |
| `app/src/musicJourney.ts` | `70EE57B78BD6AF4A12DECEFA73408040AB0B1300842E5FC6883F3E4E3C17BCCC` |

## Remaining release evidence

- Production artist rig and reusable animation clips with documented source, skeleton compatibility, and commercial rights.
- A genuinely cleared recorded test track if the release flow is to demonstrate licensed upload and public listening.
- Physical Android and iPhone measurements and low-end device/network checks.
- Scene-specific mesh and material counts. Current renderer metrics provide total draw calls, triangles, textures, transfer, avatar-ready time and frame percentiles.
