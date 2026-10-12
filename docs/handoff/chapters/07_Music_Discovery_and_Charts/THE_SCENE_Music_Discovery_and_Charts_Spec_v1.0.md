# THE SCENE
## Chapter 7 — Music Discovery & Charts: Standalone V1 Game Design and System Specification

**Version:** 1.0  
**Date:** 12 October 2026  
**Document owner:** THE SCENE game design  
**Status:** Founder-aligned working implementation baseline; chart weights, integrity thresholds and service parameters are explicit **design defaults requiring playtests**, not claimed founder-approved constants  
**Scope:** Music discovery, physical listening, catalogue and release eligibility, chart mathematics, district attribution, rankings, paid/organic exposure, genuine listener measurement, anti-abuse, privacy, observability and cross-career gameplay  
**Previous chapters:** H-Path Architecture v0.2; Venue Operator v0.3; Artist v0.4; Record Label v1.0; Promoter v1.0; Fan & Social v1.0; Concerts & Shared Events v1.0  
**Next chapters:** Economy & Contracts; World, NPCs & Operations; integrated master game design and technical implementation plan

> **The design objective:** A person in THE SCENE hears a real submitted or player-created recording, decides whether they enjoy it and can follow the artist into a persistent music career. The city changes when players release and recommend music. Charts report authentic activity, never purchases of popularity. The system must remain enjoyable with 20 concurrent people and trustworthy as the population grows.

## Reading guide and rule precedence

- **[C] Confirmed direction:** An explicit founder decision or settled requirement already shared across chapters. An amendment requires a tracked design revision.
- **[D] V1 design baseline:** Concrete default selected in this chapter to settle ambiguity and enable engineering. It is configurable and must be load-tested or playtested; do not misrepresent it as personally signed off by the founder.
- **[X] External:** Needs permission, licensing, moderation/legal assessment, platform SDK entitlement, browser capability, or security verification before production.
- **[F] Deferred:** Not needed for first-playable V1.
- **Precedence:** The founder's newer explicit choices supersede earlier assistant proposals. Artist v0.4 remains authoritative for publishing eligibility and Friday timing; Fan v1.0 for social privacy/audio; Events v1.0 for live session truth and attendance; Promoter v1.0 for paid placements and attribution; Label v1.0 for financing and recoupment; this chapter owns **qualified music-play evidence, discovery ranking and charts**. Economy v1 will own monetary settlement. Never let two services issue competing chart scores.
- **Currency:** Every ₦ amount in related documents describes THE SCENE's standalone **simulated Game ₦**, not real NGN; money cannot automatically move to or from Lagos Life. Music listening does not mint Game ₦.

---

# 1. Non-negotiable principles and decision register

| ID | Rule | Status |
| --- | --- | --- |
| MUS-01 | The heart of THE SCENE is discovery and promotion of real human-submitted or player-created playable music, in a living 3D social city. | [C] |
| MUS-02 | Players can upload existing recordings or create intentionally amateur, comedic, experimental or polished recordings using the free loop-based studio. Artistic quality alone cannot bar release. | [C] |
| MUS-03 | One official artist release appearance per weekly Friday batch; participating featured/co-primary artist performers consume their weekly slot, producer-only credits do not. | [C/D per Artist] |
| MUS-04 | Existing catalogue remains eligible to compete in future weekly charts if listeners continue engaging. | [C] |
| MUS-05 | Followers, ticket sales, chart success and genuine listeners come from human accounts, not scenery NPCs, purchased boosts or fabricated behaviour. | [C] |
| MUS-06 | Replays can matter but cannot be farmed without limit. Song saves contribute only where tied to genuine eligible listening. | [C/D] |
| MUS-07 | Users can make a released song their private in-world soundtrack. Shared venue/stage music is controlled by the authorised room or event, never by all nearby personal players. | [C] |
| MUS-08 | District and Lagos-wide charts are based on **in-game** eligible listening, never on imported Spotify/TikTok numbers, real-world fame or advertising spend. | [C] |
| MUS-09 | Promoters sell legitimate opportunities for discovery, not guaranteed plays, followers, paid chart positions or award outcomes. | [C] |
| MUS-10 | Weekly new music is published Friday 19:00 WAT; prior cycle charts reveal Friday 18:30 WAT; scoring cycles Friday 18:00–next Friday 17:59:59 WAT. | [D from Artist v0.4] |
| MUS-11 | The world uses physical-first listening stations, an interactive Release Hall, venue sound systems and social discovery with compact phone/accessible shortcuts. | [C/D] |
| MUS-12 | New artists receive credible unsponsored discovery opportunities; better-funded artists may buy exposure only, never response or ranking. | [C/D] |
| MUS-13 | Charts use a server-authoritative, versioned, reproducible score with explicit fraud holds and truthful incomplete-result labelling. | [D] |
| MUS-14 | There is no automatic Game ₦ award per playback or for making a chart; eligible financial returns are handled by distinct events and contracts. | [C] |
| MUS-15 | No one is forced to follow or save, and a fan who only listens and socialises still has a complete game experience. | [C] |
| MUS-16 | Chart eligibility is independent of using a real recording, a DIY loop track, paid studio effects, a producer, artist verification, premium venue or label financing. | [C/D] |
| MUS-17 | Playback authorisation/rights withdrawal override all other discovery, preview, venue and soundtrack actions immediately on authoritative state change. | [C/D/X] |

# 2. What discovery feels like to an actual player

The discovery loop is **WALK → NOTICE → HEAR → CHOOSE → REMEMBER → SHARE → SEE CONSEQUENCES**. Discovery should not feel like opening a spreadsheet or paying a promotional fee. A player can encounter a release cover displayed on the wall, hear an unfamiliar song in a venue, accept a recommendation from a friend, walk to a chart screen or browse a phone collection. The same canonical track can be saved from every surface, without inconsistent counts or links.

**The first five minutes:** A player arrives in Music Square with no money, taps Enable Sound, approaches an illuminated “New This Friday” record wall and selects one cover. The recording plays privately. The listener can walk away while keeping it as their soundtrack, save it, inspect the musician, invite a friend, or ignore it. Nothing forces a follow or purchase. If another friend is enjoying a nearby lounge's shared song, joining and opting into that shared audio gives them a social experience without layering two tracks.

**A 20-minute session:** Browse a handful of new releases, save one, visit its artist's upcoming-show poster, join friends at a public venue, dance during a live set, open the artist profile and follow if the music resonates. A promoter may have placed a poster there, but that supplies only the chance to encounter the artist.

**A 60-minute session:** Attend Release Friday, compare new sounds with friends, participate in an official artist listening session, see emerging artists at an open mic and visit the chart reveal. Their actions can shape future discovery based on verifiable individual choices. Users should not be required to complete tasks to earn music access.

**Core outcomes by role:** Fans have discovery and memory; artists have authentic reach and feedback; labels gain A&R intelligence; promoters see honest attributed interest; venues attract relevant programming and audience; freelance producers gain properly credited exposure. The same qualifying play is **one** playback event, not five multiplied readings because five industries benefit.

# 3. Catalogue object model: what the game actually plays

Define four distinct objects. They are not interchangeable.

| Object | Meaning | Can be public/charted? |
| --- | --- | --- |
| `AudioAsset` | Stored/rendered audio master and controlled derivatives; file hash, codec, duration, rights flags | Never independently |
| `SongWork` | Human-facing title, art, performer/producer/composition credits, creator rights attestations and stable `song_id` | Only through official public release |
| `Release` | Scheduled/published release of a specific approved `SongWork` master/version, with Friday timestamp | Yes after `PUBLISHED` |
| `PlaybackSession` | A player's explicit listening experience from phone, world object, event or room | May create qualified evidence only when all checks pass |

A released `SongWork` receives an immutable canonical `song_id` and one official `release_id`. All surfaces (chart, live show, soundtrack, poster, playlist and label profile) must reference that ID. A new mix of the same song is a controlled revision; an unrelated song may be a new work. The system must not duplicate a popular track simply because it was featured on another artist's shelf or the event organiser uploaded another copy.

**Content provenance:** `UPLOADED_MASTER`, `STUDIO_CREATED` or `COLLABORATIVE` describes how it was supplied. This classification is visible only when appropriate and has **zero ranking weight**. An original instrumental can be public; studio-made songs need valid audio (Artist v0.4 baseline: 30 seconds to 6 minutes), deliberate arrangement and all contributor permissions. A poor singer is still eligible. Staff do not rate musical talent to determine chart status.

**Rights surface:** Store master permission, composition/lyrics permission, approved loops/samples, artwork, contribution approval, allowable event and shared-room uses, licence expiration/territory and restrictions. A cover, remix or sample-derived upload cannot rely on a single checkbox where enhanced permissions are necessary. The platform's lawful ability to stream user content must be established separately [X]. A private draft or audition preview does not create general-public availability.

**Version change after publication:** New audio master or material performer credit must be reviewed as a revision. Preserve `song_id` only for a minor correction legitimately referencing the same work; do not overwrite historical chart snapshots or let an artist replace a hit with an unrelated file while inheriting its past rank. A materially new song needs its own Friday release and weekly artist appearance rules. Metadata typo correction may be made under moderated history with no score reset; rights removal can disable all versions immediately.

# 4. Release Friday: canonical clock, slots and embargo

| Milestone | Time in Africa/Lagos | Authoritative behaviour |
| --- | --- | --- |
| Normal intake deadline | Wednesday 18:00 | Complete asset, artwork, credit and contributor permissions submitted; incomplete goes to next open Friday |
| Final moderation/scheduling checkpoint | Thursday 18:00 | Anything still unresolved rolls over and notifies all affected collaborators |
| Chart window ends | Friday 18:00 | Freeze previous week's qualified event horizon at 17:59:59.999 |
| Previous week's chart reveal | Friday 18:30 | Publish final or explicitly provisional snapshot as integrity rules permit |
| New release batch | Friday 19:00 | Atomic publication of valid scheduled works; Release Hall refreshes and premieres begin |

These times are **design defaults inherited from the Artist chapter**. WAT is UTC+01 and Nigeria does not switch to daylight saving; server UTC instants remain canonical. A mobile clock setting cannot release early. The interval between 18:00 and 19:00 is not discarded: plays of already released songs count toward the **new** chart week. Songs first published at 19:00 start counting only from publication. A cancelled or held work cannot generate public chart events through saved private previews.

**One artist slot:** On an official Friday release, every credited lead, co-lead and featured performer consumes that Friday's artist slot. Producer-only credits do not. Do not permit featured-collaboration chains or last-minute aliases to bypass limits. All performers required for an eligible release must give timely consent; conflicts return to submission review or a later Friday. Unreleased clips sent privately to an audition or authorised press contact are not searchable public chart media.

**Publishing atomicity:** A release batch may process asynchronously, but each work transitions to public exactly once after all checks. ReleaseService emits one idempotent `RELEASE_PUBLISHED` event; MusicDiscovery consumes it to index the song; Charts begins eligibility at its effective publish timestamp. If indexing lags, the game must repair discovery and disclose the delay; it cannot backdate unverifiable listens. If a batch fails, show it as delayed and never claim the song was playable. Players with approved scheduled content see a specific status and remedy.

