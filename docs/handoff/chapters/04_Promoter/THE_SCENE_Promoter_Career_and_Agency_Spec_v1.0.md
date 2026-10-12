# THE SCENE
## Chapter 4 — Promoter Career & Promotion Agency: Gameplay and Implementation Foundation v1.0

**Date:** 12 October 2026  
**Type:** Standalone career/company gameplay chapter, compatible with H-Path Architecture Amendment v0.2  
**Authority:** Founder accepted overall promoter direction and the one-company/many-activities model; unapproved numeric choices are labelled **DESIGN BASELINE**. Not a claim that every shared service is coded or legally authorised.  
**Prerequisites for eventual implementation:** World/phone interaction vocabulary; shared Music, Events, Company, Contract, Ledger, Rights, Placement and Notifications services.  
**Primary fantasy:** Start from nothing, discover promising music and upcoming shows, make them visible to the right genuine people, become known for smart promotion, and optionally build a promotion business or finance one's own entertainment events.

## 1. What a promoter is, and what a promoter is not

There are **two campaign branches** within one flexible activity: **music promotion** (help listeners discover a release/artist) and **event promotion** (help genuine people discover, consider, buy tickets for, and attend a live experience). A player can freelance without registering a company. A player who wants a persistent branded office and commercial reputation can register a **Promotion Agency** as their one V1 company. That business competes alongside Venue Operator and Record Label for the one-company slot. The player remains a fan, may make beats and may have an artist identity regardless of company selection.

**The promoter sells work, exposure opportunities and event organisation, not artificial popularity.** Posters, kiosks, listening sessions and event placements can create *opportunities for real discovery*. Paying for them does not create fans, saves, chart points, ticket sales or monetary returns. Unknown talent can still be successful; expensive campaigns can fail. A successful campaign can lose money for the promoter if priced badly; a service can be completed properly while a client's show loses money.

**Out of V1:** Separate promoter class gate; player-operated ad network or real-world ad buying; guaranteed playlist positions, views, streams or followers; fake community outreach; employee hierarchies; paid click farms; paid chart ranking; unconstrained blast notifications; app-level read of another player's social contacts; social-media automation dependent on outside credentials.

## 2. Player modes and company ownership

| Mode | Entry prerequisites | What player may do | Financial account | Workload cap — DESIGN BASELINE |
| --- | --- | --- | --- | --- |
| Universal self-promoter | Any avatar | Share own released song or event, use approved free placements, organise own listening session with rights | Personal or authorised existing project | No paid-client claim implied |
| Freelance promoter | Any avatar eligible to contract | Receive proposals, deliver paid campaigns, build personal portfolio, create own events | Personal available money or client-funded campaign budget | Two simultaneous active **client campaigns** |
| Agency owner | Owns no other active/closing company; pays transparent setup and office lease | Everything freelancer can do plus branded office, agency portfolio, paid-client queue, business ledger and agency-run events | Separate company ledger under sole-owner authority | Three simultaneous active **client campaigns** |

An avatar can have personal freelance promotion history while owning a record label or venue company; registering a **second** agency company is prohibited. Contract delivery may be performed personally by an owner; no hidden delegated workers in V1. An agency's branded campaigns use company funds and business identity; a freelancer's campaigns use personal service identity and ledger. Self-promotion of own artist/event does not consume a commissioned client-campaign slot, but advertisement inventory and organiser limits still apply.

**Proposed starter pricing (tunable):** no fee to begin freelancing; starter artwork and community board free; promotion agency registration **₦2,000** once, entry office **₦5,000 prepaid per seven days** (no endless auto-renew), recommended **₦10,000** additional operating cash. Agency owner chooses a name/brand and receives a basic 3D office. Agency operating costs continue even without clients during prepaid lease; office expiry does not destroy delivered campaigns or prevent player from freelancing after closure.

## 3. H-Path seven-stage journey

| Stage | New freelance promoter starting at ₦0 | Established agency owner | Wealthy player operating one agency |
| --- | --- | --- | --- |
| H0 Arrive | Walk into Square, see today's actual music/events; do not choose exclusive class | Return to agency office and existing campaigns | May immediately finance larger commitments; reputation starts from verified history |
| H1 Discover | Browse physical gigs board for artist or venue brief | Inbox and public requests; route to active board | Competitive label/arena tenders; choose risk tolerance |
| H2 Gameplay | Create poster, select audience/location, deliver a listening placement | Manage several limited campaigns; develop distinct creative materials | Execute more expensive but still uncertain activities |
| H3 Interact | Send proposal and confirm with real client | Negotiate repeat label/venue clients | Compete openly against other promoters and meet major organisers |
| H4 Economy | Client reserves fee/budget; service delivery produces fee, expenses tracked | Office and campaign margins; own concert may lose money | Large advertising and event costs possible; never buy actual fans |
| H5 Progress | First verified job and portfolio card | Reliability, referral history, district specialism, awards | Long-term reputation and major event opportunities |
| H6 Return | New brief, discovery, poster improvement, free music hangout | Pending approvals, opportunities, results, creator collaborations | New competitors/artist trends; recover after large show losses |

## 4. Physical play: the spaces and objects

THE SCENE is a stylised 3D, Sims-like entertainment world, not a marketing SaaS with a character pasted onto it. An action should normally be discoverable through a physical object, but repeat tasks must have phone shortcuts and accessible alternatives.

| Location/object | On-world action | Visual result | Repeat/accessible path |
| --- | --- | --- | --- |
| Square: Opportunities Board | Inspect open music and event briefs, accept intro job | Pinned brief and waypoint | Phone > Opportunities |
| Free public design desk / agency office design station | Arrange cover, artist image, headline, event/time, preview | Poster shown on desk and export preview | Phone > Campaigns > Create material |
| Agency campaign wall | Pin campaign cards to district map; choose approved placements and budgets | Slots light up, costs and deadline cards move | Phone campaign planner |
| Advertising kiosk | Inspect real inventory, tap site to preview actual sightline | Proposed poster shown in 3D at scale | Phone > Placement Map |
| Public wall or venue board | View active poster and choose View Event / Listen / Follow | Real user's action opens appropriate item | Keyboard/tap accessible interaction |
| Approved listening station | Set up opt-in cleared track or short session | Player-triggered music, gathering point and follow/save buttons | Event/listening app |
| Venue entry and backstage | Meet organiser, inspect calendar, pitch artist support | Offer/request appears in shared booking system | Venue listing and messaging |
| Release Hall | Discover Friday releases and approved visibility inventory | Promoted item labelled, music remains freely discoverable | Music > Release Friday |
| Agency office portfolio wall | Inspect completed jobs and campaign evidence | Historic creative screenshots, outcomes and client references | Profile > Portfolio |

**Interaction contract:** World objects use action verbs and purpose: `Inspect campaign`, `Pin poster`, `Preview placement`, `Send offer`. Each visual gesture corresponds to an auditable data change. Posters never count as a listen because they rendered on-screen. Audio starts only after permitted user interaction; allow mute, subtitles/text and reduced-motion navigation.

