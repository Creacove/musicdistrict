# THE SCENE — 3D Asset, Animation & Audio Production Brief
**The bridge from the bundled 2D concept screenshots to a real mobile-browser game.**

## What the bundle contains, and what it doesn't
27 optimised 2D visual references, gameplay specifications and quality targets are available locally. They are **not** production 3D assets. No artist avatars with skeleton/rig, full venue GLBs, animation library, usable in-game fonts, or cleared commercial music catalogue can be assumed merely from those pictures. A screenshot of a room cannot be imported as a navigable, interactive room.

## Minimal playable asset manifest (build or properly license; keep source licences)
| Group | First playable deliverable | Mobile budget approach |
|---|---|---|
| **Environment** | One Music Square tile; small City Studio, kiosk, mini-concert venue | Modular author-made geometry, repeated facades, texture atlases, baked lights |
| **Character** | One base avatar rig with a few customisable variations | Shared skeleton and materials; compact texture sets; avatar appearance not licensed from Lagos Life unless permitted |
| **Animations** | Idle, walk, turn, approach/interact, sit, dance, cheer, hold phone | Short reusable clips and transitions; prevent foot-sliding and geometry collision; state machine, not every-frame allocation |
| **Social** | Simple 2-player dance/gesture invite, reaction effects | Require both parties' consent, timeouts on disconnection, clips reuse |
| **Studio** | Beat workstation, simple sequencer buttons, microphone booth, save-recording interaction | Lightweight physical props; sequencer is a genuine interactive DOM/control system, not a pre-rendered screenshot |
| **Music discovery** | 1 kiosk, poster display, small artwork wall, personal audio controls | Lazy image variants and texture disposal; stream chosen authorised audio only |
| **Event** | Stage, speakers, basic lights, 20-user pilot seating/standing layout | Baked ambient lights + few dynamic accents; stage animation synchronised to audio timeline |
| **Venue ownership** | One inspectable starter venue, a few movable chairs/lights/gear, object placement preview | Snap points/limited editable zones rather than arbitrary mesh editing |
| **Interface** | Mobile HUD, touch input, compact bottom sheet, Desk Today/Ask/Plans | DOM UI layered over WebGL canvas; CSS tokens; no fake browser address bar |
| **Sound** | Licensed test song(s), permitted loop pack, click/UI sounds, ambience | Rights log by usage and expiry; test mute/autoplay permissions; low-data formats |

## Asset acceptance (every GLB/animation entering the build)
Record `source/creator`, allowed commercial rights, hash, name, estimated transfer bytes, triangle/mesh/material count, number of texture sets, compressed format, animation names, skeleton compatibility, license notes and target scene. Preview on an inexpensive Android device. Reject objects causing materially excessive draw calls, download size or decoder stalls, even if screenshots look spectacular.

## Animation and feel QA
- **Responsiveness:** avatar can accelerate, stop, rotate and approach a station without jitter or skipped collision; mobile touch controls are usable one-handed.
- **Transitions:** idle→walk→interact→idle feels continuous; no floating feet, avatar snapping, stuck trigger zones or rubberbanding after a reconnect.
- **Social sync:** dance and cheer are shared avatar actions, but no avatar can be controlled or paired without consent. Interpolation must tolerate packet delay.
- **Performance:** test 1/5/20 nearby avatars, quality tiers, loaded images, studio interactions and audio playback simultaneously, not in isolated screenshots.
- **Audio:** songs have clear personal-vs-room audio policies and do not play on page load unless permitted by browser and user settings.

## Reference-to-world translation procedure
1. Open current preferred V26/V27 and relevant role screenshot through `references/IMAGE_MANIFEST.json`.
2. Extract *design properties*, not screenshot pixels: camera angle, spatial layout, light direction, material palette, silhouette, touch hierarchy and scene affordances.
3. Build one low-cost greybox that can be walked through and touched. Validate player visibility, object spacing, navigation and frame time.
4. Replace greybox with authored reusable meshes and baked lighting, apply design tokens to DOM overlays, retest after each visible improvement.
5. Capture fresh screenshots from the **running game**; compare against visual references for quality and against Master GDD for actual permitted behaviour.

## Stop/ask items
No speculative reuse of Lagos Life 3D avatar/meshes or protected sound effects; no unlicensed popular songs; no actual user content without moderation; no assumption that a 500-seat screenshot means a 500-user live browser instance is deployable. Escalate rights, source asset access and price changes as decisions rather than synthesising unsupported assets or APIs.
