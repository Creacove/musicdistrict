# THE SCENE — Stage 2: Seven-Day Career Simulation and Gameplay Stress Test

**Working version:** 0.2 | **Date:** 11 October 2026 | **Time zone:** WAT (UTC+1)

**Document role:** A companion to `THE_SCENE_HPATH_Player_Interaction_Matrix_v0.1.md`, **not** a replacement, finished GDD, or Codex-ready technical spec. Status vocabulary: **DECIDED** = founder made a decision; **RECOMMENDED** = design proposal subject to review; **DEPENDENCY** = dependent on external platform support; **DEFERRED** = not needed for first playable version. Numeric budgets, timings, capacities and example scores are test fixtures, not production values.

## 1. What this stage tests

- Can an artist, producer, promoter, small venue owner, label owner, investor and music fan each have an active, enjoyable seven-day life in one shared world?
- Can the world function with only 20–40 real test players, including when critical players are offline?
- Can one song generate opportunities for other careers without automatically making everyone profitable?
- Can the world remain physically playable as a Sims-like stylised 3D environment, with a convenient in-world phone rather than a menu-only management simulator?
- Can we tell genuine attendees, listeners and wallet transactions apart from NPC ambience and projections?
- Can a new player start with zero while a connected Lagos Life player eventually enters with existing virtual wealth?

## 2. Constraints inherited from the full conversation

**DECIDED:** Independent own-domain game; planned Lagos Life identity/avatar/wallet adapter when APIs permit; actual 3D avatar movement, dancing, social interaction; one company per owner in first version, independent company account/ledger, owner-controlled business transfers, business sale desired; everybody can also be a fan; follow artists for release/show updates and moderated artist-led group chat; fan transfers are plain voluntary player-to-player gifts; no fan-organised official listening parties; artists must submit an actual owned song or create one via producer beat and vocal recording; artist is self-managed; labels fund an artist's contracted virtual project allocation without individual spending approvals; weekly Friday releases, one official release per artist per week, missed cutoff defers; weekly district chart and Lagos aggregate, genuine replays and saves count, songs may persist across weeks; permitted songs can be selected as individual in-game soundtrack; automated DJ; small auditions and talent hunts, concerts, venue career depth, promoters, investors, industry awards and social sharing.

**DEPENDENCY:** Public Laguna/Lagos Life developer API is not a published contract for transfer, settlement, identity or avatar portability; standalone test wallets must never be represented as Lagos Life credit. In any eventual integration, only authorised operations affect Lagos Life balances. Never imply that game currency can be exchanged for actual Nigerian naira.

**RECOMMENDED:** Shared clock, daily activity options and weekly headline events; one dense district first, one 50-seat talent-hunt venue, a starter studio, release space, jobs/opportunities desk, adjacent social area; asynchronous inbox for offers; NPCs maintain basic services but do not counterfeit human attendance or voting; 3D/world actions plus phone utility for business and booking; project budgets for label artists.

## 3. The seven test characters

| Character | Starting situation | Own career win condition | Every-day fallback |
|---|---|---|---|
| **Tobi — Artist** | New independent artist, zero personal wallet, no approved song | Finish real/permitted song, audition, obtain verified fans, secure next opportunity | Studio rehearsal, free open mic, starter work, fan activity |
| **Sarah — Producer** | New producer, no clients, zero money | Make a beat with Tobi, earn session payment, secure another brief | Short studio briefs, own music-making tool, discovery |
| **Amaka — Venue owner** | Owns a 50-capacity venue, some company funds, weak reputation | Host an enjoyable financially intelligible talent hunt, improve venue history | Free/open mic, venue inspection, scouting, private rehearsal rental |
| **Ada — Promoter** | New independent promoter, zero money | Win a show contract, bring legitimate audience interest, secure repeat client | Starter gig, pitch outreach, review open jobs, attend other shows |
| **David — Label owner** | Small funded label, no signed artists | Scout Tobi fairly, offer a bounded contract, leave artist autonomous | Discover music, attend open showcases, review roster/cash |
| **Kunle — Investor/sponsor** | Has substantial existing game funds (future linked wallet) | Evaluate and back the right entertainment project, understand risk and outcome | Inspect active opportunities, attend shows, make conditional bids |
| **Fola — Fan** | Casual player, zero money, uninterested in founding company | Discover a song, follow an artist, attend a show, develop social memories | Free listening rooms, open mics, group chat, optional entry job |