# 5. World surfaces: physical-first but not form-heavy

| Place or object | What the player physically does | Discovery result | Who controls the object |
| --- | --- | --- | --- |
| Release Hall record wall | Walk up, turn/inspect cover, tap Play, Save or Artist | New official songs | City; unsponsored base display |
| Music Square charts display | Approach billboard, expand Top 10 and district tab | Verified weekly leaderboard | City ChartService |
| Public listening kiosk | Put on headphones / activate station | Personal opted-in song session | City basic or permitted rented promoter kiosk |
| Venue speaker / show | Enter event, enable room sound, hear scheduled set | Shared synchronised listening | Confirmed event host/EventService |
| Record-label listening room | Listen to public songs or authorised private submissions | Scouting, shortlist, demo invitation | Label owner within permissions |
| Promoter poster | Inspect release art, preview where authorised, open track | Discoverability referral | Approved promoter/inventory owner |
| Fan's personal room | Select displayed saved record on shelf | Personal playback, memory | Individual player |
| Phone Music Collection | Search, save, queue, soundtrack, playlists | Efficient remote action | Individual player |
| Friend playlist / share | Receive link, consciously choose to play | Social discovery | Friend's shared permission setting |

**First experience:** Physical stations should frame the activity through cameras, objects and animations rather than giant administrative screens. Real text entry is unavoidable for search, titles, accessibility and reporting; focused overlays are appropriate. After the first guided session, the phone offers one-tap access to the same lawful actions. Never add artificial friction (walking to Release Hall for every repeat play) simply to preserve a simulation aesthetic.

**Radio feel without simulated listens:** District lounges can play a programmed rotation of approved public recordings; the room's audio output does not add one chart play on its own. Real joined listeners individually opt in, hear and qualify under the shared-audio evidence rules. NPC ambient dancers do not get user accounts, chart weight or artist followers.

# 6. The discovery experience is more than one algorithm

A fan can find music through at least seven different paths. Their mix prevents the game from becoming a ranked feed controlled by early winners.

1. **New on Release Friday:** Chronological, clearly non-sponsored public entries for that week's official batch. Shuffle within a batch using an auditable rotation so thousands of fans don't all see the same first item.
2. **For You:** Lightweight optional recommendations from explicitly saved genres/songs, artist follows and consented in-game interactions. Do not require a large opaque machine-learning model for V1. Always offer an unpersonalised alternative.
3. **Near My Scene:** Songs gaining genuine listening activity associated with the player's chosen virtual district. A player can switch the **browse** district without minting district chart points.
4. **Fresh Finds:** A guaranteed rotation of eligible low-exposure new releases, without requiring existing followers or paid placement.
5. **Friends Are Listening / Recommending:** Only if friends explicitly share items or opt into activity visibility. Never expose private listening history by default.
6. **Venue / event discovery:** Music heard at real events, upcoming lineups and approved listening sessions; link to the real song and performer.
7. **Charts and search:** Explicit Top 10 / full eligible leaderboard, artist, title, credited creator, genre and exact catalogue search.

**What is NOT discovery ranking:** A paid promoter placement is a clearly marked **Sponsored** object, outside the official chart ordering and outside unaffiliated organic search positions. A venue operator can show an authorised programme inside their owned venue, but that cannot re-rank the city chart.

# 7. Feed inventory and cold-start guarantees

A fixed Top 10 feed is useful for bragging rights but bad as the sole discovery surface: it becomes self-reinforcing. V1 shall have distinct, prominent **New**, **Fresh Finds** and **Charts** destinations in Release Hall and the Music phone. The system does not fabricate likes or momentum to make a feed appear busy.

**V1 recommendation algorithm [D]:** Build a candidate pool from rights-valid published songs; remove blocked/not-territorially-eligible works; group by new (<28 days), underexposed and catalogued; enforce caps against repeat appearances of one artist per browse session. The following first-page allocation is a **starting design benchmark**, not a fixed paid quota: approximately 40% recent releases, 30% underexposed older/current music, 20% contextually relevant genuine interest, 10% diverse wildcard. If a pool is empty, redistribute to other eligible songs and truthfully label it; never invent recordings. Search and chart tabs are separate deterministic paths.

**Exposure budget:** Count actual feed cards served as diagnostics, but do not call them “views” of a human listening. Use time-limited appearance frequency caps per user/song to avoid showing the same artist repeatedly; prevent multiple songs from one wealthy label crowding the entire first screen. Personalisation may recommend familiar artists, but a user can reset preferences or use “Explore everything”.

**Cold start:** When a first release publishes, include it in the open new-release inventory regardless of external fame. The system should provide at least one discoverable unsponsored placement in the release index and a rotating share of Fresh Finds **when eligible and inventory exists**; no promise that it will be heard, followed or charted. Low-traffic hours display the genuine inventory and free public opportunities, not virtual fake fans or artificial activity labels.

**Genres and tags:** Artist-selected genre/subgenre/mood are discovery metadata, not verified quality or direct ranking weight. Limit tags and apply moderation to misleading/offensive metadata. No caste system where “Afrobeats professional” gets a bonus over a funny loop song.

# 8. Listening modes and ownership of sound

| Mode | Audio owner | User consent action | May qualify a chart play? | Special rule |
| --- | --- | --- | --- | --- |
| Personal selected song | Individual player | Tap Play / use unlocked player | Yes | Independent of in-world proximity |
| Set as game soundtrack | Individual player | Explicit Set as Soundtrack | Yes, capped | Never broadcast to nearby avatars |
| Shared lounge programme | Room's authorised programme | Join room + Enable Room Audio | Yes, per individual evidence | Room speaker itself contributes nothing |
| Event Stage Mode | EventService setlist | Check in + Enable Event Sound | Yes, per individual evidence | Attendance alone not a play |
| Public kiosk | Individual at station | Choose song and play | Yes | May be public object with private headphone sound |
| Promotional poster | None until player selects preview/song | Explicit preview or published Play | Full published song may; preview cannot | Impression is not playback |
| Private demo/audition | Rights-limited sender to invitee | Authorised preview play | **No** | Never escapes embargo |
| Offline/downloaded file | Outside game | Not auditable in game | **No** | External plays not ingested |

**Audio focus:** When entering a show and opting into shared music, personal playback yields to event audio or pauses with the user's preference; exiting restores opt-in settings. If a browser cannot start sound without a gesture, display an actionable sound control and text/visual participation options. If mute is on or playback never actually starts, the system cannot pretend a chart-qualified listen occurred. Stage choreography, crowd emotes, producer equipment and venue sound upgrades do not supply chart multipliers.

# 9. Qualified playback: define evidence, not just clicks

A server-authoritative playback token is issued only after an authenticated player explicitly selects an eligible public recording or opts into an eligible shared programme. The client reports periodic media progress against that token. The server compares reports with wall-clock time, allowed media seek patterns, current authorised `song_id`, audio state, user/session activity, event timeline (if relevant) and suspicious automation signals. Client heartbeats are evidence, **not proof of a biological human**; detection is probabilistic and can be appealed.

A **qualified listen** is one real user's eligible public-song playback reaching the effective per-track threshold and passing integrity checks. For V1 [D], threshold = **min(45 seconds, max(15 seconds, 50% of track length))**. Examples: a 30-second track qualifies after 15 seconds; a 120-second track after 45 seconds; a six-minute track after 45 seconds. Threshold is a filter, not a claim that the whole recording was consumed. Keep both `completion_ratio` and `total_audible_seconds` for analysis; do not publish a misleading “full stream” count.

A qualifying session must satisfy these rules: playable approved public track; explicit listening consent; media progress corroborated by elapsed time (no seek-to-end shortcut); audio not known muted or wholly disabled; authenticated account and non-invalidated player session; no server-declared idle/automated loop; correct source and effective release time; no unrelated server/client trust anomalies. **Consecutive duplicate playback tokens cannot stack chart score by reopening a kiosk in milliseconds.** A track played from a fully private audition preview or before its premiere is excluded.

**Activity / AFK [D]:** A user actively interacting with the world, controlling playback, chatting or watching/participating in an event is eligible. After 10 minutes without meaningful interaction or confirmed conscious media controls, automatic shared-queue/background autoplay stops producing new chart-qualified listens until renewed player action; audio may continue as a convenience. Moving a mouse by an automation script is not guaranteed proof of human presence. A soundtrack deliberately started by a user can qualify on first play; repeated passive loops receive only limited re-play weighting and eventually none. The cap applies to evidence and score, not freedom to enjoy music.

**Playback integrity:** A skipped song may still have a real start for UX analytics, but is not a qualified listen if below threshold. A pause longer than an allowed idle interval splits/extends a listening session; the engine may aggregate actual, non-overlapping audible segments for the same continuous user session. A disconnected client cannot invent offline accumulated listening time upon reconnect. Simultaneously listening on two logged-in devices cannot double chart contribution; choose one actively authorised account audio source at a time.

# 10. Three distinct counters must never be merged

| Metric | Definition | Public treatment |
| --- | --- | --- |
| `raw_play_starts` | Authenticated playback attempts / source starts | Internal diagnostics; not equal to listeners or charts |
| `qualified_listens` | Individual completed threshold events surviving preliminary integrity validation | Optional artist-facing aggregate, subject to privacy controls |
| `chart_points` | Capped weighted contribution of qualified unique accounts, eligible saves and bounded live-event engagement for one scoring window | Used for ranking; weight/version disclosed |

Also maintain **`unique_qualified_listeners`**, **`unique_savers`**, **`event_checkins`** (Events owns), **`artist_follows`** (Social owns) and **`campaign_referrals`** (Promoter owns). These quantities can correlate but are not synonyms. Artist followers are not automatically chart points; ticket sales are not listens; playlist saves are not listens. Public presentation must never say “500 people listened” when only 500 server poster cards rendered.

# 11. Weekly chart formula: concrete V1 baseline

The objective is to reward **breadth of genuine interest** far more than one account replaying a song for hours. The same score policy applies to polished recordings and songs built from starter loops. It must be reviewable in code, reproducible from retained authoritative evidence, versioned before a week opens and resistant to obvious amplification exploits.

For each eligible `(player_id, song_id, chart_week_id)`, calculate a bounded contribution. The following are **configurable V1 defaults [D]**:

| Qualifying behaviour | Per-account-per-song weekly chart score | Cap |
| --- | ---: | --- |
| First verified qualified listen | +1.00 | One |
| Qualified replays 2–4 | +0.25 each | Three additional (+0.75) |
| Qualified replays 5–10 | +0.05 each | Six additional (+0.30) |
| Qualified replays after 10 | +0.00 | No additional chart weight |
| Active Save Song after at least one qualified listen | +0.75 | Once per week, per song |
| Verified live event engaged listening | +0.25 | Once per week, per song, **only if a distinct valid EventService check-in and qualified stage playback exist** |
| Merely following artist | +0.00 | Following still matters socially |
| Buying ticket or event product | +0.00 | No purchasing rank |
| Buying ad placement | +0.00 | No purchasing rank |
| Receiving a referral or poster impression | +0.00 | Exposure only |
| NPC ambience, fake account, autoplay without eligible interaction | +0.00 | Excluded |

