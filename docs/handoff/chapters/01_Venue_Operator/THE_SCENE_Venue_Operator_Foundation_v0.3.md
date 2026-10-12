# THE SCENE
## Venue Operator Business — Foundation & Decision Register

**Document ID:** TS-GDD-VEN-001  
**Version:** 0.3 | **Date:** 11 October 2026  
**Purpose:** Standalone, durable venue-business design reference for future detailed gameplay and engineering specifications.  
**Status:** Foundation design. User-confirmed decisions and designer recommendations are explicitly separated. Not yet an executable technical specification.

> **Design promise** — A player can start by renting a small venue, make distinctive creative and commercial decisions, attract artists and audiences, suffer real financial losses, and eventually run a celebrated venue without ever needing to become an artist or build a stadium. Music discovery and promotion, not construction for its own sake, is the heart of the game.

## 1. Scope, context, and decision discipline

THE SCENE is an independent, own-domain, mobile-first, avatar-based 3D music-industry life simulator. Players move through a distinct entertainment world, socialise, discover real, cleared music, and participate in businesses and events. Lagos Life account/avatars/wallet are *future intended integrations*, contingent on published APIs. An independent player can start at zero and earn through authorised introductory opportunities. Every player can also be a fan and spectator.

This chapter defines the **venue business**, including direct event rentals, leased venue operations, equipment, costs, contracts, performance, leaderboards, failure, large-wealth play, NPC support, and the route to prestigious awards venues. It retains the shared Friday release cycle, Sunday/social programming, real-player ticket demand, real songs, concerts, auditions and the wider artist–promoter–label–investor–fan economy. It does *not* define the complete artist, promoter or wallet API implementation; those belong in linked chapters.

**Status key**

- **CONFIRMED (C):** Explicit user decision or firmly repeated game requirement.
- **PROPOSED (P):** A specific expert-design recommendation recorded for approval. Fully described here so later agents can implement it if approved.
- **EXTERNAL (X):** Depends on Lagos Life API, platform permissions, music rights, or observed playtest evidence.
- **FUTURE (F):** Deliberately excluded from first playable version but preserved as an extension point.

**Source-of-truth order:** newest *explicit user decisions* take precedence over older suggestions; firm game principles from H-Path v0.1 and the seven-day simulation remain unless contradicted; this document records corrections rather than silently dropping earlier ideas. Design ideas and price examples are never presented as proven real-world market prices.

## 2. Locked vision and venue-specific decisions

| ID | Decision | Status | Consequence |
| --- | --- | --- | --- |
| VEN-01 | Unique public identities for venue locations, rather than anonymous duplicate public venues. | C | One public venue has a recognisable name, location, calendar, record and reputation. |
| VEN-02 | Launch venue buildings are prebuilt; player fun comes from music, event programming, operation and improvement, not constructing walls. | C | Physical world provides usable venues at multiple scales. |
| VEN-03 | Artists and other eligible event organisers can rent a venue directly for an event, without owning an operating company. | C | A solo artist may organise a headline show, with guest artists if booked. |
| VEN-04 | A venue-business operator leases a venue to operate it, rather than buying one-day admission repeatedly. | C | Long-term business control and reputation; rent remains a cost. |
| VEN-05 | Record labels and promoters may also book venues for authorised music events. | C | Event organisers do not all require venue-owner profession. |
| VEN-06 | Venue fixtures start basic; users improve stage, chairs, sound, lighting, decoration and experience with virtual spending. | C | Purchases visibly change the space and capability. |
| VEN-07 | Equipment quality uses understandable 1–10 ratings, relative to venue size/use. | C | A 50-seat room can have 10/10 sound for a 50-seat room. |
| VEN-08 | Operating losses, rent and expenses are deducted and can make businesses insolvent. | C | No guaranteed passive income. |
| VEN-09 | NPC-operated store/market offers equipment and services. | C | Gameplay doesn't depend on another player being online. |
| VEN-10 | One player may own one company in V1; business and personal funds are distinct, owner controls company money. | C | No joint owners, complex staff spending roles or unbounded approvals in V1. |
| VEN-11 | A business can eventually be sold, with its identity and history respected. | C | V1 proposal: sell operating business/assets, *not* city-owned land. |
| VEN-12 | THE SCENE HONORS (working original awards identity) occurs roughly four times yearly; an elite qualifying venue can host. | C direction | Hosting is prestige and paid work, not something money alone guarantees. |
| VEN-13 | Connected Lagos Life players ultimately spend permitted existing game naira; independent players can work from zero. | C direction / X technical | No assumption of already-accessible wallet APIs. |
| VEN-14 | Actual cleared songs and real human discovery are the commercial/cultural core. | C | Events produce genuine fans and opportunities; NPCs don't fabricate demand. |

**Clarification that resolves an earlier ambiguity:** **Event rental** and **venue-business leasing** are two different contracts. An artist, promoter or label may book one event without becoming a venue operator. An operator pays to control a public venue for a longer term and can both stage their own events and accept third-party bookings.

## 3. The physical venue market

### 3.1 Unique public venue identities

