# THE SCENE
## H-Path Player Interaction Matrix & Conversation-Preservation Register

**Version:** 0.1 · **Status:** Working design for founder review, **not yet a build specification**  
**Date:** 11 October 2026 · **Time basis:** West Africa Time (WAT, UTC+1)  
**Purpose:** Preserve decisions from the full concept discussion and map every player career, player-to-player dependency, activity, economic interaction, fallback, and measurement. This file must stand alone when passed to a development agent without chat history.

> **How to read this:** **[AGREED DIRECTION]** = repeatedly established in the conversations; **[DESIGN PROPOSAL]** = recommended but not approved; **[DEPENDENCY]** = cannot be assumed until Lagos Life publishes a suitable API; **[DEFERRED]** = possible later; **[REJECTED AS CORE]** = discussed but superseded. Amounts, tiers, capacities and clock times are proposed balancing values unless stated otherwise.

### What “H-Path” means in this working document

The name **H-Path** did not have a verifiable, specific game-design definition in the available material. For this matrix, it is used as a *horizontal, end-to-end audit of a human player's path* through the game, not as an externally established methodology. Every playable identity is reviewed through the same sequence:

**H0 Arrive → H1 Find something to do → H2 Perform a genuinely enjoyable action → H3 Connect with people → H4 Exchange value / face a decision → H5 See consequences and progression → H6 Return (or recover from failure).**

The columns in the role matrix follow this sequence. The telemetry chapter measures where this path breaks. This working meaning can be renamed later without losing the underlying design.

---

# 1. North star, scope, non-negotiables

**THE SCENE** (working title) is a **multiplayer, persistent, music-industry life simulation** designed to connect with **Lagos Life accounts and Lagos Life game naira** when authorised APIs exist. It is **not** a promotional minigame for Desk and **not** primarily a record-label tycoon. The playable world is the music economy: music creation, auditions, fans, venues, promoters, recording studios, label financing, investments, concerts, local charts, awards, and player-generated industry news.

### 1.1 Non-negotiable experience invariants

1. **Every avatar is a person first, profession second.** One account can be a fan, artist, promoter, investor and venue owner over time; careers can coexist and evolve. No forced irreversible class selection.
2. **Every meaningful career has a game.** At least one immediate playable action, a strategic decision, a way to earn/spend game naira, a reason to collaborate, a failure mode, recovery, and long-term mastery. A small 50-seat venue can be a whole career.
3. **One shared city clock.** Release Friday, chart announcements, concerts and awards happen at shared real-world times; personal progress runs continuously at individual pace. All displayed times localise from WAT.
4. **Actual music is central.** Cleared real recordings and permitted original in-game compositions can be auditioned, released, followed, showcased and performed. Artist profiles may link out to official music pages. Music never becomes merely background decoration.
5. **Real fans are real players.** An avatar may be a fan regardless of profession. Genuine listening, saving, event attendance and voluntary follow relationships produce authentic in-game demand; no rewards for artificial external music streams.
6. **Existing Lagos Life game money is intended as the only spendable currency.** No replacement coin, fake bank balance or real-world withdrawal. Prototype money must be clearly simulated and isolated.
7. **Wallet connectivity is contingent.** Public October 10 reporting announced third-party account access and spending of game money; player-to-player payouts, ticket settlement, escrow, refunds, lending and developer revenue are **not documented commitments**.
8. **NPCs prevent emptiness, not counterfeit transactions.** NPC crowds do not buy real tickets, create game naira, cast public votes or create valid human chart listens. Routine NPC service fees/rewards require an authorised wallet source if real balances are affected.
9. **Every significant result has a public or private consequence.** Careers, firms, contracts, releases, shows, rankings, relationships, awards and verified histories persist.
10. **Simple on the surface, deep underneath.** 2–5 minute first tasks; no accounting expertise; mobile-first browser, low-data mode, clear feedback and approachable controls.
11. **Meaningful failure, not account destruction.** Bankruptcy can close a virtual business; the avatar retains identity, nonfinancial skill and pathways to employment/recovery.
12. **No unwarranted partnership assumption.** Build stand-alone and adapt to a published API; the founder does not want a bespoke partnership agreement as a prerequisite.
13. **Business realism has boundaries.** Fictional contracts do not transfer real song rights. No real cash-out, misleading investments, guaranteed chart success or paid votes.

### 1.2 Superseded concepts retained for historical clarity

- **[REJECTED AS CORE]** “Desk software recreated as a game,” “record-label manager only,” “Frequency” underground sound-collection/heist game, and primarily selling music placements to clubs. Playable rhythm activities, exploration, and creator tools may be reused as optional activities, not as the game identity.
- **[AGREED DIRECTION]** THE SCENE is an independent music-industry world whose success may later create business for Desk. No need to expose Desk in initial gameplay.
- **[AGREED DIRECTION]** DJ **is not a required player career**; approved playlists and reliable transitions are handled by the automated event playback system. Live DJ controls can be reconsidered later only if they create a distinct, useful profession.

---

# 2. Player roster & universal H-Path

### 2.1 Common player account (applies to all)

**Account:** `player_id`, optional linked `lagos_life_account_id`, display name, avatar, appearance, owned assets, business memberships, permissions, reputation dimensions, experiences/skills, social graph, followed artists/venues, personal calendar, history, notification settings, and wallet connection status. Store only the minimum information necessary and use platform-permitted identification.

**Universal player loop:** enter → see **Tonight in Lagos**, opportunity board, followed-artist feed and calendar → choose an activity → play/interact → accept outcome → share/continue → return. No role selection is needed to listen to songs, attend a public event or follow artists.

### 2.2 Top-level interaction matrix (all occupations)

