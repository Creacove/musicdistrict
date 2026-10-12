# THE SCENE
## Chapter 6 — Concerts & Shared Events: Standalone V1 Game Design and System Specification

**Version:** 1.0  
**Date:** 12 October 2026  
**Document owner:** THE SCENE game design  
**Status:** Founder-aligned working implementation baseline; event-specific defaults resolved here, numerical settings still subject to playtesting  
**Scope:** All scheduled live and listening events, organisers, unique venues, performer contracts, preparation, physical performance, public attendance, real-time synchronisation, ticketing, funding, settlement, cancellations, safety, awards, operational acceptance tests  
**Previous chapters:** H-Path Architecture v0.2; Venue Operator v0.3; Artist v0.4; Record Label v1.0; Promoter v1.0; Fan & Social v1.0  
**Following chapters:** Music Discovery & Charts; Economy & Contracts; World, NPCs & Operations

> **The design objective:** A real human organises an event in an identifiable place, real performers bring cleared music, real people choose to attend and participate, and every party sees honest artistic, social and financial consequences. An event is a playable shared memory, not a menu transaction or a crowd-simulation trick.

## Reading guide and rule precedence

- **[C] Confirmed:** Explicit founder direction or locked cross-chapter rule. Do not change without a written revision.
- **[D] Design baseline:** A specific, internally consistent V1 rule resolved by this chapter so implementation is actionable. It is recommended and configurable, not represented as already playtested or personally founder-approved.
- **[X] External dependency:** Platform permission, rights, legal/privacy review, third-party processing, server or device capability must be established separately.
- **[F] Future:** Deliberately not required for first playable V1.
- The newest explicit founder direction outranks older assumptions. This chapter is the **single source of truth for event lifecycles, show-day responsibilities, public ticket entitlements and event settlement semantics**. The Venue chapter owns unique properties and base rents; Artist owns release rights; Label owns artist-project contract recoupment; Promoter owns advertisement delivery; Fan chapter owns personal social permissions. Shared Economy will implement the common ledger without inventing a different event policy.
- Currency amounts throughout are **THE SCENE's standalone simulation naira**, not real money, not cash-redeemable, not automatically transferable to or from Lagos Life. The game's displayed ₦ symbol is an internal unit. If this presentation risks misleading players, onboarding must explicitly label it **Game ₦**.

## 1. Locked principles and design decision register

| ID | Rule | Classification |
| --- | --- | --- |
| EVT-01 | Every player is an avatar first, can be a fan, and can own at most one registered company at a time. Organising one event is an **activity**, not a new company class. | [C] |
| EVT-02 | Eligible organisers include artists, promoters, venue operators, labels and ordinary players; a guest performer and a voluntary backer do not become the organiser merely by participating. | [C] |
| EVT-03 | **One human or company is the financially responsible organiser of record** for each event; one project settlement path. | [C/D] |
| EVT-04 | Public venues have unique persistent identities, a shared calendar and prebuilt structures, with basic usable equipment. | [C] |
| EVT-05 | Short event hire and renewable operating lease are different products; the lessee may rent event blocks to others under explicit booking rights. | [C] |
| EVT-06 | The V1 booking unit is **one published 24-hour venue-use block** and one independent publicly ticketed headline event within that block; opening acts are parts of the same show. | [C/D] |
| EVT-07 | No fake paying attendees, artificial followers, phantom streams or NPC ticket purchases; ambient NPCs are scenery only. | [C] |
| EVT-08 | Artists perform approved recordings through accessible avatar Stage Mode; authorised previews remain subject to Release Friday embargo. | [C] |
| EVT-09 | Any player can attend eligible free events, discover music, dance, save tracks, follow artists and retain valid memories. | [C] |
| EVT-10 | A fan cannot announce a listening party falsely presented as officially authorised by an artist. | [C] |
| EVT-11 | Purchased tickets are limited by both real venue capacity and actual safely supported shared-session capacity; no hidden duplicate audience. | [C/D] |
| EVT-12 | Earnings and losses are real ledger outcomes: no negative wallets by surprise, no double venue rent, no double label recoupment and no unlimited fake concert profit. | [C] |
| EVT-13 | Quarterly **Destiny Awards** is the official prestigious industry ceremony; players may create bigger private events, but cannot impersonate the official awards. | [C] |
| EVT-14 | Event creation, preparation and attendance should be **physical-first** in the 3D world, with efficient mobile-phone shortcuts and accessibility alternatives. | [C/D] |
| EVT-15 | The V1 default event operating day is **06:00 WAT until 05:59:59 WAT the next calendar day**, identified by its starting date; a late-night concert may cross midnight. | [D] |
| EVT-16 | Ticket funds are held by the shared event ledger pending delivery/refunds, not immediately available to organiser spending. Supplier guarantees and show costs are pre-funded. | [D] |
| EVT-17 | V1 initial live performance target is **20–50 actual players in one shared event session**; larger public venue art is not permission to sell thousands of tickets. | [D] |
| EVT-18 | Native Lagos Life wallet transfers, company balances, ticket settlements or 3D avatar import must not be claimed without an authorised API. | [X] |

## 2. The actual player fantasy

The central loop is **DISCOVER OPPORTUNITY → COMMIT TO A SHOW → PREPARE → INVITE → MEET IN THE WORLD → PERFORM / PARTICIPATE → SETTLE → REMEMBER**.

A 20-minute visit should be enough to attend a small open mic or create a reasonable event draft. A player who has an hour can inspect a venue, arrange a lineup, configure production, publish tickets and begin promotion; another can spend that hour socialising at a concert. No one is forced to be a professional event organiser. Showing up to dance with friends is a complete play experience. A label owner watching an artist they financed, a venue operator checking their upgraded lights and a promoter seeing their first genuine attendee all have distinct reasons to be present at the *same* event.

There are two interlocking modes:

1. **Prepare and run** — event organiser, performers, suppliers, host/venue operator and promoter have agency, risk and recognition.
2. **Attend and enjoy** — fans, friends, artists and business owners receive listening, movement, conversation, social reactions, music collections and persistent memories.

V1 cannot be dependent on 200 concurrent players. A six-person public listening session, a 15-person open mic and a 35-person headline show must each be enjoyable on its own merits.

## 3. Event catalogue and eligibility

| Template ID | Typical format | Who can create | Performer/rights conditions | Admission | V1 default |
| --- | --- | --- | --- | --- | --- |
| `OPEN_MIC` | Multiple short sets; emerging artists | Venue operator, promoter, label, eligible individual | Each performer consents; approved released songs or limited preview permission | Free or paid | Up to 6 acts; 2 songs/act |
| `TALENT_HUNT` | Applications and selected performers; transparent rules | Venue operator, label, promoter | Applicant opt-in; private demos only to eligible selectors before release | Free or paid | 3–6 final acts |
| `HEADLINE_CONCERT` | Headliner, optional opening/guest sets | Artist or any eligible organiser | Headliner must accept a confirmed appearance; guest billed truthfully | Free or paid | 1 headliner + up to 2 support slots |
| `LABEL_SHOWCASE` | Label-programmed multi-artist experience | Label owner | Each roster or guest performer confirms; label is organiser | Free or paid | Up to 6 acts |
| `DISCOVERY_NIGHT` | Label scouting plus performances | Label, venue operator, promoter | Public audition application and appropriate consent | Usually free | 3–6 acts |
| `LISTENING_SESSION` | Hosted approved tracks, little/no stage act | Artist or expressly authorised organiser; public city sessions only with already-released catalogue | Individual song/programme permissions; no leaked unreleased full song | Usually free | 15–30 min |
| `RELEASE_CELEBRATION` | Social gathering tied to approved release | Releasing artist or authorised organiser | Track public at start, or before-release only an approved excerpt | Free or paid | Release Friday after publication |
| `PRODUCER_SHOWCASE` | Beat demonstrations and artist collaborations | Any eligible organiser | Each beat/recording cleared for event playback | Free or paid | 3–6 segments |
| `FESTIVAL` | Several confirmed performers in one event programme | Promoter, label, venue or eligible individual | Performer and licensing limits apply | Free or paid | Small-format V1 festival only |
| `DESTINY_AWARDS` | Official quarterly recognition ceremony | THE SCENE official EventService only | Published award rules and eligible acts | Controlled | Curated official event |

**Scope guard [D]:** V1 supports the templates using *one shared scheduling, permissions, admission and settlement engine*. More elaborate festival camping, live broadcast tours, multiple simultaneous rooms, co-ownership companies, auctions and stadium-sized live capacity are future variants, not separate V1 implementations. Talent hunts may produce an award or booking prize only if fully funded, disclosed and awarded through an auditable criterion. There is no buy-in lottery or gambling mechanism.

## 4. Who can act, spend, sign and see results

| Role | Can create/publish | Financial responsibility | Has gameplay control | What they see after event |
| --- | --- | --- | --- | --- |
| Individual organiser | Yes | Personal wallet or expressly restricted project funds | Calendar, lineup, tickets, venue, event production, emergency action | Full own-event P&L and attendance |
| Venue company organising own show | Yes | Company balance; lease cost is existing overhead | Venue layout, event stage and programme | Own-event P&L plus venue reputation |
| Label organising showcase | Yes | Label unrestricted company funds; separately tagged funded campaigns require explicit project link | Programme, roster invitations, suppliers | Organiser P&L, roster milestones |
| Artist organising funded concert | Yes | Artist project budget for eligible spend; named contract waterfall for receipts | Programme and own show choices | Project P&L and artist career history |
| Freelance/agency promoter as organiser | Yes | Personal/agency account | Programme plus publicity | Event P&L and portfolio |
| Hired promoter | No, unless separately designated organiser | Fixed, segregated authorised F/P/B budgets only | Campaign deliverables, approved placements | Delivery and permitted aggregate response |
| Booked performer | No, merely by booking | No event liabilities unless a separate explicitly funded guarantee | Setlist, Stage Mode, permitted appearance | Verified performance, guaranteed fee, fans |
| Venue operator renting space | No, merely as venue supplier | Venue delivery per hire contract | Room readiness, compliant equipment and safety controls | Venue hire payment, reliability, hosting history |
| Voluntary event backer | No | Explicit limited funding commitment | Can attend, no unagreed operational veto | The contractually permitted project settlement |
| Fan/ticket holder | No | Ticket fee only if chosen | Attend, socialise, audio preferences and reactions | Valid memory, ticket receipt and outcomes |

