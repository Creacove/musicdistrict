# THE SCENE
## Chapter 5 — Fan & Social Experience: Standalone V1 Game Design and System Specification

**Version:** 1.0  
**Date:** 12 October 2026  
**Document owner:** THE SCENE game design  
**Status:** Working implementation baseline, consolidated from founder-approved direction and explicitly labelled design decisions  
**Scope:** Fan experience, friendships, shared music, artist communities, player identity, social spaces, attendance-facing flows, privacy, trust and technical contracts  
**Next chapter:** Concerts & Shared Events (event production, show orchestration, technical fan concurrency and event settlement)

> **North star:** THE SCENE is a persistent, self-hosted, mobile-first, 3D social music-industry life simulator. A person who never owns a business or makes music must still enjoy visiting THE SCENE. Fans are actual human players whose voluntary listening, friendships and attendance make the world worth inhabiting. No player purchases genuine popularity, and no NPC impersonates a human fan.

### Reading and precedence

- **[C] Confirmed direction:** Explicitly established or approved by the founder in previous design reviews.
- **[D] Design baseline:** This chapter resolves a previously open mechanic into a concrete, testable V1 rule. It is recommended and implementation-ready as a baseline, **not** a claim that the founder individually signed off on every number.
- **[X] External gate:** Requires rights, safety/legal, provider, user-research or technical confirmation before production use.
- **[F] Future:** Preserve the concept but do not claim it is in V1.

**Canonical companions:** H-Path Architecture Amendment v0.2; Venue Operator Foundation v0.3; Artist Career Foundation v0.4; Record Label Career Specification v1.0; Promoter Career and Promotion Agency Specification v1.0. This chapter clarifies the **fan-facing** contract for those systems and does not replace their pricing, music-rights, company ownership or contract rules. Where a later shared event/economy document supplies the definitive backend contract, that service wins and this chapter remains the consumer-experience requirement. The user-facing interaction must not contradict authoritative settlement and capacity rules.

---

# 1. Executive design decision

**THE SCENE does not have a Fan character class. [C]** Every eligible player is a potential fan, including artists, record-label owners, venue operators, promoters, beatmakers and wealthy non-business players. A fan is a relationship to music, performers, other people and places. A new account begins as a person in the world, not as a forced occupation.

**Fan success is enjoyment rather than financial progression. [C]** A player can discover a song, follow its artist, make a friend, dance, attend a free open mic and leave with a memorable experience without having or earning a single game naira. The player can also voluntarily buy a ticket or send a personal gift from an available authorised balance. Free access is not a temporary tutorial privilege.

**The player's presence must be real, not simulated for business KPIs. [C]** NPCs may greet, staff and visually populate places; they cannot become genuine followers, human ticket buyers, unique listeners, authentic reviews, award voters or chart points. Virtual money spent on promotion buys visibility or services, not a fabricated human reaction.

**The world must be physical but usable. [C/D]** Discovery kiosks, venue entry, speakers, poster boards, release walls, dance floors and personal-room displays have real 3D representations and readable interaction prompts. The in-game phone supplies equivalent efficient and accessible routes for repeat actions. Neither giant forms nor walking back and forth through five rooms is required for simple follow, save or RSVP actions.

**A scene is valuable only if someone genuinely wants to be there. [D]** The core loop is `Explore -> Hear -> React -> Connect -> Share/Attend -> Remember -> Return`; none of the stages is compulsory. A player can spend a whole evening socialising without a quest or contract.

## 1.1 Non-negotiable launch invariants

1. One persistent avatar/person, any permitted creative activities and **at most one active registered company** at a time. Personal fandom is not a company asset.
2. Players can listen, follow, save, socialise and use free public locations while their standalone game balance is zero.
3. Following an artist, becoming friends and joining a fan community are **different, independently consented** actions.
4. An artist or their explicitly authorised organiser controls any **official artist listening party**; ordinary fans cannot declare one official.
5. A user's personal soundtrack is private audio; the shared room/event soundtrack has one authorised source with audibility controlled by each listener.
6. A shared room speaker loading a track does not create twenty chart-eligible listeners unless eligible humans actually participated under the music rules.
7. A ticket and a room instance are not the same object. Tickets are validated against the one underlying event/session and their real admission cap.
8. Blocks, privacy settings, rights withdrawals and moderation checks apply across world interaction, chat, fan groups, notifications, posters, tickets and audio.
9. Personal history records legitimate participation; it is not a purchasable fan rank and does not promise financial compensation.
10. Game currency used here is the **standalone simulation ledger**, not falsely represented as a transferable Lagos Life/Vatar wallet balance. Integration must use only officially authorised capabilities.

# 2. Why the fan experience exists

THE SCENE has artists who create or import music, venue companies that stage events, labels that finance talent, and promoters that place music before relevant audiences. The fan has a different purpose: enjoy a world of music with other people. Without enjoyable fan play, the businesses become isolated economic dashboards competing for fake demand.

The experience must deliver five types of value simultaneously:

| Fan need | Tangible in-world experience | Measurable, non-compulsory outcome |
| --- | --- | --- |
| Hear something new | Release wall, lounge station, friend recommendation | Song chosen, saved or skipped |
| Be with people | Square, venue, dance floor, group travel | Friendship, positive social return |
| Take part | Cheer, emote, dance, attend a real set | Verified event participation and a memory |
| Express taste | Playlists, selected soundtrack, public favourite record | Identity, genuine recommendations |
| See culture evolve | Weekly chart reveal, live shows, Destiny Awards | Historical shared moments, artist milestones |

We should not reward players for involuntary advertisement views, impose daily listening quotas, or pay them to repeatedly press Play. **An optional starter job is a route to money, not the price of accessing community.**

# 3. Player identity, capabilities and H-Path

## 3.1 Universal personal identity

A `PersonProfile` contains the avatar, display name, visible music preferences, voluntary public interests, privacy settings and historical experiences. It is distinct from `ArtistProfile`, `RegisteredCompany`, `CreatorCatalogue` and `FreelancePortfolio`. Ownership of a label or venue does not confer access to another person's fan graph, private chat or memories. Selling a company does not sell personal friendships or followers.

A player may concurrently be: a fan of Kemi, an artist who releases songs, a credited producer who sells instrumentals, a freelance promoter, and owner of exactly one venue/label/agency company. Every activity checks its own permissions and funds; no global `player_class = FAN` field should gate basic interactions.

## 3.2 H-Path for a purely social player

| Stage | Required fan experience |
| --- | --- |
| **H0: Arrive** | Spawn in compact social hub; no career selection, job or purchase required. |
| **H1: Discover** | Hear a chosen public song, see an accessible event board, glimpse real current social activity. |
| **H2: Play** | Choose a track, dance, browse a poster, save music, talk or navigate; all voluntary. |
| **H3: Connect** | Request friendship, follow an artist, join an optional community, invite a group. |
| **H4: Economy** | Free music/social path exists; optional transparent ticketing, cosmetics or gifts. |
| **H5: Remember** | Saved catalogue, visited shows, milestones and opt-in supporter badges accumulate. |
| **H6: Return** | New music, friends and community events appear; if the world is quiet there is still curated listening and public activity. |

# 4. First five minutes: complete no-money player flow

**Persona:** Fola, new account, zero standalone game naira, has no songs and does not select a business.

1. **00:00–00:30 / Consent and arrive.** Loading screen explains social/music world; age eligibility, conduct rules, basic privacy and audio preference are handled in a short accessible first-run gate. World appears only when joined. Fola sees Music Square, a compact cluster of human avatars, a public song kiosk, Release Hall sign, upcoming event billboard and a visible free lounge. Sound does not auto-play before browser permission or a user gesture.
2. **00:30–01:30 / Hear.** Optional `Hear music` prompt highlights kiosk. Fola approaches or activates its phone alternative. Three clearly named categories appear: `New Friday releases`, `Emerging artists` and `Trending in this district`. She taps one approved released song and explicitly starts playback. Preview artwork is physically rendered. A clear `Save` control appears.
3. **01:30–02:15 / React.** Fola saves the track. The song is added once to her personal collection. There is no reward currency. `View artist` and `Follow` are available but optional.
4. **02:15–03:30 / Explore.** Billboard shows actual scheduled free open mic with current verified date, venue and entry terms. She chooses `View event`; the display names performers and indicates that it is a free human-player show (not a simulated attendance promise). She selects `Interested`, which is not admission, a ticket or a paid action.
5. **03:30–04:30 / Connect.** Fola meets another avatar, chooses `Greet`, then `Friend request`. Recipient can accept, decline or ignore. Fola can instead skip this entirely and continue exploring.
6. **04:30–05:00 / Social action.** In the lounge she tries an emote or dance; a companion who accepts an optional paired dance joins. The venue's shared song is audible only according to each player's audio preference. She can save it, but merely standing near speakers does not manufacture a qualified listen.

**Acceptance:** With zero balance, no art/song upload, no company, no contacts and no voice permission, Fola reaches an enjoyable `listen + save + world action` within five minutes in a working live environment. If no human player is online, the kiosk, curated music, NPC ambience and upcoming eligible events still work, but the UI never pretends NPCs are friends.

# 5. Physical social world: where people actually go

## 5.1 Compact world before large map