One player is never locked to a profession; all can be fans. Only artist identity can upload an officially released track. Producer may produce and hand off credited original track components, but cannot impersonate artist uploader.

## 4. Seven-day shared-world simulation

### MONDAY — The city gives everyone a start

**World event:** Normal business day. Opportunities Board displays a venue talent hunt seeking performers, an equipment/stage preparation task, paid promotional briefs and a public free music hangout.

- Tobi (H0-H2): Arrives with zero; sees concert in progress within sight, chooses an easy starter task; walks to music studio and learns that a completed song is required to release as an artist. Can accept wage-funded introductory work without committing to a class.
- Sarah: Opens studio music-making minigame, creates a simple original drum-bass-melody loop. Publishes an available producer service, including sample and price.
- Amaka: Walks through venue, sees low bookings, starts a Saturday Talent Hunt event plan; chooses 5 audition slots and tentative price, checks cost/maximum revenue; listing remains draft until funds and venue availability confirmed.
- Ada: Spots venue's promotion job and makes offer. She can take a small NPC-supported starter brief if Amaka is offline.
- David: Browses unsigned-artist previews and upcoming auditions, saves an event and follows a promising act; no obligation to sign today.
- Kunle: Compares an event sponsorship request and a proposed venue upgrade; sees expected outcomes as scenarios not guaranteed ROI.
- Fola: Enters free open mic, samples cleared tracks, follows a performer and meets another attendee. No profession selection required.

**Persistent outcomes:** accepted jobs, reservations, song drafts, follow relationships, event draft, company expense holds and inbox offers. If nobody else online, the first player still has starter activities and a free hangout.

### TUESDAY — Work becomes tangible

- Tobi: Accepts Sarah's beat offer (or basic NPC studio if Sarah absent); records original vocals in browser after microphone permission; chooses to listen/retry; music stays draft until rights review. Can also simply upload a verified owned finished song instead. No placeholder/fake release without audio.
- Sarah: Runs 2–4 minute beat sequencer/cooperative arrangement session; ensures original/cleared loops; gets agreed session payment if source funds and settlement permit; completes proper song credit.
- Amaka: Enters 3D stage-layout puzzle: position speakers/lights for show type, see accessible feedback on coverage/safety and cap; save layout for later to avoid repeated busywork. Approves production bundle and confirms date.
- Ada: Makes two venue/artist pitches, chooses audience district and campaign activity; posts an attributable event card for external sharing and sees genuine interest leads (not fictitious ticket purchases).
- David: Attends private auditions and compares artist risk/repertoire/reputation; cannot sign music copyright by means of in-game deal.
- Kunle: Negotiates **sponsorship** with Amaka; money buys disclosed sponsor credit, not a profit claim or chart rank. Agreed funding is reserved until delivery conditions.
- Fola: Receives artist-follow notification if relevant, saves a song, joins group chat; may voluntarily do a short paid event-assistant job to afford a ticket.

### WEDNESDAY — Deadlines and constraints

- Artist submission cutoff (RECOMMENDED Wednesday 20:00 WAT). If track missing metadata/rights approval by the final scheduling lock, reschedule to following Friday and notify artist; private auditions still possible but do not count as public release.
- Tobi finalises one release and verified rights attestation, schedules it for Friday; second song is blocked for same week without deleting first draft.
- Sarah receives a second brief and chooses between accepting that client or rehearsing for an existing show; cannot duplicate a sold exclusive beat without contractual permission.
- Amaka reviews the promoter, equipment and event expenses, identifies worst-case shortfall, and may cancel before tickets go on sale without penalising attendees.
- Ada opens performer applications and helps schedule practical venue promotion. A job must have a deliverable; sending messages alone does not guarantee payment success.
- David sends a nonbinding scouting message rather than locking Tobi into a contract while music is unapproved; sees virtual contract template.
- Kunle checks sponsor deliverable and conditions, can withdraw before commitment/after expiry per published terms, not after performance delivered.
- Fola uses Tonight in Lagos to RSVP to Saturday; follows music from other artists as well. Fans are never forced to pay simply to be counted as fans.

