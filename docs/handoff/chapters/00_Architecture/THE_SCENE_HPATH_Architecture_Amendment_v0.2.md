# THE SCENE
## H-Path Architecture Amendment v0.2 — One Avatar, One Business, Many Ways to Play

**Document type:** Canonical player-role taxonomy and cross-chapter amendment  
**Date:** 12 October 2026  
**Status:** Founder-approved direction; precise economic and technical parameters labelled DESIGN BASELINE or EXTERNAL DEPENDENCY  
**Supersedes:** Only the *career/classification* portions of H-Path Player Interaction Matrix v0.1. Its history, opportunities, fan economy, world rules, awards and interaction evidence remain preserved.  
**Companion:** Promoter Career & Promotion Agency v1.0 (this delivery); Venue Operator v0.3; Artist v0.4; Record Label v1.0.

> **North star.** THE SCENE is a persistent 3D, mobile/browser-first music-industry life simulation hosted on its own domain. Real humans create or import cleared music; other real humans discover it, attend experiences and help careers emerge. Music discovery, not running spreadsheets or adding arbitrary character classes, is the purpose of the world.

## 1. The decision and its intent

The earlier matrix listed 16 playable identities. **They were useful ecosystem lenses, not a mandate to develop 16 exclusive careers.** V1 now separates an avatar's identity, universal activities, specialised personal careers and companies. Every player has one persistent character. No permanent class choice during onboarding. A player may be an artist, a fan, a beatmaker, a promoter and an event attendee while owning one eligible registered company.

**Founder-confirmed architectural rule:** All eligible company types are visible to all players from the beginning. A player can own **at most one registered company at a time**. Access to a business depends on available money and published prerequisites, not a hard career level. Players can close or sell a company under settlement rules, then start another. This is a limit on registered businesses, **not a ban on freelance work, creativity, renting a venue for one show, or attending concerts**.

## 2. Three different things the system must model

| Axis | Definition | V1 examples | Restriction |
| --- | --- | --- | --- |
| Personal identity | Single avatar, music taste, reputation, relationships and owned creative catalogue | Artist; music fan; producer credit; promoter portfolio | No permanent class selection |
| Activities | Actions any eligible player can initiate, as organiser/participant/contractor | Make beat, record song, apply to audition, accept small campaign, arrange concert, support another player's event | Rules depend on action, funding and permissions; no second company required |
| Registered company | Persistent branded business with company funds, operating obligations and an owner | Venue business; record label; promotion agency | **One active company per player in V1** |

**Examples:** A label owner can record a song and perform at an open mic, but cannot additionally register a promotion agency. An independent artist can rent a venue for one show without owning a venue business. A venue operator can create music and buy a permitted poster placement for their own event without converting into a promoter company. A producer can sell an authorised beat without opening a studio company. A wealthy fan can back a permitted event without selecting an investor class.

## 3. V1 canonical systems and taxonomy

| Item from original H-Path | New V1 status | Preserved gameplay and data | Important exclusion |
| --- | --- | --- | --- |
| Artist | **Deep personal career** | Real music upload, simple loop creation, Friday release, fanbase, auditions, stage mode, bookings, label funding, charts, Destiny Awards | Artist is not itself a registered company |
| Venue operator | **Company type 1** | One operating lease, prebuilt unique public venue identity, gear/decor, event bookings, operating overhead, reputation and bankruptcy | No permanent ownership of city property or chains in V1 |
| Record-label owner | **Company type 2** | Physical office, A&R, roster of up to three, funded short contracts, project accounting, discovery nights, showcases | No artist-control powers, complex rights ownership or managers |
| Promoter / agency | **Freelance activity + company type 3** | Release/event campaigns, physical placements, listening sessions, verified deliverables, own events; agency branding and overhead | No guaranteed listens, fan counts, ticket sales or chart placement |
| Producer | **Creative activity + freelance service** | Loop-maker, instrumentals, artist collaboration, licence/payout, production credit and portfolio | No separate production company or employee tree in V1 |
| Studio owner | **NPC venue/service** | Public studios and recording workstations accessible by all; paid services possible | No player-owned studio company V1 |
| Investor | **Optional event-funding activity** | Any eligible player may back or sponsor a specific permitted event, with explicit outcomes | No investor class, bank, equity shares, passive yield or loans |
| Event organiser | **Event role** | Artist, promoter, label, venue operator or ordinary eligible player may be organiser with one accountable payer | Not a registered business by itself |
| Manager | **Excluded as class** | Artist self-manages; assisted tools may surface opportunities | No independent management company |
| Booking agent | **Activity / future speciality** | Direct booking and counteroffers for all eligible participants | No booking company |
| Equipment supplier / technician | **NPC service + short task** | Stage Supply purchases/rentals; setup interaction; optional short work | No equipment vendor company |
| Talent scout | **Activity / recognition** | Listening, scouting lists, verified referral to labels and venues | No dedicated scout class or separate referral economy required |
| Journalist / media | **World feature and optional activity** | The Scene Daily reports genuine in-game events; content moderation | No media company needed V1 |
| Fan / tastemaker | **Universal social layer** | Follow artists, save songs, attend shows, enjoy world, fan communities, early discovery achievements | Not a business or obligatory job |
| Fan-community organiser | **Social activity** | Artist-operated fan groups and moderated conversation | Fans cannot independently host *official* artist listening events |
| Banker / lender | **Deferred entirely** | Future speculation recorded only | No loans, negative balances or bank gameplay V1 |