**[D]** V1 launches with one **compact, navigable entertainment cluster** rather than a physically enormous empty Lagos. District names and venue identities can have distinct cultural identities and venue listings without each requiring a large physically separated map. A new player must reach a social activity in approximately 30–60 seconds of ordinary navigation, subject to device performance. Real player density should guide future geographical expansion, not screenshots of theoretical crowd size.

| Physical space | Fan value | Object interactions | Who controls it |
| --- | --- | --- | --- |
| Music Square | Reliable meetup, discovery, announcements | Chart board, seat, emote stage, event board | City/NPC service and public moderation |
| Release Hall | Ritual for music discovery every Friday | Cover wall, listening pedestal, new-release kiosk | City; MusicService rights |
| Free lounge | Casual shared music and dancing | Speaker control is staff-only; dance floor, seating | City or eligible venue operator under venue rules |
| Public studio lobby | Meet producers/artists; sample public works | Preview approved public instrumentals, collaboration boards | NPC studio and authorised creators |
| Venue entrance/interior | Attend shows, socialise, discover performers | Event card, ticket check, stage and audience interactions | Venue/operator; EventService authoritative |
| Personal room | Self-expression and memories | Shelf, framed album art, concert mementos, invited visit | Owner, with private-by-default access |
| Official artist community | Follow a story with other fans | Virtual community board plus phone chat | Artist and platform moderation |
| Plaza advertising site | Discover events without intrusive DMs | Clearly labelled, consent-based poster inspect | PlacementService / promoter / operator |

Every discoverable interactive object has a nearby tap target, keyboard/gamepad focus where supported, a readable action name and an accessible route through the phone or menu when movement is impractical. Use simple camera transitions and cancel buttons rather than unskippable long animations.

## 5.2 World object design contracts

- **Song pedestal:** `Inspect cover -> See artist/rights-safe metadata -> Tap Play -> Audio starts -> Save/Follow/Share`. Inspect alone is never a listen.
- **Public event board:** `Inspect -> View confirmed event -> Check time, venue, lineup, eligibility, ticket/entry policy -> Interested/Buy/Join`. A `DRAFT` event never displays as a confirmed public ticketed show.
- **Venue door:** `Approach -> Preview current event/status -> Verify permission/ticket -> Enter shared session`. A visual open door does not bypass server capacity.
- **Dance floor:** `Emote -> Animate -> Nearby players see expression`; paired dance only after explicit target consent. No mandatory timing challenge.
- **Release display:** Physical art appears at official Friday publication, not from a private embargoed demo. Removal immediately disables both physical playback and public discovery.
- **Memory display:** Only memorabilia actively chosen by the room owner is visible to visitors; a private listening history is never automatically placed on a public wall.

# 6. Permanent social availability and zero-balance support

At every hour, the world must support: approved free song discovery, exploration, free-emote interaction, saved music, free lounge access, public calendar review and voluntary communication under privacy settings. A city-curated **general public listening rotation** may play released songs through approved shared speakers, even when nobody owns a venue or hosts an event. It cannot be described as an official artist listening party without authorisation.

**[D]** A low-concurrency activity director points players toward an existing active public spot instead of launching empty parallel copies. A `What's happening` sign lists only verified live or scheduled human events and city-curated public activities. NPC clerks, technicians, ushers and background dancers are clearly scenery/service agents, not monetised attendees. An event needs a real human audience to report genuine attendance. Off-hours gameplay does not require continuous concerts, daily log-in penalties or repetitive mandatory quests.

# 7. Music listening: three contexts with one audio policy

## 7.1 Personal listening

A player explicitly taps Play on an approved released song from a profile, kiosk, search or saved collection. The personal player can continue while they move through ordinary non-event spaces. They can pause, skip, repeat and set a permitted personal exploration soundtrack. The selection is remembered, but playback is never silently resumed on initial web load before a user gesture authorises audio.

**[D]** Only one personal track plays per player. Previewing a second song pauses the first rather than layering them. The personal player shows artwork, track title, artist, explicit audio control, duration and a clear `Saved` state. `Set as soundtrack` applies to the player's own exploration context, not to nearby human users.

## 7.2 Shared-space music

A city lounge, venue lounge or authorised public listening station may have a host-controlled audio channel. Its song source is linked to an approved released recording or explicitly authorised artist preview permitted for that session. Human listeners who choose to enable shared music hear a synchronised track position relative to the room timeline. Late joiners hear the current point in the song, not a second out-of-sync copy. The speaker itself cannot force a player to count as a listener.

**[D] Room controls:** Only the city programme service, venue operator within granted rights, event organiser or expressly authorised session host may choose the shared playlist. Ordinary visitors can suggest a track through a moderated queue only if that room explicitly enables requests. Requests never directly interrupt the current performance or override an artist's live set.

## 7.3 Live-event music

When the player joins an eligible live performance session, the **event's authorised programme** is the foreground audio source. The audience should experience one synchronised set, with the performer avatar acting through Stage Mode. Personal music is automatically paused when the live-audio context is chosen. After leaving, the player can resume personal playback manually or via a previously enabled preference; do not create two competing songs.

## 7.4 Audio arbitration priority [D]

`Authorised live event > active shared-room programme > personal player > ambient world music`. Higher-priority **opted-in** audio pauses or ducks lower-priority music; world effects and limited dialogue can be independently controlled. A player can mute any source, and *mute means no claim that they listened*. If an event track is muted, the user can still enjoy visuals, chat and emotes. When all sources are muted, the game remains fully navigable.

**Browser gating:** `AudioContext` is unlocked only after appropriate user action. Handle lost audio focus, mobile suspension, reconnect, Bluetooth output change and tab backgrounding. A backgrounded tab does not silently accrue chart points. Audio can retry with a visible `Tap to enable sound` action. No required microphones, cameras, file downloads or auto-play on first arrival. Recording is an Artist Studio activity with its own permissions.

# 8. What counts as listening, versus mere exposure

**This chapter inherits Artist v0.4's definitive provisional scoring rules; it must not invent a second chart formula.** The server keeps at least four concepts separate: `raw playback start`, `qualified human listen`, `unique eligible listener`, `chart contribution`. A poster impression, song preload, muted speaker, NPC avatar, ticket sale or event check-in alone is not a qualified music play.

**[D carried from Artist v0.4]** A qualified listen requires an eligible account, intentional play or eligible actively heard context, audio enabled, verified foreground/listening duration of **at least `max(10 seconds, min(30 seconds, 50% of track duration))`**, and fraud checks. The minimum V1 released track is 30 seconds, so typical threshold is 15–30 seconds. Device autoplay/reconnect duplication cannot mint multiple plays.

**[D carried from Artist v0.4]** Proposed **weekly chart score per human, per song**: first qualified exposure 40; first two voluntary qualified replays 12 then 8; first verified save 25; first eligible verified live-performance attendance associated with that song 15; overall maximum 100. These are balancing defaults and can be changed through versioned rules *only prospectively*. A saved song alone does not automatically become a qualified listening session. Before award/leaderboard publication the server filters fraud and invalid records.

**[D carried from Artist v0.4]** Home-district identity is selected and can be changed at most once per 28 days; event engagement may be attributed to the venue district under the distinct event-bonus rule. Lagos aggregation deduplicates by person/song/week. No player can turn one soundtrack loop into infinite points by travelling between districts. Historical user interest can be preserved while chart-eligible counts are later corrected after integrity review.

**Chart clock:** Friday 18:00 WAT through following Friday 17:59:59 for an official scoring interval. Prior results revealed **Friday 18:30**, new approved releases go public **Friday 19:00**. A player opening a Friday release wall at 18:50 sees the scheduled future release card, but cannot play the embargoed master. Last week's positions are not replaced by a live unverified popularity counter.

# 9. Music collection, playlists and discovery trails

The player's free personal Music Collection contains explicitly saved released songs, personally created playlists, selected soundtrack and optional memorable discovery context. The collection follows the personal identity across business changes. Save/unsave is idempotent; one player cannot create ten saves by switching devices. Playlist entry does not imply song ownership, download rights or automatic public repost permission.

**[D] Limits for V1:** up to 20 editable personal playlists, 100 songs per playlist, and no artificial cap on unique saved published songs within reasonable service quotas. Lists are private by default; a player may mark an individual playlist public or share it by permissioned link. Shared lists expose creator display name and approved public-song metadata, **not** private listening analytics, private drafts or follows that the player hides. Playlist owners can remove entries anytime; other players' previously saved songs persist independently.

If a song is restricted or taken down, the entry stays as an `Unavailable` placeholder where permitted for memory/collection integrity, but offers **no playback or copy of infringing audio**. A reinstated recording can recover its position. Unreleased demos and artist-private booth recordings are never valid public playlist entries.

### 9.1 Music discovery surfaces

- **Release Hall:** official Friday releases, emerging acts, district selections, normal search; labelled paid placements if present.
- **Friend recommendation:** opt-in song card in a direct message; never automatically plays or saves.
- **Artist profile:** clear released catalogue, credits, upcoming eligible shows, follow/community actions.
- **Public lounge:** authorised shared audio with explicit current-track identification and artist attribution.
- **Concert:** track identification during permitted Stage Mode; actions to save/follow without leaving the show.
- **Public playlist:** curated voluntarily by another player; cannot sell official charts or verified-placement guarantees.

**[D] Discovery ranking principles:** display familiar, emerging and random exploration lanes; rotate over eligible released content; avoid only showing already-famous or paid artists. A new user can find music with no profile history. A paid poster or sponsored card must be distinguishable from editorial discovery. The recommender never gets authority to create paid streams, follows or chart points.