### THURSDAY — Announcement and social pressure

- Release preview permitted for artist-approved short clips only; preview activity **not chart eligible** before Friday. Artists can hide previews and still release Friday.
- Amaka confirms 5 performers and production equipment. If fewer than 5 apply, she can reduce slots or explicitly show a tagged house/NPC performer; no fake human applicant.
- Ada's promoted poster links to a ticket page and stream-safe preview; campaign earns reputation only on verified leads, bookings or executed tasks, not on purchased spam.
- David reviews showcases and notes artist's upcoming Friday release. His available company budget is shown separately from personal wallet.
- Kunle's sponsor credit appears correctly on event poster once authorised; sponsorship transfer/delivery conditions recorded.
- Fola and friends choose between the free public Friday showcase and a paid Saturday talent hunt. Friend group can reserve seats subject to real inventory.

### FRIDAY — The shared cultural moment

- 18:30 WAT (PROPOSED): reveal rankings for chart week that ended Thursday; Sunday news had only provisional charts.
- 19:00 WAT (PROPOSED): approved scheduled songs released and enter discovery; main event offers limited shared listening slots and browsable genre/district rooms, preventing 200 new tracks from requiring one serial performance.
- Tobi sees his release card and first eligible human listens/saves/follows; releases are not number one by default, and no chart score for NPC listening.
- Sarah's credits are visible, with opt-in portfolio link, so artist success may create future production work.
- Amaka scouts response to new songs and sends booking invites for future nights; promotional event card remains active.
- Ada discovers a song trending among real attendees and pitches its artist for a later concert; can earn a client relationship without inventing streams.
- David attends the release discovery session, may send a bounded offer effective next week; signed artist must still control own career, while label project budget caps obligations.
- Kunle hears a real, cleared song and considers a future campaign; cannot buy chart position.
- Fola listens, replays voluntarily, saves, follows; replays contribute *limited/diminishing eligible score* and soundtrack autoplay does not create infinite chart points. They receive concert notification if opted in.

### SATURDAY — One shared show, different careers

- Venue 50 capacity, 5 performance slots, paid tickets and open-mic/showcases nearby. Only real purchased tickets count as ticket sales; only real check-ins count as actual attendance. Additional visible NPCs are ambience.
- Tobi rehearses, performs using approved audio and avatar controls; if disconnected, preauthorised recorded act with correct rights can continue, otherwise organiser uses postponement/refund flow.
- Sarah appears credited on playable song; can attend as audience, network, take next booking, or enjoy personal music exploration.
- Amaka chooses pre-saved stage layout and soundcheck, checks capacity, ensures automated music transitions; responds to 1 production decision, not dozens of repeated chores.
- Ada checks attributed genuine purchase funnel, proposes one affordable late adjustment if undersold. No manufactured sales.
- David is a spectator/scout, takes postshow notes, makes offers. Being a label owner does not bar genuine fan activity.
- Kunle attends the event and receives sponsor benefit; expected ROI is not promised unless separate explicit investment agreement exists.
- Fola arrives with friend, finds music, dances and reacts, saves artist song, follows/joins community; if Fola dislikes the act they can leave, and artistic/cultural outcome may differ from ticket profit.
- Event runs timed segments: arrival/social 2m; opening/interactivity 2m; short performed acts 8–12m; audience choice/finale 3m; aftershow optional. Audience reactions are opt-in and not mandatory rhythm skill checks.
- Server instances can split audience for performance, but 1 bought ticket = one entitlement, and verified tickets/attendance are de-duplicated.

### SUNDAY — Consequences and new ambitions

