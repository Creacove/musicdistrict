# THE SCENE — Visual Design System & World Art Direction v1.0
**Status:** design proposal for implementation and playtesting, NOT a final approved brand guideline. Applies to phone, desktop, 3D world, notification states and Desk.

## The aesthetic thesis
Make a **social music city that is desirable to spend time in**. The user likes the existing compositions but dislikes the omnipresent electrical glow and obvious AI-render look. The production direction is **crafted Lagos music culture**, not *neon cyberpunk*. A beautiful venue feels materially believable, with furniture, acoustic panels, posters, worn paint, sunlight, screen-printed event flyers, floors, plants and shared music. High style can coexist with low-poly geometry if the art direction is coherent.

### A non-negotiable distinction from Lagos Life
Learn from its lightweight world+location+phone+transport structure; never copy its look, logos, colour system, 3D models, copy, screen layouts or game mechanics verbatim. There is no verified evidence that its simple geometry is *solely* a performance choice; it could also reflect scope, budget or taste.

## Colour grammar (proposed)
- **Ink / UI base:** `#121B26`; raised surface `#1B2733`; secondary `#243240`.
- **Paper / high-light surfaces:** `#F5F1E9`; high-contrast white `#F4F6F7`.
- **Positive / committing an allowed action:** muted emerald `#2F9D77` (with explicit text, never color alone).
- **Desk identity:** slate-lilac `#877BA6`, with minimal accent magenta `#B65C84` for rare highlights (not for every sign and outline).
- **Street / hospitality warmth:** clay/amber `#CE9C53`, warm concrete, faded brick, matte terracotta, wood, textiles and metal.
- **Error/negative:** brick `#CF645E` supported by icons/text.
- **Focus:** `#F2D37C` visible focus outline. Contrast MUST be verified programmatically; these are starting tokens, not evidence of WCAG compliance.

**Venue diversity:** City Studio = acoustic wood + painted concrete + a modest colored recording light; Release Hall = airy gallery, warm white walls, physical album sleeves, single saturated art-wall moment; The Basement = shadow, charcoal brick, modest bar light, focused performance color; Music Square = open daylight or gold-hour civic warmth; label office = materials and character, not expensive generic luxury; Destiny Awards = gold/black accent as a *rare* seasonal exception. Avoid repeating the same pink crown neon on every wall.

## Typography
Pick one open-licensed UI family such as **Inter** or **Plus Jakarta Sans**, subset into a few WOFF2 files, and verify size. Base 15–16 CSS px, minor meta 13–14 where readable, financial/signature text larger. Functional buttons are clean sans-serif, no brush-script labels or thin outlined neon text. Decorative venue sign lettering may be authored in a texture but is not functional UI.

## 3D target art direction
- Strong silhouettes, compact levels, authored props; not a hyper-real cinematic crowd scene and not generic block figures. One consistent avatar skeleton and a small wardrobe palette sharing mesh/materials.
- Use one main camera language, likely elevated third-person 3/4 or controllable orbit with a constrained pitch; prototype **both** and select by touch usability. Don't silently assume a cinematic perspective from generated images.
- Daytime and nighttime palettes: daylight must be as good as the nighttime reference. Nighttime can rely on baked emissive accents and warm interior lightmaps, **not** many runtime spotlights, HDR bloom and shadows.
- Common navigation: signs, floor landmarks, entrances, vendors, doorframes, accessible doorway affordances and two-step physical activities.
- The environment is not a dashboard background: objects are interactable and placements are physically persistent. When a venue owner installs a speaker, it should visibly appear and affect a defined equipment capability, but never magically create attendees.
- Prohibit heavy per-object shadows, reflective floors everywhere, full scene-wide glass blur, world-sized video billboards and dense visible physics crowds in the default tier.

## Responsive UI contract
### Mobile browser (320–430 CSS px)
Top HUD: condensed avatar, context/time, single wallet summary; status badges collapse. Do NOT draw fake Safari browser chrome inside the game UI (actual browser owns that). Use CSS safe-area insets for real notches/home indicator. A maximum of **one expanded bottom sheet** at a time. World exploration mode should leave ~62%+ of viewport unobstructed, excluding native browser controls; compact interaction chips can sit low. Phone/contract/catalogue screens may use full-height overlays with a clear exit back to the world. Minimal nav items; prioritise **World, Map, Phone, Social**, remaining inside More if needed.

### Tablet / desktop
3D viewport occupies the majority of the width. Left navigation rail if useful; right Desk panel only when summoned or when a large context makes it practical. Avoid showing Desk, a contract drawer, 6 roster cards, chart stats and an event panel simultaneously; a user should choose the relevant mode. Keyboard and mouse shortcuts are secondary; click actions remain accessible.

### Common component vocabulary
`WorldHUD`, `WorldActionChip`, `LocationInteractionSheet`, `VenuePreviewCard`, `ArtistReleaseCard`, `SongMiniPlayer`, `SharedRoomAudioIndicator`, `DeskEntryChip`, `DeskTodaySheet`, `DeskActionCard`, `DeskAskSheet`, `RouteMapSheet`, `TravelStatusChip`, `ContractComparisonSheet`, `ReceiptAndHoldConfirmation`, `EventInviteCard`, `SystemNotice` and `ConnectionStatusToast`.

Each component MUST be designed in idle, loading, empty, outdated, success, error, offline and reconnect where applicable. Any destructive/spending/signing action has a separate server-confirmed receipt state. `DeskActionCard` only carries a *suggested next interaction*, not the power to commit actions.

## Desk design: quiet helper, not a mascot occupying the world
- Normal state: small `Desk` chip (without red dot unless there is a relevant real notification).
- Player opens it: `Today` (up to 3 **real** options), `Ask Desk`, `Plans`; options include reason, availability, actual cost/risk and `Show Route`, `Review`, `Save`.
- At a studio desk or venue controls: optional small question chip: “Need help?” and a sheet anchored to that workstation; do **not** spawn a cartoon humanoid hologram at every location.
- Phase 1: keyword/topic chips and deterministic rule-based answers; no generated fiction. Phase 2: natural-language explanation of exactly the same verified options; a cheap LLM is optional, never required for routing/transactions.
- Player autonomy: compare two venues; choose whether to spend; inspect an artist's actual work before signing; choose whether to take a cab or walk. If there is no good recommendation, Desk says so.

## Motion system
Purposeful, reusable animations: idle, turn, walk, gesture, dance, sit, workstation interaction, small stage performance, applause. Transitions blend between states and can be interrupted by user navigation; animations should not block controls. Default UI transitions 120–200ms, `prefers-reduced-motion` respected. Frame-rate independent character motion using delta times; player moves under local prediction and server correction, never under fixed per-frame distances. Camera jumps only for explicit scene/travel transitions. Fall back to simpler movement when frame rate drops.

## Do not treat the reference images as implementation screenshots
They sometimes show unapproved brands, unsupported revenue, fictitious crowd stats, over-large venues and dramatic particle lighting. See `REFERENCE_IMAGE_TRUTH.md`.

## Initial technical sketch
React/TypeScript DOM for touch UI and overlay state; small Three.js/R3F (or other renderer selected in M0 technical proof) for the world; authored glTF/GLB scenes, baked lighting, instancing, simple materials and compressed textures; fixed small number of avatar rigs. No full-page scene image masquerading as the game. For a 3D model or texture added, performance and compressed asset review is mandatory.