This explicitly preserves **all original ecosystem roles** as either a launch business, a player activity, an NPC support, or deferred expansion; no idea disappears silently.

## 4. H-Path now applies to activities, not permanent classes

For every **company type and substantial personal activity**, record H0–H6:

| Path | Universal test | Required evidence |
| --- | --- | --- |
| H0 Arrival | Can a person start from zero balance or with existing wealth, without class assignment? | First 30 s / first 5 min flows, costs and free alternative |
| H1 Discovery | Can the player encounter this opportunity physically or on phone? | Scene location, object, notification and opt-in |
| H2 Gameplay | Is there a meaningful action/decision, not merely a progress bar? | Inputs, scene, transitions, skill/mastery and accessibility |
| H3 Interdependence | Whom can they benefit, hire, collaborate with or compete against? | Explicit counterparty actions and consent |
| H4 Economy | What moves money, who risks loss, who pays and what is protected? | Ledger, payer, reservation, refund and state changes |
| H5 Progression | What improves in capability or reputation beyond raw wealth? | Portfolio, assets, relationships, impact, history and prestige |
| H6 Return/recovery | What can the player do tonight if clients are offline, the show fails, or money is gone? | NPC/public fallback, social activity, recovery and no forced dependency |

**Every substantial interaction** must specify: `trigger -> scene/phone interaction -> eligibility -> draft/offer -> consent -> reserve/charge -> live/world effect -> verification -> settlement -> dispute/failure -> analytics`. Not every step changes money, but every money-changing action needs explicit authority.

## 5. One company invariant: lifecycle and permissions

**Business lifecycle (DESIGN BASELINE):** `ELIGIBLE -> REGISTERING -> ACTIVE -> PAUSED -> SELLING | CLOSING -> CLOSED | SOLD`. The server holds a unique active-company ownership constraint per account, including registering, paused, selling and closing states. An owner cannot evade it by starting a second company while debts or active obligations are being resolved. Once terminal and settled, a new company may be registered.

- **Company finances:** distinct company wallet/ledger. Owner may deposit available personal funds, use company funds for permitted business expenses, and withdraw only **unencumbered** company money. These operations are permitted only by the owner in V1; no delegated spending roles, co-owners, or employee budget permissions.
- **Personal creator work:** songs, producer credits, follows, achievements and the avatar are tied to the **person**, not automatically sold with their company. A music producer selling a licence does not create a company asset unless the applicable explicit agreement says so.
- **Company sale:** whole-company sale only; material bookings, artist agreements and prepaid obligations must be fulfilled, terminated under disclosed terms or transferred with necessary counterparty consent. Sellers don't keep operational assets sold to the buyer. No selling of human artist accounts or song copyright by default.
- **Owner still active socially:** company bankruptcy closes business access, but does not erase personal artist, fan or professional history. Former owners can complete starter work and save for a new venture.
- **One flagship venue per venue company** in V1, matching VEN v0.3; a venue lease does not confer permanent real-estate ownership. A non-venue-company artist can still book a room for a show.
- **No negative player debt by accident:** expenses require available authorised funds and transaction validation; the game must not silently auto-renew indefinite rent or charge a label for discretionary artist spending outside its allocation.

## 6. Updated interaction and earning matrix

