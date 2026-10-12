# THE SCENE
## Artist Career & Music Creation — Gameplay Foundation, Interaction Catalogue and Decision Register

**Document ID:** TS-GDD-ART-002  
**Version:** 0.4 | **Date:** 12 October 2026  
**Classification:** Game design foundation / V1 implementation baseline  
**Companion documents:** TS-GDD-VEN-001 Venue Operator v0.3; H-Path Interaction Matrix v0.1; Seven-Day Career Simulation v0.2.  
**Purpose:** A standalone reference for a future designer or coding agent with no access to the originating conversation. It records the artist's entire intended experience, concrete proposed rules, interactions, economic relationships, failure states, risks and implementation tests. It does **not** pretend that unimplemented external APIs, music licences or playtest outcomes are confirmed.

> **Core promise:** A person with an actual released song, a person making deliberately rough music from loops, and a wealthy label-funded artist can all build interesting careers in the *same real-player music world*. The player creates or supplies music, brings it into physical game spaces, finds actual listeners, plays shows, develops fans, makes difficult decisions, and may fail or become an icon. Real music discovery is the heart of THE SCENE; the business economy exists to support it.

### How to read requirements

- **C — CONFIRMED:** Direct user decisions from the project discussions. These should not be silently reversed.
- **D — DESIGN DEFAULT:** Explicit expert-design resolution supplied here to remove ambiguity for prototype/V1; still subject to founder approval and playtesting, **not** an already approved user decision.
- **X — EXTERNAL DEPENDENCY:** Requires independent verification, permission or platform capability before activation.
- **F — FUTURE:** Preserve as an extension, but don't make V1 depend on it.

**Precedence:** Latest explicit founder instruction > confirmed venue/economy invariants > this chapter's design defaults > earlier speculative examples. Monetary numbers are *fictional game-naira balancing fixtures*, not real Nigerian prices or verified Lagos Life balances. A rule marked D is implementable for the standalone prototype, but cannot be described as final founder sign-off.

---

## 1. Game and artist identity: the foundation

THE SCENE is a self-hosted, mobile-first, third-person, stylised **3D Sims-like** multiplayer music-industry life simulator. Its own domain and backend must operate even when not opened through Lagos Life. A future integration adapter can recognise supported Lagos Life player identities and use only wallet/avatar features officially exposed by the developer SDK. The avatar walks, dances, meets people, approaches studio equipment, enters venues and attends shared events. The player's phone handles messages, schedules, balances and shortcuts; it is not the primary gameplay environment.

An **avatar account** is a person, not a locked profession. Every player may listen to songs, follow artists, attend shows, dance, browse opportunities and work introductory jobs. A player may pursue an artist career while also playing as a fan. A person need not own a business to become an artist. V1 allows **one company owner per avatar and one owned company per avatar**, consistent with VEN-001; an artist profile is *not* itself a company. Artists may use their personal wallet or a permitted label-funded project balance.

An **artist persona** is a public performance identity associated with exactly one account in V1. It has a stable ID, display name, visual identity, song catalogue, credited collaborations, followers, performances, contracts, reputation and weekly chart history. Artist profile/real-world musician verification are separate concepts: possessing the avatar does not prove ownership of an externally uploaded song, and real-world fame does not automatically transfer into in-game ranking.