**Accountability invariant:** `event.organiser_legal_actor_id` means one game individual or company and **one funding source** for organiser obligations, possibly augmented by disclosed event-backer funding. A separate `event.owner_player_id` identifies the human authorised to operate that company. Co-headliners, artists, promo agencies, backers and venue operators do not silently share organiser debt. An individual may be signed to a label and simultaneously organise an approved event; the signed agreement specifies which project finances it.

## 5. The physical event-creation experience

Player walks to the venue, inspects the actual stage, furniture, audience area, sound rig and location, and interacts with a **Booking Desk** or city **Venue Office**. The camera frames a miniature venue model and a real calendar; each available event day lights up. Choosing a day opens a complete cost and eligibility quote. Player can walk onto the stage, inspect where fans enter and preview the basic equipment. Booking becomes a **confirmed right** only when server authority verifies inventory and payment.

The organiser then uses a **Show Board** at the venue, label office, personal rehearsal room or public planning station. They physically place posters/cards for the headline act, supporting acts, production package, admission and event time. Artists appear as confirmed only after accepting. The **Poster Wall** previews how an announcement will look in the world. The **Venue Sound Desk** previews gear constraints and stage layout. A ticket kiosk animates when the organiser publishes sale inventory. A small tutorial highlights the next one or two meaningful actions, never a 40-field questionnaire.

**Phone mirror [D]:** a concise Event Card holds messages, confirmation links, quick setup, wallet quotes, upcoming obligations, calendar, safety settings and offline follow-ups. The newcomer experiences objects; the repeat organiser can edit efficiently from phone. High-volume text (times, prices, permissions and accessibility) uses readable overlays on those objects, with screen-reader accessible equivalents. Walking to six different props for every correction is not mandatory.

## 6. Event calendar: unique venue, 24-hour booking blocks and leases

**Canonical block [D]:** Event-day `D` owns the location from `D 06:00 Africa/Lagos` until `(D+1) 06:00 Africa/Lagos`. Only **one independently ticketed public show per venue per block** in V1. A show may contain many songs, several billed sets and pre-/post-show social activity. Timings inside the block are chosen separately (e.g. doors 19:30, show 20:00, ends 21:00). Booking a block does not reserve the entire city district. Venue basics are included; production packages are additional options with snapshot prices.

**Availability and provider rules:**

1. If the venue has no operating lease, city/NPC property office offers a short hire at its prepublished price.
2. If a venue company has prepaid lease coverage, only its own published hire offer or its own programmed show can occupy a block. The city cannot also rent the room to someone else.
3. A venue operator may reserve own-event dates, or sell event-use access to artists, labels or promoters; the city 7/28-day lease is operator overhead, not another per-show city hire charge.
4. **Never allow operator-booked future event dates outside prepaid, confirmed lease coverage.** A pending lease extension is not coverage.
5. A lease ending or company winding down **cannot silently erase existing customer bookings**. Reserved customer entitlements receive controlled reassignment to equivalent service or refunds before portable equipment and liabilities are released.
6. Once hire payment clears, the block becomes immutable to other buyers. A tentative ten-minute reservation expires without charging if checkout fails; there is no overbooking or click-race advantage.
7. Every venue has exactly one public `venue_id`; sharding of the graphics runtime does not create new public dates or extra saleable tickets.

**Date conflict:** If event goes past 06:00 on its next-day boundary, the organiser must finish within the paid block or reserve a separately offered extension **without** creating a second public show; V1's ordinary event templates do not allow uncontrolled overtime. Late-night permitted end times and any extra hourly extension are fixed before ticketing. Booking changes after sale are material attendee notifications.

## 7. Venue supply, equipment, portability and readiness

Each prebuilt venue has usable default stage, seats or standing area, basic speakers and lighting, entrance and backstage. **Size-based 1–10** sound, stage, light, seating, interior and audience-facilities ratings from Venue v0.3 apply; a small room's 10/10 kit is not an arena's 10/10 kit. Capacity is a fixed property of the actual approved venue, not a direct function of gear rating. Purchased compatible items remain owned by the relevant player/company and can be removed or transferred according to lease terms; rentals expire by their agreed rental period.

**Three production packages [D]:** `BASIC` uses included fixtures; `UPGRADED` adds suitable rented sound/lighting/decor; `CUSTOM` uses owned or additionally rented compatible physical props and stored layouts. The organiser must see a **size-qualified physical preview**. All costs are quoted before confirmation. Equipment has an ownership actor, custodian for this show, installation window and return time. A purchased item cannot be pledged to two simultaneous shows. An item already committed to a ticketed event cannot be removed or replaced with inferior gear after sale without an equivalent safe substitution and relevant disclosure.

**Readiness checks:** approved venue and time; no unpaid hire; at least one active permitted audio source; valid performer slot(s) where applicable; safe player capacity; entrance accessible; artist music/preview permissions; no blocked item; approved layout; essential commitments paid/reserved. A missing optional light or poster does not prevent a show, but an unsafe entrance or unavailable mandatory music cannot pass readiness.

## 8. Tickets, prices and honest capacity

**Capacity to sell = `min(venue.certified_capacity, production_safe_limit, event_server_supported_limit)`**, minus any clearly reserved performer/operations places counted against that capacity. Total concurrent admitted human avatars must also respect the safe technical session cap. For V1 live concerts, configure a **target maximum 50 humans** even if a 500-seat hall exists graphically. A V2 or arena property is therefore not a promise of 500 genuinely shared players. A venue may visually accommodate more than the current shared-session technology, but the available **ticket allocation** must be explicit before purchase.

**Basic ticket product [D]:** one publicly advertised ticket tier per event, paid or free, in-game ticket bound to one player account and one `event_session_id`. VIP sections, paid priority queues, scalper resale and transferable tickets are future systems. Set ticket price before sale; after first sale, price cannot increase for already-bought tickets. A lower public price may be offered to future buyers but never secretly add charges to prior purchasers; each ticket stores its own paid amount. Never make a free reservation quietly bill later.

**Fan entitlement:** an `Interested` RSVP is not a seat. Free capacity-bound sessions issue a unique **free reservation token**; a public lounge social hangout may be walk-in subject to current capacity. Paid purchase has a 10-minute checkout hold, expires on failure, and then becomes `PURCHASED` only with authoritative ledger confirmation. Bought tickets appear in phone and the venue door; one account has at most one valid admission per event session. No purchaser gets chart points for buying a ticket. A purchase does not guarantee check-in if the user is separately barred for a disclosed safety reason; lawful refund/remedy applies.

**Capacity release:** A refunded ticket may be returned to inventory exactly once if the event has not begun. Waitlist is opt-in, zero-charge, FIFO from actual eligible candidates with a 10-minute reservation offer; no auto-charge. A show selling 35 tickets but admitting 25 genuinely active players reports both numbers, never a fictional `35 attended` result.

## 9. Ticket policy: cancellations, refunds and reschedules

**Default audience policy [D] to disclose verbatim before checkout:**

- **Organiser/platform/venue cancellation before delivery:** full original ticket purchase amount back to the same internal ledger account, including any internal ticket-service fee that was part of that paid amount. All tickets invalidated. Tickets never finance an organiser's cancellation penalties.
- **Fan cancels voluntarily at least 2 hours before published start:** full refund in V1; remove admission and free one ticket slot. **Within 2 hours of start:** normally no voluntary refund, unless the event is materially changed, cancelled, or the consumer is entitled to a safety/platform remedy. There is no re-sale of a used admission token.
- **Material change after sale (headliner, venue, date/time moved by >30 minutes, entry condition or materially reduced programme):** notify promptly; affected holders may choose full refund up to revised start, even inside the ordinary 2-hour lockout. A minor schedule correction within 30 minutes is notified but does not by itself erase statutory/platform rights or override an already advertised material promise.
- **Reschedule:** publish replacement date/venue and equivalent accessible ticket rights; give each paid purchaser an explicit **Keep New Date / Refund** choice. No silent rollover. If the newly proposed event is full, new venue has a lower cap, or performer cannot fulfil, offer the refund rather than inventing seats.
- **Fan misses the event:** ticket does not convert into guaranteed refund solely because holder failed to attend; purchase still does not count as a performed attendance. See safety/venue failure exception.
- **No or materially incomplete show:** if advertised headliner never appears, there is no usable authorised music, or the live event is abandoned, treat as organiser/platform cancellation and refund **100%**. If the show is materially interrupted after partial legitimate delivery, a **predeclared 50% partial refund** may apply when less than 75% of the promised programme was delivered; more serious failure and undelivered headliner still mean full refund. This event policy is a design default and requires legal review [X].

**Refund liquidity:** Paid ticket funds remain event-held until the show is delivered, the ordinary reschedule/refund window is resolved and eligible payouts are calculated. The organiser cannot withdraw advance ticket sales to cover new costs. The settlement service moves held values or restores them idempotently; no negative fan wallet. Reconciliation failures yield `REFUND_PENDING` with clear user-visible status rather than claiming an instantaneous refund that has not occurred.

## 10. Event, offer, ticket and performance state machines

**Event:** `DRAFT → HIRE_HELD → VENUE_CONFIRMED → PROGRAMME_READY → PUBLISHED → DOORS_OPEN → LIVE → ENDED → RECONCILING → SETTLED → ARCHIVED`. Branches: `CANCEL_REQUESTED → CANCELLED → REFUNDING → CLOSED_CANCELLED`; `PUBLISHED/DOORS_OPEN → RESCHEDULE_PENDING → PUBLISHED` with ticket-holder consent; `LIVE → PAUSED_TECHNICAL → LIVE/FAILED_EVENT`. `SUSPENDED_SAFETY` blocks joins/playback and can route to cancellation. It is impossible to publish an event without the paid hire/right and mandatory performer/rights approvals. It is impossible to settle twice.