| ID / career | H0–H2: first enjoyable action / immediate loop | H3–H4: people and economic exchange | H5–H6: progress / risk / reason to return |
|---|---|---|---|
| **R01 Artist** | Hear music, audition at open mic, rehearse/record permitted song, play first performance | Producer, studio, manager, promoter, venue, label, investor, fans; pay for recording/events; earn fees and eligible virtual revenue | Fans, releases, charts, bookings, identity, catalogue; lose money on a show, fail audition, recover through small gigs |
| **R02 Producer** | Complete beat-pad/sequencer or arrangement minigame; make demo | Work with artists, studios and labels; sell original beats/session services, agree fictional credits | Creative mastery, catalogue and credits; low demand or rejected work; new briefs/collabs |
| **R03 Studio owner / engineer** | Accept booking; prepare booth; manage short studio session | Rent studio to artists/producers; hire staff/equipment | Improve sound, reliability and booking demand; maintenance, empty calendar; find new bookings |
| **R04 Promoter / agency** | Claim event or song campaign; create route, pitch venue, execute short promotional tasks | Clients: artist, label, venue, organiser; hire other promoters; earn fees/bonuses | Campaign case studies, district expertise, roster; underperformance, missed deadline; new contracts |
| **R05 Venue owner** | Inspect small space; configure layout; publish open mic or talent hunt | Rent to organisers or host shows; hire promoter, artist, producer, equipment; sell real-player tickets | Reputation, occupancy, acoustics, discovery legacy, margin, rankings; low turnout/overexpansion; next event |
| **R06 Event organiser / festival operator** | Choose event template; solve stage/lineup/budget problem | Rent venue; book acts; hire promoter/services; recruit sponsor; settle ticket revenue | Successful events, promoter network, festivals; cancellations and losses; new events |
| **R07 Record-label owner / A&R executive** | Attend showcase; listen to auditions; make offer; choose campaign | Sign artists with virtual scope, finance approved plans; hire managers/promoters/studios; receive permitted shares | Roster, catalogue, successes, label prestige; flops, roster churn and cash flow; new submissions |
| **R08 Manager / booking agent** | Find one artist gig and negotiate a booking | Represent artists under time-bounded scope; secure offers; earn contracted commission | Better clients, booking history; inactivity/poor delivery; new offers and negotiations |
| **R09 Investor / sponsor** | Inspect a venue/show pitch; choose backing type; counteroffer | Back artists, labels, venues, equipment ventures; finance projects; sponsor branded events | Return and impact histories, portfolio, status; project losses or illiquidity; new opportunities |
| **R10 Lender / virtual bank** | **Deferred:** review eligible application, offer term sheet | Approved funding and repayment schedule under platform-permitted mechanics | Defaults, liquidity, risk analysis; not launchable until API explicitly supports loans/collection |
| **R11 Equipment supplier / production crew** | Prepare sound/light rental kit; complete simple production challenge | Rent virtual PA/lights/screens, staff shows; charge fee/deposit if supported | Equipment quality, portfolio, maintenance; damaged assets, overbooking; repeat rentals |
| **R12 Scout / talent agent** | Attend auditions, evaluate music, save prospects | Refer artists to labels, venues, managers or investors for agreed service fees | Discovery history and hit rate; wrong picks, poor reputation; new talent pipeline |
| **R13 Fan / tastemaker** | Listen to one new track, save/follow, attend free event | Buy valid tickets, discover/share, join fan clubs, review attended shows; optionally scout | Early-supporter badges, discoveries, community, taste graph; no business required; new songs and shows |
| **R14 Fan-community organiser** | Form opt-in fan group, schedule meetup/listening party | Artists, fans, small venues; organise safe gatherings, optional paid events with clear terms | Community trust and event history; moderation problems, low attendance; artist updates |
| **R15 Music media / journalist** | Cover public Release Friday, publish verified event recap | Interview consenting artists; collaborate with venues/labels; optional disclosed sponsorship | Readership, credibility, archives; corrections/reputation; unfolding industry news |
| **R16 Casual guest / worker** | Join a public event or take a 2-minute paid gig; no business setup | Offer basic service, support friends, attend shows | Gain first skill, meet players, choose later career; no dead-end without wealth |

**Cross-cutting rule:** All R01–R16 players may be fans. Multiple roles can be held simultaneously; per-transaction permissions depend on each business/account relationship.

### 2.3 Career card requirements — mandatory for *every* future detailed chapter

Each career's own documentation must contain exactly these review fields: **entry point; initial assets; first 60 seconds; first 5 minutes; daily 5-minute activity; 20-minute loop; 1-hour collaborative experience; actions done physically; strategic choices; earning paths; spending paths; assets/skills; services provided to whom; services required from whom; NPC fallback; asynchronous inbox actions; success conditions; failure/insolvency; recovery; public reputation; fan participation; abuse vectors; metrics; live-ops content; exit/rejoin; accessibility.** Missing fields constitute an incomplete character design.

---

# 3. Relationship and interaction matrix

**Key:** `PLAYER → PLAYER` identifies offer initiator and counterparty. NPC fallback is not equivalent to a human transaction. `P0` = vertical-slice essential; `P1` = major release; `P2` = expansion.