**Maximum contribution:** The same legitimate listener can provide **3.05 points** to a song in one week: 1.00 + 0.75 + 0.30 for qualified playback, +0.75 save and +0.25 qualifying live-context bonus. The live bonus is an *experience modifier*, not 25% of the entire show's audience. The bonus is allowed once per eligible song even if the fan sees it at multiple shows. A qualified live song can also count as the first playback, but this bonus requires verified separate event context and human engagement. It is not awarded merely because a song played through venue speakers.

**Score formula:**

`WeeklyScore(song, week, territory) = Σ_{eligible_distinct_players p in territory} [PlayWeight(p,song,week) + ValidSaveBonus(p,song,week) + ValidLiveBonus(p,song,week)]`

`PlayWeight = 1.00*min(q,1) + 0.25*min(max(q-1,0),3) + 0.05*min(max(q-4,0),6)` where `q` is the number of **qualified, non-fraudulent play events** by that player for that song in that chart week.

**Save behaviour:** One saved-song state is allowed per account/song. Adding/removing/re-adding does **not** generate multiple bonuses. The save bonus applies only to the first eligible intentional Save action for that player and song, if that Save is paired with an actual qualified listen within the same chart week. It does not repeat in later weeks merely because the song remains in a playlist. Specifically: only a `SAVE_ADD` that represents a true transition from **not saved to saved** earns a one-time **lifetime** bonus per player/song; do not award another bonus from toggling or re-saving in later weeks. It also requires a qualified listen in that same chart week. If they save before that qualification, hold the bonus pending the listen; if it never qualifies, zero. This avoids future chart points from passive saved-state retention.

**Why cap at 3.05?** One user who listens 100 times should not outweigh five different interested fans. At the cap, five distinct first listens still contribute at least 5.00 points. Exact weights and thresholds are subject to alpha-playtest tuning, but changing them may only affect **future windows**, except audit corrections needed for fraud or processing errors. Do not secretly adjust weights because a famous label paid for promotions.

**Numerical worked example A:** Kemi has 10 genuine people who listen once and do not save: 10.00 points. Dami has 3 genuine people who each qualify ten times and save, but do not attend shows: 3 × (2.05 + 0.75) = 8.40 points. Kemi outranks Dami despite Dami's 30 replays. **No fabricated attention.**

**Numerical worked example B:** Jay has 20 distinct qualified first-time listeners, 4 of whom save and 2 of whom also get valid live event bonus: 20 + (4 × 0.75) + (2 × 0.25) = **23.50** points. His promoter bought a prominent poster, but the poster contributes 0.00 by itself. If nobody interacted with it or played the recording, the promotional spend would give no chart score.

**Numerical worked example C:** A fan hears one track once at a ticketed show and has event sound enabled but does not make it past the threshold because they disconnect. They earn 0.00 listening points and 0.00 live bonus; their legitimate entry and concert memory may still count independently if those systems' own eligibility rules are met.

# 12. What qualifies as a district chart contribution?

**Design risk:** If a player can teleport among four districts and play the same song four times, we must not allow them to create the illusion of four separate people. Conversely, local music cultures should matter; a venue show in Yaba ought to be reflected in Yaba's discovery surfaces.

**V1 rule [D]: One account contributes to at most one district chart per song per week.** Assign `chart_affinity_district` to the player's selected **virtual home music district** for that chart week, locked at the start of the week or when they first become eligible that week. A player may explore and browse any other district and enjoy any event; those activities still count toward the Lagos-wide score, but the district assignment for this song/week does not move with repeated teleports. A voluntary district change becomes effective **the following chart week**, with cooldown restrictions (baseline one change every 30 days). Never infer it from the player's real GPS location.

**A caveat for physical venues:** Organisers should also receive accurate **venue-local attendance and listening reports** tied to the event location. Those reports can truthfully say “15 qualified listeners heard this track at the Yaba venue” even if some spectators' weekly **chart-affinity district** is Surulere. But that venue-local count is a **venue/event analytics metric**, not a second chart contribution. On the Yaba district chart the user contributes only if their district attribution is Yaba. This avoids chart gaming by purchasing local tickets or teleporting across instances.

**New accounts:** Choose a virtual home district during low-friction orientation, or accept the default starter district for that first week. Do not let players create dozens of fresh accounts with no meaningful identity verification to dominate local rankings. Anti-abuse checks apply to small-chart eligibility more strictly because one account has high relative influence.

**District index:** District charts include **eligible music listened to by players affiliated with that district**, regardless of the artist's declared home. An artist does not earn automatic points because they live in or rented space in that district. Display a separate discovery tag “Artist from Yaba” as profile metadata, not chart contribution. This permits cross-district breakout careers: a Surulere musician can legitimately chart in Yaba because Yaba fans liked the recording.

**Lagos-wide total:** Count each person's account-level score **once**, independent of district. Lagos total should equal the sum of eligible unique player contributions attributed to all active virtual districts (subject to late integrity corrections), not add venue chart reports or advertising analytics again.

# 13. Chart catalogues and public categories

To keep V1 comprehensible, implement **three public chart views over one score engine**. Do not fabricate dozens of charts at launch.

| Chart | Eligibility | Ranking | User-visible purpose |
| --- | --- | --- | --- |
| **Lagos Top Songs** | All published rights-valid released songs meeting city integrity threshold | WeeklyScore across all eligible listeners | City's official song leaderboard |
| **District Top Songs** | Same song pool; listeners attributed to selected virtual district | WeeklyScore from eligible district accounts | Local music scenes |
| **Newcomer Spotlight** | Artists whose **first official release** occurred within a rolling 28 days; published catalogues eligible | Ranked by the same weekly score, with exposure rotation outside rankings | Helps fans discover new artists without being displaced from the entire interface by legacy hits |

**V1 naming:** Public display can say Lagos Top 10, with an expandable full list of at most 100 eligible songs as population permits. Never display “Top 100” populated with invented zero-score songs. District boards may have fewer than ten qualified songs; show the true number. Artist charts, label charts, genre charts, fan-voted awards and all-time records can be *derived informational pages* in V1 only where they use the same source evidence. Do not build additional competing secret scoring systems.

**Newcomer eligibility:** An artist's debut release timestamp is attached to their artist persona; collab features do not create false “first release” status. The spotlight is a **discovery/ranking view**, not a separate official Destiny Award category by itself. Artist returns after inactivity do not automatically reset newcomer eligibility. If the debut is removed for rights or fraud, recompute eligibility conservatively, retaining audit history.

**Songs do not expire by age:** A two-month-old hit can outrank this Friday's release if people genuinely keep listening to it. Weekly scores reset each chart period, not catalogue history. Overall historical achievements (peak position, weeks charted, first top-ten entry) persist as derived records even if current popularity falls.

**Tie break order [D]:** (1) greater unique qualified listener count; (2) greater verified unique saver count that week; (3) earlier original release timestamp; (4) stable `song_id` alphabetical/UUID order. Never resolve ties randomly or with label purchase history. Persist a final `score_algorithm_version` and tie explanation in snapshots.

# 14. Integrity thresholds and small-population realism

A chart with two people can still be technically ordered, but presenting it as major cultural consensus would be misleading. V1 therefore distinguishes **ranked eligibility** from **all genuine interest**.

**Proposed starting minimums [D]:** Lagos Top Songs entry requires at least **five different eligible qualified listener accounts** to a song in that weekly window. A district chart entry requires **three different accounts assigned to that district**. Newcomer Spotlight can surface any approved newly released song in the *non-chart* discovery rotation, but its official ranked list uses the same minimum as the corresponding territory. Thresholds are intentionally accessible for a 20-person alpha and must be evaluated against anti-alt-account evidence. These thresholds neither guarantee that five listeners are five distinct natural persons nor establish a fraud-free audience; they are only minimum visibility rules.

**Low population state:** If just four songs meet the minimum, show “Lagos Top 4 this week” or “4 songs qualified this week,” not a fake Top 10. If none qualify, show “Not enough eligible listening activity for an official ranking this week. Explore this week's new music.” The public Release Hall still works fully. Established song history remains accessible, but stale chart images must identify their date clearly.

**Honest visibility:** Artist analytics can show valid first listens and saves even if the song does not meet chart threshold. Allow emerging artists to celebrate real small wins without implying they reached a chart position they did not earn. For very low unique listener counts, detailed player-by-player sources are not exposed to artists or brands.

**Promotion fairness:** A label could finance an enormous publicity campaign, but it cannot cause the city chart to count more than 3.05 points per genuine eligible person for that song/week. Paying to reach five people can *indirectly* help by encouraging actual voluntary listening, just as a free live show can; it cannot count impressions as engagement.

# 15. Public chart presentation: make it a world event

At 18:30 every Friday, the Music Square chart screen and Release Hall reveal the **just-finished chart week**. The artist's profile shows their position and movement relative to the last published **comparable** chart, not relative to a preview or rolling estimate. A user can inspect art, preview a released track, save it, view the artist, share a clearly stamped historical chart card, or visit an upcoming event. The screen should feel like a cultural moment, with brief ambient animation and optional reduced-motion mode, not a business analytics application.

**Public rank card** contains: chart name; scoring period; rank and previous-week position or “New / Re-entry”; song cover/title; lead artist and credited features; optional verified unique-listener range; an action to listen/save/follow; explicit **Final** or **Provisional** badge. A “New” marker means first placement on *that chart*; not necessarily newly published Friday. A “Re-entry” means it charted historically but was absent in the preceding comparison week. The highest personal chart peak is historically calculated; correcting historical fraud can adjust invalid achievements with audit history.

**Chart movement:** If last week's song was #8 and this week #4, render “up 4”; if last week unranked, show new/re-entry according to historical rank, not “up from #1000.” If a historic chart has changed under appeal, show correction status and prevent misleading shared assets that link to superseded snapshots. Charts reveal at a single WAT moment for all players; use one server snapshot across all language/timezone clients.

**Awards:** The Destiny Awards may reference selected eligible chart history over an announced seasonal window, but the award policy must be published independently, include dispute/fraud holds and prevent official award scores from being purchased. Neither chart position nor total advertising spend automatically guarantees an invitation to perform. This chapter does not decide award ballot weighting; it supplies auditable song/chart evidence to the official Awards service.

# 16. Live chart feedback versus final weekly rankings

Players want evidence of momentum during the week, but constantly updating an exact ranking can create manipulation and anxiety. Separate two displays:

- **Live artist insight:** approximate eligible qualified listeners, saves, recent sources and perhaps a “gaining interest” trend with sufficient data. Mark it **unfinalised**, subject to fraud review. Do not present a fake rank before closing the chart window.
- **Final public chart:** one frozen published ordered snapshot after window closes. Corrections are logged and indicated. Chart cards always identify their weekly period and status.

**No real-time exact Top 100 as authority for V1.** The public board may display last final results throughout the week. Release Friday is the predictable reveal ritual. A promoter planning a campaign may access campaign referral reports but must not purchase live rank data for individual fan targeting or manipulation.

