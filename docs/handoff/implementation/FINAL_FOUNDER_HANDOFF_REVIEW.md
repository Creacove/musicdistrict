# THE SCENE — Final Founder-to-Codex Handoff Review
**Version 2.1 · 12 October 2026 · Read before implementing Milestone M0**

## Verdict
The rules and gameplay foundations are sufficiently documented to begin **technical discovery and a small playable prototype**. They are **not** evidence that the game is already implementable at the fidelity of the concept images, or safe to launch with user music, live contracts and ticket payments. Do not create Chapter 11. Finish a beautiful, enjoyable, measured 3D vertical slice first.

## Mandatory first move for Codex
1. Inspect the *actual* existing repository, framework, hosting, databases, source control and deployment. Do not discard working systems or silently switch frameworks.
2. Read `AGENTS.md`, the Master GDD, this review, and M0/M1 in `implementation/QUALITY_GATES.md`. Inspect both current preferred visual references V26 and V27.
3. Return a **gap report**: implemented / partially implemented / absent / unclear, with evidence. Propose the smallest 3–5 PRs that produce one real interactive playable area, not a stack of screenshots.
4. Confirm what rights-approved temporary audio and 3D assets are actually available. **This archive has rendered UI concepts, not 3D models, character rigs, song licences or a running game.** See `implementation/ASSET_AND_ANIMATION_PRODUCTION_BRIEF.md`.
5. Run a measured renderer + input + audio + multiplayer spike on actual mobile hardware. Only then freeze renderer, scene budget and delivery order.

## Five genuinely important decisions still require real-world verification
**1. Integration/distribution:** THE SCENE must work independently. Before claiming Lagos Life single sign-on, native 3D avatar continuity, game-money settlement or embedded discoverability, obtain the current developer SDK contract, permissions and working sandbox responses. Never invent methods or conflate virtual wallets.

**2. Music permissions and moderation:** Decide who provides the *first cleared test music and loop packs*, what artist upload proof/attestation is collected, and who handles reports, takedowns and disputes. Player uploads cannot become public just because a file exists; licence scope for in-world and shared playback must be reviewed. Do not treat in-game song release as Spotify distribution.

**3. Audience, age and safety:** Choose intended audience/age treatment and required chat/privacy/report defaults before opening public messaging. A moderator/report path and emergency disable/takedown controls precede public UGC launch.

**4. Asset production and ownership:** Confirm whether Codex can use existing licensed/created GLB rigs, motion clips, props, loop samples and icons, or whether an artist/technical artist must produce them. Concepts alone cannot become shippable mesh assets. Verify permitted commercial use and attribution for third-party models/sounds. Do not transfer proprietary external game assets into THE SCENE.

**5. Target devices and spend ceiling:** Specify the minimum Android phone/browser and Nigerian network conditions to support, plus hosting/CDN/moderation monthly budget. Proposed byte/FPS thresholds are hypotheses until measured. Test cold/returning load, sustained play, data saver and 20 real-player concurrency, then scale toward 50.

## The first playable quality bar: 5-minute voluntary fun
One compact Music Square with a real moving avatar; one genuine human friend joins the same accessible instance; a discoverable listening kiosk plays an authorised song *only after user choice*; save/follow works; players can chat or dance; a studio/workstation and small open-mic venue can be reached by walking or available simple transport; a beginner can do a free music activity. Desk Phase 1 offers 0–3 **verified**, distinct next moves and leads to an in-world waypoint. A zero-money player must be able to complete this sequence and want to repeat it. None of this requires labels, agencies, giant halls, awards or an LLM.

## What we should not do
- Do not build ten businesses simultaneously; only **venue, label and promotion agency** are eventual V1 registered company types, one per player. Artist, producer and fan are not extra companies.
- Do not implement every screenshot as a dashboard. Keep the avatar/world central and forms short, contextual and responsive.
- Do not build the final scene as a large flat image or use AI-generated screenshots as 3D textures. The environment must have real geometry, movement and interactive objects.
- Do not animate a floating Desk robot on every scene. Desk's canonical presentation is phone + context-aware micro-prompt + route guidance; optional mascot may come later.
- Do not ship predicted streams, inflated user counts, pay-per-listen currency, real-world artist contract rights grabs, or campaign ROI promises from visual mockups.
- Do not start with a large open-world Lagos, cars and arenas. Small, populated, designed spaces and a lightweight authored travel experience are enough for the proof.
- Do not request or preload a whole music catalogue, thousands of covers or every avatar. Music streams on explicit choice; content is appropriately cached and culled.
- Do not let the optional LLM make a contract, payment, release, purchase or booking. The non-LLM verified recommendation engine must function perfectly without it.

## Evidence required from the first Codex handoff
- A brief codebase audit and itemised risk list with source paths/commits, not a generic architecture essay.
- Running staging link, actual PR/commit links, and a record of what deployment was tested.
- Mobile screenshots **captured from the real build**, plus 30–60 seconds of physical gameplay, on Android and iOS when available.
- Measurement sheet: initial transferred bytes, time to controllable avatar, stable FPS/long frames, audio bytes before Play, connection/reconnect, player presence count and phone thermals.
- Five bugs/edge cases demonstrated: denied microphone or blocked autoplay; offline/rejoin; friend group travel/room full; unaffordable purchase does not charge; cleared vs rights-blocked audio.
- A specific NEXT PR plan; clear flagged blockers that need founder approval rather than guesses.

## Where to find truth quickly
- Master gameplay and M0–M9: `master/THE_SCENE_Master_Game_Design_Document_v1.0.md`.
- Visual directory with **verified actual paths**: `implementation/REFERENCE_LOOKUP.md` and `references/IMAGE_MANIFEST.json`.
- Screens, interaction, error states: `implementation/SCREEN_STATES_AND_JOURNEYS.md`.
- Rendering/media limits: `implementation/PERFORMANCE_MEDIA_BUDGET.md`.
- Cross-chapter gameplay conflicts vs picture inventions: `implementation/REFERENCE_IMAGE_TRUTH.md`.
- 3D rig, animation, licensing and art deliverables: `implementation/ASSET_AND_ANIMATION_PRODUCTION_BRIEF.md`.
- Launch and PR signoff: `implementation/QUALITY_GATES.md`.

**Final boundary:** This is a design-to-engineering handoff. Implementation quality, music rights, integration privileges and business-economy balance remain things to *prove*, not to assume.
