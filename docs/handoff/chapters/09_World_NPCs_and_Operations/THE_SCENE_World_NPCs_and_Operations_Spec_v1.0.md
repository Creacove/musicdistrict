# THE SCENE
## Chapter 9 — World, NPCs & Operations: Standalone V1 Game Design and System Specification

**Version:** 1.0  
**Date:** 12 October 2026  
**Document owner:** THE SCENE game design  
**Status:** Founder-aligned working implementation baseline; untested values are explicit design hypotheses  
**Scope:** Physical game world, built environments, avatars, movement, interactable objects, service NPCs, beginner work, social density, world-state authority, operations, accessibility, technical hosting, moderation, safety, monitoring and live-service launch.  
**Upstream:** H-Path Architecture v0.2; Venue Operator v0.3; Artist v0.4; Record Label v1.0; Promoter v1.0; Fan & Social v1.0; Concerts & Shared Events v1.0; Music Discovery & Charts v1.0; Economy & Contracts v1.0.  
**Next deliverable:** Reconciled master game design, cross-chapter decision register, milestone plan and executable vertical-slice backlog.

> **Core promise:** The player enters a real-feeling, persistent, music-centred virtual city. They walk into studios to create music, visit posters to discover events, enter venues to watch a show, rent and furnish businesses, and meet people whose actions affect the same world. The virtual city is not a decorative wrapper for forms. **But rendering must never pretend that NPCs are paying customers, fake listeners or human followers.**

## Reading guide: what is settled and what is not

**[C] CONFIRMED** = founder-approved design inherited from earlier conversations/chapters. **[D] DESIGN BASELINE** = specific, testable V1 proposal made here, subject to prototype and load-test calibration. **[X] EXTERNAL GATE** = cannot be assumed until third-party platform, licence or legal permissions are verified. **[F] FUTURE** = intentionally not implemented in V1. Founder-approved gameplay takes precedence over implementation convenience. The newest, more specific shared chapter governs its own service: Chapter 6 owns tickets and event capacity; 7 owns qualified listening and charts; 8 owns money, contracts and atomic financial settlement. **This Chapter 9 owns physical representation, world presence, scene interaction, non-human behaviour and game operations.**

**The game's illustrative ₦-style balances represent THE SCENE's own fictional, non-cashable simulated currency, not Nigerian naira, real money, transferable Lagos Life funds or redeemable tokens.** No Lagos Life wallet import, full-3D avatar reuse or inter-game currency exchange is approved or presumed. The game also runs independently on its own HTTPS domain. [C/X]

---

# 1. What we are building and the experience test

THE SCENE is a mobile/browser-first, third-person multiplayer 3D life simulation with a music industry at its centre. It must pass three distinct tests: (1) a no-money fan can enjoy ten minutes of discovery and social activity; (2) an artist can physically make/bring a song into the world and meet real listeners; (3) a business player can see operational consequences of renting, furnishing, promoting and staging events. All three must share one world calendar, one identity model and one authoritative business economy. [C]

The gameplay hierarchy is **music and people > places and stories > business and money > decorative realism**. Rendering hundreds of buildings is not progress if the player's friend cannot join them at a small show. Conversely, a collection of attractive menus is not a convincing Sims-like world if the player never walks up to an instrument, a poster or a venue door. [C/D]

**V1 world promises [D]:** A memorable compact entertainment district; seamless or clearly indicated portal travel between a handful of authored public places; live avatar movement and expressive social interactions; persistent brand and object states; physical access to most major career actions; free leisure and recovery loops; real-player social discovery; reliable small concerts; basic homes and business interiors; mobile-first rendering. No giant map, vehicles, property construction or illusion of thousands of simultaneous human concertgoers.

# 2. World topology: start small, never feel empty

## 2.1 Single musical hub plus destinations [D]

Launch with **one dense, walkable core district**. Working name: **The Scene Quarter**, with a Lagos-inspired cultural identity but no requirement to reconstruct Lagos street-for-street. The hub should visually communicate nightlife, contemporary Nigerian street culture, music creation and entrepreneurial opportunity. Avoid a copyright-dependent facsimile of Lagos Life assets or branding. Streets, architecture, posters, signs and music are original/licensed assets. [D]

The core map supports a single connected pedestrian circuit: arrival plaza -> Music Square -> Release Hall -> public recording studio -> compact live venue -> social lounge -> business registry -> advertising wall/market -> return to plaza. The player should be able to **walk between the most important destinations without a tedious commute**. Target traversal times below are tuning assumptions, not promises before measurement.

| Traversal and navigation item | Alpha design target [D] | Player experience |
| --- | --- | --- |
| Spawn to an immediately useful activity | Under 15 seconds from controllable avatar | Never arrive in an empty car park |
| Hub landmark to another primary landmark | Roughly 15–45 seconds on foot | Exploration is enjoyable, not a commute tax |
| Entrance to usable interaction inside a small venue | Under 15 seconds after loading | Show begins quickly |
| Major event / friend join | In-world route or explicit one-tap travel option | Social groups are not lost crossing districts |
| Map scale at launch | One compact hub + instanced interiors | Density over acreage |
| District identity | Signed destinations and cultural cues | Expansion is possible without pretending full Lagos exists |

District identities such as Yaba, Surulere, Ikeja and Lekki may initially exist as **named music/community categories, venue addresses and curated backdrops**, rather than four kilometres of continuous traversable terrain. The fan/artist district-chart rules rely on eligible game activity/declared in-game home district and credible signals, not GPS tracking. Before adding any physically separate district, we must show that current concurrency can populate it. [D]

## 2.2 World map layout, suggested v1 site plan [D]

1. **Music Square (always free):** default spawn, live event screen, music discovery kiosks, social seating, dancing, starter-job noticeboard and routes to all critical services.
2. **Release Hall (free):** physical record-wall browse, Friday live release display, song artwork and listening alcoves; backstage/artist submission stations accessible by permission.
3. **Public Recording Studio (free basic access):** loop workstation, vocal booth or eligible file-import desk, approved project shelf, producer marketplace and paid professional collaboration tools.
4. **The Basement (author-authored 20–50-person event venue):** consistent small event template, auditions/open mics, first Stage Mode tests, audience interaction and check-in.
5. **Social Lounge (free):** approved room audio, chairs, emotes, chatting, moderated listening and hangout space.
6. **Business Registry + Office Lobby:** register one eligible business, inspect example office interiors, handle office leases, business sale/closure permissions.
7. **City Property Desk + Venue Showcase:** browse unique rentable properties with truthful vacancy/booking calendars; inspect sample furniture/equipment without buying first.
8. **Stage Supply + Equipment Yard:** NPC-owned inventory, preview placement, purchase/temporary rental, delivery/return and ownership labels.
9. **Public Poster Lane:** city campaign placement inventory and free community boards, each with attributable owner/expiry and no ad spam.
10. **Personal Room Portal:** private basic personal space, displayed memories, wardrobes and personal listening station. Room has an instant-entry fallback, not a compulsory rent.
11. **Official Event/Awards Plaza:** communal chart reveal, Destiny Awards announcement boards and occasional public free programming. A big ceremony stage is **not** a promise of arena concurrency.

**Originality rule:** physical names may be changed during art direction, but functional surfaces and shared service contracts must survive the reskin. No monetisation feature is tied to a particular art asset name. [D]

# 3. The world is layered, not one giant server

The visual fiction is a connected city; technically, separate spaces can be different scenes, servers or rooms. Players move through doors and transitions rather than requiring an impossible single-process city. [D]

| Layer | Contents | Authority / persistence |
| --- | --- | --- |
| **Public hub instance** | Shared streets, social plaza, browseable boards, visible avatars | Server tracks presence, permitted interactions and public world projections |
| **Public service scene** | Studio, registry, city store, Release Hall | Permanent authored scene; service commands survive scene unload |
| **Owned/leased business scene** | Venue interior, label office, promotion agency | Unique physical/property identity + versioned configuration; owner permissions and lease state authoritative |
| **Event session** | Specific concert/showcase/audition | Own event ID, fixed global tickets/admissions, shared timeline and moderation |
| **Personal room** | Player decorations and career memories | Owner-scoped persistent layout; private by default |
| **Global services** | Wallet, contracts, songs, charts, friends, messages, calendar, inventory, rights | Independent of which 3D instance a player occupies |

A public hub may open another technical instance after reaching its **tested concurrent-person limit**. A specific leased venue/property is still **one business identity**; its owner, physical layout version, rent obligations, public booking calendar and reputation cannot become duplicated businesses just because several render servers exist. A paid concert is one logical event, not a hidden set of profitable cloned shows. [C/D]

## 3.1 Instance naming and discovery

Each room has `space_id` (the persistent conceptual place) and `instance_id` (the current runtime copy), while each live performance has `event_session_id` and `event_id`. Users may see `The Basement / Saturday 8pm` but not necessarily the infrastructure instance code. Friends get **best-effort same-instance placement** when compatible with valid ticket access and actual capacity. A hub can show `Active / Quiet` status based only on real eligible humans, never NPC background counts. [D]

A capacity-bound event must never increase its published seat inventory because another instance booted. Where multiple public hub copies exist, prefer the most socially populated permitted copy that can fit the group and still preserves safety requirements. [C/D]

# 4. Art direction: distinct THE SCENE identity

The game should feel like a designed music city, not a photorealistic Lagos traffic simulator and not a clone of Lagos Life. [D]

**Proposed direction:** Stylised but mature proportions; expressive human avatars; warm atmospheric night and daytime lighting; richly observed music signage and familiar urban material cues; high contrast, strong silhouettes and readable entrances. The scene is lively through music, player-created publicity, real event calendars, moving screens and believable ambience, not walls of generic neon gradients. Make the town feel owned by music and human participation, not by ad slots. [D]

**World storytelling objects:** Record sleeves in windows; flyers for actual upcoming shows; brand logos on leased venues; framed awards in offices; posters that change on Friday; purchased furniture and sound equipment appearing in their actual 3D positions; chart boards with verified song names; booked show signs that correctly say `SOLD OUT` or `CANCELLED`. Scene state is produced from canonical services, not arbitrary hard-coded demo numbers. [D]