- Tobi views genuine listens, follows and eligible concert discovery; city chart is not final until the next Friday. Applies to next week's opportunities.
- Sarah reviews session income, credits and repeat interest; refines music creation kit.
- Amaka sees separated figures for tickets sold, unique check-ins, show quality, promoter results, expenses, sponsor fulfilment and operating profit/loss; plans next show. Venue prestige records hosting future potential breakout but not instantly awards credit.
- Ada gets verified campaign summary, payment eligibility and new client leads; can bid on another event.
- David may offer Tobi a **next-week virtual project deal** with finite funded budget, specified term and eligible income split; it cannot retroactively claim Saturday ticket revenue or real music rights. Artist can accept or reject; one active financed-label deal per artist is recommended for V1.
- Kunle sees sponsorship fulfilment, attendance versus forecast and optional future finance opportunity; may lose funds if this was an investment rather than sponsorship, but sponsorship does not imply financial return.
- Fola sees saved tracks, followed artist feed, voluntary review and recorded concert attendance; optional early-supporter recognition only after artist later achieves qualifying rank. The fan remains a full player without a job.

### NEXT FRIDAY — Required delayed payoff

A track released last Friday has accumulated a full Friday–Thursday chart window. Its **first complete weekly placement** is officially published before the next release cycle. This avoids announcing an incoherent full-week chart only 48 hours after Friday's debut. Old tracks remain eligible in subsequent rolling weekly windows.

## 5. Money stress test — fictional amounts, verified mathematics

**Setting:** Amaka organises a 50-capacity talent hunt, controls financing and contracts. Kunle is a **sponsor**, not a revenue-share investor. Game naira illustrated here is a **simulation fixture** until a platform-authorised wallet exists.

| Source or cost | Game naira | Accounting meaning |
|---|---:|---|
| Amaka commits working capital | +12,000 | Funding, **not income** |
| Kunle pays sponsor amount | +15,000 | Event revenue if sponsor deliverable actually fulfilled |
| 20 unique tickets sold × 1,000 | +20,000 | Ticket revenue (cap 50), irrespective of NPC crowd |
| Pay Ada, promoter | -6,000 | Labour cost, real participant |
| Pay Sarah, original production/session | -4,000 | Provider cost, real participant |
| Pay Tobi, appearance guarantee | -3,000 | Artist fee, real participant |
| Pay NPC/platform equipment and service provider | -12,000 | Controlled expense to actual authorised payee/treasury sink |
| Cash left after expenses | **22,000** | 47,000 funds in - 25,000 paid |
| Return Amaka's committed working capital | -12,000 | Capital return, **not an expense** |
| Final operating profit | **10,000** | Sponsor + ticket revenue − event expenses |

**Failure case:** If only 3 real tickets sell, actual revenue = 15,000 sponsor + 3,000 tickets = 18,000 and costs = 25,000. Operating **loss 7,000**. Amaka recovers just 5,000 of their initial 12,000 commitment, subject to the event's contract and actual settlement. A staged NPC audience does **not** make up the difference.

**No account may spend a payment twice:** Funds committed to a valid show/artist project are reserved. Owner withdrawals cannot take reserved amounts. Idempotency and wallet state reconciliation are required once a real money provider is integrated. The standalone prototype can simulate these mechanics, not claim a usable Lagos Life balance.

## 6. Role-specific H-Path stress test

