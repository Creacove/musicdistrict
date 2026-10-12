# THE SCENE — Performance, Low-Data & Media Engineering v1.0
**Objective:** Make a socially enjoyable, attractive **mobile web game** that works on ordinary Nigerian phones and data plans. This document defines initial tunable *engineering gates*; we have not profiled a working build. Do not confuse a rendered concept image with demonstrated runtime feasibility.

## 1. Why Lagos Life looks visually simple
Its screenshots show small simple meshes, limited material/lighting complexity, compact locations, illustrated UIs and pre-authored travel screens. These choices *can* save GPU work, memory, model download and production time. We do **not** have its source, shader stats, device performance traces or pipeline, so we cannot assert that this is why its designers chose the look. The screenshots do not prove the code is optimised. A bland game can run slowly, and a beautifully art-directed low-poly game can be very fast. **Optimise workloads, not taste**.

## 2. One lifetime of a game screen: what downloads when
1. **Open site:** HTML, CSS, a small UI shell, cached authenticated session and a cheap loading/placeholder scene. No full music catalogue, no giant 3D city.
2. **Enter Music Square:** compressed shared terrain/buildings, one rig/avatar mesh, nearby environment lightmaps. First controllable avatar appears before distant props complete.
3. **Explore:** load current-room players and nearby texture/prop LOD; if target window is hidden, throttle or pause rendering.
4. **Go to the studio:** start prefetching *only the next destination* once the user deliberately selects route. During walking/cab ride, fetch studio .glb and its texture bundle with low priority. On arrival swap world tile and unload unused heavy GPU resources.
5. **Browse a release wall:** only visible or immediately upcoming cover thumbnails; incrementally fetch nearby rows. No 1000-album wall upfront.
6. **Play song:** explicit user gesture → audio player requests one chosen song at the correct bitrate from CDN over efficient progressive/range streaming. No auto-prefetch of dozens of entire songs. On seek use range requests when supported.
7. **Open phone Desk:** Phase 1 recommendation data is tiny JSON. No model download and no LLM requirement. Phase 2 remote LLM response is an optional small server-mediated text request, not client-side model weights.
8. **Leave site/rejoin:** cache immutable static scenes/images safely; query authoritative changing activity (sessions, sales, event state) afresh.

## 3. First transfer and frame-rate budget (proposed; review each build)
| Measurable | Initial target / review threshold | Notes |
| --- | --- | --- |
| p75 time to first controllable avatar | <12 s | From Chapter 9, test Nigeria-realistic networks, aim lower after baseline |
| Cold first-entry transfer target | ≤5 MiB | Review if >8 MiB (includes necessary first scene, excludes chosen streamed music) |
| Initial JS/CSS transfer | ≤550 KiB compressed | Break into route chunks; tune with actual bundle analyzer |
| Initial 3D geometry + textures | ≤3.3 MiB compressed | Initial playable tile, not all future scenes |
| Entry Android support goal | Stable 30 FPS at tested player count | Quality drop before major stutter; use battery-aware tiering |
| Higher-tier browser | target 45–60 FPS when sustainable | Dynamic resolution scale, avoid overheating |
| Touch hit box | 44 CSS px or better | Mobile accessibility |
| Server-visible avatar movement | Prototype 5–10 updates/sec / nearby player | Interpolate on clients; authority and rate limit on server |
| Initial event-room humans | 20–50 **actual** players/session | Capacity increase only after profiling devices/server |

A MiB is 1,048,576 bytes. These are **design limits**, not proof it will fit: measure actual compressed transfer and render performance. Prioritise 12-second chapter target if 5-MiB limit requires different staged delivery. Avoid inventing any public user-count metrics to make a build look successful.

## 4. Images and artwork: many can exist without many downloading
Artist avatars, covers, venue preview cards, campaign posters and billboards should be **responsive image variants**, not one 2,000px PNG reused everywhere.