**Environment cadence:** A deterministic lighting cycle based on Lagos time is attractive but must not force players online at a particular time to see content. V1 can use authored day/night variants keyed to real WAT with lightweight transitions; critical UI remains readable in both. Weather, traffic, procedural crowds and extensive seasons are future enhancements, not prerequisites. [D/F]

# 5. Avatar: one continuing person, not a class

Every account has one core avatar identity that persists through changes of job, artistic activity, company ownership and personal fortunes. Avatar choices are not permanent career gates. The avatar has display name, visible chosen appearance, locomotion state, expressions, eligible cosmetics and profile/history pointers. The same person may be an artist, producer, fan, promoter-for-hire and label owner, while owning at most one registered company at a time. [C]

## 5.1 Avatar creation [D]

First-time flow: pick an authored base avatar -> choose face/hair/skin tone/clothes from a compact inclusive set -> preview in real third-person scene -> save -> enter Music Square. Cap the time to a first playable avatar; offer a reasonable default and a free later edit. Do not require a company selection, upfront funding or artist upload during arrival.

**No imported 3D Lagos Life avatar in the documented Vatar v1 integration [X].** Its known `player.avatar` is a small profile image, not a movable mesh. THE SCENE's original 3D avatar data remains owned/controlled by our game. The same user can be identified for embedded access through the documented platform token where integration is approved, without presuming wallet or avatar interoperability.

## 5.2 Movement and camera [D]

| Input | Portrait touch | Desktop keyboard / mouse | Server/game meaning |
| --- | --- | --- | --- |
| Walk | Left floating joystick or tap-to-move option | WASD/arrows | Validate speed and collision before shared replication |
| Look / orbit | Drag open world area | Mouse drag / Q,E alternative | Client camera only, no economic authority |
| Interact | Large contextual button near target | E / Enter | Server validates player-to-object distance and permissions |
| Open phone | Persistent accessible icon | Keyboard shortcut | Non-blocking until modal focus |
| Emote / dance | Compact radial action menu | Hotkey | Replicated expressive state, rate-limited |
| Run | Optional toggle | Shift | Speed/energy purely locomotion, not pay-to-win |
| Accessibility travel | `Go to...` path/teleport to eligible landmark | Map click | Transparent transition subject to instance capacity |

Use stable third-person follow camera; collision must stop avatars passing through walls, countertops, stage boundaries and equipment. Camera collision prevents the lens from passing through opaque structures. Do not rely on perfect pathfinding through crowds; avatars may locally avoid but should not cause severe bouncing or trap newcomers. Emotes never change wallet balance or chart score. [D]

**Animation set, V1:** Idle, walk, jog, sit, greet, wave, clap, cheer, four distinct dances, record at mic, operate studio desk, hand over record sleeve, venue inspection, sign contract, place furniture, and optional paired dance. Use readable fallback animations if a device drops quality. Genuine playable interactions cannot require completing an unskippable decorative animation. [D]

# 6. The physical interaction language

We need one consistent grammar for every interactable object, so the game does not become an unrelated series of interfaces. [D]

**Six steps:** **Approach -> Discover affordance -> Open object-specific close-up -> Act/choose -> Confirm authoritative result -> See world consequence.** A player can use the phone as a shortcut after learning the interaction; this does not remove the physical version. The interaction prompt must show ownership, cost (if any), requirements and whether other people can see its effect.

| Physical object | Actual gameplay action | Authoritative service | Visible result |
| --- | --- | --- | --- |
| Record on studio shelf | Select and preview an approved personal project | Music/rights | Sleeve appears on desk; audio preview |
| Drum pads / loop station | Combine compatible loops and arrange a beat | Creative project | Audio changes; project saved |
| Mic booth | Record where permitted or import a vocal take | Media/rights | New draft/take appears |
| Release House machine | Submit rights-approved recording for Friday | Release service | Pending/approved status on physical record |
| Artwork wall | Upload/select artwork, inspect and commit | Media and release | Frame updates after moderation/safety |
| Public song display | Listen, save, follow, share | Catalogue/identity | Real release and artist metadata |
| Poster board | Inspect, reserve permitted placement, publish approved campaign | Ads/promoter | Only that slot changes; correct expiry |
| Venue door/check-in stand | Inspect show; validate free or paid entitlement | Event/tickets/presence | Enter **one** actual event session |
| Event stage controls | Run your authorised set and approved effects | Stage/event | Attendees see same safe cues |
| Venue floor editor | Drag/place compatible owned equipment | Property/inventory | Changed 3D layout and quality scores |
| Property booking board | Quote/hold/commit a specific event date | Venue/event/ledger | Time slot blocked globally |
| Label listening wall | Review real public artist demos and scout | Artist/label | Scout list changes; no fake score |
| Contract table | Review fixed deal, counteroffer and accept | Contract/ledger | Signed paper animation after final reserve |
| Promotion planning wall | Choose real placements and approve campaign | Campaign/ledger | Posters appear only upon valid delivery |
| Job board + real-world task props | Accept and perform limited city-funded job | City job/ledger | One verified wage credit |
| Market display / Stage Supply | Inspect compatibilities, buy or hire | Shop/inventory/ledger | Item delivered to eligible storage or space |
| Personal room shelf | Place earned history cards or owned cosmetics | Identity/room | Persistent private arrangement |

**No phantom success:** For each action the object animation follows a *server-accepted* outcome. A client must not display `Booking confirmed`, `Paid`, `Release approved` or `SOLD OUT` because its own animation ended. On network failure, visibly mark `Not confirmed; retry`, preserving the draft and idempotency key. [C/D]

# 7. Interaction distance, permissions and accessibility

Each interactable object has a stable `object_id`, type, target point, radius, access roles, scene version and service command. Distance checks must use server-accepted player presence (with tolerance for network jitter) rather than arbitrary client-supplied coordinates. **Proposed defaults [D]:** 2.0–2.5 world metres for a kiosk/desk interaction; 1.5m for a personal/paired interaction; no distance requirement for an authenticated phone shortcut when remote use is permitted. A user must not exploit an interaction to operate a business desk or private store they cannot legally access. All command execution is separately authorised even when the camera is already close to the object.

A clear **interact outline/prompt** appears only for useful nearby objects. Prioritise one primary target over a dozen overlapping floating buttons. In portrait mode, put the action near a reachable thumb zone, preserve a labelled accessibility list of nearby objects, and allow `tap nearby objects` when joystick precision fails. Tooltips must explain locked targets without implying a paid upgrade is required for basic fun. [D]

# 8. Buildings, interiors and property inventory

## 8.1 All venues are prebuilt [C]

V1 does **not** let players construct buildings from scratch or claim land. The city maintains a curated catalogue of individually identifiable venue properties with fixed maximum capacities and compatible fit-out classes. Some can be directly hired for one event when city-managed; some can be controlled by an active player venue business under an operating lease. A unique public venue name, location and physical inventory cannot exist as two simultaneously sellable properties just because a hub has more than one technical instance. [C]

**Venue classes inherited from Chapter 1:** small rehearsal/performance room; intimate lounge (approximately 50–80); live hall (approximately 100–250); premium event centre (approximately 300–750); arena (approximately 1,000–2,500); large landmark (5,000+). **Important scope gate:** physical assets may contain aspirational large halls but V1 cannot honestly sell a 1,000-seat fully interactive ticketed performance before multiplayer/load tests prove such a concert can be delivered. Prioritise one polished 20–50-person venue session for playable launch. [C/D]

## 8.2 One venue business, one flagship venue [C]

A player can own **one venue-operator company** and operate one active flagship venue under lease in V1. Others can book it through the official calendar; the operator can host their own events and sell booked time under the venue lease conditions. An ordinary event renter gets only an **event-use entitlement**, not a right to sublease, sell fixtures, change structural capacity or cancel unrelated bookings. The operator's business identity persists if they move to a different venue. A property's public history is also preserved independently of the business that once operated it. [C]

## 8.3 Operating lease versus day-event hire

Keep two different legal/game objects: `PROPERTY_LEASE` (venue company operating control during prepaid effective blocks) and `EVENT_HIRE` (one organised event and named time window). Calendar, the property entitlement and the ledger are authoritative. A seven-day lease may be priced as a discounted operating arrangement relative to seven separate event hires; chapter 1 working anchor for a 50-seat venue: **₦6,000 single-day event rent**, **₦29,400 seven-day operating lease**. These are fictional design prices [D], not real-world listings. A player-owned venue may charge a separate agreed event rate, and the operator cannot book beyond its secured lease or create commitments it cannot fulfil. [C/D]

**Reservation continuity [D]:** An operator proposing an event beyond their current lease must extend/prepay operating rights covering that event or decline to accept a binding paid booking. If a valid booked event survives an exceptional property change, the contract engine must preserve buyer remedies and disclose venue reassignment/refund terms rather than silently replacing the venue. Shared Chapter 6/8 service owns specific liability; this chapter owns the world-visible and permission changes when a lease starts, ends or transfers.

## 8.4 Interior equipment and identity [C]

Venue interiors ship with a working minimum baseline (stage, lights, chairs, speakers and accessible paths). Eligible purchased or rented equipment visibly occupies floor space. Compatible stage, sound, lighting, seating, decor and audience facilities modify **size-relative** 1–10 quality ratings; a 50-seat venue can achieve 10/10 small-room sound without costing as much as arena-scale sound. The ratings indicate facilities, **not bought popularity**. They cannot create listeners or ticket buyers. [C]

Visual assets are componentised: one venue shell, authored sockets, chair groups, light rigs, movable approved props, speakers and signage. Each item has ownership, placement constraints, safe electrical/capability category, render cost, physical footprint, storage identity and (if rented) return deadline. A saved interior layout refers to immutable item IDs and a `layout_revision`, not only coordinates drawn on a client screen. [D]

# 9. Furnishing, layout editing and physical risk