A public venue has a stable `venue_id`, name, district, address/position in the game's map, eligible event types, physical capacity, property tier, default fixtures, operating condition, calendar, public history and public ratings. It is not duplicated as several competing *public identities*. A venue may host multiple synchronised **event instances** for technical scale later, but those instances remain the *same named venue and same public event*.

**C / P distinction:** The uniqueness of public venue identities is confirmed. Proposed V1 rule: one active operating lease per public venue at a time; event booking rights are exclusive over the booked performance space and time block. Buildings may share 3D art templates to reduce production cost, but not public identity or booking calendar. Venues exist in a compact entertainment district first, expanding only when population warrants.

### 3.2 Proposed property catalogue and initial economy anchors

| Tier | Example type | Ticket cap | City short-booking base / 24h | Operating lease, 7d prepaid (70%) | Typical purpose |
| --- | --- | ---: | ---: | ---: | --- |
| V0 | Practice/performance room | 30 | ₦3,000 | ₦14,700 | Auditions, rehearsal, acoustic sets |
| V1 | Underground music lounge | 50 | ₦6,000 | ₦29,400 | Open mic, talent hunt, intimate gig |
| V2 | Live music hall | 150 | ₦18,000 | ₦88,200 | Emerging-artist concerts, label nights |
| V3 | Premium concert centre | 500 | ₦80,000 | ₦392,000 | District headline shows, premium productions |
| V4 | Major entertainment arena | 2,000 | ₦400,000 | ₦1,960,000 | Festivals, major multi-artist lineups |
| V5 | Landmark arena | 5,000 | ₦1,600,000 | ₦7,840,000 | Citywide concerts, qualifying awards ceremony |

**P — Pricing is an opening balance fixture, not a researched Lagos Life price list.** It intentionally makes one-off access easier than business ownership, while providing long-term operators a discount *in exchange for exposure to idle-day costs*. Money has no real-world monetary value. Ticket caps are maximum valid admissions, never predicted demand. A venue must not claim 5,000 paid attendees because 5,000 NPCs render on screen.

**V1 simplification:** A public space is reserved in **one 24-hour event-use block** (fixed period shown at booking). One headline show can occupy a block; it may contain opening acts and multiple performances. The lease holder may also organise free hangouts within unreserved times, subject to venue and server policies. Multiple independent paid public shows in one block are deferred until a safe hourly schedule model exists.

### 3.3 Venue uses and formats

The same venue may permit several event templates: open mic, audition, talent hunt, recording showcase, producer night, listening party, fan meetup (only with artist/authorised organiser involvement for *official* artist events), small concert, headliner-and-guest show, label showcase, festival, and award event where tier and technical requirements qualify. Each template has its own performer slots, average duration, production requirements, ticketing options and suitability checks.

## 4. Two commercial models: event booking and operating lease

### 4.1 One-off event booking

**Who can initiate?** Artist, promoter, record label, or any eligible player organising a music event. An investor may organise personally but financing alone doesn't automatically make them the organiser. Artist can directly rent venue and headline with agreed guest performers.

**Flow:** inspect venue → choose available 24-hour block → receive all-in rental quote and event prerequisites → authorise payment/reservation → configure event and lineup → arrange promotion/production → open ticketing → host or cancel under published terms → settle and archive.

If the venue is **not under an operating lease**, the **NPC city property office** accepts the booking at its displayed base rate. If a player operator holds the venue lease, the organiser books through that operator's **published event-hire offer**, not a parallel city reservation. This prevents double-booking and gives a venue business customers. The operator may charge a different published rate, subject to transparent limits and no retroactive repricing.

**P:** Price quote freezes when paid. Tentative 10-minute checkout holds expire automatically; holds are not publicly advertised as confirmed shows. A confirmed booking blocks the period for other bookings. Payment must be validated on the server and idempotent.

### 4.2 Venue operating lease

**Who can initiate?** A player with their one eligible business slot available, or an existing venue-operating company moving locations. For V1: one **flagship operating venue per venue company**. Larger chains are a preserved future system.

**P:** City office offers 7-day prepaid leases at 70% of the cumulative day rate and 28-day leases at 60%. Leases begin at an explicit timestamp, and owner selects whether to renew. No silent unlimited automatic debit. Operators carry daily baseline utility/maintenance costs in addition to prepaid rent. The operator can set a public name/brand, design the interior using compatible assets, create own events and publish paid booking blocks to external artists/promoters/labels. Their ability to resell booking access comes from the operator lease's *explicit sub-booking permission*.

**Critical obligation:** An operator cannot sell an event booking beyond their confirmed lease coverage unless they have already prepaid/renewed coverage through that date. Existing paid customer bookings survive ordinary operator log-off. If an operating lease must terminate early, booked customers follow a city-backed fulfilment/reassignment or refund process before operator funds/assets are released.

### 4.3 Why not permanent building ownership at launch?

**P:** The physical property itself is controlled by THE SCENE's virtual city, not permanently owned by players in V1. Players own (a) a venue-operating company/brand, (b) its earned history/reputation, (c) portable inventory and business funds, and (d) finite lease and customer-contract rights. This keeps locations legible and avoids permanent scarcity lock-up. Outright real-estate ownership and construction are future possibilities, not implied V1 mechanics.