| Actor / activity | Gives other players | Receives from other players | Main gameplay | Financial risk |
| --- | --- | --- | --- | --- |
| Artist | Songs, concerts, performances, collaborations, fandom | Production, venue space, promotion, label budget, fan attention | Create/import -> release -> discover -> perform -> grow | Studio/promotion/own-event costs; label project protected under contract |
| Freelance beatmaker | Approved beats, custom arrangements, production credit | Fees, feedback, exposure, collaborators | Make/arrange -> audition -> licence/deliver | Creation time, optional services; no guaranteed buyer |
| Freelance promoter | Posters, placement work, listening gatherings, event demand opportunity | Client fees, verified service history | Discover brief -> propose -> execute -> report | Underpriced work and missed deadlines; no fake attention |
| Venue business | Event space, quality, public programming, audience experience | Rental fees, tickets for its own shows, relationships | Lease -> equip -> book/host -> settle -> improve | Ongoing city rent, event costs, idle time; possible closure |
| Label business | Funded artist development, auditions, showcases | Project-recoup/share under contract, label-event revenue | Scout -> sign -> fund -> observe -> reinvest | Unrecovered artist costs, office lease and show losses |
| Promotion agency | Larger campaign capacity, brand, event organising, sponsored discovery | Campaign fees and own-event eligible profit | Clients -> campaigns -> placement -> delivery -> repeat | Staff-free overhead, placement costs, poor margins |
| Fan / attendee | Genuine attention, saves, follows, attendance, community | Enjoyable shows, music, relationships | Discover -> listen -> follow -> attend -> share | Optional ticket spending, not compulsory labour |
| Optional event backer | Project funding, sponsor support | Transparent sponsored recognition or eligible event proceeds | Evaluate -> accept risk -> attend -> settle | Entire backing may be lost; no promised return |

**Demand integrity:** NPCs may fill scenery and supply services but never fabricate ticket revenue, chart listens, followers or votes. Promo spend purchases an opportunity to be seen, not listener actions. Social participation is available to every avatar, including business owners.

## 7. Universal interfaces and physical-first UI

V1 world is a compact stylised 3D entertainment district. Physical stations include: public studio loop desk and booth; Release House artwork wall and submission machine; opportunity boards; booking desk at each venue; company office scouting wall, contract table and campaign board; public placement kiosks; music listening stations; stage and audience interactive zones. The in-game phone carries messaging, account balances, status, navigation, quick repeat actions and accessible alternatives; it should not replace the physical play experience.

**One logical service for multiple actors:** `EventService` owns event states, ticket capacity and organiser responsibility; `ContractService` owns offers, acceptance and deliverables; `LedgerService` owns available/reserved/settled amounts; `MusicService` owns rights, releases and listening; `PlacementService` owns ad-slot inventory and attribution; `CompanyService` owns the one-company invariant. No individual career gets its own contradictory financial or booking implementation.

## 8. Cross-chapter amendments — authoritative precedence

| Prior chapter or artifact | Keep | Read differently / amend |
| --- | --- | --- |
| H-Path v0.1 §2 original 16-role roster | Every interaction dependency and professional fantasy | Replace exclusive role inference with this taxonomy; label producer/investor/scout/etc. as *activity*, not registered business |
| Seven-Day Simulation v0.2 | 7-player ecology, stages, real demand, async services | Its producer/investor representatives are **activities**; simulated roles don't mean a separate career registration |
| Venue Operator v0.3 | Property tiers, unique public IDs, lease/one-day booking, equipment, 3% *test* fee, closure, Destiny eligibility | Venue operation is an optional **one company**; event rentals remain open to artists/promoters/labels and eligible ordinary players |
| Artist v0.4 | All rights, physical release/studio, real song emphasis, charts/fan/Stage Mode, funded label contracts | Beatmaking can be done by any avatar; producer is not a formal separate company/class; artist's career exists independently of any business slot |
| Record Label v1.0 | One-office roster, three artists max, short funded contracts, per-project recoupment, artist autonomy | Label requires player's single company slot; producers are service providers rather than studio-company owners; investor is an optional event funder |
| Promoter previous design discussion | Two campaign branches, public placements, listening sessions, client work, own events | Freelancer is available to any eligible account; only registering a **promotion agency** consumes business slot |

