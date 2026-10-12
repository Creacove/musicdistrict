# THE SCENE — design and gameplay chapters (local index)

**This archive is self-contained.** All source documents, Word versions, concept images and handoff notes are stored at relative paths within this archive. No ChatGPT file/library links are required.

## Canonical reading order

1. `AGENTS.md` (standing instructions and precedence), then `implementation/FINAL_FOUNDER_HANDOFF_REVIEW.md` (final audit and first Codex ask).
2. `master/THE_SCENE_Master_Game_Design_Document_v1.0.md` (integrated rules, reconciliation, milestones).
3. Choose exactly one of the topic chapters below. Read only related technical/visual handoff notes.
4. Look up a scenario in `references/IMAGE_MANIFEST.json`; open the local WebP file.
5. Check `implementation/REFERENCE_IMAGE_TRUTH.md` before implementing screenshot numbers or mechanics.

## Chapters 0–10: both Markdown and Word included

- **00 Architecture**: `chapters/00_Architecture/THE_SCENE_HPATH_Architecture_Amendment_v0.2.md` and `.docx`
- **01 Venue Operator**: `chapters/01_Venue_Operator/THE_SCENE_Venue_Operator_Foundation_v0.3.md` and `.docx`
- **02 Artist**: `chapters/02_Artist/THE_SCENE_Artist_Career_Foundation_v0.4.md` and `.docx`
- **03 Record Label**: `chapters/03_Record_Label/THE_SCENE_Record_Label_Career_Spec_v1.0.md` and `.docx`
- **04 Promoter**: `chapters/04_Promoter/THE_SCENE_Promoter_Career_and_Agency_Spec_v1.0.md` and `.docx`
- **05 Fan and Social**: `chapters/05_Fan_and_Social/THE_SCENE_Fan_and_Social_Experience_Spec_v1.0.md` and `.docx`
- **06 Concerts and Events**: `chapters/06_Concerts_and_Events/THE_SCENE_Concerts_and_Shared_Events_Spec_v1.0.md` and `.docx`
- **07 Music Discovery and Charts**: `chapters/07_Music_Discovery_and_Charts/THE_SCENE_Music_Discovery_and_Charts_Spec_v1.0.md` and `.docx`
- **08 Economy and Contracts**: `chapters/08_Economy_and_Contracts/THE_SCENE_Economy_and_Contracts_Spec_v1.0.md` and `.docx`
- **09 World NPCs and Operations**: `chapters/09_World_NPCs_and_Operations/THE_SCENE_World_NPCs_and_Operations_Spec_v1.0.md` and `.docx`
- **10 Desk Bot**: `chapters/10_Desk_Bot/THE_SCENE_Desk_Bot_Player_Intelligence_and_Navigation_Spec_v1.0.md` and `.docx`

## Other useful documents

- H-Path interaction matrix and seven-day scenario: `supplements/`
- Visual design, responsive UX and screens: `implementation/VISUAL_DESIGN_SYSTEM.md` and `implementation/SCREEN_STATES_AND_JOURNEYS.md`
- Data use, asset loading and frame-rate targets: `implementation/PERFORMANCE_MEDIA_BUDGET.md`
- QA and release gates: `implementation/QUALITY_GATES.md`
- Production-ready asset requirements: `implementation/ASSET_AND_ANIMATION_PRODUCTION_BRIEF.md`
- Founder handoff / open external gates: `implementation/FINAL_FOUNDER_HANDOFF_REVIEW.md`
- Corrected file-by-file visual lookup: `implementation/REFERENCE_LOOKUP.md`
- Reference correctness: `implementation/REFERENCE_IMAGE_TRUTH.md`
- Word-form visual/performance playbook: `implementation/THE_SCENE_Visual_UX_and_Performance_Playbook_v1.0.docx`
- 27 local concept screenshots and comparison sheet: `references/`

## Visual direction priority

Current direction: `references/screens/26_FINAL_music_square_desk_today.webp` and `references/screens/27_FINAL_palm_room_venue_leasing.webp`.
Previous 25 images show additional user journeys, professions and interaction compositions and are **exploration references**. Prefer the final 2 for light/color/overall weight. Do not assume their pixel composition is a ready-made game UI; author proper responsive screens.

## Folder handling for Codex

For a new project: place the contents of this archive at the repository root so Codex detects `AGENTS.md`.
For an existing repo: do not overwrite an existing root `AGENTS.md`; merge these instructions, or put the archive in `docs/the-scene` and reference it from root instructions. Audit the repository before code changes.

## Hard stops / examples

- Do not interpret concept-image prices, capacity, fake online counts, artist rosters, monetary streams, master rights, or lease costs as approved rules.
- Desk gives alternatives and route guidance and never commits funds or contracts on player behalf.
- Keep Lagos Life integration to documented permitted capabilities; no invented wallet APIs.
- Do not bundle these screenshots into the runtime client as game scenes.
- Work must remain enjoyable with zero game naira, and audio cannot preload the entire catalogue.

**v2.1 correction:** historical supplement `R01–R16` are role IDs; reference images are `V01–V27`. The `REFERENCE_LOOKUP.md` paths point to real included files.