| Role | First fun in <5 minutes | Repeatable 10–20 minute session | How they contribute to others | Failure/recovery | Meaningful 30-day pursuit |
|---|---|---|---|---|---|
| Artist | Stage audition or create first beat/vocal | Record, rehearse, perform, review offers | Real music and concerts create demand | Failed audition → smaller/free slots and improve recording | District breakout, loyal fans, catalogue, chosen live identity |
| Producer | Beat-pad sequence | Complete actual creative brief, negotiate licensing/fee | Makes actual tracks for artists | Client rejection → original portfolio + other clients | Distinct production catalogue, repeat clients, reputation |
| Venue owner | Place stage/equipment and publish open mic | Book performers, prepare show, assess revenue | Sells room to artists/promoters/fans | Underfilled event → small/free programming and predictable recovery | Renowned quality/discovery venue without compulsory expansion |
| Promoter | Find venue brief / do placement activity | Execute campaign with lead and audience fit decisions | Connects demand to music, events and clients | Low ticket sales → measured client outcomes/another brief | Trusted district specialist or agency reputation |
| Label owner | Listen at a showcase and offer bounded deal | Select artist, fund projects, review risk and catalogue | Provides capital to artists/providers | Release flops → alter roster spend, scouting | Meaningful catalogue, artist-development history |
| Investor | Evaluate two pitches with clear risk | Negotiate sponsorship/financing, check settlement | Provides conditional funding where useful | Project underperforms → capped loss, learn, diversify | Credible portfolio and impact in entertainment economy |
| Fan | Hear approved song, react, follow artist | Free hangout, chat, attend show, save music | Supplies actual attention and optional ticket demand | Disliked show → leave, try another, no penalty | Musical taste, friend network, early-supporter status |

## 7. 25 critical edge cases and required responses (proposed)

| Case | Required game response |
|---|---|
| New player has zero money | Show free concert/discovery and finite, funded first jobs; never soft-lock |
| Existing Lagos Life player is wealthy | Can choose higher-cost opportunities once integration authorised, but cannot purchase chart rank or venue reputation |
| Lagos Life API unavailable / disconnected | Standalone game remains playable; wallet actions never claim platform transfer. Any balance migration requires explicit policy |
| Player has cash but business has no funds | Show transfer into business; business never silently draws personal funds |
| Business has cash but reservations are pending | Show *available* vs *committed* balance; owner cannot withdraw escrow/obligations |
| Artist signs label deal then spends rapidly | Spending only from finite pre-allocated project budget; no surprise drain of label company |
| Label owner offline | Artist continues spending within funded balance, recording, auditioning and earning; no blocking approvals |
| Label deal expires mid-project | Preserve money/contract ledger and settle according to disclosed eligibility/time rules; no retrospective seizure |
| Venue double-booking | Reject second final reservation/offer, release expired holds |
| Promoter accepts but disappears | Deadline and partial-work clauses; replacement or basic NPC service; unused committed payment refunded when rules allow |
| Performer doesn't show | Perform pre-authorised approved recording if permitted, substitute by agreement, or reschedule/refund |
| Venue owner offline at event | Previously approved lineup, automated check-in and playback continue; new financial decisions pause |
| Zero tickets sold | Warn early; choose cancel, reschedule or proceed at explicit loss; no fictitious attendance |
| Only 3 audience members online | Free/public small-format show still social; NPC crowd may decorate but not buy/vote |
| Buyer bought ticket but doesn't attend | Ticket remains a sale; attendance is a separate real check-in; refund only under disclosed terms |
| Fan disconnects during performance | Rejoin eligible event before expiry, preserve ticket and unique check-in |
| Double click purchase / unreliable network | Idempotent purchase: at most one charge/ticket per intent, reconcile pending payment |
| World crashes mid-event | Maintain tickets, freeze disputed settlement and reschedule or refund under event rules |
| Rights dispute on song | Quarantine playback, notify rights holder/artist and affected shows, adjudicate; preserve limited history as appropriate |
| Song not approved before release lock | Automatically move to next Friday, notify; no chart eligibility prematurely |
| Artist attempts second weekly release | Save draft but block second official Friday release |
| Auto-loop background song all night | Autoplay loops cannot farm chart points; genuine voluntary replays have capped/diminishing value |
| Multiple fake fan accounts / purchased reviews | Rate-limit and verify eligibility; flag patterns and withhold suspicious chart/vote effects |
| Promoter pays friends for artificial attendance | Count genuine purchases/check-in but detect related-account farming for charts/reputation; don't equate purchases with sincere fandom |
| Owner bankrupts company | Apply disclosed waterfall to available assets; player retains identity/history and free or paid job path |