## 5. Two real services, one campaign framework

| Feature | Music-release campaign | Concert/event campaign |
| --- | --- | --- |
| Subject | Approved artist and eligible song, scheduled preview or released track | Confirmed event with venue/time or valid organiser draft clearly labelled |
| Typical objective | Reach potential listeners who may save/follow | Attract genuine interest and eligible ticket/attendance demand |
| Permitted tactics | Artwork, posters, opted-in snippets, release placements, approved discovery sessions, performer outreach | Event posters, venue boards, public screens, share cards, invitations, lineup teasers |
| Verification | Server delivery events, genuine interaction with placement, qualified music activity (separately) | Server delivery, attributed page/ticket visits, eligible purchases, actual check-ins (separately) |
| Client | Artist, authorised label or project payer | Artist, venue operator, label or other event organiser |
| Deadline dependency | Wednesday 18:00 release cutoff / Thursday 18:00 moderation gate / Friday 19:00 premiere (WAT) | Confirmed event time/block; capacity and ticket rules owned by EventService |
| Major caveat | Preview permission isn't public release permission; no charting before Friday | Campaign is not a venue reservation; organiser must hold appropriate event slot |

A campaign is **not** a single-click boost. Its value is a combination of creative preparation, location/audience decisions, consent, fulfilment and response to genuine interest.

## 6. Music campaigns: actual playable loop

**Example:** Kemi wants to introduce `Tonight` to listeners in Yaba and Surulere. She opens a request from the Release House or her artist phone. A promoter finds the request at the board. The promoter walks to the design desk, selects the verified artist's licensed cover and allowed excerpt, edits the campaign's title/CTA, previews it physically on a wall, and proposes a schedule and price. Kemi accepts if the offer fits her funds.

1. **Discover brief:** Inspect artist, approved release/preview permissions, deadline, preferred districts, creative assets, available project budget and expected **deliverables**, not promised fans.
2. **Choose audience context:** District map shows aggregated, privacy-safe signals such as actual visits and interests; cannot identify or mass-message all users in that demographic.
3. **Create material:** Template card assembled by dragging cover, display artist name, relevant CTA and concise release information. Artist/rights review is built into eligibility; only authorised assets.
4. **Choose placements:** Reserve a free community slot or budgeted public location at a displayed time; system checks inventory and rights before payment.
5. **Activate:** Posters become genuine in-world objects; optional opt-in listening experience uses the Music service. Display `Sponsored` where applicable.
6. **Observe:** Count placement interactions, eligible opt-in audio events and genuine save/follow actions separately. No automatic conversions or hidden multiplier.
7. **Adjust remaining work:** Within the authorised total budget, the promoter can shift **future unspent** placement reservations; cannot rewrite past delivery or request a hidden client top-up.
8. **Report and settle:** Verified work completed, cost and dates shown; partial completion follows contract remedies. Client's final performance is not guaranteed.

**No working rights -> no activation.** A label can finance a Kemi campaign from her pre-committed eligible project budget; Kemi may initiate it but cannot withdraw budget to personal funds or use it to gift money.

## 7. Event campaigns: actual playable loop

**Example:** Amaka wants to promote a 50-capacity talent hunt at a rented/operated venue. Its event already holds a valid 24-hour performance block. Ada reviews the lineup, district and budget. She visits the venue, inspects its available board and nearby public kiosks, composes the artwork, allocates placements and submits a campaign offer. Amaka funds the agreed work; Ada's creative appears in the world and links to the genuine ticket page.

- Event promotion may start **only** for an organiser-authorised confirmed event or a visibly `Coming Soon / Not Bookable` draft. A draft promotion must never sell tickets or imply venue confirmation.
- **Artist appearing on poster:** must have accepted/authorised the published lineup appearance; removals trigger poster updates and stakeholder notices. Unreleased song previews require separate excerpt permissions.
- **Ticketing:** EventService, not promoter, sets ticket price, cap, holds, checkout, validity, refund rules and unique check-in. A promoter receives no escrow control over ticket receipts unless separately acting as the named organiser.
- **Campaign end:** At event cancellation, invalidate paid ticket CTA immediately, halt future placements, calculate time-delivered versus unserved placements, and reconcile service milestones. At a postponed event, proposer and client may accept a new schedule or cancel under stated terms.
- **Outcome:** Genuine people may purchase tickets or ignore the campaign. Promotion performance is evidence; event profitability is the organiser's outcome, not guaranteed by the promoter.

## 8. Physical creative tools and why someone becomes better

V1 poster creator is a 2–4-minute visual task: choose suitable existing assets -> choose legible layout -> select headline and CTA -> select call-to-action destination -> preview on actual target wall/screen -> submit for review. The player can save presets; after the first few campaigns, a one-tap reuse flow prevents manual repetition. Advanced skill is choosing **which artist, scene, audience and placement to use**, not passing a difficult graphic-design test.

A player may freely use simple templates. Expert differentiation comes from **portfolio quality, taste, relationships, venue agreements, audience knowledge, reliable delivery, and live creative decisions**. Do not give veteran promoters supernatural conversion rates. Tools expose more informative aggregated research as they build a genuine record and client consent, not secret guaranteed engagement multipliers.

Public artwork is client-approved or drawn from cleared event/artist assets. No generative AI artwork API is required at launch. Creator outputs are moderated, square/portrait asset requirements are configurable, and templates fit mobile. Reduced-motion and keyboard-friendly drag alternatives must exist.

## 9. Advertising inventory: exact V1 baseline

There are finite, inspectable **placement slots**, not an abstract ad-buying number. Every inventory item includes `placement_id`, `district`, `surface`, `owner_type` (city or venue operator), `time_window`, `slot_capacity`, `price`, `display_size`, `visibility context`, `moderation_status` and `supported_subjects`. Every placement resolves to one unique in-world location or documented mirrored screen set; no hidden duplicate public property identity.

| Surface | Reservation unit — baseline | Price fixture | User experience | Supply/access rule |
| --- | --- | --- | --- | --- |
| Community board | 12h | Free | Small static poster, no forced popup | One active **free** post per promoter per district; 2 simultaneous free placements total |
| Public kiosk | 24h | ₦500 | Medium poster in mapped location | One campaign per kiosk face/time interval |
| Square digital board | 2h | ₦1,500 | Large rotating frame **labelled Sponsored** | One full-screen campaign per scheduled 2h slot; cap exposure frequency |
| Venue poster wall | 24h | Venue operator sets published transparent price (prototype default ₦500) | Poster outside/inside venue | Operator must have lease rights spanning ad interval |
| Release Hall sponsored discovery | Friday premiere window, 2h | ₦2,000 | Clearly labelled sponsored card, not main chart | Finite limited slots; may not displace unsponsored basic releases |
| Organised listening session | Named event interval | Venue/public-space fee if applicable | Opt-in music, people meet and listen | Real location/time, performer/rights consent; no automatic listeners |