| ID | Initiator → counterparty | Interaction / actual action | Result and safety/fallback | Priority |
|---|---|---|---|---|
| **I01** | Artist → Venue | Apply for open mic / audition; upload preview, reserve slot, show up | Invitation, performance experience, possible new fans; NPC/community slots if owner offline | P0 |
| **I02** | Venue → Artist | Request performance, offer fee, define date/capacity | Contract, performance; expiry when unanswered | P0 |
| **I03** | Venue → Promoter | Post brief: recruit artists / sell concert | Paid campaign milestones; track verified sources and attendance | P0 |
| **I04** | Promoter → Venue | Pitch event / booking proposal | Owner accepts/counters; new concert opportunity | P0 |
| **I05** | Artist → Producer | Book beat/session; exchange demo, agree usage scope | Playable original recording/credit; rights terms explicit | P0 |
| **I06** | Artist → Studio | Book room, rehearse, record | Booking fees and recorded project; NPC studio available | P0 |
| **I07** | Producer → Artist | Offer beat, invite collaboration | Shared creation/credit; no automatic real-world IP transfer | P0 |
| **I08** | Artist → Promoter | Hire district release campaign | Budgeted promotional minigames + genuine discovery response | P0 |
| **I09** | Fan → Artist | Hear approved clip, follow/save/join opt-in fan club | Fan relationship; notifications if opted in; **no pay-for-stream** | P0 |
| **I10** | Fan → Venue / Organiser | Discover event, buy ticket, RSVP, enter | Authorised wallet debit, verifiable entry, refund terms | P0 **wallet-dependent** |
| **I11** | Venue → Organiser | Rent space or co-produce show | Rental or revenue split; schedule inventory locking | P0 |
| **I12** | Organiser → Artist | Book appearance and setlist | Accepted performance fee/slot; cancellation remedies | P0 |
| **I13** | Organiser → Equipment provider | Rent PA/lights/stage | Equipment available; service expense and quality effects; NPC supplier baseline | P1 |
| **I14** | Organiser → Investor | Pitch show budget, capacity, projected ticket demand | Funding under transparent limited project scope; investor bears stated risk | P1 |
| **I15** | Label → Artist | Offer signing for *virtual* project/revenue scope | Approved label budgets, agreed virtual split, expiration, opt-outs; never real master transfer | P1 |
| **I16** | Artist → Label | Submit project/funding request | Approval, counteroffer or refusal by deadline; no indefinite career lock | P1 |
| **I17** | Label → Promoter | Commission release or event promotion | Contracted job and reporting; no guaranteed charts | P1 |
| **I18** | Label → Producer/Studio | Commission tracks or sessions | Production output with permits and fictional credits | P1 |
| **I19** | Artist → Manager | Representation request; review authority and commission | Time-limited mandate, delegated tasks, automatic inactivity protection | P1 |
| **I20** | Manager → Venue/Organiser | Negotiate booking on artist's behalf | Artist-accepted or preauthorised booking; commission settlement | P1 |
| **I21** | Scout → Artist | Discover at event; request permission to represent/refer | Opt-in lead and credits; no forced data-sharing | P1 |
| **I22** | Scout → Label | Present roster candidates | Approved scouting payment on agreed, verifiable outcome | P1 |
| **I23** | Investor → Venue | Finance upgrades or acquire permitted virtual interest | Separate project entity, dividend rules, risks and rights | P1 **wallet-dependent** |
| **I24** | Venue → Promoter → Artist | Organise talent hunt, audition, judge, book winner | Multiple careers in one flow; audience votes guarded from manipulation | P0 |
| **I25** | Venue → Fan | Announce event; offer listening party, meetup or concert | Public event discovery and ticket interest | P0 |
| **I26** | Fan → Fan | Share track/event; invite friend; attend together | Social graph, invite conversion; opt-in consent and anti-spam | P0 |
| **I27** | Fan → Scout/Label | Opt in to scout role; recommend emerging act | Discovery credit only if recommendations genuine; no paid boosting | P1 |
| **I28** | Fan group → Venue | Book fan meetup/listening event | Venue hire, social attendance; capacity/safety checks | P1 |
| **I29** | Venue → Venue | Compete for date, headliner, sponsor, quality ranking | Strategic rivalry without destructive attacks | P1 |
| **I30** | Label → Label | Compete for available talent; voluntary joint projects | Bidding/alliances within transparent market rules | P2 |
| **I31** | Artist → Artist | Collaborate, feature, headline/support act | Joint performance or track; permissions and fictional income split | P1 |
| **I32** | Organiser → Fan | Event operations, entry, performance, review request | Verified attendance and optional rating; review authenticity controls | P0 |
| **I33** | Media → Public roles | Report verified chart movement, concert outcome, award win | Scene Daily, viral content; avoid defamatory invented stories | P1 |
| **I34** | Award programme → Eligible players | Nomination, public category voting, ceremony | Transparent category rules, anti-multiaccount ballots, permanent awards | P1 |
| **I35** | Venue → Awards programme | Apply to host season ceremony | Transparent eligibility/selection, paid hosting fee if approved | P2 |
| **I36** | Player → Virtual bank | Apply for virtual loan, accept repayment | **Deferred** until documented lending/recoup API; no real debt | P2 |
| **I37** | Business → Staff/worker | Create short job; complete action; pay verified result | Economic mobility for low-balance players; NPC fallback | P1 |
| **I38** | Song → Venue/Promoter/Label | Chart breakout triggers opportunity notification | Timely scouting and booking demand, rate-limited alerts | P0 |
| **I39** | Artist → Audience | Live in-world showcase; approved song playback | Voluntary save/follow, real attendance; NPC reactions excluded from real metrics | P0 |
| **I40** | Event → Social network | Generate shareable poster, event link and result card | Track referrals into actual play, tickets, or follows | P0 |

### 3.1 Asynchronous transaction contract

Every business offer must have `offer_id`, initiator, target, role/business context, required deliverable, optional wallet amount, permitted split, start/deadline, `status` (`draft → sent → viewed → countered/accepted/declined/expired → fulfilled/disputed/closed`), cancellation/refund conditions, immutable audit trail, and notification preferences. No automatic approval from silence. Players may hold multiple pending offers. Timeouts must free inventory/slots, not trap artists in inactivity.

---

# 4. Deep micro-interaction paths (gameplay → economy → social proof)

## M01 — Small venue hosts talent hunt (**P0**)

**Players:** Venue owner, promoter, 3–5 artists, producer(s), fans, potential label/scout. **NPC:** stage assistant, queue host, idle audience for ambience only.