**Numeric cross-chapter baseline for future simulations:** City 50-seat lounge short hire **₦6,000 per 24h**, operator 7d lease **₦29,400**; test ticket fee **3%**, not 5% and not claimed as Vatar fee. Label registration **₦10,000**, test office lease **₦15,000/7d**, funded first contract **₦100,000** minimum, starting eligibility **₦150,000**. All are **DESIGN BALANCE DEFAULTS**, not market facts, subject to explicit playtest calibration. No new profession document may silently contradict them.

## 9. External platform boundary and safe money model

THE SCENE is hosted at its own HTTPS domain, with an independent identity and 3D avatar. The official Vatar Games SDK v1 documentation confirms an embedded experience and game-scoped player identity, real-money product checkout, platform leaderboard and approved 2–4-player matches. It does **not document** a general wallet-balance read or arbitrary virtual-naira player-to-player transfer, paid ticket, company wallet, refund or business settlement API. Avatar `avatar` is a PNG picture, not an importable 3D model. Third-party integration must implement only documented features; don't repurpose staked matches to mimic business payments.

**Implementation rule:** A **clearly labelled standalone simulation ledger** enables testing and independent play; it must not falsely call its balance native Lagos Life money or silently convert it. Introduce future `VatarWalletAdapter` methods for native payments only when official authorisation and technical support exist. No real-money cash-out or gambling-like promised returns. Sources: https://lagoslife.app/developers/docs and https://lagoslife.app/developers/agreement (checked 12 October 2026).

## 10. Consequences for engineering and current backlog

1. Add `PersonProfile`, `CreativeRole`, `Company`, `CompanyOwner`, `FreelancePortfolio`, `RegisteredBusinessType` as distinct concepts. **Do not** use `user.role = "investor"` or a mandatory `career_type` enumeration to gate all actions.
2. Every purchase/contract carries **paying ledger**, **operating actor**, **beneficiary**, **supplier**, `purpose`, `project/event`, and `idempotency_key`. Example: label project finances an artist's promoter; artist initiates, promoter receives, label commitment pays. No double bill.
3. Unify personal artist/producer/fan achievements with a separate historical business timeline. Transferring a company must not transfer the person's private social graph or their creative rights.
4. Keep physically instantiated opportunities: billboard, walk-in listening, contracts at desks, venue visits, release hall. Phone shortcuts help frequent players.
5. Treat `Back an event` as optional activity, not a new investment-company game. Exact funding agreement rules belong in shared economy and event chapters, not scattered role spec.
6. Update old chapter labels and implementation issue trackers with this amendment; preserve source documents as read-only historical snapshots and use the amendment for precedence.

## 11. Testable invariants

- One player can **simultaneously** have an artist profile, producer credits, campaign portfolio and fan follows, plus at most one company.
- Registering a second company while another is ACTIVE, PAUSED, SELLING or CLOSING fails without debiting funds.
- An artist without a venue company can rent a city venue/event slot and host a show.
- A label owner can commission a freelance promoter and a beatmaker without registering those counterparties as companies.
- A producer can create and sell authorised original beats with no studio-company registration.
- A wealthy player can fund an eligible event without investor-class selection or a promised fixed yield.
- An NPC animated crowd cannot become a counted ticket holder, chart listener, award voter or independent payer.
- An agency business can close with its deliverables settled; the player's freelance history and artist identity remain.
- A company sale transfers only permitted company assets/rights, not another player's recording copyright or identity.
- All money commitments reject overspend atomically; no hidden personal negative debt.

## 12. Open dependencies and next documents

This amendment **resolves role scope**. It does not claim that the entire game is implementation-complete. The shared fan/community, discovery and charts, live events, economy-provider adapter, rights/moderation, world navigation, and operator live-service chapters must still define full data schemas, dispute windows, content rules, costs and adversarial test cases.

**Production order after this delivery:** (1) Promoter Career & Promotion Agency v1.0, (2) Fan and Social Experience, (3) Concerts and Shared Events, (4) Music Discovery and Charts, (5) Shared Economy/Contracts/External Platform, (6) NPC and World Operations, (7) full cross-chapter validation, (8) final Codex-ready V1 master specification.

### Decision tags

**CONFIRMED** = founder explicitly selected. **DESIGN BASELINE** = specific proposed implementation choice, usable for prototype but reconfigurable. **EXTERNAL DEPENDENCY** = platform, rights or regulatory capability not yet established. **DEFERRED** = preserved for possible later version, expressly outside launch scope.