**All figures are DESIGN BALANCE DEFAULTS, not external market prices or actual Vatar charges.** Prices will be adjusted only through explicit economy versioning and tests. Organisers can use organic share cards without paid placements. The owner of a leased venue can sell designated poster faces, subject to the venue's rights and duration. A city surface is sold by NPC city placement service and the sink is recorded. Sale of a player-owned poster surface transfers its disclosed fee to the operator's company ledger; no second NPC proceeds.

**Slot concurrency:** Server locks a slot with a short **10-minute tentative hold**, then confirms atomically with authorised payment; expiration frees it. Unique constraint prevents overlapping reservations for identical face/interval. Published creative still requires moderation before display: a pending creative cannot overbook inventory nor remain online after removal. If approval is not granted by the placement start, reject/unwind the unserved booking unless the promoter chooses an eligible later slot.

**Fairness:** No agency gets perpetual exclusive rights to a public city screen. Baseline max of **two future premium board slots per account per seven-day rolling window**; venue-owner wall policies cannot violate global moderation or artificially generate listens. Self-funded campaigns follow the same slot caps. No fake audience statistics in quotes. Reusing a physical poster template doesn't cause an unlimited number of billboard interactions.

## 10. Listening sessions and venue outreach

A promoter may organise a public listening session if the artist explicitly authorises the use of each recording in that context. Fans cannot unilaterally declare an **official artist listening party**. A promoter acting with authorisation is an eligible organiser. Unreleased excerpts may be used only in the restricted preview format/time authorised; no public full-track Release Friday bypass. A session may be free and hosted in designated public space, or pay a venue's agreed rate if using a booked room. The named organiser's event rules govern attendance, cancellation and rights.

**Action chain:** obtain song permission -> reserve permitted space/time -> create listener-facing poster -> publish -> player chooses to attend -> player manually starts music if device rules require -> user may save/follow -> promoter receives delivery report. The session can succeed culturally while earning no direct ticket revenue. It must be funded by client fees or affordable voluntary organiser expense, not imaginary NPC spend.

**Venue outreach:** A promoter may submit an eligible artist for an open showcase, guest slot or supporting-act offer. The artist consents to use their profile and to the booking terms. Only the venue/event organiser can confirm a slot; campaign fee does not force booking. A promoter's referral cannot secretly change the artist's paid appearance terms. No separate booking-agent company is needed.

## 11. Find clients and negotiate: first contact to signed campaign

**Client-facing request board fields:** `campaign_type`, `payer_account/project`, `subject_id`, `rights/artist authorisation`, `location_preferences`, `objectives_in_plain_language`, `allowed_tactics`, `budget_ceiling`, `desired_start/end`, `response_deadline`. The budget ceiling is not spendable money. On acceptance, the server checks available authorised payer funds.

**Promoter proposal:** selects included deliverables and scheduled milestones, **service fee F**, separate placement/media fund **P**, optional defined attendance bonus **B**, deadlines, revision quota, cancellation terms and rights/access grants. Default V1 supports at most **one funded revision round** to creative materials; additional work needs a fresh offer or mutually signed amendment, not automatic charging. Offer expires after **48h** without acceptance. Each counteroffer increments version; only one version can be accepted, never two.

**Contract shape:** `F` is payment for work; `P` is maximum authorised direct placement spending; `B` is an optional bonus reserved in full, capped at contract acceptance. **Total locked amount = F + P + B.** Neither party can withdraw or reuse this reservation while active. If the promoter makes a proposal against an unfunded prospect, it remains `OFFERED`, not `ACTIVE`. A client may accept only if funds and relevant subject authorisations exist. The organiser need not grant promoter access to event ticket proceeds.

**Cross-service payer:** If Kemi is label-funded and using an eligible project budget, set `initiating_actor=Kemi`, `payer=Westside:project_123`, `supplier=Ada`, `beneficiary=Kemi's release`, `project_id` and `contract_id`. The label's company wallet is already reserved for the funded allocation; campaign sub-reservation reduces spendable project allocation **once**. Never transfer project funds into Kemi's personal wallet as a workaround. For a label-organised show, the label company is organiser and payer; for a venue-owner event, venue company is organiser and payer.

## 12. Financial flows: source of money, commissions and settlement

The universal standalone simulation ledger supports `available`, `reserved`, `spent`, `receivable`, `paid`, `refunded` and immutable signed entries. The system can't settle Lagos Life native transfers without official platform support. Never use game-naira stakes, Vatar product checkouts or chart-score submissions as disguised campaign payments.

**DESIGN BASELINE milestone payments:** The campaign fee **F** is held when contract activates. Server-verifiable first material approval + first actual placement delivery (not just poster creation) earns **40% of F**; the remaining **60% of F** becomes payable when the agreed deliverables are delivered and confirmed/auto-verified according to the contract. Fees are not released merely because a player toggles `Complete`. `P` is never a wage; each booked advertising placement is paid **directly from P to its city sink or venue operator supplier**, with ledger and inventory evidence. Unused `P` returns to the source when the contract settles/cancels. `B` is held until the defined verified outcome is finalised; otherwise returns to payer. Percentages round to whole game naira with remainder in final fee tranche.

**Cancellation by client:** Already earned milestones remain payable; used placements remain spent; unfinished service share and unused placement/bonus budget are released back to payer. An optional `client_cancellation_charge` is excluded in V1 to keep terms simple. A material asset-rights takedown pauses delivery, releases unused P, and sends the active contract to review before allocating remaining service fee by verified work.

**Promoter breach / inactivity:** System waits for a promised milestone plus a **24-hour grace period** (baseline); if it remains undelivered, client may cancel. Verified work earned up to that time remains payable; unearned fee + unused P/B return to payer. Abusive/fraudulent delivery may freeze all unsettled funds pending moderation, with an appeal path. Client inaction does not block server-confirmed deliverables forever: after **24h** of client-review window, auto-approve objectively delivered milestones, with a visible dispute window for evidence issues.

**Client disappears:** Contract may proceed only to already funded, authorised milestones. No new spending, extensions or change of objective occurs without client confirmation. Event cancellation or rights removal triggers immediate pause and refund calculations, not indefinite automatic campaigns.

**Illustrative example:** Service fee **F=₦4,000**, placement budget **P=₦1,500**, bonus **B=₦2,000**, total reserve **₦7,500**. Three distinct eligible ₦500 kiosk placements are purchased and delivered. Creative/first-placement milestone pays promoter **₦1,600**; final fulfilment pays remaining **₦2,400**. Event meets genuine **verified check-in** threshold and bonus eligibility; **₦2,000** bonus pays once. `₦4,000 + ₦1,500 + ₦2,000 = ₦7,500` no double charging. If check-in target is not achieved, ₦2,000 returns to payer; total paid out then ₦5,500. Event's own ticket costs and proceeds live in EventService, not in this equation.

**Agency margins:** If client F is ₦10,000, actual authorised placements paid from P are separate, and agency allocates ₦3,000 legitimate extra service expense plus ₦4,000 attributable office overhead, then fee profit is ₦3,000 before other applicable costs. Do not deduct P twice, or report agency gross client reservation (F+P+B) as earned service revenue.