### 4.4 Operators renting to other players

Operator picks an available block, selects the venue-hire package (space only / standard production / premium production), sets a quote and publishes availability. Artist books and pays; operator receives due proceeds subject to reservation settlement. Operator **does not pay the city rent a second time for its own event**: lease rent is company overhead, not a second event-line rental. If they rent to a third party, the third party pays the **operator** as the venue supplier; city rent remains operator's underlying expense.

## 5. Equipment: purchase, rental, quality and physical gameplay

### 5.1 Ownership principle

**P answering the player's unresolved equipment question:** Players can **both buy and rent equipment**. Purchasing is costly but durable; renting is cheaper for temporary or first-time events. No player is forced to perpetually rent every object. The NPC store, called **Stage Supply** provisionally, sells and rents equipment. Players may keep permitted purchased inventory after moving venues or ending a lease; rented inventory returns after its booked term. All virtual ownership is subject to THE SCENE/platform terms, not ownership of real objects.

### 5.2 Baseline and score categories

Every prebuilt venue has functioning default fixtures, typically low quality (e.g., sound 2/10, lighting 2/10, stage 2/10, seating 3/10, interior 2/10, audience facilities 3/10). Players can operate small eligible events without buying anything. Ratings are specific to **facility category AND venue-size class**; a top-grade 50-seat sound kit may score 10/10 in V1 but score poorly or be incompatible when used in V4. Ratings are maximum physical capability, not earned reputation.

| Category | What upgrades enable | Not directly guaranteed |
| --- | --- | --- |
| Sound | Clearer in-game mix, higher production-quality potential, more complex performance formats | Extra listens, automatic chart points |
| Lighting | More synchronised stage effects, better presentation | Guaranteed positive ratings |
| Stage | Guest-artist positions, performance sets, show configurations | More fans by itself |
| Seating/layout | Comfort, crowd navigation, eligible arrangement options | More ticket sales than actual purchases |
| Interior/decor | Distinctive identity, photos, aesthetics, guest perception | Automatic cultural influence |
| Audience facilities | Safe entrance/exit flow, queue experience, event readiness | Higher physical seat count without an approved larger venue |

**P:** The equipment store gives simple **Fits / Too small / Incompatible** labels. Upgrade score is computed from installed eligible pieces; players cannot stack ten weak speakers to claim tier 10. Facility rating can be displayed as `Lighting: 7/10` with a short explanation of what the score allows.

### 5.3 Example Stage Supply price anchors (50-seat venue)

| Item/package | Rating when installed | Buy outright | Rent 24h | Design role |
| --- | ---: | ---: | ---: | --- |
| Basic fixtures | 2–3/10 | Included in venue | Included | Immediate playable events |
| Better lights | 4/10 | ₦8,000 | ₦1,000 | Low-cost first upgrade |
| Good lights | 7/10 | ₦45,000 | ₦3,000 | Intermediate project |
| Premium lights | 10/10 | ₦180,000 | ₦11,000 | Long-term specialisation |
| Better sound | 4/10 | ₦12,000 | ₦1,200 | Everyday quality improvement |
| Good sound | 7/10 | ₦65,000 | ₦4,000 | Concert-quality audio options |
| Premium sound | 10/10 | ₦260,000 | ₦16,000 | Premium intimate-stage production |
| Seating/design pack | 6/10 | ₦20,000 | ₦2,000 | Visual comfort and venue character |
| Stage package | 7/10 | ₦75,000 | ₦5,000 | Headliner-and-guest configuration |

**P:** Larger venues use **distinct compatible SKUs** and higher absolute costs, not a single universal “₦180,000 = lighting 10/10 anywhere” purchase. Initial SKU prices are configuration values, protected against accidental post-purchase repricing. Rented equipment requires upfront rental payment; damage or non-return penalties only if disclosed and authorised. Never automatically bill real-world money.

### 5.4 Physical interaction: buying, placement, changing layout

Enter Stage Supply physically or through approved store app → compare equipment → see visual preview and compatibility → buy or rent → inventory receives item → walk into leased/booked venue → choose **Arrange** → simplified top-down room planning overlay → drag objects to allowed snap zones → preview stage sightlines, safe routes and quality → save. Players can walk around their revised 3D venue to inspect changes. Expensive assets have visible stage effects during real shows; quality is not merely a number.

**P anti-repetition:** After one successful beginner stage setup, save presets; subsequent events can restore preset with one action. Other presets can be bought/earned but do not increase technical capability beyond actual equipment. NPC technician can install an already authorised kit for a small fee. Show preparation remains an optional skill expression, not forced labour for the fiftieth event.

### 5.5 End-of-term inventory

When a lease or event booking ends: purchased compatible items become **stored in inventory**, not confiscated; rentals are returned; presets remain saved. Failed item retrieval due to disconnect is repaired on server reconciliation. If the business is being sold, the seller explicitly chooses whether transferable inventory is included; ongoing event obligations must remain covered. Structural modifications are out of scope for V1.

