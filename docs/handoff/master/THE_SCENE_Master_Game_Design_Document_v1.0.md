# THE SCENE
## Master Game Design Document (GDD) — Product, Rules, Systems & Engineering Roadmap

**Document ID:** TS-GDD-MASTER-001  
**Version:** 1.0 — reconciled design baseline  
**Prepared:** 12 October 2026  
**Status:** Implementation-planning baseline, **not** proof of a working game, rights clearance, SDK approval or validated economy  
**Audience:** Founder, design and engineering leads, Codex/implementers, content/moderation, economy/QA, potential implementation partners  
**Build target:** Independent HTTPS browser-based, mobile-first, persistent multiplayer 3D music world; Lagos Life/Vatar connection only when documented and authorised  
**Sources:** H-Path architecture v0.2; Venue Operator v0.3; Artist v0.4; Record Label v1.0; Promoter v1.0; Fan & Social v1.0; Concerts & Events v1.0; Music Discovery & Charts v1.0; Economy & Contracts v1.0; World/NPCs/Operations v1.0; Desk Bot v1.0; interaction matrix v0.1 and seven-day simulation v0.2.

> **Product promise:** THE SCENE is a living multiplayer music city. Real players create or upload songs, discover music, make friends, put on performances, build artist careers and operate music businesses. Choices have consequences, but nobody must choose a permanent career or spend money to enjoy being there. Desk helps players understand their options; it never plays the game for them.

> **Critical distinction:** This document is the authoritative *game-design interpretation* of the source chapters. Where the sources contain a newer explicit instruction or shared-system resolution, the reconciliation register here identifies the binding rule. Unproven implementation, legal and business assumptions are labelled as gates, not represented as completed work.

---

# PART I — THE GAME WE ARE BUILDING

## 1. One-page game definition

**Genre:** Social sandbox / music-industry life simulation with creative play, player-run entertainment businesses, real-music discovery and scheduled multiplayer gatherings. **Primary loop:** EXPLORE → HEAR / CREATE MUSIC → MEET PEOPLE → MAKE A CHOICE → ACT IN THE WORLD → EXPERIENCE CONSEQUENCES → RETURN. **Secondary economic loop:** DISCOVER OPPORTUNITY → NEGOTIATE → FUND → PREPARE → DELIVER → VERIFY → SETTLE → REINVEST OR RECOVER.

A player may spend five minutes listening to a new release or an hour preparing a concert; neither is a lesser form of play. Player-made music, fans and lived social moments are the centre. Venue, label and promotion systems exist because they enable interesting shared experiences, not because the real music industry contains those job titles.

**Launch fantasies:** (1) *I found a new artist before everyone else.* (2) *I made something musical and someone enjoyed it.* (3) *My friends and I went to a real show inside the city.* (4) *My tiny venue became a recognised local spot.* (5) *I took a risk backing a musician.* (6) *My campaign helped real people discover a song.* (7) *I asked Desk what was possible, made my own choice and found my way there.*

**Target session shapes:** 5 minutes — make a beat edit, discover/save a song, inspect an offer, hang out or finish a short job. 20 minutes — attend a social show, audition, furnish a venue, prepare artwork, arrange a campaign or plan a booking. 60 minutes — perform an event, scout and negotiate, promote a concert, socialise with friends or operate a business. Sessions cannot all depend on a large peak-hour population.

**Audience:** Music fans and independent musicians first; business-simulation enthusiasts, creators and social players next. Nigerian/Lagos-inspired atmosphere, globally accessible subject to legal/hosting requirements. The city is a **stylised fiction**, not a GPS representation or an official affiliation with real Lagos venues.

## 2. Ten product pillars and hard non-goals

| Pillar | Non-negotiable consequence |
| --- | --- |
| Music is the reason to gather | Actual player-supplied or rights-cleared music, not generic economy counters, drives discovery and events. |
| Fans are complete players | Free music, exploration, friends, lounges, open mics and cultural memories with ₦0. |
| The world matters | Releasing, booking, designing posters, making beats and performing have enjoyable physical interactions. |
| Careers emerge from play | One avatar, many activities, at most one registered company at a time. |
| A few businesses, done deeply | Venue operator, record label, promotion agency. No investor/producer/studio/booking-agent company in V1. |
| Human evidence is authoritative | No NPC fans, NPC purchases, fake attendance, auto-awarded listeners or guarantee from ad spend. |
| Contracts have teeth | Funds are real game-ledger funds; protected obligations; risk, loss, refunds and recovery. |
| Creativity remains accessible | A free loop-based creation path and authorised real-song upload compete on identical chart rules. |
| Guidance without automation | Desk gives grounded choices and navigation, no autonomous commitments; Phase 1 is fully non-LLM. |
| Small and lively beats huge and empty | Compact 3D district, one strong public hub, one excellent venue/show; scale after evidence. |

**Explicit non-goals at launch:** Full-scale Lagos map; a Roblox-sized user-generated construction platform; professional digital audio workstation; generated AI songs as a required dependency; real-world streaming royalties; licensing others' commercial recordings by assumption; speculative token economy; passive yield/investor career; casinos; voice chat; stadium concerts with thousands of simultaneous humans; five separate company ledgers; autonomous Desk agent; unfounded Lagos Life wallet/3D-avatar integration; real cash-out. No mandatory daily-quest grind or paid ability to influence charts.

## 3. Authority, status and change-control system

**Precedence order:** (1) Latest explicit founder-confirmed direction; (2) mandatory safety, rights and actual provider/SDK constraints; (3) this Master's **Resolved Rules** register for cross-chapter overlaps; (4) ownership in the **System Authority Matrix** below; (5) source chapter within its domain; (6) example narratives or tentative numerical defaults. A new source contradiction must open a design decision and test before it changes code. The Master does not erase useful chapter-level detail.

**Tags:** **[C]** confirmed founder intent/cross-chapter invariant; **[R]** master reconciliation or authoritative system-owner decision to implement unless changed; **[D]** proposed tunable design default requiring playtest; **[X]** external technical, legal, platform or product dependency; **[F]** deferred beyond the first scoped release. Every config number and externally dependent capability is assigned a status.

**Master revision discipline:** Each update must contain: decision ID, previous rule, proposed rule, owner, rationale, affected chapters/services/data, migration implication, test adjustment and effective version. Changes to signed contracts, ticket prices and historical chart scoring never mutate past commitments or published snapshots silently. A code PR referencing “the GDD” should cite the specific section and design rule ID.

### 3.1 Authoritative domain ownership

| Domain | Source-of-truth owner | Chapters describing UX; never secondary authority |
| --- | --- | --- |
| Player identity, one-company rule | Identity + Company services | Architecture; individual careers; Desk |
| Virtual money, holds, issuance, receipts | Ledger/Economy service | Venue, label, promoter, concert, artist |
| Contract signatures, allocations and enforceable terms | Contract service, with ledger reserve | Label, promoter, producer, events |
| Venue-day rights, leases, event sessions and capacity | Property/Calendar + Event service | Venue, world, Desk, fan |
| Tickets, refunds, artist show commitments, event settlement | Event service + ledger | Fan, venue, artist, label, promoter |
| Music rights, approved assets, embargo/release | Media/Rights + Release services | Artist, world, fan, event |
| Listening qualification and historical chart snapshots | Listening/Chart service | Fan, artist, promoter, world |
| Friendships, communities, inbox and safety restrictions | Social/Trust services | Fan, artist, Desk |
| Ad placements, availability and campaign delivery | Placement/Promotion services | Promoter, world, event |
| 3D presence, travel, public-space source audio | World/Realtime services | All careers, Desk |
| Desk next moves, route presentation, text interpretation | Desk read layer, **no original ownership** of underlying facts | All systems |

**Design anti-pattern:** Every team separately writes `venueBooked`, `ticketsSold`, `artistBudget` and `chartScore` in its own table. Instead, one service owns the fact and publishes projections/safe events to the other interfaces.

## 4. Player identity and the one-company architecture [C/R]

A `Person` has one persistent game avatar, a profile, music tastes, social relationships, optional artist persona, optional freelancer portfolios, wallets and game history. This avatar is not required to select `artist`, `fan`, `investor`, `producer` or `promoter` at signup. The person can be all of these *as activities* without changing characters. Public profile labels are acquired by real actions and verifiable history, not immutable character classes.

**Three registered company types at V1:** `VENUE_COMPANY`, `RECORD_LABEL`, `PROMOTION_AGENCY`. Every type is visible from day one; capital and published eligibility determine whether formation is currently possible. `COMPANY_OWNER` has a database-enforced uniqueness restriction for active, registering, selling, paused or closing companies. Existing obligations survive transfers, hiatus and attempted re-registration. Company sale/closure is deliberate and contract-safe; only after successful ownership exit can a player create or acquire another company.

An artist may simultaneously own a venue company and release music. A label owner can make beats, attend concerts and promote personal work. A promoter with no agency can freelance and use their personal wallet. An ordinary person can organise a show, rent a city venue or provide a limited event sponsorship without forming an event company. **One person may not bypass company limits by taking an agency-style registered business in a freelance costume**, transferring control through an alternate account or informally collecting protected company property. Anti-abuse enforcement and legitimate multi-account handling require an account-policy review [X/D].

Business ownership is not physical property ownership: the city owns V1 venues; the operator owns a **finite operating lease**, a brand/business, an authorised inventory of portable equipment and proven reputation. One venue company controls a maximum of one flagship venue at once [D/C]. Studios and equipment shops are service NPC operations in V1, not additional player-owned business categories.

## 5. Core player journeys (do not optimise solely for entrepreneurs)

**Fola — no-money music fan:** Creates avatar → walks into Music Square → hears a released song at a listening kiosk → saves it → meets a real player → sees a free open mic → walks or takes accessible public transport → attends and cheers → receives a verified show memory. She may never spend money or register a company. Her return reason is friendship and music, not an economy quest.

**Dami — amateur musician:** Takes the free loop workstation → picks drums/bass/chords from compatible cleared loop packs → arranges a funny or excellent track → optionally adds vocals → saves draft → obtains relevant contributors' consent → submits to Release House → is reviewed and published on Friday if eligible → acquires genuine human listeners → tries an open mic. His music receives no lower chart multiplier because of how it was created.

**Kemi — real independent recording artist:** Imports a controlled real song → reviews rights and metadata → makes physical artwork wall choices → schedules Friday → finds and joins a show → accepts/declines label or promoter offers → sees actual listeners, saves, fans and event outcomes → retains autonomy, catalogue and social identity even if a company she works with closes.

**Ada — freelance promoter → agency:** Spots Kemi's published request → agrees a clear fee, deadlines and placement budget → designs and installs a visible poster in an approved scarce slot → hosts an authorised listening experience → reports delivered work separately from real listens and ticket sales → earns contracted service fee → eventually registers one agency if she wants office/brand and greater scale.

**Amaka — venue operator:** Previews one identifiable 50-seat venue → leases operating time → installs approved compatible lights/gear → hires it out or hosts her own talent hunt → chooses artist slots, pays obligations, promotes → fans arrive and enjoy an actual show → revenue, rent and costs settle → she may profit, lose money or later sell the company.

**David — label owner:** Scans public release wall, receives consented demos and attends auditions → signs no more than three funded artists under short, explicit contracts → reserves per-artist minimum funding → helps create eligible projects and organise label nights → recoups only expenses and receipts inside the named covered project → artists retain independent gameplay authority. Poor investments can lose David money.

**Richer social player:** Can finance a specifically disclosed event, decorate personal space, attend high-quality shows or register a business if eligible. Wealth does not buy guaranteed popularity, chart weight or creator control. If a player says, “I just want to chill,” the game and Desk permit it.

---

# PART II — THE SHARED WORLD AND ITS CULTURE

## 6. Launch topology and physical experiences

**World map v1 [D]:** One polished compact entertainment district containing (a) central Music Square, (b) Release House / Hall with record wall and intake desks, (c) city-run studio with free beat desk and vocal booth/import flow, (d) one excellent unique 50-capacity small venue with real calendar, (e) one free listening lounge/social corner, (f) registry/property desk, (g) label and agency office entrances to allocated compact interiors, (h) Stage Supply shop, (i) limited city poster sites and (j) visible opportunity board/job desk. Other district names may exist as musical identity/discovery filters before every district is a walkable geographic world. Do not model kilometres of empty streets.

**World interaction grammar:** See physical object → proximity/target indication → one main verb, such as `Inspect`, `Play`, `Record`, `Submit`, `Place`, `Enter`, `Offer`, `Buy Ticket` → small focused overlay only for required details → server validation → visible world state/receipt → option to continue playing. No endless administrative forms. Repeated skilled activity may gain an efficient phone shortcut that calls the identical authorised server command. Physical signage must show current availability, not decorative impossible offers.

**Portable equipment:** Buy or rent eligible audio, stage, light or decoration SKUs; preview placement on compatible sockets; reject collision, blocked exits, overlap and unsupported geometry; commit item location/version. Purchased items remain trackable when removed, sold or the venue lease expires. A display quality rating is relative to venue capacity and equipment suitability, not an absolute right to larger attendance or fake satisfaction. One modest 50-seat club can achieve high relative quality.

**City scale/density:** Place people together where actual activity exists. Public boards display honest scheduled shows and approximate room activity without leaking identities. Background NPC pedestrians and staff add ambience only. Show actual player occupancy and prevent a showroom full of NPCs from being counted as an audience. The game must work meaningfully with 5–20 people, be load tested at 20–50 event participants and refrain from selling a larger shared concert than the deployed engine can actually host.

## 7. Transportation and Desk navigation [C/D]

Players should experience moving through a city, not one-click teleport into every encounter. V1 has walking, clear accessible routes, a small city cab/shuttle journey with physical boarding/arrival and a free practical route to essential public culture and introductory work. Paid convenience can exist without locking no-money players out of the studio, Release House, public square or free shows. Desk's `Take Me There` sets a verified destination and directions; it **never** books the opportunity or spends the fare by implication. At route end, the actual physical entrance/interaction still happens.