**Latency and outages:** If aggregation is delayed at 18:30, publish the last verified snapshot with its actual date plus “This week's chart delayed; results pending verification.” Do not silently promote an unverified provisional count to final. A partially computed snapshot cannot award permanent “#1” achievements. When ready, publish one coherent authoritative snapshot; if user-facing marketing promised 18:30, notify of delay honestly.

# 17. Saving, following, playlists and recommendation attribution

**Save Song:** A fan explicitly taps Save. The song goes into their personal collection, persists across devices and can appear physically as a record in their room. It is one user/song saved state, not one save per playlist. Adding the same song to three personal playlists does not create three saves, three chart bonuses or three listeners. Undo Save changes the collection immediately; if the saved state was removed after the score qualified, scoring follows a consistent event-at-the-time policy: final chart contribution from an intentional valid save stays unless the save event is later invalidated as fraud, so toggling cannot be used to erase someone else's chart retrospectively. Re-saving never adds a second bonus.

**Follow Artist:** A separate social action enabling opted-in release/show updates and fan-community participation. It does not create direct chart points, does not mean the user listened, and cannot expose private conversations or individual play histories. Follow/unfollow spam cannot game artist public follower counters; show deduplicated active eligible followers only.

**Playlist:** Personal and optional public playlists reference canonical published song IDs and honour current availability rights. A song removed for rights remains an unavailable placeholder in private history, never continues audio from a cached file. Adding it to a public playlist creates a discovery link, not a listener. Public playlists can be shared or explored without being a V1 paid-playlisting profession. A playlist name cannot imply official city editorial endorsement without permission.

**Referrals:** Accept typed source labels `SEARCH`, `FRESH_FINDS`, `NEW_RELEASE`, `OFFICIAL_CHART`, `PERSONAL_PLAYLIST`, `FRIEND_SHARE`, `FAN_COMMUNITY`, `EVENT`, `VENUE`, `PROMOTER_AD`, `EXTERNAL_DEEPLINK`, `SOUNDTRACK` and `OTHER`. Every qualifying playback carries at most one *primary navigation/referral source* for reporting, with secondary exposures optionally stored anonymously. It remains **one play** for score. Multiple promoters can be shown assisted interactions under Promoter v1.0 rules, but no extra chart points or automatic payout per claimed attribution.

# 18. Soundtracks, passive loops and synchronized rooms

The soundtrack feature matters because a genuine listener may want a favourite real song playing as they explore the city. A soundtrack selection is user-controlled, with explicit controls for playing, pausing, shuffle, repeat and event-audio priority. **Soundtrack playback is not a chart exploit.** Only threshold-qualifying user-initiated or otherwise policy-eligible continuous listening yields weighted plays, using the same account/song/week cap as kiosks and shows. Starting and stopping a soundtrack 100 times does not earn 100 first plays.

**Loop playback:** A 30-second comic song may loop frequently; that is allowed for pleasure. Once the cap is reached, the user's music continues, while additional repeat activity contributes 0 chart points. Raw non-chart replays may still be retained in aggregated product metrics under privacy rules. Never interrupt genuine listening just because scoring stops.

**Shared room event:** The server announces `room_id`, `track_id`, start time and seek offset; the client synchronises to the room. User opts into room audio. Server tracks user-specific eligibility; it does not multiply a loudspeaker's start by room capacity. If a friend enters halfway through the song, only their own actual qualified interval counts, not the minutes played before they entered. Reconnect/resync or client seek corrections do not manufacture fresh sessions. A muted audience member can still dance and have a fun concert experience, but cannot be labelled an audio listener merely for being present.

**Visuals:** A now-playing plaque or equaliser at the venue should show title, artists and artwork when authorised. Venue upgrades can improve immersion, stage effects, sound options, spatial audio presentation and experience, but not a chart multiplier. Players with sensory or bandwidth limitations can use captions/artist info and reduced effects without losing access to the event.

# 19. Promotion without pay-to-rank

Promoters can create posters, place approved ads at public city inventory, organise authorised listening sessions and recommend event bookings. Their purchase of visibility must remain separate from discovery scoring.

| Paid/organised action | What it provides | What it does NOT provide |
| --- | --- | --- |
| Sponsored Release Hall slot | Clearly marked, time-bound featured visibility | Chart rank or forced listener |
| Public poster | Inspectable in-world art and a playable deep link | Verified view or save merely from presence |
| Listening kiosk rental | Station availability at disclosed time/place | A counted listen from every passer-by |
| Promoter-organised session | Authorised music programme, invitations, social moment | Chart credit for absent or sound-disabled people |
| Venue showcase | Stage opportunity if organiser/artist confirm | Unlimited fans from NPC scenery |
| Share card to external network | Public link and optional referral parameter | Imported Spotify views/likes as Game chart points |

Every sponsored item has a visible paid-placement marker and the advertiser's identified actor. Organic editorial and chart placements cannot be secretly auctioned. A business owner may choose to promote themselves; player interest remains independent. Promoters may not contract for guaranteed streams, chart positions, paid fan follows or chart-scoring per-action bonuses. Reports distinguish placement delivered, link opened, qualified listen, save, follow, ticket sale and check-in; these are different values.

**Rate limits:** Community boards, ads and outreach have finite inventory, rotating allocations and frequency caps already owned by Promoter v1.0. A single rich agency cannot purchase all entry-page discovery surfaces or suppress unsponsored music. If ads are unavailable/paused due to rights or service disruption, the promoter contract uses existing inventory-refund rules, not fake substitute listeners.

# 20. Fan privacy, artist analytics and no surveillance economy

**Public profile:** An artist can see aggregate genuine eligible listens, saves, followers, weeks charted and public show history. Their fans are individuals with privacy, not marketable contact lists. Artists, labels and promoters cannot fetch a person's exact playback path, real GPS, device fingerprint, private playlist, intimate chat history or cross-session browsing merely because they helped fund a release.

**Artist analytics [D]:** Week total qualified listens, unique qualified listeners, saves, chart points, district share by **aggregate**, source mix and historical trends; show source samples only for sufficiently large cohorts. With small cohorts, say “<10 qualified listeners” instead of displaying a list from which one can infer an individual's choices. Staff anti-fraud tools are access-restricted and audited.

**Label analytics:** A signed label sees the permitted aggregate analytics of the explicit funded artist project for the signed term, with disclosure at contract acceptance. It does not receive the artist's private fan messages or all future listening activity after leaving. Promoter sees only its own campaign-level sources/aggregate outcomes, and cannot identify individual players from pixel tracking. Venue operators see event-local aggregate playback and actual check-ins, not all listeners' accounts or private music collections.

**Retention:** Store the minimally necessary identity-bound playback evidence long enough to settle fraud/report disputes and reproduce recent charts; purge/aggregate after a published retention period. Proposal: keep identifiable raw playback evidence **90 days** where legally permissible and needed for contestability, then keep pseudonymised/aggregate signed snapshot data without permanent per-user listening histories. This is a starting privacy-design recommendation, not verified legal compliance [X]. Provide consent/clear privacy notices and applicable user rights mechanisms. Distinguish artist removal of a recording from an individual listener's data deletion request.

# 21. Anti-manipulation and trust rules

The point of THE SCENE is that real people can discover real music. If one person can run 50 cloned accounts and dominate a three-listener district chart, the feature collapses. Therefore integrity is both a product and a security requirement, and every policy must apply to independent artists, wealthy label acts, promoters and game-created music alike.

**Threats and mitigations:**

| Attempt | Why harmful | V1 response [D] |
| --- | --- | --- |
| Repeat one track on one account for hours | Replaces broad demand with looping | Per-user song/week scoring saturates after ten valid listens; soundtrack AFK constraints |
| One player opens several devices or tabs | Multiplies single-person contribution | One active scored playback channel per account; dedup with server tokens and lock |
| Bot spins up many accounts | Invents fans/listeners | Behaviour analysis, signup/device/network rate limits where lawful, suspicious cohort review, provisional exclusion |
| Venue invites 50 NPC dancers | Claims artificial live interest | NPCs are atmosphere and never issued listener identities or chart tokens |
| Promoter pays players to save tracks or offers pay-per-play | Purchased engagement not genuine interest | Prohibited campaign terms, anomaly flags, sanctions and invalidation of coordinated activity |
| Artist repeatedly unsaves and resaves | Duplicates save bonus | Lifetime first valid save bonus per player/song, tied to qualified listen |
| Artist publishes same master under several aliases | Evades weekly limit and hijacks duplicate fanbases | Audio-fingerprint/metadata/collaborator review; unified original work or review hold |
| Producer submits remix and falsely claims artist role | Friday/copyright bypass | Credit/rights checks, performer consent and material-new-work review |
| User teleports through all districts | Multiplies district chart totals | One immutable district affiliation per user/song/week; local venue report separately |
| Event host stages fake check-ins | Fakes attendance bonus | Unique authenticated real account; server EventService admission and engagement evidence |
| User seeks to 45s mark repeatedly | Qualifies without listening | Server validates cumulative media progression against elapsed audio time |
| Simulated audio disabled/muted yet posts progress | Fakes listening | Reject known mute/sound-blocked sessions; treat suspect client-only signals cautiously |
| Fan shares thousands of links | Notification spam, false referral counts | DMs consent/rate limit, referrals are diagnostic only |
| Someone purchases sponsored placement and changes its label | Misleads discovery | Server-owned Sponsored label, immutable accounting and moderation |
| Malicious users report a rival track | Suppresses competition | Reports triaged on evidence; no automatic removal solely on report volume |
| Label tries to suppress a competitor | Weaponises moderation | No label authority over competitor publication/chart state; audited staff-only actions |
| Cash transfers incentivise follow farms | Buys arbitrary fan counts | Transfer and chart services separate; abuse review of coordinated activity; no reward per listen |

**Fraud confidence states:** `TRUSTED`, `REVIEW_PENDING`, `EXCLUDED`, `REINSTATED`. These describe a *specific evidence group* or contribution, not a public declaration that a person is a criminal. A song should not be publicly marked as cheating without verified findings. Distinguish platform/device anomalies from intentional abuse. Reinstatement requires reprocessing contributions, not a manually typed chart score.

**Independent review principle:** No popularity score automatically bans an artist for being unexpectedly popular. A funny one-minute song can go viral, and one record label can legitimately afford widespread promotions. Anomalies trigger contextual review; the final decision requires verifiable evidence rather than “growth too fast.” Provide an appeal path and audit log.

**No money for scoring:** This chapter produces read-only ranking records, not ledger credits. A separate contest or event might legitimately award a prefunded advertised prize under the relevant event contract, but must not reward per stream, paid follows or fraudulent chart actions. Any formal competition payout must be explicit, funded, dispute-gated and handled in Economy/EventService.

# 22. Moderation, copyright and removal behaviour

**Access states:** `DRAFT_PRIVATE → SUBMITTED → PROCESSING → RIGHTS_REVIEW → APPROVED_SCHEDULED → PUBLISHED → HOLD / REMOVED / RESTORED`. A song can also be rejected or withdrawn before public release. ReleaseService is authoritative. Discovery and ChartService subscribe to these state changes and enforce immediate search/play suppression of a newly held asset; stale cached cards may retain text but their Play actions must fail securely.