| Surface | Suggested size | Compression / target | Load rule |
| --- | --- | --- | --- |
| Artist avatar / online presence | 64–160px | WebP/AVIF ≤30 KiB for thumb | Only nearby/visible |
| Song cover in list | 128–256px | WebP/AVIF ≤28 KiB | Lazy below visible fold |
| Open song page / player | 512px | WebP/AVIF ≤115 KiB | When opened; cache immutable URL |
| In-world active music poster | One atlas/texture set | KTX2 when beneficial, test decoder support | Only when user in relevant scene |
| Paid ad card thumbnail | 256–512px | WebP/AVIF ≤50 KiB | Only if placement visible and currently eligible |
| Large venue preview | 800–1200px | WebP/AVIF 80–180 KiB depending on quality | On deliberate inspect |
| Nonessential video | Not initial-load | Avoid autoplay | Only explicit user command |

Image targets are encoded byte goals, not hard visual limits. Distinct songs can each have unique covers: **catalogue size in database is not initial download size**. Prefer one immutable filename/fingerprint per asset. Use `srcset`/`sizes` in DOM, `loading="lazy"` below fold; fetch hero art eagerly when it is the critical next view. Keep 3D wall images to currently visible texture slots; release previous GPU textures on scene exit.

## 5. 3D scene engineering
- **Small authored interiors;** don't ship Lagos as a single giant geometry bundle. Use one public hub then zone-specific rooms and locations.
- glTF/GLB assets built for runtime; validate compressed geometry (`meshopt`, or Draco where worthwhile) and KTX2/Basis textures for repetitive GPU textures. **Compression can cost decode CPU**: measure real devices, don't enable all formats without need.
- Instancing repeated objects (chairs, spotlights, bollards, planters) and small material sets reduce draw calls; LOD/distant impostors reduce geometry. Animated avatars use shared skeleton rigs and pooled/emote animations where practical.
- Bake static indirect light/shadows; use unlit/emissive materials on signboards; limit real-time lighting and dynamic shadows; avoid constant full-screen postprocessing. Atmosphere = composition + authored detail, not a dozen GPU lights.
- Adaptive renderer: balanced mobile DPR ≤1.5; Save Data ≤1; high tier ≤2 only when performance permits. Adapt output resolution, nearby avatar count, shadow scope and particle effects when median FPS drops. Expose simple `Data Saver / Balanced / Quality` toggle **even when Network Information API is unavailable**, which is common in Safari.
- Dispose renderer resources on zone transitions (geometry, texture, materials); keep reusable caches measured; do not create new WebGL canvases at every modal open.
- Never upload rendered concept PNG and use as fake "3D" static scenery in place of geometry/avatars. Compare staging screenshot to style reference at the same camera only after functioning movement exists.

## 6. Songs are the most important variable data cost
Songs are larger than thumbnails. **A 3-minute song at 96 kbit/s requires about 2.1 MiB of encoded audio**, and ten such full plays can cost ~21 MiB. Actual codec overhead and rebuffering vary. A music-first game has unavoidable audio data use if the player actually listens, so don't promise zero-data audio.

Implement **one shared audio-control module**. Use common mobile-supported AAC in `.m4a`/MP4 or another format validated on Android Chrome and iOS Safari. Provide a lower-bitrate ~64kbit/s audio rendition under Data Saver; ~96kbit/s normal baseline, optional higher quality. Test perceived quality on real music. Stream via CDN supporting byte range and proper caching; don't store decoded PCM in memory for entire songs. `audio.preload="none"` before user request, metadata only when a visible player needs duration. Autoplay can be blocked; show explicit `Enable Audio` prompt, listen for rejected `play()` Promise.

**Do not automatically download every album in the Release Hall or every track on a chart.** When scanning a list, play on deliberate tap. Respect room audio: a player's personal soundtrack is private to that listener; zone music is one authorised playback stream; per-user chart qualification is *never* implied solely from hearing a public sound system, being online, or having audio muted.