**Transport and travel states:** `ROUTE_PREVIEWED → MODE_SELECTED → WALKING / WAITING_PICKUP → BOARDING → IN_TRANSIT → ARRIVED_OUTSIDE → INTERACTED`; interruption branches for `ROUTE_CANCELLED`, `VENUE_CLOSED`, `CAPACITY_CHANGED`, `FARE_REJECTED`, `NETWORK_RECONNECT`, `ACCESSIBILITY_REROUTE`. A paid fare is explicitly quoted, consented and ledger-settled once; a missed vehicle does not create a second automatic charge. Event check-in continues to validate a ticket and real capacity. The player may ignore Desk and explore manually.

**Cars:** Player-owned/drivable cars are an attractive *expansion after the first healthy music/concert vertical slice* [F]. Vehicle pricing, collision, parking, pedestrian safety, anti-griefing and network reconciliation are substantial separate projects. Do not make driving an initial dependency of music release or social play. Cab rides can deliver a sense of moving through the world without a full traffic physics engine. Accessibility option: low-motion accessible route, no forced dexterity obstacles, reduced travel friction without giving special economic advantage.

## 8. Social identity, friends, groups and fan communities

**Universal social functions:** Text chat with moderation and rate limits; greetings/emotes and voluntary paired dance; friend request accepted/declined; permitted DM; block/report; party of friends and joinable activities; optional public favourite music; one starter personal room; saved tracks, playlists and concert memories. Separate the `FRIEND`, `ARTIST_FOLLOW` and `COMMUNITY_MEMBERSHIP` edges. Following is not permission to DM anyone. Blocking supersedes invites, messages, group travel and social recommendations. Provide online-status controls.

**Groups:** Temporary social party for meeting and travelling together; no shared wallet, formal company, automatic group ticket or authority over a friend's actions. Joining an event attempts shared placement within truthful capacity and session policies; if insufficient, disclose alternatives or let individuals choose. Do not clone a paid 50-seat concert into fictitious extra instances or claim one stage performer was live to disconnected copies.

**Fan community:** One artist-controlled official fan community per eligible artist persona [D]. Official announcements are distinct from open public discussion. Muting/notification category choice respected. Fans can play publicly approved songs together casually; only the artist or explicitly authorised organiser may present an **official** listening party or licensed unreleased preview. Moderators may limit participation subject to game-wide appeal and safety policy.

**Memories:** A verified show creates appropriate individual records for actual attending fans, confirmed artists, organiser and venue. An early-supporter badge can represent authentic historical timestamps, not a purchasable ranking or rights to an artist. Players keep legitimate history when a business fails. No paid fan influence, loyalty-point streaming farms or mandatory quest streaks.

## 9. NPC roles, starter jobs and honest presence

NPCs can run the city registry, property desk, equipment shop, basic studio, transit service, public jobs and visible venue services; they can give deterministic menu help and create ambience. They can sell city inventory under explicit rates, perform story/scene animations and provide a bounded server-paid beginner job on real completion evidence. They **never** become authentic fans, purchase event tickets, generate chart-qualified playback, artificially transfer money between players or masquerade as human accounts.

Starter jobs must have satisfying physical actions (restore a poster board, prepare a public studio workstation, set a small stage, help with legitimate event setup), visible start/complete states, fixed disclosed payouts and anti-abuse cooldown. New accounts begin at **₦0** [D]; optional capped job baseline ₦1,000–₦2,000 for three to five minutes of action, max three jobs / rolling 24h and max ₦4,500 issued per day per eligible account [D]. Payout originates only from budgeted `ISSUANCE`, never fabricated ticket revenue. The treasury/faucet must be playtested against multi-account abuse and the desire to remain a casual non-earning fan.

## 10. The fan-facing minute-to-minute loop

Personal music playback is opt-in and private to the player. Shared lounge/venue sound has **one authorised audible source per listening zone** and requires appropriate browser audio unlock; stage playback follows the actual event programme. Players can mute, disable ambience or use caption/visual equivalents. Walking through adjacent music zones must crossfade/arbitrate, not broadcast 40 avatars' private music aloud. Opening a poster/listening station generates *exposure*, not a chart listen; playback qualification is handled separately.

**Culture calendar:** Friday new-release ritual at the Release Hall; genuine weekend open mics, label showcases, fan meetups and ticketed performances; weekly chart reveal; quarterly official **Destiny Awards**. The awards are platform-curated under published eligibility, content, nomination, vote/integrity and transparency rules [D; detailed trophy categories and ballot weights need a separate approval]. Labels/promoters may run independent showcases, but cannot buy control of awards winners. Do not force daily attendance tasks to keep the city “active.”

---
# PART III — MUSIC, CAREERS AND LIVE EVENTS

## 11. Creation, uploads, rights and the artist journey

**Two equally eligible creation paths:** (1) a real musician uploads a recording they have the necessary rights and approvals to use; (2) any avatar arranges pre-cleared loops into a musical work using an approachable grid/timeline with drum, bass, chord/melody and optional vocal recording or compatible approved import. The creation path must not alter chart ranking weight. Bad, silly and amateur songs can become popular if other players genuinely enjoy them. The free starter workspace must remain usable without a paid studio/company. Complex multitrack DSP, expensive audio generation and external professional DAW integrations are not V1 requirements.

**Required physical player actions:** Choose compatible loop pack → audition samples → arrange tracks into playable structure → hear preview → save named project version → optional voice/approved upload → review credits/rights → export/render permitted asset → prepare physical sleeve/artwork and metadata at Release House → preview in booth → choose Friday slot → submit. Upload handling requires progress/retry and clear unsupported-format rejection, async processing, version integrity and separate rights review. Interactions support mobile touch and repeat-use remote shortcuts. No client-provided “finished” flag is sufficient proof of a valid playable master.

**Rights model [C/R/X]:** Artist asserts and, where needed, documents permission covering master, composition/lyrics, samples, loops, artwork, voice/likeness, collaborating performers, public playback, sharing and relevant territories. A public artist role is not itself evidence of copyright ownership. Unlicensed cover/remix/sample uploads remain on hold or are rejected until properly authorised; no blanket inference from artist consent. A producer can sell a defined in-game permitted-use beat licence; buying it does not silently convey ownership of real-world masters or unrestricted commercial rights. All required co-primary and featured *performer* approvals must be in before an eligible official release; producer-only credit does not consume the producer's weekly performer slot.

**Track lifecycle:** `DRAFT ↔ MIX_READY → SUBMITTED → PROCESSING / RIGHTS_REVIEW → APPROVED_SCHEDULED → PUBLISHED`; alternate `NEEDS_FIX`, `REJECTED`, `WITHDRAWN`, `RESCHEDULED`, `RESTRICTED`, `TAKEN_DOWN`, appeal/reinstatement under logged adjudication. Only server-approved `PUBLISHED` current media is publicly discoverable. Preserve original published `song_id` and chart history across permitted typo/metadata corrections. A materially new master is a new recording requiring eligibility and a Friday slot; do not replace the old audio while keeping accumulated popularity.

**Artist gameplay:** Find a sound → create/import → release → seek real exposure → perform at open mic/confirmed booking → interact with fans → evaluate chart and event evidence → choose collaborations, future releases, label offers, or independent career. Music creation, listening, rehearsals and fans are activities rather than payroll tasks. Performing requires consent; artists can reject or negotiate offers and retain their catalogue, public identity and communities after label expiration.

### 11.1 The canonical Friday schedule [R; adjustable only with versioned decision]

| Milestone | Lagos-local time (WAT) | Server effect |
| --- | --- | --- |
| Normal submission cutoff | Wednesday 18:00 | Complete audio, artwork, credits and consent or move to next eligible week. |
| Final moderation/scheduling checkpoint | Thursday 18:00 | Unresolved releases roll forward with clear reason; no secret early publication. |
| Chart-week boundary | Friday 18:00 | End old qualified-listen window at 17:59:59.999; new week begins. |
| Historical chart reveal | Friday 18:30 | Publish final snapshot or accurately marked provisional/delayed result. |
| Friday release premiere | Friday 19:00 | Idempotent release of valid scheduled masters; world wall updates. |

A person may have **one official artist appearance** per Friday premiere batch: lead, co-lead and featured performing credits all consume the appearance slot; producer-only credits do not. Server timestamps use UTC internally; show WAT (`Africa/Lagos`, UTC+01) to players. The Friday week is Friday 18:00 through following Friday 17:59:59.999, including the hour before new premieres. Approved releases may go live while an artist is offline if their scheduled permissions remain valid. Offline artists do not automatically appear live onstage.

## 12. Music discovery: place, recommendation and the official charts

**Physical discovery surfaces:** unsponsored Release Hall wall with new Friday songs; Music Square public chart billboard; city listening kiosk; opt-in shared lounge; verified live performances; public artist profiles; fan music collections; label demo/listening rooms; approved promoter poster locations; group/social recommendations. The player should feel like *discovering records in a place*, not scrolling an infinite mandated feed. Sponsored posters/slots are distinct, limited and visibly disclosed; purchases create possible exposure, not rank.

**Audio events:** `EXPOSED`, `PLAY_REQUESTED`, `PLAYBACK_STARTED`, `QUALIFIED_PLAY`, `REPLAY`, `SAVE_ADD`, `FOLLOW_ADD`, `SHARED`, `EVENT_LISTEN_CONTEXT`, `TICKET_PURCHASED` are separate facts. Only actually verified, consented and eligible playback contributes qualified-play weight. Attendance plus a room speaker is insufficient. Shared listening requires a qualified **individual human** after explicit audio enabling and playback threshold evidence. Anti-abuse uses authenticated identity, playback timing, dedup and anomaly review; no always-on microphone or invasive GPS. Distinguish authentic raw plays from eligible chart counts; do not silently represent weighted score as number of streams.

**V1 discovery inventory:** New releases (rotation for viable exposure), unsponsored fresh/underground finds (rotation with eligibility controls), relevant districts, public track/artist search, followed-artist updates, official chart winners and legitimate social referral. Established acts can remain successful, but the game should expose new music without charging a gate fee. The algorithm may consider genre/artist eligibility and verified activity but must not use a paid-secret preference to elevate an artist in organic results. Display the reason for recommendations where simple to do so.

### 12.1 Canonical chart formula [D, not empirically validated]

For each eligible `(real_player, song, chart_week)` the provisional contribution is:

`Score = 1.00 * min(q,1) + 0.25 * min(max(q-1,0),3) + 0.05 * min(max(q-4,0),6) + 0.75 * eligible_new_save + 0.25 * eligible_live_bonus`

where `q` is the count of qualified non-fraudulent playback events that week; `eligible_new_save` is a true first-ever `SAVE_ADD` transition paired with a qualified listen in that same chart week (saving repeatedly never renews credit); `eligible_live_bonus` is at most one verified actual event check-in and separately qualified stage listening context for that song/week. **Maximum per player/song/week: 3.05.** Any qualification threshold (playtime, buffer, foreground/user engagement, device policy) is a published configuration and anti-abuse gate, not a naive “browser said finished” event. Weights and thresholds may change only for future windows except explicit audited correction. All songs, professionally uploaded or free-loop built, receive the same score policy.

**Public charts:** `Lagos Top Songs` aggregates unique eligible player contributions; `District Top Songs` attributes one player to at most one chosen **virtual home music district** per week, with changes effective next chart week/cooldown; `Emerging / Fresh Finds` is a clearly named discovery view, not an invented stream metric. District attribution is *not* inferred from real GPS and does not double-award a player for travelling through other districts. Venue-local event analytics can show where a song was heard without claiming extra district chart contributions.

**Snapshots:** Final rankings are server-frozen by week, contain scoring policy version, sorted tie-breaker and publication status. Corrected historical rows retain an audit and visible change annotation. Live “gaining interest” estimates are separate, labelled provisional and can lag. Neither actual chart scores nor archived numbers are directly editable by promoters, artists or admins via ordinary business UI. A removed song becomes unavailable; historical treatment follows transparent rights/integrity correction policy.

## 13. Producing beats and freelance creative commerce

Music production is an **activity**, never a required separate company or a low-effort NPC salary mechanic. A player can use the free public beatmaker, create musical works, display a licensed portfolio, respond to commissioned work, get credited and offer a clearly bounded personal-use/in-world release beat licence. The person may also be an artist or own another permitted company. Credit does not grant chart points without real listeners.

**Licence minimum terms:** Work/version ID, included audio assets and warranties, price, payer/recipient, exclusive or non-exclusive permitted in-game usage, whether further users can buy another licence, collaborator attribution, expiry/revocation rules, refund rule for non-delivery, and whether *any* real-world use is separately licensed. For V1, default to a simple safe, explained licence suitable for the game's actual recording and performance uses; rights/marketplace features requiring real commercial licensing need legal review [X]. No producer may sell a loop pack they don't have redistribution rights to. Price change affects new offers only, not accepted licences.

**Freelancing protection:** Do not let client “listen to private unreleased file” accidentally equal ownership or public chart eligibility. A private demo link is scoped to authorised recipients and expires; the seller receives protected payment only under an accepted quote with actual deliverables/permissions. Disputes, takedown and relaunch must be resolved without creating a second official Friday slot or duplicate public song ID.

## 14. Venue company: playable business, not real-estate speculation

**Venue types:** One unique city-controlled property per public venue identity, with capacity tier, compatible fit-out categories and 24-hour hire slots. A registered venue company may lease one flagship, decorate, equip, publish booking terms, host its own events and accept independent event bookings. The operator pays time-based lease/overheads and can become profitable through human demand, not automatic income for owning a building. Other players can hire eligible city venues directly if unleased; if operated, they hire through the published operating company and the authoritative calendar.

**Calendar rule:** Operator `PROPERTY_LEASE` is distinct from organiser `EVENT_HIRE`. Standard event operating day = **06:00 WAT to 05:59:59.999 the next calendar day** [D], allowing after-midnight performances. Exclusivity is over the unique property and effective time blocks; reservation locks prevent a city clerk and venue operator confirming overlapping events. A lease cannot promise a future event outside funded operating rights. A city hire or operator booking is quoted, reserved and confirmed once; there is no double “rent” charge when a venue owner organises a show inside the already paid operating lease. Company's lease expense is recorded once; allocation on profitability reports is reporting, not another debit.