**On HOLD:** Disable new playback, preview (unless explicitly still authorised under review), public recommendation placement, active event use and sponsored promotions. Preserve audit and past factual history in controlled form. Mark current ranking `Under Review` rather than silently replacing it with another song while still showing a false live score. Freeze unresolved contributions pending investigation. Fans' saved records show “Unavailable” and a reasonable status without publishing complainant identity.

**On confirmed rights violation/removal:** No further playback. Invalidate contributions that the platform determines were never legally eligible or were fraudulently generated, subject to the formal correction policy. Do not indiscriminately delete valid historic attendance memories from fans who genuinely attended. Mark unavailable references and preserve minimal historical records as required by policy. Artist appeals go through a documented process and can restore lawful releases without awarding missing time that could not have been genuinely listened to.

**Content moderation:** Content, cover art, artist profiles, promotional copy and user-shared links each have applicable rules. Avoid subjective artistic-quality moderation. Parody/novelty tracks are allowed within safety and rights policy. Direct false impersonation of a real musician or a protected official awards/label account is disallowed. Reporting alone does not automatically reduce chart scores; only validated suppression or content policy decisions do.

**Licences and musical loops [X]:** Source-loop licences must permit users to create/export publicly playable songs and any contemplated reuse. Covers/samples/AI-created content may have additional rights restrictions, and provider terms must be checked for this game use. There is no assumption that an AI API or rights to generated tracks automatically exists. Public preview snippets need the same controlled rights model as full releases.

# 23. What a new artist actually sees

The artist's music profile should be a story of their career, not merely a performance dashboard. It displays the released catalogue, art, upcoming events, highest chart placement, verified eligible listener and save aggregates where privacy allows, and saved career moments. A first-time player with no music has an aspirational profile and studio access but no fabricated chart entries.

**After first release:** The world record is visible; player can hear own track; followers can be notified subject to preferences; valid plays/saves accumulate; the artist may see “Your song has reached its first 5 qualified listeners” once it is true. An artist with three songs may curate a catalogue shelf, but only one official Friday appearance per performer per week. No daily grind demand.

**After a small venue performance:** Their track may gain listeners from genuine audio-enabled fan participation, saves and artist follows. A 50-capacity show with 20 genuine people can meaningfully move a district chart, though no promised position. The venue's speaker quality can change experience and which listeners voluntarily keep listening, not formula weight itself.

**After a chart entry:** A public commemorative visual card shows actual chart/week/position. The career profile retains true historical peaks. Artists can share chart assets on external networks as links and pictures, but external views are not ingested as chart points. Changing labels or leaving a company never wipes the artist's catalogue or legitimate chart history.

**What artists cannot access:** Fan names attached to individual listens, private playlist contents, GPS data, device IDs, competitors' nonpublic conversion analytics, unreleased competitor demo files or private moderator confidence scores.

# 24. Record-label experience: scouting and development, no bought hits

A record-label owner enters their listening room and browses Release Friday, Fresh Finds, public artist catalogues and opt-in demo submissions. They can save a shortlist. The same songs are available on every eligible discovery channel and use the same canonical IDs.

**Scouting signals:** Authentic change in unique listeners; recent saves; genuine performance activity; geographic interest; proportion of artist fans choosing to attend shows; historical sustained discovery; artist reliability from agreed business/project evidence. All aggregate and subject to privacy, consent and small-cohort suppression. The game should not tell a label that a song is guaranteed to become popular.

**Signing and funding:** Signing an artist or paying for studio/promotion does not add chart points. A funded Release Friday campaign may help a recording reach real listeners. The label's return comes from separately eligible virtual commercial receipts (concerts, shows) under its agreed project contract, not from receiving a percentage of abstract chart points. Chart performance can inform future investment decisions without being cash.

**Competitive discovery:** Two labels can listen to the same artist and offer deals; the artist chooses. One label may identify an early sleeper hit, another may overpay for a strong but short-lived novelty track. The game records those stories, not a scripted success threshold. Label-owned private artist drafts require explicit artist permission to be shared with particular scouts; private demos never become publicly chartable.

# 25. Promoter experience: exposure is a scarce opportunity

A promoter plans a campaign at a physical wall, chooses approved locations/slots and obtains budget. The materials appear as tangible posters/kiosks. A fan may approach and listen; a fan may also walk past. Both are legitimate outcomes. A promoter's **placement-delivered event** is not a qualified human music action. A campaign report must show separate counts for placement served, player opened item, qualified human listen (aggregate), save, follow, and event check-in where applicable.

**Attribution [D]:** Last valid direct-touch can be the primary referral for campaign analytics, but other exposures may remain in aggregated assists. The single underlying listener/song/week scoring does not change. A campaign resulting in zero qualified listens can still have been correctly delivered; contractual fixed-fee payment follows the promoter's delivery obligations, not invented performance. No pay-per-stream bonuses. No secret promoted placement on official chart surfaces.

**Campaign experiment:** The promoter can test two compliant pieces of poster art at different slots or districts and observe *aggregate* results. They can change a future placement before it locks. They cannot target a player through detailed private listening history, send unlimited unsolicited invites or bypass the artist's pre-release embargo.

# 26. Venue and event discovery: live moments matter but remain honest

A venue operator may select an authorised public-song rotation for a lounge or stage, host open mics and sell/operate eligible bookings. Its events can drive genuine listening and saves. The venue's reputation can become linked to emerging-artist discovery without receiving imaginary listener tokens.

**Live evidence path:** EventService validates unique admission, permitted room session, performer slot and actual stage track. AudioPlayback emits corroborated per-account listen candidate. ChartService checks publication/rights, threshold, uniqueness/anti-abuse, district snapshot, chart window and live bonus eligibility. EventService's `ATTENDED` badge alone does not create a play. Ticket payment alone creates no chart points. One 50-seat venue doesn't have 500 human listeners because it renders hundreds of NPCs.

**No duplicate amplification:** The event soundtrack, personal headset, poster and soundtrack settings must converge on one logical authoritative playback active at a time per account. A user can discover a song through the event, save it and listen later. These are separate legitimate actions within the single capped player-song-week score. A promoter and venue owner may both receive meaningful *attribution* reports without either receiving another chart point.

**Cancelled performance:** An organiser can cancel an event under Events v1.0 rules. A scheduled cancelled event cannot issue retroactive check-in or listening evidence. Valid public listening that occurred before a later cancellation remains truthful unless rights/fraud adjudication rules require exclusion. Fans keep appropriate historical memories for delivered portions of shows. If a song is removed mid-show, EventService stops it and switches only to authorised alternatives; attendees may have a remedy under the event contract, but ChartService cannot continue qualifying the unavailable track.

# 27. Fan experience, discovery histories and social recommendation

Fans choose what they hear and can build a personal record collection. A friend may explicitly recommend a recording; the recipient must choose to play it. Public playlists and social listening communities create discovery pathways without charging a tax on friendship. A fan can display chart-week memories, “I attended the first performance” and “I followed before their first district Top 10” based on authentic timestamps.

**Early supporter [D]:** A valid first follow before the artist's first published district Top 10 snapshot may qualify for an early-supporter memory; it is awarded only if actual threshold/criterion is reached and after final chart publication. Fan badge awards are historical recognitions, never extra chart points or direct monetary rewards. Badge anti-abuse uses legitimate account continuity and appeal handling. If a fraudulent chart is reversed, affected derived badges may show “Under review” rather than disappearing without explanation.

**Consent:** “Friend is listening to X” is visible only on explicit opt-in; turning it off removes future disclosures. Following an artist does not grant the artist DM access or private song history. Fan communities may discuss and share music but cannot forge **official** listening parties without artist or authorised organiser approval. Community posts carry no chart points until a real eligible playback occurs.

# 28. Destiny Awards and major cultural prestige

The Destiny Awards remain the official quarterly pinnacle of THE SCENE's cultural recognition. Chart snapshots supply verifiable milestones and may be one input to transparent award rules. However, the Awards operator, not the chart service or individual label, owns nominations, any public vote, eligibility and ceremony production. An artist need not top every chart to be nominated for Best Live Performer; that category might depend on separate event achievements. A fan cannot purchase an award vote or get more weight because of Game ₦ wealth. A player can organise a privately funded festival larger than the awards but cannot call it the official Destiny Awards.

**Official show:** A major awards stage may display real historical chart cards, invited artists and the show's authorised setlist. A chart winner's audio still requires playback permission; receiving a trophy does not override rights removal. There is no NPC voting or fictitious human turnout. Technical capacity caps apply to the ceremony as to every other event. The first public awards should launch only when enough valid history and human participation exist to produce meaningful recognition.

# 29. Small-population and first-week stress tests

Consider a 20-player closed alpha with twelve songs from eight artists. Every active musician should be discoverable even if none qualifies for the city Top 10. Fresh Finds and Release Hall operate from public catalogues immediately, not from fabricated scores. Three listeners in Yaba could create a legitimate local entry under the proposed baseline; five in the city could create a Lagos entry; these thresholds are test settings and can be raised when abuse or population realities demand.

**Scenario A — Real musician:** Kemi imports a polished recording and launches Friday. Seven different people intentionally listen once, and two save. If none attend a concert: score = 7 + 2 × 0.75 = **8.50**. It qualifies for city chart under the minimum-five rule, but whether it ranks high depends on all competing songs' scores. Kemi's production cost/real-life experience gives no extra points.

**Scenario B — DIY novelty act:** Dami builds a silly track from starter loops. Four people listen repeatedly ten times, all save and one qualifies at a genuine live event: four × (2.05 + 0.75) + 0.25 = **11.45**. It doesn't qualify for Lagos Top Songs **unless it reaches a fifth independent qualified listener**, despite its score exceeding Kemi's. This is the breadth threshold working as intended; Dami remains fully discoverable and can still qualify in a district if those listeners belong there.

**Scenario C — Wealthy label:** Jay's label spends Game ₦ on a Release Hall advertisement, but only three genuine people qualify for a listen. The ad itself adds zero chart score. Jay gains actual interest but is not ranked citywide under the five-listener floor. Promotion purchased visibility, not popularity.

**Scenario D — Unpopular but persistent artist:** An older song gets six new distinct qualified people in week eight. It remains chart eligible. Its old peak position is still recorded, but this week's score comes only from this week's valid new/returning listener activity; a prior week's points never automatically roll forward.

**Scenario E — Soundtrack superfan:** One player intentionally plays the same song 80 times while exploring. After ten qualified plays, their play score is capped at 2.05 for the week. If they also newly save and attend a valid live rendition, total cannot exceed the configured per-account maximum of 3.05 points. They can keep listening without extra score. A fan's sincere enjoyment is respected, but not amplified into dozens of “people”.

**Scenario F — Concert attendee with audio off:** A player bought a ticket and appears in the venue. They dance but never enable Event Sound. Their presence may count as an authentic ticketed attendee, yet the show contributes no audio-qualified listen for them. If the artist gets an event attendance memory, that is a different truth.

**Scenario G — Low population:** Only three songs have >=5 distinct valid citywide listeners by chart close. Publish the genuine Top 3; don't invent filler. Newcomers without enough listeners remain on Fresh Finds. For the next week, show a zero-result state if no track qualifies.