**Performer appearance:** `DRAFT_INVITE → SENT → ACCEPTED_FUNDED → CHECK_IN_BACKSTAGE → READY → PERFORMING → COMPLETED → FEE_ELIGIBLE → PAID`; alternative `DECLINED`, `EXPIRED`, `CANCELLED_APPROVED`, `NO_SHOW`, `DISPUTED`. A guest displayed as `Invited` is not advertised as a confirmed act. Before an offer becomes `ACCEPTED_FUNDED`, the organiser's guarantee is fully reserved and performer accepts price, place, date, duration, required song permissions and cancellation terms.

**Tickets:** `AVAILABLE → HELD → PURCHASED → REDEEMED → COMPLETED`; alternatives `HOLD_EXPIRED`, `CANCELLED_BY_HOLDER`, `REFUND_PENDING`, `REFUNDED`, `VOIDED_FRAUD`. Free `FREE_RESERVED → REDEEMED/EXPIRED`. Venue door may refresh or reconnect, but a ticket cannot be redeemed as two concurrent human occupants. A refund after check-in is possible for organiser failure; attendance history and chart evidence remain separately truthful.

**Set:** `PLANNED → CHECKED → QUEUED → LIVE → COMPLETED`; alternative `SKIPPED`, `FALLBACK_AUTHORISED`, `PAUSED` or `ABORTED`. Only confirmed, rights-cleared songs can enter public `LIVE` playback. All transitions are timestamped on the server; the client animates, but never becomes the ledger or concert clock authority.

## 11. Producing a show: the organiser's playable journey

1. **Inspect:** Walk to venue and view actual space, baseline gear, quality scores, capacity, schedule and past public history.
2. **Choose:** Select event type and 24-hour event day. Inspect honest simulated-capacity and projected minimum costs.
3. **Commit:** Pay city hire or operator quote; named organiser and payer snapshot becomes immutable for existing obligations.
4. **Build:** On Show Board drag accepted acts into ordered slots; pick show start, guest positions, up to three production layouts. Every guest has independent signed offer.
5. **Fund:** Reserve artist guarantees, required event services, any promised prize, minimum event-operating costs and documented refundable audience obligations before ticketing; no unfunded promises.
6. **Announce:** Preview poster on a physical board; choose ticket price/free booking, consent-based announcement categories, public description and refund disclosure; publish public card.
7. **Promote:** Self-advertise or commission promoter using separate F/P/B contract; physical posters and listening stations create exposure, not purchased human reactions.
8. **Rehearse:** Walk the actual stage, audition songs, place performers, test audio and lighting; save layout and schedule.
9. **Doors:** Check tickets and free tokens; coordinate friends and fan queue; confirm backstage performer readiness.
10. **Run:** Trigger show timeline, introduce acts, manage transitions and permitted effects; organiser can choose pre-authorised automated hosting if unavailable.
11. **Close:** Show ends, ticket check-ins freeze, technical/rights exceptions reviewed, suppliers paid, audience refunds resolved, organiser outcome recorded.
12. **Remember:** Posters, signed contracts, artist milestones, real fan memories, venue history and label/promoter portfolios update against *the same event ID*.

**Fast path:** A repeat organiser may use an already-approved template, a saved equipment layout and phone shortcuts. No mandatory physical chores repeat for no new decision; spatial interactions are the default experience, not a trap.

## 12. Appearance offers, lineup, guests, fees and performer autonomy

Each offer specifies artist `artist_id`, correct public credit, `event_id`, slot type (`HEADLINER`, `CO_HEADLINER`, `SUPPORT`, `GUEST`), expected arrival/doors/start window, estimated songs/duration, all-in guaranteed fee (or explicitly voluntary unpaid appearance), funding actor and cancellation obligations, plus any appearance audio permission. A self-headlining artist may nominate their own slot without paying themselves an imaginary fee; internal owner/artist transfers must be legitimate documented distributions, not fake supplier expenses.

**Two accepted headliners [D]:** co-headlining is available when both artists explicitly agree to billing, set order and cost/revenue commitments. The event remains **one paid public ticket product and one organiser**, with separately specified collaborator fees or an explicit configured shared-event settlement. For V1, prefer simple guaranteed appearance fees and *one accountable organiser*; complex percentage-of-gross contracts are future until Economy & Contracts supports them. The organiser cannot sell tickets showing a famous guest who has only been invited.

**Attendance by performer:** Can check in from backstage 30 minutes before show and prepare set. Performer may be offline until allowed grace but cannot have the system fabricate a genuine human live performance. The show can still use an **explicitly authorised prerecorded appearance fallback** if the performer previously consented to that form, but it must be labelled to the audience as a prerecorded set or listening presentation. The absent player's avatar is not silently puppeteered as if live. Without fallback consent, cancel/change programme with honest attendee remedies.

**No-show:** After a configurable **10-minute performer readiness grace** measured from confirmed slot start, mark `NO_SHOW` if no authorised human confirmation/fallback. Withhold the performer fee for undelivered services, apply documented reliability impact subject to outage review and trigger the material-lineup remedy. **No surprise negative personal wallet or post-facto unlimited penalty.** Optional appearance deposit/forfeiture must have been expressly agreed and prefunded; not required for beginner acts.

## 13. Stage Mode: making a recorded song feel like a performance

The headliner stands in the actual performance area. A compact stage control overlay appears, anchored to stage equipment rather than replacing the entire world. The artist chooses a setlist from eligible recordings, walks to one of **three safe stage positions**, starts a track, triggers expressive motion and optional venue-compatible effects at song-section markers (intro, verse, chorus, outro), signals the audience and invites an **accepted** guest into the permitted on-stage slot. Stage Mode works with an uploaded professionally mixed song and with a funny loop-and-voice track. It does not require live voice, technical instrument mastery or perfect timing.

**V1 interaction budget [D]:** 1–3 songs for standard headliner showcase, 2–4 expressive choices per song, optional crowd call/response, 0–2 gear effects from approved capabilities. Saved presets prevent repeating the same setup every week. Simple correct controls give visible enjoyment; missed cues must not penalise song's chart score or create fake fans. Venue quality changes available stage, sound and light presentation, but not raw fan-count generation.

**Performance integrity:** A button cannot trigger authorised playback if recording is blocked, territorial permission missing, rights expired or release embargo active. Using an approved unreleased excerpt in a private audition does *not* make a full song public. A released track included in a public concert can be saved/followed but its source and event remain separately attributed. An artist can mute their personal soundtrack while stage audio runs; never layer incompatible private and shared sources without individual listener choice.

## 14. Audio, timing and real-time audience experience

**A single logical event soundtrack:** One authoritative event timeline specifies what approved recording is playing and song position. Server publishes timeline start time and seek offset; clients sync playback, compensate for latency, and can gently resynchronise after connection jitter without treating the seek as another independent listen. Browsers may require a first user gesture to enable audible playback; show an obvious **Enable Event Sound** action in lobby and accessible captions/now-playing where rights allow. A listener who declines sound can still enter, dance and chat, but does not automatically qualify as a music listener.

**Fan activity:** walk to permitted viewing areas, socialise, use emotes/dances/cheers, respond to optional coordinated audience moments, follow or save the current released song, inspect performer profiles, join friends and participate in moderated event chat. Crowd energy is presentation only; an audience reaction is not a paid ticket, chart-weight multiplier or guaranteed artist revenue. Performers see aggregated authentic reactions with reasonable rate limits, never detailed private listening histories of individual fans.

**Device policies [D]:** foreground/background, OS audio-focus interruption, mute, reduced-motion, low-bandwidth music-only fallback, screen-reader/keyboard controls, photosensitivity-safe effects and low-end phone graphics presets. Pausing a client app does not pause everyone else's event. The show advances using server time. Personal soundtracks yield to event shared audio when selected; exiting restores the user's preference. If stage visuals fail but approved audio works, a disclosed reduced-effects experience may continue, with a remedy only if a material promise is broken.

## 15. Pre-show, doors and post-show moments

The event should feel social **before** the first song. At `DOORS_OPEN` (default 30 minutes before show), players enter a visible queue/lobby, see correct lineup, meet group members and preview event-safe artwork. Paid attendees approach the door or use an accessible **Enter Event** shortcut. Venue check-in animation represents an already-authorised server state. The organiser can greet arrivals, the promoter can observe aggregate campaign response, the label owner can mingle, artists can prepare backstage, and friends can choose viewing places. An organiser's inactivity cannot keep already valid ticket holders stranded; server-controlled door opens when prerequisites pass.

**Late joining [D]:** Tickets remain valid until the event ends, subject to material access limitations disclosed at purchase. Joining at 20:25 for a 20:00 show enters the live set at the correct playback offset and does not start a second private concert. Post-show lounge stays open up to 10 minutes inside the booked block, or a separately approved longer public social session. Attendees can selectively follow/save songs, receive history cards and exit without being automatically subscribed to marketing.

**Fans and memories:** A unique human who checked in and was present during the show for at least **5 aggregated minutes**, or at least half for a show shorter than 10 minutes, qualifies for a basic concert memory, once per logical event. This does not equal a chart-qualified audio listen. Ticket holders who never attend do not receive attendance memories. A show cannot award duplicate badges by changing server shards or reconnecting.

## 16. Social groups, queues, instance placement and genuine capacity

**Admission model [D]:** an event has a single global ticket allocation, `event_session_id`, check-in roster and presence journal. The `JoinCoordinator` maps authenticated attendees to one or more runtime processes. For V1, keep each paid concert a **genuinely shared 20–50-person session**, so attendees can see one another and experience the same stage. The safe concurrency limit is tested before ticket sale and never raised based on assumed server horsepower. Prefer one synchronized room and graceful refusal/waitlist to silent fragmentation.

**Friends:** If four friends each have a valid ticket, attempt to join them together. A friend group is a routing preference, not an extra reservation. If all cannot join, show why and offer a truthful alternative. A temporary reconnect grace (default 5 minutes) holds occupancy for a ticket already checked in; expiry releases active slot but not the ticket or right to return when room is available. A checked-in player can only occupy one live instance at once. Multiple devices for one account cannot occupy two admission slots.

**Later multi-shard [F]:** A large event may one day have synchronised distributed viewing with a global cap, coherent shared performance and clear disclosure of technical audience separation. It may not claim that 5,000 different people had one shared interaction if they were scattered across copies with no common event experience. NPC dancers may enhance visual ambience but contribute zero admission receipts, unique human attendees, follower counts or award votes.