**Prototype venue ladder [D]:** 30 seats ₦3,000/day; 50 seats ₦6,000/day and ₦29,400/7d operator lease; 150 seats ₦18,000/day; 500 seats ₦80,000/day; 2,000 seats ₦400,000/day; 5,000 seats ₦1,600,000/day. Large visual tiers are **not** approved saleable concurrency without deployed capacity. First real test should use the 50-seat club and validate 20–50 human presence. Quality 1–10 is size-relative and observable through installed gear/comfort, not a buyable fame multiplier. A player can incur loss with an idle venue; closure/sale never transfers legal control of city land.

**Venue experience:** Compare rooms/availability → commit lease or single hire → install equipment physically → offer bookable slots or propose own event → negotiate performer/programme → publish truthful capacity and price → host actual humans → see ticket/satisfaction and finance history → renew, reposition, sell or close. No real attendance guaranteed from décor quality or NPC ambience.

## 15. Record-label company: funded autonomy and real risk

**Start condition:** No currently owned company, eligible identity, working capital and one office allocation. Suggested **₦150,000 personal available** formation gate [D]; example setup charges ₦10,000 company registration, funds a company account, pays a ₦15,000/7d office lease, retains ₦125,000 company cash before signing, so a first ₦100,000 artist budget leaves ₦25,000 uncommitted. All are fictional balance defaults, not Nigeria business-registration laws or actual Paystack/Vatar fees. Values can be tuned while preserving transparent committed contracts.

**V1 scope:** One registered label and office, up to **three concurrently active funded artist contracts**, each normally **4/8/12 weeks** [D]. The first covered agreement requires at least **₦100,000 funded project allocation** per artist [D]; artist and label negotiate a transparent split with artist share within a proposed 40%–90% range [D]. The label does not own the artist persona, community or automatically the real master. A signed funded promise reserves company money in an artist-scoped restricted budget; the artist may spend within approved categories and actual project terms without seeking owner approval for every transaction. All top-ups require separately accepted terms and newly available cash.

**Playable label path:** Hear real songs, meet artists at open mics, read submitted demos, shortlist and compare → send an offer → physically negotiate/accept → reserve financing → support a particular recording/release/promotion and possibly one named ticketed show → watch actual outcomes → settle only eligible receipts from that project → reinvest or incur losses. Organise label discovery nights and showcases as organiser for a separate event account, not disguised artist-budget spending. Venue/artist opportunities must remain accessible to unsigned artists.

**Canonical project accounting:** An `ARTIST_CAMPAIGN` has one paying fund source and named scope: recording/release, promotion and **at most one explicitly named ticketed event**. Its eligible spent costs are recouped solely from receipts contractually assigned to that project; remaining profit follows the agreed artist/label split. **No cross-project recoupment**, double-counted payments, forced personal wallet charges or use of already reserved funds to cover another artist. A label-run independent showcase is paid by ordinary label company business funds; it receives its own event organiser P&L and cannot also claim the same tickets as artist-project receipts. Where label funds an *artist-organised* named event within the project, that event's covered receipts are assigned once to that project waterfall. Late refunds, rights takedown or disputes use adjustments with a provable unique ledger reference.

**Contract rights:** Artist has clear acceptance, expiry, limited categories, allocation, recoup, split, progress and leave/appeal mechanisms; no mandatory daily tasks or punishment for rejecting management advice. Owner inactivity cannot confiscate reserved artist allocations. On company sale, artist agreements require expressly permitted assignment and required artist consent; otherwise preserve existing liabilities, terminate/refund per contract or block sale. The selling player cannot use company-sale proceeds to outrun ticket refunds or artists' promises.

## 16. Promoters: two services and one agency business

**Freelance promoter:** Any eligible player can offer music-release or concert publicity as a personal service. A registered **promotion agency** is optional and takes the single company slot. One campaign contract records a real client, one payer, chosen service, clear deliverables and deadlines, fee, separate reserved placement budget, authorised media, cancellation remedies and optional tightly bounded genuine ticket-outcome bonus. No pay-per-stream, guaranteed fans or prepaid chart placement.

**Physical work:** Scout where audiences actually spend time; create approved event/song posters in a simple template; reserve one of the city or player-venue's **finite, time-limited advertising positions**; physically install permitted creative; organise an authorised opt-in listening session; attend relevant shows to learn the scene; complete agreed publicity activities; show the client an audit trail of *what was delivered*, *what actual player engagement occurred* and *what financial outcome resulted*. A viewed poster is not a counted play; client cannot buy fake listeners by paying for more boards.

**Agency gameplay:** Portfolio/reputation reflects verifiable reliability, fulfilment, repeat business and appropriately contextualised outcome, not a flawless revenue promise. Offices, public portfolio wall, a few active campaigns and optional purchased equipment make agency ownership meaningful. Starting cap such as three active paid campaigns per solo operator is a **tunable hypothesis** [D]; avoid pointless micro-management, repeated buttons or manufactured daily tasks. A promoter can independently become a concert organiser with one named event payer, separate from hired fee-only campaigns. If organiser and promoter roles coincide, contract scope must show that fact and prohibit unearned dual compensation. A client already has ordinary self-promotion rights; agency specialisation succeeds on quality/relationships, not artificial exclusivity.

## 17. Concerts: one financially responsible organiser, a real shared performance

**Event types:** `OPEN_MIC`, `TALENT_HUNT`, `HEADLINE_CONCERT`, `LABEL_SHOWCASE`, `DISCOVERY_NIGHT`, `LISTENING_SESSION`, `RELEASE_CELEBRATION`, `PRODUCER_SHOWCASE`, small `FESTIVAL`, and platform-organised `DESTINY_AWARDS`. All use one event system with templates, not separate payment engines. Any eligible person, artist or company can organise permitted non-official formats; Destiny Awards can be officially scheduled only by the platform. An organiser controls planning and liability, not performer autonomy. The venue operator controls property/operational permissions, not an artist's recording rights.

**Physical show flow:** Inspect available room/slot → agree and fund venue hire → choose event template → invite performers with terms → performers consent → choose eligible setlist and staging → confirm equipment, tickets and refund terms → publish poster/date → genuine fans inspect and buy/free-claim → physically reach door, check ticket or free entitlement → performance begins with shared authoritative timeline and approved audio → fan actions (cheer, wave, dance, follow, save) → show ends and memory is issued → reconcile actual tickets, guarantee fees, supplies, returns and after-show claims → settle once and publish truthful outcomes.

**Authoritative event lifecycle:** `DRAFT → HIRE_HELD → VENUE_CONFIRMED → PROGRAMME_READY → PUBLISHED → DOORS_OPEN → LIVE → ENDED → RECONCILING → SETTLED → ARCHIVED`. Side branches: held-expired, cancelled/refunding/closed, proposed-reschedule with ticket-holder choice, temporary technical pause and safety suspension/failure. `PERFORMER_OFFER: DRAFT → SENT → ACCEPTED_FUNDED → BACKSTAGE → READY → PERFORMING → COMPLETED → PAID` with decline, expiry, no-show, cancellation and disputes. A guest may be advertised as **confirmed** only after acceptance. An event cannot publish required talent/space/rights it does not have. Performance slots and event timeline are bounded; indefinite failed shows cannot hold ticket funds forever.

**Fan-facing numbers:** `tickets_sold`, `valid_ticket_holders`, `unique_checked_in_humans`, `active_present`, `qualified_listeners`, `refunded_tickets` and `stream_chart_points` are separate measures. Example: 35 sold, 24 distinct people checked in; report exactly that, not 35 attendees or 50 fans because the room contains decorative NPCs. Event capacity applies to the **actual physical/technical live session**, not a sales counter multiplied by replicas. Joining friends requires compatible tickets, capacity and actual routing. Reconnect within a valid session is one attendance, not a second sale or chart bonus.

**Stage Mode:** Current performer controls from permitted setlist and approved animations: walk in, choose stage position, gesture, point to crowd, trigger pre-approved lights, interact with audience, move to next song and finish. Song playback remains synchronised to an authoritative event clock after browser user gesture, with drift correction and reconnect handling. Recorded audio is the baseline; live microphone and full audio mixing are deferred. Players must have something enjoyable to do beyond waiting; tactile audience emotes, consented paired dances, visible stage reactions and interaction-triggered moments are part of the core show. A performer's absence invokes published no-show/fallback/cancellation terms; an NPC never secretly “performed” to earn their promised fee.

**Financial event rule [R]:** Exactly one named `organiser_id` and one payer route. Ticket money is held in clearing pending delivery and potential refunds; organiser may not freely withdraw presale money. Performer guarantees and required supplier commitments are pre-funded or reserved before public sale when mandatory. Sales fees apply to **retained** paid ticket value, not refunded value. A completed event still may lose money. No label-backed artist-show receipt also appears as independent label-owned showcase income.

**Worked fixture:** A 50-seat city-managed venue hired for ₦6,000; guest guarantee ₦4,000; production ₦2,000; promoter ₦3,000; rented equipment ₦1,000; staff/other permitted cost ₦2,000 = **₦18,000 total expense**. At a ₦1,000 ticket and **3% retained-ticket fee**, net per sold, unrefunded ticket = **₦970**. Break-even is `ceil(18,000/970) = 19` full-price tickets, not 18. At 10 sold: ₦9,700 less ₦18,000 = −₦8,300; at 20 sold: ₦19,400 − ₦18,000 = +₦1,400; at 35: ₦33,950 − ₦18,000 = +₦15,950. Figures are fictional **test fixtures**; the venue document's earlier ₦16,000 show is another explicitly different bill-of-materials example, not a second rule that this event must cost ₦16,000.

**Refunds:** Cancellation/refund windows and buyer acceptance of reschedule are contract policies captured at ticket purchase. A full refund restores the buyer's ticket money and retains **zero** 3% ticket fee; a 50% refund on a ₦1,000 ticket returns ₦500, applies a ₦15 test fee on the ₦500 legitimately retained, and allocates ₦485 in remaining event proceeds. Supplier cancellation responsibility, organiser absence, revoked rights, venue hazard and service outages each have a stated remedy and fair dispute procedure. If organiser insolvent, retained protected ticket clearing cannot be diverted to pay unrelated company creditors. No negative personal wallets through a hidden fallback.

---
# PART IV — ONE ECONOMY, ONE TRUTH

## 18. Standalone virtual money and the accounting constitution

The initial displayed unit is **virtual ₦**, explicitly labelled as fictional/in-game currency. It is not real NGN, Lagos Life wallet money, bank money, a transferable financial asset or a promise of cash value. No cash-out, real-world investment return or conversion exists in V1. Prices are balance-test defaults. All authoritative amounts use integer minor units (`100` minor units per displayed virtual ₦) and signed 64-bit-safe validation. A negative debit amount, double-settlement, fractional minor unit, integer overflow, client-issued credit or unauthorised transfer is rejected.

**Supply policy [R]:** Only `CITY_ACTIVITY_ISSUANCE` (verified capped starter jobs, specifically pre-funded official prizes) and logged, authorised exceptional test/seasonal grants may issue new money. Every issuance has an actor, amount, budget, reason, policy version and audit reference. Spending, venue booking, fan gifts, label funding and escrow move existing money; they don't mint it. Retired city fees leave circulation only when earned/settled under an explicit sink, and may not simultaneously be re-issued “from city treasury” without a new issuance journal. Grant money must not invisibly pass as a player-earned event payout.

**Minimum ledger invariant:** `book_balance >= reserved_balance >= 0; available_balance = book_balance - reserved_balance; available_balance >= 0`. All settled transfers have balanced debit/credit sides across personal, company, escrow and clearing accounts unless the transaction explicitly crosses `ISSUANCE`/`RETIREMENT`. The sum of book balances for all spendable-equivalent accounts changes **only** by authorised net issue/retirement. Reservations restrict existing money and do not add it to outstanding supply again. A fully moved escrow must release the matching reservation atomically. Server transactions must be serialisable for the relevant balances/slots and idempotent via operation key.

**Account types:** Player personal; registered company; label artist-scoped restricted allocation; event/ticket clearing; campaign placement funds; refundable hold/escrow; city sink/issued-budget journal. A payer type is explicit on every contract. Company owner is not allowed to withdraw restricted allocations, ticket deposits, outstanding refunds, accepted supplier guarantees or pre-funded campaign placements. Personal cash, company cash and project restrictions remain separate. Every receipt links transaction, contract/project/event/source and idempotency reference.

**Cash allocation example:** Label owner transfers ₦140,000 from personal balance to initial company ledger in a documented setup transaction and pays ₦10,000 registration as separate personal/city charge according to the published setup flow. The label then pays ₦15,000 office lease and has ₦125,000 company cash. Signing an artist with a ₦100,000 protected project budget makes ₦100,000 **reserved**, not a gift deposited into an unrestricted artist wallet; company available cash falls to ₦25,000. An approved project spend of ₦8,000 moves/settles that portion of already reserved value and reduces the restricted commitment appropriately. No duplicate spendable money appears.

## 19. Unified contracts and who is allowed to promise what

**Contract families:** Venue operating lease; single event venue hire; ticket entitlement/refund policy; performer appearance guarantee; promoter fee + placement allowance; producer licence/commission; label artist agreement + project; approved event sponsorship/backing; supplier equipment rental/sale; accepted business sale/assignment. The state vocabulary can be common while obligations remain type-specific. Every funded agreement records: parties and authorisation, exact scope/deliverables, price and payer wallet, reserved amounts, accepted/versioned terms, deadlines/timezone, rights consent, failure/remedy rules, associated asset and event identifiers, settlement policy and audit trail.

**Acceptance sequence:** `DRAFT → OFFERED → VIEWED → COUNTERED? → ACCEPTED_PENDING_FUNDING → FUNDED_ACTIVE → DELIVERING → VERIFIED → SETTLEMENT_PENDING → SETTLED / CLOSED` with `REJECTED`, `EXPIRED`, `CANCEL_REQUESTED`, `DISPUTED`, `CANCELLED_REFUNDED`, `PARTIALLY_SETTLED` and documented breach outcomes. No client screen is allowed to infer acceptance from the existence of an offer; an invitation isn't a confirmed booked act; “I sent payment” is not proof of final settlement. Offers lock revisions at signature; changed term, asset, date or price requires renewed consent. Multiple devices must not both accept a stale revision.