## 13. Bonuses, outcome integrity and attribution

V1 performance bonus types are deliberately narrow: **verified unique paid check-ins** to a named event, or **verified unique ticket purchases surviving the refund window**, whichever is clearly chosen in the contract. Do not offer money-per-stream, money-per-save, per-follower or chart position bonuses. A threshold bonus is all-or-nothing and paid **once**, after EventService finalises eligible attendance/refunds, to avoid incentives for dishonest instant clicks. If outcome invalidated by fraud review, hold pending bonus rather than claw back an unrelated personal balance into negative debt.

Three separate outcome panels must be visible:

| Outcome | Exact meaning | What it cannot prove |
| --- | --- | --- |
| Delivery | Cleared poster was published in booked slot for actual served time, approved listening session occurred, and deliverables completed | That humans engaged or liked the music |
| Attributed interaction | Verified eligible human took an action directly from labelled campaign placement/link | That promoter caused all downstream popularity or that unique viewer count equals listens |
| Client/business result | Verified ticket purchase/check-in, genuine music engagement and organiser P&L from shared services | Guaranteed causal attribution to campaign, or guaranteed client profitability |

**Attribution baseline:** An in-world placement issues a signed `campaign_id + placement_id + destination + timestamp` token and creates a `campaign_interaction` only when an eligible human manually interacts. An eligible subsequent purchase may be tagged as **direct campaign-assisted** if its journey originated from a valid unexpired first-party token within **72 hours**; mark attribution as informational, not proof of causation. Deduplicate by eligible person/action; respect consent and data minimisation. Standalone external share links may include campaign token and count *actual visits* to an approved landing page; they do not prove external impressions, social-app shares, or exposure outside the game. No silent contacts scraping.

If two promoters' campaigns precede a purchase, display last eligible direct-touch as **primary referral** and retain earlier eligible interactions for analytics, but pay no automatic attribution commission. Bonus qualification is based on verified event attendance/purchases, **not** on who gets attribution credit. This prevents last-click farming between competitors.

## 14. Advertising safety and attention controls

- A user physically sees the poster if present in their scene; logging a rendered object does **not** claim a human looked at it. Impression-like telemetry is a diagnostic only, never a pay or chart event.
- No forced overlay, autoplay audio, unsolicited direct messages or global notification blasts purchased by promoters. Artists' genuine followers get user-controlled updates; paid placements are visibly labelled.
- Published ads must include clear subject, event date (if any), truthful venue/lineup, valid destination, and rights-approved image/audio. Prohibit impersonation and guaranteed-stream claims. Pricing must be shown **before** payment and cannot retroactively change.
- Creative content goes through safety/moderation. If rejected before first serve, free the slot and refund/restore funds. If removed after partial legitimate delivery, refund **unserved** paid period in proportion to verified remaining time, rounded under shared economy rules, except where an enforced abuse penalty is separately disclosed and lawful.
- If a city screen or venue closes unexpectedly, do not pretend the booked ad delivered. Offer equal-value replacement slot accepted by payer or refund unserved portion. Operator lease expiry invalidates new future ad bookings that exceed confirmed coverage.
- Campaigns can be searched/browsed by users, but results must not bury all genuine unsponsored music under paid campaigns. Reserve an unsponsored discovery surface on Release Friday.

## 15. Public event organisation: promoter acts as organiser, not just vendor

A freelance promoter or agency owner can **independently** discover promising artists and propose a concert. This is not a separate `EventOrganiser` career. The promoter becomes the named **event organiser** for this show; the EventService handles all venue booking and customer obligations.

**Flow:** choose event concept -> invite artist(s) with real consent and fees -> obtain named 24h venue reservation (NPC city if unleased or operator if leased) -> commit production and available cash -> set genuine ticket price and cap -> publish event -> optionally promote through own or contracted campaigns -> run -> settle. The promoter pays their own contractor fees and can lose money if actual demand is weak. They do not double-charge their own company a service fee simply for promoting their own event: internal advertising work is part of organiser cost, not transfer from one pocket to another.

**VEN baseline cross-reference:** unique venue identity and exclusive event booking block; 50-seat lounge NPC city base **₦6,000/24h** if city unleased; a player operator publishes a booking quote instead. Event operator does not pay city rental a second time if leaseholder runs own show. Ticket-test fee **3%** (balance default; **not** Vatar fee). All headliners/guests must accept booked slots; promoters cannot force performance or override artist rights.

**Example show:** 50-ticket cap × ₦1,000 = ₦50,000 gross max; hypothetical 3% fee leaves ₦48,500 **at full verified sellout**, before artists, production and room costs. If only ten genuine tickets sell, net eligible ticket receipts = ₦9,700. Neither NPC crowds nor poster placement create ticket receipts. Costs must be quoted, funded and allocated before tickets open; organiser receives genuine surplus or bears authorised shortfall.

## 16. Agency office, brand, cost and growth

Physical Promotion Agency office includes design desk, campaign wall, creative archive, client visitor chairs, district map, branded poster samples, portfolio wall and finance desk. These are world interfaces, not decorative paywall objects. The player can decorate with eligible portable purchases, but office equipment ratings must not grant artificial conversions. Upgrading tools may save time, increase legitimate creative options and improve client perception based on visible results.

**Office persistence:** Agency rents prebuilt small office space through NPC city for a short prepaid term (baseline ₦5k/7d). Company identity and historical projects survive lease expiry or moves; owned eligible portable decor returns to company inventory. The one-company slot is occupied until company sold/closed and all obligations cleared. The owner alone authorises cash movement. No employee hiring, delegated spend, multi-office expansion or real-world advertising account integration in V1.

**Agency prestige paths:** emerging specialist for small shows; artist-release specialist; live-event strategist; multi-district campaign leader; cultural tastemaker for overlooked sounds. Reputation is not purely cash or total ad spend. Physical portfolio frames display truthful, privacy-safe prior posters and verified events; consent required to display private commercial results.

## 17. Promotion pricing and profitability balancing

| Offer archetype | Service fee F, proposed range | Typical work | Notes |
| --- | ---: | --- | --- |
| First small job | ₦1,000–₦3,000 | Simple event card + approved free board + delivery | Client-funded, zero-capital entry possible |
| Emerging song | ₦3,000–₦8,000 | Cover design, placement plan, allowed preview | One-week single campaign |
| Small venue event | ₦3,000–₦10,000 | Poster, kiosk/board, event share card, review | Does not guarantee tickets |
| District campaign | ₦8,000–₦25,000 | Multiple booked placements + one activation | Media budget P is **separate** |
| Major event | Custom permitted quote | Several approved surfaces, eligible timing, venue outreach | Owner capital risk, not fake follower delivery |

**DESIGN BASELINE:** These are starting offer guidance, not a floor/ceiling for freely negotiated deals. Only actual balances can be committed. Promoter's **service fee F** is separate from the explicitly authorised **media fund P** and possible **pre-funded bonus B**. Clients see `total_reserved = F + P + B`, spending cap, any company overhead (promoter's own burden), possible refunds, and outcome uncertainty **before acceptance**.