## 6. Pricing model: clear, testable and non-punitive

### 6.1 Price design goals

A new player can progress through free introductory work and small gigs. One-off event access is less financially risky than maintaining a venue business. An operator can make money from smart programming and a loyal audience, or lose money from rent and low bookings. Billionaires have substantial premium projects to finance, but no guaranteed venue ranking or chart position. Price complexity exists in the simulation; players see concise quoted costs, expected sell-through bands and a break-even ticket count.

### 6.2 Initial economy knobs (designer recommendations)

| Parameter | V1 proposed default | Rationale |
| --- | --- | --- |
| Event booking | 24h block, tier-based city rate | Simple scheduling and prepayment |
| Operating lease | 7d × 70% of 24h base, prepaid | Discount for taking vacancy risk |
| Extended operating lease | 28d × 60% of 24h base, prepaid | Lower cost but larger upfront risk |
| Base venue overhead | V1 lounge ₦500 per 24h active lease | Ongoing cost even without events |
| Ticket transaction fee | 3% of eligible ticket gross in test ledger | Optional currency sink; **not** a Lagos Life fee claim |
| Starting 50-seat ticket suggestion | ₦500–₦1,500 | Gives understandable unit economics |
| Event booking deposits | Full rental amount when confirming V1 booking | Avoid postpaid bad debts |
| Renewal | Explicit and prepaid | No surprise rent collection |
| Overdue obligations | Stop new commitments; settle lawful/authorised existing dues | No hidden negative personal wallets |

The 3% fee is a fixture for testing, not an externally verified charge. Before connected launch, we must avoid adding platform-controlled fees without permission. Adjust all parameters through a versioned config with event/economic analytics; don't silently change active contracts.

### 6.3 Worked example A: artist rents an unleased 50-seat lounge for one day

| Expense or income | Game naira |
| --- | ---: |
| NPC city 24h venue hire | −₦6,000 |
| Event staff/utilities | −₦1,000 |
| Additional production | −₦2,000 |
| Promoter | −₦3,000 |
| Artist fee / guest guarantee | −₦4,000 |
| **Total cost** | **−₦16,000** |
| Ticket price | ₦1,000 |
| Fee per ticket (3%) | ₦30 |
| **Net per actual ticket** | **₦970** |
| **Break-even admissions** | **17 real paid tickets** |

Real ticket outcomes: 5 tickets → ₦4,850 net sales − ₦16,000 = **−₦11,150**. 17 tickets → ₦16,490 − ₦16,000 = **₦490**. 35 tickets → ₦33,950 − ₦16,000 = **₦17,950**. 50 tickets → ₦48,500 − ₦16,000 = **₦32,500**. A performer booked at an additional fee, more production or lower prices changes break-even. If the artist headlines alone and does not pay an external appearance guarantee, remove that line, but their time is not magically converted to cash income.

### 6.4 Worked example B: 50-seat venue operator, one-week lease

Operating lease: ₦6,000 × 7 days × 70% = **₦29,400** prepaid. Daily baseline overhead: ₦500 × 7 = **₦3,500**. Each owner-operated show adds **₦10,000** in performers/promotion/event production. Average ticket price ₦1,000, test fee 3%. All income below comes from *distinct actual ticket purchases*, not NPCs.

| Owner-hosted shows in week | Real tickets per show | Total net ticket revenue | Lease + overhead + show cost | **Weekly business profit / loss** |
| --- | ---: | ---: | ---: | ---: |
| 0 | 0 | ₦0 | ₦32,900 | **−₦32,900** |
| 1 | 30 | ₦29,100 | ₦42,900 | **−₦13,800** |
| 2 | 30 | ₦58,200 | ₦52,900 | **+₦5,300** |
| 3 | 30 | ₦87,300 | ₦62,900 | **+₦24,400** |
| 2 | 12 | ₦23,280 | ₦52,900 | **−₦29,620** |

**Interpretation:** A multi-day operating lease is a commitment, not a free money generator. The operator must build enough genuine demand and/or rent out idle event blocks. A business with poor bookings may be insolvent despite attractive decorations. The example does not count one-off upgrade purchases, refunds, insurance-like buffers or sponsorships; those must be itemised separately when present.

### 6.5 Worked example C: operator earns from third-party room bookings

For an operator paying ₦32,900/week combined rent and baseline overhead, suppose their public room-hire price is **₦10,000 per exclusive 24h block**. If they sell three blocks to independent artists/labels and host no own shows, gross room-hire revenue = ₦30,000, producing a **₦2,900 weekly loss before any room-hire handling fees or extra service costs**. Four booked blocks = ₦40,000, producing **₦7,100 gross operating surplus before those extra costs**. The operator may set different prices, but advertised bookings show exactly what's included. They cannot guarantee a customer will buy by holding a venue.

### 6.6 Pricing calibration and protective tests

**P:** Before playtest, target a basic newcomer job paying around **₦1,000–₦2,000 per short completed task** from a capped and authorised test treasury (not counterfeit connected-wallet funds). Two to six short jobs should give tangible purchasing power for small services, without automatically granting a 7-day lease. Track: percentage able to afford first event, time to first venue booking, venue utilisation, real occupancy, operating profit distribution, idle lease burn, number of bankruptcies by tenure, ticket willingness-to-pay, equipment purchases/leases, and currency sources/sinks. Rebalance only new offers; preserve existing contract quotes.