# 10. Friendships, follows and fan-community membership

| Relationship | Created by | Consent | Visibility | Financial effect |
| --- | --- | --- | --- | --- |
| **Friend** | One player requests; recipient accepts | Mutual | Depends on privacy; may expose allowed online status | None |
| **Artist follow** | Fan taps Follow on public artist | Fan initiated; artist need not approve public follow | Public aggregate; user identity controlled by privacy | None |
| **Fan-community membership** | User elects Join; community checks eligibility | User initiated, artist-configured admission | Community participants only within rules | None |
| **Temporary group** | Invite and accept | Every member accepts | Group only | No common wallet |
| **Event interest/RSVP** | User clicks Interested / RSVP | Individual | User preference; organiser sees allowed aggregates | None unless separately ticketed |

Being a friend does not automatically follow the other player as an artist. Following does not automatically join their fan community. An artist with 10,000 followers cannot DM all 10,000 followers as though they were mutual friends. Leaving a fan community does not automatically unfollow unless the user explicitly selects both.

# 11. Friend requests, messages and social contact rules

## 11.1 In-world interaction

`Approach/avatar inspect -> Greet / Public profile / Request friendship / Invite to dance (eligible) / Block / Report`. The inspection overlay reveals only voluntarily public identity. Interaction range, line of sight and deliberate action reduce drive-by spam; corresponding phone actions work for existing contacts and permissioned messaging.

**[D] Friends:** pending requests expire after seven days; a person may keep at most 20 pending outgoing requests, and a recipient cannot receive repeated prompts from the same sender while declined or recently dismissed. Repeated malicious retries are rate-limited. `Accept` is idempotent across devices. Friends may later unfriend without exposing a reason. A block takes precedence over accepted or pending friendship.

