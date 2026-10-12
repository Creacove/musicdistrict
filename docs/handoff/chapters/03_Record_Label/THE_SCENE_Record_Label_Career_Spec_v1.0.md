# THE SCENE
## Chapter 3 — Record Label Owner: Gameplay, Economy and Implementation Specification

**Document ID:** TS-GDD-LBL-001  
**Version:** 1.0 design baseline  
**Date:** 12 October 2026  
**Status:** Complete proposed V1 record-label rules; founder has approved the career direction. Numeric balance parameters and cross-platform API capability are flagged separately from settled behavioural rules.  
**Audience:** Founder, game designer, economy designer, UI/UX designer, audio engineer, backend engineer, QA, and Codex/implementation agents.  
**Dependent chapters:** H-Path v0.1; Venue Operator Foundation v0.3 (TS-GDD-VEN-001); Artist Career Foundation v0.4; future Promoter, Investor, Universal Economy, Events, Moderation and World chapters.

> **Core fantasy.** Discover an unknown musician, believe in their potential, finance their work, experience it through live music and public culture, bear the business risk, and perhaps watch them perform at the Destiny Awards. A label is a player-operated financing and artist-development business, **not** a character-control system, a streaming-royalty mint, or a place to buy chart positions.

> **Platform truth.** THE SCENE is an independent browser-hosted 3D game with its own sandbox simulation economy. Its future Lagos Life/Vatar adapter may recognise connected identities and invoke only developer operations actually authorised by the platform. **Standalone balances are not Lagos Life balances.** General-purpose company wallets, transfers, escrow, avatar model import and game-naira settlement must never be fabricated by a UI or inferred from third-party platform features.

### Reading legend

- **CONFIRMED:** Previously directed by the founder or explicitly approved in the last record-label review.
- **BASELINE:** A concrete gameplay default settled here to eliminate coding ambiguity. It remains subject to playtest-led balancing but must be implemented consistently unless changed through the central decision register.
- **DEPENDENCY:** Requires agreement with another specification, rights holder, platform provider or published service contract.
- **EXCLUDED:** Deliberately outside V1; do not invent it during implementation.

---

# 1. Purpose, boundaries and invariants

The record-label career must be engaging by itself for 5-minute, 20-minute and hour-long sessions. Every label is operated by a **human player** who can walk through a physical office, listen to music, attend events, negotiate, book venues, work with promoters and maintain a continuing company identity. Every other profession may still attend shows and follow artists as a fan.

**Non-negotiable invariants:**

1. **One owner, one company in V1.** The owner can be an artist or fan personally, but may operate only one company. No joint ownership or delegated spend authority in V1.
2. **One active funded label per artist.** An artist may remain independent, refuse any offer, and cannot be forcibly signed. A label may have **at most three simultaneously active roster contracts**.
3. **Artist autonomy.** A signed artist independently books eligible producers, studio services, promotions and shows from their finite allocated funding. The owner does not approve each permitted purchase.
4. **Finite prepaid funding.** On contract acceptance, the label must reserve the full promised artist budget. No partial phantom agreements, credit lines or personally negative balances.
5. **Restricted spending.** Artist allocations can directly pay only authorised service/project transactions. They cannot be gifted, withdrawn, transferred as personal money or used to buy their own goods from a linked alt-account.
6. **Risk and conservation.** Labels can lose substantial virtual game money. Only genuine, authorised player payments and budgeted treasury rewards enter the economy; listens, NPC crowds, simulated fans, chart points and award trophies never mint spendable money.
7. **Clear recoupment.** Only eligible, explicit funded project receipts repay documented label-funded project costs; only positive residual is split; no duplicate deductions, unlimited future earnings claims or rights transfer by virtual contract.
8. **Physical-first, shortcut-friendly.** All signature career actions have world interactions, with corresponding phone/desk shortcuts after orientation. No mandatory repeated walking between desks to perform simple routine actions.
9. **Player history persists.** Company failure, sale or artist departure must not erase earned legitimate records or confiscate artist catalogue/fanbase.
10. **Server authority.** Offers, deadlines, signing, funds, event reservations, payouts and anti-abuse decisions are validated by trusted server state. Client displays are projections, not transaction authorities.

**The boundary of this chapter:** this document completely defines the **label's ownership, roster, contract, project finance, interface responsibilities, account controls, interactions, events and failure responses**. Separate shared chapters own the exact audio playback engine, chart score formula, all concert presentation animations, platform payment adapter implementations and universal social moderation. This chapter gives their contracts and expected behaviours so a programmer does not invent label-specific substitutes.

# 2. Career proposition and modes of play

The label's loop is **DISCOVER → EVALUATE → OFFER → FUND → DEVELOP → EXPERIENCE → SETTLE → REINVEST**. This is non-linear: owners can scout without signing, attend concerts without spending, organise standalone showcases, and improve branding even if their roster is full. They can earn financially, culturally, reputationally or fail in one dimension while succeeding in another.

| Time available | Playable activity | Immediate result | Longer consequence |
| --- | --- | --- | --- |
| 2–5 min | Listen to a Release Friday newcomer at an office station; shortlist | A tagged A&R card with song and source | Future scout/contact opportunity |
| 5 min | Inspect roster wall, accept/decline extra-funding request | Allocation changes or explicit refusal | Artist's next activity becomes possible or stays self-funded |
| 10–15 min | Attend open mic, hear two acts, talk and send offer | Real human social interaction, pending offer | Signing competition / reputation |
| 20–30 min | Book venue and publish audition/showcase | Confirmed legal event, committed costs | Applications, genuine ticket demand |
| 40–60 min | Attend label showcase, meet fans, watch set and settle | Shared experience and recorded results | Revenue, loss, brand history, referrals |

**Mastery comes from judgement and relationships**, not reaction-speed gating. Skill means spotting potential, choosing appropriate funding, balancing risk, listening intelligently, cultivating trust and designing attractive live experiences. No timed quiz determines whether a label may sign an artist.

# 3. Requirements to establish a label

**CONFIRMED:** label ownership should require meaningful capital; it is not a starter class for everybody. **BASELINE price anchors**, consistent with the Venue and Artist test economy (all numbers are fictional game naira, not real NGN):

| Entry item | V1 baseline | Accounting treatment |
| --- | ---: | --- |
| Minimum personal available balance to complete setup | ₦150,000 | Eligibility check, not a fee |
| Registration / brand creation | ₦10,000 | One-time city/NPC sink, non-refundable after success |
| First seven-day small-office lease | ₦15,000 | Prepaid operating expense, no auto-renew by default |
| Company cash after setup | ₦125,000 | Owner-funded company ledger, not income |
| Minimum first funded contract | ₦100,000 | Remains company cash until accepted, then fully reserved |
| Suggested uncommitted reserve after first contract | ₦25,000 | Warning threshold, not a frozen second deposit |

**Setup transaction:** owner with at least ₦150,000 selects brand name and small office, explicitly confirms transfer of ₦140,000 from personal to new company and city registration fee of ₦10,000. The company pays ₦15,000 for first lease, leaving ₦125,000 business balance. Artist funds are **not** automatically deducted at setup. When a ₦100,000 contract is accepted, ₦100,000 becomes encumbered and only ₦25,000 remains available. Owner may transfer more money into company at any time subject to the wallet provider.

**Validation:** one company slot vacant; verified authenticated adult-eligible account if applicable; name unique case-insensitively after normalisation, 3–30 visible characters; disallowed/impersonating/offensive names rejected; successful city office instance allocation; sufficient personal funds; two-factor or reauthentication for later high-value actions as security policy decides; no active ownership transfer lock or financial sanction. No successful payment without a company record and no company without reconcilable funding. Retry with same `creation_intent_id` returns original outcome, never makes duplicates.

**What a poor player can do:** listen to new music, discover prospects, attend free open mics, build a private scouting shortlist (no contract authority), perform introductory jobs from a capped authorised treasury, and accumulate capital until eligible. Scouting access is not hidden behind a company fee; actual signing is.

# 4. The physical label office

The district has a **public Business Registry lobby** and virtual office building. Each label has a **unique company identity** and a dedicated office instance accessed via a labeled door, not an exclusive finite city plot. Several labels can rent the same office template; they have different interiors, brands and visitor permissions. This preserves density and avoids unnecessary construction gameplay.

| World station | Physical interaction | Server operation | Phone/remote equivalent |
| --- | --- | --- | --- |
| Registry desk | Name label, choose office, sign founding book | `create_label()` | Guided company setup after first in-world visit |
| Listening room | Approach speakers, browse audition rack, play music | `scout_listen()` / `shortlist_artist()` | Artist discovery and shortlist |
| Roster wall | Inspect current artist portraits/achievements | `view_roster()` | Roster app |
| Contract table | Invite artist; review animated contract sheet | `create_offer()` / `counter_offer()` / `accept_offer()` | Secure offer inbox |
| Funding board | Move project cards, inspect committed funds | `create_project()` / `request_top_up()` / `commit_top_up()` | Company finance screen |
| Events board | Place date and showcase poster on calendar | `draft_label_event()` | Events app |
| Achievements wall | Display historical signed artists and verifiable wins | Derived from event journal | Label public profile |
| Reception counter | Visitors deliver demos or request meetings | `submit_label_demo()` / messages | Demo inbox |
| Decoration console | Arrange eligible office furniture, posters, brand assets | `save_office_layout()` | Basic layout editor (world action preferred) |