**Scenario H — Cheating cluster:** An artist triggers 40 newly created accounts from one automation system to play once. Preliminary numbers rise, but integrity review holds the suspicious cohort. Do not confidently publish #1 while held evidence might materially change rank. Legitimate accounts are not punished simply for living in the same household; review evidence, support appeal, and apply the final clean snapshot.

# 30. Exact service boundaries and data ownership

| System owner | Authoritative responsibility | Data emitted / consumed |
| --- | --- | --- |
| Identity/Auth | Legitimate authenticated player, integrity risk and session constraints | Signed identity session, account-state signals |
| Artist/ReleaseService | Audio asset, credits, rights, approvals, embargo, Friday slots, publication state | `ReleasePublished`, `ReleaseHeld`, `ReleaseRestored` |
| AudioPlayback | Authorised signed playback token, evidence of real media progress and sound status | `PlaybackStarted`, `PlaybackProgress`, `PlaybackQualifiedCandidate` |
| MusicDiscovery | New/Fresh/Personalised/Local/Search candidate lists, rotation and paid separation | Discovery request logs and candidate provenance |
| Fan/SocialService | Saves, artist follows, playlists, friend shares and privacy | `SongSaveAdded`, `SongSaveRemoved`, `ArtistFollowChanged` |
| EventService | Venue show timeline, real check-ins, performer/song permissions, cancellation | `EventTrackWindow`, `EventCheckedIn`, `EventAudioConsent` |
| Promoter/AdInventory | Sponsored placements, consented referrals and campaign reports | `SponsoredPlacementServed`, `ReferralOpened` |
| ChartService | Sole canonical validation/weighting, district attribution, rank and snapshots | `ChartContributionAccepted/Excluded`, `ChartPublished` |
| Moderation/Rights | Content holds, copyright disputes, appeals, audit | `ContentRestrictionChanged`, `IntegrityCaseResolved` |
| Economy | Payments, tickets, project expenses, virtual balances | Never accepts `chart_points` as currency |

**Design requirement:** Only ChartService writes `chart_contribution` and final `chart_snapshot` tables. Other services publish or own evidence; they never independently “increment chart rank.” Every cross-service event is uniquely identified, authenticated and idempotently consumed. The chart projector may lag by seconds/minutes, but never counts the same source event twice.

# 31. Minimal implementation data schema

Required entities are described independent of the exact SQL/ORM implementation. They must each have immutable identifiers, creation/update times and access control.

| Entity | Essential fields / invariants |
| --- | --- |
| `song_work` | `song_id`, owner artist, performer/producer credits, version, title, art, duration, approved master link, public-state pointer |
| `song_rights` | `song_id`, permission types, territories, expiry, sampling/loop source, contributors, revocations, case IDs |
| `release_record` | `release_id`, `song_id`, Friday effective UTC, credited artists, scheduled state, release batch, review version |
| `playback_session` | `playback_token_id`, player ID, track ID, mode/source, started/end timestamps, device/session lock, consent state |
| `playback_evidence` | event ID, playback token, observed media seconds, elapsed wall seconds, mute/audio focus flag, seq no., verified server receive time, integrity result |
| `qualified_listen` | source canonical ID, player ID (privacy protected), song ID, chart week, qualified_at, contextual event, district affinity snapshot, decision ID |
| `song_save` | player/song, saved state, first valid add timestamp, first bonus-eligible event ID, personal collection access |
| `artist_follow` | player/artist, active state and opt-in notification settings; no direct song chart points |
| `playlist` / `playlist_item` | owner, visibility/permissions, ordering, canonical song IDs, server revocation handling |
| `discover_request` | player session, surface and contextual permissions, candidate-set version, exposure diagnostics, organic/sponsored boundary |
| `chart_week` | window start/end UTC and WAT labels; algorithm version, status (`OPEN/CLOSING/VERIFYING/FINAL/DELAYED/CORRECTED`) |
| `weekly_listener_contribution` | one player/song/week/territory source-of-truth key, qualified playback count/caps, lifetime save bonus, live bonus, decision codes |
| `chart_snapshot` | chart week, territory, chart kind, version, publication timestamp, status, eligibility floor, data hash, score version |
| `chart_entry` | snapshot ID, song ID, rank, points, unique verified listeners, tie-break fields, historical annotations |
| `district_affinity` | player ID, eligible district, effective week, change cooldown, prior change history |
| `fraud_case` | evidence group/actor, states, reviewer, immutable reason/review decisions, appeal status, provenance |
| `track_referral` | optional anonymised source/campaign/event link, time, last valid touch, no direct score increase |
| `music_achievement` | player/artist/song/venue/label milestones referencing final snapshot/event, revocation/correction pointer |

**Sensitive identity data:** Any device/network integrity signals must be stored in security-restricted systems, with retention and legality assessed [X]. Do not casually make device fingerprints part of a publicly queryable chart table. Artist metrics use aggregates and privacy thresholds.

**Example pseudocode: window membership:**

```text
week = findChartWeek(qualifiedAtServerUTC)
assert release.publishedAtUTC <= qualifiedAtServerUTC
assert song.publicState == PUBLISHED && rights.allowPlayback
assert identity.isEligibleForMusicActivity(player)
assert evidence.audioStartedAndThresholdMet && evidence.integrityAccepted
assert !sourceEventAlreadyApplied(evidence.sourceEventId)
lock player_song_week_aggregate(playerId, songId, weekId)
recompute bounded contribution from canonical accepted events
commit atomically with event-consumption cursor
```

**Do not trust a user-supplied `played_for_seconds`, `district_id` or `artist_id` to create ranking:** Server evidence, release state, district snapshot and canonical credits are reloaded from authoritative records.

# 32. Listener event lifecycles and chart snapshot state machines

**A listening journey:** `REQUESTED → AUTHORISED → PLAYING → THRESHOLD_REACHED → CANDIDATE → (ACCEPTED / REVIEW_PENDING / EXCLUDED)`; terminal `DENIED/EXPIRED/CANCELLED` when appropriate. Pauses and reconnects can resume the same bounded playback session; they do not manufacture a second qualifying replay. A genuine repeat requires an actual new permitted playback cycle after the previous one has ended or restarted, with credible non-overlapping time.

**Chart week:** `OPEN → CLOSING → VERIFYING → FINAL_PUBLISHED`, with alternative `DELAYED`, `PROVISIONAL_PUBLISHED` (clearly labelled) and `CORRECTED_PUBLISHED` with link to superseded snapshot. A finalized week cannot quietly mutate. Publish an immutable new revision and explanation if justified by an accepted fraud/rights appeal or processing error. A later week may advance while an earlier week is under correction.

**Integrity decisions:** `TRUSTED → UNDER_REVIEW → EXCLUDED/REINSTATED`. Don't use irreversible auto-exclusion based solely on a rapid rise in listens. An actor may challenge a restriction; appeal outcomes recompute canonical contribution and all impacted entries once. Do not cascade by repeatedly adding points over the correction process.

**Embargo:** `DRAFT/PRIVATE_PREVIEW` candidates are rejected from public listen qualification regardless of sound duration or authorised scout access. A private scout can listen to the same permitted excerpt many times for evaluation; those are not chart plays or public releases. The preview cannot appear in public playlists or on free kiosks before Friday.

# 33. Engineering interfaces and exact error behaviour

The following are **conceptual API contracts**, not assertions that the platform has already implemented endpoints.

| Action / endpoint (proposed) | Server validates | Important errors / UX |
| --- | --- | --- |
| `GET /music/discover?surface=` | Auth/public entitlement, age/rights, surface constraints | `NO_ELIGIBLE_TRACKS` → open Explore/Release Friday, no fake list |
| `POST /music/playback/start` | Account, song/public state, player channel lock, room/event permissions | `EMBARGOED`, `RIGHTS_BLOCKED`, `AUDIO_PERMISSION_REQUIRED`, `SOURCE_UNAVAILABLE` |
| `POST /music/playback/progress` | Signed token, monotone progress, plausible elapsed time, sequence/idempotency | `STALE_SEQUENCE`, `INVALID_SESSION`, `SEEK_NOT_QUALIFIED` |
| `POST /music/playback/end` | Session ownership, final progress, abuse flags | Client retry returns same result; never twice scored |
| `PUT /music/saves/{songId}` | Existing canonical published song, identity | Idempotent state change, not additive save counter |
| `POST /music/playlists` | Owner and privacy / safety | Invalid track is skipped/placeholder with reason |
| `GET /music/charts?week=&district=` | Published snapshot, allowed query scope, privacy | `PENDING_VERIFICATION`, `NO_ELIGIBLE_CHART`, `SNAPSHOT_SUPERSEDED` |
| `GET /artists/{id}/music-insights` | Owner/consented label scope, aggregate threshold | Privacy-suppressed cohorts; no individual fan path |
| `POST /artist/releases/submit` | Wednesday/Thursday release rules, rights, slot, version | Existing Artist ReleaseService governs; no duplicate producer exception |
| `POST /reports/music` | Authenticated report, text/file evidence, moderation workflows | A report starts review, not immediate rival demotion |

**Reconciliation jobs [D]:** (1) reconcile published releases to all discover indexes; (2) compare accepted qualified candidates with materialised contribution; (3) rebuild weekly snapshot from immutable eligible evidence under the recorded algorithm version; (4) verify sum of district account contribution equals Lagos total within explicit rounding rules; (5) detect orphaned event-source evidence; (6) revalidate song rights for cached audio URLs; (7) verify no scheduled future embargo leak; (8) rebuild achievements on chart correction.

**Performance target defaults [D]:** Common feed/chart navigation should be responsive on mobile; target p95 <500ms for cached chart reads in a healthy region, p95 <1s for ordinary discovery reads, with clear cached/offline states. Playback start should display an actionable audio state quickly but actual audio buffering depends on network/device. Chart close/reveal jobs should be deterministic, resumable and monitored. These are engineering targets, not measured achievements.

# 34. Error and edge-case matrix