1. Venue owner opens a 30–80-capacity venue; selects **Talent Hunt** template, date/format, performer slots, reward, production package, ticket price, staffing, and budget.
2. System shows **maximum revenue**, **break-even tickets**, budget gap, event capacity, and warning when tickets cannot cover costs. An event is never free to produce merely because a venue exists.
3. Owner can simplify show, book lower-cost package, secure sponsor, or accept risk. Promoter posts/accepts offer, undertakes mini-tasks, creates poster/link.
4. Artists apply with approved clips; owner and/or judge selects lineup; reserve slots; rejected applicants receive constructive next opportunities.
5. Producer helps selected artist rehearse/prepare; fans discover poster on WhatsApp/X/IG/TikTok or in Tonight in Lagos and optionally follow/buy.
6. At fixed time, stage host runs 60–120-second performances, visual performance actions, fair audience vote with eligibility rules. NPCs do not vote.
7. Results: winner gets stated booking/prize; venue gains event and discovery history; promoter gets campaign report; artists gain performance credits, fans; financial settlement only via authorised API.
8. Shared records create share card: finalist, winner, early supporter, venue discovery history, verified real attendance.

**Critical edge cases:** too few applicants (NPC act or reduced format clearly tagged); 0 tickets (cancel/refund/proceed); winner offline (pre-recorded cleared performance or slot forfeiture rule); concurrent shows (city calendar demand warning); uploaded audio missing rights (no publication); promoter disappears (timeout + NPC basic service).

## M02 — Artist from audition to district chart (**P0/P1**)

Talent hunt → first 5 fans → optional studio session → approved track submission → Wednesday cutoff → Friday release → listeners genuinely discover/choose to save → local chart → label/promoter/venue offers → book first paid performance → earn real virtual ticket/appearance payout → bigger districts → Lagos Top 100 / aspirational Top 10. No forced minimum artist rank to rent arena; booking prices, real demand and risks regulate feasibility.

## M03 — Concert production and payout (**P0**)

Organizer chooses event, venue slot and capacity → authorised funding or guarantee (later actual wallet) → venue rental and lineup offers → production equipment selection (sound/lights/visuals/staff) → promoter work and shareable poster → actual real-player ticket inventory → sound check → live performance with automated music playback and interactive audience → unique check-in and completion → refunds/fees/contract settlement → historical concert page and rankings.

**Bookkeeping:** tickets sold cannot exceed configured capacity; account activity is not ticket check-in; accepted funding is not profit; ticket sales cannot be projected as actual receipts; NPC attendance is never a financial source. Paying spectators hear licensed material; streams outside game are never required.

## M04 — Label funds an artist (**P1**)

Label scouts on Release Friday or audition → negotiates project-specific *virtual* rights, term and eligible income split → funded budget is allocated to artist workspace → artist proposes song, studio, promotion or show → label approves/counters within defined response window → approved spend pays provider from label's authorised funds → performance data and settlement ledger update → artist receives contractual proceeds, label gets eligible share → agreement expires or can be renegotiated. Artists must be free to use permitted independent activities and must have an escape from inactive labels.

## M05 — Fan becomes a tastemaker (**P0/P1**)

Enter from concert poster → preview licensed song → opt to follow artist → see optional updates in feed → RSVP/buy ticket → attend show with friend → save/review event → receive early-supporter badge if artist later climbs chart → build public discovery history → optional opt-in paid scout opportunity from label. No money rewards for external streams, autoplay, manipulative voting or repeated listening.

## M06 — Investor builds music-business portfolio (**P1**)

Investor discovers artist campaign/venue/organiser proposal → reviews plain-language cost, risks, predicted demand, existing debt and eligible share → makes finite virtual commitment with conditions → payment uses authorised platform hold/transfer (not assumed) → project buys actual player/NPC services → verified ticket revenue and permitted game earnings settle costs and virtual profit → investor gains/loses funds and reputation → can refinance or exit under agreed terms. Sponsorship buys disclosed brand placement, **not chart position**. Loans are **P2 dependency**, not in MVP.

## M07 — The Scene Honors (**P1**)

12-week proposed award seasons → nomination by eligibility rules (music, label, producer, promoter, venue, concert, discovery, community) → separate fan, statistics, and panel categories → eligible-player vote 1/account/category after antifraud checks → nominations share cards → ONE official live red-carpet/ceremony plus staggered instances → awards become permanent history → nominated venue may compete to host future awards. Working event brand: **The Scene Honors** (user's 'Eddies'-style award idea; avoid using an existing award's protected identity without permission).

---

# 5. Core world systems and rules

### 5.1 Locations and world structure

Start with **one dense music district**, not dozens of empty places; open additional Lagos-inspired districts when concurrent player density permits. Virtual locations: street/social hub, artist audition studio, public production studio, small open-mic venue, promoter office, label office, opportunity board, record-release hall, song discovery rooms, event calendar, scene newsstand, fan meetup spot, and one larger concert hall later. Travel should be optional fast travel for low-end mobile. Building interiors have actual interactions, not decoration only. Longer term: venues/chains and expanded cities if platform permits.

### 5.2 Venue identity and quality

Capacity tiers proposed for balancing: **30 → 80 → 250 → 750 → 2,500 → 5,000+**. Treat tiers as upgrade ceilings, not automatic real audiences or prerequisites for cultural prestige. Independent progression axes: acoustics/production, audience experience, discovery prestige, business efficiency, reputation, financial health, repeat customers. A legendary 80-person venue can outrank a poorly operated arena in **quality** while the arena tops **gross ticket sales**. Maintenance, equipment rental, artist fees and staffing are ongoing costs. Permit low-risk rentals and high-risk self-promoted shows.

### 5.3 Music supply and creation

Song status: `draft → rights-review → scheduled → Friday released → discoverable → chart-eligible → archived/removed`. Song data: verified uploader, rights warranty / actual permission evidence, audio preview/playback rights, title, credited participants, genre/tags, artwork rights, original release URL optional, in-game release time, allowable sharing/remix scope. Production system begins with simple original/cleared loop sequencer and optional browser voice recording with consent; no automatic permission to sample or remix commercial tracks. Approved real songs and original in-game tracks coexist. In-game fictional signing transfers only the *defined game economy entitlements*, never real copyright.