**Spatial rule:** object interaction opens a focused overlay, not a giant unexplained form. After the first guided interaction, keyboard/screen-reader accessible phone shortcuts perform the same validated server action. Office art/avatars never carry sensitive contract data unless the viewing user has permission. Owners can hide private funding numbers from visitors. Visitors cannot trigger spending by clicking a station.

**Lease expiry:** no automatic debt. If office time expires, front-door visits/office personalisation pause and saved layout/inventory is retained. Owner retains company, roster contracts, offsite event access, remote contract management and permitted ledger functions. Re-rent the office to restore the physical workplace; precommitted artist projects do not fail because the office was closed.

# 5. Entering and leaving the career; identity separation

A label is a separate entity from the owner's avatar. The player's `player_id` may appear as artist, listener, concert spectator and label controller. The company's `label_id` is stable through renames and eligible sales. Its funds and reviews are never mistaken for the player's personal wallet. V1 permits one `owner_player_id` and no spending delegate or co-owner.

**Eligibility to register as label:** a personally signed artist is not barred from running a label business. However, **self-signing is disallowed in V1**: a label controlled by a player cannot issue a paid funded label contract to that same player's artist persona or to a linked suspected alternate identity. Independent personal music activity remains permitted.

**Closure:** `ACTIVE → PAUSED_NO_OFFICE → WINDING_DOWN → CLOSED_ARCHIVED`. A label cannot enter `CLOSED_ARCHIVED` with unresolved covered contracts, unfulfilled guaranteed events, refunds, escrow/reserves, rights complaints affecting transactions, or unsatisfied authorised company liabilities. `WINDING_DOWN` blocks new paid commitments but allows settlement, cancellations, messages and refunds. Current contracts may run to expiry with their existing reserves; owners can request mutually agreed early termination.

# 6. Scouting as actual gameplay

Scouting occurs in four places: (1) physical open mics/venue talent hunts, (2) Friday Release Hall, (3) label listening room, and (4) human demo submissions. Every scout candidate card shows public evidence and the reason it appeared: approved songs, last three releases, verified unique listeners, engagement trends, eligible saves, geographic fan concentration, real show attendance, no-show reliability if mature, and current signing availability. It does **not** provide hidden copyrighted content or exact private fan data.

**In-world scouting loop:** travel → hear 15–30 seconds or full released recording → inspect artist stage/performance/profile → add optional notes/tags → invite to office, message or save for later → artist responds asynchronously. An owner may scout with full roster; cannot sign a fourth active artist.

**Shortlist defaults:** maximum 50 saved active candidates per label; separate archived/history unlimited subject to retention. Maximum 10 demo submissions to a given label from one artist within a 30-day rolling window? **No**: establish a stricter V1 rate: **one active demo application per artist per label per 7 rolling days**, with at most **five outbound unsolicited label offers per day**, and at most **five simultaneous pending signing offers per label**. A rejected demo can reapply after the 7-day limit; an updated song attachment does not evade it. The owner may invite an artist directly without demo application. These are tunable anti-spam parameters, not implicit claims of platform-wide thresholds.

**Artist privacy:** artist must opt in to accepting label offers and demo submissions; unsolicited approaches respect blocks. No discovery system guarantees a signing. No player can submit a stranger's unpublished audio as their own demo.

# 7. Artist eligibility, roster slots and deal marketplace

A contract offer may be sent only to an authenticated active artist persona with at least one approved recording in their catalogue (live or approved preview). A prospective artist can discuss a deal before approval, but acceptance must fail until there is an approved playable record. **One active contract per artist globally; three active funded contracts per label.** Contracts in `EXPIRING` remain active until effective end; offers pending do not consume roster slots, but acceptance checks capacity atomically.

**V1 signing template:**

| Field | Allowed values / rule |
| --- | --- |
| Term | Exactly **4, 8 or 12 weeks** from server-recorded effective acceptance time; WAT for human display, elapsed UTC for duration |
| Development budget | At least **₦100,000** and not above company's currently uncommitted available balance at acceptance |
| Artist share of covered **positive profit** | **40%–90% in 5 percentage point steps**; label share `100 - artist_share` |
| Funding categories | V1 fixed approved categories: producer, studio, art services, promoter, venue booking, production/equipment rental, guaranteed guest performer fees, approved event services |
| Covered receipts | Exactly income generated from project IDs funded using this contract, if identified as eligible before transaction |
| Recoup rule | Reimburse verified label-funded project costs first, **once per project**; split positive remainder; no personal artist debt |
| Exclusivity | One funded virtual label at a time; no ownership of recordings or real-world royalties |
| Dispute/expiry | Published platform standard terms; not secretly negotiable by an owner |
| Amendments | Mutual signed top-up/extension subject to V1 limits and new funding reservation; cannot rewrite prior project economics retroactively |

**Negotiation:** three sliders only: budget, term, profit split. Both parties can propose new values; every counterproposal creates version `n+1` and invalidates acceptance of earlier versions. Offer expires 48 hours after latest sent/counter version or at sender's earlier stated expiry (minimum 1 hour). Default offer list has max five outstanding. Reserved money is committed **at successful atomic acceptance**, not when the unaccepted offer is sent. Offer UI states clearly "Funding will be reserved when accepted; availability rechecked." If the owner spends the money before acceptance, the offer cannot activate; artist receives an explicit `FUNDING_UNAVAILABLE` failure with no partial agreement. Funds are never silently borrowed.

**Concurrent offers:** optimistic acceptance atomically obtains global artist-contract uniqueness lock, label roster-capacity lock and funds-reservation lock. Exactly one offer can win. All other outstanding offers are marked `SUPERSEDED` after successful acceptance; no duplicated budget reserves. Signing fees: **no additional city signing fee** in V1; budget commitment is the economic cost. No label can charge an artist to accept its offer through the label agreement workflow.

# 8. The contract scene and experience

Owner visits Contract Table → selects shortlisted artist → places proposed funded deal on desk → sees example cost/recoup outcome → clicks `Send Offer` → artist receives physical/phone invitation → optionally meets owner as avatar → compares versioned offers → chooses `Accept / Counter / Decline`. On acceptance, both see short signing animation, a new framed artist portrait appears on roster wall, artist's phone gains a restricted project-budget view, and server emits signed contract & reserve events. If unavailable/offline, the same steps run asynchronously in inbox; an owner cannot demand a simultaneous meeting to validate a deal.

**Artist sees before signing:** funding accessible (as restricted spend), end date/time, exact percentage share, real-world rights exclusion, eligible expenses, only-covered-project receipts rule, what happens if owner offline, how unused funds return, explicit examples for profitable and loss-making events. UI must never describe the committed budget as free personal money or wages.

**Label sees before signing:** company cash, already committed amounts, cash after acceptance, one-week office exposure, active roster slots, expected opportunity costs, clear risk that artist might never create a profitable project, artist's right to refuse subsequent funding requests. No "guaranteed return" wording.

# 9. Artist project creation and restricted budgets

**Project unit is the financial nucleus.** A funded activity is not a loosely categorised receipt: every paid order and attributable event must have a stable `project_id` belonging to one agreement. V1 project types: `ARTIST_CAMPAIGN`, `RECORDING_ONLY`, `PROMOTION_ONLY`, `ARTIST_HEADLINE_EVENT`. An `ARTIST_CAMPAIGN` can combine one approved recording/release, associated promotion and **at most one named ticketed headline event** inside its fixed initial project scope; all its funded costs and that named event's receipts share a single recoupment waterfall. Recording-only and promotion-only projects may have **zero direct virtual income** and therefore produce unrecovered label costs. Separate projects never cross-reimburse each other. The named event must be attached before the first expense; retroactive attachments or moving expenses across projects are forbidden. The artist can create an unlimited number of **draft** projects, but can have at most **three open funded projects per active contract**; closed projects remain archived. The total committed amount across funded projects cannot exceed the deal's remaining allocation.

**No separate owner approval inside allocation:** artist opens eligible project → selects restricted funding source → sees unspent contract allocation → enters project spending limit (up to remaining available) → system reserves that limit into the project ledger from the already restricted contract allocation → purchases approved services within the project cap. Creating or varying a project budget within overall agreement limits requires **no label-owner approval**. Unused project reserve can be released back to remaining contract allocation by artist unless needed for accepted vendor orders/refunds.

**Adopted V1 simplicity:** A project uses **one payer**: either label contract budget or artist's unrestricted wallet, **not both**. Shared personal/label funding of a single project, cross-label cost recovery, revenue pooling and third-party financial investors in the **same** project are deferred. This avoids ambiguous cost attribution and split payment. A genuine third-party sponsor with non-revenue promotional benefits may provide a distinct externally settled benefit where provider supports it, but cannot secretly become a label investor. An artist can still operate a completely separate self-funded project while signed; its income is not covered by label share.