Venue operating enjoyment comes from *making a place recognisably yours*, not building a skyscraper. Players buy or rent eligible furniture/equipment at Stage Supply, inspect compatibility and install it with a visual placement preview. [C]

**Layout edit sequence [D]:** operator enters edit mode -> owned/rented item tray opens -> choose item -> drag/rotate to allowed snap zone -> collision/path/safety validation -> review score/capability changes -> confirm -> server locks property revision -> persists item placement -> publishes updated layout to authorised scenes. The owner can save two or more named layout presets for fast show turnaround; an accepted event contract may capture a required equipment/quality snapshot. A layout cannot be downgraded after promising specified equipment to an already-ticketed show without consent/remedy. [D]

**Protected zones:** Door and fire egress, wheelchair routes, stage emergency accesses, ticket scanner, performer safe zone, speaker acoustic ranges where simulated, and audience cap cannot be obstructed. No player can create a box of chairs trapping avatars. Auto-repair or revert to last safe layout if assets corrupt. Rented equipment expiration triggers a safe removal outside active commitments or a defined dispute, not a mid-song vanished stage. [D]

**Item recovery:** Portable owned items return to authorised inventory when a lease ends; fixtures supplied by the city remain with the city; rented equipment returns to its NPC service after contract; sold business assets transfer under an approved business sale, not through duplicate copies. Server inventory IDs guard duplication. [C/D]

# 10. Offices, studios, shops and homes

## 10.1 Record-label office [C]

A small authored office template contains listening wall, roster showcase, finance/project board, contract table and historical achievements. Three simultaneous active artist contracts at most for V1. The office's 3D objects are projections of Chapter 3 contract/roster/project data. Decorating the office may communicate success; it cannot raise an artist's chart score or override contractual autonomy. Company identity persists outside the lease. [C]

## 10.2 Promotion agency [C]

A compact office has a campaign-planning wall, poster designer, map of eligible ad slots, client list and portfolio display. Freelancers may use free city workstations without renting any office or creating a company. Paid advertising appears in its finite physical city slot; there is no spam teleportation into strangers' phone notifications. The promoter cannot purchase genuine listens. [C]

## 10.3 Recording studio and producer activity [C]

Studios are NPC-operated services/places in V1, **not a fourth registrable business**. A basic loop workstation is free. A player can make a beat and sell an eligible licence or collaborate without changing their profession. A compatible loop pack, arrangement timeline and optional vocal recording/upload create a draft recording; original/cleared real songs can be imported. A phone/physical station can submit eligible recordings for weekly Friday release. No AI-generation subscription is a prerequisite for V1. [C]

**Embedded capability [X]:** The documented Vatar game frame excludes microphone/camera privileges and does not grant native OS capabilities. Live vocal microphone recording cannot be promised inside it. Standalone browser recording may work with opt-in browser permission; player may also use previously recorded audio via a tested supported upload flow. File import inside the embedded frame must be verified in the platform sandbox before being advertised; if unavailable, provide a permitted alternative without bypassing platform restrictions or assuming popups work.

## 10.4 Personal room [C/D]

Every player gets a basic private personal space without purchasing property. It holds career memorabilia, a music player and optional decorations. Default access is owner-only. No mandatory daily rent, no homeownership business in V1, no forced NPC landlord narrative. If a guest visit feature is enabled, host consent, capacity and safety rules apply. Do not store large numbers of separately animated memory cards as expensive always-loaded world objects; stream room displays when entering. [D]

# 11. NPC design philosophy: essential, useful, honest

An NPC is a non-human entity controlled by game systems. It may make the city appear active, teach a mechanic, sell published goods, operate a basic facility, announce an event, verify a ticket or offer limited paid starter work. **It may not pretend to be a human customer who spent player money, a real follower, a chart listener, a genuine ticket holder, an award voter or an independently intelligent player-company executive.** [C]

## 11.1 NPC types and narrow roles [D]

| Type | Location | Function | Financial effect | Forbidden representation |
| --- | --- | --- | --- | --- |
| Ambient pedestrian | Streets, lounge | Walk/stand/sit, benign gestures | None | Cannot count as connected humans or music fans |
| City concierge | Spawn/Music Square | Teach controls, lead to free content | None | Cannot invent a paid opportunity or fake reputation |
| Job supervisor | Noticeboard/venue/studio | Assign and verify approved city tasks | Explicit capped city wage | No unlimited idle-pay cycles |
| Registry clerk | Business registry | Explain one-company rule, show eligible licences | Authoritative city fee through ledger | No second company by fake dialogue |
| Property agent | Venue desk | Show unique property inventory, tours, quotes | City rent/lease only on server-confirmed contract | No phantom vacant property |
| Stage Supply attendant | Equipment shop | Offer approved equipment and compatibility checks | City sink/service settlement | No cloned purchased inventory |
| Studio technician | Studio | Help load authorised loop pack, basic tutorial | Optional published fixed service fee | No claim that NPC produced a real human's song |
| Venue usher | Event door | Present rules, direct avatar movement | None by itself; ticket service handles status | No acceptance of invalid ticket |
| Crowd-background actor | Far background/live set dressing | Visual atmosphere | None | Not shown in paid attendance, charts or ticket conversion |
| Safety marshal | Public areas/events | Direct exits, describe emergency status | None | Does not overrule human moderation through fake testimony |
| Public announcement host | Chart wall, official venue | Read published verified results | None | Cannot invent chart winners or awards |

**Interaction honesty:** Service NPCs can answer short, deterministic questions about actual menu choices, prices and available inventory. No unrestricted generative conversation is required for V1. If optional AI NPC dialogue arrives later, it must obey factual grounding, rate/cost budgets, content moderation, anti-impersonation rules and no ability to alter financial/legal authority through natural-language text. [D/F]

## 11.2 NPC motion, crowd and atmosphere

NPCs follow limited area schedules and authored animations. Proposed examples: vendor at stall, two pedestrians walking a loop, venue usher standing near entry, several non-interactive lounge sitters. Crowd actor count is a graphic setting and **never appears in real attendance labels**. Players can hide/mute NPC interaction prompts, and NPCs should yield navigation space. Do not use endless ambient chatter during spoken music or force dialogs. [D]

An NPC can respond to a named music event only as **cosmetic ambience** (e.g., a far-away cheering animation) but cannot generate the event's score, ticket income or player analytics. All telemetry includes `actor_type=NPC` and cannot enter `verified_human_*` counters. [C/D]

# 12. Jobs and new-player economic recovery

Chapter 8's starter jobs are city-funded, anti-abuse-limited actions intended to help a no-money player begin participating. They are physically meaningful work, not simply pressing `Claim Salary`. The job supervisor shows available jobs, exact fixed payout, estimated effort, cooldown and remaining daily eligibility **before** a player begins. [C/D]

| City job | Physical play | Completion evidence | Proposed payout [D] |
| --- | --- | --- | ---: |
| Event assistant | Place approved chairs/speakers at marked sockets and inspect the final layout | Server-verified correct safe configuration and minimum interaction timing | ₦1,000 |
| Poster maintenance | Walk to a city board, remove expired city placeholder, hang authorised community notice | Placement version checked, job ticket consumed | ₦1,000 |
| Studio assistant | Choose correct sample pack, connect basic station props and perform audio-check interaction | Server validated workstation configuration | ₦1,500 |
| City event preparation | Configure an approved light sequence and clear entrance access before a free city show | Authoritative safe venue-readiness state | ₦1,500–₦2,000 |

**Global rule [D]:** At most three eligible completed introductory jobs and ₦4,500 from this faucet in a rolling 24 hours per eligible person (plus an overall city issuance budget), as specified by Chapter 8. The same job ticket cannot be replayed for money. A new player should receive at least one available no-cost pathway to earn whenever there is city funding and they remain eligible. The game must not promise an available task when the treasury/job pool is exhausted. In an empty world, free fan activities and creation tools remain playable. [D]

**Anti-idle constraints:** No payouts for walking in circles, watching a simulated NPC, leaving a tab open, repeatedly reconnecting, or clicking a single hidden control. Server records task assigned, approved scene, unique step evidence, anti-automation rate limits, completion and one ledger issuance. Repeated work can use varied layout templates without becoming a difficult dexterity test. **Jobs are a bridge to player-to-player creative commerce, not the main game.** [D]

# 13. Time, calendars, Release Friday and festivals

All event, lease, campaign and official music-release timestamps use server time. Present dates and deadlines in **Africa/Lagos (WAT)** in the user interface. A player's device time and local timezone cannot redefine the global Friday window, extend a lease or bypass an embargo. Provide UTC in durable event records and WAT in player-facing calendars. [C/D]

**Release Friday:** The Artist and Music chapters define the weekly song quota, Wednesday deadline, publication/embargo, eligible chart collection and announcement window. This chapter implements the **physical Friday transformations**: the release wall refreshes, displays approved artwork; listening pods switch source IDs atomically; a stage/screen announces the correct final chart snapshot at its authorised publication time; venue boards show that weekend's actual events. Late schedule changes never display an unapproved recording. [C]

**Destiny Awards:** Official quarterly high-prestige cultural event. Event system owns eligibility, selected host venue and attendance contract; this chapter owns the physical staging templates, safe crowd presentation, fallback public viewing, event-screen projection and operations support. Smaller social or player-run concerts may exceed its production budget or attendance without replacing its official prestige. [C]

**Time-limited interactions:** After a price quote expires, the user must refresh. After an event's scheduled start, late join goes to the current shared position. When a lease expires, world-visible permissions change after secured obligations settle. Never rely on a client animation timer to trigger money movement. [D]

# 14. Presence, real players and connection truth

Every logged-in person gets one authenticated logical presence. Only eligible humans count toward `humans_online`, event active participants and capacity. `displayed_world_population = actual_humans + cosmetic_NPCs` must never be exposed as the verified online number. [C]

**Presence lifecycle [D]:** `AUTHENTICATING -> ENTERING -> ACTIVE -> DISCONNECT_GRACE -> EXITED`, with separate `KICKED/BANNED` restrictions. Server-issued room ticket and reconnect token grant entry after identity check. Player can hold **one active world instance** and **one checked-in event location at a time**, even across devices. A second device can resume/take over after explicit warning, not duplicate an avatar in two paid venues.