## 17. Show-day operator controls, moderation and emergency responses

Event host, venue operator and the game server have distinct permissions. The organiser can open an approved lobby, start an eligible programme, advance to the next accepted set, invoke approved prerecorded fallback, pause temporarily and trigger a graceful cancellation. Performers can run only their own slots and approved stage effects. Venue operators can enforce facility safety, limit equipment controls and initiate an emergency stop if the physical/technical environment is unsafe. A promoter can observe campaign response but cannot commandeer the stage merely because they placed posters. Fans can use permitted interaction and report abuse.

**Server safety authority overrides everyone:** moderation may mute/suspend abusive chat or individual accounts, block unauthorised playback, disable dangerous visual effects, evacuate a venue or cancel a show when necessary. A player who is blocked by another is not automatically evicted from a public room without separate safety justification; physical proximity, chat visibility and invitations respect privacy controls. Harmful conduct is handled with progressive moderation appropriate to severity, not revenge powers sold to venue owners.

**Emergency button [D]:** Accessible in phone and venue desk; asks for immediate reason, executes pause/evacuation according to threat, snapshots state and produces audit evidence. Avoid public cancellation controls that can be triggered by a random spectator. Safety emergency is never charged to a fan as a voluntary cancellation.

## 18. The event economy: authoritative financial model

Concert revenue exists **only because eligible players buy tickets or make a separate authorised contribution**. Internal bookkeeping never treats poster impressions, NPC crowd animations, invited-but-absent friends or raw streams as revenue. Financially responsible organiser enters a project at `VENUE_CONFIRMED`; they see a unified page with **available cash, obligations reserved, event-held ticket proceeds, realised costs, projected break-even and maximum affordable loss**.

### 18.1 Required financial buckets [D]

| Bucket | What it is | Who can spend it | When it moves |
| --- | --- | --- | --- |
| Organiser's available balance | Uncommitted personal/company funds | Only authorised owner | After verified spend or reserve |
| Organiser event commitment | Pre-funded artist guarantees, supplier costs, bonuses and owed event services | EventService pays named suppliers under milestones | Once services qualify or penalties apply |
| Venue hire held balance | Short-rental payment protecting date/space | City or venue supplier after earned access | Block access starts or disclosed cancellation rule applies |
| Audience ticket liability | **Gross** paid ticket receipts, held separately | Nobody, until delivery/refund decision | Refunds first, then fee and eligible event payout |
| Label project reserve | Restricted signed-artist funding for defined categories/project | EventService for approved project expenses | Expense confirmation, never discretionary withdrawal |
| Event-backer commitment | Optional capped funding for one named event | EventService only within disclosed project | Funded obligations and agreement settlement |
| Earned supplier balance | Payment genuinely earned for venue, production, artist, promoter etc. | Recipient after verified settlement | Completion or contractual milestone |
| City treasury / system sink | Explicit NPC service source and configured test ticket service fee | Server accounting only | Budgeted game-source spending or fee collection |

**Server rules:** All account movement uses double-entry or an equivalent conserving, auditable journal with immutable transaction IDs and idempotency keys. For each event, the sum of funded sources and ticket receipts equals all refunds, released holds, vendor payouts, fee sink and remaining organiser/project settlement, with no phantom credits. Ticketing is not a loan. A sold ticket never appears as spendable organiser revenue before the risk of refund has been resolved.

### 18.2 Minimum pre-event funding

Before paid ticketing opens, the organiser must be able to pay for the event **without counting on unsold tickets**: confirmed venue hire, mandatory production/safety services, guaranteed performer fees, accepted promoter service/placement guarantees and prize pools are paid or reserved from authorised existing funds. The organiser may optionally disclose a separately funded event backer; a label's already committed restricted project reserve can satisfy eligible portions. If money falls short, the system leaves the show in `PROGRAMME_READY` but blocks public sale. It does not let the organiser pre-sell 50 tickets to fund an event they cannot otherwise deliver.

Once event sales open, further discretionary upgrades cannot spend held tickets. The organiser may add new options using *new* available money, with material ticket promise and capacity rules enforced. A special paid guest booked late needs the full guarantee reserved before public announcement.

### 18.3 Standard internal ticket-service fee

The cross-chapter test baseline is **3% of retained paid-ticket gross**, a configured simulated service fee that flows to an explicit game fee sink or city treasury, not an asserted Lagos Life/Vatar charge. The fee is calculated on each non-refunded ticket's final paid value, rounded by the shared integer-minor-unit ledger; entirely refunded tickets incur **zero retained ticket service fee**. A 50% partial refund leaves a 3% fee on the remaining 50% retained amount. There are no unannounced extra checkout fees in V1.

### 18.4 Venue-operator economics and cost attribution

Venue company paying ₦29,400 for a seven-day V1 lounge lease records the actual company lease payment when prepaid. Its management view allocates **₦4,200 per scheduled day** to understand profitability, but accounting must **not debit another ₦4,200** when an event occurs. A third-party organiser booking the operator's space pays the operator's quoted hire rate from their event budget; the city may not separately charge that organiser for the same block. If venue company runs its own show, no fictitious internal venue-hire income or secondary city rent is posted. Project event P&L may show allocated lease cost for management, with transparent distinction between allocated overhead and new cash expense.

## 19. Event booking and performer cancellation liabilities

**Venue hire default [D]:** Booking right is held once paid. If organiser voluntarily cancels **more than 48 hours before block start**, refund **80%** of venue-hire price; from **2 to 48 hours** before block start refund **50%**; inside **2 hours** or after venue access begins, ordinarily no short-hire refund, provided venue access was actually deliverable. The remaining contracted cancellation amount goes to venue supplier. A venue/city delivery failure receives **100% venue-hire reimbursement** and the event attendees get the separate full-ticket remedy. A customer rebooking request is treated as cancel+new booking unless all parties explicitly agree on a no-cost move. Time to *block start*, not show start, governs the venue hire supply contract; this is visibly distinguished from fan ticket-refund cutoff.

**Performer cancellation default [D]:** An organiser-initiated cancellation of a funded, confirmed appearance triggers at most **0% of the guaranteed fee if >48h before show start**, **25% within 2–48h**, or **50% within 2h**, payable only from organiser funds already reserved; a verified performer who checked in and was ready when the platform/organiser abandoned the show can qualify for **100%** of the guarantee. Where an artist's appearance agreement explicitly changes this table, their accepted pre-funded terms prevail within allowed maxima. The amount is independent of refunding fans: organiser must carry both liabilities. An artist who chooses not to attend and provides no authorised substitute forfeits unearned fee and receives verified no-show history; **no surprise personal debt**. Account suspensions, platform outages and medical/offline claims require documented review instead of an automatic punitive debit.

**Organiser insolvency:** Cannot sell tickets without prefunding essential costs. A suddenly suspended or closed organiser cannot move precommitted funds to a personal account. EventService either performs the advertised service under eligible pre-authorised automation/provider coverage or cancels and refunds ticket-holders from the isolated ticket pool. Supplier fees come only from their original escrow and contract terms. Company closure stays `WINDING_DOWN` until these funded obligations are resolved; it cannot erase historical liabilities by transferring the office sign to a different company.

**Venue operator early closure:** Operator cannot lawfully withdraw the venue service cash for a future date as though the room has already been provided. Venue hire payments for future blocks remain held until the venue day access condition. A city coordinator can offer a verified equivalent rebooking if all affected parties consent; otherwise organiser receives the applicable provider-fault reimbursement and fans are offered the required change/refund, without creating fake money. Where city funds a fallback, it must be recorded as city treasury expense.

## 20. Event P&L worked example: small headline show

**All figures are simulated V1 balance fixtures, not final prices or a forecast.** Kemi independently organises a 50-capacity headline show in a city-managed small lounge. She rents one 24-hour block for ₦6,000. She hires support services, pays a guest appearance fee and commissions a small promoter. She is the sole organiser.

| Expense | Event-funded cost |
| --- | ---: |
| Venue one-off hire | ₦6,000 |
| Guest performer guarantee | ₦4,000 |
| Required event production | ₦2,000 |
| Promoter fixed fee | ₦3,000 |
| Additional equipment rental | ₦1,000 |
| Basic event services | ₦2,000 |
| **Committed event cost** | **₦18,000** |

The ticket is ₦1,000. A successful ticket's retained receipt after the **3% configured fee** is ₦970. The minimum **break-even is 19 paid, unrefunded tickets** (`19 × ₦970 = ₦18,430`; `18 × ₦970 = ₦17,460`). The audience still needs to turn up for the artistic and social outcome; ticket sale is not verified attendance.

| Paid unrefunded tickets | Gross sales | 3% game fee | Organiser revenue after fee | Profit / loss after ₦18,000 costs |
| ---: | ---: | ---: | ---: | ---: |
| 0 | ₦0 | ₦0 | ₦0 | **−₦18,000** |
| 5 | ₦5,000 | ₦150 | ₦4,850 | **−₦13,150** |
| 18 | ₦18,000 | ₦540 | ₦17,460 | **−₦540** |
| 19 | ₦19,000 | ₦570 | ₦18,430 | **+₦430** |
| 35 | ₦35,000 | ₦1,050 | ₦33,950 | **+₦15,950** |
| 50 | ₦50,000 | ₦1,500 | ₦48,500 | **+₦30,500** |

Example: 35 fans buy tickets, but only 24 actually enter. Assuming the event is delivered and none refunds, Kemi's organiser P&L is **+₦15,950** and verified human check-ins are **24**. The chart and audience records cannot count 35 live attendees. If the show cancels before delivery, ticket-holders receive full refunds; Kemi may still lose nonrefundable hire and earned supplier cancellation fees from her prefunded account. The service fee sink retains zero on fully refunded tickets.

## 21. Label-financed versus label-organised shows

These two situations are **not financially interchangeable**.