**Escrow versus reserved balance:** A reservation holds value in the payer's account; escrow moves value to an independently controlled account. Use **one** representation per lifecycle transition and release it deterministically. A booking quote is neither a debit nor a signed agreement. A player must explicitly inspect and accept a final price, and a server-side commit revalidates live calendar/capacity, rights, available money and hold expiration. If a technical retry occurs, return the result for the original idempotency key, not a duplicate booking/payment.

**One event, one organiser, one project receipt:** Events are financially independent units. If an artist organises a concert with label-funded project costs, the event references the single named project. The event settles once; its eligible proceeds are attributed once to the project; the label waterfall is computed once. If the label itself organises a showcase, the label business holds ordinary event P&L; the showcased artists may receive specified fee guarantees but their label projects do not recoup those tickets automatically. A promoter can act as vendor *or* organiser (or separately scoped dual service where transparently agreed), never hidden duplicate beneficiary. The same production gear expense cannot appear in the event and a label project as two separate cash spends.

## 20. Game prices, leases, promoters and first-income balance anchors

| Parameter | Master V1 alpha fixture | Status and warning |
| --- | ---: | --- |
| New account cash | ₦0 | [D]; free play must still be interesting |
| City introductory job | ₦1,000–₦2,000; 3/day, ₦4,500 total cap | [D]; playtest honest effort, not AFK |
| 50-seat city small venue 24h hire | ₦6,000 | [D]; separate from venue operator lease |
| 50-seat venue company seven-day lease | ₦29,400 | [D]; plus relevant operating overhead |
| 50-seat company lease baseline overhead | ₦500 per active lease day | [D]; actual debit once |
| Fictional ticket service fee | 3% of final retained gross | [D]; **not** a Vatar/real payment fee |
| Label minimum available funds for formation | ₦150,000 | [D]; eligibility versus charges distinguished |
| Label registration and initial office | ₦10,000 registration + ₦15,000/7d office | [D] |
| First accepted label artist allocation | ₦100,000 minimum | [D]; held, not immediately spent |
| Label active funded roster | Up to 3 artists | [C/R] |
| Label agreement length | 4/8/12 weeks | [D] |
| Label artist share after project recoup | Negotiated, baseline 40%–90% | [D]; signed term prevails |
| Solo promoter active campaign limit | Start with 3 | [D]; avoid arbitrary friction if testing disproves |
| Stage first technical capacity | 20–50 humans/event session | [D]; ship only tested number |
| Friday release appearance | One per artist/week | [C] |

There is no rule that an artist must rent a venue, pay a producer or purchase advertising to succeed. Financial optionality protects the zero-money path and allows risk to emerge from decisions. Distinguish economy **sources** (city jobs, legitimate player-to-player service/entertainment revenue) from **sinks** (city fees, city-controlled property hire, certain NPC purchases and bounded equipment/cosmetic drains). Players cannot collect salary merely because their song was played or they achieved chart rank. Real estate and general company shares are not speculative yield tokens.

**Economic health questions to measure:** How many verified 3–5-minute jobs fund a first affordable optional service? Can a new player organise a tiny free activity without spending? Does an idle venue predictably lose rent but retain its history? Do company owners have time to play rather than endlessly handling forms? Do the richest players generate activity for others, or monopolise finite inventory? Are services priced such that at least some players voluntarily hire another human rather than always self-service? All proposed prices are subject to simulated and human balance tests.

## 21. Event sponsorship, transfers, business failure and recovery

**Optional wealth participation:** A fan/wealthy player may transfer permitted game currency voluntarily or fund an explicitly scoped event with documented outcomes and risks. No universal investor career or passive guaranteed percentage-yield account. No ownership of real music IP, no real cash-out and no in-game betting. A backer receiving conditional event proceeds does so only from eligible settled revenue under an accepted pre-funded contract and within platform legal review [X]. Gifting an artist grants neither special fan voting weight nor chart influence.

**Insolvency:** A company cannot make new unaffordable commitments; the service suspends relevant new actions and protects accepted obligations. Outstanding holds/escrows remain identifiable, refunds have priority according to published contract policy, and sale/closure must settle or validly transfer obligations. Company business closure does not erase the human's artist persona, catalogue, friends or legitimate prior achievements. No surprise negative personal account caused by a failed company; players can return to free social play and work, and later form a new business when eligible.

**Company sale:** City property never transfers as owned real estate. The sale can transfer the company brand, compatible owned portable gear, verified portfolio/history, its permitted remaining lease/booking rights and accepted liabilities. Buyer cannot exceed one active company. Future artist agreements need required artist consent and lawful assignment; future venue bookings need enforceable continuity or refunds. Price and hold reserve are accepted before ownership switch, completed atomically or declined, and all contract parties get a clear notice. Seller cannot extract presale ticket money before fulfilling the show.

**Dispute clocks:** Takedown, safety stop, refund, buyer reschedule choice, performer no-show and supplier breach need actionable response windows and human-review escalation configured **before** money can be accepted from a public tester. Undecided legal terms are a launch gate, not a reason to silently default to “all sales final.” No high-risk event should start ticket sales until the refund/escrow pathway has been adversarially tested.

---

# PART V — DESK BOT: GUIDANCE WITHOUT LOSING THE GAME

## 22. Desk Bot as the product's game-native identity

**Desk** is the in-game guide available to every player on their virtual phone. It reflects the useful philosophy behind OrderSounds Desk, but is a game service, not the real-world product, an implied paid subscription or a bridge that exports gameplay to real artist accounts. Branding may show “Desk — by OrderSounds” subtly, and a clearly voluntary external product link may be added only if platform rules allow [X]. No required external signup, misleading commercial recommendations or automatic cross-product personal-data sync.

**Phone experience:** `Today` (short relevant status + at most three Next Moves), `Ask Desk` (guided searchable questions in Phase 1; natural language in Phase 2), `My Plans` (one active general interest and at most three pinned voluntary destinations/objectives). At relevant workstations it can show a one-line optional contextual prompt; it is **not** a humanoid robot and does not fill the world with chat balloons. Map is the world's ordinary shared map. A card has grounded reason, actual action ID, eligibility/price/time information, clear alternatives and `Not now` / dismiss controls. Player chooses and remains responsible for consent.

## 23. Phase 1 — complete Desk with absolutely no LLM [C]

The Phase 1 sequence is deterministic and cheap:

1. **Player context request** from authenticated user, with scoped permissions.
2. **Context Gateway** reads short verified snapshots: current goal, own legal capabilities, artist/release state, accessible public events and jobs, reserved/available balances, signed deadlines, nearby destinations, friends/notifications that can legally be shown.
3. **Action Registry** supplies predefined typed actions, each with service owner, server requirements, destination and final human-controlled command (examples `MAKE_BEAT`, `PREPARE_RELEASE`, `VIEW_OPEN_MIC`, `TAKE_CITY_JOB`, `SCOUT_ARTIST`, `COMPARE_EVENT_QUOTE`, `REVIEW_LABEL_OFFER`, `NAVIGATE_TO_VENUE`, `VIEW_FREE_SHOW`).
4. **Eligibility filter** rejects closed/expired/full/unaffordable/inaccessible options *unless* deliberately presented as an explanatory future goal with an explicit barrier.
5. **Rules rank** relevance to user-stated goal, urgency, closeness/effort and meaningful variety; no secret paid-ranking auction.
6. **Generate ≤3 short Next Move cards** with trusted reason, optional alternatives, `Show route` or `Inspect`, and `Not now`.
7. **At activation**, game service revalidates live information. Desk never completes a payment, signature or publication directly.

**Ask Desk in Phase 1:** Topic chips, how-to search, exact FAQs and a small safe keyword/intent matcher. Example “How do I make money?” → verified city job board, freelance request and free cultural alternatives. “Where is the studio?” → map directions with physical movement. “Should I sign Kemi?” → explain relevant public evidence and available show, not predict success. “Can I buy this?” → call authoritative economy quote, show cost plus remaining available balance and let the player decide. This is **fully shippable** and remains available during network/model issues.

**Time and enjoyment rule:** Suppress unsolicited recommendations during stage performances, recording takes, driving/travel transitions, payment or contract confirmation, dance, active chat composition and critical safety interactions. High-priority event/rights/contract warnings belong to the ordinary notifications system and cannot be dismissed merely by muting Desk suggestions. Player can always close Desk and explore freely. It must never convert social leisure into a forced mission list.

## 24. Phase 2 — optional low-cost LLM language adapter [D]

Add a small provider-independent model **only as an input/output language layer over the exact same actions, sources and permissions**. The LLM interprets a short typed request to an **allowlisted intent plus filters**, using a bounded structured prompt; the server validates intent, resource IDs and permissions; deterministic services produce eligible action cards and exact facts; optionally the model rewrites a concise explanation from those facts. The common request should involve **at most one model call**; a second is warranted only if it adds significant clarity. No autonomous tool chain, background agent, vector cluster, separate company memory, financial calculator hallucinations or LLM-run game transactions.

**Phase 2 shape:** `User query → safe preprocessing → Phase 1 exact-match resolver → optional tiny-LLM intent JSON → server schema validation → Context Gateway / action lookup → server-computed costs and availability → templated or constrained short answer → player-selected action`. For follow-up questions, keep a brief session referent to the last confirmed entity/action; never rely on hallucinated chat history to commit money. If model response is malformed, unavailable, delayed, over budget or refers to nonexistent venue IDs, fall back to the Phase 1 help/choices without pretending it answered from live truth.

**Default safeguards [D]:** Server-side provider key; short question and minimal necessary authorised facts; output token/latency/rate budgets; per-account abuse throttling; static FAQ caching; provider timeout; schema-constrained output where available; audit of selected intent/result without indefinite raw private-chat retention; prompt-injection tests using player names, venue posters, music titles and shared artist descriptions. No private DMs, sensitive contact data, exact financial data of other players, off-platform profile scraping or secrets are sent to the model. A malicious song title saying “ignore all instructions” is treated as catalogue data, never a command.

**Exact behavioural equivalence:** Under the same game state, Phase 1 and Phase 2 must agree on whether a booking is available, price, deadline, ownership, signer, chart position and fund restrictions. The LLM may express trade-offs differently; it cannot add unavailable actions, remove user consent, favour sponsors as organic advice or give personal medical/legal/financial real-world advice beyond relevant game rules.

## 25. Desk limitations and edge conditions

| Player situation | Correct Desk behaviour |
| --- | --- |
| No money/no music | Offer free studio, free public fun and actual eligible jobs; never shame player. |
| Draft missed Wednesday submission cutoff | Explain next eligible Friday, not a false immediate release option. |
| Artist rights review pending | Explain hold and safe preparation; don't leak track via “preview for friends” link. |
| Studio closed or remote server offline | Route to actual alternative or show later status; don't create a phantom station. |
| Venue booked while route in progress | Revalidate at entrance; offer real alternatives, don't override calendar. |
| Ticket sold out | Explain capacity and waitlist if supported; no “Desk priority entry.” |
| Company money reserved for an artist | Calculate from **available** balance; never treat the hold as free spending money. |
| Artist offered recoup contract | Explain covered project, recoup and split, then offer compare/counter/decline. |
| Promoter requests guaranteed plays | Refuse guarantee; show permitted campaigns and exposure-only outcomes. |
| Friend blocked target | Do not route/invite or reveal blocked private presence. |
| AI model returns invented prices | Discard, replace with service-signed quote or uncertainty. |
| Driving/performing/audio recording | Remain quiet; user can manually open concise guidance later. |
| Paid cab unavailable/no fare | Offer accessible walking/free transportation when feasible; destination stays reachable. |
| Game state changes during a Desk answer | Display current revision and require action-service final check. |
| User ignores recommendations for months | Do not lock progression; Today gracefully refreshes to current state. |

**Recommendation success metric:** How often a user is able to choose and complete a satisfying in-world action, not how many messages or model tokens they generate. Desk can be useful after a single interaction, and occasional wrong or intrusive advice should be reported and correctable.

---

# PART VI — ENGINEERING ARCHITECTURE & CANONICAL CONTRACTS

## 26. Implementation posture: small modular core, not a microservice project

A small team building the first playable version should favour a **modular monolith / well-bounded backend plus one real-time world service** rather than fifteen separately deployed services. Logical services in this document are **responsibility boundaries**, not a requirement for Kubernetes, a service mesh or a giant microservice estate. Choose technologies based on actual team capacity and supported client devices. A plausible reference stack: TypeScript client with browser 3D renderer (e.g. Three.js/Babylon-based chosen after prototype); accessible React shell for phone/interfaces; secure TypeScript backend; transactional PostgreSQL; object storage/CDN for approved audio/images and scene assets; WebSocket or similarly proven authoritative realtime layer for players/show state; background workers for moderation, media encoding, scheduled releases and chart computation; admin tools. Specific vendor and engine selection is **open engineering decision**, not verified implementation.

**Why not web-app-only:** Physical social presence, collision/dance/stage interaction, synced audio and a real venue require runtime game logic beyond forms. **Why not AAA engine from day one:** The initial game should prove that twenty humans want to meet, hear music and attend shows before a massive vehicle/open-world asset investment. Client should degrade gracefully on mobile: progressive asset loading, texture/geometry budgets, distance-based detail, controlled emissive effects, pausable audio, touch-friendly interaction, reduced-motion and connection recovery. Test on real low/mid-tier Android and iOS browsers rather than assuming developer desktops represent the audience.

### 26.1 Logical components and trust boundaries

```text
Browser client (3D world + virtual phone + local audio)
       | authenticated, rate-limited commands
       v
Game API / authorization / input validation
       |
       +-- Identity & Company ownership
       +-- World / Presence / Travel / Instance admission (realtime)
       +-- Music Assets / Rights / Friday Release
       +-- Listen Evidence / Charts / Search
       +-- Social / Chat / Community / Notifications
       +-- Property / Calendar / Venue Equipment
       +-- Event / Performer / Ticket / Stage timeline
       +-- Offer & Contract state machine
       +-- Ledger / Escrow / Settlement / Issuance
       +-- Campaigns / Ad-placement inventory
       +-- Desk context + action registry (optional LLM language adapter)
       +-- Trust, Admin, Audit, Safety and Operations
       |
Transactional SQL + durable event/outbox + object storage/CDN
       |
Background jobs: encoding/review; Friday publish; scores; expiries;
                  event payouts; audit repair; inbox notices
```