## 8. Distinguish *gameplay fun* from *administrative work*

Every core profession must have: (a) a tangible action the player enjoys even without getting paid, (b) a strategic choice that can succeed/fail for understandable reasons, (c) social consequence and persistent history, (d) a repeatable short task, (e) a larger aspiration. Stage equipment placement should teach the stage once, allow saved layouts later and shift advanced difficulty toward choices, not repetition. Fans need an engaging free music/social loop or the ticket economy cannot sustain itself. Designers must measure how many users voluntarily repeat a session, not just how many collect the reward.

## 9. Proposed instrumentation for first validation

- First meaningful action completed within five minutes, by acquisition source, phone model and prior music-industry interest.
- First social action (follow, message, meet, job, concert) within first session.
- Artist: upload-to-approved, submit-to-release, first real unique listener, first follow, first audition, first gig.
- Venue: event draft-to-publish-to-real-ticket-to-real-check-in-to-settlement; profit/loss; satisfaction; repeat attendance; share referrals.
- Producer: beat created, session acceptance, completion, reuse, credited release; device audio and microphone failures.
- Promoter: valid campaign brief response, accepted contract, attributed genuine discovery/ticket action, repeat client.
- Investor/label: viewed pitch, bounded funding committed, actual project spend, earned/lost, settlement successful, repeat backing.
- Fan: first voluntarily completed track, first save/follow, first social visit, paid/free concert participation, invitation/friend return.
- Supply/demand: unique human audience per show, event concurrency overlap, fraction of events with zero genuine attendees, offer response times, NPC fallback reliance.
- Currency: verified source, payer, payee, commitment, transfer, refund, event/contract, audit references; reconciliation failures and 1-account concentration.
- D1/D7 return by *career*, fan-only vs business owner, and income cohort. All set numeric thresholds are hypotheses for testing, not established benchmarks.

## 10. Decisions to take after reviewing this stage

**Review now:** 
1. Is one dense district and small-group talent hunt the correct social starting environment?
2. Is the fan's everyday music discovery/hangout compelling enough without financial rewards?
3. Is the 3D stage-layout interaction too mechanical, or is it a satisfying two-minute skill action?
4. Should every artist's first accepted song be playable through a verified real track OR original vocal over original producer beat, as decided, with upload restricted to artist identity?
5. Should the label contract reserve an up-front project budget with one active funded deal per artist in V1?
6. Can a venue launch a show without hiring a human promoter if their own chosen campaign is sufficient, with NPC alternatives?
7. Should one short public talent-hunt be the first multiplayer event, with recurring Saturday concert programming?
8. Should the official weekly chart be revealed Friday before new releases rather than Sunday, which would show only partial-week results?
9. Are basic job wages and company money both settled through our **standalone** controlled ledger until provider support, with no automatic Lagos Life cash migration?
10. Is success **separate** for ticket revenue, unique human attendance, artist fandom and venue quality?

**Design next (Stage 3):** Provide executable interaction specifications for each role's first job, first contract, first event, first loss and first recovery; enumerate UI screen transitions, server events, state machines, permissions, edge cases, exact economic invariants and acceptance tests. Produce a role-by-role quest/interaction catalogue with at least 10 meaningful repeatable actions per launch role, showing NPC fallback and time-to-complete. Then specify charts, rights, wallet adapters and full real-time event lifecycle separately.

## 11. Research basis (use as method, not endorsement)

- Roblox Creator Hub core loops: https://create.roblox.com/docs/production/game-design/core-loops
- Roblox Creator Hub onboarding: https://create.roblox.com/docs/production/game-design/onboarding
- Roblox Creator Hub prototyping/edge cases: https://create.roblox.com/docs/production/game-design/prototyping
- Roblox Creator Hub retention: https://create.roblox.com/docs/production/analytics/retention
- Roblox Creator Hub social behaviour: https://create.roblox.com/docs/production/game-design/design-for-roblox

**Important:** No external named expert was consulted, employed or asked to endorse this document. The expert-lens framing in the matrix is an analytical framework based on published work.
