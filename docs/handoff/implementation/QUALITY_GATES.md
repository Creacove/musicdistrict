# THE SCENE — Codex Implementation Milestones & Release Gates v1.0
**Use with Master GDD §35 (M0–M9), not in place of it.** The same fun vertical slice must be measured against real low-cost mobile hardware as well as backend correctness.

## M0 — Decide technical feasibility before committing to a renderer
Audit existing repo, SDK, domains, asset pipeline, existing components, current live deployment and source of server-side truth. Compare renderer candidates by a **small playable prototype**: one room, 5 avatar models, 3 locomotion animations, one mobile HUD, one music station, one travel transition. Implement an instrumented cold-load measurement. Choose Three.js / R3F or alternative based on real measured fit, not a template preference.

## M1 — Social world in < 5 MiB transfer target
One attractive daylight/evening Music Square (both authored lighting variants), one avatar, other genuine connected players, text chat/emotes, camera/touch controls, route map. No giant neighbourhood. FPS/bytes measured; 20 player presence simulation. The square must *feel designed* with 10 players and not fake 10,000.

## M2–M3 — Actual reason to return
V1 City Studio simple beat loops and authorised uploaded music → Release Hall for approved releases → listening → one 20–50-person concert room with real ticket/attendance separation. Real playable world, not static mockups. User can complete a three-minute social/music story.

## M4–M7 — Economy/business continuity
Server ledger, venue booking/leases, no duplicate holds, promotion visible physical placements, label up-to-3 funded artist agreements, properly moderated catalogue, chart integrity. Every financial action needs **one payer and receipt**. Introduce venue upgrade visible in the world only after place+inventory state survives reconnect. Reviews with actual newcomer/player budgets.

## M8 — Desk Phase 1
Run the same option cards against verified game state: fan, artist, promoter, label, venue. Five scripted cases: no money; release approval pending; no venue bookings; label funds almost exhausted; open mic starting soon. All behave without any LLM request. The player always chooses and confirms actions.

## M9 — Desk Phase 2 optional
Cheap LLM server-side translates verified query and formats verified 0–3 options. Disable the LLM and the same app remains useful. Safety: hidden instructions from song titles, player chat, event ads and artist bios cannot override action registry.

## Per-PR demo evidence template
- **Player experience**: what they did physically, target time 5/20/60 minute session, whether fun without money.
- **Version links**: commit, tested branch and staging URL (do not claim deployed without evidence).
- **GDD trace**: Master § and relevant chapter, `R##` imagery intent, screenshot truth exceptions.
- **UI**: mobile and desktop real screenshots; touch safe areas; empty/loading/error states.
- **Server truth**: what backend command produced the state and test of double-click/expired contract.
- **Performance**: cold transfer KiB vs budget, second-visit KiB, p75 playable, median/p95 frame times, highest unexpected request, highest texture/bundle offenders.
- **Music**: what audio bytes downloaded without tapping play? Must be ~zero track audio.
- **Safety**: player mute/block/report and uploaded rights workflow where relevant.

## Blockers before public paid concerts
- Payments/refunds and event caps race-safe; disconnected organiser/rejoin tested.
- Human check-in and music-chart qualification separate from NPC and backdrop.
- Real uploaded song moderation + copyright/takedown response.
- Mobile Safari explicit play and audio-zone mixing work.
- Zero-money fan path remains playable.
- Tested low-end devices have no repeatable crashes, sustained thermal throttling or significant scene leak.

## Design approval checkpoints
Founder approves: camera framing, main day & night palettes, avatar quality, Desk entry modes, venue leasing screen, one physical release workflow, music player, 50-person concert feel. Brand polish should be evaluated after interactable demo, not against isolated AI shots alone.