The browser renders optimistic animation but **never authors authoritative financial, chart, company, availability or ticket state**. The server is responsible for identity verification, purchases, offers, release eligibility and presence membership. Realtime avatar position can use constrained client inputs with server plausibility checks rather than demanding expensive frame-perfect physics in every interaction; protected doors, event entry, player-occupied zones and paid actions require server decisions. Write operations include idempotency keys and return durable results.

**Persistent state vs session state:** Game records, songs, money, contracts, leases, release history, friend edges, performance memories and purchased equipment are durable SQL-backed facts. Avatar interpolation, temporary animation phase, local camera, individual personal audio playback and ephemeral chat UI focus are client/session state. Long-lived event show timeline uses an authoritative session/event record so the state can be recovered. Do not store permanent economic truth solely in a WebSocket room or a browser local cache.

## 27. Canonical database objects: minimum coherent schema

The following names are implementation-neutral contracts; exact fields, indexes and migrations are for the engineering design review. Every persistent entity has a stable UUID, creation timestamp, server version, access rules and audit source where relevant.

| Entity | Required minimum fields | Invariant / principal owner |
| --- | --- | --- |
| `person` | `person_id`, auth subject, public handle, status | Unique persistent principal, identity service |
| `avatar_profile` | person, appearance asset IDs, version, accessibility | One active avatar, world service |
| `artist_persona` | person, status, display, community ID | Activity identity, not company slot |
| `company` | ID, type, brand, status, current_owner | Only three company types |
| `company_ownership` | person, company, effective interval, status | One active/pending company per person |
| `wallet_account` | owner type/ID, book balance, version | Ledger sole writer, no negative available |
| `ledger_journal` | debit/credit accounts, integer amount, ref, policy, key | Zero-sum except explicit issuance/sink |
| `fund_reservation` | account, amount, contract/project, expiry, state | Restriction, not duplicate money |
| `issuance_record` | city budget, recipient, reason, policy, actor | Only authorised faucets |
| `agreement` | parties, type, scope, signer version, status, remedies | Frozen accepted terms and audit |
| `agreement_obligation` | agreement, beneficiary, amount, due, state | One reference per payable deliverable |
| `venue_property` | ID, capacity, district, allowed gear, owner city | Unique property & published inventory |
| `property_lease` | venue, company, effective blocks, quote, status | No incompatible leases overlapping |
| `event_hire` | venue, time block, organiser/event, funded right | No double booking |
| `equipment_item` | SKU, owner, sale/rental state | One inventory owner, compatibility |
| `equipment_placement` | item, venue, position/socket, layout version | No duplicate gear or blocked egress |
| `artist_work` | ID, artist, master version, credits, artwork | Only rights-cleared public assets |
| `media_rights` | work, master/composition/sample/art consents, status | Takedown propagated to every playback |
| `contributor_consent` | work, person, performer/producer credit, state | Performer release quota enforced |
| `release_slot` | work, Friday time, artist appearances, state | Unique person+week performing slot |
| `playback_evidence` | person, work, session, quality, time, signature | Anti-spoof, only eligible accounts |
| `song_save` | person, work, saved state, first-add timestamp | No re-save farming |
| `artist_follow` | person, artist, state | No automatic DM right |
| `chart_affinity` | person, chart week, virtual district | One home district/week |
| `chart_snapshot` | week, territory, score-policy, ranks, status | Frozen/published version and audit |
| `friend_edge` | two persons, request/accepted/blocked context | Blocking overrides social availability |
| `fan_community` | artist, privacy, moderators, status | Artist-authorised announcements |
| `party` | leader, invited members, session preference | No group-wallet or auto-ticket |
| `event` | type, organiser, venue, day, status, session config | One organiser and state machine |
| `performer_booking` | event, artist, terms, consent, guaranteed funds | Invite != confirmed |
| `ticket_type` | event/session, price, max quota, refund policy | Capacity globally enforced |
| `ticket_entitlement` | buyer, event, status, payment/hold ref | No duplicate sold ticket identity |
| `event_checkin` | entitlement, human person, server time, session | Once per eligible person/entitlement |
| `event_settlement` | event, receipts, fees, payouts, journal ref | Exactly once, replay safe |
| `artist_project` | artist, label agreement, scope, named event, payer | One project waterfall/payer |
| `project_revenue` | project, event/other eligible receipt, journal ref | No double attribution |
| `campaign` | promoter, client, payer, scope, deadline, status | Work != engagement != result |
| `ad_slot` | property/board/time, inventory owner | Scarce availability, conflicts blocked |
| `ad_booking` | slot, creative rights, buyer, funded status | Display verified separately from plays |
| `player_memory` | person, real event/achievement, verified cause | Not sold as influence |
| `starter_job_claim` | person, job, evidence, payout ref, 24h budget | Anti-AFK and anti-faucet abuse |
| `desk_goal` | person, goal code, status, pinned plans | Preference only, no career lock |
| `desk_action_registry` | action code, service, eligibility, destination | Typed, no LLM-invented actions |
| `desk_suggestion_log` | person, action, context version, outcome | Minimal telemetry, privacy-limited |
| `notification_inbox` | recipient, source, category, safety, read | Durable and permission-scoped |
| `trust_case` | content/actor, category, evidence, action, appeal | Audit and rights/safety response |
| `event_outbox` | source aggregate, monotonic revision, type, payload ref | Retry without duplicate downstream effect |

**Essential database uniqueness/locking:** person+active company; venue+exclusive effective time block; artist appearance+Friday; person+song saved state; person+song+week scored aggregate; ticket entitlement+single check-in identity; operation idempotency key; contract revision+acceptance; event+single settlement; ledger reference+exactly one external delivery. Strong transaction boundaries must be verified under simultaneous requests, not assumed from frontend disabled buttons.

## 28. Service-to-service event contract

Use a transactional **outbox and idempotent consumers** where one write triggers projections in another subsystem. This can begin inside one deployed backend and one worker queue, not an event-stream infrastructure project. Persist the authoritative mutation and outbox record in the same database transaction. Consumers save processed event ID/revision and rebuild projections on demand after downtime.

| Producer event | Consumer and consequence |
| --- | --- |
| `ARTIST_WORK_APPROVED` | Release calendar lists eligible slot; Desk shows status |
| `RELEASE_PUBLISHED` | Discovery search/listening wall receives public asset; notifications; chart eligibility begins |
| `WORK_RESTRICTED` | CDN entitlement revocation, venue audio failover, chart eligibility stop, creator notice |
| `VENUE_HIRE_CONFIRMED` | Event draft obtains property entitlement; property calendar updates |
| `PERFORMER_OFFER_ACCEPTED_FUNDED` | Event lineup gets truthful confirmation; guarantee held |
| `EVENT_PUBLISHED` | Public event listing, shareable poster, eligible notifications |
| `TICKET_SOLD` | Ticket ledger hold and entitlement; sold count only |
| `EVENT_CHECKIN_VERIFIED` | Actual human attendance once; optional fan memory gate |
| `STAGE_TRACK_QUALIFIED_FOR_PERSON` | Listening qualification process, not automatic attendance-stream equivalence |
| `EVENT_ENDED` | Settlement worker begins reconciliation, no premature organiser cash access |
| `EVENT_SETTLED` | Finance/label project attribution exactly once; venue/organiser reporting |
| `CAMPAIGN_PLACEMENT_DELIVERED` | Campaign fulfilment evidence, never chart points |
| `AGREEMENT_ACCEPTED` | Funds restricted, rights and deadlines projected to relevant Desk/boards |
| `COMPANY_OWNERSHIP_CHANGED` | Permission invalidation; no stale former-owner commands |
| `SOCIAL_BLOCK_APPLIED` | Messaging, invites, group and Desk social suggestions filtered |
| `FRIDAY_CHART_PUBLISHED` | Square billboard and immutable ranking history refresh |

**Operational reconciliation:** Hourly/daily workers compare protected sums, mismatched invoice/ledger references, booked venue intervals, release eligibility, ticket claims, outbox backlog and event settlements; problematic aggregates are quarantined, alerted and corrected with append-only adjustments. Never “fix” a broken ledger by modifying a displayed balance field manually.

## 29. Core server commands and consent points

| Command | Must revalidate | Player sees before commitment |
| --- | --- | --- |
| `createCompany` | One-company slot, identity, funds, valid type/name | Startup cost, company funding and obligations |
| `startCityJob` / `completeCityJob` | Eligibility, timer/physical evidence, budget/cooldown | Fixed payout and time expectation |
| `uploadArtistWork` / `submitRelease` | Media size/type, rights, performer consents, slot/deadline | Actual status and next eligible Friday |
| `createContractOffer` / `acceptContractOffer` | Terms revision, signatory, available reserved money | Scope, recoup/split, commitment and remedies |
| `reserveVenueHire` / `confirmEvent` | Venue interval, funded hire, organiser, approvals | Date, ticket cap, rent and refund exposure |
| `acceptPerformerBooking` | Performer identity, setlist rights, guarantee hold | Exact appearance terms and cancellation policy |
| `publishEvent` | Confirmed performers, property, rights, refund policy | Public poster/ticket details |
| `buyTicket` | Money, event status, live global cap, unique entitlement | Actual price and refund term |
| `checkIn` | Ticket/free entitlement, instance cap, safety/access | Entry status; no new purchase without confirmation |
| `startShow` / `advanceSet` | Organiser/host/performer authority, timeline, approved audio | Show/track ready and start state |
| `completeCampaignPlacement` | Slot reserved, creative approved, displayed proof | Delivered ad; not guaranteed engagement |
| `settleEvent` | Ended state, all holds/claims, refunds, idempotency | Detailed reconciled P&L and disputed items |
| `sendVoluntaryTransfer` | Recipient, available personal money, limits | Explicit recipient, sum and consequences |
| `registerDeskRoute` | Existence, access, safe navigation, live version | Walk/ride options; no booking or money commitment |

Authorisation is **object- and state-based**, not just role-based. A label owner can view their funded artist project's permitted numbers but not other labels' artist wallets or personal DMs. A venue operator may validate an event door and control room equipment but not read a fan's protected banking data or override an artist's rights. Event and company ownership must be checked at the instant each command executes, including after business sale or revoked collaborator consent.

## 30. Privacy, moderation, rights and safety operations

A music-oriented multiplayer world cannot safely ship open uploads, public chat and payments without operational responses. The minimum internal console must support: account suspension/block appeals, chat/content reports, music-rights case intake and takedown, media processing queues, chart anomaly review/correction, refund/dispute administration, venue/safety interruption, protected money inspection with least privilege, content-policy/version controls, asset/transaction audit trail, and the ability to pause creation or payouts without destroying records.

**Age policy [X]:** Establish launch age eligibility, minors' treatment, DM restrictions, live chat protection and reporting/staffing before publicly opening social features. **Content rights [X]:** Publish licences/TOS that cover real recordings and licensed loops, covers/samples, users' likeness/voices, moderation appeals, content removal and permitted in-game playback/sharing. Protect artists against unauthorised upload and preserve evidence while restricting playback. **External product/SDK [X]:** Verify platform rules, technical capabilities, paid feature permissions and marketing links in writing where applicable. No real-world financial recommendation or assumption of payment-processing compliance is implied by fictional economic design.

**Security defaults:** Server-held secrets; short-lived signed media URL/entitlements; protected admin access with reauthentication; password/account recovery and user-facing session logout; encrypted transport/storage where appropriate; rate limiting on uploads/DM/LLM; abuse signals with reasonable appeals; structured audit logs scrubbed of private content; personal-data retention and deletion policy; backups and transactional recovery testing. Disallow inventory duplication, replayed tickets, forged playback telemetry and unbounded chat spam. Avoid publication of private account balances, real locations, private artist demos, unaccepted contract offers or sensitive social graphs.

## 31. External integration and product separation

**Standalone release first [C]:** THE SCENE is reachable from its own HTTPS URL and playable without an account in Lagos Life. All game-specific money, contracts, tickets and 3D avatar presentation are hosted by THE SCENE and labelled accordingly. The previously consulted Vatar/Lagos Life documentation describes an embedding/player context and some specialised SDK facilities but does **not establish** a general arbitrary game-naira wallet transfer/settlement API or a portable 3D avatar integration. Verify current API permissions directly before designing such a bridge; do not silently repurpose staked matches as concert or business payments. A portrait/avatar image is not proof of importable 3D rig geometry. No transfer or equivalence of outside player wealth is assumed.

**Adapter boundary:** Authentication/embed can be added as one optional identity route; if authorised later, clearly separate provider ID from canonical person; payment adapter is isolated and leaves game contracts/ledger transactionally sound. Any new provider product/fee changes require acceptance tests with failure/refund and duplicate webhook scenarios. Integration must not become a condition of independent free social access. Real OrderSounds Desk data stays outside the game; any future opt-in data transfer requires explicit permission and product/legal review.

---
# PART VII — RECONCILIATION, SCOPE AND DEPENDENCIES

## 32. Cross-chapter conflict resolution register

The earlier chapters were created sequentially and naturally contain examples or candidate mechanics that predate later shared decisions. The following rules are **binding for implementation planning**; detailed source text still defines its own scene and UX where it doesn't conflict. Treat actual bugs or contradictory tests as change requests, never choose whichever rule is easiest to code.