A new freelancer must be able to earn through low-budget assignments without paying for placements upfront. Small equipment or service jobs via an NPC/public opportunity provider may exist, but any paid task must draw on the explicitly configured standalone treasury or permitted real player payer; jobs are limited to stop uncontrolled currency creation. Entry-level work is not a substitute for social promotion: careers progress through genuine clients and actual campaign evidence.

## 18. Offline operation and async interactions

- Client can publish a brief and go offline. Promoter proposes an offer and client accepts later; no need for synchronous meetings.
- Accepted, funded placements start/end automatically at scheduled times, even if promoter logs out. Server verifies delivered display windows; it does not generate human engagement.
- If client has not yet accepted creative approval, do not consume paid slots. Use lead time so material approval precedes slot start; missed deadlines trigger pause/replace/refund rules.
- Promoter offline at a scheduled **physical listening session**: use an expressly pre-authorised NPC host if the organiser approved the fallback and playback rights, otherwise postpone/cancel under event terms. An NPC host is visibly NPC; don't fabricate turnout.
- Offline owner cannot be impersonated by an agency worker, since V1 has no delegated financial permissions.
- Notifications summarise meaningful changes once, with time-sensitive countdowns; no relentless push spam.
- A campaign can complete its automated published placement while owner is offline if creative, rights and payment were already approved. A new booking/expense cannot be invented while owner is absent.

## 19. Reliability, reputation and portfolio rules

**Delivery reliability** is computed from objectively verified completion and contractual deadlines, with clear exclusion of client-caused pauses, platform outages and artist rights withdrawals. **Outcome performance** is reported as genuine event visits, purchases/check-ins and music actions with denominators and attribution caveats. **Financial reputation** refers to paid obligations, settlement accuracy, complaints and underpricing. **Cultural record** refers to discoverable campaigns, artists and events helped, without awarding chart credit for mere spend.

No single opaque `Promoter Power` attribute. Display at least four separate public fields: `verified_campaigns_completed`, `on_time_delivery_rate`, `specialism` (artist releases/events/district), `public_portfolio` (opt-in evidence). Private client budget and individual listener identities must not leak. A large spender is not mechanically better at converting users; high-quality work and actual relationships may improve market opportunities.

**Complaints:** Both client and promoter can dispute evidence; verified first-party delivery logs take precedence over subjective star ratings. A client cannot mark campaign `FAILED` simply because the song was unpopular. A promoter cannot claim delivery with an uploaded screenshot alone if the server shows no active slot.

## 20. Stage-by-stage 7-day promoter simulation

| Day | Freelance newcomer, Ada | Agency owner | Cross-role effect |
| --- | --- | --- | --- |
| Monday | Find Amaka's 50-seat talent-hunt brief in Square | Review three briefs at office wall | Venue has actual organiser opportunity |
| Tuesday | Create poster and quote, Amaka funds F/P/B | Plan label Release Friday and small show campaigns | Artist/label services in demand |
| Wednesday | Place approved poster on available community/kiosk | Allocate different districts and update Friday timing | Public world changes visually; no fake ticket sale |
| Thursday | Kemi asks for a release announcement; Ada may accept second contract | Scout permission for approved previews | Artist reaches potential listeners |
| Friday | Observe verified music interactions after 19:00 premiere | Review genuine listening vs spend and future slots | Listeners voluntarily save/follow or ignore |
| Saturday | Attend talent hunt and see genuine check-ins | Host small voluntary listening session; NPC fallback if approved | Organiser settles ticket/event economics |
| Sunday | Complete report, collect earned F, update portfolio; bonus if genuine threshold | Inspect agency margin, future opportunities, office overhead | Promoter has a reason to return with or without a show |

At 0 human attendance, all posters might technically deliver, but no event attendance bonus pays. At 40 human attendees, the promoter may earn the pre-funded bonus only if the contracted threshold and verifications hold. A promoted artist's track can flop; delivery remains real. One can work for different actors without changing class; an artist who owns a label can still promote their own public release through the same surfaces.

## 21. Meaningful failure, bankruptcy and recovery

**Bad targeting:** Few players interact; no fake popularity, but delivery fee earned if work complete. **Underpriced work:** A promoter commits to premium services but spends more than fee; agency makes an actual loss, while client may be happy. **Lost slot:** City kiosk downtime leads to unserved-time refund/replacement, not fabricated delivery. **Unclear artist permission:** Pause pending consent. **No fans online:** Program public free music-discovery venue in a small district, not imagined crowds paying. **Client cancels:** Earned work paid, unserved budgets returned. **Promoter abandons:** Grace, cancel and restitution to client; reliability reflects actual breach. **Own concert fails:** Organiser bears loss; freelancer may continue paid work. **Agency insolvent:** Stop new commitments and renewals, settle obligations, liquidate eligible assets, close company and preserve personal career history.

**No punishment without choice:** A free starter campaign doesn't incur negative financial balance; hidden auto-renew subscriptions are prohibited; players see next office cost and authorised placement dates. If no human clients exist, the promoter can practice designs, scout music, explore listening events, share organically, and take capped legitimate world-paid jobs if offered.

## 22. Cross-role transaction examples

| Scenario | Initiator | Contract payer | Supplier / receiver | Other-party consent | Settlement owner |
| --- | --- | --- | --- | --- | --- |
| Independent artist hires freelancer | Artist | Artist personal | Promoter personal | Both accept, artist authorises creative | ContractService + LedgerService |
| Label-funded artist hires promoter | Artist | Allocated label artist project | Freelance or agency supplier | Artist accepts; project eligibility pre-authorised | Project ledger, no double recoup |
| Label promotes own showcase | Label owner | Label company | Promoter | Label as organiser and payer | Label event separate from artist projects |
| Venue operator promotes own talent hunt | Venue operator | Venue company | Promoter | Venue as organiser | Venue event P&L, no second city rent |
| Promoter organises own show | Promoter | Personal or agency company | Artists, venue and media suppliers | Performer/venue acceptance | Event organiser's P&L |
| Venue sells advertising wall slot | Promoter | Campaign P allocation | Venue company | Lease rights, inventory reservation | PlacementService + LedgerService |
| Influencer/fan shares song organically | Fan | No payer | No supplier | Normal social/share permission | No artificial cash/fan rewards |
| Investor voluntarily backs eligible event | Any eligible human | Separate project funding commitment | Event organiser project | Both consent; money source verified | Shared event-funding service, not promoter yield |

Each table row may be started through a world object or the phone, with consistent backend records and real-time notifications. A gift from a fan remains an ordinary transfer if/when permitted; it does not become sponsorship, an ad placement or an investor contract just because the sender wrote a memo.

## 23. Promoter interaction catalogue, server contracts and telemetry

For every action, client can animate local previews but the authoritative state transition is server-side. Required event names below are **analytics names**, not money-moving API endpoints.