**Two phases of artist entry:** `ASPIRING` (player intends to make music, can rehearse/record/apply for learning jobs but has no approved public release) and `ACTIVE` (at least one recording passed the platform's media/rights checks and the persona has a playable eligible catalogue item). The artist becomes chart-eligible only after a song officially releases. A person with an unreleased private recording may audition by sharing a limited, consented private preview with the organiser; that is not public discovery or an early Release Friday.

**H-Path:** H0 arrival → H1 discovery → H2 hands-on actions → H3 human collaboration → H4 financial decisions → H5 audience/career progression → H6 return, failure and recovery. All artist systems below must satisfy all seven stages.

## 2. Artist design decisions — comprehensive register

| ID | Requirement / decision | State | Implementation consequence |
| --- | --- | --- | --- |
| ART-01 | Real independently released music is a primary purpose of THE SCENE. | C | Artist-owned uploads receive a genuine in-game music/discovery career. |
| ART-02 | An artist must supply an actual recording or create one in-game. | C | No chart-eligible fictional titles without playable audio. |
| ART-03 | Only artist personas can submit a **song release**. | C | Producers upload instrumentals to their workbench; only authorised artist release owners submit songs. |
| ART-04 | Players can create songs with producer-built beats and voice recordings. | C | Support loops, beat arrangements, microphone/file vocals and final mixes. |
| ART-05 | V1 music creation should be affordable, easy and permit silly/rough music. | C | No subjective talent scoring or paid AI API required for an eligible release. |
| ART-06 | Physical gameplay takes priority over filling conventional forms. | C | Studio desk, vocal booth, cover wall, release counter and stage all have 3D touchpoints. |
| ART-07 | Pre-existing cleared songs can be imported instead of remade. | C | Fast upload pathway available; physical stations give context but cannot hold veterans hostage. |
| ART-08 | Official song premieres are on Friday, maximum one per artist each week. | C | Release locks, private drafts and scheduling rules must enforce limit. |
| ART-09 | A missed eligible deadline pushes the song to the following Friday. | C | No silent off-schedule launch. |
| ART-10 | Weekly district charts and Lagos-wide chart respond to real listeners, replays and saves. | C | Server-side engagement; replays count but anti-looping caps apply. |
| ART-11 | Old songs can remain chart-eligible; concert and soundtrack listening matter. | C | No automatic chart expiry; opt-in background music gets limited qualified credit. |
| ART-12 | Following an artist gives updates and access to an artist fan group chat. | C | Artist-owned community; block/mute/report controls. |
| ART-13 | Every career may also be a fan; a fan cannot organise an artist's *official* listening party without authorisation. | C | Artist/authorised organiser gates official events. |
| ART-14 | Direct voluntary transfers between players are ordinary gifts, not automatically sponsorships. | C | No gift-generated contract, influence or promised returns. |
| ART-15 | Artists self-manage; labels are funders, not mandatory approval managers. | C | Funded project allocation; routine eligible artist spending needs no owner's individual approval. |
| ART-16 | Label agreements specify funding, period and virtual income share. | C | Label funds are finite, segregated and cannot be used beyond terms. |
| ART-17 | Auditions, talent hunts, open mics, headline shows and guest appearances connect artists to venues. | C | Artist can rent venue directly or be booked by others. |
| ART-18 | Running shows can generate profit or losses, not automatic income. | C | Human ticket demand, contractual costs and settlement. |
| ART-19 | Destiny Awards represent highest official industry prestige, about four times per year. | C | Other concerts may be larger; nomination/performance cannot be purchased. |
| ART-20 | Fan/artist interaction, live shared events, humour and user-created stories are essential. | C | Social-first performances; amateur viral songs may outperform expensive professional releases. |
| ART-21 | Use a freely playable basic loop creator first; optional Suno/AI generation later. | D | No mandatory external generation cost or API availability. |
| ART-22 | Use physical stations with phone-based repeat shortcuts after first completion. | D | Spatial feel without repetitive form/walking tax. |
| ART-23 | One artist persona and one official artist appearance per Release Friday per account. | D | Primary or co-primary official release consumes weekly slot; featured-credit policy follows section 8. |
| ART-24 | Chart-score replay bonuses diminish per human listener. | D | Transparent capped weekly scoring, not unlimited loop farming. |
| ART-25 | Separate authentic human followers/attendance from NPC atmosphere. | C | No NPC ticket receipts, chart listeners, award votes or follower inflation. |
| ART-26 | Artist financial failure never destroys avatar, song rights or earned history. | C | Optional small jobs/free music participation support recovery. |
| ART-27 | Artist-created audio has a distinct rights permission from virtual label revenue shares. | D | No recording copyright transfer solely by virtual signing. |
| ART-28 | Co-author tracks require explicit rights/credit approval before submission. | D | Consent tokens and version snapshots, not a free-text promise alone. |
| ART-29 | Private works are not publicly discoverable before Friday. | D | Preview permission only for intended recipients, no public looping/chart activity. |
| ART-30 | Standalone wallet is separate from any future Lagos Life wallet. | C / X | No invented game-naira bridge or external currency conversion. |

## 3. H-Path: what each artistic play style can do

| H-Path | Existing musician (A) | First-time creator (B) | Label-backed artist (C) |
| --- | --- | --- | --- |
| H0 arrival | Import cleared track; zero starting cash possible. | Select ‘make my first song’; zero money possible. | Has real songs and a finite contractual label allocation. |
| H1 discover | Free auditions, talent showcases, opportunities. | Walk into public studio, explore free loop stations. | Scout venue and promoter opportunities. |
| H2 gameplay | Physical cover prep, stage rehearsal and shows. | Loop arranger, booth recording, funny performances. | More elaborate shows with higher stakes; same stage controls. |
| H3 relationships | Venues, listeners, labels, promoters, producers. | Producers, fans, collaborators, venues. | Label, promoter, guests, competing venues and fans. |
| H4 economy | Free discovery and work, low-cost gigs, self-funded shows. | Free creation, optional paid sessions and jobs. | Project budget spending, recoup/profit share, possible major losses. |
| H5 progression | Local following → charts → bookings → prestige. | DIY track → first fans → viral/comedy or original identity. | Reach > attention > demand > profitable performances. |
| H6 retention/recovery | Next auditions, catalogue, offers, friends. | New loops and stage formats; can fail and restart cheaply. | Adjust venue/campaign strategy after financial losses. |

**Fairness invariant:** Professional recording quality is not a hidden popularity multiplier. Wealth improves access to promotion and production, **not** the probability that an individual listener chooses to like or save a track. A silly original song may win an audience. A professionally produced track may fail.

## 4. First session: physical arrival and discoverability

**Entry 0–30 seconds:** Avatar spawns in The Square. The world renders nearby players/NPCs, an audible opt-in welcome music station, a currently accessible small venue, Studio and Release House signs, an events billboard, and a subtle three-step guide. First on-screen CTA: **‘Make music’**, **‘Hear music’**, or **‘Find work’**. No mandatory artist selection or complex registration form. The game does not automatically start audio before the browser permits it.

**30 seconds–2 minutes:** Following ‘Make music’ places a clear waypoint on the Studio. Player taps ground to move / uses mobile virtual joystick or desktop keys. Approaching the Studio opens a small ‘Enter / See available sessions’ interaction. If player already has a track, ‘Bring my music’ directs to the Release House.

**2–5 minutes:** Existing musicians can begin import and complete first physical cover/title preview; new creators can pick a loop pack and start auditioning sounds without paying or understanding music theory. Either can return to general world with saved progress. A first visit requires at most one brief guided physical sequence; after that, phone shortcuts jump directly to an owned project's relevant station with a lightweight camera transition.

**5–20 minutes:** Player finishes a draft, starts a private audition, explores the public listening area, views artist opportunities, or takes a small authorised paid job. Returning players always have a personal feed: studio drafts, auditions closing, upcoming shows, open public events, inbox offers and Friday countdown.

**Visual interaction language:** World objects glow subtly when available; context prompt has verb + purpose, e.g. ‘Record vocal’, not ambiguous ‘Interact’. Confirmations display on-world (record sleeve/cover wall) and persist to phone history. Inputs use tap, drag, hold, choose, short text. Essential text fields (song title, credit names, descriptions) still exist in accessible overlays: physical presentation must not corrupt or replace structured data capture. All physical operations have keyboard/controller-accessible focus and reduced-motion alternatives.

### 4.1 World stations and their functions

| Place | Physical object | Primary operation | Nonphysical alternative |
| --- | --- | --- | --- |
| Studio | Producer's desk with loop pads | Browse/arrange licensed beat loops | Phone → My Projects → Open workstation |
| Studio | Vocal booth / microphone | Record or import voice, monitor takes | Upload compatible vocal file if microphone unavailable |
| Studio | Speaker console | Audition, volume/effects, approve master | Lightweight audio review overlay |
| Release House | Record intake table | Choose approved master and create release draft | Phone → Prepare Release |
| Release House | Artwork frame | Upload/select cover; see it in 3D | Accessible image chooser |
| Release House | Printed sleeve/title desk | Set title, credits, collaborators | Keyboard/touch input panel |
| Release House | Listening booth | Final check of master | Confirm preview player |
| Release House | Release machine + calendar | Validate, schedule Friday, submit | Phone shortcut to pending release |
| Performance venue | Audition noticeboard | Apply, inspect slots, attach private preview | Opportunities app |
| Performance venue | Backstage case/wardrobe | Choose setlist and stage look | Scheduled show card |
| Performance venue | Stage trigger points | Movement, visuals, crowd interactions | One-tap accessible action strip |
| Home/personal space | Release shelf and achievement wall | Display records, concert posters, awards | Profile accomplishments |
| Release Hall | Interactive release kiosks | Hear public music, save/follow/share | Music app |

## 5. Music creation: affordable V1 loop-and-vocal system

**Confirmed direction:** DIY music can be imperfect, funny, experimental or professional. The game verifies safety and rights, **not artistic taste**. Real submitted songs and DIY songs use the same release machinery; source type is transparent but does not influence base chart score.

### 5.1 Creation tracks

1. **Import existing complete song:** An artist uploads a finished file and declares the required rights. No forced minigame recreation. Most important to the real-music discovery mission.
2. **DIY music:** A player assembles instrument loops and publishes an arrangement, optionally adding recorded vocals.
3. **Producer collaboration:** A producer creates an instrumental asset and offers it to an artist under agreed usage rights; artist adds vocals or a distinct arrangement contribution and submits as artist.
4. **Bring your own instrumental:** Artist imports an instrumental and vocals with appropriate permission for every underlying component.
5. **AI-assisted composition:** **F**; only when an approved provider's commercial terms, API access, moderation and per-track economics have been confirmed. Do not block or overcharge V1 because of an assumed Suno integration.

**Studio access:** A baseline public studio has free starter packs and basic rendering. Premium-looking paid studio sessions add social customisation, support, additional eligible packs or producer labour—not a hidden score advantage. A zero-balance player must be able to create a first eligible song or participate in free public music activities.

### 5.2 Starter loop creator — concrete V1 interaction

**Pack structure (D):** Seed 6 starter genre packs; each pack has 100–115 BPM or another fixed compatible tempo and key as appropriate, labelled prominently. Each pack supplies at least 4 drums, 3 bass, 3 piano/keys, 3 melodic instruments, 3 auxiliary percussion and 2 atmosphere options, all cleared for user-created derivative tracks and in-game public playback. Packs are created/licensed and audited; don't assume arbitrary free samples permit redistribution.

**Controls:** Five lanes by default—Drums, Bass, Keys, Melody, FX/Percussion—with an optional sixth vocal lane. A loop picker presents 3–8 auditable choices per category. Tap loop to preview; drag to a lane in an **Intro / Verse / Hook / Outro** arrangement grid. Each section is 4 or 8 bars. Select intensity and mute/solo per lane; set lane gain 0–100 and section order. All pieces within a selected pack share BPM/key; cross-pack combinations not offered unless verified compatible. During play, an action button toggles each section; audio transport keeps loops sample-aligned where device allows. Saved project is editable JSON plus asset IDs, not a flattened MP3 until render.

**Minimum submit-ready DIY work (D):** At least 30 seconds of rendered audible music, at least one rhythmic or melodic instrument, an actual saved arrangement with >=2 timeline sections, and either original vocal audio **or** deliberate lane/section arrangement changes. Do **not** impose a ‘music quality’ score; disallow entirely empty or duplicated identical-file spam through content/abuse checks. Maximum finished song 6 minutes for launch; project may have longer private drafts but cannot schedule them as official songs. User may create instrumental-only music; forcing vocals would exclude legitimate instrumental artists.

**Audio rendering:** Client previews via Web Audio/Tone.js or equivalent; high-reliability final rendering handled in a queue to consistent supported format. Service validates no clipping beyond tolerances and reasonable peak loudness (rather than evaluating artistic merit), renders a preview, provides user confirmation, produces fingerprint and duration metadata. Failed jobs can retry without duplicate releases. Record original components and attribution.

**Cost control (D):** Free starter sessions and bounded file storage; 3 concurrently editable DIY drafts on the free path, 20 finished owned recordings before archival prompt (not deletion). Paid costs are not required for music creation in V1; protect servers with authenticated per-account upload/render rate limits. A basic render should not incur per-call commercial generative-AI charges.

### 5.3 Vocal capture, upload, collaboration and recovery

At booth: tap mic → explicit browser permission prompt → headphones tip → audible metronome/count-in optional → start/stop → waveform preview → save/take again. Count-in does not record final performance by default. Media permissions require HTTPS and may be restricted in an iframe; if `getUserMedia` is unavailable, offer upload of an existing vocal file. Capture one vocal take at a time initially; maximum 3 active retained takes per draft, oldest may be manually deleted only. The player selects winning take, offset adjustment (±500 ms initially), gain 0–100 and simple reverb/delay toggles. Input gain and monitoring must prevent feedback; muted/zero-byte recordings fail validation.

**The producer session:** Artist requests a time/price and specified asset licence; producer accepts/counters; payment is reserved only with both parties' agreement and a verified provider/standalone ledger; producer submits an instrumental into a project proposal; artist previews, accepts or requests allowed changes; producer/artist collaborate through shared project permissions, not simultaneous destructive editing of the same timeline. Server revision numbers implement optimistic editing locks: stale edits require merge/reopen rather than silently overwriting the other player's work. Take files are autosaved after each completed take. On disconnect, session can be resumed; billing follows delivery checkpoints rather than elapsed idle time.

**Producer-made beat without an artist:** It remains a producer instrumental/portfolio item, not an official artist release. A producer can also create an artist persona if they want to officially release their own music; that career remains an artist and consumes the same weekly slot. A producer must never submit another artist's vocals as their own artist release without explicit collaboration permissions.

### 5.4 Media import defaults and validation

| Field | V1 design default | Failure behaviour |
| --- | --- | --- |
| Finished audio | MP3, AAC/M4A, WAV, or browser-supported recorded format; normalize server-side | Reject unknown/unreadable type with clear fix |
| Song duration | 30 seconds–6 minutes | Short/long recordings remain private drafts until corrected |
| Max inbound audio file | 60 MB | Warn before transfer; reject oversized file |
| Cover art | JPG, PNG, WebP; square minimum 512 × 512; 10 MB max | Offer crop/template; cannot submit without valid cover |
| Song metadata | Title, primary artist, original/cover declaration, credited producers/guests, rights affirmation | Highlight missing station and preserve draft |
| Content scan | File safety, format, duplicate fingerprint, policy and rights flags | Quarantine for review; no public play until approved |
| Public streaming | Delivery from CDN signed/authorised URL or controlled stream | Hide source file URL where practicable; access checked server side |
| Audio playback | Explicit user consent/gesture for first playback | Show Play button if browser blocks autoplay |

All bounds above are **D** operational launch defaults, not measurements from real uploads. Tune after constrained user tests; never retroactively alter approved files silently.

## 6. Rights, attribution, ownership and authenticity

**Non-negotiable:** The user wants to promote real independent music. All uploaded music must be usable in the game legally. A checkbox alone is not conclusive ownership evidence; combine affirmative warranties, moderation, duplicate detection, complaint channels and prompt takedown procedures. THE SCENE receives a limited, clear permission to host and stream the recording within the game and to display approved art/credits; no blanket sale of an artist's masters or songwriting rights.

**Artist submission rights check:** Artist must declare that they control or have permissions for (a) the sound recording/master, (b) underlying composition/lyrics, (c) all samples/loops, (d) artwork, and (e) any collaborator appearances/voices. Distinguish original song, cover song and remix/sample: for covers/remixes, route to enhanced review/permissions rather than treating all content identically. Real-world Spotify/Apple profiles may be linked for voluntary discovery, but never count external streams toward THE SCENE charts. No rewards for generating streams on other platforms.

**Ownership of DIY song:** The artist owns their original recorded contribution to the extent allowed by law. THE SCENE retains rights in its own licensed loop library and grants a defined licence for completed works according to the eventual loop-pack terms; do not promise exclusive copyright over generic preset loops. A paid producer session must present a simple licence option (nonexclusive beat use by default unless both approve exclusivity) with defined commercial scope and credits before payment. Original music ownership disputes pause affected public use, not the artist's whole profile.

**Collaboration permissions (D):** When two performers record a joint work, each contributor approves their name, recorded performance inclusion and release permissions. One primary releasing artist is selected; all named **artist performers** appearing on a public official release consume their weekly Friday slot for that release, preventing unlimited featured-track loopholes. Producer-only credits do not consume an artist Friday slot. Contributors may have a separate private internal virtual project earnings agreement, but that is not automatically a real-world songwriting royalty agreement.

**Identity:** Personal display name is not identity verification. Users can role-play, but cannot impersonate a real musician, label or celebrity. Add optional ‘verified musician’ state after appropriate review; verified status neither adds automatic chart points nor contract privileges. Disputes about claimed real tracks trigger a hold and appeal/review process. Rights withdrawal halts future playback and use at shows promptly; past factual chart/event history may be retained in limited text form, with the recording unavailable and personal data retention governed by policy.

**Sensitive content:** Do not permit unlawful material, nonconsensual voice imitation, copyright piracy, hateful harassment, or dangerous instructions. No unrestricted live voice chat in V1. Technical/content decisions must be appealable where reasonable. Music may be intentionally ‘wack’ or comedic; low production quality is not itself a moderation offence.

## 7. Recorded work and official release — exact state models

### 7.1 Song project state machine

`NEW → DRAFT → MIX_READY → MASTER_READY → RELEASE_DRAFT → SUBMITTED → REVIEWING → APPROVED_SCHEDULED → LIVE → ARCHIVED`.

Alternative transitions: `DRAFT ↔ MIX_READY` (revisions); `SUBMITTED/REVIEWING → NEEDS_FIX → RELEASE_DRAFT`; `REVIEWING → REJECTED/QUARANTINED` with appeal; `APPROVED_SCHEDULED → CANCELLED` prior to publication cutoff; `LIVE → RESTRICTED/TAKEDOWN` for rights/policy; `RESTRICTED → LIVE` only after adjudicated reinstatement; `MASTER_READY → PRIVATE_DEMO` for limited auditions without official publication. `ARCHIVED` removes from active profile discovery but may retain authorised historical credits.

**Transitions require** actor role, asset/version ID, timestamp and reason. A duplicate client request with the same idempotency key cannot create a second release or advance it twice. Artist can edit title/cover on draft, but an approved scheduled release's master/primary collaborators are locked unless it returns to review, which may push scheduling to next Friday.

### 7.2 Release clock (D baseline, WAT)

- **Wednesday 18:00:** Normal submission deadline for Friday.
- **Thursday 18:00:** Moderation/scheduling cut-off. Any unresolved review rolls to next eligible Friday, with explicit notice; not silently released.
- **Friday 18:30:** Publish completed previous chart cycle results (pending honest anti-abuse/finality checks).
- **Friday 19:00:** Batch-publish all valid scheduled official songs; city Release Friday shared showcase begins.
- **Weekly limit:** One official artist appearance (lead or featured collaborator) per artist persona during each Friday release batch. A producer may produce multiple songs without becoming their releasing artist.
- **Chart scoring:** Valid activities are assigned to **Friday 18:00 WAT → next Friday 17:59:59 WAT** windows. This allows score computation before the 18:30 reveal. Songs that premiere at 19:00 begin earning points then; pre-premiere activity never counts. Older songs can earn during the full interval. The 18:00–19:00 period before a premiere belongs to the next chart window; no listening activity is dropped.
- **Countdown and missed deadline:** If submission, media processing, rights consent or review is incomplete by deadline, next open Friday is selected and displayed. The artist can decline the rescheduled date and retain draft instead.

**Conflict resolution:** Calendar operates from trusted server time (`Africa/Lagos`, UTC+01); user device time does not control release. Two devices editing release metadata obey revision conflicts. Cancelled approval frees the artist's weekly slot if the cancellation is before the release lock and no other already approved release consumes it. Submitted songs cannot be simultaneously scheduled for two Fridays under competing sessions. Songs released this week can remain on charts indefinitely while they receive eligible interest.

### 7.3 Physical Release House interaction

Artist obtains a completed mix → carries/opens project at the **Record Intake Desk** → **Artwork Frame** uploads or arranges a cover → **Title Sleeve** inputs title/credit fields through focused overlay → **Listening Booth** plays the actual render → **Release Calendar** chooses next eligible Friday → **Rights Console** affirmations and required contributor approvals → **Release Machine** shows clear preflight checklist/estimated publication → Submit plays a short satisfying animation → ‘Pending / Scheduled Friday’ appears on real in-world sleeve and in phone notifications.

The artist can *see* art/title rendered on world assets. Advanced repeat preparation is a phone shortcut to the same state machine. Missing fields highlight precise stations, not a generic error page. On review delay, the artist receives status and reasons. **Friday release is not bypassed by changing device time, running a private preview or entering the studio.**

### 7.4 Private demos and embargo

V1 private demo = playable only by specifically invited audition organisers/contracted producer collaborators (limit 30-second share previews to non-collaborator audition viewers), expires at deadline or manually revoked; no public profile listing, repost, soundtrack feature, chart listens or live concert playback before official release. Owner may play full draft in private studio rehearsal. Media-sharing links use permission checks, not obscurity-only URLs. Non-eligible private listens do not accumulate public fan counters.

## 8. Music discovery, listening, weekly charts and fraud resistance

Every approved released song is in the catalogue, eligible for public discovery, artist profile, explicit save and follow. **Discovery** is a real-player journey, not a cash-for-ranking inventory. Release Hall offers: featured shared listening event selected with published criteria, filters by genre/district/new and emerging, public release kiosks, artist search and personalised suggestions. Paid boost placement is **F**, and when introduced cannot purchase chart position.

### 8.1 What counts as a human listener?

A genuine eligible account begins playback through an intentional Play, verified soundtrack selection or a live event in which the client actually checked in and received/played the track. A **qualified listen** lasts at least `min(30 seconds, 50% of the track duration)` with a minimum 10 seconds, with audio enabled and no suspicious automated/repeated account patterns. Because public song minimum is 30 seconds, this generally means 15–30 seconds. Voluntary skips, raw player loads, server-preloaded audio and NPC avatars are not qualified listens. Counts remain distinct: total raw starts, completed qualified plays, unique human listeners and chart points.

**Per-listener per-song per-week proposed chart points (D):** first qualified exposure = 40; first two qualified voluntary replays = 12 and 8; first verified save = 25; first genuinely attended venue performance featuring the song = 15. Maximum **100 eligible points per human listener/song/weekly scoring interval**. Additional genuine replays remain visible in ordinary playback analytics but do not add chart points. A person need not do all four. All points can be invalidated after fraud review.

**Personal soundtrack:** The player opts into a released song on their own profile, enabling game-world playback when audio is allowed; it gives at most one first qualified listen and two qualifying replay bonuses per song per week under the same person-level cap. Continuous loop does not mint infinite points. A venue playing a track in the background does not cause every nearby avatar to count as an audience member; live engagement requires active check-in, audible playback and eligible time threshold.

**District attribution:** Normal discovery/listening uses one selected home district, editable no more than once per 28 days; concert-only engagement bonus attributed to the venue's district. A human/song/week has one unique-listener contribution assigned to their stable home district; the event bonus may contribute to a second event district with its own capped source, while the Lagos aggregation de-duplicates that user/song/week. Don't multiply a single listen into many districts when a user walks around. Rankings are score-sorted then tie-broken by distinct qualified listeners, distinct saves, then stable release ID. New artist filters use separate eligibility cohorts, not paid ranking manipulation.

**Public metrics:** unique eligible listeners, qualified replays, saves, followers and chart history; never show NPCs as real fans. **Leaderboard season:** Friday 18:30 reveal of the immediately prior completed chart cycle; historic weekly rows immutable except transparent correction/appeal. Top 20 district and Top 100 Lagos are derived server-side. Counts can be shown near-real-time, but official rankings change once weekly. An older song can return to number one if genuine activity warrants it.

**Abuse:** Rate-limit plays, device/session trust and account integrity; exclude self-stream boosting and suspicious linked accounts; no rewards for repeatedly playing one's own track or making other players stream real-world music platforms. Never expose exploit-sensitive anti-fraud thresholds as a way to farm the chart. Publish high-level fairness principles and an appeal path. Do not falsely promise that the scoring formula cannot be gamed; observe and recalibrate across playtests.

## 9. Artist profile, fans, community and social notifications

### 9.1 Public artist profile

The profile is discoverable physically (performer posters, Release Hall, event card) and on phone. Elements: hero avatar, artist name, selected genres, self-written short biography, verified status if earned, released songs with Play/Save, credits, fans/follow count, home district + audience heatmap, chart peaks, performances, awards, linked official social/music sites, upcoming booked shows, contact/book button, Follow and Join Community. If no public songs, show `Aspiring artist — first release in progress` (no fabricated popularity). Technical metrics, a game's cultural score, real streaming metrics and money should not be mixed into one misleading ‘talent score’.

### 9.2 Follow and artist-run fan group

Following is free, optional, reversible and per-user unique. Followers opt into digest or event/release notifications by category. Artist or an authorised moderator controls official fan-group announcements, but fan members can chat as ordinary members (subject to anti-spam). Fan cannot create an **official artist listening party** without explicit artist/organiser authority. `unfollow` stops future follower-only notifications; it does not retroactively erase legitimate past listening or attendance. Blocking prevents direct contact and public follower messaging where appropriate; public chart aggregates preserve anonymised counts under policy.

**Notification routing:** Friday release, announced show, schedule change, awards nomination, meaningful milestone and important direct messages. Aggregate noisy events; do not alert followers on every single play or profile edit. Off-line users see persisted notification inbox. Share cards for actual releases, chart placements, sell-outs, concert dates and Destiny nominations link to the relevant playable entity. Artist can speak to followers through a moderated group; no unlimited push spam.

**Fan fun:** All avatars—including other artists and industry executives—can be spectators. Audience enjoyment arises from music, dancing, reactions, interaction with friends, discovering performers, artist recognition, festival attendance and world events, not mandatory employment. **Fan-to-artist gifts** are voluntary balance transfers without investment promises, bonuses to ranking or special financial claims. This requires a supported wallet rail; it is available in standalone simulation only until native authorisation permits transfers.

## 10. Auditions, open mics, talent hunts and artist opportunities

### 10.1 Event formats and opportunity rules

| Opportunity | Who creates it | Artist action | Result |
| --- | --- | --- | --- |
| Open mic | NPC/city or venue/event organiser | Reserve available performance slot; present published eligible song | First real exposure; possibly no cash |
| Talent hunt | Venue, promoter or authorised organiser | Apply with audition preview; selected artists perform | Genuine audience response, potential prize or future gig |
| Label showcase | Record label or venue | Apply for limited stage slot | Networking, scouting; no compulsory signing |
| Opening act | Headlining artist/organiser | Apply or accept invite | Appearance income and audience discovery |
| Guest appearance | Artist/organiser | Accept date, song and agreed pay | Credits/fee and fans without headliner obligations |
| Headline show | Artist acting as organiser | Book venue, costs, guests, tickets | Profit/loss and direct fan relationships |
| Festival | Eligible organiser | Apply, negotiate slot | Larger exposure and variable guarantees |
| Destiny performance | Official programme operator | Qualify/invitation by published criteria | One of highest official prestige milestones |

**Application workflow:** Walk to Opportunities Board (or phone shortcut) → inspect actual organiser, venue, date, slots, price/compensation and real attendance expectations → attach approved song or limited private preview → Confirm → server marks `APPLIED` → organiser `SHORTLISTED / ACCEPTED / DECLINED / EXPIRED` → accepted artist chooses Accept by deadline → immutable event-performance reservation confirmed. Real human organisers choose performers; NPC offers use clear deterministic eligibility, not secret favouritism.

**Eligibility:** A new aspiring artist may apply to learn at designated beginner open mics, but an official public performance requires an approved public song; private audition previews are allowed earlier for screening. Disclosed challenge formats (e.g. comedy/newcomer) may select an amateur musician; no audio ‘talent score’ gate. An organiser cannot claim a slot is confirmed if no artist has accepted it. A player may be invited to several options but cannot **confirm** physically overlapping performances (allow travel/prep padding).

**Artist autonomy:** Selected artist may accept or decline venue offer. Booking must specify lead/guest role, appearance fee if any, performance song, start/end, allowed fallback, cancellation/refund terms, venue production minimum, and payer. A venue operator's rental fee is owed by the organiser, not automatically the artist unless artist is organiser.

### 10.2 Talent-hunt performance specifics

V1 default: five artists, 90–120-second performance slot each, automatic host, free or paid ticketing based on organiser's terms, verified audience eligible for one ballot per contest, and anti-collusion checks. Winner selection policy must be disclosed upfront: default **60% audience eligible vote / 40% event performance objectives**, with a minimum genuine-voter quorum (D: 5 unique genuine eligible attendees); if quorum not met, event is marked exhibition-only and non-voting prize conditions apply as announced. A venue operator may instead select fully audience-voted or noncompetitive formats **before ticket sales**, never after seeing outcomes. Performance objectives cover completed show, no abusive/safety disruption and confirmed stage participation, *not* automatically judging the musical taste of the recording. Artist gets exposure and history even without winning.

**Discovery opportunities:** Attendees can immediately play/save/follow artist; venue historic ‘early discovery’ credit tracks actual recorded performance date, not song copyright. Rewards cannot be manufactured from simulated NPC voting. Talent hunts should function with 5–30 human attendees and can be enjoyable without always generating profit.

## 11. Stage Mode — exact V1 performance interaction

**Design goal:** Performer actively expresses personality through a 3D stage; audience actually listens, dances, reacts and discovers songs. The experience works in a 30-person live room, and can later scale by synchronised event instances. For V1, **live singing through an open microphone is not required**; approved recorded audio forms the soundtrack.

### 11.1 Performer actions

Before show, performer enters backstage or taps `Join Stage` from accepted booking. `PREPARE`: select up to three approved released songs from own catalogue that are authorised for that event; choose avatar outfit and 2–4 supported animations; pick approved intro/encore cue and visual effects supported by venue equipment. Venue can present simple/higher-tier lighting choices but cannot artificially amplify chart weight per attendee. Save setlist and rehearse privately at no audience cost.

**At call time:** Host/organiser confirms performer active. Stage Mode transitions `BACKSTAGE → READY → PERFORMING → FINALE → COMPLETED`. Audio begins on all event clients after explicit browser playback unlock; authoritative server event timeline broadcasts playback reference timestamp and track asset ID, clients synchronise to server timeline and resync after re-entry. Performer navigates stage and activates **Intro / Verse / Hook / Finale** gestures and compatible effects. A missed gesture does not stop music or cause a financial loss. Artist can bring an agreed guest onto stage for an assigned slot. Song playback follows defined preview/full-performance licences.

**Audience:** Can move, dance, choose emoji reactions, send limited cheers, view performer info, tap Follow, Save or ‘See next show’, interact with friends and participate in optional quick rhythm/crowd prompts. No audience is forced to play minigames or watch the whole 15-minute event to get a payout. Audience phone UI minimises while stage is active; audio ducking and mute are accessible. **No self-vote multiplier for expensive stage effects.**

**Show formats:** Open mic = one 60–120 s published track; talent hunt = short slots with optional voting; intimate show = 1–3 pieces and social artist Q&A using preapproved text; headline = up to 3 approved tracks plus guest; label showcase = 3–5 invited artists; festival/awards = production template/F larger scale. Repeated shows differ because of lineup, venue, audience, guest, equipment, themes and interpersonal negotiations—not random mandatory “fail” prompts.

### 11.2 Quality, perception and income

Separate: technical readiness (venue/equipment), performer reliability (show started/finished), **human satisfaction** (eligible attendees may rate after verified attendance), genuine engagement (follow/save after event), and organiser profit/loss. No model-generated ‘talent’ prediction decides popularity. Venue rating and production upgrade can visibly improve animations and technical reliability but must never guarantee listeners or sell-outs. Artists can earn a guaranteed booking fee paid by organiser even when show loses money if contract was fulfilled; artists organising their own concert bear organiser obligations.

### 11.3 No-show, disconnect and fairness

If artist absent at pre-show check-in, organiser sees `NOT PRESENT` and may: (a) use a recording/performance sequence **only if artist explicitly pre-authorised it** in booking and it was clearly advertised as prerecorded fallback; (b) invite an approved standby; or (c) postpone/cancel following published refunds. Automatic fallback cannot impersonate live artist participation. If artist disconnects mid-show, preserve audio timeline and frozen/idle avatar with status until reconnection, then allow rejoin; if prolonged, terminate live-performance credit and invoke fallback. If venue/operator offline, agreed city/NPC event staff can execute routine preauthorised setup; no surprise spending.

**Audience disconnect:** Ticket/pass remains valid for event re-entry, verified attendance time reconstructed without creating duplicate attendance; server failure triggers hold on settlement and an event-specific reschedule/refund workflow. NPC audience creates visuals only, never paid sales or chart-worthy human reactions.

## 12. Direct concert booking: own show, guests, finances and losses

An artist may organise their own headline show without starting a venue business. Any player eligible as organiser can rent a venue one-off; see TS-GDD-VEN-001. Unique public venues are city/NPC-owned unless leased to a player operator, and the venue supplier is **city rental office** or the **current player operator**, never both. V1 room booking is exclusive for a 24-hour block; venue cap limits paid tickets; an operator lease covers only its valid prepaid period.

**Artist-organised concert workflow:** Visit venue → inspect availability, cost, equipment and public history → reserve confirmed block (pay from personal or eligible label project budget) → set headliner and optional single guest/co-headliner → invite performer with defined fee/split and deadline → select production package/gear including NPC services → choose ticket price and capacity → appoint promoter if desired → publish event link and share card → sell real tickets → performer rehearsal → host event → reconcile → review actual result, experience, fans and reputation.

**Event finance invariants:** One `organiser_id` is financially responsible. Venue rental is paid once, not twice for an operator-hosted show. Label funding pays only contract-covered eligible expenses. Guest and supplier obligations reserved prior to public ticketing. Owner personal balance cannot be forced negative by an event. **Tickets are purchased by genuine accounts**; NPC visual audience pays zero. Gross ticket revenue is not profit. If show cancelled, apply posted ticket refund/artist guarantee terms and protected commitments before distributing surplus. Artist self-gifts or purchasing own tickets cannot farm chart/rating bonuses.

### 12.1 Worked V1 small-show example — matches VEN-001

**50-seat unleased lounge, full-day hire ₦6,000; illustrative 3% test-ledger ticket fee (not a Vatar fee).**

| Cost | Amount |
| --- | ---: |
| Venue 24-hour booking | ₦6,000 |
| Event support/utilities | ₦1,000 |
| Production | ₦2,000 |
| Hired promoter | ₦3,000 |
| Guest performer | ₦4,000 |
| **Total** | **₦16,000** |
| Ticket price / fee / net ticket | ₦1,000 / 3% / ₦970 |
| Break-even, paid human tickets | **17** (ceiling of ₦16,000 ÷ ₦970) |

Five actual paid tickets → ₦4,850 net revenue, **−₦11,150** loss. Thirty-five tickets → ₦33,950 net revenue, **+₦17,950** surplus. This is artist *organiser profit*, distinct from a guest artist's guaranteed appearance fee. If no hired guest and no ₦4,000 fee, re-quote costs. VAT, external platform charge and real-world fees have not been assumed; in a connected mode use only authorised actual pricing.

**Funding examples:** Indie artist pays personally; label-backed artist has spending authorised directly against finite funded project escrow/ledger, not the label's unrestricted available company money; a third-party gift is not automatically investment; a genuine sponsorship defines benefits and delivery; formal virtual investor profit share only when authorised under a separate contract. Under no circumstance can a **standalone simulation** payout be described as a connected Lagos Life transfer.

## 13. Record label agreements — artist perspective (cross-chapter interface)

**Confirmed business model:** An artist manages their own work; record label provides finite financing for eligible production, promotion and shows and receives an agreed share of eligible virtual project profits. Not mandatory approval of each session. Artists may remain fully independent and never sign a label.

**V1 simple offer:** `label_id`, `artist_id`, start/end time, committed budget, eligible category list, covered project IDs, `artist_profit_pct`, `label_profit_pct` (summing 100), recoup priority, expiry/inactivity response, spending capability, cancellation grounds. Label owner must have available business funds and explicitly reserve them when the artist **accepts**. No paper commitment without funded available virtual project ledger. Artists can view balance/committed/available with no need to calculate accounting.

**Default budget model (D):** Artist can purchase only from preauthorised categories until allocation spent or term ends; direct-vendor payment from restricted project wallet/ledger, no cash withdrawal to artist, no gift spending, no third-party transfer beyond approved contracted services. No new label approval on each eligible transaction. Excess cost receives `Insufficient project budget` and alternatives: reduce expense, request top-up, use personal funds only if contract permits and artist explicitly confirms. Label cannot withdraw funds already reserved for accepted vendor obligations; label cannot unexpectedly freeze compliant artist spending. Contract rules are immutable during term except mutual amendment.

**Settlement default (D):** For a project, eligible gross receipts minus applicable fee and documented third-party direct costs form **net project receipts**. **First**, reimburse documented label-funded eligible direct costs up to available receipts (recoupment). **Then**, split positive remaining net profit according to artist/label percentages. If receipts insufficient, label bears unrecovered investment loss; artist doesn't incur personal debt unless separate clearly accepted permitted obligation. Do not charge artist twice for costs already accounted in recoup. **Only covered project income** participates; pre-contract releases, unrelated jobs, voluntary tips/gifts and non-covered performances remain outside. No rights to actual Spotify/real-world streaming proceeds are implied. A 4-week virtual funding term does not grant lifelong copyright or infinite future revenue.

**Worked example:** Label commits up to ₦2,000,000; project uses ₦200,000 (including costs, excluding any separate platform fee); project generates ₦300,000 **net** eligible receipts after platform fees. Recoup ₦200,000 to label, split ₦100,000: artist ₦60,000 / label ₦40,000 if contract is 60/40. If net receipts only ₦150,000, label recoups ₦150,000 and bears ₦50,000 unrecovered cost; artist keeps their other earnings. This is a prototype rule to be formally ratified in Record Label chapter.

**One label at a time (D V1):** An artist may accept one active funded label agreement, or remain independent. Several label artists may share label owner only if that single company has sufficient *distinct* allocated funds. Artist can continue independent covered/non-covered projects as terms permit; contract comparison shows affected earnings before signing. A label owner going offline never blocks already approved spending. At contract expiry, no new covered spending; committed transactions finish, leftover uncommitted funding returns to label company ledger, earned obligations settle per contract, and artist is free for another deal. If owner abandons the company, contract expiry/inactivity rules remain server-enforced and no spendable funds disappear.

**Important integration caveat:** The Vatar developer documentation known in October 2026 supports game embedding and player identification, but no confirmed general-purpose third-party transfers/company escrow. These project fund flows run in the **standalone simulation ledger** until an officially supported external settlement rail exists. A connected mode may omit unsupported wallet-backed label payouts rather than imitate them.

## 14. Promoters, other artists, managers, investors and fans

**Promoter interaction:** Artist receives/searches campaign offer → review fixed scope, objective (music discovery or concert attendance), price, duration, deliverables and cancellation → accept with authorised funded quote → promoter executes playable campaign opportunities → fan behaviour remains voluntary → report actual human reaches, track listens and event actions, *not guaranteed chart score*. A promoter can arrange a stage opportunity or legal advertising inventory, but cannot purchase guaranteed success. Artist who cannot afford a promoter may pursue free auditions, own sharing and direct relationships.

**Artist-to-artist:** Guest invite, supporting-act opportunity, co-headline booking, producer collaboration and joint track. Guest booking is a defined event contract, not automatic label employment. A collaborative song needs signed-in participant approval and credit; weekly lead/featured release slot rule applies to credited performers. V1 co-headline splits use one organiser with optional one guest and fixed/percentage payout from *authorised* project proceeds; arbitrary N-way touring deals F.

**Investor/supporter:** Wealthy player can sponsor specific show or provide a voluntary transfer. Supporter gifts do not create ownership, booking authority or privileged chart rank. Sponsored event sets agreed brand deliverables. Equity in artist persona or rights to real masters not offered in V1. **Managers and booking agents as distinct careers** are F; artist self-manages during V1, while promoter and label interactions remain well defined.

**Fan interactions:** Every profession can follow a performer and attend concerts; identity and popularity come from eligible humans. A follower may enter artist-run fan chat, save tracks, hear new release notices, see concert cards, optionally transfer funds, attend events or unfollow. Fan cannot create an official listening party without delegated permission. A listener cannot be forced into a ticket purchase by following an artist.

## 15. Artist progression, prestige and ongoing play

**Nonlinear stages (D labels only, no rigid paywall):** Aspiring → New → Emerging → Rising → Established → Star → Icon. Transitions reflected by *achievement evidence*, not level purchased with currency: first approved track, first real follow, first show, local chart entry, city chart entry, repeat paid attendance, significant multi-district success, Destiny nomination/performance/award. A famous artist can freely play a small 30-seat room. A newcomer can be funded for a large concert (with risk warnings) if willing partners exist.

**Long-term playable paths:** Recording artist (catalogue/creative progression), performer (live-stage mastery and repeat crowds), comedy/experimental creator (distinctive social identity), indie entrepreneur (releases/show financing), label-backed career (funded scaling and risk), collaboration-first artist (guest bookings), social entertainer (fan community). These are emergent play styles, not mutually exclusive class selections.

**Career history:** Store immutable references to actual concerts, chart snapshots, collaborations, signed/expired contracts, awards nominations, and authored music where policy permits. Album discography/large tours are future. A small venue that hosted an early performance can receive *historical discovery credit*, not copyright. The artist's private room displays sleeve artwork, posters, awards and milestone plaques; no house purchase required. After bankruptcy or company sale, artist persona, owned media rights, eligible history and active followers remain subject to platform policies.

**Destiny Awards (C):** Original virtual ceremony about **every 12 weeks (4 times annually)**, covering all professions. High-tier qualified venues can host. Official stage invitation, nomination and award are prestige achievements with permanent season history; they are not guaranteed by wealth, number of uploaded songs or buying a venue. Artist performance selection must follow published criteria reviewed in a separate Awards spec. Larger user-organised festivals can exist alongside official ceremony. Real-world hybrid events are **F**.

**Daily variety:** Artist can record/revise, submit next Friday song, visit studio, scout/perform at open mic, rehearse, accept guest appearance, view/plan concert, discuss collaborations, respond to label/promoter offers, chat with fans, explore city, attend other people's shows, and work simple NPC jobs when cash-poor. Experienced players save performance presets and release metadata, so high-level gameplay involves decisions, creative relationships and risk rather than repeating beginner puzzles.

## 16. Artist finances, work, failure, inactivity and recovery

**Income sources:** Agreed appearance fees, genuine self-organised show profit, virtual covered-project shares, authorised client music services where eligible, free/starter-job rewards from a capped test treasury, and voluntary gifts/transfers. **Not** automatic cash minted per play or per fan; real Spotify or off-platform music revenue never flows into game balances without explicit future integration. A fan's listening and saving benefits culture/chart/discovery; commercial conversion happens when humans choose to transact.

**Expenses:** Optional producer/session bookings, event rentals, guest fees, promoter campaigns, sound/stage rentals, artwork services, production and optional cosmetics. **Maintaining an artist profile has no unavoidable daily rent**, and low-balance players are not locked out of public free activities. When acting as organiser, artist sees detailed net ticket forecasts and can lose their authorised budget. When acting as a booked performer, the organiser usually bears event profit/loss and owes agreed appearance guarantee after contractual fulfilment.

**No negative personal balances:** Server verifies funding before commitment. Pending holds reduce `available` but not `book_balance` until settlement; release/reversal tied to immutable transaction IDs. Empty wallet → alternative job, free public studio, free social show; do not auto-debit real money. If personal company bankrupt, artist identity survives. If label account bankrupt, already funded/escrowed artist commitments receive priority per contract; do not silently drain artist's own wallet.

**Artist inactivity:** Scheduled song approved Friday still releases on date even if user offline, unless withdrawn/taken down. Fan notifications deliver to inbox. Existing published songs remain streamable if authorised. Live booking: preauthorised recorded fallback, no-show/standby or cancellation; never describe prerecorded avatar as human currently playing. If owner account is permanently suspended, media follows moderation/legal retention policy and financial commitments resolve under published terms.

**Prevent idle economy exploits:** No automatic chart points for absent users, no passive paid attendance from NPCs, no guaranteed engagement buy, no infinite starter-job money farm, no self-reward through duplicate accounts, no event-owner laundering through self-buy tickets. Graduated warnings and appeals when anti-fraud restrictions apply.

## 17. Client/server interaction catalogue (V1)

Each interaction below defines the minimal full contract: trigger → player action → required system effect → failure path → metrics. A later engineering specification must still choose exact endpoints and database types; *the behavioural states here are binding prototype defaults*.

| ID | Entry / action | System and other-player effect | Failure and reporting |
| --- | --- | --- | --- |
| INT-A01 | Avatar taps ‘Make music’ | Nav waypoint to Studio; preserve current account/state | Load failure returns Square; log `studio_discovered` |
| INT-A02 | Producer desk → choose loops | Client previews, server saves versioned arrangement | Unsupported loop rejected; `beat_draft_saved` |
| INT-A03 | Vocal booth → Record | Permission / take preview / stored draft | Denied mic ⇒ vocal upload; `vocal_take_saved` |
| INT-A04 | Studio → Finish master | Render job, playback preview, unique master hash | Failure retries idempotently; `master_rendered` |
| INT-A05 | Release House → Import | Validate file, rights/metadata draft | Retry upload resumes; `song_imported` |
| INT-A06 | Artwork Frame → Install | Save art and show in 3D | Bad aspect/size ⇒ crop/retry; `artwork_added` |
| INT-A07 | Rights Console → confirm | Store rights declaration and contributor approvals | Disagreement blocks release; `rights_confirmed` |
| INT-A08 | Release Machine → submit | Server validates weekly slot/deadline, creates review job | Late ⇒ next Friday; `release_submitted` |
| INT-A09 | Moderation approves / rejects | Schedules or needs-fix, visible notice | Appeals and conflict log; `release_reviewed` |
| INT-A10 | Friday publish | Make one approved recording public; emit notice | Atomic batch/partial retry; `release_published` |
| INT-A11 | Listener presses Play | Start audio after user gesture; count qualified play after validation | Silent/preload not counted; `qualified_listen` |
| INT-A12 | Listener Save / Follow | Unique saved song and artist follow | Dedupe, privacy; `song_saved`, `artist_followed` |
| INT-A13 | Artist opens fan chat | Moderated messages to authorised fan group | Block/mute/report; `artist_community_posted` |
| INT-A14 | Artist applies to audition | Private preview shared to selected organiser, application record | Expiry/rejection; `audition_applied` |
| INT-A15 | Organiser accepts artist | Invite/slot hold with deadline; artist confirms | Conflict/timeout; `performance_booking_confirmed` |
| INT-A16 | Artist enters backstage | Ready confirmation and setlist auth | No-show policy; `performer_checked_in` |
| INT-A17 | Artist triggers stage cue | Server validates authorised stage effect and sends to event instance | Lost packets resync; `stage_cue_used` |
| INT-A18 | Human fan attends show | Unique ticket/check-in and optional audience reaction | NPC excluded; `live_attendance_verified` |
| INT-A19 | Artist rents venue | Same 24-hour exclusive venue booking contract as VEN-001 | Double-book blocked; `venue_booking_confirmed` |
| INT-A20 | Artist hires promoter | Authorised payment hold and campaign record | No delivery ⇒ cancellation policy; `campaign_contract_accepted` |
| INT-A21 | Artist signs funded label deal | Restricted finite project allocation and rights disclosure | No funded reserve ⇒ no active deal; `label_contract_accepted` |
| INT-A22 | Artist spends label project funds | Check budget/categorical eligibility, vendor paid by project | Over cap blocked; `label_budget_spent` |
| INT-A23 | Concert settlement | Allocate receipts, costs, project recoup/share, refunds | Outage pause/reconcile; `event_settled` |
| INT-A24 | Artist creates share card | Export real release/chart/show milestone URL | Private draft not public; `milestone_shared` |
| INT-A25 | Artist withdraws/takedown song | Remove public audio/active setlists and recalc if needed | Preserve audit/appeal; `song_removed` |

### 17.1 Contract state vocabulary

- **Producer booking:** `DRAFT_OFFER → COUNTERED → ACCEPTED_FUNDED → SCHEDULED → IN_PROGRESS → DELIVERED → ACCEPTED/REVISION_REQUESTED → SETTLED`, plus `EXPIRED/CANCELLED/DISPUTED`.
- **Audition:** `OPEN → APPLIED → SHORTLISTED/DECLINED → INVITED → CONFIRMED → PERFORMED/NO_SHOW → CLOSED`.
- **Performance booking:** `OFFERED → ACCEPTED + FUNDED/RESERVED → REHEARSAL_READY → CHECKED_IN → PERFORMED → SETTLED`, with cancellations and no-show branches.
- **Concert:** `DRAFT → VENUE_CONFIRMED → COSTS_FUNDED → PUBLISHED → TICKETING → READY → LIVE → ENDED → RECONCILING → SETTLED → ARCHIVED`, with `POSTPONED/CANCELLED/OUTAGE_REVIEW` branches.
- **Label-funded project:** `OFFERED → ACCEPTED_RESERVED → ACTIVE → EXPIRED/TERMINATED → RECONCILING → SETTLED`, separate from live-song rights.

**Server authoritative:** All prices, bookings, slots, charts, fund reservations, verified attendance, settlement, copyright holds and Friday clocks are calculated/accepted server-side. The client may animate states but never independently credits cash, fans, chart points or ownership. Every financial command uses idempotency key, source/provider, payer/recipient or sink, actor/authorisation and logical contract/event ID.

## 18. Required data entities (implementation-agnostic contract)

| Entity | Required fields |
| --- | --- |
| `player` | player_id, origin (`standalone`/`vatar`), provider_link_id nullable, age/eligibility status, home_district, wallet_provider_mode |
| `artist_persona` | artist_id, owner_player_id, stage, public_name, genres, biography, verification_state, created_at, status |
| `song_project` | project_id, artist_owner_id, source_type, beat_assets, audio_takes, revision, privacy, collaborators, created_at |
| `audio_asset` | asset_id, file hash, owner/ref, category, MIME, length, storage pointer, clearance status, licence refs, status |
| `release` | release_id, artist_id, master_asset_id, title, art_asset_id, primary/guest artist ids, producer credits, rights record, scheduled_at, state, idempotency_ref |
| `contributor_consent` | release_id, contributor_id, role, requested_permissions, accepted_at, revoked_flag, version |
| `qualified_listen` | playback_id, listener_player_id pseudonym/ref, release_id, source, duration, qualified_at, fraud_state, district_context |
| `song_engagement_week` | release_id, week_id, listener_id ref, first_qualified_at, replay_bonus_count, saved, attended_event, score, attribution_district |
| `artist_follow` | artist_id, follower_id, created_at, notifications_mode, blocked_state |
| `artist_community` | group_id, artist_id, member_ids, moderator_roles, content/moderation refs |
| `audition_application` | application_id, event_slot_id, artist_id, preview_permissions, state, deadline, submitted_at |
| `performance_booking` | booking_id, artist_id, event_id, slot_time, approved_setlist, fallback_permission, promised_fee, terms, state |
| `artist_label_agreement` | agreement_id, artist_id, label_company_id, term, funded_reserve_ref, budget, category_policy, covered_project_ids, split, recoup, status |
| `artist_project_ledger` | project_id, agreement_id nullable, funded_amount, reserved, paid, recovered, available, event_refs, provider_mode |
| `stage_session` | event_id, performer_id, active_track, global_playback_epoch, local_instance_ids, status, cue_log |
| `artist_career_event` | event_id, artist_id, type, ref_id, timestamp, validity, public_summary, historical_snapshot |
| `artist_notification` | notification_id, artist/follower targets, type, event_ref, dedupe_key, read/expiry status |

**Privacy/security:** Private demos, unapproved audio, financial ledgers, raw microphone recordings, contact details and moderation notes are permission-gated. Public information includes approved released music, opted-in profile details and authentic non-sensitive achievements. Don't log raw audio or sensitive messages into analytics. Retention and deletion policies follow legal/contractual obligations and moderation appeal windows.

## 19. Eight critical economy and content invariants

1. One eligible release appearance per artist per Friday; one producer can credit many songs without consuming those artist slots.
2. Nothing public or chart-bearing before official Friday publication, except approved small private audition previews excluded from discovery.
3. The master must exist, be processable, and have valid rights/consents before public release.
4. A producer's beat being ‘sold’ does not imply exclusive copyright transfer unless a compliant separate licence says so.
5. An artist may fund an eligible event from personal funds or exactly one authorised covered-label-project ledger, not both silently; mixed funding needs explicit line items.
6. NPC fans, self-play farms, fake tickets, unauthorised autoplay and arbitrary marketing spend do not mint chart points or spendable wallet cash.
7. Every paid booking has exactly one responsible organiser, one venue supplier, reserved known obligations and an auditable end state.
8. Connected Lagos Life wallet and avatars are never imitated when their API operation is missing; standalone balances are labelled separate simulation value, with no assumed convertibility.

## 20. Detailed failure and abuse catalogue

| Scenario | V1 required outcome |
| --- | --- |
| No money and no music | Free starter loops, public jobs and entertainment available; no mandatory subscription to create. |
| No mic permission or embedded iframe forbids it | Use imported vocal file or instrumental-only composition; no blocked career. |
| Recording interrupted | Preserve previous completed take; notify if active take incomplete; retry. |
| Browser upload stops | Resume/retry same upload session; never create duplicate public release. |
| Audio cannot decode | Reject with format instruction; keep private draft and metadata. |
| Song 20 seconds long | Below D minimum; remains draft until longer. |
| Song >6 minutes | Must edit or schedule in future format; no silent truncation. |
| One person spams endless beat renders | Rate limits and draft/storage caps; free creation still possible within cap. |
| User claims an unlicensed commercial instrumental | Rights hold/review; no automatic publication just from checkbox. |
| Reused sample from incompatible loop pack | Block or warn until verified rights/technical compatibility. |
| Two collaborators edit same project | Optimistic version guard; no silent overwrites; sync conflict UI. |
| Collaborator refuses credit/use approval | Release blocked for that master; produce new permitted version or resolve dispute. |
| Producer's project delivered but artist contests quality | Contract deliverable and limited revision/dispute flow; not discretionary automatic theft of funds. |
| Artist uploads recording under someone else's name | Impersonation hold and identity review. |
| Artist uploads same recording to two personas | Fingerprint/conflict flag, human review; avoid blanket ban on authorised remasters. |
| Rights complaint after release | Quarantine playback and impacted events; notify, preserve evidence, review/appeal. |
| Rights retracted before already sold show | Organiser warned; replace track with approved alternative or refund/reschedule. |
| Artist attempts second Friday song | Server rejects second official slot or allows future Friday draft. |
| Friday slot occupied by featured appearance | Submission offers next Friday or collaboration change before lock. |
| Submission after Wednesday deadline | Move to next Friday and show exact WAT timestamp. |
| Rights review unresolved on Thursday | No publish; reschedule pending artist confirmation. |
| Artist re-edits master after approval | Re-enter review; schedule may shift; fans see updated card state. |
| Server retry runs Friday publish twice | Idempotency ensures one release, one set of notifications. |
| Listener plays song in silent/background tab | Qualified listening conditions fail; don't inflate chart. |
| Real listener replays >two times | Valid ordinary play count may rise; chart bonus capped per human/week. |
| User switches districts to chart farm | 28-day stable home district lock; dedupe across districts. |
| Concert audio plays to disconnected client | No eligible attended-song bonus without verified check-in and audible time. |
| Large VIP artist buys own tickets to farm reputation | Linked account/self-dealing excluded from eligible rankings; tickets still obey financial rules. |
| Fan blocks artist | Follower messages stop; legitimate historical metrics not fabricated/deleted. |
| Fan group gets spammed | Slow mode, mute/report, moderator action; artist cannot mass-harass followers. |
| Artist is invited to two overlapping shows | Cannot accept incompatible confirmed slots without canceling original. |
| Artist misses audition acceptance deadline | Offer expires; organiser selects backup; no hidden fee. |
| Artist fails to appear at concert | Explicit fallback recorded performance or published cancel/refund; no fake 'live' performer. |
| Pre-authorised avatar stage playback during no-show | Mark as prerecorded and do not award live performer-interaction credit. |
| Performer disconnects mid-show | Audio timeline persists; show reconnect status; fallback after timeout. |
| Venue owner offline at show start | Preauthorised NPC staff run routine show; no new unsanctioned spending. |
| Organiser bankrupt after advance ticket sales | Protected ticket funds and confirmed performance obligations reconciled before closure. |
| Artist rents venue from leased operator | Single authoritative calendar/contract, no second city invoice. |
| Label budget depleted during producer offer | Reject vendor commit before payment; do not access unrelated funds. |
| Label owner offline for three weeks | Artist continues within active committed term; funds return after term and reconciliations. |
| Contract expires while production delivery is pending | Existing accepted contract settles; no new label-funded job after expiry. |
| Fan sends money with message 'investing in song' | Treat as transfer/gift only unless separately valid investment contract was executed. |
| Album/playlists or unreleased demos count on charts | Reject; only published single release IDs qualify. |
| Game's own economy has too few real ticket buyers | Keep open mics/free events playable, reduce supply, use NPC visuals but not fabricated sales. |
| Standalone account links Lagos Life account | Identity linking explicit; no assumed standalone → Vatar currency migration. |
| Connected wallet transfer API missing | Connected paid artist transactions disabled or separately available only in standalone test ledger; don't emulate provider money. |
| Real-world musician wants to delete their data | Account/music retention and takedown process, preserving only permissible audit/financial history. |

## 21. Artist metrics and playtest gates

### 21.1 Product metrics

**First-session:** time to see Studio, percentage choosing creation vs import, time to first saved beat, first completed vocal/asset, percentage completing first release draft, first successful private audition, crash and permission denial rate.

**Music discovery:** unique eligible listeners, saves per 100 qualified listens, real followers after release, repeat listeners, screenshot/share-to-arrival conversion, local chart inclusiveness, percentage of releases receiving at least one human qualified listen within 7 days.

**Live career:** first application→confirmation funnel, average number of opportunities per newcomer, percentage of confirmed shows actually attended by performer, unique attendees per live event, follow/save after events, appearance revenue vs organiser losses, genre/district diversity.

**Economic fairness:** median time zero-balance artist can afford their first optional paid service; funded vs independent career performance *controlling for exposure*; percentage of label projects with revenue and recoup; transfer/gift abnormal patterns; no unbacked net-positive wallet payouts.

**Long-term retention:** day 1/7/30 cohorts for real musicians vs DIY creators vs label-backed users, share of performers who return after first failed show, social interactions before second release, repeat participation of fans who are not active musicians, degree to which career paths diverge after first week.

### 21.2 Prototype acceptance gates (D, to validate)

| Test | Acceptance expectation |
| --- | --- |
| Onboarding | New player can walk into free Studio and hear/play first loop without a tutorial >90 seconds. |
| Starter music | No music knowledge player creates a >30s playable draft in <=8 minutes median under observation. |
| Import | Actual musician can prepare audio/art/release draft without having to use beatmaker. |
| Permissions | Denied microphone still permits instrumental-only or voice file alternative. |
| Rights | No public song appears without completed rights record and all necessary collaborator approvals. |
| Friday | Only one eligible artist appearance per Friday; scheduled songs appear on server time exactly once. |
| Off-calendar | Audition demo never accrues public chart activity. |
| Chart | Unlimited repeat loop does not create unlimited score; one human song/week chart max = 100 under D weighting. |
| Artist fairness | Two identical listeners provide same maximum score to wealthy and poor artists. |
| Fan | Human follow triggers appropriate optional notice; NPC never increases human follow count. |
| Booking | An artist can successfully apply to one open mic and another human organiser receives the application. |
| Live | Two avatars can experience the same staged song, perform/react, follow and return after reconnect. |
| Venue integration | Artist direct rental uses VEN-001's 24-hour venue reservation and ledger; never double-book or double-charge. |
| Label funding | Accepted project budget cannot overdraw label company; artist can spend within terms while owner offline. |
| Finances | Ticket income minus 3% hypothetical test fee and agreed costs reconciles, no fabricated NPC revenue. |
| Failure | Artist with failed show/zero wallet can still create, enter free show, attend and take legitimate starter work. |
| Identity | Third-party uploaded master can be held on complaint without deleting unrelated career history. |
| Standalone | World and artist loops run without SDK, Vatar identity or live wallet connection. |
| Embedded | Game renders and basic audio/discovery work in a 375×812 portrait layout, with voice recording fallback. |

No table above implies these gates have **already passed**. They define the tests a prototype must pass. The first multiplayer test should involve 6–12 humans and 0, 5, 20, then 40 live attendees, with NPC visuals varied independently. Test user sessions in poor mobile networks, tab backgrounding and device re-entry.

## 22. V1 scope, exclusions, dependency isolation and production order

### 22.1 V1 includes

1. One distinctive small 3D district and own-domain persistent multiplayer avatar presence, world interactions and utility phone.
2. Public/free artist onboarding, artist profile, avatar room/shelves and music catalogue.
3. Upload finished real music with rights declaration, moderation, artwork and artist credits.
4. Cheap/free compatible-loop beat workstation, instrumental export, optional vocal capture or upload, project save/revision.
5. Physical studio, booth, cover wall, listening desk, release machine and advanced shortcuts.
6. Wednesday submission deadline, Friday batches, one official artist appearance/week, rights preflight and clear moderation states.
7. Public Release Hall, audible opt-in player, saves, follows, fan community, weekly district and Lagos charts.
8. Human audition applications, open mics, talent hunts and simple artist booking deals.
9. 3D Stage Mode and small concert with actual recorded audio, reactions, stage animations and simple guests.
10. Artist-funded one-off venue rental, promoter offer and finite label-funded artist project flow (standalone ledger until APIs permit real integration).
11. Independent/wealthy/label-backed career paths, legitimate earnings/losses and recovery.
12. Server-authoritative metrics, anti-spam, notices, rights/takedown, refunds/inactivity and manual operator tools.

### 22.2 Outside V1, preserved

Advanced AI song generation via Suno or another model; mandatory payment for music creation; full DAW, sample marketplace with exclusive copyright; album release, unlimited features, highly complex co-writing royalties; compulsory live microphones at concerts; agent/manager profession; player-run banks/loans; multi-company player ownership; unrestricted city construction; concert NFT/gambling mechanics; deep touring across multiple cities; real-money artist royalties derived from game plays; direct conversion of external streams to chart points; hybrid physical events; guaranteed Vatar transfers/3D avatar import.

### 22.3 Build order to minimise waste

**Slice 0 — Audio:** Standalone compatible loop beat preview + imported track + local saved draft; verify phones decode and play reliably. **Slice 1 — Spatial:** Enter 3D Studio, physical desks/booth/art wall with actionable station panels and phone shortcuts. **Slice 2 — Social:** Two players cooperate on beat/proposal; one submits a rights-cleared release; another listens/follows. **Slice 3 — Calendar:** Wednesday→Friday review, batch premiere, week chart update with anti-loop cap. **Slice 4 — Live:** Artist booked in VEN-001 small venue, approved song playback, audience interaction and fan conversion. **Slice 5 — Money:** Real human ticketing and basic singer/organiser contracts on internal test ledger, funded from authorised sources. **Slice 6 — Scaling:** Label budget, promoter campaign, moderate real traffic; include Vatar provider adapter only for documented operations.

**Integration rails:** Use separate account/identity, avatar visual, wallet and event-auth adapters. The official developer SDK may allow embedding, sign-in and limited platform facilities; until external wallet payout, business escrow or 3D avatar import operations are actually documented, do not represent them as shipped functionality. A real-money product purchase is not equivalent to transfer of game naira to a promoter or venue.

**Music-cost guardrail:** Optional AI generation must be behind explicit commercial review (API cost, input/output rights, moderation, opt-in, rate limits, provider outages) and cannot be the sole V1 producer tool. Browser Web Audio/Tone.js supports basic synchronisation; MediaRecorder/getUserMedia on HTTPS needs permission and embedded iframe capabilities; support file alternatives and bounded server-side render cost.

## 23. Decisions resolved in this chapter vs future chapters

| Question previously open | Resolution / next owner | Status |
| --- | --- | --- |
| How can a zero-money artist begin? | Free starter loop tools + legitimate capped jobs + free auditions/social play. | D |
| Can an amateur make a ‘wack’ song? | Yes if eligible playable original music and platform-safe; no taste screening. | C |
| How does producer beat + artist voice merge? | Versioned loop project, selected take, gain/offset effects, render queue. | D |
| Is Suno API required? | No; opt-in future if terms/costs permit. | D/X |
| How do uploads feel physical? | Release House objects with structured panel and phone repeat shortcut. | C/D |
| When do songs release? | One artist appearance per Friday; Wednesday 18:00 WAT submit; Friday 19:00 premiere. | C/D |
| How to stop demo leakage? | Private audition link, 30s limit, no public chart/personal soundtrack. | D |
| Do replays count? | Yes, capped chart bonus, full raw play metrics separately. | C/D |
| Can pre-existing songs chart? | Yes, same eligible human scoring as DIY tracks. | C |
| Can artist work when label offline? | Yes within finite funded allocation; no per-purchase approval. | C/D |
| Does fan attendance buy fame? | Authentic saves/follows/qualified listens; equipment and spend don't buy chart points. | C/D |
| Can artist headline and invite guest? | Yes with VEN-001 one-off rental and one organiser controlling cash. | C/D |
| What if producer/performer disconnects? | Saved project state, contracted timeout, authorised prerecorded show fallback or refund. | D |
| What about explicit royalties/IP? | In-game budget contract only; recording rights separately licensed/cleared. | D/X |
| What exact prices and balance gates apply? | VEN-001 baseline rent ₦6k for 50 seat, 3% hypothetical fee, 17-seat break-even sample. | D (calibrate) |
| How does official fame culminate? | Destiny Awards quarterly prestige; charts/venue outcomes and live show proof. | C/D |

**Linked next chapter recommended:** **Record Label Business** (rather than promoter first) because funded project ledgers, signing rules, recoupment, roster capacity, expiry and label insolvency are now critical dependencies of the artist experience. Once label financing is stable, design **Promoter / Event Organiser**, which will explain how budgets translate into music discovery without manipulative chart purchasing. The roles remain coupled; do not freeze label contract APIs until shared economy adapter interfaces are reconciled.

## 24. Research, provenance and no-ambiguity limits

**Provenance:** This chapter synthesises the entire discussion and the three supplied project documents (H-Path, seven-day simulation, Venue Operator Foundation); it prioritises the founder's latest artist directives and preserves older cross-role requirements that are still compatible. Its technical defaults are explicit so an AI coding agent can implement a **prototype**, but no document can eliminate unknown external APIs, music licences, untested player behaviour or unapproved final balancing numbers.

**External supporting references:**

1. Tone.js project, Web Audio framework and transport: https://github.com/Tonejs/Tone.js — time-based sample scheduling; requires user gesture for browser audio.
2. Tone.js offline rendering: https://tonejs.github.io/docs/15.0.4/functions/Offline.html — browser-context offline buffer render for compatible flows.
3. MDN, Autoplay guide: https://developer.mozilla.org/en-US/docs/Web/Media/Guides/Autoplay — audible playback often restricted absent deliberate gesture.
4. MDN, `getUserMedia`: https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia — HTTPS, explicit permissions and iframe restrictions.
5. Suno official developer sign-in: https://platform.suno.com/ — public portal advertises an API, but pricing and contractual integration rights require signed-in diligence.
6. Vatar developer portal: https://lagoslife.app/developers — integration is a separate provider; exact wallet/3D avatar operations must be verified against official developer documentation and SDK.
7. Internal THE SCENE design references: TS-GDD-VEN-001 v0.3, H-Path v0.1 and Stage 2 v0.2 (October 2026).

---

**End of chapter: TS-GDD-ART-002 v0.4.** This is the artist-career design baseline, not yet a claim of production readiness. Final game economy prices, external licences, hardware benchmarks and provider wallet operations must be validated during implementation and playtesting.