**Approved vendor purchase:** server confirms eligible category, authoritative price, bona fide seller account/service identity, no self-dealing or linked-account collusion, contract active, not expired booking, sufficient unspent project allocation, allowed contract authority, vendor deliverable and time. It **reserves** cost; payment follows deliverable/booking agreement. Project funds never pass through artist unrestricted balance, cannot be sent as a gift, and cannot buy in-game cosmetic clothes, houses or non-project assets. Purchased non-physical creative deliverables are governed by their own service permissions; portable physical equipment is not purchased by restricted contract funds in V1, only time-limited event equipment rental, to avoid unclear asset ownership upon expiry.

**Campaign example:** The label funds ₦20,000 in recording, ₦10,000 in promotion and ₦20,000 in the ONE named showcase under an `ARTIST_CAMPAIGN` (C=₦50,000). It earns ₦70,000 in eligible net show receipts (N=₦70,000). The label recoups all ₦50,000, then ₦20,000 residual is split. If instead the artist created three unrelated projects, the recording/promotion costs would **not** be repaid automatically by the independent event. The setup preview must show this consequence.

**Project status:** `DRAFT → ALLOCATED → ACTIVE → COMPLETED_PENDING_SETTLEMENT → SETTLED`, with alternatives `CANCEL_REQUESTED`, `CANCELLED`, `FROZEN_DISPUTE`. Pending vendor commitments are locked, not released when a project closes. Every edit stores actor and version.

# 10. Roster management without employee hierarchies

The label-owner's roster view displays three active cards maximum: artist public trajectory, agreement end date, committed allocation, amount spent, amount pending, amount still available, supported project outcomes and upcoming gigs. The owner can **communicate, observe, propose extra funding, arrange label-owned events and request voluntary collaboration**. They cannot move the artist, upload their songs, edit artist identity, force releases, delete fans, cancel self-managed eligible orders or spend the artist's reserved budget on another act.

**No employee manager avatar required:** founder is the sole business spending authority; NPC reception/service clerks provide ambience and routine information, not financial decisions. The artist can handle their own bookings; promoter is a player or agency hired for campaign service. Any player can be fan simultaneously. Official label announcements respect notification preferences.

**Top-ups:** artist sends `Request extra funding` or label initiates `Offer top-up`. Owner reviews available uncommitted company cash. Both confirm amount (minimum ₦5,000, maximum free company balance), specific existing contract, remaining term and unchanged category/profit terms. On acceptance, fresh funds are reserved; label owner cannot reclaim earlier committed allocation by rejecting top-up. No automatic top-ups, no debt, no auto-renewal. Contract term extension, if desired, requires both to sign a new agreement **after** current one expires in V1; no mid-term extension to simplify overlapping financial scope.

# 11. Label-organised auditions and discovery nights

**Signature V1 public activity:** Label Discovery Night. Owner chooses a prebuilt venue (city-listed if unleased, otherwise player venue operator), confirms a 24-hour event rental under Venue specification, selects `DISCOVERY_NIGHT` template, sets performance slots (default 3, max 6), application deadline, format (free audience or ticketed), one responsible organiser (`label_id`), performer audition requirements and budget. Tickets only after venue reservation, sound/technician prerequisites and artist lineup/terms satisfy the shared Event service. Label may hire a promoter.

**Candidate flow:** artist applies with eligible released recording or permission-limited preview → owner listens at listening room or in person → accepts shortlist → artist receives scheduled slot → performs using Stage Mode and authorised song playback → real audience attends and may follow/save → owner invites selected artists to contract table. **Acceptance to audition is not a promise to sign.** Application and show attendance can still benefit artist regardless of winner. Public audience tickets, if sold, are one-off event receipts, not song streams. A label with full roster can still host discovery nights; it just can't activate another deal until slot available.

**Event no-show:** organisers may switch to pre-cleared pre-recorded performance explicitly authorised by artist, fill with a consented standby artist if refund policy allows, or reschedule/cancel with posted refund terms. Never impersonate an online singer. Event posters display actual terms. NPC audience cannot be counted as paying human attendees. Default standard shared Event statuses apply.

# 12. Label-owned showcases, concerts and booking responsibility

A label may book venues as an **event organiser**; it does not require a separate venue business. The room-hire price of a 50-seat unleased lounge is **₦6,000 per 24h** (venue v0.3 baseline), exclusive booking. A label cannot rent a city room already within a player's active operating lease; it must book from the current player operator. Headliner and guest artist consent required. Performer terms may be free voluntary showcase appearance or guaranteed fee; clear consent for music-performance use is required. Event can include signed and unsigned guests, but if a label wants to pay an unsigned artist, that is a separate performer contract, **not an automatic label signing**.

**Two mutually exclusive economic modes:**

- **L-EVENT (label organiser):** company pays venue, production, guests, promoter, etc. from its **uncommitted business balance**. It receives genuine net ticket revenue and owns show profit/loss. **No artist project recoup/split is applied to this event** unless a separate artist fee explicitly contracted; roster relationship does not silently confiscate show revenue.
- **A-EVENT (artist organiser; label funded):** the artist books venue and services from a **specific allocated covered project**. Receipts follow the contract's per-project reimbursement and profit split. If recorded music and its promotion are intended to be recouped from this concert, the artist must establish an `ARTIST_CAMPAIGN` containing **that one named event** before any eligible project expenses; a `RECORDING_ONLY` project has no implicit claim on it. The label does not also collect an organiser profit. The artist is the event organiser and has the organiser obligations.

The event planner displays a locked **organiser + payer + settlement mode** before publication. It cannot silently switch after ticket sales begin. Owner-hosted venue operators use VEN-001 single-cost rule (no double rent). Artists may headline their own shows or appear as paid guests. Promoters may market or organise separate shows with their own funds; contracted promoter deliverables must be verifiable and cannot promise fake streams.

# 13. The economy: company cash, reserved money, costs and profit

Every company has `book_balance`, `reserved_total`, `available_balance = book_balance - reserved_total`, and separately tracked executed expenses, liabilities and receivables. Company income from the owner's personal top-up is **capital contribution, not profit**. Office rent is an expense at time paid or amortised for reporting; no extra hidden daily charge. **The same committed unit of currency can exist in only one spendable account.** An artist restricted project balance is a view on segregated label funds, not a second duplicate wallet.

**All amounts in this section are illustrative standalone game naira** and not an authorised Lagos Life payment rail. One consistent financial model:

| Ledger step | Company book cash | Reserved cash | Available for new obligations |
| --- | ---: | ---: | ---: |
| Immediately after label setup | ₦125,000 | ₦0 | ₦125,000 |
| Artist accepts ₦100,000 contract | ₦125,000 | ₦100,000 | ₦25,000 |
| Artist pays eligible ₦40,000 studio bill | ₦85,000 | ₦60,000 | ₦25,000 |
| A covered event yields ₦70,000 net receipts, with ₦40,000 label costs and 60/40 profit split | ₦85,000 + ₦40,000 recoup + ₦12,000 label profit = **₦137,000** | ₦60,000 | ₦77,000 |

**Canonical settlement rule (do not deposit gross receipts twice):** receive ₦70,000 in project clearing account; disburse ₦40,000 back to label company as recoup, ₦18,000 to artist, ₦12,000 to label company as profit. Therefore company book cash = ₦85,000 + ₦52,000 = **₦137,000**, reserved = ₦60,000, company available = **₦77,000**. Project clearing account returns to zero. No second label receipt of ₦70,000. This breakdown is authoritative.

**Currency representation:** Standalone virtual units are stored as integer minor units (100 subunits per one displayed game naira) for deterministic percentage calculations; the server rounds payout once at final distribution, not per animation. A future external wallet adapter must use the provider's documented denomination and precision rather than assuming it supports subunits.

**Accounting streams:** registration fee and city rent = game sinks (only where city/NPC treasury is defined); producer fees and venue-operator fees = genuine payment to another human or authorised NPC treasury; ticket payment = real buyer to event clearing; record listens = cultural signal, **₦0 payable**. NPC visual crowds have zero tickets and zero virtual monetary transfers. Cash contributions/withdrawals are owner equity movements, not commercial revenue.

# 14. Covered project profit waterfall: formal definitions

**Definitions, all nonnegative:**