**Case A: Artist is organiser; label finances named project.** Kemi holds a signed Westside Records campaign with a protected project budget. Her headline show uses eligible project expenses. Kemi selects venue, accepts her own programme, directs the show and remains the organiser of record; project budget pays documented suppliers within the agreement. Event's eligible net receipts, after ticket refunds and 3% fee, flow into **that named campaign's** settlement, not freely into the artist's wallet while the project has unrecovered costs. If project spending (including recording, promotion and the named show) totals ₦18,000 and receipts after ticket fee are ₦21,340, first ₦18,000 recoups actually spent covered costs, then residual ₦3,340 splits 60% artist (₦2,004) / 40% label (₦1,336). The label's recovered ₦18,000 returns to its appropriate funded balance; none of it was spent twice. Unspent committed allocations remain reserved under the agreement until release/expiry. If receipts are ₦10,000, label recovers that amount and bears unrecovered funded expenses; Kemi does not automatically owe the missing ₦8,000 personally.

**Case B: Label owns the event.** David's Westside Records company creates `LABEL_SHOWCASE`; it pays its own venue, promoter, mandatory services and accepted artist appearances. Ticket and supplier settlement belongs to **Westside's event project**. Roster artists can appear by specifically agreed fee or approved roster-performance terms. The label cannot *also* apply a 40% label share against the same showcase event organiser profit merely because artists on its roster performed. Any distinct named artist development project included in the showcase must have an explicitly disjoint receipt set: **one receipt -> one financial project -> one waterfall**.

**Case C: Venue owner self-hosts.** Venue company organises a show under its prepaid lease; no NPC second rental charge. Its organiser profit is ticket net minus *new cash event costs*, while company-level accounting separately recognises attributed lease overhead (see §18.4). Its rental-to-others revenue is a different event role and does not generate an imaginary ticket share.

## 22. Promoter, backer and sponsor contracts inside events

**Hired promoter:** The event links an existing CampaignOffer with **F** (fixed deliverable fee), **P** (placement/material budget), and optional **B** (capped pre-funded verified event-attendance bonus). The promoter receives only the earned F and applicable B; P goes to permitted ad-placement/service suppliers. Delivering a poster does not imply achieving its exposure goals or creating ticket buyers. B pays only after verifiable event check-in threshold **and final refund/fraud eligibility** are known. A client or company cannot ask EventService to pay the same F twice because one campaign is linked by both event and artist release. The hired promoter is not the show organiser.

**Promoter's own event:** Agency or freelance promoter is the organiser and bears its own event cash flow. They cannot issue a self-invoice for an external promoter F fee to create artificial expense/revenue or collect the same money twice. Their creative campaign may be tracked for reputation without fake service income.

**Voluntary backer [D]:** One additional backer can contribute a capped, committed amount to a specifically named event in V1, through a simple transparent agreement. At most **one named backer per event** during initial rollout, no tradable shares, debt, lending interest, real-money security or company equity. An agreement can be a no-return gift (recorded as a voluntary transfer) or a **recoup-plus-explicit-positive-profit-share** of that event's own net proceeds, capped by contract. The backer receives no claim on artist copyrights, unrelated future concerts, fans or streaming results. The organiser approves event expenditure and holds control. Unused committed backer money returns according to the signed contract; no passive guaranteed yield. Anti-circular-funding and self-dealing controls block collusive loops used to create chart, bonus or payout fraud. More complex investing remains [F].

**Optional sponsor:** In-game sponsorship is not required to label a voluntary gift; a formally advertised event sponsor must receive a separately disclosed non-financial publicity service and any permitted sponsorship rights. If that adds excessive V1 complexity, implement only voluntary transfer and event backer agreement first. No paid sponsor can buy awards outcomes or eligible listener counts.

## 23. Free events and the zero-balance path

A new artist, fan or aspiring promoter with ₦0 must still be able to participate. The city maintains a limited, budgeted schedule of **free public open-mic slots and community listening events** at specified NPC public stages. This is not the right to reserve an expensive 50-capacity business venue for nothing whenever someone wants it. The player can apply to perform on an already funded city event, meet people, discover songs, create a setlist and build reputation at no cost. The city's venue and basic service expenditure is an explicit NPC/community programme budget, not simulated real ticket receipts.

A free public event created by a private organiser still has a financially responsible organiser: venue hire/lease obligations and supplier fees must be covered by their available money or approved restricted budget. Tickets are zero-priced but capacity controlled. No paid tickets, service-fee sink or imaginary concert income arises. A venue owner may voluntarily host an unpaid open mic as a genuine business choice and gain cultural reputation, but the lease remains a cost.

**Never require a player to take a job just to meet friends, attend a free lounge, save music or watch an eligible community set.** Starter NPC employment (e.g. setup assistant, poster distribution training, venue orientation) is an optional capped, authentic currency source, with an explicit city-funded payroll pool and nontrivial interaction. NPCs are allowed to give paid tasks; they are not allowed to pose as 40 paying fans.

## 24. Event fairness, trust, abuse and moderation

**Integrity boundaries:** Opening artist does not receive automatic new listeners from backstage; poster impressions do not turn into ticket sales; applause/emote spam is rate-limited and never chart weight; a viewer's muted/unplayed shared audio is not a guaranteed song listen; buying 20 tickets with alt accounts cannot exceed unique human admission rules; multiple devices cannot check one entitlement in twice; refund-and-rebuy does not create two performance histories. Public sales, redeemed attendance and track listening are distinct event streams.

**Abuse patterns:** artificial ticket buying with circular transfers, coordinated bonus threshold manipulation, venue calendar hoarding, fake confirmed celebrity guests, artist impersonation, copyrighted song leaks, harassment in event chat, discriminatory gatekeeping, underage access to unsuitable events, misleading prizes, fake reviews, malicious headliner cancellations and replay-bot farms. Mitigations include event source signatures, confirmed billing, account/identity velocity controls, funds reservations, limits on public future block holds, report/block/mute flows, moderated text chat, accepted permissions, protected audit logs and human review for consequential sanctions.

**Venue scarcity and anti-monopoly [D]:** One flagship leased venue per venue company, active lease payment required, finite booking windows and tentative holds expiring in 10 minutes. Operator cannot retain an indefinite idle site through unpaid options. City may offer unique additional public stage slots to reduce lockout at low population. An operator may set rates within configurable transparent bounds, not change accepted bookings afterward or discriminate via secret pay-to-enter floor caps. Distinct venue reputation records persist; a new operator must not steal an earlier operator's company brand.

**Public claims:** Displays must label `Tickets sold`, `Checked-in humans`, `Listeners (eligible)`, `Fan follows`, `Event capacity`, `Ambience NPCs`, `Followers interested` distinctly or omit metrics. Users should never mistake a rendered crowd for verified ticket sales. Public attendance counts may be shown approximately/delayed to protect privacy in very small rooms; organiser receives trustworthy totals but no invasive fan movement surveillance.

## 25. Awards, official ceremonies and special events

**Destiny Awards** takes place approximately four times each game-year calendar year under an official scheduler, subject to game season design. It is the **highest official industry recognition**, not necessarily the largest private concert by attendance or production spend. A player-built festival may grow larger in both cost and genuine attendance without becoming official Destiny Awards. Official brand, nomination actions, judging and voting are reserved to the authoritative awards service; a player may not impersonate it by naming a showcase "Destiny Awards".

**Venue qualification [D]:** Official organiser considers published eligible venue capacity, size-appropriate sound/stage/light/facility thresholds, server-deliverable shared attendance, prior venue reliability and required access/production capabilities. One qualifying leased operator can bid to supply the physical venue; they must hold suitable prepaid date coverage and honour the platform ceremony contract. A wealthy venue may bid but cannot purchase a win. If no player venue qualifies, the city provides an approved public location. Official ceremony attendees may be placed in a capped primary room with honestly labelled additional viewing opportunities; expanding to fully live, massive multi-room ceremonies is [F].

**Artists:** selected/contracted performers prepare permitted show sets and receive verifiable special performance history; invitation is not a right to interfere with voting. **Promoter:** commissioned to generate legitimate publicity only. **Label:** may sponsor roster appearances without governing results. **Fans:** attend, follow nominees, dance and receive actual attendance memories. Awards are based on separately specified fair season metrics, not raw money spent. Nomination categories must not be inferred from venue operating ledger values.

## 26. Real-world music, licensing, privacy and third-party integration boundaries

THE SCENE can host real uploaded music and player-made loop/voice recordings only under an authorisation and takedown process that covers **public playback in virtual rooms, event performances, previews, recordings and promotional uses** as applicable. Artist's rights confirmation and credits are not a substitute for examining the actual platform's licensing risk. Licensed loop packs must explicitly permit users' resulting songs and public uses; AI-generated song licences and external providers remain [X]. A rights takedown can interrupt an event mid-set; suspend unauthorised audio immediately and apply appropriate substitutions, notification and refunds based on delivered programme. An organiser cannot compel the platform to broadcast disputed audio.

**Recording and privacy [D]:** V1 creates event attendance records and selected non-identifying promotional reports, not full audiovisual archives of everyone's speech, private chats or microphones. Event photo/screenshot features require player privacy controls and platform policy. Public profile may list verified performances; personal attendance memories may be private by default. Stored account identifiers, device diagnostics and reports have limited access, retention and deletion procedures requiring legal/security review [X].

**Lagos Life boundary [X]:** Independent domain hosts the standalone 3D simulation with an explicit **non-redeemable standalone internal ledger**. Where it later embeds into Lagos Life via an approved developer interface, use only supported identity, permitted SDK purchases and other authorisations then actually available. Do not imply that the SDK provides arbitrary game-naira wallet reads, artist fees, refunds, company wallets, transfers, 3D avatar import or cross-ledger settlement. Never reinterpret competitive-match staking or real-money product purchases as general music-event settlement endpoints. Any legal real-money ticket sale requires separate compliant design and platform permissions; **not V1**.

## 27. Event system boundary and shared ownership of data

**One authoritative event service**, not one event system per profession:

| Service | Owns | Must not own |
| --- | --- | --- |
| `EventService` | Show status, event/day reservation integration, organiser, programme commitments, public card, attendance eligibility, event history trigger | Player raw wallet balances or song rights declarations |
| `VenueService` | Unique building identities, physical capacity, equipment readiness, operating leases, operator hire rights, booking inventory | Audience chart points |
| `ContractService` | Performer offers/acceptance, cancellation matrix, promoter service references, backer agreement terms | Ticket-sale inventory counters |
| `LedgerService` | Source balances, reserves, holds, ticket liability, refunds, payouts, fee sink, immutable journals | Stage animation time |
| `TicketService` | Entitlements, purchase hold, global cap, waitlist, refunds state, redemption | Event prestige ranking |
| `ShowTimeline/StageMode` | Accepted stage slots, synchronized action and music timing, permitted performer effects | Finance mutations or off-platform stream counts |
| `AudioService` / `MusicService` | Song entitlement, legal use, audio timeline playback, source-specific qualified listen evidence | Attendance fee calculations |
| `JoinCoordinator` | Real human concurrent occupancy, friend co-location, reconnect, shard mapping | Additional public ticket inventory |
| `SocialService` | Friends, moderated chat, dance/reactions, personal privacy | Making strangers automatic followers |
| `AchievementService` | Verified artist, venue, promoter, label and fan history linked to event ID | Creating extra financial payouts |
| `AwardsService` | Official calendar, nominations, results and host selection | Commercial promoter contract approvals |

All mutations are **server-authoritative** and checked under actor/role permission. The client can preview cost, set lists and 3D effects optimistically, but cannot decide the outcome of a financial transaction or publish an unaccepted musician. Each state transition has `actor_id`, `causation_id`, timestamp and idempotency key. Batch retries do not produce extra music listens, attendance credits, tickets, supplier payouts or ledger fees.

## 28. Canonical data model: entities and fields

| Entity | Minimum fields |
| --- | --- |
| `Venue` | `venue_id`, public_name, district_id, transform, venue_tier, human_capacity, safe_server_cap, fixtures_rating_by_class, safety_state, venue_owner_city |
| `VenueLease` | `lease_id`, venue_id, company_id, covered_from/to, paid_through, status, permitted_subbooking, equipment_inventory_scope |
| `VenueBlockReservation` | `block_id`, venue_id, local_day_key, starts_at_utc, ends_at_utc, supplier_actor, organiser_actor, quoted_amount, paid/held_ledger_ref, lease_coverage_snapshot, expiry, status |
| `Event` | `event_id`, `session_id`, type, venue_id, block_id, responsible_organiser_actor, organiser_player, source_account, linked_project_id, planned_start/end_utc, public_status, rights_state, moderation_state, disclosure_version |
| `EventProgramme` | event_id, headline_artist_id, ordered slot_ids, agreed music duration, warmup/doors/start/finish times, material_billing_digest, cancellation_policy_version |
| `AppearanceOffer` | offer_id, version, artist_id, role, slot order, price/guarantee, reserved_source, time window, fallback permission, accepted_at, state |
| `EventProduction` | event_id, compatible equipment inventory, hire/source, saved stage_layout, production package, sound/light constraints, readiness evidence, vendor_contract_ids |
| `TicketTier` | tier_id, event_session_id, human_cap, paid_price_minor, sale_open/close, policy_digest, purchased_count, held_count, admitted_count |
| `Ticket` | ticket_id, account_id, session_id, price_paid_minor, currency_scope, unique_entitlement, hold_until, state, entry_history, refund_reference |
| `LivePresence` | event_id, account_id, device_session, join/leave/heartbeat intervals, per-event unique check-in, audio-enabled state, instance_id |
| `ShowTimeline` | event_id, ordered sets, source_audio_ids, offset/time anchors, pauses, section markers, performer actions, fallback markers, actual_delivered_seconds |
| `EventFinancialJournal` | event_id, project/contract_id, account source, account destination, amount_minor, asset scope, event category, hold/release/reversal refs, immutable idempotency key |
| `EventIncident` | incident_id, event_id, rights/safety/technical/finance classification, trusted evidence, affected_users, materiality, remedy, reviewer/action trace |
| `EventHistoryEntry` | event_id, unique player/company id, recognised role, verified criteria, privacy visibility, one-time award key |

**Indexes/constraints [D]:** unique `(venue_id, local_day_key)` active reservation; unique `(event_id, ticket_owner_account_id)` valid admission; one live occupancy per account/session; unique `(event_id, artist_id, appearance_slot_id)` in booked sets; unique ledger transaction idempotency key; unique `(event_id, history_actor_id, achievement_type)`; one mutually exclusive terminal financial settlement event per `event_id`. Grouped event commands acquire server transaction locks. If a container loses network while submitting, replay uses identical idempotency keys and receives the **same committed result**.

## 29. Permissions and authorisation matrix

| Action | Organiser owner | Venue supplier | Accepted performer | Hired promoter | Ticketed fan | Server moderation |
| --- | --- | --- | --- | --- | --- | --- |
| Reserve show block | Yes | Own allocation only | No, unless independently organiser | No, unless independently organiser | No | Override only audited |
| Set ticket price before sale | Yes | No, unless organiser | No | No | No | Enforce restrictions |
| Accept an artist appearance | No, artist consent required | No | Own appearance only | No | No | Force invalidation for safety |
| Change billed headline after sale | Propose only + remedies | No | Withdraw under terms | No | Consent/refund choice | Enforce remedy |
| Configure venue gear | Within package/contract | Approved property controls | Stage controls limited | No | No | Emergency restrictions |
| Start song/set | Organiser within pre-auth rules | Safety-only stop | Own confirmed slot | No | No | Rights/safety stop |
| Pause/end unsafe event | Yes | Safety emergency | Report/pause own performance | Report | Report | Yes |
| Issue ticket refund | Request | Request provider remedy | No | No | Eligible self-cancel | Authoritative settlement |
| Read individual private fan data | No | No | No | No | Own data only | Least-privilege review |
| Trigger promoter bonus | No | No | No | No | No | Event verification + ledger only |
| Edit historical attendance | No | No | No | No | No | Audited correction only |

**Authentication:** owner authorises company actions through their single eligible business control; offline delegates and full staff hierarchy are not implemented. Venue operators cannot take over artist setlist or inspect buyers' real identity. Event organisers cannot reveal which songs a particular attendee privately listened to when they were outside the room. Reports are aggregated and privacy-respecting.

## 30. Precise API/event command inventory

**These are proposed internal app commands and domain events, not published Lagos Life API calls.**

| Command | Critical validation | Event emitted / outcome |
| --- | --- | --- |
| `CreateEventDraft` | Signed-in eligible avatar, valid template | `event_drafted` |
| `HoldVenueBlock` | Unique venue/date slot free, 10-minute TTL | `venue_block_held` |
| `ConfirmVenueBlock` | Verified payer, city/operator right, payment success | `venue_block_confirmed` |
| `SaveProgramme` | Slot caps, valid times, performers distinguished invited/accepted | `programme_updated` |
| `SendAppearanceOffer` | Artist eligible, same date/time conflict check, full guarantee reserve | `appearance_offer_sent` |
| `AcceptAppearance` | Exact current offer version, rights acknowledgement | `appearance_accepted` |
| `QuoteProduction` | Actual equipment compatibility, inventory commitment | `production_quoted` |
| `AttachCampaign` | Valid F/P/B, source budget, creative permissions | `campaign_attached` |
| `VerifyEventReady` | Booked, paid essentials, safe room, rights valid | `event_ready` or field errors |
| `PublishEvent` | Verified ready, policy disclosed, honest ticket cap | `event_published` |
| `HoldTicket` | Sales open, unique buyer/cap, idempotent 10-minute hold | `ticket_held` |
| `ConfirmTicket` | Sufficient internal funds, one entitlement | `ticket_issued` |
| `CancelTicket` | Eligible voluntary cutoff/material remedy | `refund_pending` / `ticket_cancelled` |
| `JoinEvent` | Ticket/free entitlement, capacity, safety access | `event_joined` |
| `CheckInPerformer` | Accepted appearance, correct session, stage eligibility | `performer_ready` |
| `StartEvent` | Doors complete, approved audio, required show conditions | `event_live` |
| `StartSet` | Performer/organiser rights, current scheduled slot | `set_started` |
| `PauseShow` | Authorised or automatic verified incident | `event_paused` |
| `ApproveFallback` | Prior performer permission + truthful disclosure | `fallback_used` |
| `EndEvent` | Authorised end or authoritative timeline | `event_ended` |
| `ResolveIncident` | Correct event case, evidence, policy | `incident_resolved` |
| `SettleEvent` | All ticket refunds/vendors/contract milestones reconciled | `event_settled` |
| `ArchiveEvent` | Immutable finance and history pointers | `event_archived` |

**Async/outage principle:** Nobody has to be permanently online for a previously authorised contract to finish. Reserved funds, ticketing, reminders and venue check-ins operate on server state. The actual performing avatar and audience remain human-controlled; a fallback is an explicitly pre-approved change in *type of presentation*, not a fake live user.

## 31. Deliberate failure handling matrix