| Edge case | Expected V1 result |
| --- | --- |
| User listens before official Friday 19:00 | Private preview permitted only to its invitee; **0 public chart points** |
| Wednesday submission incomplete | Schedule next eligible Friday; inform artist and collaborators |
| Thursday moderation still pending | Hold/roll forward; never auto-publish uncleared song |
| Two credited performers already have Friday releases | Reject conflicting submission or choose next eligible batch |
| Same recording appears twice as two artists' original masters | Fingerprint/rights review; no duplicate rankings from cloned audio |
| Full song plays on city speakers but no player enables audio | Zero qualified listens |
| 20 attendees in room, only 8 qualify audio threshold | Eight potential distinct qualified accounts, subject to validation |
| User has phone muted but avatar dances | Still authentic attendee; no assumed qualified playback |
| Seek-to-end in one second | Does not satisfy audible-progress and elapsed-time threshold |
| User reopens song from poster five times in seconds | Playback attempts logged; no duplicate accepted listen without actual playback |
| Two tabs repeat one song | One authorised active scoring channel; no double-first-play |
| One person travels through four districts | At most one district chart contribution per song/week; venues retain accurate local event reports |
| User changes home district midweek | New affinity effective next eligible week, subject to cooldown |
| Fan saves song into six playlists | One saved state; at most one lifetime save bonus for that song/user |
| Fan saves before any qualified listen | Pending save chart bonus; awards only after valid same-week qualification |
| Fan unsaves then saves again repeatedly | No second save bonus; collection state updates normally |
| Artist song becomes viral in a single day | Genuine activity counts; anomaly may be reviewed but not automatically rejected |
| Artist pays ₦1m for sponsored billboards | Placement displays; **no automatic score** |
| An NPC buys ticket or follows artist | Impossible: no human account entitlements; invalid data rejected |
| Old song receives new listeners in week 10 | Can re-enter ranking for current week |
| Song has 4 distinct Lagos listeners at chart close | Remains discoverable; under proposed min-five, not official ranked entry |
| District has fewer than three unique eligible listeners | No official district ranking for that song; honest empty/small chart view |
| Weekly chart has only two qualifying songs | Publish truthful Top 2, not synthetic Top 10 |
| Audience member attends show with audio off | Check-in/memory possible; no audio-qualified listen |
| Performer plays a different song at a show | Only actual authorised stage track can generate evidence |
| Event is cancelled before opening | No future valid event audio/check-ins; prior separate public playback unaffected |
| Song rights expire during concert | Stop track, suppress links, trigger event fallback/remedies |
| Takedown after song charted | No playback; historical results preserved/corrected per adjudication |
| Fan reports disliked song as fraud | Evidence review; no immediate demotion merely from report |
| Fraud finding after chart publish | Superseding corrected snapshot with audit trail; derived badges recalculated |
| Anti-fraud false positive appealed | Restored evidence is replayed once; updated snapshot if needed |
| Chart worker crashes during weekly close | Resumable idempotent build; delayed/provisional marker, not guessed positions |
| Device clock set to Thursday while server is Friday | Server window/publication governs |
| Playback network disconnect after 25 seconds | Only evidenced audio can count; no fabricated offline seconds |
| Artist voluntarily blocks listener | Future relationship/privacy rules apply; past anonymous truthful listening history not erased automatically |
| Fan deletes account under applicable privacy rules | Personal data handled lawfully; charts corrected or privacy-preserving aggregates retained as policy allows [X] |
| Label contract expires midweek | Song remains playable; label's permitted future private analytics cease per contract |
| Song has been placed in someone else's playlist then removed | Playlist shows unavailable placeholder; no cached continued playback |
| Publisher tries to count Spotify/TikTok streams | External engagement not imported into THE SCENE chart |
| Official chart is late at 18:30 | Show stale previous final week with date and pending message; no invented result |
| Player has zero Game ₦ | Full discovery, free listening, saving, following and free show access remain available |

# 35. Implementation acceptance tests: concrete V1 contract

The following should become automated unit, integration, browser/mobile and multiplayer tests. **Expected outcomes are assertions**, not vague goals. A test environment uses a controllable server clock, seeded accounts with verifiable identities, and a fake media engine capable of simulating trusted playback evidence without treating forged client progress as genuine production evidence.

| Test | Given / action | Required assertion |
| --- | --- | --- |
| AT-M01 | Upload a legitimate 3-minute master and publish via permitted Friday batch | Exactly one public `song_id`; listing playable only at effective time |
| AT-M02 | Same artist submits two official tracks for one Friday | One approved appearance at most; second is blocked/rescheduled |
| AT-M03 | Lead + feature both scheduled separate Friday releases | Contributor slot conflict prevents simultaneous release |
| AT-M04 | Producer credited on several Friday tracks | Producer-only credit doesn't consume artist slot |
| AT-M05 | Track played privately Wednesday | Qualifies zero public chart points |
| AT-M06 | Track first becomes public Friday 19:00 | No chart evidence earlier; public discovery index created once |
| AT-M07 | Song playable Friday 18:30 before new batch | It must have been an older published song; valid listens count toward new window |
| AT-M08 | Clock on phone falsified | Publication/window decided only by trusted server UTC |
| AT-M09 | 120-second track listened 44 seconds | Below proposed 45-second threshold; no qualified play |
| AT-M10 | 120-second track genuinely listened 45 seconds | One qualified play candidate, subject to integrity checks |
| AT-M11 | 30-second track genuinely listened 15 seconds | Qualifies first-listen threshold under current config |
| AT-M12 | User seeks from 0 to 120 seconds instantly | No qualification without credible 45 seconds of actual playback |
| AT-M13 | User plays same recording from a kiosk then personal phone concurrently | One active counted channel; no simultaneous duplicate qualification |
| AT-M14 | Same user makes ten legitimate replays | Playback score exactly 2.05 that week before save/live bonuses |
| AT-M15 | User makes an eleventh legitimate replay | Zero additional chart points from that replay; listening continues |
| AT-M16 | User saves track without playback | Stored in collection as allowed, but no save chart bonus yet |
| AT-M17 | User saves then qualifies that same chart week | At most +0.75 once, subject to validation |
| AT-M18 | User toggles Save twenty times | At most one lifetime eligible bonus, no farm |
| AT-M19 | User includes track on five playlists | No additional save or playback credit |
| AT-M20 | User follows artist without listening | No direct song chart contribution |
| AT-M21 | Player buys three event tickets | Zero music chart points from purchase alone |
| AT-M22 | Twenty NPCs dance to venue music | Zero genuine listeners, saves or chart points |
| AT-M23 | One event has 20 real check-ins but 8 audio-qualified listeners | At most those 8 qualify music listening; check-ins stay 20 |
| AT-M24 | Fan checks in with sound disabled | Valid event admission but zero audio play / live bonus |
| AT-M25 | Fan hears valid stage track and qualifies; event checked in | +0.25 bounded live bonus once if event context eligible |
| AT-M26 | Fan attends two shows playing same song in one week | Live context bonus not duplicated beyond +0.25 |
| AT-M27 | Room skips song due to rights hold | Audio stops, no later qualified listens, permitted history retained |
| AT-M28 | Rich label buys all permitted campaign placements | Chart points rise only from independently valid human choices |
| AT-M29 | User walks past poster but never interacts | Diagnostic placement served only, zero chart points |
| AT-M30 | User directly plays track after clicking poster | One normal qualified play, source = `PROMOTER_AD` |
| AT-M31 | Two promoters both claim one fan conversion | Single music score; attribution reports no duplicate paid commission |
| AT-M32 | Artist has real-world Spotify play count | No external play ingestion into Game chart |
| AT-M33 | Real recording vs amateur loop recording with same verified listener evidence | Exact same score under same algorithm version |
| AT-M34 | Existing song receives new listens after two months | Eligible to re-enter current-week chart |
| AT-M35 | User moves district midweek and replays track | One district score attributed per person/song/week |
| AT-M36 | Player browses different district's discovery tab | No relocation of historical chart-affinity contributions |
| AT-M37 | Yaba venue has Surulere-affinity fan | Local event analytics shows Yaba event; music district chart attributes fan to Surulere |
| AT-M38 | District contribution aggregation rebuilt | Sum of all per-account district contributions equals city score for same week |
| AT-M39 | A track has four genuine city listeners | Under min-five, no city official rank, but discoverable |
| AT-M40 | Track gets fifth genuine eligible listener before window close | Eligible city rank if rights and all other conditions pass |
| AT-M41 | District has two genuine track listeners | Under min-three, not officially district-ranked |
| AT-M42 | Only three songs citywide are eligible | Public board shows exactly three ranked songs, never artificial Top 10 |
| AT-M43 | New release has no plays | Still visible on unsponsored new-release index |
| AT-M44 | Chart tie after score | Deterministic unique-listener, saver, release-time and ID tie-break applied |
| AT-M45 | Chart score weights changed midweek through configuration | Existing week keeps original score algorithm version |
| AT-M46 | Worker crashes twice rebuilding same week's score | Replay is idempotent; no duplicate events or points |
| AT-M47 | Network client retries progress event | Same source event applies once and only once |
| AT-M48 | Fraud cluster held before chart publication | Materially affected ranking flagged verifying/delayed rather than falsely final |
| AT-M49 | False-positive fraud ruling overturned | Authentic evidence recomputed exactly once and correction is auditable |
| AT-M50 | Song removed after appearing #3 | Playback disabled; historical chart status handled through explicit correction policy |
| AT-M51 | Malicious report lodged by competitor | No automatic chart demotion without rights/safety/integrity decision |
| AT-M52 | Chart publication delayed past 18:30 WAT | UI marks prior snapshot/date and pending status; no invented position |
| AT-M53 | Chart corrected after official post | New revision links superseded snapshot; invalid derived awards/badges updated |
| AT-M54 | Brand sees song analytics from artist with 2 qualified listeners | Individual identities suppressed; small-cohort privacy controls apply |
| AT-M55 | Label relationship terminates | Future restricted artist analytics permission removed according to contract |
| AT-M56 | Fan disables share-listening activity | Private ongoing listening stops appearing in friends' feeds |
| AT-M57 | User with Game ₦0 enters Release Hall | Can listen/save/follow and attend eligible free experiences |
| AT-M58 | User disconnects/rejoins stage playback mid-song | No fabricated missing seconds or duplicate play on seek resync |
| AT-M59 | 40 accounts suspected as alts in tiny chart | Escalates review; no automatic blanket block of legitimate shared-household accounts |
| AT-M60 | New player chooses no personalisation | Unpersonalised Release Friday, Fresh Finds and search all work |
| AT-M61 | Player selects reduced-motion and captions | Core discover/save/follow functions remain operable |
| AT-M62 | Audio is paused because app loses audio focus | Pause eligibility progress; world remains available where possible |
| AT-M63 | Player opens a previously removed song from playlist | Shows unavailable state; no stale CDN audio playback |
| AT-M64 | Artist is signed by record label | Label project finance does not directly create chart score |
| AT-M65 | Site receives valid deep link to artist | Preview artist/eligible track without exposing private content |
| AT-M66 | Award ceremony replays popular song | Individual opted-in, evidenced listens follow normal per-account caps |
| AT-M67 | Two release versions refer to one master | No duplicated official ranking from indexing alias copies |
| AT-M68 | Public chart empty after close | Honest no-qualified-songs copy; fans still browse music |
| AT-M69 | Server event scheduler replays `ReleasePublished` twice | One song index and one eligibility transition |
| AT-M70 | Same user creates track and repeatedly plays it | Self-listening allowed as user experience, but own-song listening excluded from official chart points [D] |

**One further anti-self-boost baseline [D]:** The artist who owns an official release, and any credited performer on it, can listen for rehearsal/pleasure but **their own playback, saves and staged attendances do not contribute points to that song**. The exclusion is small and makes artist-owned alts less attractive, though detecting undisclosed linked identities still requires integrity review. Record-label and promoter accounts not credited as performers are not automatically excluded merely for their economic relationship, but suspicious coordinated paid activity can be excluded under the same policy. This rule is already reflected in AT-M70 and must be implemented by the score projector.

# 36. Player-story stress tests: three music ecosystems, seven days

These scenarios test choice, fairness, small audiences and interaction across roles. They are not forecasts of adoption.