## 14.1 Network reconnection

On transient disconnect, preserve last accepted position/scene, group relationship and event rights. A **proposed five-minute occupancy grace for ticketed events** matches Chapter 6's working rule. The seat is protected for that interval; its expiration frees active technical occupancy but does not consume an already purchased event ticket twice. A player returning late joins at the live show timeline offset and retains one attendance identity. Public hub ghost avatars disappear promptly once connection-grace ends. [D]

## 14.2 Friends and group travel

Groups request joint routing. Every person accepts destination. Check safety, eligibility, tickets and room capacity for each. If a specific show cannot fit the party, disclose the shortage and offer genuine other show sessions or individual attendance with confirmation; do not silently invent ticket inventory. A blocked player cannot force a private-room visit or paired emote via a group invite. [C]

# 15. World audio: personal music versus public music

Audio is the heart of the world, and unmanaged overlap will destroy the experience. The audio policy follows Chapters 5–7. [C]

1. **Personal soundtrack:** Optional player-controlled audio heard only by that player, usable during eligible public exploration. A player may choose an approved released recording as their own soundtrack. Nearby avatars do not hear it.
2. **Shared lounge/venue source:** One approved playlist or room track authoritative to that space; audible only after user consent and within device/browser restrictions.
3. **Event stage source:** One approved track on a shared event timeline; synchronised to server time. Entering a concert offers explicit enable/continue sound choice and yields/ducks private background music.
4. **Preview and studio context:** Intentional player-audition/creative audio has local priority within a private booth. A nearby NPC or another artist cannot hijack the user's output.
5. **Silence/mute:** User can disable personal, shared and sound effects separately; entering an event without enabling audio must not secretly count as a qualified listen.

**Autoplay gate:** First user tap/gesture may be needed to unlock audio on mobile. Offer a clear labelled button. The browser's background audio rules, interruptions and focus events must be respected. In the Vatar embedded game, SDK `onPause/onResume` also governs local media and timers; the server-hosted concert timeline continues while the game view pauses. Restoring audio seeks to the current approved position rather than restarting and manufacturing chart listens. [D/X]

**Rights gate:** Audio only from approved/cleared assets, valid consent, allowed territory and disclosure. A removed/embargoed recording cannot play from world speakers, an old cached URL or a saved poster. Signed short-lived media URLs and revocation checks apply; cache purge may be eventually consistent, so deny authoritative playback and stop active room track promptly. [D]

# 16. Video, images, artwork and world media

3D objects displaying user-generated posters, record covers and company logos must use moderated/render-safe media. Images are uploaded, validated (mime/size/dimensions), scanned, transcoded and served from a separate controlled media origin. They never execute code or inject remote HTML into the 3D world. Do not load arbitrary external image URLs at render time. [D]

**Asset types:** common building meshes, glTF/GLB venue shells, texture atlases, compressed static art, approved audio recordings, temporary previews and poster textures. Artwork can be reused across the virtual poster and artist profile but the same file must respect purpose-specific visibility and rights/embargo. The world requests a thumbnail rendition; no player phone should download a giant source cover just to display a small street poster. [D]

**Rights and trust:** Enforce file ownership metadata, content complaints and a takedown path. Prevent a blocked/suspended music asset from being re-served through a cached public room or old event programme. A venue logo sale transfers only eligible brand assets specified in the agreement, not people's music copyrights. [C/D]

# 17. Rendering, movement networking and mobile performance

THE SCENE should not bet its V1 feasibility on a gigantic photoreal open world. **Proposed implementation [D]:** React + TypeScript for UI shell, Three.js/React Three Fiber or another appropriately tested browser-3D renderer for the world; authored glTF scenes and skeletal animations; server authoritative presence and interactions; durable Postgres-like transactional storage for persistent entities; object storage/CDN for media; a dedicated real-time room layer for movement and show cues. Framework/provider choice is replaceable; service contracts are more important than vendor selection.

**Rendering strategies [D]:** mesh instancing for repeated props, occlusion/frustum culling, LOD for distance, low draw-call scenes, baked lighting for static areas, compressed textures, lazy-load interiors, capped avatar cosmetic complexity, impostors for distant ambient NPCs, reduced particle effects on low-tier phones. Put major visual effort into *one shared small venue and a strong music hub*, not the entire metropolis.

| Performance budget [D; validate on actual Nigerian mobile devices] | Initial target | Failure response |
| --- | --- | --- |
| First controllable playable view on midrange mobile connection | p75 < 12 seconds (stretch; test) | Stream assets after avatar control; offer loading clarity |
| Rendering | Aim 30 FPS on supported entry device at modest player count | Auto-downshift shadows, NPCs, reflections, crowd FX |
| Input to local movement | Visibly responsive within ~100 ms on supported device | Local prediction, reconcile with server |
| Position replication | Tunable 5–10 updates/sec per relevant avatar, interest-filtered | Lower rate for distant avatars; don't affect financial state |
| Event cue alignment | Aim typical participant audiovisual drift < 250 ms after sync | Seek/resync without double-counting listens |
| HUD touch targets | Approx. 44 CSS px minimum where feasible | Accessible menu alternative for fine object placement |
| Memory budget | Device-tier dynamic cap; load-test and profile | Unload inactive interiors and large media |
| Network loss | Recover current scene and entitlements without economic duplication | Retry/backoff; rejoin at current event offset |

These are *engineering test goals*, not product guarantees. Track p50/p95 by device tier and network conditions. The actual commercial launch gate must use measured supported-device cohorts, not the ideal desktop demo. [D]

**Physical movement trust:** Clients can predict walking, but server validates maximum speed, plausible displacement, scene boundaries, valid collision layers and teleport permissions. Anti-cheat must not kick honest players merely for high latency; use graceful correction and graduated detection. Payment, inventory and concert check-in are never authorised by movement packets alone. [D]

# 18. Mobile-first UX and device constraints

The official Vatar v1 Games SDK documents a frame-based embed, a **375 x 812 portrait review baseline**, touch interactions, no hover-only UI, sound after player gesture, `onPause/onResume`, and restrictive sandbox permissions. Its frame disallows camera and microphone access, popup/new-window navigation, downloads and unrelated payments. THE SCENE must build a normal standalone browser experience and an embedded-compliant presentation, while sharing game backend/services. Source: https://lagoslife.app/developers/docs (verified 12 October 2026). [X]

**User flow in narrow portrait [D]:** upper strip: venue/scene title, sound toggle, notifications; left thumb: movement joystick; right thumb: interact/dance (contextual); one always accessible phone icon; 3D environment visible as the primary canvas. When an object close-up opens, suppress background joystick, expose large labelled actions and a single clear exit/back. Avoid a mobile HUD with ten permanent unreadable mini-icons. [D]

**Graphics settings:** Low, Balanced, High (auto-detected, user override). Reduced motion, captions/now-playing, text size increase where reasonable, contrast mode, hide intense strobe effects, clear directional travel controls, pause music in background, mute public chat, closed-text alternatives where available. Network-low mode can retain social chat and audio with reduced scene complexity. If an advanced device feature fails, present an honest alternative rather than a fake visual success. [D]

**Platform separation [X]:** In the embedded session, trust only server-verified Vatar session/player identity; do not extract host cookies, money, contact data, location or game-naira balances. Vatar purchases are a separate platform-approved real-money flow; the simulated THE SCENE ledger never assumes that platform purchases fund in-game salaries or event settlements. Do not navigate to an external paywall from inside the embed. [X]

# 19. The city changes as players act

One premise should become visible every session: this music city is shaped by player actions. A promoted release places artwork on a contracted public sign; a venue upgrade improves the actual speaker rig; a label wall displays verified roster history; an artist who wins an award can decorate their personal room; a concert invitation leads to a real scheduled session. These are **projections**, not alternate sources of truth. [C/D]

**World projection rule [D]:** durable domain event -> validate permission, time and content state -> produce materialized view -> publish world delta with revision -> affected scene clients render update. Example: `campaign_placement.activated` only after funds and ad-approval -> poster slot receives URL/artist attribution/expiry. Event cancellation -> poster changes to `CANCELLED` -> door no longer admits -> audience receives ticket remedy; do not leave a plausible-looking live poster advertising a cancelled show indefinitely.

**Race condition:** If a poster is scheduled to expire at the same time a replacement is approved, use an authoritative slot version and compare-and-swap update. Only the winner receives the active placement. Refund duplicate holds in Chapter 8. A disconnected scene should catch up from the latest snapshot instead of replaying every historic poster change. [D]

# 20. Physical gameplay for each player path

| Player type/activity | Physical loop | Real decision | Social/economic consequence |
| --- | --- | --- | --- |
| Fan | Hear music in lounge -> save/follow -> meet friend -> attend show | Which songs/events are worth time | Genuine discovery and voluntary attendance |
| Artist | Make/import recording -> artwork -> Release House -> audition -> stage | Music, timing, venue and fan relationships | Listener demand, paid opportunities, career history |
| Beatmaker (activity) | Loop desk -> save beat -> preview to artist -> approve licence | Arrangement, pricing, collaboration | Creates a real musical asset and potential freelance income |
| Venue operator (company) | Lease -> Stage Supply -> install gear -> organise or hire room -> host | Costs, room quality, lineups and booking dates | Profits/losses and a recognisable venue |
| Label owner (company) | Listening room -> discover -> contract table -> funding board -> showcase | Talent, term, allocation and risk | Funded artists, project outcomes and capital exposure |
| Promoter (freelance or agency) | Brief -> planning wall -> poster/listening placement -> event | Target, creative, inventory and authorised spend | Genuine visibility, verified deliverables and fees |
| Ordinary event organiser | Rent venue -> book artist -> stage/marketing -> settle | Programme, costs, price | Real ticket demand and contract risk |
| Wealthy backer | Inspect named event -> review capped contribution -> attend outcome | Risk/reward or voluntary support | Money moves under specific deal, no guaranteed yield |
| No-money newcomer | Learn movement -> public music -> starter task -> free open mic | Time, music interests and first spending choice | Keeps agency without financial gate |