| ID | Potential contradiction | Reconciled binding master decision | Implementation ownership |
| --- | --- | --- | --- |
| REC-01 | Early H-Path calls producer, investor, studio, event organiser careers | Artist is a personal career; production, event backing and organising are **activities**; exactly three registered business types | Identity/Company |
| REC-02 | “Any business is available” vs “one company” | All **three available company categories** visible on day one; acquire at most one if eligible/funded; side activities unrestricted | Identity/Company |
| REC-03 | Free freelance promoter vs agency ownership | Freelancing uses personal authorisation and honest scope, does not confer a second agency/company account | Company/Contract |
| REC-04 | Early venue examples use other hire costs or service fees | 50-seat one-day ₦6,000; 7d operating ₦29,400; internal test ticket fee **3% retained gross** | Economy/Property |
| REC-05 | Venue owner running own concert appears charged city hire again | Existing paid company lease is actual property cost; **no second self-hire rental debit**. Event P&L may allocate lease expense analytically, labelled non-cash allocation | Property/Economy/Event |
| REC-06 | Sold tickets, checked-in humans, session cap, fan chart counts mixed together | Four independent measurements; no paid phantom attendees; attendee-qualified listens separately assessed | Event/Listening |
| REC-07 | Multiple organisers or promoter vs label competing to receive the same receipts | One event organiser, one event settlement and one named project attribution/payer where relevant | Event/Ledger/Contract |
| REC-08 | Artist project finances versus label showcase P&L | Artist-organised label-funded **named** show can be included in one campaign; **label-organised** showcase uses label ordinary funds | Label/Contract/Ledger |
| REC-09 | “Label owns/controls artist” inferred from business game | Label buys only actual signed in-game obligations/profit rights. Artist retains persona, music rights and artistic decision control | Contract/Artist |
| REC-10 | Early song release timing may be vague | Wednesday 18:00 submit; Thursday 18:00 checkpoint; Friday 18:00 chart cut; 18:30 reveal; 19:00 premieres (WAT) | Release/Charts |
| REC-11 | “One song per artist” could be bypassed through featured credits | One **official artist appearance** per lead/co-lead/featured performer each Friday; producers not automatically artist appearances | Release/Identity |
| REC-12 | Old chart score examples vs exact Chapter 7 formula | Use one versioned formula, provisional maximum 3.05/person/song/week; lifetime save-event rule; corrections audited | Charts |
| REC-13 | Yaba/Surulere travel appears to create multiple local popularity counts | Each human has one selected virtual chart-affinity district/week; moving does not multiply chart votes | Charts |
| REC-14 | Player-created song vs uploaded professional song | Equal discovery/chart policy with identical permissions, qualification and anti-abuse | Media/Charts |
| REC-15 | Public room auto-play equals 20 streams | Exposure and audio broadcast do **not** equal verified human qualifying plays | Listening |
| REC-16 | Rich player or label buys ads, popularity or prizes | Purchased ads buy scarce display opportunity only. No chart priority/guaranteed listeners/awards control | Placement/Charts |
| REC-17 | Voluntary backing may imply passive finance career/real return | Only explicitly scoped permitted **fictional event** support; no investor class, guarantee, cash-out or off-platform investment | Economy/Event |
| REC-18 | Venue capacity 2,000–5,000 versus V1 browser performance | Large venues may exist as future catalogue/art; sell only tested concurrently deliverable event sessions, initially 20–50 | World/Event |
| REC-19 | Instant phone actions versus physical simulation | World objects anchor signature actions; phone offers status/repeat access; Desk route/transport creates travel; no automatic game completion | World/Desk |
| REC-20 | Need transport vs scope of driving simulation | Walk + boardable cab/shuttle at launch; owned drivable cars after proof of core fun/performance | World/Desk |
| REC-21 | Desk Bot may be confused with ordinary AI chatbot | Phase 1 deterministic complete; Phase 2 constrained cheap language adapter over the same verified actions; no agentic spending/signature | Desk |
| REC-22 | Lagos Life money and avatar assets implied portable | Own standalone 3D avatar, own currency; integrate only verified authorised external API | Platform/Identity |
| REC-23 | NPC activity improves atmosphere vs misleading business stats | NPCs are ambience/staff/city jobs only; no human-economic/statistical participation | World/Event/Charts |
| REC-24 | City jobs issue money while city sinks are later “recycled” | City issuance and fee retirement are explicit separate journals; never double count an implicit treasury | Ledger |
| REC-25 | Artist can host official listening party and “fan hosts listening party” | Ordinary permitted private/shared public song listening is allowed; only artist/authorised organiser can advertise **official artist event** | Event/Artist/Community |
| REC-26 | Failed company silently invalidates pending shows/artist commitments | Ownership lifecycle preserves paid holds, accepted obligations, refund rights and required assignment consent | Company/Contract/Event |
| REC-27 | Single client animation showing deal accepted without server funds | Acceptance and reservation are atomic/explicit; publish/perform requires funded and rights-valid authoritative states | Contract/Event |
| REC-28 | Personal music creates overlapping venue sound | Personal audio private, one authorised shared source per zone, Stage Mode takes relevant source priority | World/Audio |

### 32.1 Things deliberately **not** finalised by this Master

Player retention targets, chart qualification seconds, age rating, moderation staffing cost, independent-host feature permission, exact avatar/engine stack, actual SDK wallet availability, full legal IP licence language, anti-Sybil identity policy, provider contract terms, award vote categories, exact camera/transport timings, and server sizing need external review/prototype evidence. “We have 85 acceptance tests” in a source chapter means **design intentions to test**; it is not proof tests have been implemented or passed. Where user experience depends on an unapproved provider or law, prefer a smaller standalone version rather than a fake integration.

## 33. Delivery scope: prototype, private alpha, public V1, deferred

| System | First enjoyable vertical slice | Private-alpha target | Public V1 intention | Defer until proven useful |
| --- | --- | --- | --- | --- |
| World | One plaza, studio, Release Hall, 50-seat venue | Social zone, concise interiors, live group routing | Compact district polished and safe | Huge Lagos, user land plots |
| Artist music | One pre-cleared recording + simple song prototype | Import + loops/vocal in basic creator, rights moderation | Friday pipeline, collabs, artist profiles | Professional DAW, AI song generator |
| Listening/discovery | Opt-in Play/Save/Follow kiosk | Release wall, personal soundtrack, search | Lagos/district charts, correction process | Complex recommendation ML |
| Fan/social | Walk, emotes, group in same public room | DMs/friends/permissions, basic free lounge | Communities, memories, personal room | Voice chat, large guilds |
| Events | One 20-person free open mic with stage/audience | Verified tickets/refunds and 20–50-user paid concert | Templates, promoter/label/venue shows | Massive simultaneous festivals |
| Economy | Verified ₦0 start/free job, atomic ledger skeleton | Company/personal wallets, venue/artist/promoter holds | Contracts, event clearing, company failure/sale | Real cash economy, complex investment shares |
| Venue | One identifiable room, 24h hire | Operating lease + 1–2 installable gear types | Company bookings, reputation, insolvency | Land ownership, custom building |
| Label | Scout public artist from a shared wall | Small office, funded deal, project allocation | Three-artist roster, project waterfall, showcase | Staff hierarchy, global distribution royalties |
| Promoter | Physical poster placement and one campaign | Client campaign, basic evidence/payout | Agency + two campaign tracks/own show | Automated ad buying, fake reach forecasts |
| Desk | Phase 1 Today/Ask/map for existing actions | Refine coverage, actionable alternatives | Reliable cross-career Phase 1 | Phase 2 tiny LLM may ship after beta |
| Transport | Walking and route marker | Boardable city ride | Simple cab/shuttle | Personal car simulator |
| Awards | Placeholder recognised seasonal identity | Basic eligibility and historical records | One official quarterly event if event engine is stable | Giant real-time arena ceremony |

**Scope management rule:** A system named “V1” here expresses the intended design, not an order to implement all features simultaneously. Code must first demonstrate the **complete artist–fan–show interaction** with financially and rights-safe boundaries, then graduate to the rest. Do not introduce a prestige stadium, full car ownership or LLM dependency before music/social session quality is proven.

## 34. Dependency graph for engineering

```text
IDENTITY / AUTH / PERMISSIONS
  ├─ Avatar / mobile world / public lobby / presence
  │    ├─ physical studio, Release Hall, social spaces, travel
  │    ├─ venue property/interactable equipment
  │    └─ event stage and party presence
  ├─ Media ingest + rights + approved public catalogue
  │    ├─ creator/importer + contributor consent + Friday release
  │    ├─ personal/shared audio engine and listening evidence
  │    │    └─ chart snapshots + discovery + artist insights
  │    └─ event approved programme playback
  ├─ Ledger + grants/retirement + holds + transaction audit
  │    ├─ venue hire / company operations / supplier transactions
  │    ├─ contract and label artist funding
  │    ├─ tickets/refunds/event settlement
  │    └─ promoter fees/placements + event backing
  ├─ Social permissions / moderation / group routing
  │    ├─ fan communities and private contact
  │    └─ event presence, invites, memories
  └─ Desk Phase 1 reads all **completed** APIs via context gateway
       └─ optional Phase 2 tiny-LLM language adapter (not a dependency)
```

The diagram describes domain dependencies; sequencing may overlap across team members, but no consumer invents a stub financial promise and accidentally deploys it as real revenue. Fake/test assets and scripted test actors are valid in isolated QA environments **only**, explicitly labelled and never reflected as public human metrics.

---

# PART VIII — CODEX BUILD PLAN: ONE FUN GAME BEFORE TEN HUGE SYSTEMS

## 35. Milestones, demonstrations, dependencies and hard exit gates

Each milestone produces something a founder can *play and inspect on a staging URL*, not only a schema or presentation. Each includes tests, screenshots/short video of the actual UI, database migrations, feature flags, a rollback plan and unresolved blockers. The overall architecture is implementation-neutral, but developer handoffs must be concrete.

### Milestone M0 — Repository audit and technical proof

**Do:** Inspect repo and deployed environments; choose and record game engine/render layer by testing low/mid-tier mobile browsers; define asset licensing posture; initialise auth/identity, migrations, dev/staging/test env, versioned config, HTTPS, basic trusted server APIs and test harness for clocks/economy/rooms. Measure an animated avatar in one small 3D street with one usable door, mobile joystick/touch and browser audio unlock. Define 3D asset pipeline, texture budget, audio encoding strategy, reporting controls and capability assumptions.

**Demo:** Open staging URL on iPhone/Android, enter as new identity, move an avatar, interact with a labelled door, hear optional approved sound after user gesture; reconnect. **Exit:** No client-controlled admin/write paths; baseline mobile performance measured; no unsourced audio or copyrighted commercial artwork in distributable build; known risks recorded. Do not fabricate completed API/hosting accounts in Codex output.

### Milestone M1 — The free social heart

**Do:** Compact Music Square, one public listening kiosk, one social lounge corner, basic player presence with 5–20 real testers, proximity/chat/emotes, audio isolation, distinct personal/room sound and responsive virtual phone/map. Allow free explore, listen to an approved test work, save/follow, meet someone and leave/rejoin; safety tools at least basic mute/block/report. Implement truthful presence (NPC clearly ambience). No career selection at signup.

**Demo:** Fola, with ₦0, visits plaza, listens to a real rights-cleared artist track, saves it, meets a human, dances and chooses to go to a public show. **Exit:** 5- and 10-minute session doesn't need a paid action; people recognise where to go; chat moderation test; personal music never leaks into shared zone.

### Milestone M2 — Creator and release vertical slice

**Do:** One free beatmaker using legally approved loops, one approved real-song import pipeline, simple vocal capture/upload alternatives, secure media storage, transcode/preview, artwork/credits, collaborator permissions, moderation, Friday slot rules using test-controlled server time, physical Release House wall and public search/discovery. Implement song statuses and basic audience save/listen evidence but do not publish official charts until qualification is trustworthy.

**Demo:** Beginner makes a short playable song; real artist imports a cleared song; both schedule an official Friday premiere; fan hears them after release, not before; artwork appears on the wall. **Exit:** Same scoring eligibility regardless of production path; test artist can't publish two credited Friday songs; rights-restricted track isn't retrievable by old URL; mobile recording fallback works.

### Milestone M3 — Genuine little concert

**Do:** Unique 50-capacity venue identity, free event template, public event board, performer consent, stage/setlist, actual timeline-synchronised audio, doors, group entry, cheering/dancing, memory and real attendance. First event can be free to prove the social fantasy without prematurely building ticket economics. Show room occupancy truthfully; avoid fake audience on stage and low-population disillusionment. Implement a second session only after same-session guarantees are proved.

**Demo:** Ten real humans attend a free open mic featuring two user-supplied approved songs; a performer starts playback; fans emote, save songs and take away recorded event memories; show 10 checked-in humans, not room decorative figures. **Exit:** Reliable reconnect, sound sync within playtested tolerance, truthful attendance, no crash or unapproved content exposure. Before increasing cap, test supported hardware cohort with 20–50 real concurrent clients.

### Milestone M4 — Economy and paid event correctness

**Do:** Server-side double-entry ledger, starter city jobs, event quotes/reservation, one venue hire, ticket escrow/clearing, fixed ticket fee, full/partial refunds, artist guarantee hold, seller P&L, cancellation/reschedule and operator moderation. Instrument issuance/sinks and idempotency. Use deterministic seeded transactions to prove the same totals under retries, cancellation and partial technical failure. No player company feature until account ownership and protected-balance system is correct.

**Demo:** New player earns ₦1,000 from a verified short city job; another buys an actual concert ticket with game funds; ticket checked in once; a second user receives refund after a cancelled show; organiser sees correct settled revenue, fees and losses. **Exit:** Zero double-spend, refunds in all supported paths, one event settlement, no ticket sales beyond tested capacity, no invisible city money issuance.

### Milestone M5 — Venue ownership and a working business

**Do:** Business registry and uniqueness constraints, venue 7-day operating lease and one flagship property, physically install/remove at least two types of equipment, operator booking calendar, one paid client event and company account with revenue/expense separation. Introductory failure/closure route; one completed responsible sale transaction may be alpha-tested behind a flag before public sale is offered. Financial quotes consistent with test config.

**Demo:** Amaka forms venue business, leases The Basement, installs lights, hosts or rents out one show, earns income or incurs actual lease loss; another player attempting to book same interval fails cleanly. **Exit:** No double calendar rights, no unpaid phantom bookings, no double self-hire lease, company closing cannot erase an accepted event/refund.

### Milestone M6 — Promotion, label contracts and creator commerce

**Do:** Freelancer posts a finite approved ad and accepts one scoped client contract; promoter evidence reports exposure versus real listening. Label owner scouts, signs one artist, reserves funding, artist spends approved budget and label correctly recoups *one* named eligible covered project. Basic producer beat-sale licensing; one programme where venue, artist, label and promoter all interact. Add agency formation after freelance loop proves worthwhile. Support the three-artist max before allowing >1 artist agreements publicly.