| Failure / race | Required behaviour |
| --- | --- |
| Two organisers click the last venue block | One atomic confirmation; loser gets immediate unavailable state and no debit |
| Operator sells a future date beyond paid lease | Prevent publication of hire inventory until confirmed coverage paid |
| Lease lapses after advance customer sale | Fulfil from secured supply coverage; otherwise organise transparent alternate/refund; release operator assets only after settlement |
| Venue owner disconnects on show day | Pre-approved event can still open on automated readiness; operator's absence doesn't confiscate paid tickets |
| Organiser cancels just before show | Fan full refund; supplier fees per pre-funded disclosed schedules; reputation impact reviewed |
| Confirmed headliner no-shows | Don't imply live performance; use consented prerecorded fallback or material change and full fan remedy if no valid headliner |
| Guest absent | Correct billing promptly; allow material-change ticket refund before show; continue if programme still eligible |
| Artist recording loses rights | Stop playback immediately; licensed alternative only if valid and disclosed; apply show failure remedy |
| Performer microphone unavailable | Play accepted recording; V1 never requires live mic to deliver |
| Audio desynchronised on one client | Resync by server offset; report device issue, do not restart or duplicate chart listens |
| Venue-wide audio outage >15 minutes | Pause and attempt restore; if unusable delivery, cancel/refund according to delivered programme |
| Performer reconnects | Join current set at authoritative offset; no duplicate appearance fee |
| Fan double clicks Pay | Same ticket/charge result from idempotency key |
| Browser closes during checkout | Hold expires/retries; no ghost paid seat if payment never clears |
| Fan's ticket paid, door fails | Retry entitlement; platform failure remediation if user misses show |
| Two devices same account enter | Reject second active occupancy, preserve first person's genuine check-in |
| Friend group larger than remaining capacity | No extra seats; display truthful options and avoid splitting where possible |
| Player joins after first song | Enters at current position, no replay of previously unheard songs automatically |
| Bought ticket never redeemed | Count sale, zero checked-in attendance; payout on delivered show under refund policy |
| Fan chooses no event audio | Can attend/dance; does not automatically log qualified music listen |
| Abusive fan floods chat | Mute/report/rate limit without altering finances or other players' ticket validity arbitrarily |
| Moderator halts unsafe event | Protect attendee eligibility and refund rights; freeze payouts pending reviewed incident |
| Fraud-ring buys all tickets | Flag payment/check-ins/bonus; freeze questionable settlement, no automatic chart boost |
| Promoter bonus measured before refunds | Wait for qualifying net attendance and final refund reconciliation |
| Label project charged twice for show | Single project receipt/expense key rejects duplicate transfer |
| Artist spends beyond label project allocation | Transaction blocked prior to unauthorised commitment |
| Performer guarantee can't be funded | Offer cannot become active and confirmed |
| Player tries to transfer purchased ticket | Reject in V1; no unofficial resale admission |
| Event ends with insufficient audience | Honest low sales/attendance and financial loss; no fake demand |
| Ticket fee retained after full cancellation | Reverse to zero; full original paid price refundable |
| Bankruptcy during future ticketed obligations | Stop new sales; protect refund-held tickets and committed vendor guarantees |
| Ticket purchase after show starts | Default sales closed at scheduled start; any permitted door sale needs explicit safe cap and same disclosed terms |
| Event copied with another venue ID | Reject public identity duplication and duplicate-ticket accounting |
| Destiny Awards spoof | Only official awards provider can publish `DESTINY_AWARDS` type and brand |

## 32. Seven-day cross-career simulation

**Monday — venue choice:** Amaka has a venue company operating a leased 50-capacity club. Kemi is an independent artist who wants a first headline show. She could buy an available city short-hire block at ₦6,000, but chooses Amaka's operator-listed package for its lighting and reliable reputation. Venue cost appears as the operator's hire offer, not a second city charge. Kemi pays/holds the price, and the date becomes unavailable to other organisers.

**Tuesday — real commitments:** Kemi invites Dami as a guest. Dami accepts an explicit ₦4,000 guaranteed slot and permitted songs. Kemi cannot advertise his name as confirmed before he accepts. Kemi hires Ada, freelance promoter, with separately reserved F/P amounts. A fan who has never owned a business can still buy a ticket after publishing.

**Wednesday — stage planning:** Kemi visits the venue. She physically arranges her saved stage template, selects two tracks and tests the lighting. A musician with an unreleased Friday song can rehearse only under applicable restricted preview rights; a public show may not bypass the release embargo. Amaka inspects compatible equipment and cannot remove the paid lighting package before the gig without equivalent substitution.

**Thursday — honest promotion:** Ada prints a poster at the promotion desk and places it in a permitted public slot. Twelve players inspect the poster; four decide to buy tickets. These are distinct verified actions. Ada receives proof of delivery, not fabricated streams.

**Friday — Release House:** New songs go live at their scheduled Release Friday time. A label executive discovers Kemi's music. Fans save songs, but the game does not turn 100 poster views into 100 listens. Dami's funny track can be saved and performed just as a professionally mixed recording can.

**Saturday — event:** Kemi's show doors open. Twenty-four genuine fans check in, some with friends. They hear the same event soundtrack, dance, follow artists, use optional collective cheers and receive a memory if they meet the presence requirement. Amaka witnesses what her gear changes physically. David, a record-label owner, watches the performance and considers an artist contract. Ada's event-promotion case records genuine interaction.

**Sunday — receipts and memory:** Tickets/refunds/service fees settle. Kemi sees an event profit or loss, verified `Tickets sold` distinct from `Checked-in humans`. Amaka sees venue hire income and retained weekly lease expense, never duplicate city rent. Dami sees an earned appearance fee if he fulfilled the accepted set. Ada sees delivery fee and any valid bonus after reconciliation. Fans keep memories; the label executive may make a real offer, not an automatic contract.

The same system also supports low turnout, cancellation, tech outage, rich organiser and zero-balance free-event paths without introducing additional professions.

## 33. Stress tests: low, high and adversarial demand

### Scenario A — Ten human players online

One compact public square and a small free city open mic are visible. Only four fans attend; two performers play one song each. Participants can walk/dance/chat and save tracks. The open mic still feels like a real small social gathering, not a failed imitation of 5,000 fans. No meaningful artist income is manufactured. Venue operator may choose a free community show for reputation, but its cash expense is real. The world routes players toward active experiences rather than dispersing them across an empty arena.

### Scenario B — Thirty-five paid tickets, twenty-four check-ins

Ticket gross, refund status and payout use **35** sales. Attendance history and performer-visible crowd count use **24** real check-ins. Per-song listening evidence is narrower still, based on actual opted-in player playback. An organiser can legitimately profit on ticket sales despite no-shows; they cannot claim 35 dancing humans. A promoter attendance bonus applies only to qualifying verified check-ins, not sold tickets, unless the contract separately and expressly selected a verified sales metric permitted by the promoter rules.

### Scenario C — Rich label buys a massive arena on day one

A label may be wealthy enough to rent a V4 or V5 public arena block and stage expensive production. But the effective V1 shared ticket cap remains **safe 20–50 humans** or smaller by load test; the interface warns that 2,000 graphical seats do not create 2,000 sellable shared concert entitlements. Equipment costs can be huge, audience may be tiny, and a loss is plausible. For launch, discourage unavailable arena templates until large-format session technology and population both support them; retain the asset tiers and prestige roadmap without mis-selling the experience.

### Scenario D — Headliner disconnects after opening song

Server records actual delivered song duration and reactions. The event is temporarily paused. The organiser may use an expressly accepted fallback, a reschedule offered to ticket-holders or cancellation/partial-delivery remedy. If programme is materially truncated, correct refund policy triggers. An absent artist never earns a second fee from reconnect and cannot be replaced by a fake human avatar. Fans retain truthful memory of what they actually experienced.

### Scenario E — Failed promoter/organiser and refund pressure

A promoter publishes a show as organiser with 30 pre-sold tickets, then their agency winds down. Ticket liability remains separate and fans receive a full refund if the event cannot be performed. A hired promotional supplier gets only verified earned milestone fee, not automatic bonus from purchased-but-unredeemed tickets. The venue supplier keeps only the previously disclosed cancellation amount if it supplied its reservation service and was not at fault. Any leftover organiser reserve returns to the correct account after reconciliation; no negative balance created by invisible system decisions.

## 34. Daily play depth without grind

| Session length | Organiser | Artist/performer | Venue operator | Promoter | Fan |
| --- | --- | --- | --- | --- | --- |
| **5 minutes** | Check an event quote, accept/reject a slot | Preview setlist, reply to invitation | Check date availability, test a light | Place one approved poster | See friend's invitation, save a track |
| **15–20 minutes** | Book small room and guest, publish | Rehearse 1–2 tracks | Adjust seating, open door/showcase | Build a district plan or host listening | Attend short open mic, dance |
| **45–60 minutes** | Run and settle a headline show | Perform, greet fans, make collaborations | Host event, see audience, manage costs | Operate publicity, experience result | Join group, attend concert, socialise |

**No artificial job class:** Someone can own a record label and play their own set. A fan can make a beat and become a producer-for-hire without another business registration. A promoter who owns an agency can enjoy a concert as an ordinary audience member. All standard events use the same actual venues, programme and economic engine.

## 35. Implementation phases and launch gates

**Phase 0 — deterministic solo/multiclient test harness:** Reserve one unique 50-cap venue-day; support a payer, artist, fan and venue operator simulator with a correct ledger, truthful sold/check-in counts, mandatory rights validation and cancellation/refund reconciliation. Tests must reproduce same result across retries.

**Phase 1 — one genuinely enjoyable show:** Build a physical Booking Desk, Show Board, Stage Mode, ticket door, one released song, one accepted headliner, private event audio, group/fan reactions and post-show memory. Test with **5, 10, 20 and 50 real human testers** at differing phone/network quality; track whether people voluntarily return.

**Phase 2 — cross-business activity:** Add leased venue hire and equipment, label-funded artist headline shows, label-run discovery night, promoter F/P/B contracts and one explicit backer transaction. Confirm that financial dependencies are isolated but lead to shared experiences.

**Phase 3 — content + public calendar:** Add open mic, producer showcase, community listening and Release Friday celebrations, stronger safety and moderation, approved previews, event recommendation and multiple unique venue calendars. Test low turnout honestly.

**Phase 4 — scale carefully:** Only increase per-show human cap after load, synchronisation, safety, rights and refund tests pass. Bigger visual venues and award spectacles are a separate launch gate; they do not justify imaginary ticket revenues.

**Release blockers [D]:** No fake audience; reliable right-to-play checks; stable audio shared timeline; real receipt/refund conservation; no double-sale of venues; no nonconsensual performer avatar puppeting; credible low-population social experience; safety controls; legal review of user music rights, age and refunds; platform boundary without invented third-party wallet APIs.

## 36. Acceptance test catalogue (55 tests)