| Day | Artist A — real independent musician | Artist B — amateur beat maker | Artist C — wealthy label-backed act | Fans, venues, promoters and labels |
| --- | --- | --- | --- | --- |
| Monday | Imports an existing professionally recorded song | Creates a funny instrumental from starter loops | Reviews release finance and publicity | Fans hang out and listen to existing songs; label scouts new work |
| Tuesday | Applies to free open mic | Records vocals, saves DIY project | Rents a prominent upcoming poster slot | Venue operator organises open mic; promoter supplies a paid placement |
| Wednesday | Completes approved Friday submission | Submits DIY song on time | Completes Friday credits, rights and approvals | City receives scheduled releases, not yet public audio |
| Thursday | Shares authorised release card | Practices Stage Mode | Label funds an event, reserves a venue slot | Followers inspect upcoming dates; private preview remains embargoed |
| Friday 18:30 | Sees last week's historical charts | Watches the reveal with friends | Reviews genuine prior results | City chart reveal is a social moment |
| Friday 19:00 | Song becomes available at Release Hall | Comic track becomes available on equal terms | Well-funded track becomes available | Fans choose, hear, save or ignore; ads create visibility only |
| Saturday | Performs at venue, meets listeners | Holds short open mic with friends | Runs expensive headline show with uncertain demand | Venue, promoter, label and audience record real outcomes |
| Sunday | Checks authentic aggregated response | Receives producer request; makes another draft | Reassesses finance vs actual listening | Users share collections; song popularity may shift naturally |

**Seven-day finding:** A requires no game funds to be discoverable; B needn't be professionally skilled; C can spend big without guaranteeing chart success. Fans are the deciding audience, and the venue, promo and label professions each have useful work without manufacturing plays. The most interesting moments remain in-world: meeting artists at a release, discovering music in a room, attending a stage show and seeing which song genuinely resonates.

# 37. Telemetry and game-balancing gates

| Instrument | Why it matters | Early alpha warning sign |
| --- | --- | --- |
| From first entry to first self-selected music playback | Discovery onboarding | Players leave without hearing a song |
| From music play to save, follow or ticket intent | Genuine connection | Posters generate clicks but no meaningful listening |
| Unique qualifying listeners per released song/week | Breadth of discovery | Majority of tracks have no humans listening |
| Fresh Finds share of listens from new artists | Exposure fairness | New artists invisible without paid ads |
| Chart top-ten concentration by active performer/label | Power concentration | One funded network dominates every display |
| Median/variance of unique listeners by source | Channel usefulness | Ads make impression numbers only; no voluntary plays |
| Event check-ins vs actual opted-in listeners | Truthful concerts | Show attendance incorrectly treated as streams |
| False-positive integrity appeals and reversal rates | Trust/safety | Legitimate rising artists held frequently |
| Time from rights hold to playback denial | Copyright/safety | Removed music continues from stale cached media |
| Distinct listeners vs repeat-listen share | Bot/cap calibration | Ranking driven overwhelmingly by one person's loops |
| Share of users with zero Game ₦ who discover/attend | Accessibility | Music becomes gated by business spending |
| Song discovery by virtual district with privacy floor | Local cultural differentiation | Districts are cosmetic copies or easily gamed |
| First-song vs aged-catalogue qualified plays | Sustained music lifecycle | All old music disappears immediately or new releases get no surface |
| Player complaints about soundtrack/audio focus | Social audio quality | Music overlaps or auto-plays intrusively |

**Release gates:** Run small human playtests with 5, 20 and 50 concurrent users. Success is not merely that the algorithm returns a list; it is that players voluntarily hear music, understand why a chart position is legitimate, can discover someone not already famous, and can report problems without drama. Test a novice who never produces music, a professional artist uploading real music, a promoter, a venue operator and a label owner. Review false positives and affordability alongside engagement. No guaranteed ranking or fictional revenue is permitted as a retention hack.

# 38. Implementation phases and ownership

**Phase 0 — Shared foundations:** Stable user/artist/song IDs; authentication; rights/approved releases; publish clock; signed asset URLs; audit events; responsive phone and accessible audio controls. No chart points without verified authoritative song state.

**Phase 1 — Playable physical discovery:** One Release Hall wall, one public listening kiosk, one mobile Music Collection, personal soundtrack, search and Save; simple unsponsored New/Fresh Finds inventory; released tracks have working links. This phase must be enjoyable with ten humans and have no false listen metrics.

**Phase 2 — Evidence-based charts:** Playback tokens, progress integrity, explicit qualification, dedup, weekly score version, one district affiliation, Lagos and district snapshots, Friday reveal, correction pipeline. Ship alongside admin anomaly review; never launch competitive rankings from client-side play counts alone.

**Phase 3 — Shared events and marketplace integration:** Authorised public-room playback, real EventService check-ins, capped live bonus, promoter referral analytics, paid/organic separation, label scouting insights, venue programming. Use *one* canonical song player/token authority.

**Phase 4 — Prestige and scale:** Season chart history, Destiny Awards inputs, memorable world screens, robust large-catalogue index, scaling/caching, comprehensive moderation/privacy review and additional local-scene exploration. Advanced recommender ML, real-world royalties, public API syndication, AI music generation and massive stadium streaming are **not V1 requirements**.

**Engineering owner matrix [D]:** Release/rights team owns publication; game client owns physical stations and player audio UI; playback backend owns evidence; ChartService owns rankings/corrections; Social owns collections/permissions; Events owns live sessions; trust/safety owns moderation; platform ops owns monitoring. One owner must resolve each integration contract before launch. All monetary transactions remain in Economy/EventService, not inside chart code.

# 39. Consolidated decision register and postponed work

| Decision | V1 outcome | Status / revision note |
| --- | --- | --- |
| Source of chartable music | Cleared playable public music imported or created inside studio | [C] |
| Real-vs-DIY score advantage | None | [C/D] |
| Official batch frequency | Friday only; one releasing appearance per performer | [C] |
| Deadline and reveal | Wed 18:00 / Thu 18:00 / Fri 18:30 charts / Fri 19:00 release | [D from Artist] |
| Window | Friday 18:00 to next Friday 17:59:59 WAT | [D from Artist] |
| Chart structure | Lagos, district, newcomer spotlight with common scorer | [D] |
| Score | First listen 1, diminishing repeats, one verified initial save, one capped live bonus | [D; test weights] |
| Score cap | 3.05 per qualified eligible human player/song/week | [D; test weights] |
| Chart minimum distinct listeners | 5 Lagos / 3 district | [D; alpha calibration] |
| Territory | One locked virtual home district per player/chart week | [D; abuse protection] |
| Own song self-plays | Can listen personally; chart score excluded | [D] |
| Purchased publicity | Visibility only; score zero unless real fan chooses to engage | [C] |
| External Spotify/TikTok metrics | Never chart score | [C] |
| Song soundtrack | Allowed, private, standard capped qualification | [C/D] |
| NPC listening | Never counted | [C] |
| Chart transparency | Score version, tie breaks, final status and corrections | [D] |
| Reproducibility | Immutable event inputs + deterministic projector/snapshots | [D] |
| Fraud policy | Graduated holds, contextual human review/appeal | [D/X] |
| Fan privacy | Aggregated analytics, consent, minimised retained identity | [D/X] |
| Per-stream Game ₦ royalty | None | [C] |
| Advanced recommendation AI | Later; not required to ship discovery | [F] |
| Real Spotify/Apple chart ingestion | Not a ranking input | [C] |
| Public paid playlist insertion | Not a separate V1 product | [F] |
| Full album charts | Later | [F] |
| Native Lagos Life wallet/3D avatars | Only with verified, authorised SDK support; not assumed | [X] |

# 40. Handoff: binding contracts for Chapters 8 and 9

**Chapter 8 — Economy & Contracts must implement:** Finite Game ₦ sources/sinks; personal vs company accounting; venue hire; ticket reserves/refunds; project financing; promoter packages; business sale/closure; voluntary gifts and capped event backers. It must expressly **reject automatic currency minting** from `PlaybackQualified`, `ChartPublished`, `SongSaved`, `ArtistFollowChanged`, NPC attendance, poster impressions and Destiny Award rank. Any monetary prize must come from an explicit funded payer/treasury source under a separate rule. Music, charts and money records are not interchangeable.

**Chapter 9 — World, NPCs & Operations must implement:** A compact active district; meaningful player movement and physical interaction stations; NPC basic services but zero fake audience; in-world Release Hall billboard and sound design; privacy/safety operations; session routing; audio CDN rights enforcement; client performance modes; Friday live-service operations; chart moderation staff workflows; near-real-time content withdrawal; incident runbooks. A venue may contain dozens of ambient figures, but the public chart may list only qualified real human activity.

**Integration invariants that cannot regress:**

1. A valid approved work is public only from its authorised Friday release time; no partner preview/sponsored post/event can accidentally leak full unreleased audio.
2. No client route, payment, avatar animation, poster, venue, NPC or per-stream reward can inject chart points directly. Only ChartService validates canonical human play evidence.
3. One person is counted once as a distinct human account per song/week even if they visit multiple venues, playlists and devices; repeat score is bounded and verifiable.
4. Small artists and zero-balance fans retain discoverability and playable activities; labels/promoters purchase opportunities for attention, not guaranteed results.
5. Public charts correspond to declared scoring windows, dated finality, deterministic ranking and appealable corrections.
6. Song rights/identity and fan privacy outrank growth features. No removed track continues playing from a stale cached signed URL after an enforced restriction.
7. One player may be artist, fan, beatmaker, freelance promoter and owner of at most one business; no permanent artificial profession class is required to hear/share music.
8. A listener's music preference does not equal a ticket purchase, a contractual endorsement, an award vote or permission to receive unsolicited messages.

---

## Document sign-off and revision discipline

**Baseline review status:** Complete for Chapter 7 system design, not a production proof of correct human verification, music licensing, SDK support or real-population balancing. Section 11's weights, Section 12's district attribution and Section 14's public-ranking minimums are actionable values for a first prototype. They are **explicitly configurable** and must be validated in the small-public-alpha stress tests before being treated as release-final.

**When these rules change:** Record the identifier, old/new formula or eligibility rule, reason, affected chart-week versions, user-visible explanation and compatibility impact. Never rewrite old records without an auditable correction process. The founder can revise gameplay decisions later; engineers must not silently replace settled principles with more convenient or monetisable mechanics.

**Upstream documents retained as separate authorities:**

- `THE_SCENE_HPATH_Architecture_Amendment_v0.2.md`
- `THE_SCENE_Artist_Career_Foundation_v0.4.md`
- `THE_SCENE_Venue_Operator_Foundation_v0.3.md`
- `THE_SCENE_Record_Label_Career_Spec_v1.0.md`
- `THE_SCENE_Promoter_Career_and_Agency_Spec_v1.0.md`
- `THE_SCENE_Fan_and_Social_Experience_Spec_v1.0.md`
- `THE_SCENE_Concerts_and_Shared_Events_Spec_v1.0.md`

**Next canonical deliverable:** THE SCENE Chapter 8 — Economy & Contracts. It must keep the internal simulated-currency economy distinct from any future Lagos Life native-wallet features until those features are officially confirmed and authorised.