- `G` = gross, valid, non-refunded external receipts attributable to the exact covered project.
- `F` = actual authorized transaction charges and charges withheld from receipts, not yet included in `C`.
- `W` = unpaid third-party variable obligations for this project, paid from receipts at settlement, not already charged in `C`.
- `N = max(0, G - F - W)` = net eligible receipts available for label project return; if `G < F+W`, refunds/liabilities were mis-reserved and the event must enter dispute/reconciliation, not silently mint deficit money.
- `C` = documented *previously label-funded*, non-refunded project direct costs paid from project ledger; exclude reimbursed expenses, optional label office overhead, label registration and payments already included in `W`.
- `R = min(N, C)` = label's reimbursed direct cost.
- `P = max(0, N - C)` = positive distributable project profit.
- Artist payout `A = P × artist_share`; label profit share `L = P - A` using integer minor units and a deterministic rounding rule assigning any one-unit remainder to the label.
- Label receives `R + L`; artist receives `A`; third-party fee and unpaid charges have already been accounted. If `N < C`, label bears `C - N` loss on the project; artist incurs no personal debt.

**Example 1, profitable:** label funded `C=₦200,000`; net receipts `N=₦300,000`; `R=₦200,000`; `P=₦100,000`; artist 60%=₦60,000; label 40%=₦40,000. Label receives ₦240,000 total, with ₦40,000 project profit, and the artist ₦60,000. Unspent committed allocation is not automatically counted as a project expense.

**Example 2, loss:** funded `C=₦200,000`; `N=₦150,000`; label receives ₦150,000 reimbursement and records ₦50,000 unrecovered project loss; artist receives ₦0 from project profits. Pre-agreed performer guarantee, if any, is a project direct cost and must have been explicitly funded in advance.

**Example 3, label's own showcase:** city venue ₦6,000 + services ₦1,000 + production ₦2,000 + promoter ₦3,000 + contracted talent guarantees ₦4,000 = **₦16,000 company expense**. Thirty unique humans purchase ₦1,000 tickets with **illustrative standalone** ticket fee 3%: net tickets ₦29,100, company showcase profit **₦13,100**. No recoup step and **no second 60/40 artist split** of the organiser receipts. Change in label company cash = +₦13,100 net, before office overhead.

**Example 4, artist-organised label-funded show:** same cost C=₦16,000, 30 paid tickets yield N=₦29,100, project profit P=₦13,100. At 60/40, artist gets ₦7,860 and label gets ₦5,240 profit plus ₦16,000 cost reimbursement. Label net cash profit = ₦5,240. The same money cannot be counted as both label-event profit and artist-project profit.

**Counterexamples explicitly disallowed:** label takes a percentage of voluntary fan gifts; royalties from Spotify; future releases after the contract; projects not listed/created under the agreement; owner self-buying tickets to inflate profit; deducting `C` twice; deducting generic office rent from every artist project; charging artist personally for label deficit; cross-collateralising Kemi's losses against Dami's covered profit; double payouts from retries.

# 15. Revenue attribution, time bounds and late settlements

A project is covered if its `agreement_id`, `project_id`, optional named revenue event, and payer mode were fixed **before any first financial commitment**, and the project starts no earlier than contract acceptance. A label does **not** earn a percentage of an artist's entire life, historic catalogue, unrelated self-funded shows, private gifts or post-term jobs. A preexisting song may be used in a newly financed event under a covered event project: only that event's receipts can be shared, not the song's earlier or future unrelated income.

**Timing baseline:** new project funding/booking stops at exact contract expiry. A label-funded public event must be **scheduled to take place inside the active term** to be confirmed; no label-backed future date beyond expiry. Events successfully held within term may complete settlement within **14 days** afterward; if an authorised ticket refund/dispute is still pending, hold **only the disputed portion** until resolved, with automatic non-disputed payout within that 14-day period. Late entitlement remains to the specific closed project's already-earned receipts, never opens a claim on new projects. At expiry, unused uncommitted project and agreement funds are released back to the company, except valid existing service guarantees/refund reserves, which remain until cleared.

**Refund corrections after settlement:** shared event service must maintain a bounded permitted post-event chargeback reserve (default 7 days if provider supports reversible payments; otherwise the connected mode uses provider-defined rules). If a material correction occurs, adjust through recorded offsets from remaining project reserves and insurer/admin treasury only if expressly budgeted; no involuntary artist personal negative balance. Incorrect historical ranking/award attribution is corrected through audit events, not deletion of transaction history.

# 16. Label strategies, reputation and public recognition

Three viable styles: **development label** (early emerging artists); **commercial event label** (valuable booked performers); **cultural/tastemaker label** (unusual genres, genuinely devoted fan communities). One strategy is not automatically best: net project profit, verified discovery, fan community conversion, venue satisfaction and artist reliability can diverge. Do not assign fixed fictional follower growth to office upgrades or fund size.

**V1 label scores:** (a) `financial_performance` from settled completed projects and company-funded shows excluding owner capital additions; (b) `artist_development` from net-new meaningful human listeners/followers, verified live appearances, charts achieved **during funded projects**; (c) `operational_reliability` from funded promises honoured, completed events, settlement timeliness and substantiated breaches; (d) `cultural_influence` from actual roster music engagement and show history; (e) `reputation` = public composite presented in plain terms, with underlying indicators visible. Exact weighting belongs to shared leaderboard subsystem; **do not hard-code a hidden multiplier from money spent**.

**Leaderboards:** Top Record Labels, Best Talent Discovery, Most Profitable (period net, not gross), Emerging Label, Best Label Showcases, Cultural Influence. Public display should include eligibility period, sample size, and fraud-adjusted outcomes. A brand-new label with one good event is eligible for an emerging category; it does not automatically top a long-term prestige table. Opt-in artist satisfaction reviews only for verified contracts, published with anti-harassment protections and moderation; no fabricated numeric "happiness meter".

**Destiny Awards:** official awards approximately every 12 weeks/four times annually; highest official cultural prestige, not necessarily biggest event by ticket count. Label of Season and Breakthrough Label are candidate categories. Qualification from eligible verifiable season metrics plus a transparent final nomination/judging method set by Awards chapter; label funding, sponsorship and self-votes cannot buy award eligibility. Permanent nomination/win trophies appear in label office and archive under stable company ID; achievements state which owner operated the label when earned.

# 17. Progression beyond the first week

| Stage | Typical circumstance | Gameplay added (not artificial level gate) | Risk |
| --- | --- | --- | --- |
| Observer | Not enough money for company | Listen, scout, attend, meet artists, take starter jobs | Time, opportunity loss |
| New label | Registered and funded first artist | First office, contract desk, project tracker | Startup overhead, poor first investment |
| Developing roster | 2–3 signed artists | Competing funding requests, showcases and scheduling | Portfolio concentration, contracts competing for cash |
| Known label | Artists earning real in-game engagement | Reputation, competing offers, bigger bookings | Overexpansion, fan demand not guaranteed |
| Prestigious label | Seasonal notable achievements | Destiny nominations, larger festivals, long-term artist legacy | Reputation damage, high budgets and costs |

No mandatory "level 10" to scout or host a small show. V1 roster always capped at three, even for billionaires. A rich owner may fund bigger deals but cannot buy a fourth slot. Later employee systems and label divisions may unlock additional roster capacity only in a future version.

**Seven-day repeatability:** Monday review budgets/listen; Tuesday talent hunt; Wednesday negotiate; Thursday organise small audition; Friday scout new releases; Saturday attend showcase; Sunday review actual outcomes/renew or free slots. These are **suggestions, not forced checklists**. An owner online for 5 minutes still has useful listening, invitation and review activities; an owner with no signed artists still has showcases and scouts.

# 18. Working with every other career: interaction matrix

| Counterparty | Initiator | Label activity | Payment/authority | Counterparty's useful result |
| --- | --- | --- | --- | --- |
| Artist | Either | Contract, proposal, roster showcase | Funded project / performer guarantee | Capital, bookings, fan discovery |
| Producer | Artist or label | Recording commission for signed act | Restricted artist project for covered recording; company for label-owned service | Producer work, credit, payment |
| Studio owner/NPC studio | Artist | Studio booking | Artist restricted project or personal funds | Service revenue, client |
| Promoter | Label or artist | Campaign / ticketed show marketing | Label company or artist's covered project, never both | Paying client and verifiable portfolio |
| Venue operator | Label | Audition, discovery night, showcase, concert | 24h exclusive city booking or operating-company room hire | Rental revenue, history, foot traffic |
| Investor | Investor or label | V1 external funding offers | **Deferred** for label equity/loan; nonfinancial sponsor credit may occur via shared event rules | Later portfolio opportunities; no V1 ownership trick |
| Fan / spectator | Either | New tracks, free showcases, ticketed shows | Genuine optional tickets/transfers, no forced contributions | Enjoyment, songs, friends, artist discovery |
| Talent scout | Label / scout | Referral recommendation | Optional straightforward fixed service fee for verifiable delivered prospect, not contingent on signing identity sale | Referral work, discovery credit |
| Music journalist | Either | Interview / factual recap of verified results | No automatic promotion purchase; media can cover public facts | Stories and reputation |
| Other labels | Either | Rival offer, audience competition, shared public shows | Separate budgets, no illicit account coordination | Competitive market, new attention |
| Event organiser | Either | Roster performance invitation | Separate appearance contract and event responsibilities | Credible talent lineup |
| Equipment supplier | Label / organiser | Hire production package | City NPC rental or permitted player business | Paid equipment service |
| NPCs | Owner | Registration, office, reception, starter events | Authorised fees/treasury only | World continuity, not fake popularity |