An optional Wi-Fi-only `pre-cache favourite songs` feature is **deferred** because it creates storage, consent, expiry and music-licence obligations. For V1 use bounded HTTP cache and content-aware media removal.

## 7. Networking
Use room-based interest management. Each client receives movement/state only for nearby relevant real players; far-away NPC ambience can run locally under deterministic visuals and has no economy effects. Authoritative actions (ticket check-in, contracts, business purchase, label funding, follower/save writes) go over authenticated server APIs and transactional database, not casual movement packets. When reconnecting, reconcile event time, available room place and financial state without duplicate payments. Use snapshots + interpolation, not 60 state sends/sec for every avatar. Don't send microphone voice data without a separately designed feature.

## 8. Travel can hide loading without becoming artificial grind
Keep meaningful **walking**, short scenic **cab/shuttle ride** with an actual location transition, and a map route preview. Begin the asset fetch for destination on selection or route start. If the data is slow, show trip progress + honest loading state, never fake arrival. Provide a skip option for long authored travel animations and accessibility mode; skip only the visualization, not booking fees or authoritative eligibility. Privately owned drivable cars remain future until the music experience is proven. This is how we protect cinematic feel while controlling transfer and load.

## 9. Cache, hosting and cost
Object storage for uploads and generated transcodes; CDN in front of **variant image assets, compressed 3D zones, JS bundles and song streams**. Immutable public assets (`hashed filename`) with long cache lifetime; short TTL or no-store for contract data, wallets, presigned media URLs and permissions. Keep audio licensed and removal-capable, including invalidation. Don't push images/audio into relational DB rows or inline giant base64 JSON. Caching is per player/device/browser policy; private player information must not be stored as shared public CDN cache. Use browser storage quotas defensively. Rate-limit upload and media transformation workflows.

## 10. Testing gates that matter
Test on at least: **entry Android Chrome** (real low/mid phone + mobile data), **midrange Android Chrome**, **iPhone Safari** (WebKit), and desktop Chromium. Include 4G with high latency, intermittent cellular, Save Data enabled manually, low battery conditions, OS tab suspend/resume and 20 real/simulated technical room connections. Test first visit and warm revisit separately. Chrome desktop emulation is not an adequate substitute for physical phones.

Capture in each critical view: navigation and transferred bytes; initial/peak JS heap where measurable; GPU warning and context-loss recovery; average and p95 frame times; stalled audio; battery/heat observation; network and server recovery; overlay interactions and touch events. Fix jank and radio consumption before adding more visual effects.

### Exit tests
- A cold mobile player reaches control within the budget on representative network/device; if not, shrink and stage assets.
- Touring studio → Release Hall → concert doesn't keep accumulating GPU/JS memory and old textures.
- Music list with 100 records downloads only visible covers, not 100 audio tracks.
- Scrolling art gallery doesn't block movement frame-rate; posters rotate in display inventory without unloading the whole 3D zone.
- Entering and leaving audio zones does not play multiple competing tracks or incorrectly count a stream.
- A slow client can still inspect a contract/venue and **decline** it; rendering delay never silently commits money.
- `navigator.connection` absent does not break Data Saver toggle.

## Authoritative resources used to derive candidate practices
- Three.js loader and compression: https://threejs.org/docs/pages/GLTFLoader.html
- Three.js instancing: https://threejs.org/docs/pages/InstancedMesh.html
- Three.js LOD: https://threejs.org/docs/pages/LOD.html
- Three.js renderer pixel ratio: https://threejs.org/docs/pages/WebGLRenderer.html
- Responsive images/lazy loading: https://web.dev/learn/design/responsive-images/
- HTML audio and preload behaviour: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/audio
- Browser autoplay restrictions: https://developer.mozilla.org/en-US/docs/Web/Media/Guides/Autoplay
- Network Information API limitations: https://developer.mozilla.org/en-US/docs/Web/API/Network_Information_API
- Chrome real-world testing / device emulation caveats: https://developer.chrome.com/docs/devtools/device-mode