A small session earning cash should not overwhelm the economy; repeat-pay jobs need frequency caps and abuse detection. **P launch gate:** If 30-50 player concurrency cannot produce feasible paid crowds, free/low-price mini-events should carry the social loop; don't manufacture ticket income to force profitable venues.

## 7. Complete venue career loop and progression

**Venue operator core loop:** Find/lease venue → equip and style → programme relevant events → book collaborators → promote and sell legitimate tickets → host → settle and evaluate → improve or recover → repeat. Each cycle can start at a different point; the player need not stage a full concert every login.

| Session | Interesting player actions | Result |
| --- | --- | --- |
| 3–5 minutes | Inspect bookings, answer artist, compare item, save layout | Contract opportunity or visible improvement |
| 10–20 minutes | Scout Friday releases, select event template, hire promoter, price tickets, publish poster | Public programme and measurable demand |
| 20–40 minutes | Join hosted show, greet artists, supervise production, interact with attendees, view finale | Shared social event and settlement result |
| Weekly strategy | Analyse profits, reputation, returning audiences, venue identity and district competition | Better decisions, possible promotion or closure |

**P reputation dimensions:** technical readiness, event reliability, real attendee satisfaction, repeat audience, successful programming and discovery history. Keep **facility score**, **public venue reputation**, **economic profit**, **attendance**, and **cultural prestige** distinct. A 50-seat venue may be top talent-discovery venue without ever holding 5,000 attendees. Stage design supports specialisation: intimate high-fidelity sets, emerging-artist auditions, premium production, popular dance events, discovery-led showcases. Facility purchases unlock capability; good audiences and shows earn reputation.

### 7.1 Recurring venue programme

Small spaces: open mic, auditions, talent hunts, listening parties, producer showcases, acoustic sets, small shows, authorised fan meetups. Larger spaces: multi-act concerts, headline guests, label showcases, festivals. Landmark venues: citywide shows and **THE SCENE HONORS** hosting if vetted. V1 can support templates using the same event lifecycle, with different scale/quality checks.

### 7.2 Friday integration and opportunities

Release Friday premieres properly cleared artist songs weekly, one official song per artist per week. Players can follow artists and voluntarily listen, save and replay. Venue operators visit the Release Hall to scout releases, identify rising performers and invite them to auditions, opening nights or future shows. **Charts track eligible human engagement**, not paid venue inventory or NPC attendance. Friday becomes a recurring source of booking opportunities. Tours, future physical/virtual hybrid concerts and paid sponsored show inventory can be added later.

## 8. Event ownership, contracts and economic relationships

### 8.1 Clear roles per event

- **Venue supplier:** city (if unleased) or operating company (if leased); provides contracted space/facilities.
- **Event organiser / financial responsible party:** artist, promoter, label or venue operator; owns budget and ticket-event obligations.
- **Headline artist / guests:** performers who agree to music/performance use and fees.
- **Promoter:** player/agency contracted for genuine event discovery; may be hired by organiser *or venue business*.
- **Sponsor/investor:** separate funding roles with distinct written obligations and returns; financing doesn't imply event control.
- **Fan/ticket holder:** anyone, including a business owner or artist, attending as a person.
- **Automated DJ/playback:** NPC/game service with approved setlists, not a required player career.

If an artist rents a venue for their own headline show, that artist can be both organiser and performer. If a venue operator organises its own talent hunt, that operator is organiser and venue supplier. Labels may rent venues for roster showcases. Promoters may create a show, not merely accept other people's briefs. No dedicated V1 event-organiser avatar class is required.

### 8.2 One event lifecycle

Propose → verify eligibility/venue slot → reserve facilities and committed funds → confirm lineup/service contracts → publish approved event and shareable poster → sell tickets → run live show → count actual unique check-ins → settle ticket revenue/fees/refunds → store event history/ratings → permit follow-up offers. Explicit event states: `DRAFT`, `OPTION_HELD`, `RESERVED`, `PUBLISHED`, `LIVE`, `FINISHED`, `SETTLED`, `CANCELLED`, `REFUND_PENDING`, `DISPUTED`. Forbidden: treating a draft or expired hold as sold-out public event.

**P:** A seller can't withdraw funds already promised for performer guarantees or ticket refunds. Money movement is owned by an authorised event-ledger flow, not the virtual client's arithmetic. Contracts display price, date, obligations, payment timing and cancellation. Event organiser can't double-spend committed funds.

### 8.3 Events during absence

If owner offline: accepted future commitments remain in force; no new money is committed without authority. Preapproved playlist/recorded performance can operate an event *only if rights and bookings permit*; otherwise use cancellation/refund/rescheduling. NPC reception/check-in and technicians keep essential services active. Human attendees always retain the ability to leave, rejoin or be refunded under disclosed conditions.

## 9. Concerts and audience experience