**Key roles never collapse silently:** record label is *funder*, artist controls artist identity, promoter is *discoverability service*, venue supplies space, organiser holds ticket and refund liability, producer creates music, fan voluntarily consumes music. A label can act as *organiser* in its own distinct event but is never automatically organiser of every show featuring a signed act.

# 19. Contracts, permissions and trust

**V1 permission matrix:**

| Operation | Label owner | Signed artist | Other player | Operator/admin service |
| --- | --- | --- | --- | --- |
| View public label profile | Yes | Yes | Yes | Moderation only |
| View company private finances | Yes | Only their own restricted project view | No | Authorised auditor |
| Transfer owner personal → company | Yes | No | No | Provider adapter verifies |
| Company withdrawal to owner's personal | Yes, only uncommitted balance | No | No | Provider adapter verifies |
| Send funded label offer | Yes | No | No | Enforce eligibility |
| Accept an offer | No, unless also artist on *another* label | Yes, if addressed | No | Atomic validation |
| Spend accepted artist project budget | No for artist-initiated purchases | Yes, eligible only | No | Validates vendor/contract |
| Top up artist funding | Propose/approve uncommitted cash | Request/accept terms | No | Reserve atomically |
| Organise label-owned showcase | Yes | Invitee consent / performance | No unless organiser separately | Shared event service |
| End artist agreement unilaterally | Only published breach mechanism, no arbitrary freeze | Same standards | No | Neutral adjudication |
| Sell label company | Yes, if all transfer conditions met | Consent for active contract transfer | Qualified purchaser | Executed atomically |
| Edit artist's song/master/profile | No | Yes subject to rights and moderation | No | Authorised moderation only |

**Moderation and fraud:** blocked users cannot send direct offers/DMs. Reports attach immutable snapshots of terms and communications. False claims, impersonation, harassment, coercive contracts, self-dealing vendor transactions, fabricated tickets/reviews, abuse of onboarding treasury, linked-account collusion and fake listens trigger evidence-based review. A freeze may stop **new risky payments** and preserve disputed amounts but must not rewrite agreed shares or arbitrarily confiscate earned legitimate receipts. Appeals/audit accessible; full controls defined by universal safety spec. Do not display private wallet balances in public office.

**Real music rights:** accepting a virtual label agreement does not transfer master copyright, real Spotify revenue, publisher rights, or permission to reproduce real-world logos/brands. The artist's existing rights assertions and contributor consents are required for use of tracks in-game. A takedown suspends affected playback/promotional use and may stop specific disputed projects; unrelated roster activity continues. Real-world artist affiliation verification is separate from fictional roleplay.

# 20. Inactivity, term expiry and early exit

- **Label owner offline:** artists' allocated budgets and agreed vendor bookings continue automatically. Owner's ability to negotiate new funds requires online return; no NPC commits new company money. Office lease does not silently renew. Reminders queue in inbox.
- **Artist offline:** scheduled Friday song releases proceed if previously approved; pre-authorised recorded performance can substitute only under booking terms; otherwise show may cancel with refunds. Unspent label project money remains held until expiry, not handed to label owner prematurely.
- **Contract nearing end:** notifications at 7 days, 48 hours and 1 hour before expiry; latest active paid project must be scheduled inside contract term. A signed renewal is a separate contract and cannot be active simultaneously; prepare a future offer, but it **cannot be accepted or reserve new funds until the prior contract has actually expired**. At that time both parties must still confirm and the server reserves funds atomically.
- **Contract expiry:** block new restricted spending; let existing valid obligations close; return free allocation to label company; archive roster position; release artist to another label. Record project-specific earned entitlements; settle promptly.
- **Early termination:** mutual cancellation requires both confirmations plus resolution of booked event/refund/vendor obligations. Material breach/rights abuse uses impartial dispute procedure; neither party can seize non-disputed commitments by declaring breach in chat. No personal recoupment debt.
- **Label inactive >30 days:** no forced closure or wallet withdrawal solely for inactivity. If office unleased, show `PAUSED_NO_OFFICE`. Preserve contracts, statuses and archives. Operations may restrict obviously abandoned public demo intake after 30 days, with artist notice, but never rescind accepted funding.

# 21. Label sales and business exit

Full-company sales permitted in V1, fractional ownership and shares EXCLUDED. City-owned property/office shell is **not** sold; what transfers is verified label brand, remaining company cash, owned moveable office assets, legitimate historical public identity, reserved funds and any **validly assumed** contractual obligations. Public archives show founder, current owner and dated operators. Buyer must be eligible for a sole company slot and able to fund authorised acquisition with uncommitted balance.

**Sale process:** seller starts draft listing → system builds immutable company obligations statement → buyer reviews assets, cash, reserves, live projects, contract expiry, outstanding tickets/disputes and owner history → buyer sends funded purchase offer → any active signed artists receive explicit *change-of-control consent request* → if all affected artists consent and all pending liabilities are funded/transferable, execute **atomic** purchase and transfer; otherwise reject/hold until contracts end and obligations reconcile. Any owner can cancel an unaccepted listing. Escrow/hold mechanics are simulation ledger only until external provider authorises them. If a consented artist agreement transfers, **the company's existing restricted funds remain held for that artist**, unchanged. **No artist persona, catalogue, copyright, fanbase, real-world account or genuine review is owned or sold.**

**Company bankruptcy:** company cannot make new commitments. It may wind down, satisfy protected vendor/artist/refund obligations, stop prepaid office use, sell approved moveable assets, and return only genuinely free funds to owner. If money is insufficient for authorised obligations despite advance reserve checks, flag `SETTLEMENT_EXCEPTION`, suspend dangerous payouts and invoke platform neutral reconciliation; never charge an uninvolved artist automatically or create balance out of thin air. Owner avatar and personal career remain intact; any new venture requires an available company slot once closure is complete.

# 22. State machines — implementation contract

**Label:** `ELIGIBLE_NO_LABEL → REGISTRATION_PENDING → ACTIVE → PAUSED_NO_OFFICE → WINDING_DOWN → CLOSED_ARCHIVED`. `ACTIVE` may return from `PAUSED_NO_OFFICE`; invalid transitions rejected. `SALE_PENDING` is a reversible lock overlay on `ACTIVE/WINDING_DOWN` that blocks new irreversible commitments.

**Offer:** `DRAFT → SENT ↔ COUNTERED → ACCEPTED` OR `DECLINED/EXPIRED/WITHDRAWN/SUPERSEDED/FUNDING_UNAVAILABLE`; `ACCEPTED` creates one `agreement_id`. `COUNTERED` means previous offer version cannot be accepted. Any acceptance must acquire artist uniqueness + roster seat + funds lock in same transaction.

**Agreement:** `PENDING_ACTIVATION → ACTIVE → EXPIRING → EXPIRED_SETTLEMENT → CLOSED`, plus `DISPUTED`, `TERMINATION_PENDING`, `TERMINATED_SETTLED`. No suspended contract automatically deletes expense rights already earned. Last artist deadline computed using server clock, not device clock.

**Funding:** `UNCOMMITTED → AGREEMENT_RESERVED → PROJECT_RESERVED → VENDOR_RESERVED → SPENT`, with reversals `VENDOR_RELEASED → PROJECT_RESERVED`, `PROJECT_RELEASED → AGREEMENT_RESERVED`, `AGREEMENT_EXPIRED_RELEASED → UNCOMMITTED`. A unit cannot be in two reservations simultaneously. `SPENT` is irreversible absent explicit compensating refund event.

**Label-owned event:** reuse shared `DRAFT → OPTION_HELD → RESERVED → PUBLISHED → LIVE → FINISHED → SETTLED`, or `CANCELLED/REFUND_PENDING/DISPUTED`; one immutable `organiser_id`, one `payer_id`, one `settlement_mode`. Award and reputation updates triggered after eligible final event results, not on booking creation.

**UI must show:** action pending state, no duplicate resubmit option while prior idempotency key resolving, clear `failed / pending / confirmed` messages, numeric changes only after authoritative receipt, undo only when a compensating permitted state transition exists.

# 23. Data objects and API boundaries

This is an implementation-neutral schema contract; physical tables and endpoint naming may vary, but semantics cannot.