**Demo:** Kemi signs a funded, revocable-with-remedies label deal; Ada promotes her specific release; Amaka hosts a label-financed eligible artist show; fan buys ticket; each balance and public audience count has a unique traceable origin. **Exit:** No double project receipts, cross-recoup, unsigned expenses, unfunded fees, or sponsor-created fake plays; missing performer consent blocks confirmation.

### Milestone M7 — Release-Friday culture, charts and resilient operations

**Do:** Verified per-human playback qualification, score engine and capped contribution, district-affinity rules, Friday chart snapshots/corrections, creator public insights, unsponsored emerging discovery, abuse-review console, mature notifications, community permissions and all meaningful rights/escrow recovery tools. Expand event templates and official quarterly awards only when underlying eligibility/attendance systems are stable. Full 7-day simulated calendar test across multiple personas.

**Demo:** Dami's amateur loop song and Kemi's studio-recorded song reach the same board; scores derive solely from qualified human engagement; one paid ad with no listeners gets zero points; fraud/copyright correction leaves an audit. **Exit:** Repeatable ranking and reconciled journal; chart cap exact; under-population discovery works; no ability to “buy” a chart win.

### Milestone M8 — Desk Phase 1 (non-LLM) across delivered features

**Do:** Action registry, context gateway, Today/Ask Desk/My Plans, map routing and physically boardable ride, up to three personalised suggestions, server action revalidation and quiet modes. Desk should be built as a thin wrapper once M1–M4 action/service APIs are stable; some sections can appear incrementally earlier. No autonomous commits. Give users “not now” and alternative paths. Instrument action completion rather than messages sent.

**Demo:** Fola asks where tonight's free music is; Desk routes her through the city; Kemi asks about missed Friday submission; Amaka sees honest loss warning; David sees funded obligation; none is teleported into a show or financially committed. **Exit:** Phase 1 remains fully functional with no LLM API key; negative tests for expired data, blocked people, money restrictions and player override. Validate the feature *helps* rather than over-directs.

### Milestone M9 — Optional Desk Phase 2 and sensible expansion

**Do:** Only when Phase 1 is working, attach a tiny language model behind short prompt, budget, schema and timeout rules; verify identical action/price/permission outputs. Measure cost, latency, perceived usefulness and failure modes in staged A/B testing. If poor, keep Phase 1 and ship music/game improvements instead. Owned cars, large district geography, complex awards and giant concerts remain separate **future** milestones, not part of the prerequisite chain.

**Demo:** User types “Can I afford a small show next Friday and how do I get there?”; language layer resolves intent; server provides actually correct quotes/options; player chooses route, then later signs booking separately. Disable model service mid-call and show same Phase 1 option cards. **Exit:** No invented entities or financial actions, prompt-injection tests pass, affordable provider budget and optional feature flag rollback.

### 35.1 Build order is about evidence, not waterfall bureaucracy

M0 identity, core database and toolchain precede persistent transactions; M1 fun social world + M2 musical creation precede content-scale investment; M3 actual show validates social event; M4 transactional economy precedes paid event/businesses. Charts need honest listening evidence; labels need an economy and music library; promoters need scarce placements and genuine discovery, so avoid implementing their “business dashboards” before those mechanics. Desk Phase 1 can begin early with static guidance but should claim contextual intelligence only when the underlying services are live. Every milestone provides playable work, testing and feedback; overlapping branches must use stable service interfaces and feature flags.

## 36. The one vertical-slice acceptance story (full cross-system)

**Test population:** Seven named humans or controlled consenting tester accounts with distinct identities; a shared staging database; 5–20 supporting real humans during the concert; zero fabricated NPC fan metrics; server time advanced deterministically in non-public QA only.

1. Fola joins at ₦0, enters Music Square, saves a legitimate song, meets someone and accesses a free job.
2. Dami builds a deliberately amateur song from approved loops, and Kemi imports an actually rights-cleared real-world recording.
3. Kemi uses the physical release stations and Friday eligibility; Dami independently submits, proving equal entry routes.
4. Ada creates one bounded advertising campaign using an actual available public poster slot; artwork appears in the world, and click/qualifying listen are distinct.
5. David visits a label listening room, listens to Kemi's released song, obtains her consent to discuss an offer and reserves a funded, signed artist project.
6. Amaka registers a venue company, obtains a unique paid operating lease and installs visible compatible equipment without exceeding one owned company.
7. Kemi organises an authorised small concert in Amaka's venue, with David's project covering a valid named eligible show and Ada paid as promoter vendor. Every payer/source is declared once.
8. Fans inspect the truthful programme, buy reserved tickets where applicable, travel physically through the city, validate them at the door and see an actual Stage Mode performance.
9. The event records sold tickets separately from checked-in humans; Fola earns an actual attended memory. No NPC attendee, poster view or unplayed room speaker becomes a stream.
10. Event settles once; ticket service fee calculated on retained gross, artist/venue/promoter correct payments and label project attribution recoups once. Re-run the worker and get the **same balances**.
11. The following chart window and announcement reflect only qualified eligible listening, including Dami's amateur song under the exact same rule as Kemi's uploaded track.
12. Desk gives each human relevant choices and route directions, never makes a deal, travels, spends money or chooses artists on their behalf. If the optional LLM is disabled, the same Phase 1 actions remain usable.

**Failure replay:** Repeat with simultaneous ticket-buy race, disabled audio, Kemi rights revocation, Saturday no-show, network disconnect during door entry, cancelled event, company sale while future bookings exist, expired poster contract, duplicate provider webhook, duplicate settlement call, blocked invitation and model outage. No phantom cash, double tickets, erased receipts or unacknowledged affected fan follows.

---

# PART IX — VALIDATION, OPERATIONS AND SIGN-OFF

## 37. Shared acceptance tests for the Master (code must prove these)

The source chapter test suites remain normative within their respective domains. These **master integration tests** catch failures that isolated implementations miss. Test IDs are stable handoff IDs; each must be automated or manually documented as an explicit pre-launch gate. Do not mark “PASS” because a spec contains the test.

### Identity, H-Path and company ownership

| ID | Given / action | Required assertion |
| --- | --- | --- |
| GDD-001 | New user arrives with no chosen job | Can explore, listen and interact without career selection. |
| GDD-002 | Artist owns venue company | Can release music and be a fan without losing company ownership. |
| GDD-003 | Active venue-company owner starts label formation | Request rejected with clear one-company reason; no fee charged. |
| GDD-004 | Two simultaneous create-company requests | At most one succeeds; money debited once. |
| GDD-005 | Promoter freelancer owns another company | May only perform permitted personal service; cannot create second registered agency. |
| GDD-006 | Sell company with unfunded liability | Sale blocked or obligation lawfully assumed with required party consent; no vanishing funds. |

### Content, releases and discovery

| ID | Given / action | Required assertion |
| --- | --- | --- |
| GDD-007 | Amateur loop song + uploaded master both rights-valid | Identical chart scoring policy; discovery can expose both. |
| GDD-008 | Unlicensed sample or missing performer consent | Work never reaches public media or official release. |
| GDD-009 | Wednesday 18:00 deadline missed | Next valid Friday is shown; no off-schedule release. |
| GDD-010 | Artist performs as featured credit on approved Friday release | Second performer-credit release same week blocked/rescheduled. |
| GDD-011 | Friday batch retried three times | One published song ID and one public premiere; no duplicate notifications. |
| GDD-012 | Rights case removes song while room is playing it | Public playback blocked/fallback, cached asset access invalidated. |
| GDD-013 | Fan opens a poster but never plays song | Exposure recorded but no qualified listen/chart points. |
| GDD-014 | One listener replays 100 times and repeatedly un/saves | Weekly score ≤3.05 and lifetime save bonus at most once. |
| GDD-015 | Fan moves between districts in same week | At most one home-district attribution and one Lagos-wide contribution. |
| GDD-016 | Sponsor pays premium for advertisement | Advertiser gets placement evidence only, never direct score/ticket sale. |
| GDD-017 | Two identical final chart builds from same evidence/version | Exact rank/score equality or logged integrity correction. |

### Event, presence, money and consent

| ID | Given / action | Required assertion |
| --- | --- | --- |
| GDD-018 | Two organisers reserve same unique venue-day concurrently | Only one exclusive entitlement confirmed. |
| GDD-019 | Venue operator hosts within funded lease | No additional self-hire city rent debit. |
| GDD-020 | 35 paid tickets, 24 check-ins | Report 35 sold and 24 human attendees, no conversion of NPCs into humans. |
| GDD-021 | Ticket pool exhausted | New sales rejected atomically; no hidden replicated oversell. |
| GDD-022 | Buyer refreshes or reconnects at door | One valid check-in, one paid entitlement, reentry policy respected. |
| GDD-023 | Failed network call after transfer commit | Retried idempotency key produces same journal/receipt, no double charge. |
| GDD-024 | Fully refunded ticket | Refund original full amount and zero retained service fee. |
| GDD-025 | ₦1,000 ticket with 50% valid refund | Buyer ₦500, test fee ₦15, organiser proceeds ₦485. |
| GDD-026 | ₦18,000 planned cost, ₦1,000 ticket at 3% | Correct full-price break-even = 19 tickets, subject to actual permitted capacity. |
| GDD-027 | Artist guarantee reserved before advertised confirmation | Funds protected, artist's consent logged and venue event publishes only if ready. |
| GDD-028 | Cancel a paid event with tickets held | Refund flow and obligations execute; no presale available for owner withdrawal. |
| GDD-029 | Artist absent when stage slot begins | Apply disclosed no-show/fallback path; never fabricate human performance. |
| GDD-030 | Venue business insolvent during paid future show | Existing show/refund rights preserved; organiser and buyers notified. |
| GDD-031 | Label finances named artist-organised show | Event tickets attributed to exactly one artist-project waterfall. |
| GDD-032 | Label organises distinct showcase | Showcase business P&L excludes same ticket receipts from covered artist project. |
| GDD-033 | Promoter paid flat fee and separately acts as organiser | Independent roles only when explicitly scoped; no secret duplicate proceeds. |
| GDD-034 | Player's book balance equals reserved commitments | Available balance is zero; new purchase declined, active commitments remain. |
| GDD-035 | Event settlement worker runs twice after crash | One settlement result and one set of financial journal entries. |
| GDD-036 | A city job is completed legitimately | Explicit authorised issuance, budget/cooldown count and unique payout. |
| GDD-037 | Player attempts 4th starter job in 24h | Cap enforced with no payout and clear wait explanation. |

### Social, mobility and Desk

| ID | Given / action | Required assertion |
| --- | --- | --- |
| GDD-038 | Fan with ₦0 requests event recommendations | Actual free events/locations offered when available, no compulsory spend. |
| GDD-039 | Blocked person asks Desk for player's private location | No restricted presence, DM or join route disclosed. |
| GDD-040 | Four friends route to ticketed show with two free places | Capacity conflict disclosed; no fake two tickets or stealth split. |
| GDD-041 | One user plays private soundtrack next to shared speaker | Other users hear only authorised shared source. |
| GDD-042 | Desk suggests closed job after its state expires | Final activation revalidates and shows honest alternative. |
| GDD-043 | Desk quotes venue hire and player declines | No balance change or booking; route alone carries no commitment. |
| GDD-044 | Desk Phase 1 with all LLM credentials removed | Today, Ask help, Next Moves and route map fully usable. |
| GDD-045 | Phase 2 model outputs made-up event, price, wallet value | Server rejects or replaces with trusted snapshot; no game write. |
| GDD-046 | Model service times out | Phase 1 fallback and normal game remain functional. |
| GDD-047 | Song title contains malicious prompt-injection text | Treated as inert catalogue string; no instruction execution. |
| GDD-048 | User navigating/driving/performing | Desk notifications quiet/suppressed per policy; safety notice still valid. |
| GDD-049 | No money for optional cab | Free practical path remains; show travel mode choice. |
| GDD-050 | Player leaves game while concert is in progress | Reconnect follows entitlement and timeline; no cloned attendance or free entry. |

### Moderation, operations and recovery

| ID | Given / action | Required assertion |
| --- | --- | --- |
| GDD-051 | Rights takedown during chart window | Disallow new plays, preserve evidence and issue transparent correction/review. |
| GDD-052 | Music file upload aborted midway | No public incomplete asset; retry/recovery doesn't multiply works. |
| GDD-053 | Outbox consumer offline 15 minutes | Replay recovers projections exactly once without losing authoritative mutation. |
| GDD-054 | Backup restored in rehearsal | Contracts/ledger/events/chart history reconcile to accepted recovery target. |
| GDD-055 | Moderator blocks abusive DM actor | Messages/invites/Desk social referrals stop without letting actor bypass via group. |
| GDD-056 | Admin changes fee policy | New quotes use new version, already signed ticket/contract terms remain. |
| GDD-057 | Event rights revoked 5 minutes before doors | Honest cancellation/hold and ticket remedy, never unsafe show playback. |
| GDD-058 | Two administrators apply same refund adjustment | One original refund, second idempotent no-op or audited explicit second remedy. |
| GDD-059 | Low-end device joins fully occupied venue | Client shows genuine full/wait status; no unsupported room join or silent false ticket. |
| GDD-060 | Player deletes account or requests privacy handling | Published retention and legal obligations respected; unrelated people's completed contracts remain auditable with minimised identity exposure. |

## 38. Playtesting protocol and go/no-go thresholds

**Avoid pretending that proposed thresholds have been achieved.** Use the following as initial targets [D] and record the actual data by device/network and player cohort. Prefer genuine behavioural evidence over founder intuition.