**Five-minute test:** A fan can find a song and another person; an artist can complete one studio action; a promoter can place an eligible poster; a venue owner can inspect/change one gear object; a label owner can audition a public song; a newcomer can begin a starter job. None requires a long pop-up questionnaire or that every other player be online. [D]

# 21. Low-population operating mode

We should design from ten genuinely concurrent humans, not pretend day-one concerts contain thousands. [C/D]

| Genuine simultaneous humans | World response | Do not do |
| ---: | --- | --- |
| 0–1 | Hub open; public playlists, creation tools, jobs if funded; clear next scheduled events | Fabricate live human chat or followers |
| 2–5 | Prioritise common hub instance; show free social prompts and existing public event board | Scatter each person across a huge map |
| 6–15 | Public lounge and open mic; shared listening with honest participant counts | Invent venue ticket purchases |
| 16–30 | Live small showcase with real interactions, true ticketing | Market a 5,000-human arena experience |
| 31–50 | Capacity-tested headline event; encourage second *distinct* timed session when needed | Clone sold-out inventory behind the scenes |
| 50+ | More hub copies or separately scheduled events, group placement coordinator | Inflate per-session verified headcount |

**Density-first routing:** When users arrive, prefer populated compatible public areas; keep a few anchor NPCs for atmosphere; show genuine friends online, real upcoming shows and live music boards. Never allow a fake NPC to send a plausible user friend request, buy an album, join official fan community or follow an artist. If no real humans attend, report zero human attendance. [C/D]

# 22. Moderation, consent, rights and youth scope

Safety is a first-class operational system. A social game with player-made music, publicity and user interaction needs controls before public launch, not after a harassment incident. [D]

**V1 core tools:** Block, mute, report, restrict friend requests, hide status/location from strangers, leave event, disable local chat, opt out of paired emotes, private default personal room, meaningful notification preferences, staff moderation dashboard and copyright/content reporting. Blocking does not revoke legitimate paid ticket refunds, contract obligations or completed historical payouts. [C]

**Text chat policy:** Chat is moderated/rate-limited; voice chat excluded V1. Separate public-space chat, event chat, private messages and artist community channels, with permissions inherited from Chapter 5. An authorised venue host may remove abusive participants under policy but cannot sell bans to competitors or void protected financial claims. [C/D]

**Child/age boundary:** Do not launch unrestricted adult-style DM systems while assuming all players are adults. Choose a product age policy before public access; age-appropriate restrictions and moderation burden are launch gates if minors are included. No real address/GPS proximity, no contacts scraping, no unconsented recording of users. [D/X]

**Takedowns:** An approved removal affects all surfaces: public chart playback, events, lounge, Release Hall, posters with restricted content, share links and cached media signed URL access. Historical awards and finance outcomes require a documented correction policy; a takedown does not automatically erase unrelated transaction audit trails. [C/D]

**Incidents:** Server/platform moderation can move affected players to safe scene, stop a restricted track, lock a malicious ad, silence chat, suspend a violator or cancel an unsafe show. Preserve evidence with privacy-limited access and defined retention. A fan should be able to leave immediately without navigating the 3D exit. [D]

# 23. Operational roles: distinguish human staff from NPCs

Although V1 companies have no player employee hierarchy, **the game operator** still needs internal admin tools. A simulated NPC venue usher is not a moderator with unrestricted authority; it only presents service state. [D]

| Internal game-operation role | Permitted actions | Hard restrictions |
| --- | --- | --- |
| Support agent | Inspect user-reported issues, account-facing event and transaction status | Cannot edit balances, hide an audit record or see unnecessary private chats |
| Content reviewer | Review audio/artwork/reports, publish or restrict media per policy | Cannot privately grant listeners, alter charts or sell favours |
| Trust & Safety moderator | Enforce safety policies, record incidents, mute/ban/restore accounts | Needs reason/audit; cannot personally take game funds |
| Economy operator | View issuance, treasury budgets, suspicious transfers and contract holds | Minting/adjustments require protected approval workflow |
| Live event operator | Resync a frozen official ceremony, stop unsafe music, fail over stage service | Cannot rewrite sold ticket counts or put NPCs into attendance |
| Game admin/deployer | Release assets/configs, toggle controlled feature flags | No direct production financial SQL edits without auditable change process |

**Minimum admin affordances [D]:** audit log searchable by actor/correlation ID; event health; online presence; media/takedown workflow; moderation queue; equipment/lease entitlement search; transaction read-only ledger viewer; refunds queue; seasonal publishing scheduler; NPC city wage budget monitor; scene live-configuration viewer; safe replay of idempotent commands; incident banner broadcast; isolated admin permissions with multi-factor authentication where supported. **Every production override is logged.**

# 24. Server authority and core data ownership

**Never let 3D scene code become the ledger, chart engine or contract engine.** In V1, one backend deployment may implement services as modules rather than costly separate microservices, but ownership and data contracts must remain explicit. [D]

| Service/module | Owns | Must never assume from client |
| --- | --- | --- |
| Identity & access | One player, session, bans, profile, business-slot entitlement | Display name proves identity; iframe cookies are safe |
| Scene/property registry | Canonical `space_id`, building, unique venue shell, layout revision, room capacities | A locally rendered room means exclusive ownership |
| Real-time room/presence | Avatar movement validation, room membership, emotes, reconnect lease | A client avatar position proves concert attendance |
| Instance/join coordinator | Routing, friend co-location, technical capacity, event ticket checks | New technical process creates saleable seats |
| Interaction command gateway | Proximity/role checks, object actions, request idempotency | Animation completion proves contract acceptance |
| Inventory/equipment | Assets, owner, lease/rental, compatible placement, disposal | Duplicate mesh means duplicate paid gear |
| Audio/media/rights | Approved recordings, artwork, temporary URLs, territory/embargo and takedown | Asset CDN URL implies perpetual usage permission |
| Catalogue/release/charts | Friday releases, qualified listens, chart snapshots | NPC ambiance or auto-play equals real engagement |
| Contracts/economy | Balances, reservations, ticket clearing, fees, refunds, profits, audits | Browser-reported price or transfer success |
| Events/stage | Event lifecycle, performers, shared show timeline, ticket/check-in capacity | Client's local track time controls show settlement |
| Friends/communities/chat | Social permissions, reporting, message logs | A visible avatar implies DM permission |
| NPC jobs and treasury | Authored starter tasks, evidence, issuance caps | Client pressed 'complete' once |
| World projection publisher | Approved world-state deltas and render snapshots | Client screen state is source of truth |
| Operations/telemetry | Monitoring, staff control, feature flags, incident response | Logs can safely contain audio recordings or private messages by default |

**Consistency classes [D]:** Money, contracts, ownership, permissions, song release eligibility and event admission must be durable and effectively atomic; avatar transforms, wave emotes and far NPC movement may use eventual/interpolated updates. World signs may lag by seconds, but the payment service must not send money twice due to that lag. If projected poster art is stale, clicking still opens the authoritative current event/artist status. [D]

# 25. Canonical world data model

These are implementation-level object contracts, not a demand to implement every field as a separate database table. Use stable IDs, server timestamps, revision numbers, tombstones where needed and references to existing chapter entities. [D]

| Entity | Essential fields | Invariants |
| --- | --- | --- |
| `world_space` | `space_id`, type, district, capacity_class, asset_bundle_version, visibility, entrance_targets | Stable place identity across runtime instances |
| `runtime_instance` | `instance_id`, `space_id`, host, capacity, active_humans, state, created_at | Technical copy, never a duplicated property business |
| `player_avatar` | `player_id`, cosmetics_snapshot, current_space, authoritative_transform, emote, version | One avatar identity/person; one active presence |
| `presence_session` | `player_id`, device_session, room_token, current_instance, reconnect_until, last_seen | No two simultaneously admitted paid event locations |
| `interactive_object` | `object_id`, `space_id`, kind, interaction_radius, permissions, target_service, object_revision | Server validates every changing action |
| `property` | `property_id`, public_identity, fixed_capacity, room_shell, district, facility_base, status | Unique commercial property independent of instance |
| `property_entitlement` | `property_id`, `company_id`, lease interval, state, agreement_id | No overlapping operating-right grants |
| `world_layout` | `property_id`, revision, placements[], fixture_set, safe_path_version | Validated persistent spatial layout |
| `gear_placement` | `item_id`, owner_scope, socket, transform, compat_class, rental_expiry, active_contract_hold | No duplicate inventory or blocked exits |
| `npc_actor` | `npc_id`, archetype, region, schedule, cosmetic_only, service_ref | Never an eligible human analytics actor |
| `city_job` | `job_id`, `player_id`, task_type, slot, assigned_at, step_evidence, completion, payout_ref | Unique wage issue per verified job, capped |
| `world_projection` | `object_id`, source_entity_ref`, payload_ref, revision, effective_at, expiry | Derived, reversible, permission-filtered |
| `room_audio_state` | `space_id/session_id`, track_id, start_at, offset, rights_revision, moderation_state | One room-authoritative source, no autoplay fraud |
| `travel_request` | `request_id`, `player_id`, target_space/session`, consent`, eligibility_version, outcome | Explicit acceptance; tickets separately verified |
| `moderation_incident` | `incident_id`, reporter_id`, scope, evidence_pointer, action, reviewer_id, retention_policy | Private and auditable; no abusive public leak |
| `ops_release` | `deployment_id`, asset_version, migration_version, feature_flag_snapshot, rollback_ready, approver | Traceable deployment and recovery |

**Schema implementation:** API generation uses a typed schema registry rather than blindly parsing Markdown. Keep the canonical `event_id`, `event_session_id`, `player_id`, `company_id`, `contract_id`, `ledger_transaction_id`, `track_id` and `property_id` consistent with Chapters 3–8. [D]

# 26. API and realtime action inventory