| Object | Required principal fields |
| --- | --- |
| `Label` | `label_id`, `owner_player_id`, `brand_name`, `status`, `created_at`, `company_wallet_id`, `office_lease_id?`, `roster_limit=3`, `version` |
| `CompanyLedgerEntry` | immutable `entry_id`, `label_id`, account/debit/credit, amount integer minor units, currency realm, `source_intent`, ref, UTC timestamp |
| `Reserve` | `reserve_id`, `agreement_id?`, `project_id?`, amount, status, source wallet, expiry/obligation reference |
| `OfficeLease` | `lease_id`, `label_id`, template, start/end UTC, amount, equipment/layout references, state |
| `ArtistCandidate` | label and artist IDs, source, discovery timestamp, shortlist status, notes ACL |
| `DemoSubmission` | candidate, approved asset/preview permission, submitted, state, expiry, response |
| `Offer` | `offer_id`, `version`, sender label, artist, budget, term, split, submitted_at, expires_at, status, idempotency key |
| `LabelAgreement` | `agreement_id`, parties, active term, budget total/spent/available, split, eligible categories, snapshot of rules, status |
| `FundedProject` | `project_id`, `agreement_id`, `artist_id`, type, payer mode, **named eligible revenue event ID (at most one)**, event/release refs, reserved/spent, eligible receipt refs, status |
| `VendorOrder` | `order_id`, project, supplier, deliverable, cost, due, cancellation/refund rules, status |
| `LabelEvent` | shared event ID, `organiser_id`, payer, venue supplier, slots, roster invitation consents, mode, attendance and tickets |
| `ProjectSettlement` | `settlement_id`, project, named eligible event, G/F/W/C/R/P/A/L, minor-unit rounding, refund/dispute refs, payout transactions |
| `ArtistRosterHistory` | label, artist, effective start/end, original agreement, credited achievements, owner-at-time |
| `CompanySale` | seller/buyer, verified asset/liability snapshot, artist consents, cash/hold, state, receipt |
| `AuditEvent` | actor, before/after refs, action, evidence, UTC timestamp, moderator flags, immutable revision |

**Required service interfaces:** `identity/auth`, `avatar/world`, `music/catalogue`, `discovery/charts`, `label/contracts`, `project-funding/ledger`, `events/tickets`, `messaging`, `social/fans`, `moderation`, `economy-provider`, `analytics`. No client writes ledger directly. All money operations return authoritative receipts and support idempotency. **Realm-tag every balance** (`SCENE_SANDBOX_GAME_NAIRA`, future `VATAR_AUTHORISED_GAME_NAIRA`) and prevent cross-realm transfers unless provider explicitly supports conversion. Backend secrets must not be exposed in the embedded browser.

# 24. Exact interaction catalogue (H-Path contract)

Notation: **T** trigger, **A** actor/action, **V** visible response, **S** state change, **₦** money effect, **F** failure branch. External side effects always cite shared service owner.

| ID | Action | Trigger / actor | Visible response & state change | Money & critical failure |
| --- | --- | --- | --- | --- |
| LBL-01 | Establish label | Player at registry with empty company slot | Name/office chosen; company/instance created | Atomic setup charge; low balance/name collision rolls back |
| LBL-02 | Decorate office | Owner at decoration console | Place permitted purchased props; persist layout | Optional city purchase; incompatible placement refused |
| LBL-03 | Scout at show | Owner sees eligible performing artist | Artist card; play/follow/shortlist | No money; no access to private draft |
| LBL-04 | Browse Friday music | Owner at listening desk/Release Hall | Eligible released tracks, source attribution | No direct payout to artist from listen |
| LBL-05 | Shortlist candidate | Owner taps Save/notes | Candidate in A&R list | No money; enforce privacy/cap |
| LBL-06 | Receive demo | Opted-in artist submits approved preview | Pending inbox card, owner reply | No money; rate-limit duplicates |
| LBL-07 | Send invitation | Label to eligible unblocked artist | Artist inbox invite with office/remote choice | No money; no spam bypass |
| LBL-08 | Draft funded offer | Owner at contract table | Snapshot preview terms, example waterfall | No reserve yet; below-minimum budget invalid |
| LBL-09 | Counter offer | Artist or owner | Version +1 replaces old acceptance link | No money; timeout may expire |
| LBL-10 | Accept label agreement | Artist accepts live version | Signing scene, roster wall card, finance view | Atomic roster lock + full budget reserve; reject insufficient funds |
| LBL-11 | Decline/expire offer | Either/clock | Status with reason; applicant free | No charge, no agreement created |
| LBL-12 | Artist opens funded project | Signed artist | Project card in funding desk | Moves reserve within same agreement, not new money |
| LBL-13 | Artist buys covered service | Artist confirms eligible vendor quote | Project expense reserved/paid; progress posted | Decline unrelated category, self-deal, over-budget |
| LBL-14 | Request top-up | Artist | Owner notified, proposed extra allocation | No spend until joint consent and funded reservation |
| LBL-15 | Approve top-up | Owner + artist | Contract allocation increases | Reserve fresh uncommitted company funds only |
| LBL-16 | Review roster | Owner | Three artist cards and trajectories | View-only, cannot steal artist funds |
| LBL-17 | Book discovery night | Owner | Venue reserve, candidate slots, live poster | Separate label company expense; double booking blocked |
| LBL-18 | Select audition acts | Owner | Invites sent, roster of performers | No automatic signing/award; attendance optional |
| LBL-19 | Hire promoter | Owner or funded artist | Service contract with deadline/outcome | Payer mode explicit, never two payers |
| LBL-20 | Book label showcase | Owner | Venue/acts/ticket draft confirmed | Company paid; distinct label-event mode |
| LBL-21 | Invite guest performer | Owner | Artist consent and optional fee | Guarantee reserved; no forced appearance |
| LBL-22 | Publish tickets | Eligible organiser | Event public, capped ticket inventory | Cannot exceed venue cap or unconfirmed slot |
| LBL-23 | Attend live event | Owner as avatar | Listen/dance/socialize; eligible results | Real human ticket only, no NPC revenue |
| LBL-24 | Settle label event | Server upon completion | P&L and journal posted | Company profit/loss; no duplicate project split |
| LBL-25 | Settle funded artist project | Server | Cost recovery and profit shares shown | Per-project exact waterfall; no cross-deal siphoning |
| LBL-26 | Withdraw company funds | Owner | Available cash reduced and personal cash increased | Reject encumbered/reserved withdrawal |
| LBL-27 | Contract expires | Server | Artist removed active roster, history retained | Release unused reserve, protect open obligations |
| LBL-28 | Renew relationship | Owner proposes post-expiry new offer | Artist can accept/decline new term | Re-reserve money; never passive auto-renew |
| LBL-29 | Early terminate | Both or neutral adjudicator | Pending, final settlement, closed | No arbitrary forfeiture of non-disputed funds |
| LBL-30 | Start company sale | Owner | Verified sale listing and contract consents | Funds/assets held; active artists may refuse |
| LBL-31 | Complete company sale | Buyer/seller/system | Brand owner changes, archive updates | Atomic buyer charge/company transfer |
| LBL-32 | Insolvency wind-down | Owner/system | No new contracts, notices, liabilities view | Protected commitments before owner withdrawals |
| LBL-33 | Claim trophy / accolade | System eligible season result | Wall plaque and share card | Prestige only, no money minted |
| LBL-34 | Report abuse | Any legitimate party | Receipt, case ID and neutral review | Holds disputed subset; protects innocent projects |

# 25. Edge-case resolution matrix

