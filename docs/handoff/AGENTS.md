# AGENTS.md — THE SCENE game build (portable authoritative handoff)

Read `START_HERE.md` and `implementation/FINAL_FOUNDER_HANDOFF_REVIEW.md` first. This archive is completely self-contained; reference only paths contained here or current repository files. Do not send Codex to ChatGPT, sandbox links, conversation library, or unavailable external attachments.

**Do not rewrite the game from scratch without inspecting the repository.** These are design and visual handoff materials, not a preexisting game implementation.

## Mandatory project map
- Canonical integrated design: `master/THE_SCENE_Master_Game_Design_Document_v1.0.md`.
- Chapter 0–10: `chapters/00_Architecture/` through `chapters/10_Desk_Bot/`, each in `.md` and `.docx`.
- H-Path interaction matrix / scenarios: `supplements/`.
- Screen states, visual design, performance media, real 3D asset/animation brief, asset budget, QA and final handoff: `implementation/`.
- 27 concept images: `references/screens/` with local file paths in `references/IMAGE_MANIFEST.json`.
- Current preferred art direction: `references/screens/26_FINAL_music_square_desk_today.webp` and `references/screens/27_FINAL_palm_room_venue_leasing.webp`.

## Authority, and how to resolve differences
1. Latest explicit founder decisions and actual SDK / legal constraints.
2. Master GDD cross-chapter decisions.
3. Relevant gameplay chapter and state machine.
4. Visual/UX/performance handoff documentation.
5. Concept screenshots (appearance only, never values or business logic).

## Practical build loop
1. Open canonical master and the smallest relevant chapter; inspect existing repo and current project state.
2. Find the related screenshots via the JSON manifest, noting reference truth/corrections.
3. Implement the smallest fun, physical, observable interaction. Use actual 3D with 2D DOM UI layers; do not turn the game into a static image or dashboard app.
4. Build mobile-first, then desktop; preserve accessible interaction, touch targets, fast UI, low-data option and meaningful travel.
5. Handle empty state, offline/poor network, expired content, affordability, asset/audio failure, reconnect, duplication, refunds and permission checks.
6. Measure FPS, data transferred, image/audio request count and budgets. Record evidence and fix performance regressions.
7. Show what changed, how to test, and what is still blocked; never assert completion without real verification.

## Core invariants
- One avatar per player, one registered company at a time; fandom, music production and side jobs remain activities.
- One authoritative ledger for in-game money; secure escrow/holds and server-side transaction validation.
- Concert ticket purchases and attendance require genuine players; never use NPCs to fabricate streams, follows or sales.
- Real song uploads require rights clearance. No automatic pay-per-stream currency creation.
- Desk Phase 1: practical rule-based Today/Ask/Plans/Next Moves with ZERO LLM; Phase 2 optional cheap language model, same source-of-truth and permissions. Desk never makes decisions, transfers money or signs contracts for players.
- Travel and navigation involve physical movement or accessible transit, not instant completion of gameplay.
- Official chart ranking cannot be bought with advertising. Sponsored placements are identifiable.
- Zero-balance players must be able to enjoy free music discovery, collaboration, social spaces and starter earning paths.
- External Lagos Life SDK features are conditional; don't assume shared 3D avatar, cross-game wallet or undocumented methods.

## Performance and art
- Reference screenshots are for inspiration and UI composition, not shippable textures, scene renders or 3D geometry.
- Load current scene only, compressed textures and meshes, nearby player avatars with LOD/instancing, media from CDN, and posters only when nearby/visible.
- Never preload music catalogue. Audio starts following player choice/permissions, and should support low-data mode.
- Prefer attractive authored stylized low-poly environments, good composition, warm local materials and tasteful lighting over expensive real-time glows everywhere.
- Test entry Android devices as well as iPhone and desktop; degrade quality gracefully.

Stop for decisions about economy, paid rights, unusual music licences, contract rule changes, fake activities, user consent, cross-game platform APIs or changes to canonical gameplay.

## Last handoff patch v2.1
- Verified visual IDs are **V01–V27**, paths in `references/IMAGE_MANIFEST.json`. Open `implementation/REFERENCE_LOOKUP.md`. Historical H-Path `R01–R16` mean *role IDs*, not screenshot file paths.
- All 27 screenshot image paths were checked locally. The previous version had obsolete `ref_*` paths in the image lookup; those were corrected in v2.1.
- Read `implementation/ASSET_AND_ANIMATION_PRODUCTION_BRIEF.md` before trying to rebuild AI pictures as a full 3D world. The archive contains NO runtime GLB rigs or cleared tracks.
- Treat old H-Path role matrix in `supplements/` as early exploration; the Master and Architecture v0.2 remove investor/manager/studio-owner as separate V1 companies.