These are **proposed first-party THE SCENE service commands**, not Vatar endpoints. Every mutation carries an authenticated principal, expected revision when applicable, idempotency key where needed, correlation ID and a stable error code. The service returns receipt/new revision and emits a world event. [D]

| Command | Preconditions | Success effect | Key refusal |
| --- | --- | --- | --- |
| `joinWorld(targetSpace)` | Valid session, scene visible, capacity | Instance token + snapshot | `SPACE_FULL`, `ACCOUNT_RESTRICTED` |
| `moveAvatar(input,timestamp)` | Active session, plausible speed/geo | Accepted transform snapshot | `INVALID_MOVEMENT` |
| `interact(objectId, action)` | Nearby or permitted remote use; proper role | Authoritative domain action request | `OUT_OF_RANGE`, `NOT_AUTHORISED` |
| `travelTogether(groupId,target)` | Per-member consent, destination eligible | Group reservations/placement result | `MEMBER_DECLINED`, `FULL` |
| `previewProperty(propertyId)` | Public property listing | Tour/availability | `PROPERTY_UNAVAILABLE` |
| `enterLeaseProperty(propertyId)` | Valid ownership/public venue access | Correct layout instance | `LEASE_EXPIRED`, `ACCESS_DENIED` |
| `placeEquipment(propertyId,item,transform,rev)` | Owner/rental, unencumbered item, safe fit | New layout revision | `LAYOUT_CONFLICT`, `BLOCKED_EGRESS` |
| `purchaseEquipment(quoteId)` | Quote and funds valid | One inventory item/receipt | `QUOTE_EXPIRED`, `INSUFFICIENT_FUNDS` |
| `claimCityJob(jobId)` | Budget, cap, job availability | One assigned task | `JOB_CAP`, `NO_CITY_BUDGET` |
| `completeCityJob(jobId,evidence)` | Correct steps, not settled | One issued wage journal/receipt | `INCOMPLETE`, `ALREADY_PAID` |
| `enterEvent(sessionId,ticketId)` | Ticket/valid free token, time window, capacity | One check-in and join entitlement | `SOLD_OUT`, `TICKET_INVALID` |
| `stageCue(eventId,cue)` | Approved performer/host, correct slot | Synced event effect | `WRONG_PERFORMER`, `UNSAFE_EFFECT` |
| `setRoomAudio(spaceId,trackId)` | Host permission, rights valid | Room timeline revision | `TRACK_RESTRICTED`, `NO_PERMISSION` |
| `publishAdPlacement(slotId,creativeId)` | Slot contract paid/approved | Visible poster projection | `SLOT_CONFLICT`, `CONTENT_PENDING` |
| `reportContent(target,reason)` | Valid reporter/target | Private incident ticket | `RATE_LIMITED` |
| `adminEmergencyStop(sessionId)` | Privileged safety reason | Safe pause/mute/evacuate + audit | `ADMIN_PERMISSION_DENIED` |

**Client response pattern:** Immediately acknowledge tap with pending animation; final `SUCCESS` only after command receipt; on timeout offer `Retry` with same idempotency key. Collision/interpolation glitches must not mutate owner balances. [D]

# 27. World object and action state machines

| Object/system | Normal state sequence | Unexpected state and recovery |
| --- | --- | --- |
| Public interactive object | `IDLE -> FOCUSED -> OPEN -> ACTION_PENDING -> CONFIRMED -> IDLE` | `DENIED/RETRYABLE_ERROR` restores prior view and draft |
| Scene transition | `REQUESTED -> ELIGIBILITY_CHECK -> RESERVED -> LOADING -> PRESENT -> ACTIVE` | `FULL/FAILED` retains origin or safe hub fallback |
| Venue layout | `EDITABLE -> DRAFT -> VALIDATING -> COMMITTED -> PROJECTED` | `COLLISION/STALE_REVISION` rebase or revert |
| Equipment | `LISTED -> QUOTED -> PURCHASED/RENTED -> STORED -> INSTALLED -> REMOVED/RETURNED` | `EXPIRED_HOLD` prevents new use, preserves contract evidence |
| Service NPC dialogue | `AVAILABLE -> FOCUSED -> CHOICE -> VERIFIED_RESULT -> IDLE` | `NO_SERVICE` closes with accurate message |
| City job | `AVAILABLE -> ASSIGNED -> IN_PROGRESS -> VERIFIED -> PAID` | `EXPIRED/FAILED` pays zero unless agreed partial payout exists |
| Presence | `CONNECTING -> ACTIVE -> GRACE -> REJOINED/EXITED` | `MODERATED` blocks other joins, preserves lawful refunds |
| Public room audio | `SILENT -> GESTURE_ENABLED -> PLAYING -> SYNCING/PAUSED -> STOPPED` | `RIGHTS_BLOCK` immediate stop |
| World projection | `SOURCE_UPDATED -> VALIDATED -> PUBLISHED -> REPLACED/EXPIRED` | `STALE` refresh snapshot rather than falsely confirming action |
| Live ops incident | `DETECTED -> TRIAGED -> MITIGATING -> RECOVERED -> CLOSED` | Escalate if financial integrity cannot be proven |

# 28. Adversarial failure matrix

| Situation | V1 behaviour | What must remain true |
| --- | --- | --- |
| Player goes through wall with modified client | Reject improbable transform and snap to last safe point | No access to paid/private space |
| Client fakes position near label desk | Require server-approved presence and company role | No stolen artist funding |
| Player buys chair then disconnects | Retry same receipt; exactly one inventory item created | No double charge, no duplicate asset |
| Two operators buy/hire the same unique property | Serialized lease/booking entitlement | One active operator right |
| Venue operator lease expires during sold future show | Prevent insecure future booking; if abnormal, invoke Chapter 6/8 remedies | Buyers not stranded, obligations preserved |
| Operator tries to block all exits with chairs | Layout validator rejects | Egress remains navigable |
| Expired rented lights used during ongoing contracted event | Prevent incompatible promised state; settle/dispute safely | No mid-show unannounced disappearance |
| Scene host crashes during show | Rejoin/failover to same logical session/timeline; escalate if material failure | No duplicate ticket, clean refund rules |
| Player switches devices to attend twice | Revoke earlier active presence or handoff | One paid identity/attendance |
| NPC avatar is mistaken for human player | NPC visuals visibly identifiable when inspected, never shown as users | No false public attendance |
| A user reports harassment, host retaliates | Trust & safety oversees; audit role actions | Legitimate contracts/refunds remain |
| Song is taken down while playing | Stop shared source, rights-filter projections | No additional protected playback |
| Poster ad creative denied after booking | Keep placement pending, offer valid replacement or refunds by policy | No prohibited image exposure |
| Device lacks microphone in embed | Show approved import/standalone-compatible alternative | Not a broken mandatory creative path |
| Customer enters room with audio muted | Let them attend; no automatic qualified chart listen | Genuine attendance separate from listening |
| City wage job submitted twice | Atomic task settlement; second returns same paid receipt | Currency supply correct |
| Stale kiosk quotes a prior price | Server rejects expired quote and requotes before debit | No surprise spending |
| Chat stream offline but 3D world works | Show social status, preserve safe gameplay | No ghost messages or unsent claims |
| Event server overloaded | Queue valid tickets, degrade effects, do not exceed tested venue cap | No invented seats/attendance |
| Player owns venue and tries to register label concurrently | Company ownership unique constraint | One business owner at a time |
| Free fan has ₦0 and town empty | Music/public studio/lounge remain usable; city jobs when budgeted | No soft lock |
| Vatar host does not expose wallet | Standalone simulated currency stays internal; no conversion button | No unsupported external transaction |

# 29. Seven-day connected world test: one small population

**Setup [D]:** One public hub, one 50-person venue, one public studio, one Release Hall, one label office, one promoter office, one city equipment shop; 12–25 real concurrent humans during peaks; a handful of visually identifiable NPCs; one unique city-managed 50-seat venue optionally assigned to a player operator. This is a **design simulation**, not a claim of actual playtest results.

**Monday:** Fola, a fan with no balance, spawns into Music Square in seconds, saves a real song at a kiosk and begins one ₦1,000 authorised poster-maintenance job. Ada, an independent promoter, inspects the same public poster board but cannot overwrite another user's reserved paid slot. Amaka applies for a venue operating lease from City Property Desk and sees that the physical building is currently free.

**Tuesday:** Amaka rents the unique venue for seven days and physically installs a pair of compatible purchased speakers. Her 50-seat audio rating changes, but her bookings remain empty until she solicits artists. Kemi uploads a cleared song draft via the studio/release flow. David, a label owner, walks into the Release Hall and listens to approved public songs, not hidden unreleased files.

**Wednesday:** David invites Kemi for a funded contract using the office contract table. The funding is reserved under Chapter 8, not conjured into Kemi's unrestricted wallet. Ada develops a small event poster. Fola brings a friend into the same public instance. Kemi's release submission must meet the official Wednesday cutoff.

**Thursday:** Amaka books a Saturday open mic and pays/holds necessary supplier commitments. Ada activates a finite poster placement near Music Square; any player can click it and choose whether to attend. A cosmetic NPC walks past it, but does not generate an impression that counts as a human click.

**Friday:** The Release Hall wall changes at the official time. Kemi's song becomes available. Dami, a beginner who used a free loop pack, also has a playable amateur track. Fans can enjoy either without genre-quality gatekeeping. An artist's chart exposure depends on eligible human playback and saves, not lights or label expense. The room audio source is authoritative; Fola can switch to her private soundtrack outside the venue.

**Saturday:** The Basement admits exactly the valid attendees for its confirmed session. Twenty genuine players arrive from 30 sold tickets; room ambience NPCs decorate a distant corridor but ticket reports show **30 sold / 20 checked in**. Kemi performs with approved Stage Mode actions. Ada observes her poster engagement. Amaka's equipment remains visually present. David watches the result. A disconnected fan rejoins without rebuying or earning a second concert memory.