| Test | Initial target / release condition | Test design |
| --- | --- | --- |
| Five-minute fun | Most new testers can voluntarily find one enjoyable activity without mandatory signup tutorial outside game | 5, 10, 20-minute observation and post-session interview |
| Mobile usability | All core actions can be completed on a supported small phone without hidden controls or modal dead-ends | Small-screen and touch matrix, screen reader / large text |
| Audio control | Personal/room/event sounds never unintentionally overlap; explicit unlock works | iOS Safari, Android Chrome, muted and lost-focus cases |
| World density | 5–10 real players can socialise in one compact hub without feeling like a deserted huge map | Controlled low-population play sessions |
| Music creator | Beginners can produce a playable short song while professional artist can upload one authorised recording | User test novice, real artist and accessibility participant |
| Genuine live show | 10-person show fun; 20–50 players only after network/device load tests | Human QA, video/delay instrumentation, disconnects |
| Ledger integrity | **Zero** known double spend, money creation via duplicate transfer or incorrect paid refund in staged adversarial suite | Deterministic simulation + fuzz/concurrent stress |
| Chart integrity | Frozen snapshot reproducible; repeated/fraudulent playback cannot dominate | Seeded integrity fixtures and manual trust review |
| Business gameplay | Company owner has at least one satisfying 5-, 20- and 60-minute experience that is not form administration | Playtest owners, first-time and repeat operators |
| Desk helpfulness | Users who select guidance reach the intended real object/action; ignoring it has no progression penalty | Parallel cohorts and observation; report wrong-card rate |
| Content safety | Rights takedown, harassment block, child/age policy and appeals test paths functional | Moderator rehearsals and tabletop scenarios |
| Production operations | Backup restore, release-scheduler repeat, venue lock race and event cancel/refund all demonstrated | Recorded rehearsal report with owners |

**Quantitative goals:** Choose specific targets for activation, D1/D7 retention, completed musical actions, public-event join conversion, creator-to-listener balance, median onboarding time, browser FPS/crash rate, peak audio drift, contract failure/recovery latency and external model call costs *after early instrumentation gives a baseline*. Do not invent “95% retention” as a launch guarantee. Report both attention and enjoyment (e.g. “would you return even without a payout?”) to avoid an economy-driven fake engagement trap.

## 39. Seven-day shared-world simulation: one week worth returning for

This scenario is an **illustrative design stress test**, not a claim that the game has been run live.

| Day | Music/social life | Businesses and contracts | What Desk can assist without doing |
| --- | --- | --- | --- |
| Monday | Fola explores with no cash; Dami builds a basic beat | Amaka considers leasing an empty 50-seat venue; Ada explores city poster inventory | Suggest free studio/jobs, show available venue quote, route to board |
| Tuesday | Fans save songs and make friends; Kemi imports an authorised master | David scouts real artists, label contact begins; equipment is inspected | Show application and legal rights prerequisites; alternatives |
| Wednesday | Submission rush before 18:00 WAT | Kemi sends approved credits; label submits clearly funded offer, artist reviews | Deadline reminder and explanation, no auto-submit or auto-sign |
| Thursday | Release Hall anticipates Friday; small social meetup | Promoter books a real poster slot; venue lines up a free open mic | Surface incomplete event needs, true booked placement |
| Friday | 18:30 chart reveal; 19:00 approved songs appear; fans listen | Artist discovers actual human response; new offers become possible | Show release and chart facts; suggest performances, don't guarantee fans |
| Saturday | Friends travel to The Basement; Kemi performs; real audience reacts | Amaka hosts show; Ada campaign delivers; David sees career development and cost | Route, explain event readiness, never override fan choice or ticket cap |
| Sunday | Verified memories, playlists, friendships; players return | Event resolves fees/refunds and project eligible receipts; venues evaluate loss/profit | Explain P&L and next options; don't command reinvestment |

**Across all seven days:** A person who prefers merely to dance and listen should have enough reason to return. A maker can create something without waiting for a wealthy label. A label cannot make an artist successful by unilateral budget allocation. A promoter's effort is visible to people in the world but not mistaken for streams. A venue owner must cultivate demand. Most importantly, the same fans and songs create the cultural thread across these businesses.

## 40. Operational runbooks for first public test

**Required on-call scenarios:** Service unavailable at Friday premiere; chart freeze job delayed; failed song transcode; copyright claimant submits urgent takedown; promoter poster shows abusive content; duplicated ticket webhook; organiser disconnects after opening song; full/partial refund during server restart; outbox stopped; lagging wallet reservation; abusive or blocked player trying to follow a friend into private instance; starter job payout exploit; LLM over-budget or incorrectly quoting a price. Each runbook identifies triage owner, human-facing status, money/content containment, technical rollback/replay, audit action and what is communicated afterward.

**Release Friday incident posture:** A work cannot become playable before permissions; if media processing is late, show `DELAYED` with next step rather than pretending it premiered. If charts need integrity correction, publish a provisional/delayed status; do not quietly alter winner names. Keep calendar revision and publish-job idempotency; admin rerun cannot make duplicate releases, notifications, chart score or event awards.

**Financial incident posture:** Freeze risky new commitments while preserving legitimate existing balances and protected refunds; expose read-only receipts; reconcile against immutable journal; don't manually overwrite user wallets. Event cancellation must still run when company becomes insolvent or server is recovering. Support staff should never promise off-platform financial redemption.

**Safety incident posture:** Suspend harmful chat/ads/song/venue content; preserve evidence within policy; restrict player targeting; notify affected users where necessary; provide appeal/report trace. Broadcast safety notices must not be spoofable by a normal company user or an LLM output. Define escalation for threats involving real-world safety before launch.

**Monitoring and ownership:** Error traces by subsystem, server and client exception reports, audio buffer failure, realtime-room occupancy, asset delivery failures, stuck holds/overdue refunds, duplicate-operation rejections, unsupported hardware profiles, song-moderation backlog, social report volumes, job issuance budgets and Desk wrong-suggestion counts. Logs should use stable aggregate IDs and scrubbed personal identifiers; content/body logs only where necessary and controlled.

## 41. Risks, countermeasures and stop conditions

| Risk | Observable symptom | Containment / next decision |
| --- | --- | --- |
| Empty-world syndrome | Users leave in 2 minutes without meeting/doing anything | Shrink playable geography, concentrate social events, improve music object interactions |
| Music rights unresolved | Takedown complaints, licence gaps, copyrighted loops in kit | Pause affected content and public uploads until review/rights agreements work |
| Game is just forms | Business users spend more time reading modal dialogs than performing | Move key tasks to physical objects, shorten checkout, drop unnecessary careers |
| Expensive 3D on mobile | Low FPS/crash, overheating, input lag | Lower asset budgets, simplify world, postpone cars/giant stages |
| Fake-human economy | High chart/sales numbers but no identifiable real-human evidence | Rebuild evidence chain; disable affected leaderboard/paid product |
| Broken reservations | Negative available funds, duplicate tickets, unpaid guarantees | Halt high-risk transactions, restore from journal, block public money release |
| Pay-to-win reach | Rich campaigns dominate all organic surfaces | Separate organic inventory and labelled ads, anti-monopoly slot limits |
| Desk feels intrusive/overpowered | Users simply follow perfect answers or stop exploring | Reduce pushes, offer genuine options, retain uncertainty, measure fun |
| Model hallucinates | Invented events, balances or deals | Schema and server whitelist, Phase 1 fallback, provider kill switch |
| Low adoption for business speciality | No client work, companies lose money with no meaningful decisions | Consolidate systems or NPC baseline utility without fake demand; playtest before expanding |
| Venue scarcity blocks creators | All eligible property blocks owned by wealthy operator | Fair cataloguing/lease expiry, usable free community slots, anti-hoarding conditions |
| Safety/moderation backlog | Harassment or illegal/unauthorised uploads persist | Throttle access, moderation staffing, stricter age/privacy defaults |
| Platform integration assumption | Feature built using unsupported wallet/avatar SDK | Remain standalone and use adapter only after official approval |
| Award ceremony premature | Few spectators, unreliable audio/event sync | Smaller ceremonial format, recorded public history; delay giant production |

**Stop-ship conditions:** Unresolved user-content rights policy; children/safety risk without controls; confirmed double spend or incorrect refunds; chart can be trivially farmed with NPC/duplicate account activity; public capacity lies about actual participation; social block can be bypassed; release master leaks before embargo; undisclosed direct paid chart weighting; claimed off-platform wallet transfer without authorisation. These outweigh a scheduled promotional launch date.

## 42. Open questions requiring founder and specialist approval

| Open question | Default planning posture | Owner / decision gate |
| --- | --- | --- |
| What precise age cohort is permitted at launch? | Do not open unrestricted DMs/UGC until legal/Trust review | Founder + Trust/legal [X] |
| Exact asset licensing/loop pack and music-use terms? | Use demonstrably cleared prototype tracks only | Rights/legal + audio [X] |
| Which rendering/multiplayer stack works on target phones? | Benchmark two pragmatic options in M0 | Tech lead [D] |
| Exact playback qualification threshold? | Versioned design configurable; no chart until evidence integrity proven | Music/Trust lead [D] |
| Starter faucet/job cap and business prices? | Use disclosed defaults and tune on real economic stress tests | Economy lead [D] |
| Show capacity and supported phone cohort? | Start small; sell no ticket beyond proven concurrent session support | Realtime lead [D] |
| Delivery/settlement/refund deadlines? | Publish clear policy and implement before paid sales | Economy/Trust/legal [X/D] |
| Artist-label project split bounds and recoup edge cases? | Current contract baseline; inspect with actual artists/testers | Founder + economy [D] |
| What qualifies for Destiny Awards? | Recognition/event identity fixed; category/vote mechanics need approval | Founder + Trust [D] |
| Can permitted Lagos Life SDK features be integrated? | No unapproved money/avatar assumptions | Platform owner [X] |
| Should player-owned driving launch? | No; walk+cabs first, review after M3/M8 evidence | Founder + engineering [F] |
| Is Desk Phase 2 worth adding at launch? | No dependency; run cheap-model A/B after Phase 1 succeeds | Founder/product [D] |
| World marketing and OrderSounds attribution terms? | In-game value first, optional product link with consent and platform permission | Founder + platform/legal [X] |

## 43. Source-chapter reference and traceability index

This Master is intentionally a **reconciled core**, not a deletion of the deeper chapters. The following exact files (and their accompanying Word versions) form the detailed requirements library in the current project. In engineering PR descriptions, cite the Master ID first and the relevant specialised file/section next.

| Source | Purpose and usage |
| --- | --- |
| `THE_SCENE_HPATH_Architecture_Amendment_v0.2.md` | Identity, company taxonomy and precedence from founder revision |
| `THE_SCENE_Venue_Operator_Foundation_v0.3.md` | Venue tiers, leases, equipment, business failure and operator play |
| `THE_SCENE_Artist_Career_Foundation_v0.4.md` | Creation tools, content consent, Release House, performances and artist independence |
| `THE_SCENE_Record_Label_Career_Spec_v1.0.md` | Label roster, short funded contracts, protected artist project waterfall |
| `THE_SCENE_Promoter_Career_and_Agency_Spec_v1.0.md` | Freelance/agency promotion, campaign evidence, physical advertising and fees |
| `THE_SCENE_Fan_and_Social_Experience_Spec_v1.0.md` | Fan life, chat/group controls, audio rules, attendance and memories |
| `THE_SCENE_Concerts_and_Shared_Events_Spec_v1.0.md` | Unique event day, show templates, performer guarantees, capacity/refunds/settlement |
| `THE_SCENE_Music_Discovery_and_Charts_Spec_v1.0.md` | Friday release truth, chart formula, district attribution and anti-fraud |
| `THE_SCENE_Economy_and_Contracts_Spec_v1.0.md` | Currency issuance, holds, ledger, commercial obligations, insolvency and economics |
| `THE_SCENE_World_NPCs_and_Operations_Spec_v1.0.md` | City topology, 3D interactions, authentic presence, NPC operations and world health |
| `THE_SCENE_Desk_Bot_Player_Intelligence_and_Navigation_Spec_v1.0.md` | Phase 1 non-LLM, Phase 2 language adapter, next moves, route and transport |
| `THE_SCENE_HPATH_Player_Interaction_Matrix_v0.1.md` | Historical interaction map, superseded only for obsolete exclusive-class assumptions |
| `THE_SCENE_Stage_2_Seven_Day_Career_Simulation_v0.2.md` | Historical seven-day story and cross-role edge-case fixture |

### Engineering artefacts to produce immediately after this Master

**A. Repo/hosting audit:** Current branch, deploy target, tested version, assets, connectivity, missing credentials and permissions, actual SDK constraints. **B. Architecture decision records:** rendering engine, backend/runtime/realtime, media/CDN, SQL/ledger, job/outbox scheduling, privacy/legal gates. **C. Milestone issue tree:** Each M0–M9 item split into testable PR-sized tasks with owner, schema/API acceptance and visible staging demo. **D. Shared balance config:** One version-controlled set of venue prices, ticket fee, starter payouts, label funding, chart score, chart windows and server time. **E. Test data/harness:** Seed Fola, Dami, Kemi, Ada, Amaka, David and fans with legal test audio and predictable clocks, without injecting test views into public charts. **F. Operations baseline:** Moderation console, system health, incident ownership, disaster recovery and player-facing support policy.

**The first instruction to an implementing agent should be:** “Audit the existing code and deployment first; do not rewrite an existing working project. Reconcile with Master TS-GDD-MASTER-001. Identify what is already present, what can be reused, what conflicts with these invariants and what specific M0–M1 tests still fail. Propose the smallest playable vertical-slice PRs with links to staging. Do not claim implementation or push success without actual tool evidence.”

---

# FINAL DESIGN SIGN-OFF

**What is settled:** A compact playable multiplayer music city; one person, many activities, one company; three company types; accessible real music and free music creation; a protected Friday premiere; real-person charts, fandom and shows; one accountable event organiser; honest simulated currency with explicit issuance and protected obligations; physical venues and simple travel; Desk Bot Phase 1 entirely without an LLM and Phase 2 only as a bounded optional language layer.

**What is not yet proven:** That the current code implements any of this, that the economy is properly balanced, that audio/network sync works with 50 people on common mobile devices, that music licences and age restrictions are approved, or that external platform wallet/avatar integration exists. Those are implementation, playtesting and approval gates, not design milestones that can be declared complete by writing a specification.

**Core success criterion:** Put a handful of real players in a small, beautiful, functional music district. Let one make or release a track; let another discover and enjoy it; let friends actually attend an entertaining performance; let a business player make a meaningful choice with consequences; let Desk guide someone who is lost without making their decisions. If those experiences generate voluntary return visits, expand carefully. If they do not, improve the moment-to-moment game before adding more careers or infrastructure.

**END — TS-GDD-MASTER-001 v1.0**