### 5.4 Music discovery & charts

Every district has **Top 20**, city has **Lagos Top 100** and highly visible **Top 10**; also **Rising Artists**. Charts use *verified unique human activity* and quality signals (eligible listens, explicit saves/follows, voluntary event engagement), not media spend, NPC crowd animations, repeat farms or external streaming activity. Algorithm, lookback window, weighting, anti-bot thresholds and tie-breakers remain **OPEN** for a future spec; do not invent values. Other charts: venue quality and gross separately, promoter results, label development, producer credits, discoverer reputation. No paid ranking and no free-for-all voting affecting charts.

### 5.5 Fan identity and social graph

Fandom is **orthogonal to profession**, never requires choosing 'fan' as permanent career. Fan feed: followed artists, music releases, venue events, RSVP, listening parties, achievement messages, preferences, follows, fan communities, saved songs, concerts attended, voluntary reviews, early-discovery badges. Specific notifications are opt-in and throttled; players can mute artist/venue and choose reminders. Fan-community members can host eligible meetups; social graph should not expose private location, contacts or private financial data. New audiences enter via share link and can see an event/song without upfront profession setup.

### 5.6 Live shared calendar and concurrency

**Proposal (WAT, subject to playtest):** Thu 7 PM preview; Fri 7 PM Release Friday Live; Sat 7–10 PM featured concert windows; Sun 8 PM charts reveal. Submitted music closes Wednesday for that Friday after moderation; early drafts can exist any day. One shared clock; independent daily work, 2–5 min gigs, 10–25 min open mics, 15–40 min district concerts, special major events up to about one hour. Encourage a limited number of featured concurrent shows when userbase is small; players may run independent events with honest demand projections. Larger concerts run synchronised instances without fabricating check-ins. Replay counts separate from live attendance.

### 5.7 Awards

**Proposed:** four 12-week seasons/year; weeks 1–8 earning eligibility, 9–10 nomination, week 11 vote, week 12 ceremony. Categories: song, artist, breakthrough, producer, collaboration, label, promoter, venue, concert, development, community, fan choice. Mix transparent statistics, eligible fan ballot and qualified/published panel for creative categories. 1 eligible voter/account/category, auditable anti-manipulation. No purchasable votes or guaranteed sponsors' awards. Live nominees/costumes/arrival, performance, awards, afterparty; player venue can later host by clear criteria.

### 5.8 NPC classes and offline continuity

`NPC_AMBIENT` crowd only; `NPC_SERVICE` baseline staff/studio/equipment/automated DJ; `NPC_QUEST` small paid gigs with **authorised reward source**; `NPC_INDUSTRY` fictional auditions/clients/acts with clearly tagged fictional profiles; `NPC_EVENT` hosts, soundcheck, stage management. Explicitly distinguish real players vs simulated demand and attendance everywhere. Offline players have company inbox, expiring offers, authorised delegation and automatic cancellations; no irreversible approvals by silence. Public shows require failover if actor offline (recorded cleared performance, reschedule or refund per contract).

### 5.9 Economy and insolvency

Single intended unit: **Lagos Life game naira**. Internal records are accounting mirrors, not spendable substitute balances. Every authorised value transfer should have external transaction ID, business/contract/project IDs, payer, payee, amount, status, timestamps, fee, idempotency key, and reversible correction/audit history. Distinguish budgeted commitment, reserved amount, actual transfer, simulated NPC score, actual sales and net profit. No NPC money printing, duplicated wallet credits, accidental real-money implication, or unlicensed conversion. Fees/sinks, money sources and limits need platform approval. Bankruptcy affects business ownership/contracts, not avatar existence; failed players can work/rebuild. Lender/bank mechanics remain deferred until formal wallet support.

### 5.10 Publicity and player-created culture

Official share assets: release poster, concert announcement/ticket link, chart movement, award nomination, sold-out verified show, venue promotion, label signing, talent-hunt result, business turnaround. Native social share to WhatsApp, X, Instagram, TikTok with safe redirects and attribution. **The Scene Daily** publishes verified industry happenings and editorially disclosed sponsored content; no made-up player scandal. Permanent milestone history for songs, venues, artists, campaigns and fan early-supporter status.

### 5.11 Real-world bridge and possible monetisation (not the game's core objective)

The game should be enjoyable for everyone even if they never become Desk customers. Later, participating *real* independent artists may independently opt into OrderSounds services, while properly disclosed sponsored showcases, paid brand experiences or the platform's **as-yet-unpublished** developer revenue program could produce real-world business revenue. **Do not treat game naira volume as OrderSounds cash revenue.** Real artist campaigns should never guarantee chart rank, play counts or Spotify streams. Preserve separate columns in analytics for game economic volume, real money actually earned by OrderSounds, and voluntarily attributed artist acquisition.

### 5.12 Applied expert design lenses (framework only; no actual expert participation)

The previous concept work used five public game-creator philosophies as a review framework; these are **not employees, consultants or endorsers**: **Dan Houser / Rockstar** (place, characters and emergent dramatic situations); **Will Wright / The Sims / SimCity** (systems, freedom, multiple personal success definitions); **Raph Koster / Ultima Online and Star Wars Galaxies** (interdependent professions, social economies and NPC fallback); **Saxs Persson / Minecraft, Epic and Meta Horizon** (creative/social worlds, avatars, user-generated experiences, mobile-first social density); and **Celia Hodent / Fortnite UX** (first-five-minutes clarity, usable difficulty, feedback, progression). Each future career chapter must be critiqued through all five lenses, in addition to economy and retention testing. Do **not** use the experts' names as fictitious approvals.

### 5.13 Dynamic stories and social consequence

Procedural and player-originating challenges provide drama, but must be fair and disclosed: a major act cancels; competing venues bid for the same date; a promoter loses a client; an equipment shortage forces a lower-budget show; a label artist wants to renegotiate; a sudden district breakout creates new offers. The player sees options and plausible consequences, not random unexplained destruction. **The Scene Daily** converts publicly verifiable developments into the world's collective memory. Status and history should matter as much as money; the legendary small venue that hosted a future hit deserves recognition without building a stadium.