**Sunday:** Amaka sees actual venue economics and player feedback; she cannot count poster clicks as sales. The event service settles the ticket escrow after delivery/refund checks. Kemi's listeners and chart statistics update through the listening service. Fola's memory shelf shows the concert she actually attended. David reviews his label-supported project outcome, and Ada receives only payment she earned. The venue changes next week's poster and calendar boards. No character had to select a permanent exclusive profession at onboarding.

# 30. Thirty-day world-retention and scale tests

A strong world survives repeated visits. **Week 1:** the player learns how to travel, listen and attend; **week 2:** saved songs and acquaintances create recognition; **week 3:** venues change programme and posters; **week 4:** chart movements, release history and player-made businesses make the district feel different. The same locations remain useful because human activity changes their meaning, not because the environment moves the player through a rigid story quest. [D]

**Three sessions:**

- **Five minutes:** Dami adjusts a beat, Fola shares a new song, a venue owner inspects a booking, a label listens to one prospect, a promoter refreshes the performance of a live poster.
- **Twenty minutes:** Join a free open mic, physically socialise, book a show, plan a small campaign, furnish a room or record vocals where supported.
- **One hour:** Attend multiple real social moments, organise/host a showcase, collaborate on music, explore changed venue atmosphere and review actual human responses.

**Scaling condition:** Add another district only when public attendance and session-cohort telemetry show the current hub overcrowded or genuinely demand new geographic experience. A larger map does not solve the absence of real listeners. [D]

# 31. Operational architecture and deployments

## 31.1 Suggested deployable modules [D]

- **Web client:** 3D renderer + responsive HTML UI, scene streaming and signed user session management. Loads on THE SCENE's own HTTPS domain.
- **Core API:** Server checks scene/object action permissions, data mutations, catalogue and company entitlements.
- **Realtime gateway/room workers:** Separate processes for low-latency avatar position/emotes, room rosters and concert stage timeline.
- **Primary transactional datastore:** Durable SQL-style relational records for identity, contracts, inventory, leases, events, money and jobs. Financial commits are transactional.
- **Queue and event projection worker:** Versioned jobs for poster expiration, audio rights propagation, release-wall refresh and notification delivery, each idempotent.
- **Object storage/CDN:** Public approved artwork/music through controlled signed access; private drafts isolated.
- **Operations UI:** Staff tools, moderation, economy integrity, incident toggles, dashboards and audit controls.
- **Feature/config registry:** Safe variant rollout, timestamped prices, NPC job caps, graphics tiers and live-event eligibility. Never silently rewrite signed historic contract amounts.

Start as a **modular monolith plus realtime workers** if that is cheaper and easier to operate. Splitting every function into separate infrastructure services before the first small concert is not a V1 requirement. Architect clear ownership so services can separate later. [D]

## 31.2 Deployment workflow

`DEVELOPMENT -> STAGING -> SANDBOX PLATFORM TEST -> LIMITED ALPHA -> PRODUCTION`. Every release goes through type checking, automated invariant tests, asset smoke tests, migration rehearsal, staging playtest on entry-level phone, and a rollback plan. Client/room server release versions must be compatible during reconnect. Deploy a feature behind a version flag if failure could impact money, attendance or live audio. Preserve a known-good event template for emergency fallback. [D]

**Change discipline:** Contract terms, ticket fee rates, venue price anchors and chart scoring configs are versioned with effective start. A price change applies to new quotes, never retroactively to an already-confirmed booking. An old client that submits a stale contract revision receives `STALE_REVISION` and a refreshed view. [D]

# 32. Reliability, recovery and data integrity

**System priority order in an outage:** (1) protect balances/contracts/ticket entitlements, (2) stop abusive/restricted media, (3) keep verified entry and critical event timeline, (4) preserve chat/presence, (5) restore cosmetic scene effects. If the 3D world is degraded, never falsely mark a supplier paid or a concert delivered. [D]

**Recovery patterns [D]:** automatic snapshot of persistent scene layouts after committed changes; append-only financial audit; idempotent interaction requests; backup/restore drill for database and object storage; dead-letter queue and replay for world projections; reconciliation jobs comparing tickets sold vs valid check-ins, ledger journal vs available balances, and property entitlements vs visible names. Disaster recovery targets should be set and measured with actual infrastructure; do not promise 99.99% uptime without operator capacity.

**Graceful degraded experiences:** In high load, disable ambience NPCs, shadows, particle effects and remote avatar cosmetic details before reducing verified ticket operations. In a stage timeline failure, offer the same-event recovery and clear user-facing status; apply published event remedies if the promised performance cannot be delivered. On third-party platform downtime, allow standalone sessions if its own login remains available; do not fabricate Vatar status. [D]

# 33. Metrics, UX research and monitoring

Measure whether the world is **actually fun**, not merely online. [D]

| Signal | What it tells us | Example test question |
| --- | --- | --- |
| Time to controllable avatar | Friction at entry | Can a midrange phone move within acceptable time? |
| Time to first voluntary song play | Discovery accessibility | Does a fan encounter useful music without searching menus? |
| Time to first genuine social interaction | Density and affordance | Can two real players find each other? |
| Percentage of newcomers who can earn first city wage | Recovery economy | Is no-money progress achievable without exploit? |
| Actual humans per room/event | Social density | Is the hub too fragmented? |
| Concert tickets sold/check-ins/duration | Delivered event experience | Did people actually attend? |
| Live room audio opted-in and sync health | Music quality | Are attendees hearing a consistent song? |
| UGC report and takedown latency | Trust | Can staff contain harmful audio/posters promptly? |
| Equipment layout rejection/revert rate | Editor clarity | Is furnishing frustrating or unsafe? |
| Contract/ledger idempotency conflicts | Financial correctness | Any duplicate pay or ghost item? |
| Scene render FPS, crash rate, memory by tier | Mobile fit | Are low-end phones still playable? |
| Fan D1/D7 meaningful voluntary returns | Entertainment value | Do non-business players return? |
| Player-to-player economic share vs city wage issuance | Sustainable economy | Are genuine careers replacing faucet dependence? |
| Verified artist follows and saves from world surfaces | Core product value | Does physical exploration produce real discovery? |

**Privacy boundaries:** Game analytics capture coarse session/interaction evidence and aggregated counts. They do not publicly expose which individual user listened to which recording, personal location, private direct-message contents or account finances. Staff access is purpose-limited and audited. [D]

# 34. Acceptance tests — core world and interaction (WO-001 to WO-020)

| ID | Test case / pass condition |
| --- | --- |
| WO-001 | A zero-balance new account enters playable hub without choosing a class/company. |
| WO-002 | Avatar survives logout and reload with same cosmetics and personal history. |
| WO-003 | Two persons joining the same available public hub see each other's accepted movement/emote. |
| WO-004 | Client attempts to exceed move speed/collision: server corrects position; cannot reach private desk. |
| WO-005 | Mobile 375 x 812 screen presents joystick, interact, phone and audio control without hover. |
| WO-006 | Basic avatar and first song are reachable without visiting business registry. |
| WO-007 | Primary landmarks are discoverable by wayfinding and accessible route/shortcut. |
| WO-008 | Public social scene remains functional with only one human online; does not report NPCs as humans. |
| WO-009 | Touch target selects one nearby interactable when objects overlap; accessible target list is available. |
| WO-010 | Out-of-range `interact()` refused; permitted remote phone action accepted by server. |
| WO-011 | Network drop during interaction preserves local draft, retries idempotently without double action. |
| WO-012 | A music preview uses the approved track and displays owner/credit accurately. |
| WO-013 | Room shared track does not audibly leak from one player's personal soundtrack. |
| WO-014 | Player who muted audio remains an event attendee but does not automatically qualify as a listener. |
| WO-015 | First-user-gesture sound gate is explained and works on supported mobile browser. |
| WO-016 | Client loses focus/host pauses; local audio stops and event timeline catches up on resume. |
| WO-017 | Reduced motion and strobe-safe toggle disable the specified effects. |
| WO-018 | World scene assets load from versioned bundles and missing nonessential decorations do not block travel. |
| WO-019 | Profane/unauthorised user poster never renders publicly before content approval. |
| WO-020 | Artist/song removal propagates to room speakers and world projections without introducing false chart listens. |

# 35. Acceptance tests — property, gear and NPCs (WO-021 to WO-043)

| ID | Test case / pass condition |
| --- | --- |
| WO-021 | Unique named venue inventory has one live lease/calendar and independent public identity across hub shards. |
| WO-022 | Venue operator company can hold only one active flagship venue; ordinary event renter cannot sublet. |
| WO-023 | Direct event hiring works without the renter registering a venue company. |
| WO-024 | Booking/lease collision among concurrent applicants resolves one winner and releases losers' holds. |
| WO-025 | Operator cannot sell a future booked date not covered by secured control. |
| WO-026 | Changing venue floor layout requires server-side item ownership and revision match. |
| WO-027 | Furniture collision prevents exit obstruction and dangerous stage interference. |
| WO-028 | Bought chair appears once in inventory and once in installed scene, not duplicated. |
| WO-029 | Rented light expires and is recovered safely without breaching earlier promised equipment. |
| WO-030 | Saving/reapplying a permitted layout preset produces identical valid object arrangement. |
| WO-031 | Small venue can attain high relative rating with compatible small-scale sound equipment. |
| WO-032 | Quality upgrade affects presentation capability, never directly mints fans or paid tickets. |
| WO-033 | Venue company closure releases future lease rights only after obligation settlement. |
| WO-034 | NPC shop gives identical quotes to canonical shop service and cannot fabricate inventory. |
| WO-035 | NPC pedestals and dancers contribute exactly zero verified users, chart activity or ticket revenue. |
| WO-036 | NPC job assignment displays payout, duration, funds/cooldown before start. |
| WO-037 | Verified city task completion pays exactly once; repeated request returns same receipt. |
| WO-038 | Daily job cap and city treasury cap are enforced across servers/devices. |
| WO-039 | Idle avatar, scripted repeated tap and fake client completion produce zero wages. |
| WO-040 | Studio available free for basic creative work; no production-company registration required. |
| WO-041 | When embedded microphone unavailable, no mandatory mic permission prompt blocks core gameplay. |
| WO-042 | Personal room is accessible for zero-balance player and private by default. |
| WO-043 | Label and promoter business offices visually reflect authoritative company/contract/campaign data. |