| Situation | V1 deterministic outcome |
| --- | --- |
| Two label offers accepted at nearly the same time by one artist | Only one globally active label agreement; other attempt returns `ARTIST_ALREADY_SIGNED` with no debit. |
| Label sends five offers with only enough money for one | Clearly marked provisional; first funded atomic acceptance wins; later one returns `FUNDING_UNAVAILABLE` not debt. |
| Artist and label owner are same underlying player | Self-signing disallowed; no fake transfer, fake reputation or profit. |
| Label already has three roster artists | New offer may be drafted but **cannot** become accepted until slot frees; signing UI warns. |
| Label holds three contracts, one expires today | Seat frees only at server-end timestamp after commitments archived, not at owner's device midnight. |
| Label office lease expires while Kemi is signed | Private physical office closes; label phone and artist committed budgets continue. |
| Owner disappears for two months | No new funds are spent; prepaid lease ends; artist allocations remain usable until their agreement ends. |
| Artist disappears after label funds a studio booking | Studio booking uses posted cancellation/no-show terms; unused other restricted budget remains held until agreement end. |
| Artist spends full budget on several eligible vendor services | Permitted within capped amount; owner cannot claw back simply because outcome poor. |
| Artist tries to buy furniture/clothes or send a gift from allocation | Block; restricted funds only for eligible project orders. |
| Artist tries to pay their own alt account as producer | Block suspected linked self-dealing, place suspicious order under review with appeal. |
| Artist submits release that later faces rights complaint | Freeze affected media and only relevant project settlements; preserve non-disputed unrelated company finances. |
| Promoter fails to deliver | Contract deadline/cancellation policy controls invoice and refund; no automatic fake audience credit. |
| Vendor charges twice due to retry | Idempotency key produces one payment and one deliverable. |
| Show has no ticket buyers | No NPC revenue; organiser bears agreed costs, artist may still retain genuine earned performance fee. |
| Venue rented by a different operator for desired day | City cannot also rent it; book from current venue operator or alternate property. |
| Performer invited but does not consent | Cannot claim performance slot is confirmed; publication blocked if essential. |
| Artist cancels late | Use posted event policy, replacement or refund; obligations not silently eliminated. |
| Event server crashes mid-performance | Restore tickets and recorded show state; hold settlement, permit restart/reschedule/refund. |
| A player buys their own show's tickets for rankings | Genuine funds may move only if allowed, but self-dealing activity cannot farm attendance, chart or reputation. |
| Funded event ends after contract expiry | **Cannot be scheduled** that way in V1; existing valid events inside term settle after expiry under fixed time window. |
| Ticket refund issued after label project paid out | Apply disclosed provider reserve/compensating entries; no negative artist wallet magic. |
| Label tries to apply losses from Artist A against Artist B | Forbidden; project and agreement ledgers are isolated. |
| Artist tries to withdraw money after leaving label | Only their already-earned payable profit, not leftover restricted allocations. |
| Label wants share of artist's real streaming earnings | Not part of game agreement; forbidden. |
| Company sells while artist refuses new owner | Sale cannot transfer agreement; seller waits or terminates by valid rules. |
| Company sells while office space leased from city | City property remains city-owned; only transferable office lease/use right if provider agrees. |
| Company closes with unresolved paid tickets | Winding-down status, protect refund funds; closure blocked until resolved. |
| Company has ₦0 uncommitted but ₦100k artist reserved | Cannot sign new artists; signed artist still accesses reserved allocation. |
| Artist signs a new deal while previous contract settlement open | Allowed only after previous ACTIVE term ended; old claims limited to settled historical project IDs, not new work. |
| Owner renames the label to mimic a real company | Moderation/name review; stable ID and achievements history remain. |
| Artist buys a free-ticket showcase then rates it repeatedly | One eligible human vote/rating within shared anti-sybil rules, regardless repeat entries. |
| Standalone economy vs Vatar wallet account | Separate currency realms; no implicit transfer, exchange, display mixing or payout. |
| Platform lacks connected escrow/transfers | Connected player can browse/play culture features; connected virtual business financial transaction disabled or routed to explicitly standalone mode only with clear consent. |
| Treasury starter jobs overpay bots who form a label | Reward caps, unique account checks, anomaly monitoring; treasury reward cannot be disguised as another player's ticket. |
| Chart success immediately after label signing | Credit only events/releases legitimately developed during funded agreement, not the artist's entire past catalogue. |

# 26. Notifications, public information and accessibility

**Notifications:** pending offer received; counter received; contract accepted; funds reserved; vendor spend cleared; 75% of allocation spent; contract expires in 7d/48h/1h; release Friday result; artist reaches notable new milestone; demo submission received; showcase applications and performer consent; upcoming event 24h/1h; payout issued; compliance hold with reason and appeal. Users can mute non-critical marketing notifications; transactional contract notices remain in-app. Dedupe by event reference so a retry doesn't create five identical alerts.

**Public page:** brand logo/name, current owner display name, declared genres, opt-in open-demo flag, active roster (where artist consents), verified historical roster, live events, eligible awards and public reputation. **Private page:** company's account balances, detailed contract terms, artist restricted balances, unpublished demos, negotiation messages and precise receipts. Artists see only their own private deal details. Labels cannot inspect unrelated artists' private wallet information.

**Physical world accessibility:** movement and taps must work on narrow portrait screens (at least a 375×812 design target, subject to final Vatar acceptance rules), pointer and keyboard controls desktop, subtitles/captions/text equivalents for audio, mute and low-data mode, a readable alternative to textured contracts, clear timers in WAT, optional fast travel to registered office/Release Hall, and no real-time microphone/singing requirement to run a label. Do not gate consent on a tiny immersive 3D button without accessible review.

# 27. Observability, metrics and economy stress tests

**Player metrics:** time to first scouting listen, shortlist-to-offer conversion, offer-to-sign conversion, first project funding time, artists developed per owner, completed covered projects, label event participation, unauthorised-spend rejects, weekly confirmed paid transactions, genuine human show attendance, artist satisfaction from verifiable reliability, funds committed vs spent vs recouped, company cash runway and financial losses.

**Definitions:** a `genuine_listener` means unique eligible human account meeting shared music service's listening threshold; not an NPC, paid bot or one-sided self-play. `gross_label_revenue` excludes owner capital deposits, treasury test distributions and chart/listen counts. `label_project_profit` = actual positive project returns after recoup, not artist funding remaining. `development_success` measures relative change from pre-sign baseline and qualifying funded-period outcomes rather than raw star popularity. `insolvency` means unable to meet confirmed obligations in the authorised ledger, not just a zero uncommitted balance while reserves are fully funded.

**Telemetry names:** `label_registry_opened`, `label_created`, `label_office_entered`, `scout_audio_played`, `candidate_shortlisted`, `demo_submitted`, `label_offer_sent`, `label_offer_countered`, `label_offer_accepted`, `label_offer_failed_funding`, `label_funds_reserved`, `label_project_opened`, `label_vendor_paid`, `label_top_up_requested`, `label_top_up_committed`, `label_discovery_night_published`, `label_showcase_attended`, `label_event_settled`, `label_project_settled`, `label_contract_expired`, `label_sale_completed`, `label_insolvent`, `label_recovered`, `label_report_filed` with `event_id`, `player_id`, `label_id`, version, realm and server timestamp; never include complete personal chat text in analytics.

**Before launch, validate six simulations:**

1. **Low-population simulation (30 genuine concurrently active players):** one small discovery night should be enjoyable if five or fewer arrive; no fake ticket income; free audiences possible.
2. **Billionaire simulation:** richest owner cannot exceed three active artists or buy chart outcomes; can still lose money with 500-seat show and ten valid attendees.
3. **Inflation simulation:** if players bring huge external virtual balances, future offer prices can be rebalanced without rewriting existing accepted deal terms or stranded reserves.
4. **Mass acceptance race:** hundreds of offers and concurrent acceptances produce exactly one contract per artist with exact reserves.
5. **No-show/cancellation:** paid ticket refunds, artist contract costs and venue bookings reconcile without negative unauthorised balances.
6. **Provider outage:** standalone culture world works; connected purchases do not pretend to settle; payment adapter retries are idempotent.

**Suggested playtest acceptance hypotheses, not established benchmarks:** >=80% of label founders can complete first scout action without assistance; >=70% can explain the meaning of "reserved" after tutorial; zero duplicate funded acceptances; zero accidental public access to private finance screens; zero player financial promises without committed available funds; 100% of eligible payouts reconcile to project receipts; 0 NPC crowds credited as real attendance; no artist personally billed for label investment loss; 99% of simple state changes report definitive success/failure after reconnection. Adjust usability percentages after qualitative testing.

# 28. Implementation sequencing and gates

**Phase 1:** company creation, separate ledger, registry + one office instance, physical listening station, candidate shortlist, song catalogue read-only integration; no public financial promises until ledger proven.

**Phase 2:** offers, counteroffers, atomic acceptance, restricted artist-budget project creation and approved vendor payments; audit log and insolvency hold rules. Run race tests before enabling money.

**Phase 3:** label-owned city venue booking, auditions, showcase attendance, promoter contracts, fan interactions and event settlement. Use Venue and Artist shared services; do not fork logic for label-only tickets or stage scoring.

**Phase 4:** covered artist project profit waterfall, expiry, top-ups, project closeouts, company sales/exit, award and public historical attribution, abuse monitoring and complete telemetry.

**Connected integration gate:** use Vatar/Lagos Life only for authenticated identity and operations verified in signed official developer SDK at implementation time. Native paid business transfers, reserve and company escrow must be **disabled until documented and provider-approved**. Do not substitute real-money purchases, staked matches or simulated balances for unrestricted game-naira settlements.

# 29. Acceptance tests (Codex handoff criteria)