**Why anyone attends:** actually enjoyable songs, friends, performer interaction, distinctive stages, collective anticipation, a chance to discover music, and optional social/rhythm activities. A concert is not an audio file playing while ticket holders stand still. Admission may be free or paid; both are important to early player growth. **Real audience** means verified human player entry; NPC figures are ambience and are never counted as paid attendance, award votes or human chart listens.

**P V1 show structure:** arrival and friends (2min), host/warm-up (2min), 2–3 performance segments (8–12min), audience choice/social finale (3min), optional hangout afterward. Performer may move/dance, trigger stage visuals and interact via preset emotes; live microphones optional/F. Event quality uses production readiness and genuine audience feedback; financial profit is separately reported. Show highlights and shareable posters must not fabricate attendance or chart outcomes.

**Capacity & concurrency:** A 50-seat ticketed event sells no more than 50 valid admissions. A venue may visually show extra NPCs for atmosphere but never extra sales. At scale, multiple technical instances can experience the same one booked event, with global unique ticket counts and check-ins reconciled server-side; friend parties should remain together when possible. One ticket must not yield duplicate event credit on reconnection.

## 10. Ratings, discovery, leaderboards and prestige

Venue public profile shows real capacity, equipment scores, next event, ticket terms, history, genuine attendance rate, reliable service rating, event genres, discoverable bookings, owner brand, public reviews from eligible attendees and badges. Ratings cannot be purchased directly. A premium 10/10 light kit unlocks lighting effects; it does *not* create automatic fame.

| Leaderboard | Qualifying basis | Anti-gaming rule |
| --- | --- | --- |
| Best live venues | Sustained genuine attendee ratings + reliability + production suitability | Minimum eligible real-attendance threshold |
| Most popular venues | Unique actual attendees and revisit behaviour in scoring window | No NPC or duplicate visits |
| Most profitable operators | Audited event/business net profit in window | Exclude treasury transfers as sales |
| Rising venues | Newer businesses, growth and reputation | Eligibility window and separate cohort |
| Talent-discovery venues | Hosted early meaningful performances by later-successful acts | Credit historical first qualifying showcases, no fake scouting |
| Premium production venues | Consistent show readiness and technical quality | Facility grade alone doesn't win |

**C direction:** Elite venues can aspire to host THE SCENE HONORS, a roughly quarterly original virtual awards event inspired by the prestige of Nigerian music award shows, but not branded as the real Headies. **P:** Hosting requires correct technical equipment, demonstrated reliable events, adequate verified access, and appropriate capacity; larger private player concerts can exceed awards scale without replacing the cultural prestige of the official ceremony. Host selection is transparent and can't be simply purchased. Ceremony can reward a hosting fee and permanent history plaque. Future hybrid real-world events are an extension point/F requiring streaming, rights, partner and payment infrastructure.

## 11. Bankruptcy, recovery and business sales

### 11.1 No passive guaranteed profit

Rent consumes available funds whether or not shows happen. Other sinks: baseline operating overhead, event fees, NPC service invoices, equipment rent or purchase, repairs/maintenance if advertised and authorised, marketing and staff. Revenue comes only from authorised real player ticket payments, genuine event-hire fees, permitted sponsorships and other valid sources. Transfers between player's personal and business ledger are *capital movements*, not profit.

**P financial stages:**

1. **Healthy:** uncommitted available business balance covers next known costs; report upcoming obligations clearly.
2. **At risk:** projected shortfall or limited cash runway; show warnings and ways to reduce exposure.
3. **Distressed:** can't authorise a new rental, booking, purchase or renewal; existing contracted obligations remain protected.
4. **Insolvent:** prepaid term ends or authorised obligations can't be met; automatically suspend new commitments, reconcile reserve/refund liabilities, release property after booked events handled, liquidate permitted assets or close business under displayed rules. Never secretly send player's personal wallet negative or apply real-world debt.
5. **Recovery:** player retains avatar, social identity and nonfinancial history, can accept public gigs, participate as fan, work as promoter/artist, later rent again or reopen an eligible company.

**P:** No indefinite auto-renewal or negative balance surprise. If user doesn't return, operator lease expires at prepaid term end; future client bookings must already be covered and fulfilled/reassigned/refunded, not silently cancelled. Cosmetic purchased inventory doesn't evaporate without clearly agreed transfer/loss rules.

### 11.2 Sell or exit

**C:** Players may sell their businesses. **P V1 sale:** entire operating company, its transferable brand/history, equipment chosen in the sale, and any assignable approved future lease/bookings. Physical **city-owned property is not sold**. Buyer must have an available V1 company slot. Outstanding bookings, protected funds and fees are resolved or explicitly assumed within platform-authorised sale flow; if any obligation can't transfer, sale is blocked until settled. A buyer can't rewrite historical reviews or award plaques; archive shows previous operator and effective date. Sales are prohibited during unresolved disputes unless an approved settlement path exists.

## 12. The billionaire: a separate but fair endgame

A wealthy Lagos Life user, once linked through permitted wallet API, can afford landmark venue leases, distinctive production, top-tier equipment, guest artists, sponsor a festival or finance ambitious show lineups. They don't bypass booking calendar, capacity, artist consent, verified attendance, charts or venue reputation. Their large events involve proportionally large commitments and risk. **There is no automatic “rich = famous” conversion.**