---

# 6. Instrumentation: operational metrics, definitions, and questions

These are *analytics metrics*, distinct from the *interaction matrix*. Track on event completion server-side and never use a simulated NPC as a unique human player. Avoid identifying information in public leaderboards beyond the player's chosen public profile.

| Group | Metric / formula | Why it matters / segmentation |
|---|---|---|
| **Acquisition** | Verified unique game entries by referral source; poster click → land → account linked/guest → first activity | Determine whether off-platform sharing drives actual playable visits; social source, role, device |
| **Activation** | `% of new players completing first meaningful action within 5 minutes` | Onboarding confusion and time-to-fun; low-end phone, guest versus account |
| **First social interaction** | `% of activated players who complete an eligible P2P interaction in first 24h` | Is the world meaningfully multiplayer? Distinguish non-economic follow vs contract interaction |
| **Return** | D1/D7/D30 returning-player cohort rates; 7-day weekly active ratio | Does a profession stay interesting after novelty? By role and cohort |
| **Session** | Median active session minutes, exits by screen, crashes and reconnects | Avoid inflating session time with idle music playback |
| **Career health** | `players completing ≥1 meaningful role action / active players in that role` | Who has no activities to do? Distinguish dormant role vs current active role |
| **Role freedom** | Mean eligible profession types tried; role-change/cross-role activity frequency | Are players living broader music lives or trapped in class silos? |
| **Matchmaking** | Offer posted → first qualified response time; offer acceptance rate; offer expire rate | Are role markets liquid when players are offline? By district, role and budget |
| **NPC reliance** | Baseline service sessions completed by NPC / all relevant service sessions | Detect workforce shortages; never conflate NPC economic output with human work |
| **Human collaboration** | Completed human-to-human contracts / completed service contracts | Is a real-player economy developing? Control for low user volume |
| **Concert demand** | Verified ticket purchases / eligible capacity; unique check-in / purchases; repeat buyers | Distinguish buyers, attendees and NPC crowd. By event class and price |
| **Concert fun** | Voluntary activity participation and post-event satisfaction among unique actual attendees | Quality and reasons to return; avoid forcing reviews |
| **Event cancellation** | Cancelled / scheduled; refund success rate; no-show cause | Reliability and fair outcomes across venues |
| **Venue career** | Successful events/month, utilisation of *available bookable slots*, customer repeat rate, reputation, profit | Venues have meaningful progress apart from capacity |
| **Artist career** | Approved releases, audition conversion, unique eligible listeners, saved/followed rate, bookings, verified show conversion | Actual development across releases; do not equate in-game plays with Spotify streams |
| **Producer/studio** | Sessions completed, repeat artist clients, accepted creations, original credits, equipment uptime | Creativity and economic opportunity |
| **Promoter** | Client retention, contract delivery, attributed qualified event visits and ticket interest, cost per *eligible* outcome | Work quality beyond simply spending virtual money |
| **Label** | Active artists funded, budget utilisation, artist outcomes, recoupment quality, artist churn | Responsible label strategy and contractual fairness |
| **Investor** | Projects funded, real wallet amount at risk, closed project return, defaults and diversification | Understand risk, prevent promised/fabricated yield |
| **Fan depth** | Unique clips listened, voluntary saves/follows, follower → event viewer → buyer → attendee, repeat attendance | Fan identity is central; measure real people without reward loops |
| **Music discovery** | Release preview completion, unique eligible listens, save-after-listen, new artist discovery outside follow graph | Is Release Friday actually enjoyable? |
| **Charts integrity** | Flagged listening/vote ratio, unique humans vs raw plays, manipulated transactions blocked | Defend chart and award trust |
| **Awards** | Eligible nominees, distinct ballots, turnout, ceremony check-ins, integrity flags, follow-up engagement | Measure cultural relevance beyond vanity vote total |
| **Wallet integrity** | Authorised debit/credit success, reconciliation mismatch, duplicate idempotency attempts, refund timeliness | Cannot promise connected economy without correct payment semantics |
| **Market distribution** | Share of tickets/bookings/contracts captured by top 1% of businesses and by new entrants | Detect domination, empty small venues and inaccessible careers |
| **Economic sustainability** | Sources vs sinks by permitted platform type; wallet balance distribution; median P&L by profession | Inflation, wealth concentration, failure/recovery risks |
| **Failure & recovery** | Virtual business insolvency rate; `% failed-business owners who complete another meaningful action within 7d` | Failure must create new story rather than churn |
| **Sharing** | Share card generated → link opened → qualified entry → first activity → event RSVP | Viral stories must connect to actual gameplay, not screenshots alone |
| **Reliability** | p95 join-to-interact latency, play audio startup time, low-memory crash, data transfer MB, events successfully loaded | Nigerian mobile access and quality |

### 6.1 Candidate playtest gates (hypotheses, not proven industry standards)

- A new player understands **one immediate task** without reading an economics tutorial and completes a meaningful action in approximately five minutes.
- A small venue owner, fan, artist, and promoter each identify at least **two enjoyable activities** in a 20-minute test without being told what to click.
- A concert with only **5–10 human participants** is still pleasant; 50-person and 500-person versions should degrade gracefully to sessions, not rely on phantom wallet receipts.
- The same player voluntarily completes the core event/artist loop a second time; measure actual repetition and satisfaction before increasing event scope.
- Entire pilot must be playable without a published Lagos Life API using **clearly labelled simulated payments**; no fake claim of genuine wallet connection.

### 6.2 Telemetry event contract (initial required names)