| ID | Given | When | Then |
| --- | --- | --- | --- |
| AT-01 | Player owns no company, has ₦150k | Registers valid label once | Exactly one label, ₦10k fee, ₦15k prepaid office, ₦125k company cash, zero reserved |
| AT-02 | Same create intent retried | Client resubmits | Same company and same single debit |
| AT-03 | Player already owns venue company | Attempts to create label | Rejected for one-company rule; no charge |
| AT-04 | Eligible label has ₦125k free cash | Artist accepts ₦100k offer | One active contract; ₦100k reserved; ₦25k available |
| AT-05 | Artist accepted one deal | Accepts rival offer simultaneously | Rival fails atomically; zero second reserve |
| AT-06 | Label has three active deals | Fourth accepts | Capacity failure; no debit |
| AT-07 | Offer budget ₦100k, funds now ₦80k | Artist accepts | Funding unavailable; contract not active |
| AT-08 | Active artist with ₦100k allocated | Spends ₦40k on legitimate studio | Vendor paid once, ₦60k allocation remains, no owner prompt |
| AT-09 | Same artist project | Tries to gift ₦10k to friend | Blocked; original balances unchanged |
| AT-10 | Project spend ₦40k; receipts ₦70k; split 60/40 | Final settlement | Label gets ₦40k recoup + ₦12k profit, artist ₦18k, clearing zero |
| AT-11 | Project C=₦200k, N=₦150k | Settles | Label gets ₦150k, artist ₦0, label records ₦50k loss, artist personal debt ₦0 |
| AT-12 | Label funds its own ₦16k show and receives ₦29.1k net | Event settles | Company profit +₦13.1k, no additional artist project percentage |
| AT-13 | Artist funds ₦16k show from label allocation, net receipts ₦29.1k | Event settles | Artist +₦7,860, label reimbursed ₦16k and profit +₦5,240 |
| AT-14 | Signed artist is offline | Owner signs nothing else | Existing reserves remain; project vendor deadlines/cancellation operate normally |
| AT-15 | Owner is offline and office expires | Artist pays permitted vendor | Payment completes from prior reserve; no office-lease forced renewal |
| AT-16 | Contract term ends, no pending obligations | Clock advances | Unspent committed cash released, active roster frees, artist may sign another label |
| AT-17 | Agreement ended but prior event settlement pending | Payout received in allowed window | Historical project settles per snapshot; new unrelated events never routed to prior label |
| AT-18 | Company owns 3 signed artists | Owner starts sale, 1 artist refuses consent | Sale blocked, no forced contract assignment |
| AT-19 | Company has protected refunds | Owner requests full cash withdrawal | Withdrawal restricted to genuinely uncommitted balance |
| AT-20 | Label event has 12 NPC and 8 real audience avatars | Event completes | Genuine attendance ≤8, NPC ticket income ₦0 |
| AT-21 | Artist had old hit before signing | Label signs artist | Label does not retroactively claim previous listens, awards or unrelated income |
| AT-22 | Copyright takedown targets one song | Moderator restricts it | Only affected project and media held; unrelated artist project remains active |
| AT-23 | Browser drops during offer acceptance | Client reconnects | Client sees one confirmed or failed agreement, never ambiguous duplicated funding |
| AT-24 | Lagos Life adapter lacks transfer API | User tries connected label payment | Clear unavailable message; no fake external payment or sandbox-to-platform balance conversion |
| AT-25 | Player buys equipment with personal funds | Office lease expires | Purchased eligible portable property preserved, reusable in next compatible office |
| AT-26 | Two label-owned shows try reserve same venue block | Both submit | At most one succeeds; other refunded/released completely |
| AT-27 | Artist uses company's own label account as producer seller | Attempts invoice | Linked self-dealing hold/rejection; no artificial money laundering |
| AT-28 | Artist is not yet approved for music release | Label sends offer | Discussions allowed, but activation waits for approved playable recording |
| AT-29 | Owner submits label top-up and artist refuses | Refusal registered | No new funds reserved; old agreement unchanged |
| AT-30 | Two different users edit same contract version | Save and accept race | Stale offer version rejected, no silent overwrite |

# 30. Cross-chapter amendment register

This chapter relies on, and where specified clarifies, earlier work. Implementations must honour these **precise reconciliations**:

- **Artist Foundation §13:** adopts **per-project**, not automatically pooled whole-contract, recoupment. No mixing label and personal payment in one financial project in V1. An artist campaign may include recording, promotion and **one named funded ticketed event**, but independent projects cannot cross-reimburse costs; if financing has no revenue event, its recoupment may be zero. Artist controls approved spending within contract allocation, no case-by-case manager authorisations. Funding reserve occurs on successful atomic acceptance.
- **Artist Foundation §7:** unchanged Wednesday 18:00 submit, Thursday 18:00 moderation gate, Friday 18:30 prior charts, Friday 19:00 new releases, weekly chart windows. Label cannot circumvent artist's single weekly official release or buy chart score.
- **Venue Foundation §4/§6:** prebuilt city venue or present player operator, one full 24h reservation, 50-seat city lounge ₦6k/day, 3% **test** ticket fee. Label can be an ordinary venue customer, not a second rent authority or undeclared property owner.
- **Venue Foundation §8:** event organiser responsible for tickets/refunds. Label only financially responsible for its own shows or specific commitments. Label project spend is not a venue operator's permanent equipment purchase.
- **Universal Economy, not yet frozen:** reserve/available ledger semantics, buyer/provider settlement support, globally applicable fee rates, fraud systems and exact NPC treasury. This chapter sets minimum behaviour, not the external provider's undocumented API.
- **Promoter chapter, forthcoming:** provider service, campaign activities, deliverables, performance attribution and payment timings; cannot mint streams, followers, or ticket demand. Label vendor contract is usable by the Promoter chapter.
- **Investor chapter, forthcoming:** optional project sponsorship and future actual investment. Do **not** bolt equity, company co-ownership or loans onto V1 label terms.
- **Awards chapter, forthcoming:** Destiny Awards eligibility and governance. Label does not select winners just by sponsoring the ceremony or owning the host venue.

# 31. Decision register: locked rules, numeric knobs, external dependencies

| ID | Decision | Status | Ownership |
| --- | --- | --- | --- |
| LBL-D01 | Record label is financing/development company, not artist manager | CONFIRMED | Founder |
| LBL-D02 | Physical office, listening room, contract table, roster wall | CONFIRMED | Founder approved concept |
| LBL-D03 | Three active roster slots | BASELINE approved direction | Game design |
| LBL-D04 | Four/eight/twelve-week funded agreements | BASELINE approved direction | Game design |
| LBL-D05 | Full finite budget reserved on artist acceptance | CONFIRMED/Baseline mechanism | Economy |
| LBL-D06 | Artist self-directs eligible funded transactions | CONFIRMED | Founder |
| LBL-D07 | Per-project recoupment, profit split, no personal loss recovery | BASELINE (consistent Artist §13) | Economy |
| LBL-D08 | Non-overlapping label-showcase vs artist-funded event settlement | BASELINE | Economy/Event |
| LBL-D09 | Registration ₦10k, office ₦15k/7d, first contract ₦100k, recommended capital ₦150k | BALANCE DEFAULT | Economy; tune by measured earnings |
| LBL-D10 | Artist share 40–90% in 5-point steps | BALANCE DEFAULT | Economy/UI; review fairness |
| LBL-D11 | Discovery nights, direct scout, demos, Release Friday | CONFIRMED | Founder approved concept |
| LBL-D12 | Historical credits persist; label never owns artist persona | CONFIRMED | Founder |
| LBL-D13 | Label can sell business; active artists consent to contract assignment | BASELINE approved direction | Trust/Economy |
| LBL-D14 | No new connected game-naira transfers without documented developer rail | DEPENDENCY | Vatar adapter/provider |
| LBL-D15 | Weighted record-label leaderboards and Destiny nomination formulas | SHARED SPEC DEPENDENCY | Rankings/Awards chapter |
| LBL-D16 | Actual record/master copyright and off-platform rights remain independent | CONFIRMED | Rights/moderation |
| LBL-D17 | One company per player, no staff financial delegates, no self-sign | CONFIRMED + BASELINE | Universal identity |
| LBL-D18 | No label passive streaming cash, NPC ticket income or phantom profit | CONFIRMED | Economy |

**No product-design question in the V1 label lifecycle is intentionally left to Codex to invent.** Cross-cutting platform and economic parameters are identified with owner and safe fallback. This doesn't mean the whole game is implementation-complete: the universal specifications and prototype validation are still required.

# 32. Research, provenance and source notes

**Internal canonical sources:** THE SCENE H-Path v0.1; Seven-Day Career Simulation v0.2; Venue Operator v0.3; Artist Career v0.4; founder approval of the full record-label proposed mechanics on 12 Oct 2026. All fees, roster caps, timing windows, contract terms and minimum balances labelled BASELINE/BALANCE DEFAULT are **invented design numbers for testing**, not factual Nigerian music-industry rates and not claims about Lagos Life issuance.

**External contextual readings (non-normative):** Open Music Business, “Advance and Recoupment Explained” (Aug 2026); Musician-oriented guidance on recoupment structures and project accounting; official Lagos Life Terms of Service (updated Oct 1 2026); Lagos Life developer portal (actual SDK fields and wallet methods must be rechecked at implementation). Sources support the need to distinguish recoupment, rights and currency representations, **not** any claim that THE SCENE's simplified deals are real-world record contracts.

**Cross-document precedence:** Founder CONFIRMED decisions > updated central decision register > this V1 record-label specific rule set > prior conceptual record-label passages > default assumptions. When a shared economy or event chapter is later revised, version and test changes must explicitly reconcile the corresponding label references. No silent changes to signed virtual agreements.

---

## Codex handoff rule

**Implement exactly the documented label business simulation after shared modules are ready; do not independently invent money sources, performer ownership, escrow methods, default streams-to-cash conversion, contract clauses or Vatar APIs.** Do not confuse prototype numbers and production platform permissions. The first complete proof is: independently wealthy label owner creates company → scouts a genuine artist at a venue → sends offer → artist accepts → funds reserved → artist books a verified producer/venue service without approval → genuine player concert occurs → receipts reconcile once → label/artist receive correct virtual shares → agreement ends → unspent funds and identity are preserved. Then test the failure branches before release.