V1 still allows one venue-operating company per owner, so wealth concentrates *scale* in a flagship space rather than capturing every public property. Such players may rent another venue for a one-off show as event organiser if the game allows non-overlapping contractual capacity; they cannot acquire a second operating company in V1. Compete through memorable events, strong sound/lighting, the most respected private festival, prestigious official honours hosting. Wealthy people can finance unsigned talent's shows without controlling their career.

## 13. NPCs, economy safety and future Lagos Life connection

The NPC **city property office** lists unleased 24h event bookings and operating leases; **Stage Supply** sells/rents gear; **technical crew** handles routine show preparation; **NPC front-of-house** handles admissions and scheduled recorded playback; **NPC event board** supplies modest early work. NPC patrons are background visual population, not cash buyers or valid award voters. NPCs can give paid tasks only through a capped, authorised treasury; if connecting to external wallet disallows such reward issuance, no connected game naira is created.

The game is hosted on our own domain. Use provider-agnostic account/identity/wallet adapters with deterministic server-authoritative ledger events, idempotent debits, separate personal and business views, protected committed funds and reconciliations. **X:** Public reporting says Lagos Life intends to let third-party games use existing accounts and spend their game money. Published information does **not** prove avatar interoperability, company wallets, third-party payouts, refunds or escrow. Until documented, standalone balances are test currency only and cannot be represented as transferable Lagos Life money.

**System invariants:** No unconfirmed booking; no duplicate valid ticket on retry; no negative spendable balances due to hidden charges; no spending encumbered event funds; no double-rent invoice for owner-hosted show; no cash creation from NPC crowd; no automatic real-world value; no chart/rating purchase; no physical venue sale in V1; no unapproved external balance conversion.

## 14. Venue workflow states and UI inventory (design baseline)

| Screen / component | Primary actions | Required status indicators |
| --- | --- | --- |
| Venue directory / district map | Browse, inspect, walk to venue | Location, cap, rating, owner/operator, open times |
| NPC city rental desk | Book one day or start operator lease | Exact start/end, rent, availability, obligations |
| Public venue profile | Look up programme, view history, send booking enquiry | Current lease operator, real reviews, upcoming events |
| Business dashboard (virtual phone) | See cash, costs, contracts, lease end, opportunities | Personal vs business balance, committed vs available |
| Event organiser screen | Template, lineup, production, ticketing, publish | Date conflicts, fees, break-even, booking coverage |
| Stage Supply | Compare gear, buy/rent, inspect suitability | Size compatibility, rating, price, asset owner |
| Venue arrangement mode | Place, preview and save layout | Capacity safety, stage routes, install validation |
| Hiring/booking inbox | Offer, counter, accept, decline, time out | Who pays, booking deadline, funds state |
| Live event HUD | Check-in, crowd, performers, cues, quality | Actual attendees vs NPCs, event state |
| Settlement report | Review sales, payouts, costs, refunds | Itemised P&L, audited transaction links |
| Reputation/leaderboard | Track event history, quality, ranks | Published rule and scoring window |
| Exit/sale process | End lease, reclaim gear, sell company | Pending commitments, transfer restrictions |

## 15. Edge-case resolution table

| Case | V1 behaviour / invariant |
| --- | --- |
| Two people attempt same city slot | Server confirms one; others get sold-out and reversed holds. |
| Operator and city offer same date | City ceases direct offers for leased space; operator booking is the sole venue supplier. |
| Artist books an event outside operator's lease | Cannot confirm until operator prepays coverage through event date. |
| Lease expires immediately after event | Show may complete within booked time; cleanup and gear return run automatically. |
| Operator doesn't log in for renewal | No silent debit; after prepaid term, rights end subject to protected bookings. |
| Player moves gear before promised event | Block removing essential contracted kit unless replacement is committed. |
| Purchased gear doesn't fit new venue | Keep inventory; mark incompatible; offer resale/other usage, not automatic confiscation. |
| NPC gear rental expires mid-event | Prevent scheduling below needed coverage; show expiry at purchase. |
| Venue rented, no show scheduled | Cost still accrues; show risk warning. |
| Event costs exceed wallet available | Reject commitment before charging; offer downgrade/fundraising path. |
| Organiser buys ticket to own event | Count actual valid sale only if eligible; never allow self-spend to farm charts/reviews or launder score. |
| Organizer advertises 500 seats in 50-seat venue | Block listing above physical 50-admission cap. |
| Player disconnects during purchase | Idempotent charge/booking; on reconnect verify settled state. |
| NPCs fill visually empty concert | Display `real ticket holders` separately; no wallet or chart activity generated. |
| Artist fails to show up | Preauthorised recording or disclosed cancellation/refund process; no fake live singer. |
| Venue goes bankrupt before prepaid event | Protected event funds and city fulfilment/reassignment/refund decision precedes closure. |
| Promoter is offline | Contract deliverables time out; organiser can hire replacement if deadlines allow. |
| Sold-out concert suffers server outage | Pause settlement, preserve unique tickets, offer rescheduled show or refund. |
| Customer asks to cancel ticket | Apply visible event policy and permitted wallet reversal, not discretionary secret rule. |
| Event rating spam or sockpuppets | Only eligible genuine attendees rate; apply anti-abuse rules. |
| Unsigned artist's hit credited to venue | Venue gets discovery-history credit for verified qualifying performance, not ownership of song. |
| Venue operator changes brand/name | Preserve stable venue ID, ownership history, public archive and audit trail. |
| Business sale while commitments open | Block or require authorised obligation transfer/settlement; don't strand customers. |
| Platform API cannot transfer to operators | Connected paid booking cannot launch until provider permits authorised settlement. |
| Award ceremony exceeds one server's capacity | Synchronised instances with unique ticket counts; keep global event identity. |