| ID | Test input or action | Required observable result |
| --- | --- | --- |
| AT-E01 | Artist with no business registers a valid event | Allowed if venue and costs are funded; organiser=artist individual |
| AT-E02 | Artist owns a different company and rents a city show | Allowed without registering a second company |
| AT-E03 | City venue has an operator-covered day | City public short-hire disabled; only operator's offer or own event |
| AT-E04 | Two users simultaneously confirm same venue/day | Exactly one success, one refund/no charge |
| AT-E05 | Browser hold abandoned for 11 minutes | Block automatically released |
| AT-E06 | Operator tries to sell day after prepaid lease end | Forbidden before future coverage exists |
| AT-E07 | Artist books operator venue | Payment goes to operator supply contract, not NPC plus operator |
| AT-E08 | Venue operator self-organises | No second rent debit beyond existing lease payment |
| AT-E09 | 50 cap venue, safe server cap 30 | At most 30 admission entitlements sell |
| AT-E10 | Event open mic has 5 confirmed acts | All are part of one public booking/ticket event |
| AT-E11 | Organiser advertises unaccepted celebrity guest | Block publication of confirmed appearance claim |
| AT-E12 | Performer accepts fee but no funds available | Offer cannot reach `ACCEPTED_FUNDED` |
| AT-E13 | Artist double-booked in same live timeslot | Conflicting confirmation blocked or explicit reschedule required |
| AT-E14 | Unreleased track selected for public full-play set | Deny playback; approved private preview separately controlled |
| AT-E15 | Released licensed track at public show | Permitted playback with proper song ID |
| AT-E16 | Song taken down before show | Remove and trigger show readiness/material change check |
| AT-E17 | Artist has no microphone | Recorded-set performance works |
| AT-E18 | Performer doesn't attend after 10 min grace | No-show or preauthorised labelled fallback, not fake avatar |
| AT-E19 | Paid headliner cancelled | Fans offered correct material-change/refund remedy |
| AT-E20 | Paid ticket buyer joins after show began | Sees current live timeline, no restarted private copy |
| AT-E21 | Two devices use one ticket | One active occupant only, one attendance record |
| AT-E22 | Ticket charge retry with same idempotency key | One debit, one valid admission ticket |
| AT-E23 | Paid tickets sell out | More sales blocked; waitlist does not charge |
| AT-E24 | Ticket voluntarily cancelled >2h before start | Full refund and inventory released exactly once |
| AT-E25 | Ticket voluntarily cancelled <2h before start | Default no-refund message, subject to material-change exceptions |
| AT-E26 | Event organiser cancels pre-delivery | 100% buyer refund, no retained test processing fee |
| AT-E27 | Event material rescheduled after tickets sold | Opt-in retain or refund; no silent date migration |
| AT-E28 | Venue supplier fails to open | Hire remedy and fan remedy; no fake delivered venue fee |
| AT-E29 | Headliner never performs | Full ticket remedy if show doesn't deliver billed headliner |
| AT-E30 | Partial concert <75% programme but headliner performed | Predeclared 50% partial remedy or lawful greater remedy |
| AT-E31 | 35 sales but 24 human admissions | Sales=35, attendee count=24, never conflated |
| AT-E32 | Fan mutes shared audio | Still can check in, no automatic qualified song listen |
| AT-E33 | Fan streams personal soundtrack simultaneously | Event audio focus resolves without mixing public streams |
| AT-E34 | Fan leaves/rejoins three times | One checked-in human, accumulated valid attendance minutes |
| AT-E35 | Fan active 5 minutes during show | One eligible history card only |
| AT-E36 | Ambient NPC dances at event | No ticket, fan, check-in, voting or money credit |
| AT-E37 | Organiser has ₦0 for mandatory vendor reserve | Publishing paid ticket sales blocked |
| AT-E38 | Event tickets not yet delivered | Gross revenue held, no organiser spending of deposits |
| AT-E39 | Organiser cancellation with performer guarantee | Only pre-funded disclosed cancellation portion paid |
| AT-E40 | Service ticket fee on full refund | No retained 3% fee |
| AT-E41 | Price ₦1k and 19 sales against ₦18k costs | Profit +₦430 at 3% fee |
| AT-E42 | Label-funded artist event completes | Project recoups actual covered costs once, positive split once |
| AT-E43 | Label-hosted roster showcase | Does not also skim artist-label profit on same organiser receipts |
| AT-E44 | Promoter self-organises and self-invoices | No fictitious F revenue/expense allowed |
| AT-E45 | Promoter ticket bonus with fake/void check-ins | Bonus excludes invalid check-ins and unpaid/refunded cases |
| AT-E46 | Venue lease owner winds down before future sold block | Cannot bypass booked obligations; refund/reassignment available |
| AT-E47 | Artist personal balance zero, city open mic scheduled | Can apply/attend and perform without business registration |
| AT-E48 | Low population four attendees at free open mic | Genuine four-person event; no fake sold-out status |
| AT-E49 | Organiser changes venue while tickets sold | Attendee consent/refund path plus capacity revalidation |
| AT-E50 | Friend group requests impossible extra seats | Does not oversell; truthful alternative shown |
| AT-E51 | Event chat harassment reported | Block/report/mute action and auditable moderation outcome |
| AT-E52 | Unsafe stage effect requested | Not executed on incompatible or restricted device/venue |
| AT-E53 | Rights complaint during Stage Mode | Audio suspended, incident documented, remedy recalculated |
| AT-E54 | Official award event cloned by normal user | Reject official event type/branding |
| AT-E55 | Outage retries `SettleEvent` repeatedly | Exactly one payout/refund/fee series, invariant totals preserved |

## 37. Analytics, health metrics and player-experience evaluation

**Event funnel:** `venue_viewed → block_held → hire_paid → programme_ready → event_published → tickets_available → ticket_purchased/free_reserved → door_checked_in → attendee_active → set_started → set_completed → event_ended → refund_resolved → event_settled`. Measure each drop-off separately. Core commercial figures: booked blocks, prepaid venue obligations, gross ticket receipts, refunds, organiser expenses, earned supplier fees, actual organiser net result, promoter bonus validity, all ledger reconciliation mismatches (target zero), oversold inventory incidents (target zero).

**Social signals:** attendee-to-friend-group ratio, median real humans on dance floor, new voluntary artist follows, saves from *opted-in eligible* listening, returning concertgoers, reported harassment frequency, successful friend co-location, audio opt-in and mute rate, average join/reconnect time. These help improve human enjoyment without creating fake user-facing follower totals.

**Technical budgets [D for prototyping]:** 95% of entitled joins into a not-full room succeed without double-entry; actual targets for latency, start-sync skew, download sizes, server and mobile frame-rate must come from real low-end devices, not guesses in a GDD. Finance, entitlement and rights correctness have no tolerated silent error budget. An event is not ready for production until crash/rejoin, refunds and multi-client tests pass on slow mobile networks.

**Economic calibration:** Keep venue tariff anchors from Venue v0.3 and 3% test fee from H-Path v0.2 until one shared Economy & Contracts table changes them. Review ticket-price affordability relative to the quantity of game money real human players can earn. Model currency **sources and sinks** openly: city jobs and grants must have treasury rules; ticketing mostly redistributes existing player currency; lease and equipment prices are sinks/providers, not automatic real-life value. Do not claim the game has a credible concert economy merely because example break-even maths works.

## 38. Cross-chapter reconciliation and implementation order

| Source chapter | Rule retained | Chapter 6 implementation consequence |
| --- | --- | --- |
| H-Path v0.2 | One avatar, one company, activities are universal | `organiser` is event role, not another class |
| Venue Operator v0.3 | One unique public venue ID; prepaid lease; 24h event block; 50-seat ₦6k test hire; 3% test ticket fee | Unique calendar + fair booking + no double rent |
| Artist v0.4 | Real/song-builder recordings; Release Friday; artist autonomy; headliner/guest; virtual shows | Stage Mode supports imported and simple music; preview embargo enforced |
| Record Label v1.0 | Reserved artist budgets; project recoup; label self-run shows are distinct | Linked `project_id` and one receipt waterfall |
| Promoter v1.0 | Freelancer/agency; F/P/B; real poster placements, no guaranteed results | Promoter gets verified delivery, never ghost audience |
| Fan & Social v1.0 | Universal fandom, friend groups, authentic memories, audio source separation | Single human event admission/now-playing/history source |
| Future Charts chapter | Qualified song engagement is distinct from event attendance | Event emits evidence; does not assign arbitrary chart points |
| Future Economy chapter | Central ledger, company commitments, bankruptcy | No parallel event wallets, immutable refunds and provider boundaries |

**Implementation sequence:** (1) Event identity, venue block and single financial organiser, (2) contract/ledger and ticket holds, (3) physical player journey and approved song Stage Mode, (4) single 20–50-person room with trustworthy check-in/audio, (5) refund and safety incident branches, (6) promoter/label/venue operator cross-project payouts, (7) award ceremony template and limited special events. Venue and fan chapter tests must be repeated after each event-service change.

## 39. Final working decisions and external gates

**Settled as V1 gameplay baselines [D]**: 06:00–06:00 venue event day; one independent public ticketed show per block; one financially liable organiser; hold ticket receipts until delivery; exact ticket voluntary refund and material-change policy; simple 10-minute checkout hold; pre-funded performer guarantee; 10-minute no-show grace; transparent prerecorded fallback; truthful ticket cap tied to actual server; Stage Mode with cleared recordings; five-minute attendance memory rule; 3% provisional ticket sink; explicit provider/organiser cancellation schedules; low-population community events; one event/one waterfall; official awards reserved to THE SCENE. These are concrete defaults, not proof of production readiness.

**Externally unresolved [X]**: artist/song public performance and UGC licensing; loop/AI music downstream rights; legal consumer/refund obligations; age-gating and moderation operations; actual production device/server concurrency; official third-party SDK permissions; real-money payments (not part of initial simulated economy); rights-takedown processes; data privacy and retention. The game can be prototyped before all of these are final, but public launch of the implicated feature cannot be claimed cleared without them.

**Explicitly deferred [F]**: 5,000-human synchronised arena concerts, pooled anonymous speculative investments, sellable ticket resale/secondary markets, hourly split of the same venue into multiple ticketed shows, multi-venue companies, executive employee hierarchies, real-money event ticketing, full live microphone concerts and automatic professional royalty accounting.

### Handoff to Chapter 7 — Music Discovery & Charts

Events generate **evidence**, not chart points by decree. The next shared chapter must decide what qualifies as an individual song listen in personal, shared and Stage Mode contexts; how repeated plays diminish; exactly when local and Lagos charts close/publish; how artist discovery surfaces remain fair to new music; how playlists, time in background, fraudulent loops and songs removed after release affect rankings; and how concert discovery generates legitimate demand without buying popularity. All these systems must reference the canonical event IDs, real person presence and cleared music permission established here.

---

*THE SCENE • Chapter 6 • Concerts & Shared Events v1.0 • End of working specification.*