`session_started`, `world_loaded`, `first_activity_started`, `first_activity_completed`, `role_started`, `role_switched`, `opportunity_viewed`, `offer_created`, `offer_sent`, `offer_accepted`, `offer_declined`, `offer_expired`, `service_completed`, `npc_service_used`, `song_uploaded`, `song_rights_approved`, `song_scheduled`, `song_released`, `song_preview_played`, `song_saved`, `artist_followed`, `fan_notification_opened`, `event_created`, `event_announced`, `ticket_checkout_started`, `ticket_purchase_authorised`, `ticket_refunded`, `event_checked_in`, `event_completed`, `review_submitted`, `contract_signed`, `budget_approved`, `wallet_transfer_pending`, `wallet_transfer_confirmed`, `wallet_transfer_reversed`, `award_nomination_created`, `award_vote_accepted`, `award_result_published`, `share_created`, `share_referral_landed`, `business_insolvent`, `career_recovered`, `app_crashed`.

Required safe dimensions where applicable: `event_id`, `actor_player_id`, `target_player_id` (when needed), `role_id`, `business_id`, `district_id`, `session_id`, `contract_id`, `song_id`, `concert_id`, `referred_source`, `device_class`, `is_npc`, `occurred_at`, `wallet_state` (`mock/unlinked/authorised/failed`), `transaction_id`. Use opaque IDs and privacy minimisation. Contract signatures/wallet status are authoritative server events; clicking a pay button is **not** a completed purchase.

---

# 7. Decision ledger and open assumptions (anti-recency-bias register)

### 7.1 Preserved from entire discussion — do not silently discard

| ID | Preserved requirement | State |
|---|---|---|
| **D01** | Independent playable music world; later relationship to Desk/OrderSounds is optional and downstream | AGREED DIRECTION |
| **D02** | Build stand-alone before Lagos Life API appears; no planned private partnership as dependency | AGREED DIRECTION |
| **D03** | Intent is to spend **the player's existing Lagos Life game naira**, not introduce invented scene currency | AGREED DIRECTION / DEPENDENCY |
| **D04** | Virtual businesses can make *and lose* money; losses and insolvency matter | AGREED DIRECTION |
| **D05** | Shared person can be fan + artist + owner + investor; character is not locked to one role | AGREED DIRECTION |
| **D06** | Producer must create/play with music; real artists may submit actual recordings with rights | AGREED DIRECTION |
| **D07** | Artist can audition at small venues and naturally move to larger ones; funding may enable earlier ambition | AGREED DIRECTION |
| **D08** | Venues have own rankings, culture, repeat audience, prestige independent of raw capacity | AGREED DIRECTION |
| **D09** | Venue ownership is a deep game, with shows, hiring, promoter contracts, facilities and costs | AGREED DIRECTION |
| **D10** | Promoters work for songs, artists, venues, concerts and their own agencies | AGREED DIRECTION |
| **D11** | Labels sign multiple acts, finance approved artist work, approve delegated spend, earn defined virtual shares | AGREED DIRECTION |
| **D12** | Investors sponsor shows, fund artists/labels/venues; game lending deferred pending platform permissions | AGREED DIRECTION / DEPENDENCY |
| **D13** | Shows cost real game resources: stage, lights, speakers, production, labour, artist guarantees, rent | AGREED DIRECTION |
| **D14** | Every role gets immediate, medium and long gameplay; not just a finance dashboard | AGREED DIRECTION |
| **D15** | NPC staff, ambient characters, quests, baseline market opportunities prevent empty world | AGREED DIRECTION |
| **D16** | No NPC counterfeiting of real ticket sales, genuine chart listens, votes, player money | AGREED DIRECTION |
| **D17** | Fan is first-class cross-role identity; follows, messages, ticket history, discovery, fan clubs, notifications | AGREED DIRECTION |
| **D18** | Release Friday official shared music premiere, one central community moment; submission earlier in week | AGREED DIRECTION; deadlines proposed |
| **D19** | District Top 20, city Top 100 and aspirational Lagos Top 10; distinct role/business leaderboards | AGREED DIRECTION |
| **D20** | Official recurring concerts/meetups, Sunday chart reveal, real-time shared clock plus async career tasks | AGREED DIRECTION; exact schedule proposed |
| **D21** | Large paid shows cannot all overlap; featured slot/capacity and market demand need management | AGREED DIRECTION |
| **D22** | “Eddies”-style cross-industry awards with nominations, voting, verified results and live ceremony | AGREED DIRECTION; identity and frequency proposed |
| **D23** | Player-owned venue may eventually host awards or festivals | DESIGN PROPOSAL |
| **D24** | Shareable event posters, chart cards, award nominations and links can drive social virality | AGREED DIRECTION |
| **D25** | In-game music and charts do **not** purchase or manipulate external platform streams | AGREED DIRECTION |
| **D26** | Automated DJ music playback; no compulsory player DJ profession | AGREED DIRECTION |
| **D27** | Music industry news, verified player histories, relationship reputations, optional rivalries, dynamic scenarios | AGREED DIRECTION |
| **D28** | Mobile-first browser, usable on ordinary Nigerian phones; text/fast-travel alternatives | AGREED DIRECTION |
| **D29** | Fan-only and low-wealth players must have meaningful play without owning companies | AGREED DIRECTION |
| **D30** | At least one integrated playable vertical slice must be fun before full world build | AGREED DIRECTION |
| **D31** | Profit shares, nontransferable real music rights, contracts, refunds and dispute protections matter | AGREED DIRECTION |
| **D32** | External API may support account+spend, but payouts/escrow/loan/developer monetisation are unknown | DEPENDENCY |
| **D33** | The early Frequency heist/music-collection story is not the game's main concept | REJECTED AS CORE |
| **D34** | Live operations must coordinate chart windows, awards, moderation, stage schedules and event visibility | AGREED DIRECTION |

### 7.2 Unresolved; future detailed chapters MUST decide explicitly