## 16. Metrics and balance-test acceptance criteria

Track `venue_viewed`, `property_rental_quote`, `event_slot_held`, `event_slot_confirmed`, `lease_started`, `lease_expired`, `venue_upgrade_previewed`, `equipment_bought`, `equipment_rented`, `equipment_installed`, `layout_saved`, `event_published`, `contract_accepted`, `ticket_purchased`, `ticket_refunded`, `live_checkin`, `show_completed`, `settlement_reconciled`, `venue_rated`, `cash_warning_seen`, `business_closed`, `business_sold`, `source_of_fan_discovery`. All monetary events need amount, currency/provider, payer/payee, personal or business ledger, commitment/reference, idempotency key and event/lease correlation ID.

**P playtest gates (not guaranteed future results):** Within first session a new operator can identify rent, create and preview an event and understand break-even without tutorials longer than a few minutes; no one charges a ticket twice; 100% of revenue in a test ledger reconciles to authorised sources minus documented sinks; facility ratings are reproducible; equipment survives lease exit; 100% of purchased ticket supply is constrained by venue cap; test bankruptcy can recover without deleting player identity. Playtest 0, 1, 10, 30, 100+ human attendees per show, including many more venue owners than spectators. If there is insufficient genuine demand, launch fewer public venue slots and prioritise free/social showcases.

## 17. Clear exclusions, dependencies, and next chapter

**Out of V1:** custom building construction, player-owned city land, multi-venue business chains, shared equity ownership, business employees independently spending money, full equipment logistics professions, bank lending, guaranteed investment yields, player-owned banks, live microphone concert dependency, transfer of real song rights through virtual contracts, automatic cash-out of any game currency, and compulsory attendance at any scheduled event.

**Remaining X dependencies:** Lagos Life player account, avatar and wallet API contracts; developer permissions for transfers, payments, refunds, company funds and third-party income; in-game rights to submitted songs and live-event playback; verified interest and audience attendance before final real-game prices; maximum render/server capacity; final safety, moderation and event dispute rules.

**Proposed items for approval before implementation-ready venue spec:** (a) tier price table and week/month discount, (b) 24h booking blocks and 7d lease minimum, (c) event booking exclusivity and one active venue operator, (d) owned/rented portable equipment SKUs, (e) NPC city property office as owner, (f) staged bankruptcy/settlement, (g) operator sub-booking pricing, (h) test ticket fee 3% and jobs reward bands, and (i) award host eligibility mechanics. Each is elaborated here but not falsely labeled user-approved.

**Next in conversation:** Begin **Artist Career Foundation** as a separate chapter, covering song possession or creation, audition/open mic, production and recording, independent/label-funded career, Friday submissions, live shows, fans, chart climb, commercial upside and failure/recovery. Cross-reference VEN-01–VEN-14 and event contracts; don't overwrite venue decisions when designing the artist.

## Sources and research notes

1. Internal project history: *THE SCENE H-Path Player Interaction Matrix v0.1* and *Stage 2 Seven-Day Career Simulation v0.2* (project documents, 11 October 2026). Both preserve the multi-career economy, one shared game clock, fans, NPC honesty and the seven-day venue-show sequence.
2. Roblox Creator Hub, *Balance virtual economies* — source/sink measurement, config-driven price balancing, experiments and long-term currency health: https://create.roblox.com/docs/production/game-design/balance-virtual-economies (accessed 11 October 2026).
3. Roblox Creator Hub, *Economy events* — tracking earnings, spending, origin and instrumented economy flows: https://create.roblox.com/docs/production/analytics/economy-events (accessed 11 October 2026).
4. Techpoint Africa, *Lagos Life hits 7m players in 10 days, plans APIs for developers*, 10 October 2026: https://techpoint.africa/news/lagos-life-hits-7m-players/ . Reports intended third-party account use and spending; no published wallet schema.
5. Lagos Life official disclaimer, *Game, Brand & Real-World Content Disclaimer*, effective 1 October 2026: https://lagoslife.app/disclaimer . Game is fictional entertainment; third-party content and brand rights should be respected.

---

**Document end — TS-GDD-VEN-001.** The chapter is deliberately self-contained for an implementation agent with no access to the underlying chat; design proposals are visibly marked rather than silently promoted to agreed requirements.