# 36. Acceptance tests — multiplayer, safety and operations (WO-044 to WO-075)

| ID | Test case / pass condition |
| --- | --- |
| WO-044 | One account cannot maintain two simultaneous event admissions across devices. |
| WO-045 | Valid ticket grants correct named event session and not any arbitrary stage copy. |
| WO-046 | Extra runtime instance does not increase sold ticket inventory or checked-in real humans. |
| WO-047 | Four consenting friends join compatible active hub when space allows; no involuntary teleport. |
| WO-048 | Full venue produces honest `FULL` state and an eligible separate event alternative if any. |
| WO-049 | Event attendee reconnects during five-minute grace without repurchase/duplicate memory. |
| WO-050 | World server crash restores consistent accepted presence and event timeline where possible. |
| WO-051 | Valid purchased ticket is not consumed by a temporary client rendering failure. |
| WO-052 | Verified paid and free ticket counters always distinguish sales/reservations/check-ins. |
| WO-053 | Live music sync does not restart everyone when one phone reconnects. |
| WO-054 | Venue owner safety stop follows policy and audit; cannot target rivals unfairly. |
| WO-055 | Blocking a player prevents private invitations/paired emotes even in the same hub. |
| WO-056 | A banned account cannot evade scene/chat restrictions via travel or new runtime shard. |
| WO-057 | Chat report has target, reason, private evidence reference and staff-action audit. |
| WO-058 | Restriction/takedown of audio prevents new public playback and propagates to affected rooms. |
| WO-059 | Production staff cannot change financial values through unauthorised admin screen. |
| WO-060 | Authorised emergency show pause/cancel leaves protected tickets and refunds to Ch6/8 engines. |
| WO-061 | Stale/expired quote never silently charges a different amount. |
| WO-062 | Sale/closure of registered company cannot create a second live company for same owner. |
| WO-063 | World poster visibly changes to cancelled when event source is cancelled. |
| WO-064 | World-projection worker replay is idempotent after outage, preserving one active placement. |
| WO-065 | Missing optional NPC animations do not prevent actual players from navigating and interacting. |
| WO-066 | Game reduces world effects rather than overselling concert seats under load. |
| WO-067 | Server reconciliation detects mismatch between gear placements and inventory item IDs. |
| WO-068 | Daily economy issuance audit matches successful unique city job completions plus approved grants. |
| WO-069 | Feature-flag rollback restores previous world build without deleting legitimate transactions. |
| WO-070 | Support can identify correlated user, scene, event and ledger receipts without exposing raw private music. |
| WO-071 | Vatar test player identity is never merged with unrelated live/standalone player without explicit permitted linking. |
| WO-072 | Embedded build correctly handles host `onPause/onResume`, including sound interruption and resync. |
| WO-073 | Embedded build does not attempt forbidden microphone, pop-up or direct payment APIs. |
| WO-074 | Client cannot use `submitScore()` or native staked-match operations to simulate ticket money transfers. |
| WO-075 | Limited alpha can complete end-to-end free fan -> release -> poster -> venue -> genuine 20-person show -> receipts without manual admin balance repair. |

# 37. Launch gates: what counts as V1-ready

**Gate A — Fantasy works [D]:** Ten-minute fan session genuinely fun; artist creates/imports real music; business player sees meaningful physical change; no required class selection. At least one public space, small venue and studio are highly polished rather than many unfinished buildings.

**Gate B — Integrity works [C/D]:** No double-sells; no double-spend; no phantom inventory; no NPC qualified listens; no overwritten active company; no unapproved song in public speaker; refund and rights moderation path demonstrated. Run adversarial automated tests on common transactions.

**Gate C — Multiplayer works [D]:** Tested 20–50-person event sessions at supported client/device/network cohort; friend joining, sound sync, reconnect, legitimate seat caps and truthful check-in analytics. A target of 20 real humans may be a better initial load gate than promising 50 before evidence exists.

**Gate D — Mobile works [X/D]:** Standalone HTTPS experience usable on entry-supported Android browsers and iOS browsers; embedded presentation passes official Vatar phone-first frame requirements if applying to Games. No compulsory microphone or broad device permissions inside the restricted frame. Separate standalone account access must be documented, not improvised with third-party cookies.

**Gate E — Operations work [D]:** Moderation queue staffed; restricted-media kill switch; money/payout auditing; deployment rollback; game-master incident controls; reports and support path; backups and tested recovery. An online game without an operational response plan is not launch-ready.

**Gate F — Value works [D]:** Genuine fans return for music and social contact, promoters/venues have enough distinct choice, artists can discover non-paying listeners, starter wages give liquidity without dominating circulation. If people only log in to farm NPC wages, revise incentives rather than adding jobs.

# 38. MVP build sequence and risk reduction

| Milestone | Build / experience | Demonstration |
| --- | --- | --- |
| **Slice 0: World walk** | One hub corner, one avatar, touch/desktop control, kiosk, simple audio opt-in | Enter, move, interact and discover a song on phone |
| **Slice 1: Two-player social** | Presence, emotes, text moderation basics, friend co-location | Two humans greet and listen in the same scene |
| **Slice 2: Studio and Friday release** | Free loops, rights-safe import, artwork wall, approved track, Release Hall | Beginner and real artist release eligible recordings |
| **Slice 3: Real small show** | 20–50-person venue, stage timeline, entry check, audience reactions | Artists perform to genuine participants; no NPC chart fraud |
| **Slice 4: One physical venue company** | Unique property, 7-day lease, gear purchase/layout, third-party booking | Operator upgrades and earns/loses game money honestly |
| **Slice 5: Label and promoter overlay** | Office, artist funding, campaign placements, basic contracts | One artist project creates real jobs for other humans |
| **Slice 6: Operated alpha** | Reports, moderation, economy reconciliation, admin tooling, Vatar sandbox test | Small monitored live economy with verified recovery |

**Sequencing override:** The monetised ticket/equipment and label-funding flows cannot launch publicly before Chapter 8's ledger, idempotency and refunds are proven; small prototype placeholder currency may be used only in explicitly isolated test environments. Rights moderation must be functional before arbitrary public uploaded audio. [C/D]

# 39. Reconciliation register with prior chapters

| Topic | Canonical chapter / change needed | Chapter 9 ruling |
| --- | --- | --- |
| Permanent character classes | H-Path v0.2 | Not used; activity identities and one company |
| Full venue construction | Venue v0.3 | Excluded; prebuilt unique public properties |
| Venue operating lease versus event hire | Venue v0.3 / Events v1.0 | Separate entitlements; calendar is one truth |
| NPC attendance, listeners and virtual demand | Fan v1.0 / Charts v1.0 | Strictly zero eligible human participation |
| Song drafts, rights and release | Artist v0.4 / Charts v1.0 | Physical Release Hall reflects status, does not create release |
| Friday and chart timing | Charts v1.0 | World uses server WAT and published snapshots only |
| Producer, investor and manager classes | H-Path v0.2 | Activities or deferred, not added business classes |
| Fan's world interactions | Fan v1.0 | Same scene action grammar and privacy restrictions |
| Capacity, venue shows and ticketing | Events v1.0 | Room coordinator enforces one event/global cap |
| Event refund, contract holds, money | Economy v1.0 | World cannot adjust ledger on its own |
| Company sale / bankruptcy | Economy v1.0 | Physical possessions and access follow settled assets |
| Vatar integration | External official SDK/docs | Independent domain + restricted frame; no wallet/3D transfer assumption |
| World culture at low concurrency | This chapter | One concentrated playable hub with authored public anchors |

**No unresolved architecture inventions are required to begin a vertical slice.** Numbers such as travel time, player density, render FPS, assets per scene, shared-room cap and incident staffing are **test gates rather than founder-approved production guarantees**. Detailed content-licensing, product age scope and platform publishing approval remain external operational approvals, not assumptions hidden inside design. [D/X]

# 40. Master GDD handoff: what to build next

The game now has nine chapters plus the H-Path architecture. The next deliverable should **not** be another career. It should be a reconciled **Master Game Design Document (GDD)** with: one global decision/precedence register; one world/role/finance diagram; consolidated entity and event contracts; cross-chapter contradiction list with resolved versions; player-loop maps; minimal vertical slice; playable 7-day economy simulations; prioritised engineering tickets for Codex; acceptance gates; estimated technical risks; and separate explicitly verified Vatar-platform integration boundaries. **No developer should silently treat speculative numbers or unverified APIs as confirmed.**

**Recommended vertical-slice demo:** Fola enters Music Square and hears a new real artist's approved track -> Kemi prepares its Friday release in physical Release House -> Ada creates a physical event poster -> Amaka's small unique venue goes from city hire to player-operated furnished club -> David's label funds eligible work -> 20 real players attend a show, hear synchronized music, interact and follow -> a single source of truth settles tickets, event obligations, chart evidence and memories -> next Friday the city's walls genuinely change. If that sequence is compelling and reliable, the larger game has a foundation.

## Sources, verification and external constraints

**Primary game design sources:** Founder-approved design decisions across prior chapters listed above; no claimed live playtest or literal external expert panel. [C]

**Official Lagos Life / Vatar Games SDK v1 (checked 12 October 2026):** https://lagoslife.app/developers/docs . Documents self-hosted HTTPS embed, sandbox identity/session model, narrow portrait/touch requirements, `onPause/onResume`, sandbox restrictions and the fact that no general third-party game-naira settlement or 3D avatar-transfer facility is specified in the exposed SDK. [X]

**Original engine/asset architecture is an engineering recommendation:** Three.js / React Three Fiber, web audio, glTF delivery and authoritative server/relational ledger are reference implementation candidates rather than contracts with external software vendors. Selection should follow mobile prototypes, budgets, maintainability and team capability. [D]

**Document status:** Suitable as a standalone world/NPC/operations working implementation baseline and as input to master GDD reconciliation. Not evidence that those systems have been built, tested, publicly approved or successfully integrated with Vatar.