| ID | Unresolved design question | Required decision / proof |
|---|---|---|
| **O01** | What *exact* wallet methods will Lagos Life expose? | Published auth, balance, spend, transfer, credit, refund, fee, escrow, rate-limit specs. Never assume. |
| **O02** | How will developer receive *real* revenue? | Public revenue-share/fees/policy, or independent disclosed real-world brand/artist business. No claim from game naira alone. |
| **O03** | What is the canonical eligibility and weight for music charts? | Formula, anti-bot threshold, recency, tie-breaker, observation/test plan. |
| **O04** | What time should live flagship events use? | WAT proposal to be tested with actual cohort time-of-day data. |
| **O05** | Can genuine real-world tracks be replayed, sampled, clipped or recorded in shared shows? | Rights matrix per asset, territory and use case. |
| **O06** | What activities should be real-time minigames versus guided choices? | Playtest skill, accessibility and mobile performance for each role. |
| **O07** | How are seats, simultaneous concert instances, check-in, replays and cancellations counted? | Event-session protocol, economy settlement rules and abuse scenarios. |
| **O08** | What are event, artist, label and venue starting prices/capacities? | Tune from platform-wallet wealth distributions, realistic activity and pilot supply-demand. |
| **O09** | Can actors directly own/transact virtual assets across platforms? | API capability and platform rules, especially external business registration. |
| **O10** | What guardrails stop monopoly, harassment, impersonation, rigged voting and paid bot farms? | Abuse policy, identity and moderation systems. |
| **O11** | How will businesses function during days of inactivity? | Automated staff, timeouts, client choice, bankruptcy protection and termination. |
| **O12** | Should optional voice recording and actual public live singing ship? | Rights, moderation, age/platform restrictions, latency, accessibility. |
| **O13** | Who decides public award jury results and nomination eligibility? | Published panel selection, disclosed conflict rules, appeal, integrity audit. |
| **O14** | How much geographic overlap with real Lagos Life map will be possible? | Embedded venues, navigation, avatar and server API scope once documented. |
| **O15** | Should NPC clients actually spend via a funded platform reward pool? | Only with explicit platform authorisation, funding source and issuance caps. |
| **O16** | How is cash-in/cash-out of in-game *virtual* investment shown without resembling financial solicitation? | In-game language, risk display, platform approval, protections. |

---

# 8. Chapter plan for the later Codex-ready specification

**Do not confuse this working matrix with a build-ready game specification.** After founder approval, create dedicated implementation chapters with state machines, UI maps, schemas, balance rules, copy, access controls, APIs, test fixtures and acceptance tests:

01 Vision, scope, glossary and historical decision register.  
02 Player identity, avatar, authentication, social graph and cross-career permissions.  
03 World navigation, districts, locations and mobile interaction.  
04 Every playable career (R01–R16), onboarding, jobs, skills and insolvency recovery.  
05 Music rights, recording, production, metadata, storage and real tracks.  
06 Release scheduling, Release Friday and chart computation/integrity.  
07 Fan systems, feeds, notifications, discovery and communities.  
08 Venue construction, equipment, quality, tiering and rankings.  
09 Event lifecycle, tickets, seating, audio, live instances and attendance.  
10 Promotion, talent hunts, auditions, jobs and opportunity matching.  
11 Labels, artist contracts, approval delegation, shares and artist autonomy.  
12 Investors, sponsorship, virtual loans (**deferred**), business account books.  
13 Wallet adapters, settlement, refunds, accounting, anti-abuse and bankruptcy.  
14 NPC behaviours, jobs, offline agency and world population.  
15 The Scene Honors: nomination, ballots, awards and ceremonies.  
16 Scene Daily, reputation, player history, shareable posters and growth loops.  
17 Shared calendar, live ops, admin tools, moderation and disputes.  
18 Analytics taxonomy, funnel definitions, testing, retention and economy health.  
19 Architecture, third-party integration contracts, deployment and performance.  
20 Vertical-slice scope, milestone gates, QA scenarios and Codex handoff.

### Acceptance test philosophy for the later specification

Every feature must specify: **actor, prerequisite, trigger, player input, visible response, authoritative server state change, money impact, counterparty notification, offline/NPC fallback, cancellation/error case, anti-cheat check, telemetry events and pass/fail acceptance test.** No undocumented “the system handles it” placeholders. Feature status should be `approved`, `proposed`, `external_dependency`, `deferred`, or `rejected`.

---

# 9. External source checks (not decisions invented from reporting)

- **Techpoint Africa, 10 October 2026:** Lagos Life plans APIs for connected games using existing player accounts and game spending; *does not prove* transfer/escrow/refund/developer monetisation support. https://techpoint.africa/news/lagos-life-hits-7m-players/
- **Lagos Life Terms, last seen October 2026:** game naira is not real money and cannot be cashed out outside the game; account and licence details may change. https://lagoslife.app/terms
- **Roblox Creator Hub, Retention:** player core loop, early player experience and progression as retention diagnostics. https://create.roblox.com/docs/production/analytics/retention
- **Roblox Creator Hub, Funnel events and Economy events:** use event-stage funnels and distinguish authorised completed transactions from attempted purchases. https://create.roblox.com/docs/production/analytics/funnel-events and https://create.roblox.com/docs/production/analytics/event-types

**Source hierarchy for this document:** user's conversation decisions > clearly tagged design proposals > verified external platform constraints. Published platform documentation is required to promote a wallet-dependent proposal into build scope.

---

## Review checklist for founder sign-off

- [ ] Is the full player roster correct, and are any careers missing or unnecessary?
- [ ] Does each critical career have immediate action, medium session and long-term progression?
- [ ] Is the balance of playable music, management and social fun right?
- [ ] Are fan motivations and event attendance compelling even without paid rewards?
- [ ] Is the Friday/Saturday/Sunday calendar how the game should feel in real time?
- [ ] Are small venue stories and economically risky concerts sufficiently rich?
- [ ] Does the interaction inventory cover the intended cross-career relationships?
- [ ] Are any decisions marked “agreed” that should actually be options?
- [ ] Which 3–5 flows should the first playable prototype implement?

**End of H-Path Player Interaction Matrix v0.1.**