| ID | Trigger / action | Preconditions | Commit & success | Failure and telemetry |
| --- | --- | --- | --- | --- |
| PRO-01 | Visit Opportunities Board | Account active | Fetch ranked public briefs, no paywall | Empty list shows public discovery; `briefs_viewed` |
| PRO-02 | Publish client brief | Valid subject and owner permission | Creates `OPEN_BRIEF`; no funds debited | Invalid subject rejected; `promo_brief_published` |
| PRO-03 | Submit proposal | Eligible brief, under workload cap | Versioned `OFFERED` F/P/B terms | Offer expires 48h; `promo_offer_sent` |
| PRO-04 | Counteroffer | Offer not expired | Increment version, notify other party | Stale version 409; `promo_offer_countered` |
| PRO-05 | Accept offer | Rights + payer funds + limits pass | Atomic reserve F+P+B; mark `FUNDED` | Any failed check = no debit; `promo_contract_funded` |
| PRO-06 | Open physical desk | Player in accessible world or phone fallback | Create material draft linked to subject | Offline saves draft; `poster_draft_started` |
| PRO-07 | Submit creative | Cleared imagery, truthful content | `PENDING_APPROVAL` -> `APPROVED` | Reject with reason; `promo_creative_approved` |
| PRO-08 | Preview slot | Valid visible inventory | Quote and ghost poster in scene, not committed | No slot = alternatives; `placement_previewed` |
| PRO-09 | Hold slot | Within per-user quotas | 10-minute pending hold, no other winner | Race loser sees alternative; `placement_held` |
| PRO-10 | Confirm placement | Fund P available, creative approved | Reserve actual time and deduct P once | Crash/retry idempotent; `placement_confirmed` |
| PRO-11 | Activate slot | Start time reached, rights valid | Public poster live and CTA token active | Moderation/rights block -> pause/refund; `placement_started` |
| PRO-12 | Manual user interaction | Eligible human chooses a CTA | First-party destination + token logged | Bot activity invalid; `promo_interaction_eligible` |
| PRO-13 | Book listening session | Permission + venue/public slot | EventService session, music consent | Artist veto / capacity conflict; `listening_session_booked` |
| PRO-14 | Refer artist to venue | Artist consents; booking open | Venue offer, not guaranteed slot | Expiry/no reply; `artist_referral_sent` |
| PRO-15 | Inspect campaign board | Owner/supplier access | Display spend/delivery/outcomes separately | Access denied for strangers; `promo_board_viewed` |
| PRO-16 | Change future media plan | Remaining P, new slot available | Release old unserved slot under rules, confirm new | Cannot mutate completed history; `placement_plan_changed` |
| PRO-17 | Mark objective delivery | Valid server evidence | Earn 40% and final 60% F milestones | Unproved deliverable disputed; `promo_milestone_verified` |
| PRO-18 | Event outcome finalised | Contract B optional; ticket/refund final | Pay B once if threshold met, else release | Fraud review holds; `promo_bonus_resolved` |
| PRO-19 | Client cancellation | Existing active contract | Stop future, pay earned F, refund unused P/B | Funding dispute freeze; `promo_contract_cancelled` |
| PRO-20 | Promoter missed deadline | 24h grace elapsed | Client option to cancel under terms | Platform outage exceptions; `promo_deadline_missed` |
| PRO-21 | Publish verified portfolio item | Campaign settled, client sharing permissions | Public evidence summary, no private data | Consent denied -> private only; `portfolio_updated` |
| PRO-22 | Register Promotion Agency | One company slot free, costs available | Atomic registry + separate ledger + lease | Second business rejected; `agency_registered` |
| PRO-23 | Organise own concert | Venue reservation, artist consent, funds | Named organiser, actual ticketed event | No double rent, insufficient funds blocked; `self_event_confirmed` |
| PRO-24 | Settle event as organiser | Show complete, tickets/refunds resolved | Organiser event P&L and vendor payouts | Outage -> retry/reconcile; `event_settled` |
| PRO-25 | Close/sell agency | Active obligations resolved/transferred | Company terminal, personal history preserved | Open contracts block; `agency_closed` or `agency_sold` |

## 24. State machines: no contradictory client assumptions

**Client request:** `DRAFT -> OPEN -> CLOSED | EXPIRED`, with references to immutable subject/owner versions.  
**Proposal:** `DRAFT -> OFFERED <-> COUNTERED -> ACCEPTED_FUNDED | DECLINED | EXPIRED`. Reopening requires new version, not editing historical terms.  
**Campaign:** `PENDING_FUNDING -> FUNDED -> CREATIVE_PENDING -> READY -> ACTIVE -> DELIVERED -> REVIEWING -> SETTLED`; alternate `PAUSED -> ACTIVE | CANCELLED`, and `DISPUTED -> SETTLED | CANCELLED`. `SETTLED`, `CANCELLED` and `EXPIRED` are terminal for that contract version.  
**Creative:** `DRAFT -> SUBMITTED -> APPROVED | REJECTED | QUARANTINED -> ARCHIVED`. Approved snapshot must be bound to individual booked placement; updates require re-approval.  
**Placement:** `AVAILABLE -> HELD -> BOOKED -> SCHEDULED -> LIVE -> SERVED`; alternate `HOLD_EXPIRED`, `REFUSED`, `CANCELLED`, `PARTIALLY_SERVED`, `REFUNDED`. Neither `LIVE` nor `SERVED` is itself proof of human viewing.  
**Bonus:** `NOT_APPLICABLE | RESERVED -> PENDING_OUTCOME -> PAID | RELEASED | HELD_REVIEW`.

All clocks are server UTC with WAT labels in UI. An offline client may never unilaterally edit a signed proposal. A paused campaign must not accidentally reactivate without renewed rights or explicit state transition. Replays/retries have request idempotency and immutable audit logs.

## 25. Required data model (implementation-agnostic)

