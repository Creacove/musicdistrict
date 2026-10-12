# THE SCENE — Screen & Interaction Blueprints v1.0
**How Codex should use this:** Find the player story, open the matching `V##` images in `references/IMAGE_MANIFEST.json`, implement the interaction states below, then audit against Master GDD. The screenshots are visual brainstorming, not functional acceptance evidence.

## Read as a state machine, not a page catalogue
Every flow has: **arrival in 3D world → physical object or phone entry → compact choice sheet → preview and consequences → explicit player confirmation → server result → visible changed world**. Some choices are *just* learning/exploring and have no purchase confirmation. Keep the 3D world visible except for intentionally expanded sheets.

| Flow | Visual IDs | Physical game moment | Expanded UI | What is never automated |
| --- | --- | --- | --- | --- |
| New player socialises | V01 V02 V24 V25 | Avatar enters Music Square, notices crowd, tracks a song | Compact local events and chat | Registering a business or assigning class |
| Fan discovers music | V17 V18 V19 V20 | Player approaches a listening station/room | Song player: play/seek/save/follow/invite | Counting an unplayed song as a human listen |
| Artist prepares release | V10 V11 V12 | Player interacts with artwork wall/counter | Track/rights/cover/date/preview; approval status | Publishing if rights/embargo missing |
| Artist asks Desk | V04 V05 | Opens phone at studio/home | Ask Desk, three eligible options, route/info | Signing, spending, success forecast |
| Producer makes beat | V03 V11 V12 | Moves to loop pads and vocal booth | Station tools, save/export/credit | AI-generated music requiring paid service by default |
| Venue operator buys gear | V06 V07 | Walks into Stage Supply, inspects object | Preview-in-venue, actual wallet, confirmed cost | Buy/charge without player confirmation |
| Venue operator leases property | V08 V09 | Visits registry or inspects public hall | Price/date/rights/equipment, compare, confirm | Overlapping lease or event double booking |
| Label signs an artist | V13 V14 | Listening office/showcase, plays demo | Offer terms, funded budget hold, counterpart signature | Label owning real masters/artist persona automatically |
| Promoter places ads | V15 V16 | Scouts physical boards/venue display | Placement availability, cost, runtime, permission | Guaranteed views, streams, chat blasts |
| Fan or label at Destiny Awards | V23 | Arrives at authorised show session | Ticket, stage mode, memory, follow nominee | Award votes or huge fabricated audience |
| Small live concert | V21 V22 | Ticket check-in, dance, react, stage performance | Small show HUD, now playing, stage reactions | Paying phantom attendees |
| Desk general Today | V04 V05 V01 | Summoned from phone or site prompt | 0-3 verified options + reasons + route | Teleporting and performing an activity |

## Frame requirements for Codex
### Mobile World Idle — 375 × 812 CSS px baseline
- Game viewport dominated by scene; fixed compact top and bottom chrome. Avatar third-person centered with clear interaction radius cues.
- If no nearby interaction: no intrusive card. Desk entry small and optional. Touch joystick or click-to-move prototype: choose based on actual mobile playtests.
- A nearby station shows one translucent `Interact` chip; when activated, show a single bottom sheet no taller than necessary.
- Chat heads and other avatars must be throttle-able by player setting; chat does not cover the action target.

### Mobile sheet state — interaction dependent
- `Venue catalogue`: category chips, available and permitted spaces, sample price *from current server config*, date selection then inspect location. Don't show four giant illustrated cards while walking around.
- `Venue preview`: photographs/concept previews are allowed before leasing; in the world, user can **walk around physical venue** before choosing.
- `Stage Supply`: product card with actual equipment specs, player and/or business wallet selection, item ownership recipient, stock, install/placement instructions, final confirmation.
- `Release`: artwork and song metadata; if awaiting approval, show `Pending`; don't show `Ready for Friday` if cover missing.
- `Desk`: options include `why`, `location`, `cost`, `time`, `deadline` and relevant trust indicator; no invented current online counts, guaranteed outcomes, LLM autonomous actions.

### Desktop label A&R experience
- Scene behind: small live A&R office or listening venue, not a screen-sized wallpaper. `Listen to demo` works; owner can physically meet artist at publicly permitted places.
- Side sheet `Compare artists`: show *the true available* releases, past genuine human event performance, funding requirement and risks; use no spurious 6.1M streams or monthly cash royalties.
- Contract compose: review actual roster cap (3 signed funded), term 4/8/12 weeks baseline, budget reserve ≥ configured minimum and profit share after recoup. Explicit artist acceptance. No rights seizure.
- Desk Today can highlight expiry/funding request; must not choose signing candidate for the player.

### Promoter campaign map
- Promo inventory is scarce and paid *display space*, not ability to broadcast to imaginary users. The map shows specific usable poster surfaces, availability windows, time-limited leases and click-to-inspect in 3D.
- Graph may show **historical observed** genuine activity with denominators and confidence labels; never pretend hypothetical exposure is verified results or promise 120k users when actual game has 20 concurrent humans.
- Player can request comparison between districts, inspect placement, travel there for first activation if activity requires it, and explicitly approve client-funded spend.

### Music listening
- Distinct **personal player** (private audio) and **room/player zone** (authoritative current track). User must explicitly enable audio in browser.
- For each track: cover, artist, play/pause/seek, save, follow, play context, eligible source. Chat reactions are separate from listens.
- Fan may leave room: personal playback remains opt-in; zone audio fades according to audio policy.

### In-world Desk v phone Desk
`Desk in phone`: strong actionable Today/Ask/Plans. `Desk at venue`: compact “Review setup?” callout anchored to a verified control terminal. `Desk alert`: only an honest, important state change (e.g. event begins in 15m); do not generate fake collaborator proximity.

## Location map and travel
Routes are a series of actual waypoints, perhaps **walk locally** and **board an authored cab ride for districts**. Show ETA before travel, allow cancel, optionally skip authored scenic trip, but do not give an unpaid shortcut around a signed property lease or travel-restricted event. A place inspector can preview pictures remotely; inspection and certain first-time actions remain physically grounded. No unsupported real-world Lagos Life transport API assumptions.

## Event session size and visual crowd
Initial legitimate live session target is 20–50 tested human players. Large hall art may appear in catalogue with `Coming later` or limited special event. Avoid rendering thousands of detailed 3D avatars in V1; several NPCs for atmosphere may exist but never fill live paid seats or inflate receipts.

## Required screenshot capture for each implemented flow
1. Mobile iOS Safari or WebKit device screenshot, mobile Android Chrome screenshot, desktop Chrome screenshot.
2. UI unloaded/loading, populated, insufficient funds, invalid permission, offline, reconnect and success where relevant.
3. Real 3D geometry in the viewport; DOM browser inspect; captured JS/CSS/network size.
4. One 20-second interaction demonstration with UI controls and actual server state changes.