**[D] Direct messages:** mutual friends can message by default, unless one or both switch the stricter setting off. Non-friends may send at most one optional **message request** through an expressly enabled professional contact channel (e.g., an artist's `Bookings` contact), not via a public follow. The recipient may accept or ignore. Messages from blocked accounts are rejected before delivery. User-to-user promotional spam, external contact harvesting and automated blast DMs are not legitimate promotion.

## 11.2 Chat channels

- **Local text chat:** opt-in proximity/public-zone channel; line limit and spam throttles; plain messages never automatically disclose identity outside the zone. A player may mute the channel.
- **Friend DM:** private to the two permitted accounts, subject to platform safety and lawful moderation procedures.
- **Temporary group chat:** only accepted current members; membership changes are visible; history access policy is explicit.
- **Official fan community:** artist-governed text space; separate from friends or direct DM.
- **Event live chat:** organiser/venue may enable moderated show-room chat, with slow mode and disable switch under incident response.

For V1, **no open voice chat**. No mandatory microphone access or real-world geolocation exchange. Public chat can use text/emotes and preset safe reactions. Profanity/spam filtering and human escalation routes are required, but the game must not falsely claim that automated moderation is perfect.

# 12. Social groups and moving around together

**[D] Lightweight `Party` (social group):** maximum four actual human avatars including leader, no permanent guild structure and no pooled money. Invitation expires after ten minutes. Any member may leave. Leader leaving transfers leadership to the longest-present remaining member, or dissolves an empty group. Group chat and travel are available while membership is active; it is not a career, company, fan community or legal contract.

**Group travel sequence:** leader selects destination -> service checks each member's privacy/availability -> group receives proposal -> participating members approve -> server chooses a compatible active instance with enough capacity -> members travel. **No member can be teleported without a specific opt-in.** An event requires each attendee's own valid entry entitlement; a group invite is not a ticket and cannot multiply one ticket into four admissions.

**Split/full conditions:** if the preferred event session is full, return `FULL`; the group may choose a different **legitimate scheduled performance**, or some eligible members may go individually after explicit warning. We must never quietly manufacture parallel ticket inventory in a technical copy of the same sold-out 50-seat show. For ordinary non-ticketed public rooms, the resolver can place the group in another suitable open instance and disclose the change.

**[D] Group retention:** an empty group closes automatically. If all members disconnect, the group expires after 30 minutes of inactivity. Reconnecting members can rejoin only if the original group is still valid. An offline friend does not remain a phantom body reserving public-room capacity.

# 13. Artist communities: authority, participation and membership

## 13.1 One official community per artist persona [D]

A released or active artist may activate an official fan community. Fans voluntarily join through artist profile, official release card or permitted artist-owned venue board. The community holds description, community rules, artist posts and moderated member chat. It may have a public read-only introduction without exposing private posts. The artist may suspend participation or moderate members; the platform retains overriding trust/safety authority. A label financing an artist **does not** automatically own the artist's community or gain unrestricted access to its members.

**Roles for V1:** `ARTIST_OWNER`, `MEMBER`, `READ_ONLY_MUTED`, `REMOVED/BANNED`, `PLATFORM_MODERATOR`. No complex club officers, fan payroll or monetised titles. Artists can optionally allow one artist-controlled announcement feed and one general discussion channel; additional custom channels defer until moderation capacity exists. Future delegated community mods require real role/abuse design and are not silently in scope.

## 13.2 Member rights and limits

- Join, leave, mute, report, read and post in eligible channels, subject to artist rules and platform policies.
- Never edit artist releases, sign label contracts, issue official concert announcements on the artist's behalf or transfer community ownership.
- Fan groups cannot create an **official listening event** for an artist without a separate explicit and revocable artist/organiser authorisation token for that particular event.
- An artist cannot forcibly enrol followers in the community or send unlimited DMs through community membership.
- Artist `Pause community` temporarily disables posting while preserving membership/rights-safe archive. `Close community` stops further messages and notifications under the applicable retention policy; closure does not delete personal follow relationships.

**[D] Notification safeguard:** artist-triggered promotional push from a community is capped by server policy to two non-critical announcements in 24 hours; routine posts remain in the feed. Critical event cancellations are service-generated exceptions. Users can mute artist, mute community, or disable push categories independently.

# 14. Official listening parties versus ordinary music sharing

This boundary must be unambiguous because it affects both music rights and artist autonomy.

| Activity | Permitted actor | Public legitimacy | Music allowed |
| --- | --- | --- | --- |
| Save/share a released song privately | Any eligible user | Not an official artist event | Released recording via approved player |
| Play released music with friends in a permitted room | Eligible room host under room rules | Casual listening, no artist endorsement claimed | Released music subject to venue/streaming permission |
| Share personal playlist | Playlist owner | Community curation, not official performance | Released tracks only |
| Official artist listening party | Artist or specifically authorised event organiser | Marked `Official` only when service verifies authority | Released songs, or specific permitted preview subject to rights/embargo |
| City-curated new-music rotation | City programme | Clearly labelled city programme, not artist-hosted | Public approved released songs |
| Private audition demo review | Named invited organiser/collaborator | Not a social fan event | Time-limited permitted private excerpt |

Official status cannot be faked through a text title, poster, venue name or social media share card. A promoter hired for artist publicity can organise an approved session **only with the artist's relevant rights permission**. Revocation before start removes official status and prevents protected previews from playing; event remedies depend on the EventService settlement rules. A free casual gathering does not become authorised to leak an unreleased demo because several friends are present.

# 15. Fan-facing event discovery, invitations and status

Fans discover events via venue doors, real public posters, event boards, artist profiles, friend invitations, fan-community announcements and phone calendar. Each event card must visibly identify:

- **Who:** verified organiser identity, headliner and confirmed guests (with accepted appearance offers); draft guests are clearly `Invited` or omitted.
- **Where:** venue public identity and district, accessible entrance, whether instance requires joining a scheduled session.
- **When:** exact `Africa/Lagos` date, start time and expected duration; show countdown from server time.
- **What:** open mic, release event, artist concert, label showcase, city listening session or Destiny Awards event.
- **Entry:** FREE, ticket price in clearly labelled game simulation currency, or capacity-bound reservation; if ticketed, disclosed purchase/cancellation/refund rules.
- **Availability:** tickets remaining, `Not yet open`, `Available`, `Sold out`, `Postponed`, `Cancelled` or `Completed` from authoritative EventService state.
- **Accessibility/social:** basic expected audio/visual availability, moderation settings, age restrictions if relevant and whether friend group travel is possible.

**`Interested` is a calendar preference, not a promised place.** For capacity-limited free sessions, an actual zero-price admission token may still be required. A poster's click or invitation does not create a ticket, attendee, sale, verified stream or chart point.

# 16. Tickets and entrance from the fan's perspective

Tickets are purchased through the one shared event ledger and event service; the Fan system **does not** invent an independent ticket wallet or refund ledger. In the standalone game, purchase uses permitted simulated funds. In an embedded third-party container, unavailable native-money rails cannot be pretended to exist.

**[D] Default ticket lifecycle:** `AVAILABLE -> HELD (checkout 10 min) -> PURCHASED -> REDEEMED/CHECKED_IN -> COMPLETED`; alternatives `HOLD_EXPIRED`, `CANCELLED`, `REFUND_PENDING`, `REFUNDED`, `VOIDED_FRAUD`. Free capacity-bound reservations use `FREE_RESERVED` with equivalent unique-admission validation. A purchase retry with the same idempotency key must never charge twice. Ticket ownership is account-bound for V1 unless a specifically supported transfer mechanism is later approved.

**Fan entry flow:** approach venue -> door shows correct event and ticket status -> player confirms entry -> server checks time window, valid entitlement, event status, unique person/account, safety access policy and global capacity -> avatar joins correct live session -> ticket records one check-in -> user may leave/rejoin the same session until event closes without another ticket debit or attendance credit.

**[D] Default remedies in fan UI:** organiser cancellation or platform/venue failure before a show triggers refund eligibility under the shared event policy; if the event cannot be delivered, do not simply keep the player's ticket money. Optional player-initiated cancellation/refund terms must be explicitly visible before purchase; no undisclosed penalty or negative personal balance. A reschedule requires notification and a published accept/refund path. Exact grace windows, percentages, no-show treatment, supplier liability and chargeback flow are **owned by the forthcoming Events/Economy chapter** and must be fixed before live money testing.

**Waitlist [D]:** sold-out ticketed events may offer an opt-in, non-paying waitlist with a time-limited offer if a legitimate ticket returns to inventory. Being waitlisted never guarantees a ticket or pre-charges money. The system never promises a player can attend solely because a technical server may have more capacity than the venue's published admission limit.

# 17. Attending a live performance: actual fan gameplay

A fan who enters a show should have expressive things to do, not merely watch an audio file. The core interaction is **music + shared audience behaviour + meaningful social choice**.

**Before the set:** meet friends in lobby, inspect performers, save the upcoming event card, choose a standing/viewing location, mute or enable event audio. Entry and access use server-validated ticket, not local animation completion.

**During the set:** move within permitted audience area; dance, cheer, applaud, wave, raise hands, trigger time-appropriate collective reactions, view current cleared track, save/recommend it, follow the artist and use moderated event chat. The performer controls setlist and allowed Stage Mode actions; fans do not overwrite the stage programme or trigger unauthorised lighting effects. Reactions may influence a visible but non-monetary energy/atmosphere cue; they **do not** auto-create chart points, paid attendance or guaranteed earnings.

**After the set:** view summary of recordings genuinely heard, selectively follow/save, receive eligible concert memory, invite friends to next confirmed event and leave safely. A fan may still enjoy the performance visually while muted; this affects qualified music-listen evidence, not whether the human checked into the event.

### 17.1 Stage/audience synchronisation boundaries

The `EventService` governs show timeline, actual lineup, confirmed participants, duration, start/stop, check-ins, refunds and event finance. `StageMode` governs performer motions and authorised effect timing. `AudioService` governs synchronised music. `SocialService` governs permitted emotes and chat. `FanHistoryService` records verified human attendance only once. This separation avoids the fan's emote button becoming a finance or artist-performance control.

**[D] Attendance-history qualification:** one human account checked in and present during LIVE for an aggregated **at least 5 minutes, or at least half the scheduled live duration for a show under 10 minutes**, with an upper practical cap on required presence if a later event format lasts many hours. This is a **memory qualification**, not the paid-ticket count or per-song chart qualification. Rejoin durations accumulate idempotently. On abrupt server failure, honest attendance may be reconciled from trusted heartbeat evidence; don't punish an entire audience for platform downtime. Exact song chart engagement still follows Artist v0.4 and rights checks.

# 18. Group attendance, sold-out shows and technical instances

A unique physical venue and its scheduled public session have one authoritative admission pool. `ticket.session_id` references that logical event session, not whichever WebSocket room/3D server the client first connects to. The `JoinCoordinator` maps entitled people and their chosen friends into actual runtime shards while preserving the same public event identity and global sold cap.

**[D] V1 priority:** design excellent, genuinely shared events for 20–50 real players. Do not sell 5,000 tickets for a room that cannot deliver a meaningful shared performance. Arena architecture may exist in the 3D asset list, but prestige and financial projections cannot treat ambience NPCs as purchasers or attendees.

If event production later supports synchronized multi-shard broadcasts, every shard is clearly a technical view of the same real event, global ticket cap is enforced, fan group placement is best-effort, and capacity changes require truthful public disclosure. No attendee can earn multiple concert memories by reconnecting or entering two shards. A hidden copy is not a second paid performance unless it is distinctly scheduled with its own tickets and performer commitment.

# 19. Personal history, early supporters and fan reputation

**Every participant gets history appropriate to what they did. [C]** The same concert can add: a performance entry for the artist, a hosting entry for the venue, a service case for the promoter, a qualifying support entry for a label, and a memory for an attendee. Each entry points to the same underlying `event_id` and verified role, not to independently fabricated copies.

The fan's **My Scene** includes voluntary public badges and private detailed memories: first saved record, first attended live show, performances attended, past Friday release discoveries, selected concert posters and Destiny Awards attendance. These are collectible historical artefacts, not tradable items, monetary investments or pay-to-influence ranks.

**Early supporter [D]:** If a user genuinely followed an artist **before that artist's first verified district Top 20 or Lagos Top 100 entry**, the personal record may show an `Early Supporter` entry when the chart milestone later occurs. Store original follow time and first qualifying official chart milestone. A fan cannot create earlier history by unfollow/re-follow or changing phone clocks. Artists do not automatically receive a named list of every early fan. The fan chooses whether to display the badge; protected historical metadata remains subject to deletion and safety policies.

**Tastemaker [D]:** A profile may show self-chosen public playlists and verifiable early discoveries, without another currency, follower-based chart multipliers, fan ranks sold for money or retroactive financial rights in an artist. The value of tastemaking emerges when friends choose to listen, not from a special `+10 chart weight` privilege.

# 20. Personal room and self-expression without property compulsion

**[D]** Every avatar gets a small starter personal room at no charge; it is not a second registered company, business property title or mandatory housing expense. Basic item placements include favourite released record sleeve, personal playlist display, small concert poster, achievement shelf, mirror/avatar customisation and seating. Selected artworks render from authorised, moderated media only. Limited optional cosmetic furniture may have cost; public expression always has a free base path.

Rooms are private by default. A player can invite up to **three accepted friends simultaneously** in V1 (four avatars including owner), with each invitation checked independently. Owner can revoke access or close room immediately. A guest cannot inspect hidden financial data, private messages, unreleased music, backstage assets or reserved label funds merely by entering. Ordinary released music can be heard through allowed personal/room mechanisms; access to private pre-release demos is not granted through visiting a bedroom.

No construction/landlord/property speculation loop is in scope. Room decoration is a supporting identity activity, not an alternative real-estate business. Room upgrade packs are optional and should not grant chart influence, artist reach or social safety bypass.

# 21. Notifications: useful relationship signals, not marketing spam

**Categories [D]:** direct safety/system, confirmed ticket/event changes, direct friend/group invitation, followed artist release, followed artist booked performance, artist-community announcement, optional discovery digest, business/professional messages. The player can set per-category opt-in and in-app/push preferences, and mute any artist/community. Safety-critical notices cannot be hidden from mandatory account-state records even when push is off.

**Default principle:** important events should be delivered once, with accurate deep links and clear dates. A promoter buying a wall poster does **not** acquire permission to send all players push notifications or private messages. Following an artist doesn't automatically subscribe a fan to every general chat reply.

**[D] Starter policy:** one automatic release reminder per artist per eligible Friday; one initial announcement per confirmed upcoming show per follower, plus one schedule-change notification if material; category digest rather than individually notifying dozens of routine community posts. The server enforces collapse keys (`artist_id + release_id + type`, `event_id + change_version`) and reasonable notification rate caps. No alert for a speculative offer, unconfirmed guest or pending rights review disguised as a live release.

**Device scenarios:** push token absent/expired -> in-app inbox still works; multiple devices -> one logical notification identity, read status syncs; muted artist -> no routine follow alerts; banned account -> no outbound notifications; event cancelled -> ticket holders receive the authoritative cancellation notice regardless of marketing preferences.

# 22. Promotion and social attention must not collide

Promoters may make physical posters, purchase finite public-placement inventory, run authorised listening sessions and share publicly accessible event/release links. These actions create *opportunities* for genuine choice. They must not commandeer the player's friend list, autoplay music, follow artists on a user's behalf or generate unsolicited DM blasts.

**[D] Paid placements** are marked `Sponsored` at inspect/play UI and have defined time windows, location, eligible rights and campaign IDs. A player may dismiss a specific ad detail view, leave the area or mute marketing surfaces where appropriate; core navigation remains usable. Promotions can link to legitimate available songs and confirmed event information. A fan's `Save`, `Follow`, `Buy` and `Join` always require an explicit act and server validation.

**Attribution:** ad view, interaction, chosen playback, qualified listening, follow, ticket purchase and redeemed attendance are separate events. Campaign reporting may aggregate genuine conversions with privacy-preserving rules but must not expose individual private listening trails to the advertiser. Promoter reports do not grant the client personal access to every listener's profile.

# 23. Fan economy: optional spending and clean source of funds

| Action | Cost | Party who can initiate | Accounting rule |
| --- | --- | --- | --- |
| Explore, play released song, save, follow | Free | Any eligible human | No ledger debit or auto-reward |
| Attend free public event | Free; capacity token may apply | Any eligible human | No revenue event created |
| Buy ticket | Posted price | Eligible individual | Reserved/settled once via EventService + LedgerService |
| Buy optional cosmetics | Transparent listed price | Eligible individual | Cosmetic purchase; not popularity/eligibility |
| Buy optional personal decor | Transparent listed price | Eligible individual | Appearance asset, no chart weight |
| Voluntary gift/transfer | User-chosen amount | Eligible permitted payer | One explicit transfer, no implied ownership/profit share |
| Back a specific authorised event | Contract-defined amount | Eligible payer meeting funding rules | Separate optional event-financing activity, not fan class |

**[C]** Voluntary gifts are ordinary transfers, not an investment contract or special sponsorship taxonomy. A fan can send permitted standalone simulated game money to an artist, but the transfer does not increase their ranking, receive an artist royalty or control future releases.

**[D] Anti-abuse:** transfer confirmation always states recipient, amount, currency type and irreversible/contestable policy; require sufficient available balance and server authority; never transfer reserved label/project money as a fan gift. Repeat high-risk transactions may trigger rate limits, verification or review. Chargebacks/refunds and fraudulent/self-dealing transfers are handled by the shared ledger; no client arithmetic substitutes for signed server records. No player has a negative surprise balance or automatic real-money cash-out.

**[X] Lagos Life/Vatar:** the prior integration review confirmed an independent HTTPS game and supported identity/SDK functions, but did **not** establish generic third-party game-naira balance reads, personal gifts, arbitrary ticket purchases, business settlement or 3D avatar porting. Treat standalone currency and Lagos Life's native currency as distinct until verified authorised APIs exist. Do not use 2–4-player stake flows to simulate fan payments.

# 24. Privacy, safety and age scope

This is a live multiplayer music environment with user-generated recordings, chats, personal profiles and virtual transfers. Safety is a product requirement, not a decorative settings panel.

**[D/X] Launch age policy:** Design V1 with an **18+ default access policy pending legal/safety review**. That is a conservative launch recommendation, not a claim that an age gate alone verifies adulthood or meets all jurisdictions' laws. If the product later allows younger audiences, revisit messaging defaults, discovery, profiling, parental consent, moderation and payment safeguards before opening access.

**Minimum individual controls:** report account/content/message/song/post/event; block user; mute local chat; restrict friend requests; opt out of non-friend contact; hide or limit online presence/location visibility; leave social group; withdraw community participation; mute push; disable shared audio. All controls must exist on mobile without requiring a precise mouse target.

**Default data visibility [D]:** public display name/avatar and voluntarily public artist/creative achievements; friends-only online status by default; exact current instance/location never public to strangers; saved music/playlists private until actively shared; transaction amounts private to parties and applicable company/operator view; aggregate artist fan counts public but a named fan list not public by default. A public chart record can display artist/song stats without revealing an individual listener's private behaviour.

**Block semantics [D]:** blocking rejects new direct messages, requests, paired emotes, invitations and friend/community private interactions from blocked parties; removes pending friendship; mutes relevant user-generated messages; hides direct profile prompts where feasible. It does **not** promise that the players can never physically be in the same large public world; for safety, provide `leave instance`, staff moderation and appropriate visibility suppression. Historical public event counts are not falsified by a block. Blocking a promoter does not erase an existing ticket contract or remove a legitimate refund entitlement.

**Data lifecycle:** retain only necessary trusted logs for moderation, financial settlement, listening integrity and fraud review. Provide account-level deletion/export processes and clear privacy notices; exact retention durations, reporting jurisdiction, cross-border processors and disclosure rules are **[X] legal/privacy review gates**. Public badges derived from private activity should be revocable from public display; rights complaints may require a safe internal audit trail without continued public media access.

# 25. Moderation and incident operations

## 25.1 Supported report types

Harassment, hate/abusive messages, sexual exploitation, threats, impersonation, spam/scams, unauthorised music/copyright, offensive artwork, fraudulent engagements, ticket/event deception and payment abuse. Reports include a server-derived content/event reference plus limited permitted context, not arbitrary broad access to another user's private messages. Moderators have auditable privileges and minimum necessary access.

## 25.2 Moderation sequence [D]

`Report -> acknowledge -> classify urgency -> temporary risk controls where warranted -> review evidence -> enforce/reinstate -> notify permitted parties -> offer an appeal route for significant actions`. Extreme danger requires an escalation path consistent with the platform's safety policy. User blocking is immediate and does not require moderator approval.

**Available remedies:** remove message, mute local channel, restrict DM access, remove group member, suspend fan community, take down rights-invalid song, revoke an abusive event advertisement, restrict account or suspend access. Financial disputes are routed to the shared event/ledger review without permitting community moderators to debit wallets. Punishment should be proportional, recorded and appealable where appropriate.

## 25.3 Rights and content consistency

If a recording is taken down: public song playback and public shared speaker use cease; related posters/listening sessions pause or update; saved copies show unavailable; legitimate historical fact that a concert occurred need not vanish, but its media should no longer be accessible. A promoted or private preview never acquires wider public rights because a user forwarded a link. This must hold for CDN caching, room queues, player playlists and the artist's public page, not just the central search index.

# 26. Low concurrency, public crowds and believable social density

**[D] Production density rules:** show a clear active public meetup; prefer existing populated instances before creating new copies; surface actual verified live activity and free scheduled events; provide city-hosted authorised background programming. NPCs may animate in a corner, scan tickets as automated service or work shops; their visuals and spoken lines are not actual account actions or economic demand. A low-population server never manufactures friends, artist follows, ticket sales, award votes or qualified plays.

**Illustrative operating cases:**

| Concurrent humans | Experience policy | Forbidden fallback |
| --- | --- | --- |
| 1–5 | One welcoming hub, kiosk/listening, safe starter tasks, visible next real scheduled events | Calling NPCs `5 online fans` |
| 6–20 | Concentrate in one hub/lounge; support spontaneous dance, free small showcases | Spreading across eight vacant districts |
| 20–50 | Small venue concerts, open mics, group meetups, active release wall | Overselling 50-room ticket capacity |
| 50+ | Scale hubs with clear instance choice and friend join; multiple genuine separate events | Hidden cloning of attendance or money |

Large festivals/arenas remain an ambition. Their real ticket and event experience must be gated on production capacity, not cosmetic building scale. A beautiful 50-seat lounge with twelve humans can feel better than a hollow 5,000-seat arena with twelve real humans plus thousands of artificial fans.

# 27. End-to-end interaction matrix

Each interaction specifies the physical trigger, the authentic human action, server authority, what other player benefits and what can fail. The full event's supplier/settlement process is not repeated here.

| ID | In-world or phone trigger | Server-authoritative result | Counterparty and failure |
| --- | --- | --- | --- |
| FAN-01 | Song kiosk -> Play | Playback session recorded, no automatic chart credit | Artist; revoked rights -> unavailable |
| FAN-02 | Song -> Save | Unique save entry; optional eligible first-save chart signal | Artist; retry -> no duplicate |
| FAN-03 | Profile -> Follow | Unique follow + category preferences | Artist; block/privacy -> reject |
| FAN-04 | Profile -> Unfollow | Follow removed, future follow pushes stop | Artist; past eligible play not erased |
| FAN-05 | Song card -> Share | Recipient receives safe deep link, no forced play | Friend; no permission -> request/deny |
| FAN-06 | Public playlist -> Publish | Only cleared released songs and approved profile data exposed | Friends; takedown -> placeholder |
| FAN-07 | Avatar -> Friend request | Recipient consent workflow | Person; spam/blocked -> reject |
| FAN-08 | Request -> Accept | One mutual friend edge | Person; stale/blocked -> reject |
| FAN-09 | Friend -> Invite to dance | Animation begins only upon accept | Person; moved away -> cancel |
| FAN-10 | Chat console -> Send message | Routed only to valid audience; moderation logged | Person/group; mute/ban -> reject |
| FAN-11 | Friend -> Invite to group | Pending TTL, max 4 accepted group members | Group; full -> error |
| FAN-12 | Group -> Travel | Per-member consent and instance reservation | Friends; full/ticket missing -> partial denial |
| FAN-13 | Artist page -> Join community | Explicit membership state | Artist; banned/closed -> reject |
| FAN-14 | Community -> Announce | Rate-limited, policy checked artist-origin post | Fans; muted -> no routine push |
| FAN-15 | Event board -> Interested | Personal calendar state only | Organiser; not ticket/attendance |
| FAN-16 | Ticket page -> Buy | Atomic quote, funds/capacity checked; purchase receipt | Organiser; insufficiency -> no debit |
| FAN-17 | Venue gate -> Enter | Unique validated logical check-in | Venue/event; invalid ticket -> deny |
| FAN-18 | Live stage -> Cheer/dance | Audience emote/visibility, not chart automation | Performer; muted effects still okay |
| FAN-19 | Event/track -> Save/Follow | Standard Music/Follow service action | Artist; rights block -> reject |
| FAN-20 | Show ends -> Memory | One verified attendance memento per account/session | Fan; reconnect -> no duplicate |
| FAN-21 | Personal room -> Place art | Authorised public-safe owned display item | Visitors; private item -> hidden |
| FAN-22 | Artist -> Gift | Explicit ledger transfer if permitted | Artist; reserved funds -> reject |
| FAN-23 | Poster -> Inspect | Logged impression/interaction only | Promoter; never auto-follow |
| FAN-24 | Official listening event -> Join | Verified organiser authorisation and content rights | Artist; rights revoked -> suspend |
| FAN-25 | Anywhere -> Block/report | Immediate contact control, optionally create case | Safety team; audit trail |
| FAN-26 | Phone -> Mute artist/category | Push and DM policy updated, historical posts still retrievable if member | Fan; no duplicate sends |
| FAN-27 | Personal player -> Soundtrack | Opt-in active personal selection | Artist; no ambient public broadcasting |
| FAN-28 | Chart board -> View | Last final weekly charts only, correction flag visible | Community; no live paid ranking |
| FAN-29 | Sold-out event -> Waitlist | Non-paying notification queue | Organiser; no phantom hold |
| FAN-30 | Friend -> Room invitation | Owner-approved private-room entitlement | Guest; revoked -> exit |

# 28. Shared authority and service boundaries

**Never trust the client** for follows, stream duration, ticket validation, wallet balance, identity/age flags, chat privileges, room authority, chart points, event check-ins or verified memories.

| Component | Authoritative responsibility | Must not do |
| --- | --- | --- |
| Identity/PersonService | Person/avatar link, public privacy fields, age/access state, blocks | Own company financial account by implication |
| FriendshipService | Requests, mutual edges, DM contact eligibility | Turn artist follows into friendships |
| SocialGroupService | Party membership, invites, leader and travel consent | Sell tickets or debit shared group wallet |
| CommunityService | Artist-official group, artist/moderator privileges, posts | Make fans official organiser by naming themselves |
| MusicService | Approved recordings, release rights, playback permissions | Allow unreleased song leakage via public room |
| ListeningIntegrityService | Qualified listening evidence, fraud checks, eligible score events | Count NPCs or prepaid exposure as listeners |
| AudioSessionCoordinator | Source priority and group/event timeline synchronisation | Create finance or chart results from `room.play` alone |
| EventService | Published event, ticket entitlement, global session admission, cancellation, history basis | Assume interest means ticket or check-in |
| LedgerService | Standalone sim funds, reserves, debits, gift and refund settlement | Transfer external Lagos Life game naira without supported API |
| FanHistoryService | Evidence-backed personal memories and optional public display | Award paid fan rank or alter immutable raw evidence |
| NotificationService | Preference-aware, deduplicated alerts | Give advertisers unrestricted inbox access |
| ModerationService | Reports, sanctions, content removals, audit | Ignore immediate user block preference |
| Instance/JoinCoordinator | Choose shard, reconnect, friend co-location, enforce session capacity | Sell more seats by opening another technical shard |

All transactional services expose idempotency keys, authenticated actor identity, server timestamps and audit references. Every effect visible in the 3D world must reflect an acknowledged backend state; if the server denies an action, the animation must stop or revert with a clear explanation.

# 29. Minimal canonical data model

These are logical entities and constraints; exact SQL, index names and storage systems are implementation choices. Personally identifying information should be minimised and sensitive chat/financial data must be segregated by access policy.

| Entity | Key fields | Invariant |
| --- | --- | --- |
| `person_profile` | person_id, avatar_id, name, chosen_home_district, privacy_policy_version | No forced profession; stable personal identity |
| `friend_request` | request_id, from_id, to_id, state, expires_at | No duplicates/open retry spam |
| `friend_edge` | normalized_pair, accepted_at, state | Max one mutual edge per pair |
| `artist_follow` | person_id, artist_id, followed_at, unfollowed_at, prefs | One active edge; server timestamps |
| `fan_community` | community_id, artist_id, state, rules_version | One official community per artist |
| `community_member` | community_id, person_id, role, state | No posts after banned/removed |
| `message` | id, channel_id, author_id, moderation_state, created_at | Author permission checked at send time |
| `party` | party_id, leader_id, expires_at, state | Max 4 accepted humans |
| `party_membership` | party_id, person_id, joined_at, state | No forced travel |
| `released_song_save` | person_id, song_id, saved_at | Unique active save per pair |
| `playlist` / `playlist_item` | owner, visibility, song_id, ordinal | Public songs only for public list |
| `audio_context` | person, room/session, source_type, muted, last_active_at | One opted-in foreground music source |
| `playback_evidence` | person, song, source, elapsed, eligibility, server time | No `speaker-played = human-qualified` shortcut |
| `event_interest` | person_id, event_id, state | Not a ticket or financial obligation |
| `event_entitlement` | account, session, state, purchase_id | One validated admission per entitled ticket |
| `event_presence` | person, session, join/leave intervals, reconciliation_version | Deduplicate reconnect, no NPC |
| `fan_memory` | person, source_event_id/milestone, type, verified_at, display_permission | Unique source per type, revocable public display |
| `notification` | id, recipient, collapse_key, type, state | No duplicate identical push |
| `player_block` | blocker_id, blocked_id, created_at | Precedence in DM/social actions |
| `moderation_case` | case_id, reporter, subject_ref, status, audit refs | Least-privilege access |
| `personal_room` | owner, instance, visibility, layout_revision | Private default; no financial exposure |

**[D] Durable state:** follows, friendship, song saves, approved playlists, participation history and community membership are persistent. Short group invitations, runtime room membership, audio session cursors and ephemeral presence expire. Deletion/retention behavior is governed by the platform policy and legal review, not by a permanent retention promise here.

# 30. State machines and transitions

## 30.1 Friendship

`NONE -> REQUESTED -> ACCEPTED -> UNFRIENDED`. Other outcomes: `REQUESTED -> DECLINED/EXPIRED/CANCELLED`; `ANY -> BLOCKED` for blocker-restricted interactions; unblock does **not** automatically recreate friendship. A client cannot transition to ACCEPTED on behalf of the recipient.

## 30.2 Community

`NOT_JOINED -> JOINED -> LEFT`; alternative `JOINED -> MUTED/READ_ONLY -> JOINED`; `JOINED -> REMOVED/BANNED`; `ACTIVE_COMMUNITY -> PAUSED -> ACTIVE/CLOSED`. Artist and platform have distinct authority; membership state cannot generate a label contract.

## 30.3 Audio/listening

`STOPPED -> USER_ENABLED -> PLAYING -> PAUSED -> STOPPED`; `PLAYING -> INTERRUPTED` on higher-priority opt-in event audio or tab suspension; resume requires safe permissions. Playback evidence progresses `STARTED -> ELIGIBILITY_PENDING -> QUALIFIED or DISCARDED/FLAGGED`, server calculated. A `room_track_changed` event is not itself evidence of a user's qualified listen.

## 30.4 Fan event journey

`DISCOVERED -> INTERESTED -> ENTITLED/TICKETED -> CHECKED_IN -> ATTENDED_HISTORY_QUALIFIED -> LEFT/ARCHIVED`. Interest can be removed. Ticketing may be unavailable or optional for a free event. `CANCELLED/POSTPONED/REFUND_PENDING` travel through authoritative event rules, not independent FanService transitions. A show visitor can be `CHECKED_IN` while audio-muted, without earning chart listen evidence.

## 30.5 Presence and reunion

`WORLD_CONNECTED -> ROOM_JOIN_PENDING -> ROOM_JOINED -> ROOM_DISCONNECTED -> REJOINED or EXITED`. Joining uses one logical presence session, with heartbeat timestamps and a rolling reconnect token. The Event service reconciles true unique attendance across devices; runtime shard rotation never duplicates a single account into two audience slots.

# 31. Adversarial and failure scenarios

| Failure/attack | Expected user-visible behavior | Required authoritative protection |
| --- | --- | --- |
| Zero-money player taps free kiosk | Music works if approved and audio enabled | No balance gate or auto charge |
| Device blocks autoplay | Show `Tap to enable sound` | No false listen credit |
| Two songs start in separate panels | One foreground track remains | Audio arbitration prevents overlap |
| User mutes event audio | Concert visuals/chat continue | No qualified listen from muted interval |
| App backgrounds during playback | Playback pauses or loses eligibility | No background farming |
| Song taken down during room rotation | Show unavailable, skip safely | Recheck rights and invalidate cached streaming permission |
| Poster displayed to 100 NPCs | Impression count excludes simulated humans | No synthetic audience marketing success |
| Fan follows twice from two devices | One active follow | Database uniqueness/idempotency |
| Blocked player sends DM | Delivery denied | Block precedence, audit as needed |
| Artist posts 100 announcements | Most become feed-only / throttled | Server category rate limits |
| Fan names meetup `Official Kemi party` | Official badge withheld; spoof title moderated | Verification token on event organiser authority |
| Promoter embeds unreleased master link | Playback denied | Per-song/per-context entitlement |
| Friend invite expires | Clear expired state | TTL state and no hidden reactivation |
| Group of four enters 3-seat free session | Explicit capacity choice/failure | No involuntary split or overflow |
| A friend hasn't bought ticket | Show needs ticket; keep group intact or explicit partial split | Entitlement per account |
| Player reenters concert five times | One entitlement and memory | Presence session dedupe |
| Event sells last ticket on two phones | One wins, second gets sold-out, no duplicate debit | Atomic capacity and ledger commit |
| Organiser cancels after ticket sale | Ticket holder notified and refund workflow visible | Reserve protection and EventService authority |
| Venue operator disappears | Ticket remains valid or gets formal remedy | Offline organiser fulfillment/fallback policy |
| Artist profile blocked after follow | Suppress contact and notifications appropriately | Block and visibility precedence |
| Private playlist shared accidentally | Requires deliberate publication action | Private-by-default ACL |
| Visitor sees private personal room | Entry denied | Owner/guest ACL checked server-side |
| Artist banned for abuse | Community paused by enforcement | Platform moderation outranks artist role |
| Song removed after someone earned a badge | Media link unavailable, memory facts handled by policy | No prohibited asset retained in public content |
| User changes home district repeatedly | Excess edits refused | Server once/28-day restriction |
| User farms replays through auto soundtrack | Extra raw activity may exist; limited chart weight | Qualified listening/weekly per-person cap |
| Two devices enter same event for one account | One logical attendance | Session/account uniqueness |
| Wallet adapter unavailable in embedded game | Paid actions disabled/alternate permitted standalone only | No fake external payment completion |
| Report about harassment while show live | Safety controls immediate; review queued | Block/mute first, incident audit |
| Fraudulently sourced gift transfer | Risk controls/dispute process | Ledger provenance and anti-abuse |
| Offline room closes while music playing | Explicit transition, no continued false session | Clear audio/cursor and entitlement state |
| Release Friday displayed early | Scheduled card no master playback | Release server-time embargo |
| Fan buys premium clothes | Avatar appearance changes, nothing else | No follow/chart/reputation grant |
| Server disconnects during show | Rejoin path and honest duration reconciliation | Trusted presence intervals, no double memory |

# 32. Three seven-day social-player simulations

## 32.1 Fola — casual fan, no currency or profession

**Mon:** enters Music Square, listens to and saves one song. **Tue:** meets a friend in free lounge and dances. **Wed:** sees real scheduled open mic, marks Interested. **Thu:** follows a performer; receives an opted-in event notice. **Fri:** enters Release Hall after 19:00 WAT, listens to new music; no pressure to buy. **Sat:** enters a genuine free 20-person show, uses emotes and earns a verified memory. **Sun:** views saved songs and history in personal room. **Failure branch:** if the Saturday show is cancelled, she gets an honest event status and an alternative free destination, not a fake attendance badge.

## 32.2 Tobi — social player with three friends

**Mon:** invites friends into an accepted party (max 4). **Tue:** group travels to public lounge; client aligns one shared room song. **Wed:** all browse a paid concert; only two can afford tickets. UI shows individual entitlement; friend group remains socially valid. **Thu:** they choose a free gig together instead of forcing the others to pay. **Fri:** some members share a Friday track link, which recipients choose to play. **Sat:** one friend mutes local chat after harassment and blocks an account without leaving the game. **Sun:** they invite each other into a private room, all with owner approval. **Failure branch:** if the lounge instance fills, group receives a suggested real alternative; it is not silently scattered into separate paid shows.

## 32.3 Ada — underground tastemaker with no business

**Mon:** browses emerging artists and saves a recording. **Tue:** shares it in a permissioned friend DM. **Wed:** attends a small showcase and starts following the artist. **Thu:** builds a public playlist, intentionally hiding private playlists. **Fri:** discovers another new track at release; her share generates voluntary listens only. **Sat:** attends an artist-authorised listening session with real users. **Sun:** her profile shows the genuine discovery dates privately. **Two months later:** if the earlier artist reaches their first district Top 20, an optional Early Supporter memento is granted from stored dates; no cash or extra chart influence. **Failure branch:** if the artist's music is later withdrawn, the public playlist has an unavailable placeholder, and her private historical encounter can remain according to lawful retention rules.

## 32.4 Wealthy fan — no compulsory business

A wealthy player with substantial **legitimate standalone** game money may buy avatar decor, attend premium shows, gift a musician or support a lawful event without owning a business. They cannot buy friendship, override a blocked user, become an official community organiser by paying, convert money into chart saves, or buy an event's ticket cap. If future native Lagos Life wallet support exists, the experience must use its confirmed permitted rails and limitations; wealth is not assumed transferable from that platform today.

# 33. UX screens, text and error responses

Physical stations and phone shortcuts must express the same server state with short, comprehensible labels. Suggested launch microcopy:

| Context | Primary action | Accurate fallback/error |
| --- | --- | --- |
| Unplayed audio | `Play song` | `Enable sound to hear this track.` |
| Saved song | `Saved` / `Remove from collection` | `This recording is unavailable.` |
| Artist profile | `Follow` / `Following` | `You can't follow this profile right now.` |
| Friend request | `Send request` | `This player isn't accepting requests.` |
| Group travel | `Travel together` | `Not everyone can enter this location. See options.` |
| Fan community | `Join community` | `This community is paused.` |
| Official listening party | `Join official session` | `Artist permission for this session is no longer valid.` |
| Event sold out | `Join waitlist` | `No tickets are currently available.` |
| Ticket entry | `Enter show` | `Your ticket is for a different session.` |
| Audio muted in show | `Enable event sound` | `You can keep watching with sound off.` |
| Artist gift | `Send game money` | `Insufficient available balance; reserved funds cannot be used.` |
| Event postponed | `Review new time` | `Your original time has changed. Review options.` |
| Report/block | `Block` / `Report` | `Blocked. This player can no longer contact you directly.` |

**Accessible alternatives [D]:** mobile touch targets sized for reliable tap, text labels independent of colour, captions/track metadata when needed, colour contrast, scalable text, reduced motion, keyboard alternatives for station menus and ability to complete all core social actions without microphone. A full 3D motor-navigation requirement must not prevent a player from sending a report or exiting an unsafe scene.

# 34. Observability, health metrics and playtest gates

**Success means real delight and retention**, not that an arbitrary number of financial or chart transactions occurred. Collect aggregate privacy-safe metrics and qualitative playtest observations:

- **First session:** time to first optional audio activation, voluntary song play, save/follow, meaningful social action, free-event discovery, abandonment point and FPS/load problems.
- **Social:** friend-request acceptance, accepted-group travel success, rejoin success, mutual blocking after abuse, reports per 1,000 human minutes, community mute/unsubscribe rates.
- **Music:** real selected song plays, qualified listens, saved tracks, playlist shares, new artist discovery diversity, rights/embargo failures, muted playback and attempted replay fraud. Keep raw starts distinct from qualified contributions.
- **Live:** unique eligible ticket holders, valid check-ins, free/paid attendance, group co-location, connection loss during concert, verified memories, time spent actively present and refunds after cancelled events.
- **Healthy economy:** percent of zero-balance accounts with completed enjoyable sessions; proportion of free vs paid accessible events; no fraudulent NFT-like fan investments or passive chart cash loops.
- **World density:** real humans per visible social hub, successful spontaneous social interactions, time to encounter activity, inactive empty-instance rate.

**[D] Prototype quality targets (not production guarantees):** at least 90% of tested supported mobile sessions complete `first public song play` without a crash; 100% of legitimate repeated follow/save calls remain idempotent; 100% of tested over-capacity ticket attempts reject without charging; 100% of blocked direct-message attempts are rejected; zero fabricated NPC human chart listens in automated tests; 95% of group joins for groups of up to four succeed when a suitable location has actual capacity. Playback latency and 3D performance targets require device-profile benchmarking rather than a marketing promise.

**Qualitative test:** put 20 real humans in one compact world. At least one voluntary discovery-to-follow story, one spontaneous social exchange, one active free show and one meaningful social return should emerge without staff telling every player what button to click. If the game feels empty or the sound is chaotic, add no extra business professions until these issues are fixed.

# 35. Implementation acceptance tests (required before sign-off)

| Test ID | Scenario and pass condition |
| --- | --- |
| FS-001 | New zero-balance account can enter hub, play public song after consent and save it without any payment. |
| FS-002 | Onboarding never requires artist/company/fan class selection. |
| FS-003 | First-run browser autoplay block results in visible enable-sound UI and no qualified listen event. |
| FS-004 | Personal track cannot be heard by unrelated nearby avatars merely because the owner enabled soundtrack. |
| FS-005 | Joining authorised shared lounge audio pauses/ducks personal soundtrack according to user settings. |
| FS-006 | Joining live show uses exactly one authoritative programme audio stream per user, no simultaneous personal song. |
| FS-007 | Muted or background playback cannot satisfy the qualified-listen rule. |
| FS-008 | Server-preloaded music, poster renders and NPC listening animations cannot create chart points. |
| FS-009 | Listening duration qualification follows Artist v0.4 formula with server-trusted timing. |
| FS-010 | Replays and saves obey per-person/song/week integrity caps; no double score from two devices. |
| FS-011 | Scheduled Friday song cannot be publicly streamed at 18:59; can be streamed after 19:00 release if valid. |
| FS-012 | Official chart board shows prior interval results at Friday 18:30, not manipulable near-real-time ranking. |
| FS-013 | Save/unsave across simultaneous clients yields a single active saved-song edge. |
| FS-014 | Only released authorised songs may appear in public personal playlists. |
| FS-015 | Removed song immediately becomes unplayable via playlists, physical kiosks and shared speaker. |
| FS-016 | New friendship requires explicit recipient acceptance; artist follow doesn't auto-friend. |
| FS-017 | Blocked sender cannot DM, friend-request, paired-dance invite or party-invite the blocker. |
| FS-018 | Public online presence does not expose strangers' exact instance/location when privacy disallows it. |
| FS-019 | Pending friend request expires and cannot be accepted after TTL without new action. |
| FS-020 | Four-person party can accept travel with valid individual consent; fifth member rejected. |
| FS-021 | Missing ticket for one group member cannot be overridden by group leader; no stolen entitlement. |
| FS-022 | Full room returns capacity error or a clearly separate legitimate instance, not silent overbooking. |
| FS-023 | Community join and artist follow are separate, independently reversible states. |
| FS-024 | Fan cannot create `Official Kemi Listening Party` badge without verified artist/event authority. |
| FS-025 | Artist/community push flood is rate-limited and muted followers don't receive routine alerts. |
| FS-026 | Ticket `Interested` does not reserve a seat, charge balance or count as attendance. |
| FS-027 | Same ticket purchase idempotency key cannot charge twice even under concurrent requests. |
| FS-028 | Selling final venue ticket twice results in exactly one sale; losing attempt gets no debit. |
| FS-029 | Rejoining event from two devices counts one valid logical attendance. |
| FS-030 | Authenticated event check-in alone doesn't count as per-song qualified listening. |
| FS-031 | Valid fan memory requires threshold real presence; repeated entry cannot create copies. |
| FS-032 | Event organiser cancellation triggers accurate ticket holder status and refund workflow. |
| FS-033 | Low-population public world remains usable with permitted curated songs and no fake users. |
| FS-034 | NPC crowds never add to attendance count, ticket revenue, fan count or leaderboard votes. |
| FS-035 | Early Supporter badge is awarded only after verified milestone and true earlier follow timestamp. |
| FS-036 | Unfollowing and re-following cannot backdate early-supporter qualification. |
| FS-037 | Personal-room visitor has only owner-granted room permissions; no private song drafts or budgets exposed. |
| FS-038 | Report and block controls work during live performance without leaving the app. |
| FS-039 | Promotion placement view never auto-plays, follows, saves, purchases or sends a private message. |
| FS-040 | Purchase of premium cosmetic never changes chart rank or protected personal contact privileges. |
| FS-041 | Gift transfer explicitly confirms standalone simulation currency and rejects restricted label/project funds. |
| FS-042 | External wallet adapter unavailable means unsupported native-money transfer/checkout is disabled, not faked. |
| FS-043 | Asset takedown interrupts currently playing authorised room audio after rights signal propagates. |
| FS-044 | User hiding playlist/private saves does not reveal them in search, visitor room or public profile API. |
| FS-045 | Artist follow notifications collapse duplicate events across multiple logged-in devices. |
| FS-046 | Deleting/unsharing public fan history respects display permission without forging original audit records. |
| FS-047 | Company sale/closure leaves person's friends, saved music, artist follows and verified concert history intact. |
| FS-048 | Moving avatar across virtual districts doesn't multiply unique listener attribution; home district cooldown enforced. |
| FS-049 | Event waitlist is non-paying and never sells seats beyond authoritative cap. |
| FS-050 | When a moderator suspends a community, artist cannot bypass platform enforcement with another device. |

# 36. Technical implementation order and prototype slices

A **vertical slice** should first prove a complete human social/music interaction, not merely a backend CRUD API.

**Slice A — Music Square:** third-person avatar, one compact public hub, basic joining and real presence, touch-friendly interaction, playback unlock, approved released song, save/follow, one free public lounge, strong mute/block/report. Show no economy beyond zero-balance validation.

**Slice B — Friends and discovery:** friend requests, DMs/mute, party of four, real group travel, private/public playlists, artist communities with artist authority, Release Hall Friday schedule and public recommendation lanes. Rights and anti-fraud server checks must be active.

**Slice C — Live fan loop:** confirmed free 20–50 person show in a prebuilt venue, guest audience dancing, authorised track playback, check-in/presence, event cards and verified memories, reconnect behaviour and per-song listening integrity. Demonstrate one genuine artist receiving voluntary saves and follows.

**Slice D — Commercial interaction:** standalone simulated-currency ticketing, honest venue capacity, refund flow, gifts with explicit restrictions, visible promoter placements and event group travel. Integrate authoritative Event/Ledger contracts before calling this production-ready.

**Slice E — Culture at scale:** late Friday chart reveal, Friday premieres, weekly public gathering, early-supporter history, public nomination/watch experience for quarterly Destiny Awards and honest instance scaling. Use real attendance capacity, not NPC figures, as the launch gate.

**Implementation note:** build for independent HTTPS browser hosting first. Optional embed support must adapt presentation and audio to permitted runtime capabilities. Never assume imported 3D avatars or arbitrary native wallet API based on profile-image/identity SDK fields.

# 37. Design decisions resolved and external dependencies

| Decision | Result | Status |
| --- | --- | --- |
| Is Fan a class? | No; universal personal activity/relationship | [C] |
| Is paid participation mandatory? | No; perpetual free discovery/social/event paths | [C] |
| Are NPCs counted as fans? | Never | [C] |
| Is listening party open to fans as official artist event? | Only artist/authorised organiser may host official party | [C] |
| What happens to company owners socially? | Own at most one company but enjoy all permitted fan activities | [C] |
| Where is V1 social heart? | Compact Music Square + Release Hall + free lounge + small real venues | [D] |
| Does personal music broadcast to others? | No; explicit room/event source does | [D] |
| Does shared audio force a chart listen? | No; individual eligible playback evidence required | [C/D] |
| What's the fan social relationship model? | Separate friend, follow, community and temporary group | [D] |
| Can a fan maintain a collection and soundtrack? | Yes, free; private by default | [C/D] |
| Can friends travel together? | Yes, party of four with each member's consent and entry right | [D] |
| Are private rooms essential property businesses? | No; one modest free room per avatar | [D] |
| Can a fan be a recognised tastemaker? | History/curation only, not a paid chart multiplier | [D] |
| How is an early supporter recognised? | Verifiable earlier follow than artist's first qualifying chart milestone | [D] |
| Can ads message everyone? | No; physical/controlled inventory, opted-in information and labelled sponsorship | [C/D] |
| How is a show fan counted? | Trusted check-in and presence; chart listening separately | [D] |
| Does spend buy chart, friendship or influence? | No | [C] |
| Does Lagos Life native currency pay gifts/tickets today? | Not assumed; only documented/authorised future rails | [X] |
| Can the game launch open to minors? | Default recommend 18+ until legal/safety review | [D/X] |
| Are voice chat and mega-arena simulation in V1? | No; later after moderation/technical readiness | [F] |

# 38. Handoff to Chapter 6 — Concerts & Shared Events

This chapter intentionally resolves **the attendee's experience** but does not create a second event-production specification. Chapter 6 must implement the authoritative seller/organiser workflows behind the fan-facing contract:

1. Venue calendar, unique venue/session inventory, 24-hour booking blocks and operator prepaid lease coverage.
2. Event draft/reserved/published/live/settled/cancelled transitions; one financially responsible organiser; ticket prices, free admission and capacities.
3. Artist lineup agreement, guest performers, no-shows and fallback pre-authorised recorded performances.
4. Fan admission tokens, checkout holds, rejoin, real check-in, simultaneous devices, group co-location, waitlists and large-event shard truthfulness.
5. Start/end timelines, 3D Stage Mode, authorised show audio, accessibility, audience controls, moderation emergency shutdown and performer disconnects.
6. Unambiguous ticket refunds, reschedules, seller liabilities, artist guarantees, fee calculation and one event settlement ledger.
7. Venue/operator responsibility, promoter contracts, label-funded artist shows, sponsor/backer obligations and anti-double-payment rules.
8. Quarterly **Destiny Awards** hosting, eligibility, public viewing and clear distinction from larger private events.
9. Server load, real concurrency, event safety, music licensing and platform access gates.

**Chapter acceptance boundary:** A fan must be able to find a real show, intentionally obtain a valid entitlement, join with their friends when possible, enjoy synchronised music and expressive activity, leave safely, receive truthful outcomes and retain a verified memory. The concert chapter decides how organisers create and finance that show. Do not progress into simulated arenas before this smaller human experience works.

---

## Appendix A. Cross-chapter invariants checklist

- **Artist v0.4:** Friday song release, embargo, music permissions, chart qualification, fan follows and avatar Stage Mode remain canonical.
- **Venue v0.3:** Public unique venue identity; capacity, 24-hour rental blocks, operating leases, operator booking rights and 3% *test* ticket fee remain canonical. Do not charge owner double city rent.
- **Label v1.0:** Artist remains autonomous. Fan membership and friends do not belong to the label; label project funds cannot be gifts.
- **Promoter v1.0:** Ads create physical attention opportunities, are labelled if sponsored and never manufacture listens/follows/ticket sales.
- **H-Path v0.2:** One avatar, one company at a time, production as activity, investing as eligible optional activity, fandom universal.
- **SDK boundary:** Standalone domain and ledger; no implicit Lagos Life game-naira money transfers, imported 3D avatar or guaranteed SDK functionality.

## Appendix B. Open items that require external rather than game-design decisions

1. Actual music/loop licensing for world broadcast, artist uploads, catalogue previews and territorial access.
2. Consumer privacy documentation, legal age access rules, moderation staffing and formal retention periods.
3. Approved standalone or embedded payment infrastructure, required identity protection and any native-wallet provider permissions.
4. Device testing: low-end Android/iOS browsers, intermittent Nigerian mobile networks, audio-focus behaviour and synchronised Web Audio playback.
5. Playtest-calibrated chart weights, notification rate limits, maximum server populations, UI load targets and acceptable social safety incident thresholds.
6. Full Concert & Shared Events and Economy & Contracts specifications, including financial refund windows and event reschedule liability.

**This is a complete fan-facing V1 functional specification and build baseline. It does not represent a completed implementation, legal clearance, gameplay playtest or confirmation of unexposed third-party SDK features.**