| Entity | Required fields / reference integrity |
| --- | --- |
| `PromotionPortfolio` | `person_id`, completed services, verified public metrics, client sharing permissions |
| `PromotionAgency` | `company_id`, sole_owner_person_id`, brand, office lease, business ledger, status, active_campaign_count |
| `CampaignBrief` | `brief_id`, requester/payer reference, subject_type/id, goals, districts, rights, budget cap, start/end, status |
| `CampaignOffer` | `offer_id`, version, client, supplier, F/P/B amounts, currency_provider, deliverables, bonus rule, expiry, signatures |
| `CampaignContract` | `contract_id`, immutable accepted offer_version, payer source, beneficiary/subject, reserves, status, timing, dispute state |
| `CampaignCreative` | `creative_id`, subject, snapshot digest, artist/event permissions, image and audio asset IDs, moderation state |
| `PlacementInventory` | `placement_id`, face/surface, owner rights, district, slot capacity, pricing/version, compatibility |
| `PlacementReservation` | `reservation_id`, campaign, creative_snapshot, face/time, hold_expires, served_seconds, charge/refund references |
| `ListeningSession` | event_id, named organiser, venue/public location, song permissions, approved time, NPC fallback consent |
| `DeliveryEvidence` | deliverable_id, first-party server event reference, requested vs served times, reviewer decision, freeze reason |
| `AttributionTouch` | campaign/placement token, eligible pseudonymous person, action, timestamp, consent basis, linked destination |
| `BonusEscrow` | project/contract, bonus cap, event, threshold metric, reserve reference, pending/paid/released |
| `CampaignLedgerEntry` | payer ledger, supplier ledger, commitment, amount, provider, immutable idempotency key, event/project |
| `CampaignAnalytics` | served placements, manual interactions, qualified outcomes, costs, time window, suppression flags |

**Avoid additional sensitive profiling.** Location is in-game district preference, not physical GPS. User media/audio rights are checked by referenced permissions. Immutable server-side source for monetary state; visual poster screens are projections.

## 26. Robustness and edge-case matrix

| Situation | Required result |
| --- | --- |
| New promoter begins with ₦0 | Can use free station and propose client-funded service, without forced company fee |
| Artist owns another business | Can freelance promote but cannot register second agency |
| Agency owner changes to label company | Must close/sell agency and settle campaigns before one-company slot frees |
| Two promoters accept same exclusive job | Client may fund at most one exclusive accepted offer; other offers become unavailable |
| Offer accepted as payer balance becomes insufficient | Atomic fund fails with zero debits and no false `ACTIVE` contract |
| Label-funded artist exceeds sub-allocation | Reject contract, display remaining eligible project funds |
| Promoter duplicates confirm request | One booking and one debit via idempotency key |
| Two accounts request same billboard/time | Only one slot confirms; losing client gets full hold release |
| Artwork is unlicensed, misleading or disallowed | Reject/quarantine; do not serve; handle unused reserved money |
| Song is quarantined mid-campaign | Disable CTA/clip immediately; refund unserved placements under rules |
| Thursday preview mistaken for released song | Restricted snippet only; Friday official release and no early chart activity |
| Release moves to next week | Future placement changes require confirmation; unused slots can be rescheduled or refunded |
| Artist withdraws poster permission | Pause applicable creative; settle work already delivered; reject new activation |
| Client cancels campaign before any work | Return reserved F/P/B, except genuinely earned verified work (none in this case) |
| Client cancels after first verified milestone | Pay earned 40% F, used P remains paid, unearned F/P/B refunded |
| Promoter vanishes | 24h grace after milestone; client may cancel; server-proof earned work retained |
| Client never clicks final approval | Auto-confirm objective server-verified work after 24h, with dispute record available |
| Platform kiosk fails 50% through slot | Refund 50% of slot price under prorated time rule or accept replacement |
| Venue operator loses lease mid-campaign | Existing future slots cancelled/rebooked, cash handled before closure |
| Promoter posts same CTA in all placements | Display obeys slot quota, user attention controls, unique interactions deduped |
| Promoter buys own poster with alternate account | Fraud controls do not award synthetic conversions or paid bonus |
| Poster renders near NPC crowd | Zero automatic impressions-as-humans, listens, tickets or revenue |
| Event cancelled after ticket sales | Halt ticket CTA, EventService refunds tickets; campaign unserved portion refunded |
| Customer requests ticket chargeback | EventService updates eligible bonus after refunds finalised |
| Fan goes offline during listening | Save is optional and only counts with eligible active action; no fake replay |
| Client and promoter dispute service quality | First-party evidence determines delivery; human review handles subjective rights/content, freeze only disputed funds |
| Promoter self-organises concert | Pays venue/provider, not itself a fake extra service fee; owns event P&L |
| Agency insolvent | Cannot accept new commitments; office expires, obligations settle; personal artist/fan data intact |
| Vatar wallet settlement unavailable | Standalone test ledger only; never label it native game-naira transfer |
| Award campaign funded by sponsor | Sponsor has no control over nominees, charts, ballots or ceremony results |
| Event instance splits for concurrency | Unique genuine human check-ins counted once across instances |
| Campaign buyer tries to solicit private fan info | No contact scraping, unsolicited blasts or personal attendee list disclosure |
| Player blocked/harassed by promoter | Block/report enforced across messages and event proximity; moderation can suspend commercial activity |

## 27. Detailed acceptance tests for Codex

| Test | Setup and action | Expected observable result |
| --- | --- | --- |
| AT-P01 | Zero-money player opens design desk | Can create and save draft; no fee or company registration |
| AT-P02 | Avatar owns venue company and starts freelance job | Succeeds; agency registration is blocked while venue company remains active |
| AT-P03 | Two agency attempts concurrent | Exactly one company registers; one debits; other returns no-business-slot failure |
| AT-P04 | Client accepts F4k/P1.5k/B2k with balance ₦7.5k | Reserves exactly ₦7.5k atomically, available decreases once |
| AT-P05 | Same acceptance request retried | Contract and reserve not duplicated |
| AT-P06 | Competing campaigns reserve same 2h screen | At most one confirmed reservation for surface/interval |
| AT-P07 | Creative lacks consent to song artwork | Slot cannot activate; rejection reason visible |
| AT-P08 | Public poster shown to 20 NPCs, no human clicks | Eligible music/ticket conversion count = 0 |
| AT-P09 | Human taps kiosk and follows artist | One attributed interaction and one eligible follow, not an artificial playback |
| AT-P10 | One user taps poster 50 times | Raw taps may be diagnostic; qualified person-based actions deduped |
| AT-P11 | Artist official release embargo until Friday 19:00 | Public full-song paid ad cannot bypass embargo or award early charts |
| AT-P12 | Poster approval delayed beyond slot start | Unserved booking refunded/released or user-chosen reschedule; no fake delivery |
| AT-P13 | Client cancels after 40% milestone; F₦4k | ₦1.6k earned, ₦2.4k unearned released, unused P/B refunded |
| AT-P14 | Event check-ins under threshold B | B returns to payer once, zero paid bonus |
| AT-P15 | Threshold met with unique verified people | Bonus pays once after event and refund finalisation, retried jobs idempotent |
| AT-P16 | Event refund invalidates attendance before bonus final | Bonus recalculated/held; no award for refunded tickets |
| AT-P17 | Client quits for 72h after objectively verified delivery | Milestones auto-confirm after published 24h window, consent still enforced |
| AT-P18 | Promoter misses deadline, no valid outage | Client can cancel after 24h grace; unpaid/unspent funds return |
| AT-P19 | Promoter agency organises own 50-seat show | EventService owns cap and ticket funds; 3% test fee applied once |
| AT-P20 | Venue operator hosts own event | No second NPC city venue rental is charged |
| AT-P21 | Poster wall operator lease ends before future ad date | Booking prohibited/refunded; asset doesn't stay advertised |
| AT-P22 | Lost connectivity during campaign slot confirmation | Replay yields one reservation and one charge; state reconciled on login |
| AT-P23 | Song copyright complaint suspends recording | Relevant audio campaign paused, public playback removed, funds reconcile |
| AT-P24 | Campaign budget exhausted, promoter tries another paid slot | Reject with transparent shortfall; no overdraft |
| AT-P25 | Company sold with open client campaigns | Sale blocked or contracts lawfully transferred with consent, not silently erased |
| AT-P26 | Two promoters touch same eventual ticket buyer | Last valid direct referral shown, no automatic commission based on clicks |
| AT-P27 | Promoter closes agency | Personal promoter achievements and artist/fan data preserved |
| AT-P28 | Client sees final report | Delivery/engagement/commercial P&L separated, all currency amounts reconcile |
| AT-P29 | Embedded Lagos Life gameplay without wallet-transfer API | Shows separated supported features; disallows fictitious native payment |
| AT-P30 | Screen-reader/reduced-motion use | Player can propose, book and settle a campaign without inaccessible 3D-only gesture |

## 28. Gameplay metrics, balance gates and playtesting

**Core funnel:** `brief_viewed -> proposal_sent -> offer_accepted -> funds_reserved -> creative_approved -> first_placement_served -> eligible_human_interacted -> campaign_delivered -> service_paid -> client_rehired`. Report drop-offs and time-to-first-paid-delivery. Other gauges: active campaigns per promoter, client repeat ratio, median service fee, promoter profit net of real costs, percentage free entrants completing job, placement occupancy, unique genuine human interactions, ratio of bot/invalid activity excluded, event purchase/check-in conversion, cancellation causes and moderation workload.

**DESIGN BASELINE launch gates:** at 0/1/10/30/100 active humans across district scenarios, novice can send an honest proposal within 5 minutes, launch a free post within 10 minutes, understand distinction between poster delivery and actual listener, and find other activity without waiting for clients. Every fake crowd produces zero commercial receipts. 100% of F/P/B and event ticket money is reconciled to authorised sources/sinks. All market rates and campaign caps must be tuned from a cohort test before launch; avoid promising realistic 500-person attendance when concurrency is 25.

## 29. Founder decisions, design baselines, deferred ideas and cross-chapter references

| ID | Rule or numeric assumption | Status | Authority/dependency |
| --- | --- | --- | --- |
| PRO-D01 | Promoter has both song and event marketing | FOUNDER-APPROVED DIRECTION | Previous promoter review approved |
| PRO-D02 | Physical posters, stations, venue outreach, office board | FOUNDER-APPROVED DIRECTION | Physical-first world |
| PRO-D03 | Freelance without company; one optional promotion agency | CONFIRMED architecture | H-Path v0.2 |
| PRO-D04 | Only Venue, Label or Promotion Agency are V1 company types | CONFIRMED architecture | One business at a time |
| PRO-D05 | Marketing cannot generate fake listens/fans/sales | CONFIRMED | Music discovery invariant |
| PRO-D06 | Up to 2 freelance / 3 agency active clients | DESIGN BASELINE | Test human workload, change via balance version |
| PRO-D07 | F fee + P media + optional pre-funded B bonus | DESIGN BASELINE | Shared ledger/service contract needed |
| PRO-D08 | 40%/60% milestone payments, 24h review/grace | DESIGN BASELINE | Test conflict/workload |
| PRO-D09 | Public inventory price and slot catalogue | DESIGN BASELINE | Placement economy tuning |
| PRO-D10 | 72h attribution token, no causal guarantee | DESIGN BASELINE | Data/privacy review |
| PRO-D11 | No per-stream bonuses, no guaranteed chart position | CONFIRMED principle | Anti-fraud |
| PRO-D12 | Own event is organiser role with loss risk | CONFIRMED | Venue/Events foundation |
| PRO-D13 | Promotion Agency ₦2k registration, ₦5k office weekly | DESIGN BASELINE | Economy tuning |
| PRO-D14 | Agency sale/closure preserves person history | CONFIRMED architecture | One-company rules |
| PRO-D15 | No investor, producer, manager or booking-agent *company* in V1 | CONFIRMED architecture | Role simplification |
| PRO-D16 | Standalone ledger separate from native Vatar money | EXTERNAL DEPENDENCY | Official SDK features |

### Cross-chapter interface binding

- **H-Path Architecture Amendment v0.2:** one avatar, one registered business, casual production/investing, free entry, world-first UI. This chapter is the canonical promotion spec under that taxonomy.
- **Venue Operator v0.3:** city vs operator rental, unique public venue identities, stage equipment and placement walls, 24-hour blocks, default 50-seat city booking ₦6,000, 3% **test** ticket fee and upfront protected contract responsibilities. Do not re-sell a leased room through the city.
- **Artist v0.4:** music rights, approved previews, Friday 19:00 official release and Wednesday deadline, fans, charts, Stage Mode. No official song is published early via promoter station.
- **Record Label v1.0:** artist-owned decisions within finite reserved project budgets, three artist roster maximum, per-project recoupment and distinct label-organised concerts. Promoter paid as supplier; its fee is an eligible cost **once** in correct project.
- **Shared service chapters forthcoming:** final ledger-provider design, refunds/chargebacks, visibility/ads moderation, rights policies, events and awards, public discovery ranking, fan communication, NPC service treasury and precise launch pricing. If a future shared chapter overrides a baseline, it must carry a written amendment and test migration.

## 30. Production sequencing and handoff standard

1. Build physical free promotion desk, public board and a single real interactive poster linked to a real song/event. Show human opt-in interaction, not generated numbers.
2. Connect versioned briefs/offers, consent and server-side campaign ledger reservations. Implement cancellation and idempotency **before** real paid placement booking.
3. Build finite placement inventory and simultaneous hold races; verify scheduled world display, exact billing and refunds on downtime.
4. Build report split into delivery, attributable human action and organiser commercial result. No account-level leak of individual fan behaviour.
5. Support agency registration, company ledger/lease, optional own-event organiser scenario and company exit. Keep promoter role non-exclusive.
6. Stress test rights removal, absent clients, false engagement, album/release reschedules, sold-out events, city/venue outages, multi-instance check-ins and provider unavailability.
7. Integrate Vatar-supported identity/embed functionality through documented methods only; do not emulate native game-naira settlements with stakes or real-money items.

**Engineering handoff criterion:** A developer who did not read this conversation should be able to trace a real interaction from creator -> world placement -> eligible human action -> delivery proof -> payer reserve -> supplier receipt -> cancellation/refund -> portfolio update, with unambiguous authority and state transitions. This chapter establishes defaults and invariants; implementation must still await the shared platform, content-safety and event-economy specs for cross-system legal/API decisions.

### Sources and provenance

Internal: THE SCENE H-Path Player Interaction Matrix v0.1; H-Path Architecture Amendment v0.2; Venue Operator Foundation v0.3; Artist Foundation v0.4; Record Label Spec v1.0.  
External platform: Vatar Games SDK v1 https://lagoslife.app/developers/docs (checked 12 October 2026).  
Game-economy methodology: https://create.roblox.com/docs/production/game-design/balance-virtual-economies.  
Music integrity: https://artists.spotify.com/en/artificial-streaming.  
Research is background only; all gameplay prices and mechanic defaults above are **our design proposals**, not claims by those publishers.
