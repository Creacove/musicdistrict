import * as THREE from 'three'
import { BOUNDARIES, getNearby, isPointBlocked, resolveCollision, type Hotspot, type Location } from './worldModel.ts'
import { findWalkPath, type WalkPoint } from './navigation.ts'
import { makeSquare } from './world.ts'
import { reportedTransferBytes, summarizeFrames } from './performance.ts'
import { sectionsDiffer, starterPattern, toggleStep, validPattern, clearPattern, clampBpm, bpmToStepMs, SOUND_KITS, type BeatPattern, type SoundKit } from './beatPattern.ts'
import { loadLocalMaster, saveLocalMaster } from './localMaster.ts'
import { blankReleaseDraft, releaseBlockers, validReleaseDraft, canPreflight, RELEASE_GENRES, type ReleaseDraft, type ArtworkVariant, type ReleaseGenre } from './releaseDraft.ts'
import { createReleaseSleeveSvg } from './releaseArtwork.ts'
import { rehearsalMetrics } from './eventPreview.ts'
import { connectPresence, type EmoteType, type FriendUpdateKind, type PartyUpdateKind, type PresencePartyMessage, type PresencePlayer } from './presence.ts'
import { peopleInLocation } from './people.ts'
import { emotePose, idlePose, walkingPose } from './avatarMotion.ts'
import { facingAngleForMovement } from './avatarFacing.ts'
import { disposeSpriteResources } from './avatarLifecycle.ts'
import { acceptGuestFriendRequest, acceptGuestPartyInvitation, addGuestPlaylistTrack, blockGuest, cancelGuestFriendRequest, createGuestParty, createGuestPlaylist, declineGuestFriendRequest, declineGuestPartyInvitation, deleteGuestPlaylist, fetchCatalogue, fetchGuestBlocks, fetchGuestEventPlanning, fetchGuestFriends, fetchGuestMessages, fetchGuestParty, fetchGuestPartyMessages, fetchGuestPlaylists, inviteGuestEventPerformer, inviteGuestToParty, leaveGuestParty, openGuest, proposeGuestPartyTravel, removeGuestPlaylistTrack, removeGuestSave, reorderGuestPlaylistTracks, reorderGuestPlaylists, requestGuestFriend, renameGuestPlaylist, respondGuestEventInvitation, saveGuestEventDraft, saveGuestPreview, sendGuestMessage, sendGuestPartyMessage, setGuestMessagePreference, submitGuestReport, unfriendGuest, unblockGuest, voteGuestPartyTravel, type CatalogueTrack, type GuestDirectMessage, type GuestEventInvitation, type GuestEventPerformer, type GuestFriendState, type GuestPartyMessage, type GuestPartyState, type GuestPlaylist, type GuestReportReason } from './guest.ts'
import { LIGHTING_PRESETS, getNextLightingMode, type LightingMode } from './lighting.ts'
import { parseStageTemplate, serializeStageTemplate, type StageLook } from './stageTemplate.ts'
import { RELEASE_JOURNEY, nextReleaseStation, previousReleaseStation, releaseStation, type ReleaseStationId } from './releaseJourney.ts'
import { nextMusicJourneyStep } from './musicJourney.ts'
import { resolveDeskQuestion } from './deskQuery.ts'
import { completeGuestCityJobStep, fetchGuestCityJobs, finishGuestCityJob, startGuestCityJob, type CityJobStepId, type GuestCityJobState } from './guest.ts'
import './style.css'

const SOLO_PREVIEW = import.meta.env?.VITE_SCENE_DEMO_MODE === 'true'
const mapDestinations: { id: Hotspot; name: string; detail: string }[] = [
  { id: 'releaseEntrance', name: 'Release House', detail: 'Record intake · private sleeve' },
  { id: 'studio', name: 'City Studio', detail: 'Free beat desk' },
  { id: 'kiosk', name: 'Listening station', detail: 'Original music preview' },
  { id: 'palmEntrance', name: 'Palm Room', detail: 'Walkable venue preview' },
]

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
<main id="game">
  <div id="world" aria-label="Interactive 3D THE SCENE world"></div>
  <div class="shade"></div>
  <header class="topbar">
    <div class="brand"><span class="brand-mark">♛</span><span>THE<br>SCENE</span></div>
    <div class="top-divider"></div>
    <div class="clock" id="time-toggle" role="button" tabindex="0" title="Switch atmosphere (Daylight / Golden Hour / Night)"><span>🌅</span><div><b id="time-label">GOLDEN HOUR</b><small id="place-name">Music Square · Lagos</small></div></div>
    <div class="top-divider mood-divider"></div>
    <div class="mood"><i></i> EXPLORING</div>
    <div id="wallet-chip" class="wallet-chip" aria-label="THE SCENE money (simulation): ₦0"><small>SIM WALLET</small><b id="wallet-balance">₦0</b></div>
    <button id="audio" aria-label="Audio off">♫ <span>OFF</span></button>
  </header>

  <div class="scene-label"><span>THE SCENE / WORLD 01</span><b id="scene-name">MUSIC SQUARE</b></div>
  <button id="map-button" class="map-button" aria-label="Open map"><span id="map-arrow">⌁</span><small>MAP</small></button>
  <div id="route" class="route" hidden><span id="route-arrow" aria-hidden="true">↑</span><div><b id="route-title"></b><small id="route-distance"></small></div><button id="route-close" aria-label="Cancel route">×</button></div>
  <section id="map-sheet" class="map-sheet" hidden aria-label="Music Square district map">
    <button id="map-close" class="icon-close" aria-label="Close map">×</button>
    <small class="eyebrow">LAGOS · WALKABLE DISTRICT</small><h2>Find your way</h2>
    <p id="map-context">Choose a place. The route leads to its physical entrance.</p>
    <div class="district-map" role="img" aria-label="Map of Music Square and nearby destinations">
      <span class="map-road map-road-horizontal"></span><span class="map-road map-road-vertical"></span>
      <svg id="map-route-line" class="map-route-line" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true" hidden><polyline id="map-route-stroke" points="" /></svg>
      <span class="map-plaza">MUSIC<br>SQUARE</span><span id="map-avatar" class="map-avatar" aria-label="Your position">●<small>YOU</small></span>
      <button data-map-target="releaseEntrance" style="--mx:15%;--my:18%">▣<small>RELEASE HOUSE</small></button>
      <button data-map-target="studio" style="--mx:84%;--my:18%">♫<small>CITY STUDIO</small></button>
      <button data-map-target="kiosk" style="--mx:28%;--my:54%">◉<small>LISTEN</small></button>
      <button data-map-target="palmEntrance" style="--mx:76%;--my:54%">♛<small>PALM ROOM</small></button>
    </div>
    <div id="map-places" class="map-places"></div>
    <small class="map-note">Walking is free. Arriving outside does not enter or book a place.</small>
  </section>

  <section id="venue-card" class="venue-card" hidden>
    <button id="venue-close" class="icon-close" aria-label="Close venue information">×</button>
    <div class="venue-art"><span>🌴</span><strong>PALM<br>ROOM</strong></div>
    <div class="venue-content"><div class="venue-title-row"><h1>Palm Room</h1><span class="tag">♫ Live music</span></div><p class="location-copy">⌖ &nbsp;Victoria Island · Prototype venue</p><p class="venue-description">A warm, intimate music hall built for the first playable venue inspection.</p><div class="venue-facts"><span><b>Room</b><small>Walkable preview</small></span><span><b>Stage</b><small>Setup interaction</small></span><span><b>Lease</b><small>Quote unavailable</small></span></div></div>
    <div class="venue-buttons"><button id="preview-hall" class="green-button">Explore hall</button><button id="view-setup">View stage setup</button><button id="lease" disabled title="Server-side venue pricing is not implemented">Lease unavailable</button></div>
  </section>

  <div id="context" class="context" hidden><div><span id="context-icon">✦</span><div><b id="context-name"></b><small id="context-help">Approach and interact</small></div></div><button id="interact">Interact <kbd>E</kbd></button></div>
  <div id="stage-cue-hud" class="stage-cue-hud" hidden aria-label="Local stage rehearsal controls"><div><b id="stage-cue-title">REHEARSAL</b><span id="stage-cue-time">0:00 / 0:30</span></div><div class="stage-cue-actions"><button data-cue-look="warm">Warm</button><button data-cue-look="sunset">Sunset</button><button data-cue-look="spotlight">Spot</button><button id="stage-cue-stop" aria-label="Stop rehearsal">Stop</button></div><small id="stage-cue-count">Tap a light to cue it during your master.</small></div>
  <section id="mini-player" class="mini-player" hidden aria-label="Personal music preview">
    <div class="mini-art">♫</div>
    <div class="mini-copy"><b id="mini-title">Square Sketch</b><small id="mini-artist">Original demo · private preview</small></div>
    <button id="mini-prev" aria-label="Previous track" title="Previous song">◀</button>
    <button id="mini-play" aria-label="Play track">▶</button>
    <button id="mini-next" aria-label="Next track" title="Next song">▶</button>
    <button id="mini-save" aria-label="Save track">♡</button>
  </section>
  <div class="emote-bar" aria-label="Social reactions">
    <button id="dance" class="dance-button" aria-pressed="false" title="Dance to music">♪ Dance</button>
    <button id="emote-toggle" class="reaction-toggle" aria-expanded="false" aria-controls="emote-actions">☺ Reactions</button>
    <div id="emote-actions" class="emote-actions" hidden>
      <button data-emote="cheer" title="Cheer" aria-label="Cheer emote">🙌<small>Cheer</small></button>
      <button data-emote="wave" title="Wave" aria-label="Wave emote">👋<small>Wave</small></button>
      <button data-emote="heart" title="Heart" aria-label="Heart emote">❤️<small>Love</small></button>
      <button data-emote="fire" title="Fire" aria-label="Fire emote">🔥<small>Fire</small></button>
      <button id="chat-toggle" title="Quick chat" aria-label="Quick chat phrases">💬<small>Chat</small></button>
    </div>
  </div>
  <div id="chat-menu" class="chat-menu" hidden aria-label="Quick phrases">
    <div class="chat-channel-control">
      <small id="chat-channel-copy">Local chat starts muted. Enable it to receive and send phrases in this place.</small>
      <button id="chat-channel-toggle" type="button" aria-pressed="false">Enable local chat</button>
    </div>
    <div class="chat-phrases">
      <button data-phrase="Yo! 👋" disabled>Yo! 👋</button>
      <button data-phrase="Nice beat! 🔥" disabled>Nice beat! 🔥</button>
      <button data-phrase="Heading to Studio 🎧" disabled>Heading to Studio 🎧</button>
      <button data-phrase="Meet at Palm Room 🌴" disabled>Meet at Palm Room 🌴</button>
      <button data-phrase="Vibing here ✨" disabled>Vibing here ✨</button>
      <button data-phrase="Check out the sound! 🎶" disabled>Check out the sound! 🎶</button>
    </div>
    <small class="chat-safety-note">Curated phrases only · visible to opted-in players in this public place.</small>
  </div>
  <div id="chat-feed" class="chat-feed" aria-live="polite"></div>
  <div id="presence-status" class="presence-status" role="status">Connecting to Music Square…</div>

  <section id="action-sheet" class="action-sheet" hidden>
    <button id="action-close" class="icon-close" aria-label="Close interaction">×</button>
    <small class="eyebrow">IN THE WORLD</small><h2 id="action-title"></h2><p id="action-copy"></p>
    <div class="action-buttons"><button id="action-primary" class="green-button"></button><button id="action-secondary" hidden></button></div>
  </section>

  <section id="desk-sheet" class="desk-sheet" hidden>
    <div class="sheet-grip"></div><button id="desk-close" class="icon-close" aria-label="Close Desk">×</button>
    <div class="desk-head"><div class="desk-face">✦</div><div><h2>Desk Bot <i></i></h2><p id="desk-intro">Your music journey, one step at a time.</p></div></div>
    <div class="desk-tabs" role="tablist"><button data-tab="today" class="active" role="tab" aria-selected="true">Today</button><button data-tab="ask" role="tab" aria-selected="false">Ask</button><button data-tab="plans" role="tab" aria-selected="false">My Plans</button></div>
    <div id="desk-cards" class="desk-cards"></div>
  </section>

  <section id="display-sheet" class="display-sheet" hidden aria-label="Display and data settings">
    <button id="display-close" class="icon-close" aria-label="Close display settings">×</button>
    <small class="eyebrow">LOCAL PROTOTYPE</small><h2>Display & data</h2>
    <p>Choose a render quality for this device. Measurements below describe this browser session only.</p>
    <div class="quality-choices"><button data-quality="saver">Data Saver</button><button data-quality="balanced">Balanced</button><button data-quality="quality">Quality</button></div>
    <div class="quality-choices" id="lighting-choices" style="margin-top:12px"><button data-lighting="day">Daylight ☀</button><button data-lighting="golden">Golden Hour 🌅</button><button data-lighting="night">Night Neon 🌙</button></div>
    <dl class="runtime-metrics"><div><dt>Frame time</dt><dd id="frame-metric">Measuring…</dd></div><div><dt>Rendered scene</dt><dd id="scene-metric">Measuring…</dd></div><div><dt>Reported transfer</dt><dd id="transfer-metric">Measuring…</dd></div><div><dt>Avatar ready</dt><dd id="ready-metric">Measuring…</dd></div><div><dt>Audio before Play</dt><dd>0 B · generated preview</dd></div></dl>
    <p class="metric-note">The local preview is not CDN-compressed. Real-phone FPS, thermals, and network recovery still need device testing.</p>
  </section>
  <section id="music-sheet" class="music-sheet" hidden aria-labelledby="music-title">
    <div class="sheet-grip"></div><button id="music-close" class="icon-close" aria-label="Close My Music">×</button>
    <small class="eyebrow">PERSONAL COLLECTION · PRIVATE</small><h2 id="music-title">My Music</h2>
    <p>Keep released songs and your own playlists together. Playlist entries do not grant downloads or extra playback rights.</p>
    <section class="music-saved-block" aria-labelledby="music-saved-title"><div class="music-section-title"><b id="music-saved-title">Saved songs</b><small id="music-saved-count">0 songs</small></div><div id="music-saved-list"></div></section>
    <form id="playlist-create-form" class="playlist-create-form"><label for="playlist-name">Make a playlist</label><div><input id="playlist-name" name="name" maxlength="40" required placeholder="e.g. After Hours" autocomplete="off" /><button type="submit" class="green-button">Create</button></div><small>Private to you · up to 20 playlists</small></form>
    <div class="music-section-title"><b>Your playlists</b><small>0–100 released songs each</small></div>
    <div id="music-playlist-list" class="music-playlist-list" aria-live="polite"></div>
    <div class="music-sheet-footer"><small id="music-status" role="status" aria-live="polite">Your music follows your player identity.</small><button id="music-device-settings" type="button">Display & data settings</button></div>
  </section>
  <section id="beat-sheet" class="beat-sheet" hidden aria-label="City Studio beat desk">
    <button id="beat-close" class="icon-close" aria-label="Close beat desk">×</button>
    <small class="eyebrow">CITY STUDIO · WORKSTATION PREVIEW</small><h2>Make a beat</h2>
    <p>Tap pads to arrange four sound loops. Choose an authored sound kit and sync tempo. This private pattern stays on this device.</p>
    <div class="kit-tabs" aria-label="Sound Kit">
      <button data-kit="afrobeats" aria-pressed="true">Afrobeats Core<small>104 BPM</small></button>
      <button data-kit="amapiano" aria-pressed="false">Piano Groove<small>112 BPM</small></button>
      <button data-kit="highlife" aria-pressed="false">Highlife Vibe<small>96 BPM</small></button>
    </div>
    <div class="tempo-row">
      <div class="section-tabs"><button data-section="a">Section A</button><button data-section="b">Section B</button></div>
      <div class="tempo-control">
        <label for="beat-tempo">Tempo <b id="tempo-display">104</b> BPM</label>
        <input type="range" id="beat-tempo" min="80" max="140" value="104" step="2" />
      </div>
      <button id="beat-clear" class="subtle-btn" title="Clear current section">Clear</button>
    </div>
    <div id="beat-grid" class="beat-grid"></div>
    <div class="beat-actions">
      <button id="beat-play" class="green-button">▶ Play beat</button>
      <button id="beat-save">Save pattern</button>
      <button id="beat-render">Render 30s master</button>
    </div>
    <small id="beat-status">No release, upload, or public sharing is available.</small>
  </section>
  <section id="release-sheet" class="release-sheet" hidden aria-labelledby="release-station-title">
    <button id="release-close" class="icon-close" aria-label="Close release station">×</button>
    <small id="release-step-count" class="eyebrow">STATION 1 OF 6</small>
    <h2 id="release-station-title">Record Intake</h2>
    <p id="release-station-instruction">Check the private master saved from City Studio.</p>
    <ol id="release-steps" class="release-steps" aria-label="Release preparation stations"></ol>
    <section data-release-panel="intake" class="release-panel">
      <div class="release-station-card"><small>LOCAL PROJECT</small><b id="release-master-status">No rendered master on this device</b><p>Render a 30-second arrangement at the City Studio desk. It stays private here.</p></div>
    </section>
    <section data-release-panel="artwork" class="release-panel" hidden>
      <div class="release-layout">
        <div id="release-cover" class="release-cover" data-art="rose" role="img" aria-label="Private release sleeve preview">
          <span>THE SCENE</span><strong id="release-cover-title">UNTITLED</strong><small id="release-cover-artist">ARTIST NAME</small><div class="cover-genre-tag" id="release-cover-genre">Afrobeats</div>
        </div>
        <div><div class="cover-choices-label">Choose a local sleeve palette</div><div class="cover-choices" aria-label="Draft artwork colour">
          <button data-art="rose" aria-label="Eko Rose" title="Eko Rose"></button><button data-art="teal" aria-label="Marina Teal" title="Marina Teal"></button><button data-art="night" aria-label="Broad St Night" title="Broad St Night"></button><button data-art="amber" aria-label="Lekki Amber" title="Lekki Amber"></button><button data-art="lagos-violet" aria-label="Lagos Neon" title="Lagos Neon"></button>
        </div><button id="release-export-sleeve" class="release-export">Download sleeve PNG</button></div>
      </div>
      <small>Original artwork preview, saved on this device. No upload or public listing.</small>
    </section>
    <section data-release-panel="metadata" class="release-panel" hidden>
      <div class="release-fields">
        <label>Song title<input id="release-title" maxlength="80" placeholder="Name your track" autocomplete="off" /></label>
        <label>Artist name<input id="release-artist" maxlength="80" placeholder="Your artist name" autocomplete="off" /></label>
        <label>Genre<select id="release-genre" class="release-select"><option value="afrobeats">Afrobeats</option><option value="amapiano">Amapiano</option><option value="highlife">Highlife</option><option value="afro-fusion">Afro-fusion</option><option value="street-pop">Street-pop</option></select></label>
      </div>
      <small>Credits are private metadata in this prototype. Add collaborator consent at the Rights Console.</small>
    </section>
    <section data-release-panel="listening" class="release-panel" hidden>
      <div class="release-station-card"><small>LOCAL MASTER · NO CATALOGUE UPLOAD</small><b id="release-listen-status">Render a master in City Studio before auditioning.</b><p>Playback starts only when you choose Play. This is a private local check.</p></div>
      <div class="release-actions"><button id="release-play" class="green-button" hidden>▶ Play local master</button><button id="release-export-master" class="release-export" hidden>Download local master WAV</button></div>
    </section>
    <section data-release-panel="rights" class="release-panel" hidden>
      <div class="rights-console"><b>Rights & Clearances Affirmations</b><small>Chapter 02 §6 · declarations are not independent verification. Original works only in this local preflight.</small>
        <div class="rights-grid">
          <label class="rights-checkbox"><input type="checkbox" id="right-master" /><span>I control or own this master sound recording</span></label>
          <label class="rights-checkbox"><input type="checkbox" id="right-composition" /><span>I control the original lyrics, melody and composition</span></label>
          <label class="rights-checkbox"><input type="checkbox" id="right-samples" /><span>All loops, instruments and samples are cleared for this use</span></label>
          <label class="rights-checkbox"><input type="checkbox" id="right-consent" /><span>Every named performer and credited collaborator has consented</span></label>
        </div>
      </div>
      <small>Covers and remixes need an enhanced permission review that this prototype does not provide.</small>
    </section>
    <section data-release-panel="calendar" class="release-panel" hidden>
      <div class="release-calendar" aria-label="Read-only Lagos Friday release calendar preview">
        <div class="release-calendar-top"><div><small>NEXT ELIGIBLE FRIDAY · LAGOS TIME</small><b id="release-next-friday">Loading server calendar…</b></div><span id="release-calendar-status" role="status">Checking server time</span></div>
        <div class="release-calendar-times"><div><small>SUBMIT BY</small><b id="release-submit-deadline">—</b></div><div><small>MODERATION CHECKPOINT</small><b id="release-moderation-checkpoint">—</b></div><div><small>PREMIERE</small><b id="release-premiere-time">—</b></div></div>
      </div>
      <div class="release-checklist"><b>Local preflight checklist</b><ul id="release-blockers"></ul></div>
      <button id="release-preflight" class="purple-button" disabled>Check local preflight</button>
      <small>Calendar preview only. Upload, rights review, reservation and Friday publication are unavailable.</small>
    </section>
    <div class="release-journey-nav"><button id="release-previous" class="release-export" hidden></button><button id="release-next" class="green-button" hidden></button></div>
    <div class="release-actions"><button id="release-save" class="green-button">Save private draft on this device</button></div>
    <small id="release-status" role="status" aria-live="polite">Private release preparation. Nothing is uploaded or submitted.</small>
  </section>

  <div id="toast" class="toast" role="status"></div>
  <div id="pad" class="pad" aria-label="Touch movement pad"><div id="stick"></div></div>
  <div class="keyboard-hint"><kbd>W</kbd><kbd>A</kbd><kbd>S</kbd><kbd>D</kbd> MOVE <span>·</span> DRAG TO LOOK</div>
  <nav class="bottom-nav" aria-label="Main navigation"><button id="home" class="active"><span>⌂</span>Home</button><button id="nav-map"><span>▱</span>Map</button><button id="nav-create"><span>⊕</span>Create</button><button id="nav-people"><span>♧</span>People</button><button id="nav-phone"><span>▯</span>Phone</button></nav>
  <button id="desk-trigger" class="desk-trigger"><span>✦</span> Desk <small>Next moves</small></button>

  <section id="people-sheet" class="avatar-sheet people-sheet" hidden aria-labelledby="people-title">
    <button id="people-close" class="icon-close" aria-label="Close people">×</button>
    <small class="eyebrow">LIVE IN THE WORLD</small><h2 id="people-title">People in this place</h2>
    <p id="people-description">Only other connected players are shown. Wave to the people sharing this space.</p>
    <p id="people-status" class="people-status" role="status" aria-live="polite">Connecting to the world…</p>
    <div id="people-list" class="people-list" role="list" aria-live="polite"></div>
    <section id="friend-section" class="friend-section" hidden aria-labelledby="friend-section-title">
      <h3 id="friend-section-title">Friends & requests</h3>
      <p id="friend-empty" class="friend-empty">Friends are mutual. You choose whether to accept each request.</p>
      <label class="message-preference"><input id="friend-messages-enabled" type="checkbox" checked> Allow messages from friends</label>
      <small class="message-preference-note">Turn this off to stop sending and receiving friend messages.</small>
      <div id="friends-list" class="social-list" role="list" aria-label="Friends"></div>
      <div id="incoming-friends" class="social-list" role="list" aria-label="Received friend requests"></div>
      <div id="outgoing-friends" class="social-list" role="list" aria-label="Sent friend requests"></div>
    </section>
    <section id="party-section" class="party-section" hidden aria-labelledby="party-title">
      <h3 id="party-title">Party</h3>
      <p class="party-note">A temporary group of up to four real guests. Invitations expire in 10 minutes. No pooled money.</p>
      <div id="party-overview"></div>
      <div id="party-incoming" class="social-list" role="list" aria-label="Party invitations"></div>
      <button id="party-create" class="social-action party-create" data-party-action="create" type="button">Start a party</button>
      <div id="party-chat"></div>
    </section>
    <section id="blocked-section" class="blocked-section" hidden aria-labelledby="blocked-title"><h3 id="blocked-title">Blocked sessions</h3><div id="blocked-list" role="list"></div></section>
    <div class="people-actions"><button id="people-wave" class="green-button" disabled>👋 Wave to everyone here</button><button id="people-edit-avatar" class="people-edit">Customize avatar</button></div>
  </section>

  <dialog id="report-dialog" class="report-dialog" aria-labelledby="report-title">
    <form id="report-form">
      <button id="report-close" class="icon-close" type="button" aria-label="Close report">×</button>
      <small class="eyebrow">PLAYER SAFETY</small><h2 id="report-title">Report a player</h2>
      <p id="report-target" class="report-target"></p>
      <label for="report-reason">What happened?</label>
      <select id="report-reason" required>
        <option value="harassment">Harassment or abuse</option>
        <option value="spam">Spam or disruption</option>
        <option value="inappropriate_name">Inappropriate display name</option>
        <option value="other">Other safety concern</option>
      </select>
      <label for="report-details">Add details <span>Optional · up to 240 characters</span></label>
      <textarea id="report-details" maxlength="240" rows="4" placeholder="Share only what is needed for review."></textarea>
      <p class="report-disclosure">This prototype stores reports in a private local queue. No moderation team is connected yet.</p>
      <p id="report-status" class="report-status" role="status" aria-live="polite"></p>
      <div class="report-actions"><button id="report-cancel" class="people-edit" type="button">Cancel</button><button id="report-submit" class="green-button" type="submit">Send report</button></div>
    </form>
  </dialog>

  <dialog id="direct-message-dialog" class="direct-message-dialog" aria-labelledby="direct-message-title">
    <form id="direct-message-form">
      <div class="direct-message-heading"><div><small class="eyebrow">PRIVATE · FRIENDS ONLY</small><h2 id="direct-message-title">Message your friend</h2></div><button id="direct-message-close" class="icon-close" type="button" aria-label="Close conversation">×</button></div>
      <p class="direct-message-disclosure">Messages are delivered only to you and this friend, and stored on the prototype server. Avoid personal contact details. Block or report from People. No moderation team is connected here.</p>
      <div id="direct-message-history" class="direct-message-history" role="log" aria-live="polite" aria-relevant="additions text"></div>
      <p id="direct-message-status" class="direct-message-status" role="status" aria-live="polite"></p>
      <label class="sr-only" for="direct-message-input">Write a message</label>
      <textarea id="direct-message-input" maxlength="500" rows="2" placeholder="Write to your friend…"></textarea>
      <div class="direct-message-footer"><small><span id="direct-message-count">0</span>/500 characters</small><button id="direct-message-send" class="green-button" type="submit">Send message</button></div>
    </form>
  </dialog>

  <section id="avatar-sheet" class="avatar-sheet" hidden aria-label="Avatar appearance">
    <button id="avatar-close" class="icon-close" aria-label="Close appearance">×</button>
    <small class="eyebrow">YOUR AVATAR · LOCAL PREVIEW</small><h2>Appearance</h2>
    <p>Choose how your placeholder avatar looks on this device. Saved locally — not visible to others until real multiplayer identity exists.</p>
    <div class="avatar-row">
      <div class="avatar-preview" id="avatar-preview-canvas"></div>
      <div class="avatar-options">
        <label class="option-label" for="avatar-name">Display name</label>
        <div class="name-row">
          <input id="avatar-name" maxlength="16" placeholder="Your name" autocomplete="off" />
        </div>
        <label class="option-label">Skin tone</label>
        <div class="swatch-row" data-option="skin">
          <button data-value="#c68642" aria-label="Skin tone 1" style="background:#c68642"></button>
          <button data-value="#8d5524" aria-label="Skin tone 2" style="background:#8d5524"></button>
          <button data-value="#70412f" aria-label="Skin tone 3" style="background:#70412f"></button>
          <button data-value="#f1c27d" aria-label="Skin tone 4" style="background:#f1c27d"></button>
          <button data-value="#ffdbac" aria-label="Skin tone 5" style="background:#ffdbac"></button>
        </div>
        <label class="option-label">Shirt colour</label>
        <div class="swatch-row" data-option="shirt">
          <button data-value="#7758b0" aria-label="Purple shirt" style="background:#7758b0"></button>
          <button data-value="#2e7d32" aria-label="Green shirt" style="background:#2e7d32"></button>
          <button data-value="#1565c0" aria-label="Blue shirt" style="background:#1565c0"></button>
          <button data-value="#b71c1c" aria-label="Red shirt" style="background:#b71c1c"></button>
          <button data-value="#e65100" aria-label="Orange shirt" style="background:#e65100"></button>
          <button data-value="#37474f" aria-label="Slate shirt" style="background:#37474f"></button>
        </div>
        <label class="option-label">Trouser colour</label>
        <div class="swatch-row" data-option="trousers">
          <button data-value="#7758b0" aria-label="Purple trousers" style="background:#7758b0"></button>
          <button data-value="#1a237e" aria-label="Indigo trousers" style="background:#1a237e"></button>
          <button data-value="#263238" aria-label="Charcoal trousers" style="background:#263238"></button>
          <button data-value="#4e342e" aria-label="Brown trousers" style="background:#4e342e"></button>
          <button data-value="#004d40" aria-label="Teal trousers" style="background:#004d40"></button>
          <button data-value="#880e4f" aria-label="Burgundy trousers" style="background:#880e4f"></button>
        </div>
      </div>
    </div>
  </section>
</main>`

const $ = <T extends Element>(id: string) => document.getElementById(id) as unknown as T
const world = $<HTMLDivElement>('world')
const scene = new THREE.Scene()
scene.background = new THREE.Color('#413243')
scene.fog = new THREE.Fog('#413243', 32, 72)
const camera = new THREE.PerspectiveCamera(56, 1, .1, 90)
const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' })
type Quality = 'saver' | 'balanced' | 'quality'
let quality: Quality = (['saver', 'balanced', 'quality'].includes(localStorage.getItem('scene-quality') || '') ? localStorage.getItem('scene-quality') : 'balanced') as Quality
function applyQuality() {
  renderer.setPixelRatio(Math.min(devicePixelRatio, quality === 'saver' ? 1 : quality === 'quality' ? 2 : 1.5))
  renderer.shadowMap.enabled = quality !== 'saver'
  renderer.shadowMap.needsUpdate = true
  document.querySelectorAll<HTMLButtonElement>('[data-quality]').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.quality === quality)))
  if (world.clientWidth) resize()
}
renderer.shadowMap.type = THREE.PCFShadowMap
applyQuality()
renderer.outputColorSpace = THREE.SRGBColorSpace
renderer.toneMapping = THREE.ACESFilmicToneMapping
renderer.toneMappingExposure = 1.16
world.appendChild(renderer.domElement)

const square = makeSquare()
scene.add(square)
type PalmRoom = { root: THREE.Group; update: (time: number) => void; setEquipmentPreview: (visible: boolean) => void; setRehearsalMonitors: (visible: boolean) => void; setRehearsalBackdrop: (visible: boolean) => void; setStageLook: (look: StageLook) => void; setStagePerformance: (active: boolean) => void }
let palmRoom: PalmRoom | null = null
let studioRoom: THREE.Group | null = null
let releaseRoom: THREE.Group | null = null
let location: Location = 'square'
const ambient = new THREE.HemisphereLight('#d9e2ed', '#72523d', 1.9)
scene.add(ambient)
const sun = new THREE.DirectionalLight('#ffd9ad', 2.0)
sun.position.set(-8, 16, 9)
sun.castShadow = true
sun.shadow.mapSize.set(1024, 1024)
sun.shadow.camera.left = sun.shadow.camera.bottom = -24
sun.shadow.camera.right = sun.shadow.camera.top = 24
scene.add(sun)

let lightingMode: LightingMode = (['day', 'golden', 'night'].includes(localStorage.getItem('scene-lighting') || '') ? localStorage.getItem('scene-lighting') : 'golden') as LightingMode
function applyLighting(mode: LightingMode) {
  lightingMode = mode
  localStorage.setItem('scene-lighting', mode)
  const preset = LIGHTING_PRESETS[mode]
  scene.background = new THREE.Color(preset.background)
  scene.fog = new THREE.Fog(preset.fog, 32, 72)
  ambient.color.set(preset.skyColor)
  ambient.groundColor.set(preset.groundColor)
  ambient.intensity = preset.ambientIntensity
  sun.color.set(preset.sunColor)
  sun.intensity = preset.sunIntensity
  sun.position.set(...preset.sunPos)
  renderer.toneMappingExposure = preset.exposure

  const clockIcon = document.querySelector<HTMLElement>('#time-toggle > span')
  if (clockIcon) clockIcon.textContent = preset.icon
  const clockText = document.querySelector<HTMLElement>('#time-label')
  if (clockText) clockText.textContent = preset.label

  document.querySelectorAll<HTMLButtonElement>('[data-lighting]').forEach(b => {
    b.setAttribute('aria-pressed', String(b.dataset.lighting === mode))
  })
}
applyLighting(lightingMode)

// The avatar is original prototype geometry, not a borrowed rig or a fake connected player.
const avatar = new THREE.Group()
scene.add(avatar)
const avatarBody = new THREE.Group()
avatarBody.name = 'avatar-body'
avatar.add(avatarBody)
const skin = new THREE.MeshStandardMaterial({ color: '#70412f', roughness: .9 })
const cloth = document.createElement('canvas')
cloth.width = cloth.height = 256
const clothContext = cloth.getContext('2d')!
clothContext.fillStyle = '#d5a344'; clothContext.fillRect(0, 0, 256, 256)
clothContext.save()
clothContext.globalAlpha = .1
for (let y = 0; y < 256; y += 4) {
  clothContext.strokeStyle = y % 8 ? '#f4d98e' : '#946f38'
  clothContext.lineWidth = 1
  clothContext.beginPath(); clothContext.moveTo(0, y); clothContext.lineTo(256, y + 2); clothContext.stroke()
}
clothContext.restore()
for (let row = 0; row < 8; row++) for (let col = 0; col < 8; col++) {
  const x = 16 + col * 32, y = 16 + row * 32
  clothContext.save()
  clothContext.translate(x, y)
  clothContext.rotate((row + col) % 2 ? Math.PI / 4 : 0)
  clothContext.strokeStyle = '#1e5a50'; clothContext.lineWidth = 1.4
  clothContext.strokeRect(-8, -8, 16, 16)
  clothContext.strokeStyle = '#f2d88d'; clothContext.lineWidth = 1
  clothContext.strokeRect(-5, -5, 10, 10)
  clothContext.restore()
  clothContext.save()
  clothContext.translate(x, y)
  for (let petal = 0; petal < 8; petal++) {
    clothContext.save()
    clothContext.rotate(petal * Math.PI / 4)
    clothContext.fillStyle = petal % 2 ? '#24584a' : '#873f32'
    clothContext.beginPath(); clothContext.ellipse(0, -5, 2.4, 4.5, 0, 0, Math.PI * 2); clothContext.fill()
    clothContext.restore()
  }
  clothContext.fillStyle = '#f7e1a8'
  clothContext.beginPath(); clothContext.arc(0, 0, 1.8, 0, Math.PI * 2); clothContext.fill()
  clothContext.restore()
}
const clothTexture = new THREE.CanvasTexture(cloth)
clothTexture.colorSpace = THREE.SRGBColorSpace
clothTexture.anisotropy = 4
const shirt = new THREE.MeshStandardMaterial({ map: clothTexture, bumpMap: clothTexture, bumpScale: .012, roughness: .97 })
const trouserCanvas = document.createElement('canvas')
trouserCanvas.width = trouserCanvas.height = 128
const trouserContext = trouserCanvas.getContext('2d')!
trouserContext.fillStyle = '#7655aa'; trouserContext.fillRect(0, 0, 128, 128)
trouserContext.globalAlpha = .11
for (let x = 0; x <= 128; x += 4) {
  trouserContext.strokeStyle = x % 8 ? '#b29bd2' : '#4b3976'
  trouserContext.lineWidth = 1
  trouserContext.beginPath(); trouserContext.moveTo(x, 0); trouserContext.lineTo(x - 10, 128); trouserContext.stroke()
}
trouserContext.globalAlpha = 1
const trouserTexture = new THREE.CanvasTexture(trouserCanvas)
trouserTexture.colorSpace = THREE.SRGBColorSpace
trouserTexture.anisotropy = 4
const trousers = new THREE.MeshStandardMaterial({ map: trouserTexture, bumpMap: trouserTexture, bumpScale: .008, roughness: .96 })
const hair = new THREE.MeshStandardMaterial({ color: '#18131a', roughness: 1 })
const shoes = new THREE.MeshStandardMaterial({ color: '#211d22', roughness: .8 })
const shoeAccent = new THREE.MeshStandardMaterial({ color: '#d9c49c', roughness: .88 })
const shirtTrim = new THREE.MeshStandardMaterial({ color: '#a86935', roughness: .95 })
const shoeSole = new THREE.MeshStandardMaterial({ color: '#d4c5ac', roughness: .9 })
const trouserTrim = new THREE.MeshStandardMaterial({ color: '#604589', roughness: .95 })
const pocketTrim = new THREE.MeshStandardMaterial({ color: '#bd9960', roughness: 1 })
const pocketShade = new THREE.MeshStandardMaterial({ color: '#65498d', roughness: .97 })
const faceDetail = new THREE.MeshStandardMaterial({ color: '#211611', roughness: .85 })
const eyeWhite = new THREE.MeshStandardMaterial({ color: '#f1e4cf', roughness: .6 })
const eyeBrown = new THREE.MeshStandardMaterial({ color: '#4b2b1b', roughness: .55 })
function avatarPart(geometry: THREE.BufferGeometry, material: THREE.Material, x: number, y: number, z: number) {
  const part = new THREE.Mesh(geometry, material)
  part.position.set(x, y, z)
  part.castShadow = true
  avatarBody.add(part)
  return part
}
const shirtShape = new THREE.LatheGeometry([
  new THREE.Vector2(.26, -.5), new THREE.Vector2(.32, -.47), new THREE.Vector2(.34, -.34),
  new THREE.Vector2(.36, -.12), new THREE.Vector2(.4, .1), new THREE.Vector2(.37, .25),
  new THREE.Vector2(.31, .42), new THREE.Vector2(.2, .5),
], 18)
avatarPart(shirtShape, shirt, 0, 1.4, 0)
avatarPart(new THREE.CylinderGeometry(.12, .15, .2, 10), skin, 0, 2.2, 0)
avatarPart(new THREE.SphereGeometry(.31, 16, 12), skin, 0, 2.43, 0)
avatarPart(new THREE.SphereGeometry(.335, 14, 10), hair, 0, 2.62, -.05)
const curls = new THREE.InstancedMesh(new THREE.SphereGeometry(.044, 8, 6), hair, 42)
const curlPose = new THREE.Object3D()
for (let i = 0; i < 42; i++) {
  const polar = Math.acos(1 - (i + .5) / 42)
  const azimuth = i * Math.PI * (3 - Math.sqrt(5))
  const radius = .32
  curlPose.position.set(radius * Math.sin(polar) * Math.cos(azimuth), 2.62 + radius * Math.cos(polar), -.05 + radius * Math.sin(polar) * Math.sin(azimuth))
  curlPose.scale.setScalar(.82 + (i % 4) * .07)
  curlPose.updateMatrix(); curls.setMatrixAt(i, curlPose.matrix)
}
curls.castShadow = true
avatarBody.add(curls)
avatarPart(new THREE.SphereGeometry(.052, 10, 8), skin, -.3, 2.42, 0)
avatarPart(new THREE.SphereGeometry(.052, 10, 8), skin, .3, 2.42, 0)
avatarPart(new THREE.SphereGeometry(.038, 10, 8), eyeWhite, -.105, 2.46, .285)
avatarPart(new THREE.SphereGeometry(.038, 10, 8), eyeWhite, .105, 2.46, .285)
avatarPart(new THREE.SphereGeometry(.019, 8, 6), eyeBrown, -.105, 2.46, .318)
avatarPart(new THREE.SphereGeometry(.019, 8, 6), eyeBrown, .105, 2.46, .318)
const leftBrow = avatarPart(new THREE.BoxGeometry(.085, .014, .018), hair, -.105, 2.525, .292)
const rightBrow = avatarPart(new THREE.BoxGeometry(.085, .014, .018), hair, .105, 2.525, .292)
leftBrow.rotation.z = -.09; rightBrow.rotation.z = .09
const nose = avatarPart(new THREE.SphereGeometry(.043, 8, 6), skin, 0, 2.36, .31)
nose.scale.set(.72, 1.18, .9)
const smile = new THREE.CatmullRomCurve3([
  new THREE.Vector3(-.048, 2.272, .288), new THREE.Vector3(0, 2.26, .3), new THREE.Vector3(.048, 2.272, .288),
])
avatarPart(new THREE.TubeGeometry(smile, 8, .006, 5, false), faceDetail, 0, 0, 0)
const collar = avatarPart(new THREE.TorusGeometry(.18, .027, 6, 20), shirtTrim, 0, 2.02, 0)
collar.rotation.x = Math.PI / 2
const shirtFront = avatarPart(new THREE.BoxGeometry(.035, .5, .018), shirtTrim, 0, 1.54, .4)
shirtFront.renderOrder = 1
for (const y of [1.72, 1.54, 1.36]) avatarPart(new THREE.SphereGeometry(.022, 7, 5), shoeSole, 0, y, .415)
const shirtHem = avatarPart(new THREE.TorusGeometry(.34, .016, 5, 24), shirtTrim, 0, .91, 0)
shirtHem.rotation.x = Math.PI / 2
const waistBand = avatarPart(new THREE.TorusGeometry(.36, .028, 6, 24), shirtTrim, 0, .99, 0)
waistBand.rotation.x = Math.PI / 2
const garmentSeam = new THREE.MeshStandardMaterial({ color: '#b27b36', roughness: 1 })
const backYoke = new THREE.CatmullRomCurve3([
  new THREE.Vector3(-.22, 1.73, -.25), new THREE.Vector3(-.12, 1.69, -.32),
  new THREE.Vector3(0, 1.68, -.34), new THREE.Vector3(.12, 1.69, -.32),
  new THREE.Vector3(.22, 1.73, -.25),
])
avatarPart(new THREE.TubeGeometry(backYoke, 18, .007, 5, false), garmentSeam, 0, 0, 0)
const shirtBackSeam = new THREE.CatmullRomCurve3([
  new THREE.Vector3(0, 1.66, -.345), new THREE.Vector3(0, 1.48, -.37),
  new THREE.Vector3(0, 1.24, -.37), new THREE.Vector3(0, 1.04, -.345),
])
avatarPart(new THREE.TubeGeometry(shirtBackSeam, 12, .005, 4, false), garmentSeam, 0, 0, 0)

function createAvatarArm(x: number, side: -1 | 1, name: 'left' | 'right') {
  const shoulder = new THREE.Group()
  shoulder.position.set(x, 1.72, 0)
  shoulder.name = `avatar-${name}-arm`
  const upperArm = new THREE.Mesh(new THREE.CapsuleGeometry(.087, .28, 4, 9), skin)
  upperArm.position.y = -.19; upperArm.castShadow = true
  shoulder.add(upperArm)
  const sleeve = new THREE.Mesh(new THREE.CapsuleGeometry(.13, .2, 4, 9), shirt)
  sleeve.position.set(0, -.17, 0); sleeve.rotation.z = side * .09; sleeve.castShadow = true
  shoulder.add(sleeve)
  const sleeveCuff = new THREE.Mesh(new THREE.TorusGeometry(.108, .012, 5, 12), shirtTrim)
  sleeveCuff.position.y = -.34; sleeveCuff.rotation.x = Math.PI / 2
  shoulder.add(sleeveCuff)
  const elbow = new THREE.Group()
  elbow.position.y = -.39
  elbow.name = `avatar-${name}-elbow`
  const joint = new THREE.Mesh(new THREE.SphereGeometry(.081, 9, 7), skin)
  joint.castShadow = true; elbow.add(joint)
  const forearm = new THREE.Mesh(new THREE.CapsuleGeometry(.074, .24, 4, 8), skin)
  forearm.position.y = -.17; forearm.castShadow = true; elbow.add(forearm)
  const wrist = new THREE.Mesh(new THREE.TorusGeometry(.071, .009, 5, 12), shirtTrim)
  wrist.position.y = -.32; wrist.rotation.x = Math.PI / 2; elbow.add(wrist)
  const hand = new THREE.Mesh(new THREE.SphereGeometry(.086, 10, 8), skin)
  hand.position.y = -.36; hand.castShadow = true; elbow.add(hand)
  shoulder.add(elbow)
  avatarBody.add(shoulder)
  shoulder.rotation.z = side * .15
  return { shoulder, elbow }
}
const leftArmParts = createAvatarArm(-.49, -1, 'left')
const rightArmParts = createAvatarArm(.49, 1, 'right')
const leftArm = leftArmParts.shoulder, rightArm = rightArmParts.shoulder
const leftElbow = leftArmParts.elbow, rightElbow = rightArmParts.elbow
leftArm.rotation.z = -.15
rightArm.rotation.z = .15
function addShoe(foot: THREE.Group) {
  const sole = new THREE.Mesh(new THREE.BoxGeometry(.3, .07, .48), shoeSole)
  sole.position.set(0, .035, .1); sole.castShadow = true; foot.add(sole)
  const upper = new THREE.Mesh(new THREE.CapsuleGeometry(.13, .14, 3, 8), shoes)
  upper.rotation.x = Math.PI / 2; upper.position.set(0, .16, .11); upper.castShadow = true; foot.add(upper)
  const lace = new THREE.Mesh(new THREE.BoxGeometry(.1, .014, .05), shoeSole)
  lace.position.set(0, .29, .25); foot.add(lace)
  const heel = new THREE.Mesh(new THREE.BoxGeometry(.18, .085, .018), shoeAccent)
  heel.position.set(0, .17, -.126); foot.add(heel)
  for (const side of [-1, 1]) {
    const stripe = new THREE.Mesh(new THREE.BoxGeometry(.018, .035, .14), pocketTrim)
    stripe.position.set(side * .127, .17, .1); foot.add(stripe)
  }
}
function createAvatarLeg(x: number, name: 'left' | 'right') {
  const hip = new THREE.Group()
  hip.position.set(x, 1, 0)
  hip.name = `avatar-${name}-leg`
  const thigh = new THREE.Mesh(new THREE.CapsuleGeometry(.14, .29, 4, 9), trousers)
  thigh.position.y = -.265; thigh.castShadow = true; hip.add(thigh)
  // Tailored rear utility pockets and a soft contrast welt give the loose trousers
  // readable construction from the player's normal over-the-shoulder camera.
  const pocket = new THREE.Mesh(new THREE.BoxGeometry(.145, .135, .022), pocketShade)
  pocket.position.set(0, .06, -.132); pocket.castShadow = true; thigh.add(pocket)
  const pocketWelt = new THREE.Mesh(new THREE.BoxGeometry(.15, .018, .027), pocketTrim)
  pocketWelt.position.set(0, .124, -.134); thigh.add(pocketWelt)
  const pocketButton = new THREE.Mesh(new THREE.SphereGeometry(.014, 6, 5), shoeSole)
  pocketButton.position.set(0, .112, -.151); thigh.add(pocketButton)
  const knee = new THREE.Group()
  knee.position.y = -.55
  knee.name = `avatar-${name}-knee`
  const joint = new THREE.Mesh(new THREE.SphereGeometry(.122, 10, 8), trousers)
  joint.castShadow = true; knee.add(joint)
  const shin = new THREE.Mesh(new THREE.CapsuleGeometry(.105, .3, 4, 9), trousers)
  shin.position.y = -.195; shin.castShadow = true; knee.add(shin)
  const hem = new THREE.Mesh(new THREE.TorusGeometry(.098, .009, 5, 14), trouserTrim)
  hem.position.y = -.405; hem.rotation.x = Math.PI / 2; knee.add(hem)
  const foot = new THREE.Group()
  foot.position.y = -.45
  foot.name = `avatar-${name}-foot`
  knee.add(foot)
  addShoe(foot)
  hip.add(knee)
  avatarBody.add(hip)
  return { hip, knee, foot }
}
const leftLegParts = createAvatarLeg(-.21, 'left')
const rightLegParts = createAvatarLeg(.21, 'right')
const leftLeg = leftLegParts.hip, rightLeg = rightLegParts.hip
const leftKnee = leftLegParts.knee, rightKnee = rightLegParts.knee
const leftFoot = leftLegParts.foot, rightFoot = rightLegParts.foot
avatar.position.set(-4, 0, 7)
avatar.rotation.y = Math.PI
let idleFacing = Math.PI
camera.position.set(-4, 3.8, 14.2)
const remoteAvatars = new Map<string, THREE.Group>()
let connectedPlayers: PresencePlayer[] = []
let presenceConnected = false
const emoteBubbles = new Map<string, THREE.Sprite>()
const nameTags = new Map<string, THREE.Sprite>()

function createNameTexture(name: string): THREE.Texture {
  const canvas = document.createElement('canvas')
  canvas.width = 256
  canvas.height = 64
  const ctx = canvas.getContext('2d')!
  ctx.fillStyle = '#1479bce8'
  if (ctx.roundRect) {
    ctx.beginPath()
    ctx.roundRect(8, 8, 240, 48, 12)
    ctx.fill()
  } else {
    ctx.fillRect(8, 8, 240, 48)
  }
  ctx.lineWidth = 3
  ctx.strokeStyle = '#d5bb85'
  ctx.stroke()
  ctx.fillStyle = '#f4f0ff'
  ctx.font = 'bold 22px sans-serif'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText(name.slice(0, 16), 128, 32)
  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace
  return texture
}

function updateAvatarNameTag(targetGroup: THREE.Group, name: string, id: string) {
  // The local player is already centered by the camera; their own plate obscures the stage.
  if (id === 'self') return
  let sprite = nameTags.get(id)
  if (!sprite) {
    const mat = new THREE.SpriteMaterial({ map: createNameTexture(name), depthTest: false })
    sprite = new THREE.Sprite(mat)
    sprite.scale.set(1.4, 0.35, 1)
    sprite.position.set(0, 2.88, 0)
    sprite.renderOrder = 25
    sprite.userData.displayName = name
    targetGroup.add(sprite)
    nameTags.set(id, sprite)
  } else if (sprite.userData.displayName !== name) {
    sprite.material.map?.dispose()
    sprite.material.map = createNameTexture(name)
    sprite.material.needsUpdate = true
    sprite.userData.displayName = name
  }
}

// Social safety state follows the server guest identity when one is available.
const mutedIds = new Set<string>()
const blockedIds = new Set<string>()
const blockedNames = new Map<string, string>()
let friendState: GuestFriendState = { friends: [], incoming: [], outgoing: [], allowFriendMessages: true }
let partyState: GuestPartyState = { party: null, incoming: [] }
let partyMessages: GuestPartyMessage[] = []
let partyChatPartyId = ''
let partyChatMessageKey = ''
let partyRefreshTimer: number | undefined
let guestSessionReady = false
let reportTargetId = ''
let directMessageTarget = ''
let roomChatOptedIn = false
const mutePopover = document.createElement('div')
mutePopover.className = 'mute-popover'
mutePopover.setAttribute('role', 'dialog')
mutePopover.setAttribute('aria-label', 'Player options')
mutePopover.hidden = true
document.getElementById('game')!.appendChild(mutePopover)
let mutePopoverTarget = ''
function friendStatusFor(id: string): 'friends' | 'outgoing' | 'incoming' | 'available' | 'blocked' {
  if (blockedIds.has(id)) return 'blocked'
  if (friendState.friends.some(friend => friend.guestId === id)) return 'friends'
  if (friendState.outgoing.some(request => request.guestId === id)) return 'outgoing'
  if (friendState.incoming.some(request => request.guestId === id)) return 'incoming'
  return 'available'
}

function showMutePopover(id: string, screenX: number, screenY: number) {
  mutePopoverTarget = id
  const targetPlayer = connectedPlayers.find(p => p.id === id)
  const targetName = targetPlayer?.name || 'Guest'
  const muted = mutedIds.has(id)
  const safetyEnabled = guestSessionReady && targetPlayer?.authenticated === true
  const friendStatus = friendStatusFor(id)
  const friendLabel = friendStatus === 'friends' ? 'Friends' : friendStatus === 'outgoing' ? 'Request sent' : friendStatus === 'incoming' ? 'Respond in People' : 'Add friend'
  mutePopover.innerHTML = `
    <small class="eyebrow">CONNECTED SESSION</small>
    <div class="mute-player-name">${escapeHtml(targetName)}</div>
    <p>${muted ? 'This session is muted.' : 'Mute this session to hide their emote reactions locally.'}</p>
    <div class="mute-actions">
      <button id="mute-toggle" type="button">${muted ? '🔊 Unmute' : '🔇 Mute'}</button>
      <button id="block-toggle" type="button" ${safetyEnabled ? '' : 'disabled'}>Block</button>
      <button id="report-toggle" type="button" ${safetyEnabled ? '' : 'disabled'}>Report</button>
    </div>
    <button id="friend-toggle" class="friend-toggle" type="button" ${safetyEnabled && friendStatus === 'available' ? '' : 'disabled'}>${friendLabel}</button>
    <button id="mute-cancel" class="mute-cancel" type="button">Done</button>
    <small class="mute-note">Mute is local. Block is stored on this prototype server. Reports enter a private queue; no moderation team is connected.</small>`
  mutePopover.hidden = false
  const pw = 250, ph = mutePopover.offsetHeight
  mutePopover.style.left = `${Math.min(Math.max(screenX - pw / 2, 8), window.innerWidth - pw - 8)}px`
  mutePopover.style.top = `${Math.min(Math.max(screenY - ph - 16, 60), window.innerHeight - ph - 8)}px`
  document.getElementById('mute-toggle')!.onclick = () => {
    if (mutedIds.has(mutePopoverTarget)) {
      mutedIds.delete(mutePopoverTarget)
      toast('Session unmuted')
    } else {
      mutedIds.add(mutePopoverTarget)
      const model = remoteAvatars.get(mutePopoverTarget)
      const bubble = model && emoteBubbles.get(mutePopoverTarget)
      if (bubble) bubble.visible = false
      const speech = model && speechBubbles.get(mutePopoverTarget)
      if (speech) speech.visible = false
      toast('Session muted · reactions and chat hidden locally')
    }
    renderPeople(connectedPlayers, presenceConnected)
    mutePopover.hidden = true
  }
  document.getElementById('block-toggle')!.onclick = () => {
    if (!safetyEnabled) { toast('Connect a guest session before blocking'); return }
    const targetId = mutePopoverTarget
    blockedNames.set(targetId, targetName)
    mutePopover.hidden = true
    void setPlayerBlocked(targetId, true)
  }
  document.getElementById('report-toggle')!.onclick = () => {
    if (!safetyEnabled) { toast('Connect a guest session before reporting'); return }
    openReportDialog(id, targetName)
    mutePopover.hidden = true
  }
  document.getElementById('friend-toggle')!.onclick = async () => {
    if (!safetyEnabled || friendStatus !== 'available') return
    const button = document.getElementById('friend-toggle') as HTMLButtonElement
    button.disabled = true
    try {
      const result = await requestGuestFriend(id)
      await refreshFriendState()
      toast(result.duplicate ? 'Friend request is already waiting' : 'Friend request sent · awaiting their choice')
      mutePopover.hidden = true
    } catch (error) {
      button.disabled = false
      toast(error instanceof Error ? error.message : 'Could not send friend request')
    }
  }
  document.getElementById('mute-cancel')!.onclick = () => { mutePopover.hidden = true }
}

async function setPlayerBlocked(id: string, blocked: boolean) {
  if (blocked) {
    blockedIds.add(id)
    renderPresence(connectedPlayers, presenceConnected, 0)
    try {
      await blockGuest(id)
      await refreshFriendState()
      await refreshPartyState()
      toast('Player blocked · contact and visibility are restricted')
    } catch {
      blockedIds.delete(id)
      blockedNames.delete(id)
      renderPresence(connectedPlayers, presenceConnected, 0)
      toast('Could not save this block · try again when connected')
    }
    return
  }
  try {
    await unblockGuest(id)
    blockedIds.delete(id)
    blockedNames.delete(id)
    renderPresence(connectedPlayers, presenceConnected, 0)
    await refreshFriendState()
    toast('Player unblocked')
  } catch { toast('Could not remove this block · try again when connected') }
}

function openReportDialog(id: string, name: string) {
  reportTargetId = id
  $<HTMLElement>('report-target').textContent = `About ${name}`
  $<HTMLSelectElement>('report-reason').value = 'harassment'
  $<HTMLTextAreaElement>('report-details').value = ''
  $<HTMLElement>('report-status').textContent = ''
  $<HTMLButtonElement>('report-submit').disabled = false
  $<HTMLButtonElement>('report-submit').textContent = 'Send report'
  $<HTMLDialogElement>('report-dialog').showModal()
}

function socialDisplayName(id: string) {
  const current = connectedPlayers.find(player => player.id === id)
  return current?.name?.trim() || `Guest · ${id.slice(0, 8)}`
}

async function refreshFriendState() {
  if (!guestSessionReady) return
  try {
    friendState = await fetchGuestFriends()
    renderPeople(connectedPlayers, presenceConnected)
  } catch { /* keep the last known list when the connection drops */ }
}

async function refreshPartyState() {
  if (!guestSessionReady) return
  try {
    const previousPartyId = partyState.party?.partyId || ''
    partyState = await fetchGuestParty()
    const partyId = partyState.party?.partyId || ''
    if (!partyId) partyMessages = []
    else if (partyId !== previousPartyId || !$<HTMLElement>('people-sheet').hidden) {
      const messages = await fetchGuestPartyMessages(partyId).catch(() => null)
      if (messages && partyState.party?.partyId === partyId) partyMessages = messages
    }
    renderPeople(connectedPlayers, presenceConnected)
  } catch { /* keep the last known party state while the service reconnects */ }
}

function handlePartyUpdate(kind: PartyUpdateKind, _partyId: string, otherId?: string) {
  void refreshPartyState()
  if (kind === 'invited') toast(`Party invitation from ${socialDisplayName(otherId || '')}`)
  else if (kind === 'joined' && otherId !== presence.getOwnId()) toast(`${socialDisplayName(otherId || '')} joined the party`)
  else if (kind === 'left' && otherId !== presence.getOwnId()) toast(`${socialDisplayName(otherId || '')} left the party`)
  else if (kind === 'expired') toast('Party closed after everyone disconnected')
  else if (kind === 'travel-update' && otherId !== presence.getOwnId()) toast('Party travel changed · review the proposal')
}

function handlePartyMessage(partyId: string, message: PresencePartyMessage) {
  if (partyState.party?.partyId !== partyId || partyMessages.some(item => item.id === message.id)) return
  partyMessages = [...partyMessages, message].slice(-100)
  renderPartyChat()
}

async function handlePartyAction(action: 'create' | 'invite' | 'accept' | 'decline' | 'leave', id = '') {
  try {
    if (action === 'create') {
      await createGuestParty()
      await refreshPartyState()
      toast('Party started · invite an unblocked friend')
    } else if (action === 'invite') {
      if (!partyState.party) throw new Error('Start a party first')
      await inviteGuestToParty(partyState.party.partyId, id)
      await refreshPartyState()
      toast('Party invitation sent · expires in 10 minutes')
    } else if (action === 'accept') {
      await acceptGuestPartyInvitation(id)
      await refreshPartyState()
      toast('You joined the party')
    } else if (action === 'decline') {
      await declineGuestPartyInvitation(id)
      await refreshPartyState()
      toast('Party invitation declined')
    } else {
      const oldLeader = partyState.party?.leaderId === presence.getOwnId()
      const result = await leaveGuestParty(id)
      await refreshPartyState()
      toast(oldLeader && result.newLeaderId ? `You left · ${socialDisplayName(result.newLeaderId)} is now leader` : 'You left the party')
    }
  } catch (error) {
    toast(error instanceof Error ? error.message : 'Could not update the party')
  }
}

function wirePartyActions(root: HTMLElement) {
  root.querySelectorAll<HTMLButtonElement>('[data-party-action]').forEach(button => {
    button.onclick = () => {
      const action = button.dataset.partyAction as 'create' | 'invite' | 'accept' | 'decline' | 'leave'
      const id = action === 'leave' ? button.dataset.partyId || ''
        : action === 'accept' || action === 'decline' ? button.dataset.invitationId || ''
          : button.dataset.targetId || ''
      button.disabled = true
      void handlePartyAction(action, id).finally(() => { button.disabled = false })
    }
  })
}

async function handlePartyTravelVote(proposalId: string, decision: 'approve' | 'decline') {
  const party = partyState.party
  if (!party) return
  try {
    const status = await voteGuestPartyTravel(party.partyId, proposalId, decision)
    await refreshPartyState()
    const assignment = partyState.party?.travelAssignment
    toast(status === 'approved'
      ? assignment?.error ? 'Travel approved, but this party cannot share that room right now' : assignment ? 'Shared public room reserved · walk there when ready' : 'Everyone agreed · selecting a shared room'
      : status === 'declined' ? 'Travel proposal declined' : 'Your decision is recorded')
  } catch (error) {
    toast(error instanceof Error ? error.message : 'Could not record your travel decision')
  }
}

function wirePartyTravelActions(root: HTMLElement) {
  const form = root.querySelector<HTMLFormElement>('[data-party-travel-form]')
  form?.addEventListener('submit', event => {
    event.preventDefault()
    const party = partyState.party
    const select = form.querySelector<HTMLSelectElement>('[data-party-destination]')
    const destinationId = select?.value || ''
    if (!party || !destinationId) return
    const submit = form.querySelector<HTMLButtonElement>('button[type="submit"]')
    if (submit) submit.disabled = true
    void proposeGuestPartyTravel(party.partyId, destinationId).then(async () => {
      await refreshPartyState()
      toast('Route proposed · each member must approve')
    }).catch(error => toast(error instanceof Error ? error.message : 'Could not propose this route')).finally(() => {
      if (submit) submit.disabled = false
    })
  })
  root.querySelectorAll<HTMLButtonElement>('[data-party-travel-vote]').forEach(button => {
    button.onclick = () => {
      const decision = button.dataset.partyTravelVote
      const proposalId = button.dataset.proposalId || ''
      if (decision !== 'approve' && decision !== 'decline') return
      button.disabled = true
      void handlePartyTravelVote(proposalId, decision)
    }
  })
  root.querySelectorAll<HTMLButtonElement>('[data-party-travel-route]').forEach(button => {
    button.onclick = () => {
      const destinationId = button.dataset.partyTravelRoute as Hotspot
      if (!mapDestinations.some(destination => destination.id === destinationId)) return
      mapRoute(destinationId)
    }
  })
}

function renderPartyChat() {
  const root = $<HTMLElement>('party-chat')
  const partyId = partyState.party?.partyId || ''
  if (!partyId) {
    if (partyChatPartyId || root.childElementCount) root.replaceChildren()
    partyChatPartyId = ''
    partyChatMessageKey = ''
    return
  }
  if (partyChatPartyId !== partyId) {
    root.replaceChildren()
    partyChatPartyId = partyId
    partyChatMessageKey = ''
    const heading = document.createElement('h4')
    heading.className = 'party-chat-title'
    heading.textContent = 'Party chat'
    const note = document.createElement('small')
    note.className = 'party-chat-note'
    note.textContent = 'Current members only; history starts when you join and closes with the party. Reports enter a private queue; no moderation team is connected.'
    const history = document.createElement('ol')
    history.id = 'party-chat-history'
    history.className = 'party-chat-history'
    history.setAttribute('aria-label', 'Party conversation')
    history.setAttribute('aria-live', 'polite')
    const empty = document.createElement('li')
    empty.className = 'party-chat-empty'
    empty.textContent = 'Say hello to your party.'
    history.append(empty)
    const form = document.createElement('form')
    form.className = 'party-chat-form'
    const label = document.createElement('label')
    label.htmlFor = 'party-chat-input'
    label.textContent = 'Message your party'
    const input = document.createElement('textarea')
    input.id = 'party-chat-input'
    input.maxLength = 280
    input.rows = 2
    input.required = true
    input.placeholder = 'Meet me at the studio…'
    const footer = document.createElement('div')
    footer.className = 'party-chat-footer'
    const status = document.createElement('small')
    status.className = 'party-chat-status'
    status.setAttribute('role', 'status')
    status.setAttribute('aria-live', 'polite')
    const count = document.createElement('small')
    count.textContent = '0 / 280'
    const send = document.createElement('button')
    send.type = 'submit'
    send.className = 'social-action accept'
    send.textContent = 'Send'
    input.addEventListener('input', () => { count.textContent = `${input.value.length} / 280` })
    form.addEventListener('submit', event => {
      event.preventDefault()
      const text = input.value.trim()
      if (!text || !partyState.party || partyState.party.partyId !== partyId) return
      send.disabled = true
      status.textContent = 'Sending…'
      void sendGuestPartyMessage(partyId, text).then(message => {
        if (partyState.party?.partyId !== partyId) return
        if (!partyMessages.some(item => item.id === message.id)) partyMessages = [...partyMessages, message].slice(-100)
        input.value = ''
        count.textContent = '0 / 280'
        status.textContent = ''
        renderPartyChat()
      }).catch(error => {
        status.textContent = error instanceof Error ? error.message : 'Could not send this message'
      }).finally(() => { send.disabled = false })
    })
    footer.append(status, count, send)
    form.append(label, input, footer)
    root.append(heading, note, history, form)
  }
  const key = `${partyMessages.map(message => message.id).join('|')}#${[...blockedIds].sort().join('|')}`
  if (key === partyChatMessageKey) return
  partyChatMessageKey = key
  const history = $<HTMLOListElement>('party-chat-history')
  history.replaceChildren()
  if (!partyMessages.length) {
    const empty = document.createElement('li')
    empty.className = 'party-chat-empty'
    empty.textContent = 'Say hello to your party.'
    history.append(empty)
    return
  }
  for (const message of partyMessages.slice(-100)) {
    if (blockedIds.has(message.senderGuestId)) continue
    const item = document.createElement('li')
    item.className = `party-chat-message${message.senderGuestId === presence.getOwnId() ? ' own' : ''}`
    const sender = document.createElement('b')
    sender.textContent = message.senderGuestId === presence.getOwnId() ? 'You' : socialDisplayName(message.senderGuestId)
    const text = document.createElement('p')
    text.textContent = message.text
    const meta = document.createElement('div')
    meta.className = 'party-chat-meta'
    const time = document.createElement('time')
    time.dateTime = message.sentAt
    time.textContent = new Date(message.sentAt).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })
    meta.append(time)
    if (message.senderGuestId !== presence.getOwnId()) {
      const report = document.createElement('button')
      report.type = 'button'
      report.className = 'party-chat-report'
      report.textContent = 'Report'
      report.setAttribute('aria-label', `Report message from ${socialDisplayName(message.senderGuestId)}`)
      report.onclick = () => {
        openReportDialog(message.senderGuestId, socialDisplayName(message.senderGuestId))
        $<HTMLTextAreaElement>('report-details').value = `Party chat message: ${message.text}`
      }
      meta.append(report)
    }
    item.append(sender, text, meta)
    history.append(item)
  }
  history.scrollTop = history.scrollHeight
}

function renderPartyState() {
  const section = $<HTMLElement>('party-section')
  const overview = $<HTMLElement>('party-overview')
  const incoming = $<HTMLElement>('party-incoming')
  const create = $<HTMLButtonElement>('party-create')
  if (partyRefreshTimer !== undefined) window.clearTimeout(partyRefreshTimer)
  partyRefreshTimer = undefined
  section.hidden = SOLO_PREVIEW || !guestSessionReady
  if (section.hidden) return
  const party = partyState.party
  create.hidden = Boolean(party || partyState.incoming.length)
  const ownId = presence.getOwnId()
  renderPartyChat()
  if (!party) overview.replaceChildren()
  else {
    const memberRows = party.members.map(member => `<div class="party-member" role="listitem"><span>${member.guestId === ownId ? 'You' : escapeHtml(socialDisplayName(member.guestId))}</span><small>${member.leader ? 'Leader' : 'Member'}</small></div>`).join('')
    const inviteRows = party.invitations.map(invite => `<div class="party-invite-pending" role="listitem"><span>${escapeHtml(socialDisplayName(invite.guestId))}</span><small>Invited · expires ${new Date(invite.expiresAt).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}</small></div>`).join('')
    const proposal = party.travelProposal
    const destination = proposal && mapDestinations.find(item => item.id === proposal.destinationId)
    const proposalUi = proposal && destination ? (() => {
      const ownVote = proposal.votes.find(vote => vote.guestId === ownId)
      const waiting = proposal.votes.filter(vote => vote.decision === null).length
      const assignment = party.travelAssignment
      const votes = proposal.votes.map(vote => `<div class="party-travel-vote"><span>${vote.guestId === ownId ? 'You' : escapeHtml(socialDisplayName(vote.guestId))}</span><small>${vote.decision === 'approve' ? 'Approved' : vote.decision === 'decline' ? 'Declined' : 'Waiting'}</small></div>`).join('')
      const controls = proposal.status === 'approved'
        ? assignment?.error === 'party_split_in_destination'
          ? '<p class="party-travel-status">Your party is already split across public rooms. Meet at one physical room entrance before proposing this route.</p>'
          : assignment?.error
            ? '<p class="party-travel-status">A shared public room is unavailable. Choose another place.</p>'
            : assignment
              ? `<p class="party-travel-status">Shared room reserved · ${assignment.arrivedMembers}/${assignment.groupSize} guests there · ${assignment.arrivedMembers === assignment.groupSize ? 'group together' : `${assignment.reservedSlots} ${assignment.reservedSlots === 1 ? 'place' : 'places'} held`}. Each guest still walks through the physical door.</p>${location === assignment.location ? '<p class="party-travel-status">You are already here · wait for your group in this room.</p>' : `<button type="button" class="social-action accept party-travel-route" data-party-travel-route="${destination.id}">Show my walking route</button>`}`
              : '<p class="party-travel-status">Choosing one public room with enough space for the whole party…</p>'
        : ownVote?.decision
          ? `<p class="party-travel-status">Your choice is recorded · waiting for ${waiting} member${waiting === 1 ? '' : 's'}.</p>`
          : `<div class="party-travel-actions"><button type="button" class="social-action accept" data-party-travel-vote="approve" data-proposal-id="${escapeHtml(proposal.proposalId)}">Approve</button><button type="button" class="social-action decline" data-party-travel-vote="decline" data-proposal-id="${escapeHtml(proposal.proposalId)}">Decline</button></div>`
      return `<div class="party-travel-proposal" aria-live="polite"><b>Walk together · ${destination.name}</b><small>Expires ${new Date(proposal.expiresAt).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}</small><div class="party-travel-votes">${votes}</div>${controls}</div>`
    })() : ''
    const travelComposer = !proposal && party.leaderId === ownId
      ? `<form class="party-travel-form" data-party-travel-form><label for="party-travel-destination">Propose a public destination</label><select id="party-travel-destination" data-party-destination required><option value="">Choose a place</option>${mapDestinations.map(item => `<option value="${item.id}">${item.name}</option>`).join('')}</select><button type="submit" class="social-action party-travel-propose">Propose route</button></form>`
      : ''
    overview.innerHTML = `<div class="party-summary"><b>${party.members.length}/4 guests · ${party.leaderId === ownId ? 'You lead' : `${escapeHtml(socialDisplayName(party.leaderId))} leads`}</b><div class="party-members" role="list">${memberRows}${inviteRows}</div><small class="party-travel-note">Public places only · everyone must be online and approve. After unanimous approval, one shared room is reserved and every guest walks through the physical door. No event tickets or admissions are included.</small>${travelComposer}${proposalUi}<button class="social-action" data-party-action="leave" data-party-id="${escapeHtml(party.partyId)}">Leave party</button></div>`
  }
  incoming.innerHTML = partyState.incoming.map(invite => `<div class="social-entry social-request" role="listitem"><span><b>${escapeHtml(socialDisplayName(invite.leaderId))}</b><small>Invited you to a party · expires ${new Date(invite.expiresAt).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}</small></span><button class="social-action accept" data-party-action="accept" data-invitation-id="${escapeHtml(invite.invitationId)}" ${party ? 'disabled title="Leave your current party before joining another"' : ''}>Join</button><button class="social-action decline" data-party-action="decline" data-invitation-id="${escapeHtml(invite.invitationId)}">Decline</button></div>`).join('')
  wirePartyActions(section)
  wirePartyTravelActions(overview)
  const expiries = [
    ...partyState.incoming.map(invite => invite.expiresAt),
    ...(party?.invitations || []).map(invite => invite.expiresAt),
    ...(party?.travelProposal ? [party.travelProposal.expiresAt] : []),
  ].map(value => new Date(value).getTime()).filter(Number.isFinite)
  if (expiries.length) partyRefreshTimer = window.setTimeout(() => { void refreshPartyState() }, Math.max(0, Math.min(...expiries) - Date.now() + 50))
  create.disabled = false
}

function handleFriendUpdate(kind: FriendUpdateKind, otherId: string) {
  if (kind === 'message-preference') {
    void refreshFriendState().then(() => {
      if (directMessageTarget === otherId && !friendState.friends.find(friend => friend.guestId === otherId)?.canMessage) {
        $<HTMLDialogElement>('direct-message-dialog').close()
        toast('Friend message privacy was turned off')
      }
    })
    return
  }
  void refreshFriendState()
  if (kind === 'unfriended' || kind === 'blocked') void refreshPartyState()
  if (kind === 'request') toast(`${socialDisplayName(otherId)} sent you a friend request`)
  else if (kind === 'accepted') toast(`${socialDisplayName(otherId)} accepted your friend request`)
  else if ((kind === 'unfriended' || kind === 'blocked') && directMessageTarget === otherId) {
    $<HTMLDialogElement>('direct-message-dialog').close()
    toast('This conversation is unavailable')
  }
}

function renderDirectMessageHistory(messages: GuestDirectMessage[]) {
  const history = $<HTMLElement>('direct-message-history')
  history.replaceChildren()
  if (!messages.length) {
    const empty = document.createElement('p')
    empty.className = 'direct-message-empty'
    empty.textContent = 'Start a private conversation with your friend.'
    history.append(empty)
    return
  }
  for (const message of messages) {
    const item = document.createElement('article')
    item.className = `direct-message${message.senderGuestId === presence.getOwnId() ? ' own' : ''}`
    const sender = document.createElement('small')
    sender.textContent = message.senderGuestId === presence.getOwnId() ? 'You' : socialDisplayName(message.senderGuestId)
    const text = document.createElement('p')
    text.textContent = message.text
    const time = document.createElement('time')
    time.dateTime = message.sentAt
    time.textContent = new Date(message.sentAt).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })
    item.append(sender, text, time)
    history.append(item)
  }
  history.scrollTop = history.scrollHeight
}

async function loadDirectMessageHistory() {
  const targetId = directMessageTarget
  if (!targetId) return
  $<HTMLElement>('direct-message-status').textContent = ''
  try {
    const messages = await fetchGuestMessages(targetId)
    if (directMessageTarget === targetId) renderDirectMessageHistory(messages)
  } catch (error) {
    if (directMessageTarget === targetId) $<HTMLElement>('direct-message-status').textContent = error instanceof Error ? error.message : 'Conversation unavailable'
  }
}

function openDirectMessage(otherId: string) {
  if (!guestSessionReady || !friendState.friends.some(friend => friend.guestId === otherId) || blockedIds.has(otherId)) {
    toast('Only mutual, unblocked friends can message')
    return
  }
  if (!friendState.allowFriendMessages) {
    toast('Turn on friend messages in People to start a conversation')
    return
  }
  directMessageTarget = otherId
  $<HTMLElement>('direct-message-title').textContent = socialDisplayName(otherId)
  $<HTMLElement>('direct-message-status').textContent = 'Loading conversation…'
  renderDirectMessageHistory([])
  $<HTMLDialogElement>('direct-message-dialog').showModal()
  void loadDirectMessageHistory()
}

function handleDirectMessageNotice(otherId: string) {
  if (directMessageTarget === otherId && $<HTMLDialogElement>('direct-message-dialog').open) {
    void loadDirectMessageHistory()
  } else {
    toast(`New message from ${socialDisplayName(otherId)}`)
  }
}

async function submitDirectMessage(event: SubmitEvent) {
  event.preventDefault()
  const input = $<HTMLTextAreaElement>('direct-message-input')
  const button = $<HTMLButtonElement>('direct-message-send')
  const status = $<HTMLElement>('direct-message-status')
  const text = input.value.trim()
  if (!text || !directMessageTarget) return
  button.disabled = true
  status.textContent = 'Sending…'
  try {
    await sendGuestMessage(directMessageTarget, text)
    input.value = ''
    $<HTMLElement>('direct-message-count').textContent = '0'
    await loadDirectMessageHistory()
    input.focus()
  } catch (error) {
    status.textContent = error instanceof Error ? error.message : 'Could not send this message'
  } finally {
    button.disabled = false
  }
}

async function handleFriendAction(action: 'accept' | 'decline' | 'cancel' | 'unfriend', id: string) {
  try {
    if (action === 'accept') await acceptGuestFriendRequest(id)
    else if (action === 'decline') await declineGuestFriendRequest(id)
    else if (action === 'cancel') await cancelGuestFriendRequest(id)
    else await unfriendGuest(id)
    await refreshFriendState()
    if (action === 'unfriend') await refreshPartyState()
    toast(action === 'accept' ? 'Friend request accepted' : action === 'decline' ? 'Friend request declined' : action === 'cancel' ? 'Friend request cancelled' : 'Friend removed')
  } catch (error) { toast(error instanceof Error ? error.message : 'Could not update friend request') }
}

function renderSocialState() {
  const section = $<HTMLElement>('friend-section')
  const friendsList = $<HTMLElement>('friends-list')
  const incomingList = $<HTMLElement>('incoming-friends')
  const outgoingList = $<HTMLElement>('outgoing-friends')
  const empty = $<HTMLElement>('friend-empty')
  const messagePreference = $<HTMLInputElement>('friend-messages-enabled')
  section.hidden = SOLO_PREVIEW || !guestSessionReady
  if (section.hidden) return
  const friends = friendState.friends.filter(friend => !blockedIds.has(friend.guestId))
  const incoming = friendState.incoming.filter(request => !blockedIds.has(request.guestId))
  const outgoing = friendState.outgoing.filter(request => !blockedIds.has(request.guestId))
  const party = partyState.party
  const partyMemberIds = new Set(party?.members.map(member => member.guestId) || [])
  const pendingPartyIds = new Set(party?.invitations.map(invite => invite.guestId) || [])
  const canInvite = Boolean(party && party.leaderId === presence.getOwnId() && party.members.length + party.invitations.length < 4)
  messagePreference.checked = friendState.allowFriendMessages
  empty.hidden = Boolean(friends.length || incoming.length || outgoing.length)
  empty.textContent = 'No friends yet. Send a request from a player’s Options menu.'
  friendsList.innerHTML = friends.map(friend => {
    const inviteButton = party && party.leaderId === presence.getOwnId()
      ? partyMemberIds.has(friend.guestId)
        ? '<button type="button" class="social-action" disabled>In party</button>'
        : pendingPartyIds.has(friend.guestId)
          ? '<button type="button" class="social-action" disabled>Invited</button>'
          : `<button type="button" class="social-action party-invite" data-party-action="invite" data-target-id="${escapeHtml(friend.guestId)}" ${canInvite ? '' : 'disabled title="Party is full"'}>Invite</button>`
      : ''
    return `<div class="social-entry" role="listitem"><span><b>${escapeHtml(socialDisplayName(friend.guestId))}</b><small>${friend.canMessage ? 'Friend' : 'Friend · messaging unavailable'}</small></span>${inviteButton}<button type="button" class="social-action" data-social-action="message" data-target-id="${escapeHtml(friend.guestId)}" ${friendState.allowFriendMessages && friend.canMessage ? '' : 'disabled title="Messages are unavailable for this friend"'}>Message</button><button type="button" class="social-action" data-social-action="unfriend" data-target-id="${escapeHtml(friend.guestId)}">Unfriend</button></div>`
  }).join('')
  incomingList.innerHTML = incoming.map(request => `<div class="social-entry social-request" role="listitem"><span><b>${escapeHtml(socialDisplayName(request.guestId))}</b><small>Sent a friend request · expires ${new Date(request.expiresAt).toLocaleDateString()}</small></span><button type="button" class="social-action accept" data-social-action="accept" data-target-id="${escapeHtml(request.requestId)}">Accept</button><button type="button" class="social-action decline" data-social-action="decline" data-target-id="${escapeHtml(request.requestId)}">Decline</button></div>`).join('')
  outgoingList.innerHTML = outgoing.map(request => `<div class="social-entry" role="listitem"><span><b>${escapeHtml(socialDisplayName(request.guestId))}</b><small>Request sent · expires ${new Date(request.expiresAt).toLocaleDateString()}</small></span><button type="button" class="social-action" data-social-action="cancel" data-target-id="${escapeHtml(request.requestId)}">Cancel</button></div>`).join('')
  section.querySelectorAll<HTMLButtonElement>('[data-social-action]').forEach(button => {
    button.onclick = () => {
      const id = button.dataset.targetId || ''
      if (button.dataset.socialAction === 'message') { openDirectMessage(id); return }
      const action = button.dataset.socialAction as 'accept' | 'decline' | 'cancel' | 'unfriend'
      button.disabled = true
      void handleFriendAction(action, id).finally(() => { button.disabled = false })
    }
  })
  wirePartyActions(section)
}

function createEmoteTexture(emoji: string): THREE.Texture {
  const canvas = document.createElement('canvas')
  canvas.width = canvas.height = 128
  const ctx = canvas.getContext('2d')!
  ctx.fillStyle = '#17252ae8'
  ctx.beginPath()
  ctx.arc(64, 64, 56, 0, Math.PI * 2)
  ctx.fill()
  ctx.lineWidth = 6
  ctx.strokeStyle = '#d5bb85'
  ctx.stroke()
  ctx.font = '64px sans-serif'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText(emoji, 64, 68)
  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace
  return texture
}
const emoteTextures: Record<EmoteType, THREE.Texture> = {
  cheer: createEmoteTexture('🙌'),
  wave: createEmoteTexture('👋'),
  heart: createEmoteTexture('❤️'),
  fire: createEmoteTexture('🔥'),
}
function triggerAvatarEmote(targetGroup: THREE.Group, emote: EmoteType, id: string) {
  const emoteStartedAt = performance.now()
  targetGroup.userData.activeEmote = emote
  targetGroup.userData.emoteStartedAt = emoteStartedAt
  let sprite = emoteBubbles.get(id)
  if (!sprite) {
    const mat = new THREE.SpriteMaterial({ map: emoteTextures[emote], depthTest: false })
    sprite = new THREE.Sprite(mat)
    sprite.scale.set(1.1, 1.1, 1)
    sprite.position.set(0, 3.2, 0)
    sprite.renderOrder = 30
    targetGroup.add(sprite)
    emoteBubbles.set(id, sprite)
  } else {
    sprite.material.map = emoteTextures[emote]
    sprite.material.needsUpdate = true
    sprite.visible = true
  }
  const timerKey = `timer_${id}`
  const existingTimer = (sprite as unknown as Record<string, number>)[timerKey]
  if (existingTimer) window.clearTimeout(existingTimer)
  ;(sprite as unknown as Record<string, number>)[timerKey] = window.setTimeout(() => {
    if (sprite) sprite.visible = false
    if (targetGroup.userData.emoteStartedAt === emoteStartedAt) targetGroup.userData.activeEmote = null
  }, 3200)
}

function applyActiveAvatarEmote(
  targetGroup: THREE.Group,
  parts: { body: THREE.Group; leftArm: THREE.Group; rightArm: THREE.Group; leftElbow: THREE.Group; rightElbow: THREE.Group },
) {
  const emote = targetGroup.userData.activeEmote as EmoteType | null | undefined
  const startedAt = targetGroup.userData.emoteStartedAt as number | undefined
  if (!emote || startedAt === undefined) return
  const pose = emotePose(emote, (performance.now() - startedAt) / 3200)
  const blend = (current: number, target: number) => current + (target - current) * pose.weight
  parts.leftArm.rotation.z = blend(parts.leftArm.rotation.z, pose.leftArmZ)
  parts.rightArm.rotation.z = blend(parts.rightArm.rotation.z, pose.rightArmZ)
  parts.leftElbow.rotation.z = blend(parts.leftElbow.rotation.z, pose.leftElbowZ)
  parts.rightElbow.rotation.z = blend(parts.rightElbow.rotation.z, pose.rightElbowZ)
  parts.body.position.y += pose.bodyBob * pose.weight
  targetGroup.rotation.y += pose.turn * pose.weight
}

function handleIncomingEmote(id: string, emote: EmoteType) {
  if (id === presence.getOwnId()) {
    triggerAvatarEmote(avatar, emote, 'self')
  } else {
    if (mutedIds.has(id) || blockedIds.has(id)) return
    const model = remoteAvatars.get(id)
    if (model) triggerAvatarEmote(model, emote, id)
  }
}

function escapeHtml(str: string): string {
  return str.replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c] || c)
}

const speechBubbles = new Map<string, THREE.Sprite>()
function createSpeechBubbleTexture(text: string): THREE.Texture {
  const canvas = document.createElement('canvas')
  canvas.width = 512
  canvas.height = 128
  const ctx = canvas.getContext('2d')!
  ctx.fillStyle = '#17252af5'
  if (ctx.roundRect) {
    ctx.beginPath()
    ctx.roundRect(12, 10, 488, 92, 16)
    ctx.fill()
  } else {
    ctx.fillRect(12, 10, 488, 92)
  }
  ctx.lineWidth = 4
  ctx.strokeStyle = '#d5bb85'
  ctx.stroke()
  ctx.fillStyle = '#17252af5'
  ctx.beginPath()
  ctx.moveTo(240, 102); ctx.lineTo(256, 122); ctx.lineTo(272, 102); ctx.fill()
  ctx.strokeStyle = '#d5bb85'
  ctx.beginPath()
  ctx.moveTo(240, 102); ctx.lineTo(256, 122); ctx.lineTo(272, 102); ctx.stroke()
  ctx.fillStyle = '#f4f0ff'
  ctx.font = 'bold 26px sans-serif'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText(text.slice(0, 40), 256, 56)
  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace
  return texture
}

function triggerAvatarSpeech(targetGroup: THREE.Group, text: string, id: string) {
  let sprite = speechBubbles.get(id)
  const tex = createSpeechBubbleTexture(text)
  if (!sprite) {
    const mat = new THREE.SpriteMaterial({ map: tex, depthTest: false })
    sprite = new THREE.Sprite(mat)
    sprite.scale.set(2.4, 0.6, 1)
    sprite.position.set(0, 3.45, 0)
    sprite.renderOrder = 35
    targetGroup.add(sprite)
    speechBubbles.set(id, sprite)
  } else {
    if (sprite.material.map) sprite.material.map.dispose()
    sprite.material.map = tex
    sprite.material.needsUpdate = true
    sprite.visible = true
  }
  const timerKey = `speech_timer_${id}`
  const existingTimer = (sprite as unknown as Record<string, number>)[timerKey]
  if (existingTimer) window.clearTimeout(existingTimer)
  ;(sprite as unknown as Record<string, number>)[timerKey] = window.setTimeout(() => {
    if (sprite) sprite.visible = false
  }, 4200)
}

function handleIncomingChat(id: string, name: string, text: string) {
  if (!roomChatOptedIn || mutedIds.has(id) || blockedIds.has(id)) return
  if (id === presence.getOwnId()) {
    triggerAvatarSpeech(avatar, text, 'self')
  } else {
    const model = remoteAvatars.get(id)
    if (model) triggerAvatarSpeech(model, text, id)
  }
  const feed = $<HTMLElement>('chat-feed')
  if (feed) {
    const item = document.createElement('div')
    item.className = 'chat-item'
    item.innerHTML = `<b>${escapeHtml(name)}:</b> ${escapeHtml(text)}`
    feed.appendChild(item)
    while (feed.children.length > 4) feed.removeChild(feed.firstChild!)
    window.setTimeout(() => { item.style.opacity = '0'; window.setTimeout(() => item.remove(), 400) }, 6500)
  }
}

let lastPeoplePanelSignature = ''
function peoplePanelSignature(players: PresencePlayer[], connected: boolean) {
  const entries = players
    .filter(player => !blockedIds.has(player.id))
    .map(player => [player.id, player.name || '', player.location, player.dancing ? '1' : '0'].join(':'))
    .sort()
  return JSON.stringify([connected, location, [...blockedIds].sort(), entries])
}

function renderPresence(players: PresencePlayer[], connected: boolean, reconnectAttempts: number) {
  connectedPlayers = players
  presenceConnected = connected
  const panelSignature = peoplePanelSignature(players, connected)
  if (panelSignature !== lastPeoplePanelSignature) {
    lastPeoplePanelSignature = panelSignature
    renderPeople(players, connected)
  }
  renderStageEventMetrics()
  const visible = new Set(players.filter(player => player.location === location && !blockedIds.has(player.id)).map(player => player.id))
  for (const [id, model] of remoteAvatars) if (!visible.has(id)) {
    const bubble = emoteBubbles.get(id)
    if (bubble) { model.remove(bubble); disposeSpriteResources(bubble, false); emoteBubbles.delete(id) }
    const speech = speechBubbles.get(id)
    if (speech) { model.remove(speech); disposeSpriteResources(speech, true); speechBubbles.delete(id) }
    const nameTag = nameTags.get(id)
    if (nameTag) { model.remove(nameTag); disposeSpriteResources(nameTag, true); nameTags.delete(id) }
    scene.remove(model)
    remoteAvatars.delete(id)
  }
  for (const player of players) {
    if (player.location !== location || blockedIds.has(player.id)) continue
    let model = remoteAvatars.get(player.id)
    let newlySpawned = false
    if (!model) {
      model = avatar.clone()
      for (const child of [...model.children]) { if (child instanceof THREE.Sprite) model.remove(child) }
      // Keep the local avatar and plaza shadows; remote body parts skip the extra shadow-map pass.
      model.traverse(child => { if (child instanceof THREE.Mesh) child.castShadow = false })
      model.name = 'Connected guest session'
      model.userData.avatarParts = {
        body: model.getObjectByName('avatar-body') as THREE.Group,
        leftArm: model.getObjectByName('avatar-left-arm') as THREE.Group,
        rightArm: model.getObjectByName('avatar-right-arm') as THREE.Group,
        leftElbow: model.getObjectByName('avatar-left-elbow') as THREE.Group,
        rightElbow: model.getObjectByName('avatar-right-elbow') as THREE.Group,
        leftLeg: model.getObjectByName('avatar-left-leg') as THREE.Group,
        rightLeg: model.getObjectByName('avatar-right-leg') as THREE.Group,
        leftKnee: model.getObjectByName('avatar-left-knee') as THREE.Group,
        rightKnee: model.getObjectByName('avatar-right-knee') as THREE.Group,
        leftFoot: model.getObjectByName('avatar-left-foot') as THREE.Group,
        rightFoot: model.getObjectByName('avatar-right-foot') as THREE.Group,
      }
      scene.add(model)
      remoteAvatars.set(player.id, model)
      newlySpawned = true
    }
    model.userData.walking = !newlySpawned && Math.hypot(player.x - model.position.x, player.z - model.position.z) > .025
    updateAvatarNameTag(model, player.name || 'Guest', player.id)
    model.position.set(player.x, 0, player.z)
    model.rotation.y = player.angle
  }
  const count = players.filter(player => player.location === location && !blockedIds.has(player.id)).length
  const status = SOLO_PREVIEW
    ? 'Solo preview · progress saves on this device.'
    : connected
    ? `${count} other connected ${count === 1 ? 'session' : 'sessions'} here`
    : reconnectAttempts > 0
      ? `Offline · reconnecting (attempt ${reconnectAttempts})…`
      : 'Connecting to Music Square.'
  if ($<HTMLElement>('presence-status').textContent !== status) $<HTMLElement>('presence-status').textContent = status
}

function renderPeople(players: PresencePlayer[], connected: boolean) {
  const view = peopleInLocation(players.filter(player => !blockedIds.has(player.id)), location, connected)
  const place = location === 'square' ? 'Music Square' : location === 'venue' ? 'Palm Room' : location === 'studio' ? 'City Studio' : 'Release House'
  const status = $<HTMLElement>('people-status')
  $<HTMLElement>('people-description').textContent = SOLO_PREVIEW
    ? 'This solo preview runs on this device. Your movement and creations stay local.'
    : 'Only other connected players are shown. Wave to the people sharing this space.'
  const list = $<HTMLElement>('people-list')
  const wave = $<HTMLButtonElement>('people-wave')
  status.textContent = SOLO_PREVIEW
    ? 'Other players and live chat are unavailable in this solo preview.'
    : view.availability === 'offline'
    ? 'Live people are unavailable. Reconnecting…'
    : view.availability === 'empty'
      ? `No one else is in ${place} yet.`
      : `${view.people.length} ${view.people.length === 1 ? 'person' : 'people'} here now`
  list.innerHTML = view.people.map(person => `<div class="people-entry" role="listitem"><span class="people-dot" aria-hidden="true">●</span><span class="people-details"><b>${escapeHtml(person.name?.trim() || 'Guest')}</b><small>${person.dancing ? 'Dancing here now' : `In ${place}`}${mutedIds.has(person.id) ? ' · muted locally' : ''}</small></span><button type="button" class="people-options" data-player-id="${escapeHtml(person.id)}" aria-label="Safety options for ${escapeHtml(person.name?.trim() || 'Guest')}">Options</button></div>`).join('')
  list.querySelectorAll<HTMLButtonElement>('.people-options').forEach(button => {
    button.onclick = () => {
      const person = view.people.find(player => player.id === button.dataset.playerId)
      if (!person) return
      const bounds = button.getBoundingClientRect()
      showMutePopover(person.id, bounds.left + bounds.width / 2, bounds.top)
    }
  })
  const blockedSection = $<HTMLElement>('blocked-section')
  const blockedList = $<HTMLElement>('blocked-list')
  blockedSection.hidden = blockedIds.size === 0
  blockedList.innerHTML = [...blockedIds].map(id => `<div class="blocked-entry" role="listitem"><span>${escapeHtml(blockedNames.get(id) || `Guest · ${id.slice(0, 8)}`)}</span><button type="button" class="unblock-button" data-player-id="${escapeHtml(id)}">Unblock</button></div>`).join('')
  blockedList.querySelectorAll<HTMLButtonElement>('.unblock-button').forEach(button => {
    button.onclick = () => { button.disabled = true; void setPlayerBlocked(button.dataset.playerId || '', false).finally(() => { button.disabled = false }) }
  })
  renderSocialState()
  renderPartyState()
  wave.disabled = view.availability !== 'online' || view.people.length === 0
}
const presence = connectPresence(renderPresence, handleIncomingEmote, handleIncomingChat, handleFriendUpdate, handleDirectMessageNotice, handlePartyUpdate, undefined, handlePartyMessage)
window.addEventListener('beforeunload', () => presence.close())

const keys = new Set<string>()
let yaw = 0, cameraPitch = 0, cameraZoom = 0, dragging = false, previousX = 0, previousY = 0, pointerStartX = 0, pointerStartY = 0, pointerMoved = false, touchX = 0, touchY = 0
let walkTarget: THREE.Vector3 | null = null
let walkPath: WalkPoint[] = []
const walkMarker = new THREE.Mesh(new THREE.RingGeometry(.45, .58, 28), new THREE.MeshBasicMaterial({ color: '#36e8b8', side: THREE.DoubleSide, depthTest: false }))
walkMarker.rotation.x = -Math.PI / 2; walkMarker.visible = false; walkMarker.renderOrder = 20; scene.add(walkMarker)
const routeMarker = new THREE.Mesh(new THREE.RingGeometry(.7, .84, 32), new THREE.MeshBasicMaterial({ color: '#f7d37d', side: THREE.DoubleSide, depthTest: false }))
routeMarker.rotation.x = -Math.PI / 2; routeMarker.visible = false; routeMarker.renderOrder = 21; scene.add(routeMarker)
const releaseRoute = (id: ReleaseStationId): [number, number] => { const { x, z } = releaseStation(id); return [x, z] }
const routePoints: Record<Hotspot, [number, number]> = { kiosk: [-8, 3.55], cityConcierge: [-2.6, 6.4], studio: [13, -8], palmEntrance: [10, 2], stage: [0, -7], venueExit: [-10, 9], studioDesk: [0, -4.05], studioExit: [-10, 9], releaseEntrance: [-13, -8], releaseIntake: releaseRoute('intake'), releaseArtwork: releaseRoute('artwork'), releaseMetadata: releaseRoute('metadata'), releaseListening: releaseRoute('listening'), releaseRights: releaseRoute('rights'), releaseCalendar: releaseRoute('calendar'), releaseExit: [-10, 9] }
const ground = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0), raycaster = new THREE.Raycaster()
function clearWalkTarget() { walkTarget = null; walkPath = []; walkMarker.visible = false }
function beginWalkTo(x: number, z: number): boolean {
  const path = findWalkPath(location, [avatar.position.x, avatar.position.z], [x, z])
  if (!path.length) return false
  walkPath = path
  const [firstX, firstZ] = walkPath.shift()!
  walkTarget = new THREE.Vector3(firstX, 0, firstZ)
  walkMarker.position.set(x, .05, z)
  walkMarker.visible = true
  return true
}
let nearby: Hotspot | null = null
let routeTarget: Hotspot | null = null
let onwardTarget: Hotspot | null = null
let sheet: 'none' | 'desk' | 'action' = 'none'
let deskTab: 'today' | 'ask' | 'plans' = 'today'
let deskAskQuery = ''
let savedPreview = false, previewOpened = false, playing = false
const savedStageTemplate = parseStageTemplate(localStorage.getItem('scene-stage-template'))
let equipmentPreviewVisible = savedStageTemplate.floorLightPreview
let rehearsalMonitors = localStorage.getItem('scene-rehearsal-monitors') === 'true'
let rehearsalBackdrop = localStorage.getItem('scene-rehearsal-backdrop') === 'true'
let stageLook: StageLook = savedStageTemplate.lightLook
type ShowDraft = { title: string; format: 'OPEN_MIC' | 'LISTENING_SESSION'; start: string }
let showDraft: ShowDraft = { title: '', format: 'OPEN_MIC', start: '' }
let showDraftSynced = false
let showPerformers: GuestEventPerformer[] = []
let showInvitations: GuestEventInvitation[] = []
let showDraftSyncBusy = false
let cityJobState: GuestCityJobState | null = null
let cityJobNotice = ''
let cityJobBusy = false
try {
  const saved = JSON.parse(localStorage.getItem('scene-show-draft') || 'null')
  if (saved && typeof saved.title === 'string' && (saved.format === 'OPEN_MIC' || saved.format === 'LISTENING_SESSION') && typeof saved.start === 'string') {
    showDraft = { title: saved.title.slice(0, 60), format: saved.format, start: saved.start.slice(0, 16) }
  }
} catch { /* invalid local show draft starts empty */ }
async function syncShowDraft() {
  if (!guestSessionReady || showDraftSyncBusy) return
  showDraftSyncBusy = true
  try {
    const planning = await fetchGuestEventPlanning()
    const remote = planning.draft
    const pending = localStorage.getItem('scene-show-draft-pending') === 'true'
    if ((pending || !remote) && showDraft.title) {
      await saveGuestEventDraft(showDraft)
      localStorage.removeItem('scene-show-draft-pending')
      showDraftSynced = true
    } else if (remote) {
      showDraft = { title: remote.title, format: remote.format, start: remote.start }
      localStorage.setItem('scene-show-draft', JSON.stringify(showDraft))
      showDraftSynced = true
    } else showDraftSynced = false
    showPerformers = planning.performers
    showInvitations = planning.invitations
    renderStageEventMetrics()
    if (!$<HTMLElement>('desk-sheet').hidden) renderDesk()
  } finally {
    showDraftSyncBusy = false
  }
}
let dancing = false
let beatPattern: BeatPattern = starterPattern(), beatPatternB: BeatPattern = toggleStep(starterPattern(), 0, 1)
let beatKit: SoundKit = 'afrobeats', beatBpm = 104
let beatSection: 'a' | 'b' = 'a', beatPlaying = false, beatTimer: number | undefined, beatStep = 0, beatBar = 0, beatDraftSaved = false
let masterBlob: Blob | null = null, masterPlayer: HTMLAudioElement | null = null, masterAudioUrl: string | null = null, performingOnStage = false
type StageCue = { at: number; look: StageLook }
let stageCues: StageCue[] = []
let stageCueMode: 'record' | 'replay' | null = null
let nextStageCue = 0
let stageCueTimer: number | null = null
try {
  const saved = JSON.parse(localStorage.getItem('scene-stage-cues') || '[]')
  if (Array.isArray(saved)) stageCues = saved.filter((cue): cue is StageCue => cue && Number.isFinite(cue.at) && cue.at >= 0 && cue.at <= 30 && ['warm', 'sunset', 'spotlight'].includes(cue.look)).slice(0, 64)
} catch { /* invalid cue timeline starts empty */ }
let releaseDraftSaved = false, releaseAuditionPlayed = false, stagePreviewPlayed = false
let releaseDraft: ReleaseDraft = blankReleaseDraft()
let activeReleaseStation: ReleaseStationId = 'intake'
try { stagePreviewPlayed = localStorage.getItem('scene-stage-preview-played') === 'true' } catch { /* stage history is optional local progress */ }
try { releaseAuditionPlayed = localStorage.getItem('scene-release-audition-played') === 'true' } catch { /* audition history is optional local progress */ }
try { const saved = JSON.parse(localStorage.getItem('scene-beat-draft') || 'null'); if (validPattern(saved)) { beatPattern = saved; beatDraftSaved = true } } catch { /* invalid local draft starts fresh */ }
try {
  const saved = JSON.parse(localStorage.getItem('scene-beat-arrangement') || 'null')
  if (validPattern(saved?.a) && validPattern(saved?.b)) {
    beatPattern = saved.a; beatPatternB = saved.b; beatDraftSaved = true
    if (saved?.kit && ['afrobeats', 'amapiano', 'highlife'].includes(saved.kit)) beatKit = saved.kit
    if (saved?.bpm && Number.isFinite(saved.bpm)) beatBpm = clampBpm(saved.bpm)
  }
} catch { /* invalid local arrangement starts fresh */ }
try { const saved = JSON.parse(localStorage.getItem('scene-release-draft') || 'null'); if (validReleaseDraft(saved)) { releaseDraft = saved; releaseDraftSaved = !!saved.title.trim() } } catch { /* invalid local draft starts fresh */ }
let catalogue: CatalogueTrack[] = [
  { id: 'square-sketch', title: 'Square Sketch', artist: 'THE SCENE Originals', genre: 'Afrobeats / Demo', duration: 30, released: true },
  { id: 'lagos-golden-hour', title: 'Golden Hour Jam', artist: 'Victoria Island Collective', genre: 'Afro-fusion', duration: 30, released: true },
]
let currentTrackIndex = 0
const savedTrackIds = new Set<string>()
let musicPlaylists: GuestPlaylist[] = []
let editingPlaylistId: string | null = null
try { const saved = JSON.parse(localStorage.getItem('scene-saved-tracks') || '[]'); if (Array.isArray(saved)) saved.forEach(id => savedTrackIds.add(id)) } catch { /* ignore */ }
if (localStorage.getItem('scene-saved-square-sketch') === '1') savedTrackIds.add('square-sketch')

// Avatar appearance — loaded from localStorage, applied to prototype geometry only
const SKIN_DEFAULT = '#70412f', SHIRT_DEFAULT = '#dfac5f', TROUSERS_DEFAULT = '#7758b0'
let skinColour = localStorage.getItem('scene-skin') || SKIN_DEFAULT
let shirtColour = localStorage.getItem('scene-shirt') || SHIRT_DEFAULT
let trousersColour = localStorage.getItem('scene-trousers') || TROUSERS_DEFAULT
let playerName = localStorage.getItem('scene-player-name') || 'Guest'
function applyAppearance() {
  skin.color.set(skinColour)
  shirt.color.set(shirtColour)
  trousers.color.set(trousersColour)
  const nameInput = document.getElementById('avatar-name') as HTMLInputElement | null
  if (nameInput && nameInput.value !== playerName) nameInput.value = playerName
  updateAvatarNameTag(avatar, playerName, 'self')
  // Update swatch selection indicators
  document.querySelectorAll<HTMLButtonElement>('.swatch-row[data-option="skin"] button').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.value === skinColour)))
  document.querySelectorAll<HTMLButtonElement>('.swatch-row[data-option="shirt"] button').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.value === shirtColour)))
  document.querySelectorAll<HTMLButtonElement>('.swatch-row[data-option="trousers"] button').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.value === trousersColour)))
}

const guestSessionTask = openGuest().then(async guest => {
  guest.saves.forEach(id => savedTrackIds.add(id))
  for (const id of savedTrackIds) {
    if (!guest.saves.includes(id)) await saveGuestPreview(id).catch(() => {})
  }
  guestSessionReady = !SOLO_PREVIEW
  cityJobState = await fetchGuestCityJobs().catch(() => null)
  updateWalletHud()
  await syncShowDraft().catch(() => { /* device draft remains available offline */ })
  presence.auth(guest.token)
  const savedBlocks = await fetchGuestBlocks().catch(() => [])
  blockedIds.clear()
  for (const id of savedBlocks) blockedIds.add(id)
  friendState = await fetchGuestFriends().catch(() => friendState)
  partyState = await fetchGuestParty().catch(() => partyState)
  renderPresence(connectedPlayers, presenceConnected, 0)
  renderMiniPlayer()
  if (!$<HTMLElement>('music-sheet').hidden) renderMusicCollection()
}).catch(() => { /* offline guests retain the local demo save */ })

void fetchCatalogue().then(tracks => {
  if (tracks.length) {
    catalogue = tracks
    renderMiniPlayer()
    if (!$<HTMLElement>('music-sheet').hidden) renderMusicCollection()
  }
}).catch(() => {})

void loadLocalMaster().then(blob => { masterBlob = blob; if (!$<HTMLElement>('release-sheet').hidden) renderReleaseDraft(false); if (!$<HTMLElement>('desk-sheet').hidden) renderDesk() }).catch(() => { /* private mode may block local storage */ })
let audio: AudioContext | null = null, audioTimer: number | undefined

function toast(text: string) {
  const node = $<HTMLDivElement>('toast')
  node.textContent = text
  node.classList.add('show')
  window.setTimeout(() => node.classList.remove('show'), 3100)
}

function hideSheets(keepMasterAudio: boolean) {
  $<HTMLElement>('desk-sheet').hidden = true
  $<HTMLElement>('action-sheet').hidden = true
  $<HTMLElement>('display-sheet').hidden = true
  $<HTMLElement>('music-sheet').hidden = true
  $<HTMLElement>('beat-sheet').hidden = true
  $<HTMLElement>('release-sheet').hidden = true
  $<HTMLElement>('map-sheet').hidden = true
  $<HTMLElement>('people-sheet').hidden = true
  $<HTMLElement>('avatar-sheet').hidden = true
  $<HTMLElement>('chat-menu').hidden = true
  stopBeat()
  if (!keepMasterAudio) stopMasterPreview()
  sheet = 'none'
  refreshContext()
}
function closeSheets() { hideSheets(false) }

function stopDance() {
  dancing = false
  $<HTMLButtonElement>('dance').setAttribute('aria-pressed', 'false')
  $<HTMLButtonElement>('dance').textContent = '♪ Dance'
}

function stopMasterPreview() {
  if (stageCueMode === 'record') {
    try { localStorage.setItem('scene-stage-cues', JSON.stringify(stageCues)) } catch { /* rehearsal cues are optional local progress */ }
  }
  stageCueMode = null
  if (stageCueTimer !== null) window.clearInterval(stageCueTimer)
  stageCueTimer = null
  $<HTMLElement>('stage-cue-hud').hidden = true
  masterPlayer?.pause(); masterPlayer = null
  if (masterAudioUrl) URL.revokeObjectURL(masterAudioUrl)
  masterAudioUrl = null
  if (performingOnStage) {
    performingOnStage = false
    palmRoom?.setStagePerformance(false)
  }
  if (!playing && !beatPlaying) { $<HTMLButtonElement>('audio').innerHTML = '♫ <span>OFF</span>'; $<HTMLButtonElement>('audio').setAttribute('aria-label', 'Audio off') }
}

function startStageRehearsal(mode: 'record' | 'replay') {
  if (!masterBlob) return
  stopPreview()
  stopBeat()
  stopMasterPreview()
  if (mode === 'record') stageCues = []
  stageCueMode = mode
  nextStageCue = 0
  masterAudioUrl = URL.createObjectURL(masterBlob)
  masterPlayer = new Audio(masterAudioUrl)
  const player = masterPlayer
  masterPlayer.onended = () => { stopMasterPreview(); toast(mode === 'record' ? 'Rehearsal cues saved on this device' : 'Show replay finished') }
  performingOnStage = true
  palmRoom?.setStagePerformance(true)
  $<HTMLElement>('stage-cue-title').textContent = mode === 'record' ? 'CUE THE LIGHTS' : 'REPLAYING YOUR SHOW'
  $<HTMLElement>('stage-cue-count').textContent = mode === 'record' ? 'Tap a light to cue it during your master.' : `${stageCues.length} saved light cues`
  document.querySelectorAll<HTMLButtonElement>('[data-cue-look]').forEach(button => { button.disabled = mode === 'replay' })
  stageCueTimer = window.setInterval(() => {
    if (!masterPlayer || !stageCueMode) return
    const seconds = masterPlayer.currentTime
    $<HTMLElement>('stage-cue-time').textContent = `0:${String(Math.min(30, Math.floor(seconds))).padStart(2, '0')} / 0:30`
    if (stageCueMode === 'replay') {
      while (nextStageCue < stageCues.length && stageCues[nextStageCue].at <= seconds) {
        stageLook = stageCues[nextStageCue++].look
        palmRoom?.setStageLook(stageLook)
      }
    }
  }, 100)
  void player.play().then(() => {
    if (masterPlayer !== player || stageCueMode !== mode) return
    stagePreviewPlayed = true
    try { localStorage.setItem('scene-stage-preview-played', 'true') } catch { /* stage history is optional local progress */ }
    $<HTMLButtonElement>('audio').innerHTML = '♫ <span>ON</span>'
    $<HTMLButtonElement>('audio').setAttribute('aria-label', 'Audio on')
    hideSheets(true)
    $<HTMLElement>('stage-cue-hud').hidden = false
    toast(mode === 'record' ? 'Rehearsal started · cue the lights' : 'Your saved show is playing locally')
  }).catch(() => { if (masterPlayer === player) { stopMasterPreview(); toast('Audio was blocked · Tap rehearsal again') } })
}

function setRoute(target: Hotspot) {
  routeTarget = target
  const [x, z] = routePoints[target]
  routeMarker.position.set(x, .075, z)
  routeMarker.visible = true
  $<HTMLElement>('route').hidden = false
  const releaseTitle = RELEASE_JOURNEY.find(station => station.hotspot === target)?.title
  $<HTMLElement>('route-title').textContent = releaseTitle?.toUpperCase() ?? (target === 'cityConcierge' ? 'CITY CONCIERGE' : target === 'palmEntrance' ? 'PALM ROOM' : target === 'stage' ? 'STAGE SETUP' : target === 'studio' ? 'CITY STUDIO' : target === 'studioDesk' ? 'BEAT DESK' : target === 'studioExit' ? 'STUDIO EXIT' : target === 'releaseEntrance' ? 'RELEASE HOUSE' : target === 'releaseExit' ? 'RELEASE EXIT' : target === 'venueExit' ? 'VENUE EXIT' : 'LISTENING STATION')
  closeSheets()
  toast(beginWalkTo(x, z) ? 'Walking to the marked place · steer with WASD or the touch pad' : 'No clear walking route · move closer and try again')
}

const mapPins: Partial<Record<Hotspot, [number, number]>> = { releaseEntrance: [15, 18], studio: [84, 18], kiosk: [28, 54], palmEntrance: [76, 54] }
function mapCoordinates(x: number, z: number): [number, number] {
  return [Math.max(5, Math.min(95, (x + 18) / 37 * 100)), Math.max(6, Math.min(94, (z + 12) / 28 * 100))]
}
function exitForLocation(): Hotspot { return location === 'venue' ? 'venueExit' : location === 'studio' ? 'studioExit' : 'releaseExit' }
function mapRoute(target: Hotspot) {
  onwardTarget = location === 'square' ? null : target
  setRoute(location === 'square' ? target : exitForLocation())
  if (onwardTarget) toast(`Walk to the exit, then follow the route to ${mapDestinations.find(item => item.id === target)?.name}`)
}
function continueMapRoute() {
  if (!onwardTarget) return
  const target = onwardTarget
  onwardTarget = null
  setRoute(target)
}
function renderMap() {
  const avatarPin = $<HTMLElement>('map-avatar')
  avatarPin.hidden = location !== 'square'
  if (location === 'square') {
    const [x, y] = mapCoordinates(avatar.position.x, avatar.position.z)
    avatarPin.style.left = `${x}%`
    avatarPin.style.top = `${y}%`
  }
  const routeSvg = $<SVGSVGElement>('map-route-line')
  const destination = routeTarget ? mapPins[routeTarget] : undefined
  const routePath = routeTarget && location === 'square' && destination
    ? findWalkPath('square', [avatar.position.x, avatar.position.z], routePoints[routeTarget])
    : []
  routeSvg.toggleAttribute('hidden', location !== 'square' || !destination || !routePath.length)
  if (destination && routePath.length) {
    const line = $<SVGPolylineElement>('map-route-stroke')
    const points = [mapCoordinates(avatar.position.x, avatar.position.z), ...routePath.map(([x, z]) => mapCoordinates(x, z))]
    line.setAttribute('points', points.map(([x, y]) => `${x},${y}`).join(' '))
  }
  $<HTMLElement>('map-context').textContent = location === 'square' ? 'Choose a place to walk there. Interact at its entrance.' : `You are inside ${location === 'venue' ? 'Palm Room' : location === 'studio' ? 'City Studio' : 'Release House'}. A route to another place begins at this room’s exit.`
  const selectedMapTarget = onwardTarget ?? routeTarget
  $<HTMLElement>('map-places').innerHTML = mapDestinations.map(item => `<button data-map-target="${item.id}" ${selectedMapTarget === item.id ? 'class="active-route" aria-current="location"' : ''}><b>${item.name}</b><small>${item.detail}</small><span>${selectedMapTarget === item.id ? 'Route active ↗' : 'Walk there ↗'}</span></button>`).join('')
  $<HTMLElement>('map-sheet').querySelectorAll<HTMLButtonElement>('[data-map-target]').forEach(button => button.onclick = () => mapRoute(button.dataset.mapTarget as Hotspot))
}

const trackMelodies: Record<string, number[]> = {
  'square-sketch': [220, 261.63, 329.63, 392, 329.63, 261.63, 196, 246.94],
  'lagos-golden-hour': [293.66, 369.99, 440, 523.25, 440, 369.99, 329.63, 293.66],
}

function startPreview(trackIdx = currentTrackIndex) {
  stopBeat()
  stopMasterPreview()
  currentTrackIndex = trackIdx
  const track = catalogue[currentTrackIndex] || catalogue[0]
  previewOpened = true
  audio ??= new AudioContext()
  void audio.resume()
  playing = true
  let step = 0
  const notes = trackMelodies[track.id] || trackMelodies['square-sketch']
  const note = () => {
    if (!playing || !audio) return
    const oscillator = audio.createOscillator(), gain = audio.createGain()
    oscillator.type = track.id === 'lagos-golden-hour' ? 'triangle' : 'sine'
    oscillator.frequency.value = notes[step++ % notes.length]
    gain.gain.setValueAtTime(.0001, audio.currentTime)
    gain.gain.exponentialRampToValueAtTime(.065, audio.currentTime + .02)
    gain.gain.exponentialRampToValueAtTime(.0001, audio.currentTime + .29)
    oscillator.connect(gain).connect(audio.destination)
    oscillator.start(); oscillator.stop(audio.currentTime + .3)
  }
  note()
  if (audioTimer) window.clearInterval(audioTimer)
  audioTimer = window.setInterval(note, 350)
  $<HTMLButtonElement>('audio').innerHTML = '♫ <span>ON</span>'
  $<HTMLButtonElement>('audio').setAttribute('aria-label', 'Audio on')
  renderMiniPlayer()
}

function stopPreview() {
  playing = false
  window.clearInterval(audioTimer)
  audioTimer = undefined
  $<HTMLButtonElement>('audio').innerHTML = '♫ <span>OFF</span>'
  $<HTMLButtonElement>('audio').setAttribute('aria-label', 'Audio off')
  renderMiniPlayer()
}

async function toggleSaveCurrentTrack() {
  const track = catalogue[currentTrackIndex] || catalogue[0]
  const isSaved = savedTrackIds.has(track.id)
  if (isSaved) {
    savedTrackIds.delete(track.id)
    try { localStorage.setItem('scene-saved-tracks', JSON.stringify([...savedTrackIds])) } catch { /* ignore */ }
    toast(`Removed ${track.title} from saves`)
    await removeGuestSave(track.id).catch(() => {})
  } else {
    savedTrackIds.add(track.id)
    try { localStorage.setItem('scene-saved-tracks', JSON.stringify([...savedTrackIds])) } catch { /* ignore */ }
    toast(`Saved ${track.title} privately`)
    await saveGuestPreview(track.id).catch(() => toast('Saved locally; server sync unavailable'))
  }
  renderMiniPlayer()
  if (!$<HTMLElement>('music-sheet').hidden) renderMusicCollection()
}

function renderMiniPlayer() {
  const track = catalogue[currentTrackIndex] || catalogue[0]
  $<HTMLElement>('mini-player').hidden = !previewOpened
  $<HTMLElement>('mini-title').textContent = track.title
  $<HTMLElement>('mini-artist').textContent = `${track.artist} · ${track.genre}`
  $<HTMLButtonElement>('mini-play').textContent = playing ? 'Ⅱ' : '▶'
  $<HTMLButtonElement>('mini-play').setAttribute('aria-label', playing ? `Pause ${track.title}` : `Play ${track.title}`)
  const isSaved = savedTrackIds.has(track.id)
  $<HTMLButtonElement>('mini-save').textContent = isSaved ? '♥' : '♡'
  $<HTMLButtonElement>('mini-save').setAttribute('aria-label', isSaved ? `Remove ${track.title} from saves` : `Save ${track.title}`)
  $<HTMLButtonElement>('mini-save').disabled = false
}

function setMusicStatus(message: string) {
  $<HTMLElement>('music-status').textContent = message
}

function renderMusicCollection() {
  const saved = catalogue.filter(track => track.released && savedTrackIds.has(track.id))
  $<HTMLElement>('music-saved-count').textContent = `${saved.length} ${saved.length === 1 ? 'song' : 'songs'}`
  $<HTMLElement>('music-saved-list').innerHTML = saved.length
    ? `<div class="music-saved-list">${saved.map(track => `<div class="music-saved-row"><span class="music-record-icon">♫</span><span class="music-track-copy"><b>${escapeHtml(track.title)}</b><small>${escapeHtml(track.artist)}</small></span><button type="button" data-music-action="unsave" data-track-id="${escapeHtml(track.id)}" aria-label="Remove ${escapeHtml(track.title)} from saved songs">×</button></div>`).join('')}</div>`
    : '<p class="music-empty-saved">Save a released song from its player and it will be waiting here.</p>'

  const sorted = [...musicPlaylists].sort((a, b) => a.position - b.position)
  musicPlaylists = sorted
  $<HTMLInputElement>('playlist-name').disabled = sorted.length >= 20
  $<HTMLButtonElement>('playlist-create-form').querySelector('button')!.disabled = sorted.length >= 20
  $<HTMLElement>('music-playlist-list').innerHTML = sorted.length
    ? sorted.map((playlist, playlistIndex) => {
      const id = escapeHtml(playlist.id)
      const title = escapeHtml(playlist.name)
      const tracks = playlist.tracks.map((track, index) => `<div class="playlist-track-row"><span class="playlist-track-index">${String(index + 1).padStart(2, '0')}</span><span class="music-track-copy"><b>${escapeHtml(track.title)}</b><small>${escapeHtml(track.artist)}</small></span><div class="playlist-track-controls"><button type="button" data-music-action="track-up" data-playlist-id="${id}" data-track-index="${index}" aria-label="Move ${escapeHtml(track.title)} up" ${index === 0 ? 'disabled' : ''}>↑</button><button type="button" data-music-action="track-down" data-playlist-id="${id}" data-track-index="${index}" aria-label="Move ${escapeHtml(track.title)} down" ${index === playlist.tracks.length - 1 ? 'disabled' : ''}>↓</button><button type="button" data-music-action="remove-track" data-playlist-id="${id}" data-track-id="${escapeHtml(track.id)}" aria-label="Remove ${escapeHtml(track.title)}">×</button></div></div>`).join('')
      const choices = catalogue.filter(track => track.released && !playlist.tracks.some(savedTrack => savedTrack.id === track.id))
      const edit = editingPlaylistId === playlist.id
        ? `<form class="playlist-rename-form" data-playlist-rename="${id}"><label for="playlist-rename-${id}">Playlist name</label><div><input id="playlist-rename-${id}" name="name" maxlength="40" required value="${title}" /><button type="submit">Save</button><button type="button" data-music-action="edit-playlist" data-playlist-id="${id}">Cancel</button></div></form>`
        : `<div class="playlist-card-title"><div><h3>${title}</h3><small>${playlist.tracks.length} / 100 songs · Private</small></div><div class="playlist-card-controls"><button type="button" data-music-action="playlist-up" data-playlist-id="${id}" aria-label="Move ${title} up" ${playlistIndex === 0 ? 'disabled' : ''}>↑</button><button type="button" data-music-action="playlist-down" data-playlist-id="${id}" aria-label="Move ${title} down" ${playlistIndex === sorted.length - 1 ? 'disabled' : ''}>↓</button><button type="button" data-music-action="edit-playlist" data-playlist-id="${id}">Rename</button><button type="button" data-music-action="delete-playlist" data-playlist-id="${id}">Delete</button></div></div>`
      const add = `<form class="playlist-add-form" data-playlist-add="${id}"><select id="playlist-add-${id}" name="trackId" aria-label="Add a released song to ${title}" ${choices.length ? '' : 'disabled'}><option value="">${choices.length ? 'Add a released song…' : 'All available songs added'}</option>${choices.map(track => `<option value="${escapeHtml(track.id)}">${escapeHtml(track.title)} · ${escapeHtml(track.artist)}</option>`).join('')}</select><button type="submit" ${choices.length ? '' : 'disabled'}>Add song</button></form>`
      return `<article class="music-playlist-card">${edit}<div class="playlist-card-body">${tracks || '<p class="playlist-empty">Your set starts here. Add a released song below.</p>'}${add}</div></article>`
    }).join('')
    : '<div class="music-empty-playlists"><span>♫</span><b>Your first set is yours to shape.</b><small>Create a playlist, then add songs released in THE SCENE.</small></div>'
}

async function openMusicCollection() {
  closeSheets()
  $<HTMLElement>('venue-card').hidden = true
  $<HTMLElement>('music-sheet').hidden = false
  sheet = 'action'
  editingPlaylistId = null
  renderMusicCollection()
  setMusicStatus('Loading your private collection…')
  try {
    if (!SOLO_PREVIEW) await guestSessionTask
    musicPlaylists = await fetchGuestPlaylists()
    renderMusicCollection()
    setMusicStatus(SOLO_PREVIEW ? 'Private to this device · sharing is not enabled.' : 'Private to your player identity · sharing is not enabled.')
  } catch (error) {
    setMusicStatus(error instanceof Error ? error.message : 'Your playlists could not load. Try again when connected.')
  }
}

async function commitMusicChange(change: Promise<GuestPlaylist[]>, successMessage: string) {
  setMusicStatus('Saving your collection…')
  try {
    musicPlaylists = await change
    editingPlaylistId = null
    renderMusicCollection()
    setMusicStatus(successMessage)
    return true
  } catch (error) {
    setMusicStatus(error instanceof Error ? error.message : 'Could not save that change. Try again.')
    return false
  }
}

function beatVoice(lane: number) {
  audio ??= new AudioContext()
  void audio.resume()
  const at = audio.currentTime, oscillator = audio.createOscillator(), gain = audio.createGain()

  if (lane === 0) {
    // Kick
    oscillator.type = 'sine'
    const f0 = beatKit === 'amapiano' ? 45 : beatKit === 'highlife' ? 70 : 60
    const sweep = beatKit === 'amapiano' ? 85 : 70
    oscillator.frequency.setValueAtTime(f0 + sweep, at)
    oscillator.frequency.exponentialRampToValueAtTime(f0, at + 0.12)
    gain.gain.setValueAtTime(0.0001, at)
    gain.gain.exponentialRampToValueAtTime(0.09, at + 0.005)
    gain.gain.exponentialRampToValueAtTime(0.0001, at + 0.22)
  } else if (lane === 1) {
    // Snare / Rim / Clap
    oscillator.type = beatKit === 'amapiano' ? 'triangle' : 'square'
    oscillator.frequency.setValueAtTime(beatKit === 'amapiano' ? 320 : 220, at)
    oscillator.frequency.exponentialRampToValueAtTime(110, at + 0.09)
    gain.gain.setValueAtTime(0.0001, at)
    gain.gain.exponentialRampToValueAtTime(0.045, at + 0.004)
    gain.gain.exponentialRampToValueAtTime(0.0001, at + 0.15)
  } else if (lane === 2) {
    // Shaker / Hat
    oscillator.type = 'square'
    oscillator.frequency.setValueAtTime(beatKit === 'highlife' ? 880 : 640, at)
    oscillator.frequency.exponentialRampToValueAtTime(420, at + 0.04)
    gain.gain.setValueAtTime(0.0001, at)
    gain.gain.exponentialRampToValueAtTime(0.016, at + 0.002)
    gain.gain.exponentialRampToValueAtTime(0.0001, at + 0.06)
  } else {
    // Bass / Log Drum
    oscillator.type = beatKit === 'amapiano' ? 'triangle' : 'sine'
    const bassF = beatKit === 'amapiano' ? 80 : beatKit === 'highlife' ? 130 : 110
    oscillator.frequency.setValueAtTime(bassF, at)
    oscillator.frequency.exponentialRampToValueAtTime(bassF * 0.8, at + 0.2)
    gain.gain.setValueAtTime(0.0001, at)
    gain.gain.exponentialRampToValueAtTime(0.075, at + 0.01)
    gain.gain.exponentialRampToValueAtTime(0.0001, at + 0.35)
  }

  oscillator.connect(gain).connect(audio.destination)
  oscillator.start(at); oscillator.stop(at + 0.38)
}

function drawBeat() {
  const grid = $<HTMLDivElement>('beat-grid')
  const pattern = beatSection === 'a' ? beatPattern : beatPatternB
  const kitInfo = SOUND_KITS[beatKit]

  document.querySelectorAll<HTMLButtonElement>('[data-section]').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.section === beatSection)))
  document.querySelectorAll<HTMLButtonElement>('[data-kit]').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.kit === beatKit)))

  const tempoInput = $<HTMLInputElement>('beat-tempo')
  if (tempoInput && Number(tempoInput.value) !== beatBpm) tempoInput.value = String(beatBpm)
  const tempoDisplay = $<HTMLElement>('tempo-display')
  if (tempoDisplay) tempoDisplay.textContent = String(beatBpm)

  grid.innerHTML = pattern.map((lane, laneIndex) => `<div class="beat-row"><b>${kitInfo.labels[laneIndex]}</b>${lane.map((on, step) => `<button aria-label="${kitInfo.labels[laneIndex]} step ${step + 1}" aria-pressed="${on}" data-lane="${laneIndex}" data-step="${step}" class="${beatPlaying && beatStep === step ? 'current' : ''}"></button>`).join('')}</div>`).join('')
  grid.querySelectorAll<HTMLButtonElement>('button').forEach(button => button.onclick = () => { if (beatSection === 'a') beatPattern = toggleStep(beatPattern, Number(button.dataset.lane), Number(button.dataset.step)); else beatPatternB = toggleStep(beatPatternB, Number(button.dataset.lane), Number(button.dataset.step)); drawBeat() })
}

function stopBeat() {
  beatPlaying = false; window.clearInterval(beatTimer)
  const button = $<HTMLButtonElement>('beat-play')
  if (button) button.textContent = '▶ Play beat'
  if (!playing) { $<HTMLButtonElement>('audio').innerHTML = '♫ <span>OFF</span>'; $<HTMLButtonElement>('audio').setAttribute('aria-label', 'Audio off') }
}

function openBeat() {
  closeSheets(); sheet = 'action'; $<HTMLElement>('beat-sheet').hidden = false; drawBeat()
}

function toggleBeat() {
  if (beatPlaying) { stopBeat(); drawBeat(); return }
  stopPreview(); beatPlaying = true; beatStep = 0; beatBar = 0
  $<HTMLButtonElement>('beat-play').textContent = '■ Stop beat'
  $<HTMLButtonElement>('audio').innerHTML = '♫ <span>BEAT</span>'
  $<HTMLButtonElement>('audio').setAttribute('aria-label', 'Beat playing')
  const stepMs = bpmToStepMs(beatBpm)
  const pulse = () => { const pattern = beatBar % 2 ? beatPatternB : beatPattern; pattern.forEach((row, lane) => { if (row[beatStep]) beatVoice(lane) }); drawBeat(); beatStep = (beatStep + 1) % 8; if (beatStep === 0) beatBar++ }
  pulse(); beatTimer = window.setInterval(pulse, stepMs)
}

function openAction(title: string, copy: string, primary: string, onPrimary: () => void, secondary?: { label: string; action: () => void }, keepMasterAudio = false) {
  hideSheets(keepMasterAudio)
  sheet = 'action'
  $<HTMLElement>('action-sheet').hidden = false
  $<HTMLElement>('action-title').textContent = title
  $<HTMLElement>('action-copy').textContent = copy
  const primaryButton = $<HTMLButtonElement>('action-primary')
  primaryButton.textContent = primary
  primaryButton.onclick = onPrimary
  const secondaryButton = $<HTMLButtonElement>('action-secondary')
  secondaryButton.hidden = !secondary
  if (secondary) { secondaryButton.textContent = secondary.label; secondaryButton.onclick = secondary.action }
  refreshContext()
}

function enterVenue() {
  if (getNearby('square', avatar.position.x, avatar.position.z) !== 'palmEntrance') { toast('Walk to the Palm Room entrance first'); return }
  void showVenue()
}

async function showVenue() {
  stopDance()
  clearWalkTarget()
  if (!palmRoom) {
    const { makePalmRoom } = await import('./palmWorld.ts')
    palmRoom = makePalmRoom()
    palmRoom.setStageLook(stageLook)
    palmRoom.setEquipmentPreview(equipmentPreviewVisible)
    palmRoom.setRehearsalMonitors(rehearsalMonitors)
    palmRoom.setRehearsalBackdrop(rehearsalBackdrop)
    scene.add(palmRoom.root)
  }
  square.visible = false
  palmRoom.root.visible = true
  location = 'venue'
  renderPresence(connectedPlayers, presenceConnected, 0)
  $<HTMLElement>('game').dataset.location = 'venue'
  avatar.position.set(0, 0, 8)
  avatar.rotation.y = Math.PI
  idleFacing = Math.PI
  yaw = 0
  camera.position.set(0, 4.9, 18.6)
  sun.intensity = 1.45
  ambient.intensity = 1.9
  scene.background = new THREE.Color('#302631')
  scene.fog = new THREE.Fog('#302631', 24, 55)
  routeTarget = null
  $<HTMLElement>('route').hidden = true
  closeSheets()
  $<HTMLElement>('venue-card').hidden = false
  $<HTMLElement>('place-name').textContent = 'Palm Room · Victoria Island'
  $<HTMLElement>('scene-name').textContent = 'PALM ROOM'
  toast('Palm Room preview · explore the stage')
}

function enterStudio() {
  if (getNearby('square', avatar.position.x, avatar.position.z) !== 'studio') { toast('Walk to the City Studio door first'); return }
  void showStudio()
}

async function showStudio() {
  stopDance()
  clearWalkTarget()
  if (!studioRoom) {
    const { makeStudio } = await import('./studioWorld.ts')
    studioRoom = makeStudio()
    scene.add(studioRoom)
  }
  square.visible = false; studioRoom.visible = true
  location = 'studio'; $<HTMLElement>('game').dataset.location = 'studio'
  renderPresence(connectedPlayers, presenceConnected, 0)
  avatar.position.set(0, 0, 7); avatar.rotation.y = Math.PI; idleFacing = Math.PI; yaw = 0; camera.position.set(0, 3.7, 14)
  sun.intensity = 1.05; ambient.intensity = 1.45
  scene.background = new THREE.Color('#28202f'); scene.fog = new THREE.Fog('#28202f', 24, 56)
  routeTarget = null; $<HTMLElement>('route').hidden = true; nearby = null; closeSheets()
  $<HTMLElement>('venue-card').hidden = true
  $<HTMLElement>('place-name').textContent = 'City Studio · Lagos'
  $<HTMLElement>('scene-name').textContent = 'CITY STUDIO'
  toast('Walk to the producer desk and make a beat')
}

function leaveStudio() {
  if (getNearby('studio', avatar.position.x, avatar.position.z) !== 'studioExit') { toast('Walk to the exit first'); return }
  clearWalkTarget(); stopBeat(); studioRoom!.visible = false; square.visible = true
  location = 'square'; $<HTMLElement>('game').dataset.location = 'square'
  renderPresence(connectedPlayers, presenceConnected, 0)
  avatar.position.set(13, 0, -6.7); avatar.rotation.y = Math.PI; idleFacing = Math.PI; yaw = 0; camera.position.set(13, 3.8, .3)
  sun.intensity = 2; ambient.intensity = 1.9
  scene.background = new THREE.Color('#413243'); scene.fog = new THREE.Fog('#413243', 32, 72)
  nearby = null; closeSheets(); $<HTMLElement>('place-name').textContent = 'Music Square · Lagos'
  $<HTMLElement>('scene-name').textContent = 'MUSIC SQUARE'
  continueMapRoute()
}

function enterReleaseHouse() {
  if (getNearby('square', avatar.position.x, avatar.position.z) !== 'releaseEntrance') { toast('Walk to the Release House entrance first'); return }
  void showReleaseHouse()
}

async function showReleaseHouse() {
  stopDance()
  clearWalkTarget()
  if (!releaseRoom) {
    const { makeReleaseHouse } = await import('./releaseWorld.ts')
    releaseRoom = makeReleaseHouse()
    scene.add(releaseRoom)
  }
  square.visible = false; releaseRoom.visible = true
  location = 'release'; $<HTMLElement>('game').dataset.location = 'release'
  renderPresence(connectedPlayers, presenceConnected, 0)
  avatar.position.set(0, 0, 7); avatar.rotation.y = Math.PI; idleFacing = Math.PI; yaw = 0; camera.position.set(0, 3.7, 14)
  sun.intensity = 1.05; ambient.intensity = 1.45
  scene.background = new THREE.Color('#251d2e'); scene.fog = new THREE.Fog('#251d2e', 24, 56)
  routeTarget = null; $<HTMLElement>('route').hidden = true; nearby = null; closeSheets()
  $<HTMLElement>('venue-card').hidden = true
  $<HTMLElement>('place-name').textContent = 'Release House · Lagos'
  $<HTMLElement>('scene-name').textContent = 'RELEASE HOUSE'
  toast('Walk to Record Intake to prepare a private sleeve')
}

function leaveReleaseHouse() {
  if (getNearby('release', avatar.position.x, avatar.position.z) !== 'releaseExit') { toast('Walk to the exit first'); return }
  clearWalkTarget(); releaseRoom!.visible = false; square.visible = true
  location = 'square'; $<HTMLElement>('game').dataset.location = 'square'
  renderPresence(connectedPlayers, presenceConnected, 0)
  avatar.position.set(-13, 0, -6.7); avatar.rotation.y = Math.PI; idleFacing = Math.PI; yaw = 0; camera.position.set(-13, 3.8, .3)
  sun.intensity = 2; ambient.intensity = 1.9
  scene.background = new THREE.Color('#413243'); scene.fog = new THREE.Fog('#413243', 32, 72)
  nearby = null; closeSheets(); $<HTMLElement>('place-name').textContent = 'Music Square · Lagos'
  $<HTMLElement>('scene-name').textContent = 'MUSIC SQUARE'
  continueMapRoute()
}

function renderReleaseDraft(syncInputs = true) {
  if (syncInputs) {
    $<HTMLInputElement>('release-title').value = releaseDraft.title
    $<HTMLInputElement>('release-artist').value = releaseDraft.artist
    const genreSelect = $<HTMLSelectElement>('release-genre')
    if (genreSelect) genreSelect.value = releaseDraft.genre
    const rightMaster = $<HTMLInputElement>('right-master')
    if (rightMaster) rightMaster.checked = releaseDraft.rights.masterOwnership
    const rightComp = $<HTMLInputElement>('right-composition')
    if (rightComp) rightComp.checked = releaseDraft.rights.originalComposition
    const rightSamples = $<HTMLInputElement>('right-samples')
    if (rightSamples) rightSamples.checked = releaseDraft.rights.sampleClearance
    const rightConsent = $<HTMLInputElement>('right-consent')
    if (rightConsent) rightConsent.checked = releaseDraft.rights.contributorConsent
  }
  $<HTMLElement>('release-cover-title').textContent = releaseDraft.title || 'UNTITLED'
  $<HTMLElement>('release-cover-artist').textContent = releaseDraft.artist || 'ARTIST NAME'
  $<HTMLElement>('release-cover-genre').textContent = RELEASE_GENRES[releaseDraft.genre] || 'Afrobeats'
  $<HTMLElement>('release-cover').dataset.art = releaseDraft.artwork
  document.querySelectorAll<HTMLButtonElement>('[data-art]').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.art === releaseDraft.artwork)))
  $<HTMLElement>('release-blockers').replaceChildren(...releaseBlockers(releaseDraft, !!masterBlob).map(item => { const li = document.createElement('li'); li.textContent = item; return li }))
  $<HTMLElement>('release-master-status').textContent = masterBlob ? 'A private 30-second master is ready on this device.' : 'No rendered master on this device.'
  $<HTMLElement>('release-listen-status').textContent = masterBlob ? 'Your local master is ready to audition.' : 'Render a master in City Studio before auditioning.'
  $<HTMLButtonElement>('release-play').hidden = !masterBlob
  $<HTMLButtonElement>('release-export-master').hidden = !masterBlob

  const ready = canPreflight(releaseDraft, !!masterBlob)
  const preflightBtn = $<HTMLButtonElement>('release-preflight')
  if (preflightBtn) {
    preflightBtn.disabled = !ready
    preflightBtn.textContent = ready ? '✓ Ready for Preflight' : 'Validate Preflight'
  }
}

$<HTMLButtonElement>('release-previous').onclick = () => {
  const previous = previousReleaseStation(activeReleaseStation)
  if (previous) walkToReleaseStation(previous)
}
$<HTMLButtonElement>('release-next').onclick = () => {
  const next = nextReleaseStation(activeReleaseStation)
  if (next) walkToReleaseStation(next)
}

function formatLagosReleaseTime(instant: string) {
  const date = new Date(instant)
  if (!Number.isFinite(date.getTime())) throw new TypeError('Invalid release calendar timestamp')
  const dateLabel = new Intl.DateTimeFormat('en-NG', { timeZone: 'Africa/Lagos', weekday: 'short', day: 'numeric', month: 'short' }).format(date)
  const timeLabel = new Intl.DateTimeFormat('en-NG', { timeZone: 'Africa/Lagos', hour: 'numeric', minute: '2-digit' }).format(date)
  return `${dateLabel} · ${timeLabel}`
}

async function updateReleaseCalendar() {
  const status = $<HTMLElement>('release-calendar-status')
  status.textContent = 'Checking server time'
  try {
    const response = await fetch('/api/release-window', { cache: 'no-store' })
    if (!response.ok) throw new Error('Release calendar unavailable')
    const calendar = await response.json() as {
      timezone: string
      nextEligibleFriday: string
      submissionDeadline: string
      moderationCheckpoint: string
      premiereAt: string
    }
    if (calendar.timezone !== 'Africa/Lagos' || calendar.nextEligibleFriday !== calendar.premiereAt) throw new Error('Unexpected release calendar')
    $<HTMLElement>('release-next-friday').textContent = formatLagosReleaseTime(calendar.nextEligibleFriday)
    $<HTMLElement>('release-submit-deadline').textContent = formatLagosReleaseTime(calendar.submissionDeadline)
    $<HTMLElement>('release-moderation-checkpoint').textContent = formatLagosReleaseTime(calendar.moderationCheckpoint)
    $<HTMLElement>('release-premiere-time').textContent = formatLagosReleaseTime(calendar.premiereAt)
    status.textContent = 'Preview only · no date reserved; submission and approval are unavailable.'
  } catch {
    $<HTMLElement>('release-next-friday').textContent = 'Server calendar unavailable'
    $<HTMLElement>('release-submit-deadline').textContent = '—'
    $<HTMLElement>('release-moderation-checkpoint').textContent = '—'
    $<HTMLElement>('release-premiere-time').textContent = '—'
    status.textContent = 'No release date is reserved.'
  }
}

function walkToReleaseStation(id: ReleaseStationId) {
  activeReleaseStation = id
  setRoute(releaseStation(id).hotspot)
}

function renderReleaseStation(id: ReleaseStationId) {
  activeReleaseStation = id
  const index = RELEASE_JOURNEY.findIndex(station => station.id === id)
  const station = releaseStation(id)
  $<HTMLElement>('release-step-count').textContent = `STATION ${index + 1} OF ${RELEASE_JOURNEY.length}`
  $<HTMLElement>('release-station-title').textContent = station.title
  $<HTMLElement>('release-station-instruction').textContent = station.instruction
  $<HTMLOListElement>('release-steps').replaceChildren(...RELEASE_JOURNEY.map(item => {
    const step = document.createElement('li')
    step.textContent = item.title
    if (item.id === id) { step.setAttribute('aria-current', 'step'); step.className = 'active' }
    return step
  }))
  document.querySelectorAll<HTMLElement>('[data-release-panel]').forEach(panel => {
    panel.hidden = panel.dataset.releasePanel !== id
  })
  const previous = previousReleaseStation(id)
  const next = nextReleaseStation(id)
  const previousButton = $<HTMLButtonElement>('release-previous')
  previousButton.hidden = !previous
  previousButton.textContent = previous ? `← Walk to ${releaseStation(previous).title}` : ''
  const nextButton = $<HTMLButtonElement>('release-next')
  nextButton.hidden = !next
  nextButton.textContent = next ? `Walk to ${releaseStation(next).title} →` : ''
}

function openReleaseDraft(id: ReleaseStationId = 'intake') {
  closeSheets(); sheet = 'action'; $<HTMLElement>('release-sheet').hidden = false
  renderReleaseStation(id); renderReleaseDraft()
  refreshContext()
  if (id === 'calendar') void updateReleaseCalendar()
}

function leaveVenue() {
  if (getNearby('venue', avatar.position.x, avatar.position.z) !== 'venueExit') { toast('Walk to the exit first'); return }
  clearWalkTarget(); palmRoom!.root.visible = false
  square.visible = true
  location = 'square'
  renderPresence(connectedPlayers, presenceConnected, 0)
  $<HTMLElement>('game').dataset.location = 'square'
  avatar.position.set(10, 0, 3.5)
  avatar.rotation.y = Math.PI
  idleFacing = Math.PI
  yaw = 0
  camera.position.set(10, 3.8, 10.5)
  sun.intensity = 2.0
  ambient.intensity = 1.9
  scene.background = new THREE.Color('#413243')
  scene.fog = new THREE.Fog('#413243', 32, 72)
  nearby = null
  closeSheets()
  $<HTMLElement>('venue-card').hidden = true
  $<HTMLElement>('place-name').textContent = 'Music Square · Lagos'
  $<HTMLElement>('scene-name').textContent = 'MUSIC SQUARE'
  continueMapRoute()
}

function saveStageTemplate() {
  try {
    localStorage.setItem('scene-stage-template', serializeStageTemplate({ version: 1, lightLook: stageLook, floorLightPreview: equipmentPreviewVisible }))
    localStorage.setItem('scene-rehearsal-monitors', String(rehearsalMonitors))
    localStorage.setItem('scene-rehearsal-backdrop', String(rehearsalBackdrop))
    toast('Stage preview saved on this device')
  } catch {
    toast('Could not save this stage preview')
  }
}

function formatSimulationMoney(minor: number) {
  return `₦${new Intl.NumberFormat('en-NG', { maximumFractionDigits: 2 }).format(minor / 100)}`
}

function updateWalletHud() {
  const balance = document.getElementById('wallet-balance')
  const chip = document.getElementById('wallet-chip')
  if (balance) balance.textContent = cityJobState ? formatSimulationMoney(cityJobState.balanceMinor) : '…'
  if (chip) chip.setAttribute('aria-label', `${cityJobState?.currencyLabel || 'THE SCENE money (simulation)'}: ${cityJobState ? formatSimulationMoney(cityJobState.balanceMinor) : 'connecting'}`)
}

function cityJobErrorMessage(error: unknown) {
  const code = error instanceof Error ? error.message : ''
  const messages: Record<string, string> = {
    active_job: 'Finish your current shift before starting another.',
    daily_limit: 'You have used today’s three city job slots.',
    must_be_at_palm_room: 'Stay in Palm Room and try again.',
    steps_missing: 'Complete the three stage setup actions first.',
    too_early: 'The shift needs three minutes of active setup time.',
    expired: 'That shift expired. Start a new one when ready.',
    job_unavailable: 'That shift is no longer active.',
  }
  return messages[code] || 'The city job service is unavailable. Try again when connected.'
}

function updateCityJobCard() {
  updateWalletHud()
  const status = document.getElementById('city-job-status')
  if (!status) return
  const balance = document.getElementById('city-job-balance')
  const start = document.getElementById('city-job-start') as HTMLButtonElement | null
  const collect = document.getElementById('city-job-collect') as HTMLButtonElement | null
  const state = cityJobState
  if (balance) balance.textContent = state
    ? `${state.localPreview ? 'DEVICE-ONLY PREVIEW' : state.currencyLabel} · ${formatSimulationMoney(state.balanceMinor)}`
    : 'THE SCENE money (simulation) · connecting…'
  const job = state?.activeJob
  if (job) {
    const remaining = Math.max(0, Math.ceil((Date.parse(job.minimumCompleteAt) - Date.now()) / 1000))
    const minutes = Math.floor(remaining / 60), seconds = remaining % 60
    const stepsDone = job.completedSteps.length
    const progress = `${stepsDone}/3 setup actions checked · ${minutes}:${String(seconds).padStart(2, '0')} minimum shift time left`
    const recentProgressNotice = cityJobNotice.startsWith('Shift started') || cityJobNotice.startsWith('Setup checked')
    status.textContent = stepsDone === 3 && remaining === 0
      ? 'Setup complete · shift ready to collect.'
      : recentProgressNotice ? progress : cityJobNotice || progress
    if (start) start.hidden = true
    if (collect) {
      collect.hidden = stepsDone < 3 || remaining > 0
      collect.disabled = cityJobBusy
      collect.textContent = `Collect ${formatSimulationMoney(100_000)}`
    }
  } else {
    const today = state ? `${state.dailyJobsCompleted}/3 shifts today · ${formatSimulationMoney(state.dailyEarnedMinor)} earned` : cityJobNotice || 'Connecting to the city job board…'
    status.textContent = cityJobNotice || today
    if (start) {
      start.hidden = false
      start.disabled = cityJobBusy || !state || (!state.localPreview && !presenceConnected) || state.dailyJobsRemaining === 0
      start.textContent = state?.dailyJobsRemaining === 0 ? 'No more shifts today' : 'Start venue assistant shift'
    }
    if (collect) collect.hidden = true
  }
}

async function refreshCityJobState() {
  try {
    cityJobState = await fetchGuestCityJobs()
    if (!cityJobState.activeJob) cityJobNotice = ''
    else {
      if (cityJobState.activeJob.completedSteps.includes('light')) { equipmentPreviewVisible = true; palmRoom?.setEquipmentPreview(true) }
      if (cityJobState.activeJob.completedSteps.includes('monitors')) { rehearsalMonitors = true; palmRoom?.setRehearsalMonitors(true) }
      if (cityJobState.activeJob.completedSteps.includes('backdrop')) { rehearsalBackdrop = true; palmRoom?.setRehearsalBackdrop(true) }
    }
  } catch {
    cityJobState = null
    cityJobNotice = 'City jobs need a connected game session.'
  }
  updateCityJobCard()
}

async function beginVenueAssistantShift() {
  if (cityJobBusy) return
  cityJobBusy = true; cityJobNotice = ''; updateCityJobCard()
  try {
    await startGuestCityJob()
    cityJobState = await fetchGuestCityJobs()
    cityJobNotice = cityJobState.localPreview ? 'Shift started · this solo preview saves only on this device.' : 'Shift started · set up all three pieces, then stay in Palm Room for three minutes.'
  } catch (error) { cityJobNotice = cityJobErrorMessage(error) }
  finally { cityJobBusy = false; renderStageEventMetrics() }
}

async function checkVenueAssistantStep(stepId: CityJobStepId) {
  const job = cityJobState?.activeJob
  if (!job || job.completedSteps.includes(stepId) || cityJobBusy) return
  cityJobBusy = true; cityJobNotice = ''; updateCityJobCard()
  try {
    const updated = await completeGuestCityJobStep(job.id, stepId)
    cityJobState = cityJobState ? { ...cityJobState, activeJob: updated } : cityJobState
    cityJobNotice = `Setup checked · ${updated.completedSteps.length}/3 pieces placed.`
  } catch (error) { cityJobNotice = cityJobErrorMessage(error) }
  finally { cityJobBusy = false; renderStageEventMetrics() }
}

async function collectVenueAssistantPay() {
  const job = cityJobState?.activeJob
  if (!job || cityJobBusy) return
  cityJobBusy = true; cityJobNotice = ''; updateCityJobCard()
  try {
    const receipt = await finishGuestCityJob(job.id)
    cityJobState = await fetchGuestCityJobs()
    cityJobNotice = receipt.duplicate
      ? `Shift already paid · balance ${formatSimulationMoney(receipt.balanceMinor)}.`
      : `Shift complete · +${formatSimulationMoney(receipt.payoutMinor)} · balance ${formatSimulationMoney(receipt.balanceMinor)}.`
    toast(cityJobNotice)
  } catch (error) { cityJobNotice = cityJobErrorMessage(error) }
  finally { cityJobBusy = false; renderStageEventMetrics() }
}

window.setInterval(() => { if (cityJobState?.activeJob) updateCityJobCard() }, 1000)

function renderStageEventMetrics() {
  if (!showDraft) return
  const copy = document.getElementById('action-copy')
  if (!copy) return
  let ledger = document.getElementById('stage-ledger')
  if (!ledger) {
    ledger = document.createElement('div')
    ledger.id = 'stage-ledger'
    ledger.className = 'stage-ledger'
    ledger.setAttribute('aria-label', 'Palm Room rehearsal metrics')
    ledger.innerHTML = '<small>PALM ROOM · REHEARSAL</small><div><b>Other live sessions</b><span id="stage-live-sessions"></span></div><section class="city-job-card" aria-label="Venue assistant city job"><small>STARTER CITY JOB · PAID SIMULATION</small><b>Venue assistant · ₦1,000</b><p>Set the floor light, stage monitors and backdrop. Complete the 3-minute shift to earn.</p><small id="city-job-balance">THE SCENE money (simulation) · connecting…</small><p id="city-job-status" role="status" aria-live="polite">Connecting to the city job board…</p><div class="city-job-actions"><button id="city-job-start" type="button">Start venue assistant shift</button><button id="city-job-collect" type="button" hidden>Collect ₦1,000</button></div></section><div class="stage-setup-picker"><small id="stage-setup-progress">0/3 setup actions</small><div class="stage-setup-grid"><button type="button" data-stage-setup="light">Floor light</button><button type="button" data-stage-setup="monitors">Stage monitors</button><button type="button" data-stage-setup="backdrop">Backdrop</button></div><small>Use the city trial pieces for the shift; no inventory purchase is needed.</small></div><div class="stage-look-picker"><small>LIGHTING TEST · LOCAL PREVIEW</small><div class="stage-look-grid"><button type="button" data-stage-look="warm">Warm wash</button><button type="button" data-stage-look="sunset">Sunset</button><button type="button" data-stage-look="spotlight">Spot</button></div><button type="button" class="stage-save" data-stage-save="true">Save preview on this device</button></div><form id="show-draft-form" class="show-draft-form"><small>PLAN A SHOW · PRIVATE DRAFT</small><label>Show name<input name="title" maxlength="60" required placeholder="Friday at Palm Room" /></label><label>Format<select name="format"><option value="OPEN_MIC">Open mic</option><option value="LISTENING_SESSION">Listening session</option></select></label><label>Planned start<input name="start" type="datetime-local" required /></label><small id="show-draft-master"></small><button type="submit" class="stage-save">Save show draft</button><small id="show-draft-status"></small></form><form id="show-invite-form" class="show-invite-form"><small>INVITE A REAL PERFORMER</small><label>Connected guest<select name="target" required><option value="">Choose a guest in Palm Room</option></select></label><button type="submit" class="stage-save">Invite to draft lineup</button><small id="show-invite-status">Save your show draft first. Performers must accept.</small><div id="show-performer-list" aria-live="polite"></div></form>'
    ledger.hidden = location !== 'venue' || nearby !== 'stage'
    ledger.addEventListener('click', event => {
      const button = (event.target as HTMLElement).closest<HTMLButtonElement>('[data-stage-look]')
      const setupButton = (event.target as HTMLElement).closest<HTMLButtonElement>('[data-stage-setup]')
      const saveButton = (event.target as HTMLElement).closest<HTMLButtonElement>('[data-stage-save]')
      const target = event.target as HTMLElement
      if (target.closest('#city-job-start')) { void beginVenueAssistantShift(); return }
      if (target.closest('#city-job-collect')) { void collectVenueAssistantPay(); return }
      if (setupButton) {
        const step = setupButton.dataset.stageSetup as CityJobStepId
        const shift = cityJobState?.activeJob
        const complete = !!shift
        if (step === 'light') { equipmentPreviewVisible = complete ? true : !equipmentPreviewVisible; palmRoom?.setEquipmentPreview(equipmentPreviewVisible) }
        if (step === 'monitors') { rehearsalMonitors = complete ? true : !rehearsalMonitors; palmRoom?.setRehearsalMonitors(rehearsalMonitors) }
        if (step === 'backdrop') { rehearsalBackdrop = complete ? true : !rehearsalBackdrop; palmRoom?.setRehearsalBackdrop(rehearsalBackdrop) }
        if (complete) void checkVenueAssistantStep(step)
        renderStageEventMetrics()
        return
      }
      if (saveButton) { saveStageTemplate(); return }
      const selected = button?.dataset.stageLook
      if (selected !== 'warm' && selected !== 'sunset' && selected !== 'spotlight') return
      stageLook = selected
      palmRoom?.setStageLook(stageLook)
      const stageLedger = event.currentTarget as HTMLElement
      stageLedger.querySelectorAll<HTMLButtonElement>('[data-stage-look]').forEach(item => item.setAttribute('aria-pressed', String(item.dataset.stageLook === stageLook)))
      toast(`${button!.textContent} · local lighting preview`)
    })
    const showForm = ledger.querySelector<HTMLFormElement>('#show-draft-form')!
    showForm.elements.namedItem('title') && ((showForm.elements.namedItem('title') as HTMLInputElement).value = showDraft.title)
    ;(showForm.elements.namedItem('format') as HTMLSelectElement).value = showDraft.format
    ;(showForm.elements.namedItem('start') as HTMLInputElement).value = showDraft.start
    showForm.addEventListener('submit', event => {
      event.preventDefault()
      const form = event.currentTarget as HTMLFormElement
      const title = (form.elements.namedItem('title') as HTMLInputElement).value.trim()
      const format = (form.elements.namedItem('format') as HTMLSelectElement).value
      const start = (form.elements.namedItem('start') as HTMLInputElement).value
      if (!title || (format !== 'OPEN_MIC' && format !== 'LISTENING_SESSION') || !start) return
      showDraft = { title: title.slice(0, 60), format, start }
      try { localStorage.setItem('scene-show-draft', JSON.stringify(showDraft)); localStorage.setItem('scene-show-draft-pending', 'true') } catch { toast('Device storage unavailable'); return }
      showDraftSynced = false
      void syncShowDraft().catch(() => { toast('Draft saved on this device; server sync unavailable') })
      renderStageEventMetrics()
      toast('Private show draft saved')
    })
    const inviteForm = ledger.querySelector<HTMLFormElement>('#show-invite-form')!
    inviteForm.addEventListener('submit', event => {
      event.preventDefault()
      const form = event.currentTarget as HTMLFormElement
      const select = form.elements.namedItem('target') as HTMLSelectElement
      const button = form.querySelector<HTMLButtonElement>('button[type="submit"]')!
      button.disabled = true
      void inviteGuestEventPerformer(select.value).then(async () => {
        await syncShowDraft()
        toast('Performer invitation sent · acceptance required')
      }).catch(error => {
        const status = document.getElementById('show-invite-status')
        if (status) status.textContent = error instanceof Error ? error.message : 'Could not invite this performer'
      }).finally(() => { button.disabled = false; renderStageEventMetrics() })
    })
    copy.insertAdjacentElement('afterend', ledger)
  }
  ledger.querySelectorAll<HTMLButtonElement>('[data-stage-look]').forEach(item => item.setAttribute('aria-pressed', String(item.dataset.stageLook === stageLook)))
  const setupState: Record<string, boolean> = { light: equipmentPreviewVisible, monitors: rehearsalMonitors, backdrop: rehearsalBackdrop }
  ledger.querySelectorAll<HTMLButtonElement>('[data-stage-setup]').forEach(item => item.setAttribute('aria-pressed', String(setupState[item.dataset.stageSetup || ''])))
  const setupProgress = document.getElementById('stage-setup-progress')
  if (setupProgress) setupProgress.textContent = cityJobState?.activeJob
    ? `${cityJobState.activeJob.completedSteps.length}/3 setup actions checked`
    : `${Number(equipmentPreviewVisible) + Number(rehearsalMonitors) + Number(rehearsalBackdrop)}/3 preview pieces placed`
  updateCityJobCard()
  const masterStatus = document.getElementById('show-draft-master')
  if (masterStatus) masterStatus.textContent = masterBlob ? 'Your City Studio master is ready for a local stage audition.' : 'Render a master at City Studio to audition it here.'
  const showStatus = document.getElementById('show-draft-status')
  if (showStatus) showStatus.textContent = showDraft.title ? `Saved privately${showDraftSynced ? ' to your guest session' : ' on this device'}: ${showDraft.title}. No venue booking or public event exists.` : 'This plan does not reserve the venue.'
  const inviteSelect = document.querySelector<HTMLSelectElement>('#show-invite-form [name="target"]')
  if (inviteSelect && document.activeElement !== inviteSelect) {
    const selected = inviteSelect.value
    const alreadyInvited = new Set(showPerformers.map(performer => performer.guestId))
    const candidates = connectedPlayers.filter(player => player.authenticated && player.location === 'venue' && !blockedIds.has(player.id) && !alreadyInvited.has(player.id))
    inviteSelect.innerHTML = '<option value="">Choose a guest in Palm Room</option>' + candidates.map(player => `<option value="${escapeHtml(player.id)}">${escapeHtml(player.name?.trim() || `Guest · ${player.id.slice(0, 6)}`)}</option>`).join('')
    if (candidates.some(player => player.id === selected)) inviteSelect.value = selected
  }
  const inviteButton = document.querySelector<HTMLButtonElement>('#show-invite-form button[type="submit"]')
  if (inviteButton) inviteButton.disabled = !showDraftSynced || !inviteSelect?.value || showPerformers.filter(performer => performer.status !== 'declined').length >= 5
  const inviteStatus = document.getElementById('show-invite-status')
  if (inviteStatus) inviteStatus.textContent = !showDraftSynced
    ? 'Save your show draft first. Performers must accept.'
    : showPerformers.filter(performer => performer.status !== 'declined').length >= 5
      ? 'This draft has five invited performers.'
      : !connectedPlayers.some(player => player.authenticated && player.location === 'venue' && !blockedIds.has(player.id) && !showPerformers.some(performer => performer.guestId === player.id))
        ? 'Invite a connected guest who is in Palm Room. They must accept to join this draft.'
        : 'Only real connected guests in Palm Room can be invited. Acceptance joins the draft lineup; event terms and rights remain to be agreed.'
  const performerList = document.getElementById('show-performer-list')
  if (performerList) performerList.innerHTML = showPerformers.length
    ? showPerformers.map(performer => {
      const player = connectedPlayers.find(item => item.id === performer.guestId)
      const name = player?.name?.trim() || `Guest · ${performer.guestId.slice(0, 6)}`
      const status = performer.status === 'accepted' ? 'Accepted · draft lineup' : performer.status === 'declined' ? 'Declined' : 'Waiting for reply'
      return `<div class="show-performer"><b>${escapeHtml(name)}</b><small>${status}</small></div>`
    }).join('')
    : '<small>No performer invitations yet.</small>'
  const count = new Set(connectedPlayers.filter(player => player.location === 'venue').map(player => player.id)).size
  const live = document.getElementById('stage-live-sessions')
  if (live) live.textContent = rehearsalMetrics(presenceConnected, count).liveSessions
}

function interact() {
  const stageLedger = document.getElementById('stage-ledger')
  if (stageLedger) stageLedger.hidden = location !== 'venue' || nearby !== 'stage'
  if (location === 'venue' && nearby === 'stage' && cityJobState === null && (SOLO_PREVIEW || guestSessionReady)) void refreshCityJobState()
  renderStageEventMetrics()
  if (!nearby) return
  if (routeTarget === nearby) {
    routeTarget = null
    routeMarker.visible = false
    $<HTMLElement>('route').hidden = true
    clearWalkTarget()
  }
  if (nearby === 'cityConcierge') openAction(
    'City Concierge',
    'Welcome to Music Square. Walk with the touch pad or WASD, then use Map to choose a place. City Studio has a free beat desk; the Listening station has original previews. No purchase is needed.',
    'Find free music spots',
    openMap,
  )
  if (nearby === 'kiosk') {
    const track = catalogue[currentTrackIndex] || catalogue[0]
    const isSaved = savedTrackIds.has(track.id)
    openAction(
      `${track.title} · ${track.artist}`,
      `Original ${track.genre} discovery preview. Choose Play to hear this recording; saves stay private on this device and sync to your guest profile.`,
      playing ? 'Pause preview' : 'Play preview',
      () => { playing ? stopPreview() : startPreview(); interact() },
      {
        label: isSaved ? 'Saved ♥' : 'Save privately',
        action: () => { void toggleSaveCurrentTrack().then(() => interact()) }
      }
    )
  }
  if (nearby === 'studio') openAction('City Studio', 'Enter the free studio and walk to the producer desk. The local beat demo uses original synthesized sounds.', 'Enter studio', enterStudio)
  if (nearby === 'studioDesk') openBeat()
  if (nearby === 'studioExit') openAction('Exit City Studio', 'Walk back to Music Square. Your local beat draft stays on this device.', 'Return to square', leaveStudio)
  if (nearby === 'releaseEntrance') openAction('Release House', 'Enter the record intake and artwork room. Public release is unavailable until a finished rights-cleared master and server review exist.', 'Enter Release House', enterReleaseHouse)
  if (nearby === 'releaseIntake') openReleaseDraft('intake')
  if (nearby === 'releaseArtwork') openReleaseDraft('artwork')
  if (nearby === 'releaseMetadata') openReleaseDraft('metadata')
  if (nearby === 'releaseListening') openReleaseDraft('listening')
  if (nearby === 'releaseRights') openReleaseDraft('rights')
  if (nearby === 'releaseCalendar') openReleaseDraft('calendar')
  if (nearby === 'releaseExit') openAction('Exit Release House', 'Walk back to Music Square. Your private sleeve draft remains on this device.', 'Return to square', leaveReleaseHouse)
  if (nearby === 'palmEntrance') openAction('Palm Room', 'Go through the door to inspect a small walkable music venue. No lease or purchase occurs.', 'Enter venue', enterVenue)
  if (nearby === 'stage') {
    if (masterBlob) {
      openAction(
        performingOnStage ? 'Stage rehearsal · Playing' : 'Palm Room Stage',
        performingOnStage
          ? 'Your City Studio master is playing locally while the stage lights are active.'
          : 'Rehearse with your private City Studio master. Cue the lights live, then replay the saved sequence here. Audio plays only on your device.',
        performingOnStage ? 'Stop rehearsal' : stageCues.length ? 'Replay saved show' : 'Rehearse light cues',
        () => {
          if (performingOnStage) {
            stopMasterPreview()
            toast('Rehearsal ended')
          } else {
            startStageRehearsal(stageCues.length ? 'replay' : 'record')
          }
          refreshContext()
          if (!performingOnStage) interact()
        },
        !performingOnStage && stageCues.length ? { label: 'Record new cues', action: () => startStageRehearsal('record') } : undefined,
        performingOnStage
      )
    } else {
      openAction(
        'Stage rehearsal setup',
        'Place the trial stage pieces below, choose a lighting look, then save this room setup on your device. Render a master at City Studio to audition it here.',
        'Save room setup',
        () => {
          saveStageTemplate()
        }
      )
    }
  }
  if (nearby === 'venueExit') openAction('Exit Palm Room', 'Walk back out to Music Square. Your local stage preview state stays available for this session.', 'Return to square', leaveVenue)
}

function refreshContext() {
  const context = $<HTMLElement>('context')
  context.hidden = !nearby || sheet !== 'none' || !$<HTMLElement>('venue-card').hidden
  if (!nearby) return
  const names: Record<Hotspot, [string, string]> = {
    kiosk: ['LISTEN HERE', 'Choose a preview and save it'],
    cityConcierge: ['CITY CONCIERGE', 'Meet your guide · find free music spots'],
    studio: ['CITY STUDIO', 'Enter the free beat room'],
    studioDesk: ['BEAT DESK', 'Tap pads and make a private beat'],
    studioExit: ['MUSIC SQUARE', 'Leave City Studio'],
    releaseEntrance: ['RELEASE HOUSE', 'Enter the record intake'],
    releaseIntake: ['RECORD INTAKE', 'Prepare a private release sleeve'],
    releaseArtwork: ['ARTWORK FRAME', 'Choose the release sleeve art'],
    releaseMetadata: ['TITLE SLEEVE', 'Set the song title and credits'],
    releaseListening: ['LISTENING BOOTH', 'Audition the saved local master'],
    releaseRights: ['RIGHTS CONSOLE', 'Review rights and contributor declarations'],
    releaseCalendar: ['RELEASE CALENDAR', 'Check local preflight and Friday timing'],
    releaseExit: ['MUSIC SQUARE', 'Leave Release House'],
    palmEntrance: ['PALM ROOM', 'Enter the music venue'],
    stage: [
      performingOnStage ? 'STAGE PREVIEW PLAYING' : masterBlob ? 'PREVIEW ON STAGE' : 'STAGE PREVIEW',
      performingOnStage ? 'Stop local preview' : masterBlob ? 'Play your City Studio master locally' : 'Arrange a local rehearsal setup',
    ],
    venueExit: ['MUSIC SQUARE', 'Leave the venue'],
  }
  $<HTMLElement>('context-name').textContent = names[nearby][0]
  $<HTMLElement>('context-help').textContent = names[nearby][1]
  $<HTMLElement>('context-icon').textContent = performingOnStage ? '♫' : nearby === 'kiosk' ? '♫' : nearby === 'stage' ? '☼' : '↗'
}

function renderDesk() {
  const cards = $<HTMLDivElement>('desk-cards')
  const intro = $<HTMLElement>('desk-intro')
  intro.textContent = location === 'venue' ? (masterBlob ? 'Step up to the stage and preview your master.' : 'Inspect the space before making any commitment.') : location === 'studio' ? 'Make a private beat at the producer desk.' : location === 'release' ? 'Walk between the six release preparation stations.' : 'Your music journey, one step at a time.'
  if (deskTab === 'today') {
    const journey = nextMusicJourneyStep({ beatSaved: beatDraftSaved, masterRendered: !!masterBlob, releaseDraftSaved, releaseAuditionPlayed, stagePreviewPlayed }, location)
    const progressPercent = Math.round(journey.completed / journey.total * 100)
    const journeyCard = journey.current
      ? `<article class="journey-card"><div class="card-icon">${String(journey.completed + 1).padStart(2, '0')}</div><div class="journey-copy"><small class="journey-kicker">FIRST TRACK · STEP ${journey.completed + 1} OF ${journey.total}</small><b>${journey.current.title}</b><p>${journey.current.instruction}</p><span class="journey-track" aria-label="${journey.completed} of ${journey.total} steps complete"><i style="width:${progressPercent}%"></i></span></div><button data-route="${journey.current.route}">Take me there ↗</button></article>`
      : `<article class="journey-card"><div class="card-icon">✓</div><div class="journey-copy"><small class="journey-kicker">PRIVATE MUSIC PATH</small><b>Your first track path is ready</b><p>Your beat, master, sleeve and stage preview stay on this device.</p><span class="journey-track" aria-label="All ${journey.total} steps complete"><i style="width:100%"></i></span></div><button data-route="studio">Make another beat ↗</button></article>`
    const releaseCurrent = releaseStation(activeReleaseStation)
    const releaseNextId = nextReleaseStation(activeReleaseStation)
    cards.innerHTML = location === 'release'
      ? `<article><div class="card-icon">▣</div><div><b>${releaseCurrent.title}</b><p>${releaseCurrent.instruction}</p></div><button data-route="${releaseCurrent.hotspot}">Take me there ↗</button></article>${releaseNextId ? `<article><div class="card-icon">→</div><div><b>Next station · ${releaseStation(releaseNextId).title}</b><p>Follow the marker on foot. The route does not skip the room.</p></div><button data-route="${releaseStation(releaseNextId).hotspot}">Walk there ↗</button></article>` : ''}<article><div class="card-icon">⌂</div><div><b>Return to the square</b><p>Walk to the exit when finished.</p></div><button data-route="releaseExit">Show exit ↗</button></article>`
      : location === 'studio'
      ? journeyCard
      : location === 'venue'
      ? `${journeyCard}${journey.current?.id === 'preview-on-stage' ? '' : `<article><div class="card-icon">☼</div><div><b>Inspect the stage</b><p>Try a local floor-light preview.</p></div><button data-route="stage">Take me there ↗</button></article>`}<article><div class="card-icon">⌂</div><div><b>Return to Music Square</b><p>Walk to the exit when ready.</p></div><button data-route="venueExit">Show exit ↗</button></article>`
      : `${journeyCard}<article><div class="card-icon">♫</div><div><b>Find a sound</b><p>${savedPreview ? 'Your preview is saved. Visit the station again anytime.' : 'Discover an original preview at the listening station.'}</p></div><button data-route="kiosk">Take me there ↗</button></article><article><div class="card-icon">♛</div><div><b>Explore Palm Room</b><p>Walk the venue and inspect the stage.</p></div><button data-route="palmEntrance">Show route ↗</button></article>`
  } else if (deskTab === 'ask') {
    const answer = deskAskQuery ? resolveDeskQuestion(deskAskQuery, location) : null
    const answerMarkup = answer?.kind === 'action' && answer.route
      ? `<div class="ask-answer" role="status"><b>${answer.title}</b><p>${answer.message}</p><button data-route="${answer.route}">${answer.label} ↗</button></div>`
      : answer
        ? `<div class="ask-answer" role="status"><b>${answer.title}</b><p>${answer.message}</p></div>`
        : ''
    cards.innerHTML = `<div class="ask-panel"><b>Ask Desk Bot</b><p>Ask about a known activity. Answers come from the local guide and routes stay physical.</p><form id="desk-question-form" class="ask-question"><label for="desk-question">What do you want to do?</label><div class="ask-input-row"><input id="desk-question" type="search" placeholder="e.g. How do I make a beat?" autocomplete="off" /><button type="submit">Ask</button></div></form>${answerMarkup}<div class="ask-quick-actions" aria-label="Suggested questions"><button type="button" data-ask-query="make a beat">Make a beat</button><button type="button" data-ask-query="prepare a release">Prepare a release</button><button type="button" data-ask-query="listen to music">Listen to music</button><button type="button" data-ask-query="visit Palm Room">Visit Palm Room</button></div></div>`
  } else {
    const showTitle = showDraft.title.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;')
    const performerSummary = showPerformers.map(performer => {
      const player = connectedPlayers.find(item => item.id === performer.guestId)
      const name = escapeHtml(player?.name?.trim() || `Guest · ${performer.guestId.slice(0, 6)}`)
      const status = performer.status === 'accepted' ? 'Accepted · draft lineup' : performer.status === 'declined' ? 'Declined' : 'Waiting for reply'
      return `<small class="plan-performer"><b>${name}</b> · ${status}</small>`
    }).join('')
    const showPlan = showDraft.title
      ? `<article><div class="card-icon">♛</div><div><b>${showTitle}</b><p>Private ${showDraft.format === 'OPEN_MIC' ? 'open mic' : 'listening session'} plan at Palm Room · ${showDraft.start.replace('T', ' ')}. No booking or public event yet.</p>${performerSummary}</div><button data-show-route="true">Go to stage ↗</button></article>`
      : `<article><div class="card-icon">♛</div><div><b>Plan a show</b><p>Visit the Palm Room stage to draft an open mic or listening session.</p></div><button data-show-route="true">Go to stage ↗</button></article>`
    const incomingInvitations = showInvitations.length
      ? showInvitations.map(invitation => {
        const inviter = connectedPlayers.find(player => player.id === invitation.organiserGuestId)
        const inviterName = escapeHtml(inviter?.name?.trim() || `Guest · ${invitation.organiserGuestId.slice(0, 6)}`)
        const title = escapeHtml(invitation.title)
        const format = invitation.format === 'OPEN_MIC' ? 'open mic' : 'listening session'
        const actions = invitation.status === 'invited'
          ? `<div class="event-invitation-actions"><button type="button" data-event-response="accept" data-invitation-id="${escapeHtml(invitation.invitationId)}">Join draft lineup</button><button type="button" data-event-response="decline" data-invitation-id="${escapeHtml(invitation.invitationId)}">Decline</button></div>`
          : `<small class="plan-performer">${invitation.status === 'accepted' ? 'You accepted · draft lineup' : 'You declined'}</small>`
        return `<article><div class="card-icon">♫</div><div><b>${title}</b><p>${inviterName} invited you to a ${format} draft at Palm Room · ${invitation.start.replace('T', ' ')}. Joining the draft is not a booking or music-rights approval.</p>${actions}</div><button data-show-route="true">Go to Palm Room ↗</button></article>`
      }).join('')
      : ''
    cards.innerHTML = `<div class="ask-panel"><b>Your local session</b><p>${savedPreview ? '♫ Tone preview saved for this session.' : 'No tone preview saved yet.'}</p><p>${beatDraftSaved ? '♫ A private beat pattern is saved on this device.' : 'No beat pattern saved yet.'}</p><p>${masterBlob ? '♫ 30-second master rendered and ready.' : 'No audio master rendered yet.'}</p><p>${releaseDraft.title ? '▣ Private sleeve: ' + releaseDraft.title.replaceAll('&', '&amp;').replaceAll('<', '&lt;') : 'No release sleeve saved yet.'}</p><p>${equipmentPreviewVisible ? '☼ Temporary floor-light preview is visible.' : 'No stage preview is shown.'}</p><p>${routeTarget ? '↗ A walking route is active.' : 'No walking route selected.'}</p></div>${showPlan}${incomingInvitations}`
  }
  cards.querySelectorAll<HTMLButtonElement>('[data-route]').forEach(button => button.addEventListener('click', () => setRoute(button.dataset.route as Hotspot)))
  cards.querySelectorAll<HTMLButtonElement>('[data-show-route]').forEach(button => button.addEventListener('click', () => location === 'venue' ? setRoute('stage') : mapRoute('palmEntrance')))
  cards.querySelectorAll<HTMLButtonElement>('[data-event-response]').forEach(button => button.addEventListener('click', () => {
    const invitationId = button.dataset.invitationId
    const decision = button.dataset.eventResponse
    if (!invitationId || (decision !== 'accept' && decision !== 'decline')) return
    button.disabled = true
    void respondGuestEventInvitation(invitationId, decision).then(async () => {
      await syncShowDraft()
      toast(decision === 'accept' ? 'Joined the draft lineup · terms still need agreement' : 'Performer invitation declined')
    }).catch(() => { button.disabled = false; toast('Could not update this performer invitation') })
  }))
  cards.querySelectorAll<HTMLButtonElement>('[data-close]').forEach(button => button.addEventListener('click', closeSheets))
  if (deskTab === 'ask') {
    const question = cards.querySelector<HTMLInputElement>('#desk-question')!
    question.value = deskAskQuery
    cards.querySelector<HTMLFormElement>('#desk-question-form')!.addEventListener('submit', event => {
      event.preventDefault()
      deskAskQuery = question.value
      renderDesk()
      cards.querySelector<HTMLInputElement>('#desk-question')?.focus()
    })
    cards.querySelectorAll<HTMLButtonElement>('[data-ask-query]').forEach(button => button.addEventListener('click', () => {
      deskAskQuery = button.dataset.askQuery || ''
      renderDesk()
    }))
  }
}

function openDesk(tab: 'today' | 'ask' | 'plans' = 'today') {
  closeSheets()
  deskTab = tab
  $<HTMLElement>('desk-sheet').hidden = false
  $<HTMLElement>('venue-card').hidden = true
  sheet = 'desk'
  document.querySelectorAll<HTMLButtonElement>('.desk-tabs button').forEach(button => { const active = button.dataset.tab === deskTab; button.classList.toggle('active', active); button.setAttribute('aria-selected', String(active)) })
  renderDesk()
  if (tab === 'plans' && guestSessionReady) void syncShowDraft().catch(() => {})
  refreshContext()
}

window.setInterval(() => {
  if (SOLO_PREVIEW || !guestSessionReady) return
  if ((sheet === 'desk' && deskTab === 'plans') || (sheet === 'action' && nearby === 'stage')) void syncShowDraft().catch(() => {})
}, 5000)

function openMap() {
  closeSheets()
  $<HTMLElement>('venue-card').hidden = true
  renderMap()
  $<HTMLElement>('map-sheet').hidden = false
  sheet = 'action'
  refreshContext()
}

$<HTMLButtonElement>('audio').onclick = () => {
  if (playing) { stopPreview(); return }
  if (masterPlayer) {
    const privateAudition = !performingOnStage
    stopMasterPreview()
    if (privateAudition) $<HTMLElement>('release-status').textContent = 'Private audition stopped. Not submitted, scheduled, or counted as a public listen.'
    return
  }
  toast('Choose Play at a listening station or music desk')
}
$<HTMLButtonElement>('mini-play').onclick = () => playing ? stopPreview() : startPreview()
$<HTMLButtonElement>('mini-save').onclick = () => void toggleSaveCurrentTrack()
$<HTMLButtonElement>('mini-prev').onclick = () => {
  const nextIdx = (currentTrackIndex - 1 + catalogue.length) % catalogue.length
  if (playing) startPreview(nextIdx)
  else { currentTrackIndex = nextIdx; renderMiniPlayer() }
}
$<HTMLButtonElement>('mini-next').onclick = () => {
  const nextIdx = (currentTrackIndex + 1) % catalogue.length
  if (playing) startPreview(nextIdx)
  else { currentTrackIndex = nextIdx; renderMiniPlayer() }
}
renderMiniPlayer()
$<HTMLButtonElement>('dance').onclick = () => {
  dancing = !dancing
  $<HTMLButtonElement>('dance').setAttribute('aria-pressed', String(dancing))
  $<HTMLButtonElement>('dance').textContent = dancing ? '■ Stop dancing' : '♪ Dance'
  if (dancing) { clearWalkTarget(); toast('Your avatar is dancing') }
}
document.querySelectorAll<HTMLButtonElement>('[data-emote]').forEach(button => {
  button.onclick = () => {
    const emote = button.dataset.emote as EmoteType
    if (!emote) return
    presence.sendEmote(emote)
    triggerAvatarEmote(avatar, emote, 'self')
    toast(`Reacted with ${emote === 'cheer' ? 'cheer 🙌' : emote === 'wave' ? 'wave 👋' : emote === 'heart' ? 'love ❤️' : 'fire 🔥'}`)
  }
})
$<HTMLButtonElement>('chat-toggle').onclick = () => {
  const menu = $<HTMLElement>('chat-menu')
  menu.hidden = !menu.hidden
}
$<HTMLButtonElement>('emote-toggle').onclick = () => {
  const actions = $<HTMLElement>('emote-actions')
  actions.hidden = !actions.hidden
  $<HTMLButtonElement>('emote-toggle').setAttribute('aria-expanded', String(!actions.hidden))
}
$<HTMLButtonElement>('chat-channel-toggle').onclick = () => {
  roomChatOptedIn = !roomChatOptedIn
  presence.setChatOptIn(roomChatOptedIn)
  const toggle = $<HTMLButtonElement>('chat-channel-toggle')
  toggle.setAttribute('aria-pressed', String(roomChatOptedIn))
  toggle.textContent = roomChatOptedIn ? 'Mute local chat' : 'Enable local chat'
  $<HTMLElement>('chat-channel-copy').textContent = roomChatOptedIn
    ? 'Local chat is on for this place. Turn it off at any time.'
    : 'Local chat is off. Enable it to receive and send phrases in this place.'
  document.querySelectorAll<HTMLButtonElement>('.chat-phrases [data-phrase]').forEach(button => { button.disabled = !roomChatOptedIn })
  if (!roomChatOptedIn) {
    $<HTMLElement>('chat-feed').replaceChildren()
    for (const speech of speechBubbles.values()) speech.visible = false
  }
  toast(roomChatOptedIn ? 'Local chat enabled for this place' : 'Local chat muted on this device')
}
document.querySelectorAll<HTMLButtonElement>('.chat-phrases button').forEach(button => {
  button.onclick = () => {
    const phrase = button.dataset.phrase
    if (phrase && roomChatOptedIn) {
      presence.sendChat(phrase)
      $<HTMLElement>('chat-menu').hidden = true
    }
  }
})
$<HTMLButtonElement>('desk-trigger').onclick = () => openDesk()
$<HTMLButtonElement>('desk-close').onclick = closeSheets
$<HTMLButtonElement>('action-close').onclick = closeSheets
$<HTMLButtonElement>('interact').onclick = interact
$<HTMLButtonElement>('map-button').onclick = openMap
$<HTMLButtonElement>('nav-map').onclick = openMap
$<HTMLButtonElement>('map-close').onclick = closeSheets
$<HTMLButtonElement>('nav-phone').onclick = () => { void openMusicCollection() }
$<HTMLButtonElement>('music-close').onclick = closeSheets
$<HTMLButtonElement>('music-device-settings').onclick = () => { closeSheets(); $<HTMLElement>('display-sheet').hidden = false; sheet = 'action'; updateMetrics() }
$<HTMLElement>('music-sheet').addEventListener('submit', async event => {
  const form = event.target
  if (!(form instanceof HTMLFormElement)) return
  event.preventDefault()
  if (form.id === 'playlist-create-form') {
    const input = form.elements.namedItem('name') as HTMLInputElement
    if (await commitMusicChange(createGuestPlaylist(input.value), 'Playlist saved privately. You can add released songs below.')) input.value = ''
    return
  }
  const playlistId = form.dataset.playlistRename || form.dataset.playlistAdd
  if (!playlistId) return
  if (form.dataset.playlistRename) {
    const input = form.elements.namedItem('name') as HTMLInputElement
    await commitMusicChange(renameGuestPlaylist(playlistId, input.value), 'Playlist name saved.')
    return
  }
  const trackId = (form.elements.namedItem('trackId') as HTMLSelectElement).value
  if (!trackId) { setMusicStatus('Choose a released song first.'); return }
  await commitMusicChange(addGuestPlaylistTrack(playlistId, trackId), 'Released song added to your private playlist.')
})
$<HTMLElement>('music-sheet').addEventListener('click', async event => {
  const target = event.target
  if (!(target instanceof HTMLElement)) return
  const button = target.closest<HTMLButtonElement>('[data-music-action]')
  if (!button) return
  const action = button.dataset.musicAction
  const playlistId = button.dataset.playlistId || ''
  if (action === 'unsave') {
    const trackId = button.dataset.trackId || ''
    const track = catalogue.find(item => item.id === trackId)
    savedTrackIds.delete(trackId)
    try { localStorage.setItem('scene-saved-tracks', JSON.stringify([...savedTrackIds])) } catch { /* private local save may be unavailable */ }
    renderMiniPlayer(); renderMusicCollection()
    try { await removeGuestSave(trackId); setMusicStatus(track ? `${track.title} removed from saved songs.` : 'Saved song removed.') }
    catch { setMusicStatus('Removed on this device; server sync is unavailable.') }
    return
  }
  if (action === 'edit-playlist') {
    editingPlaylistId = editingPlaylistId === playlistId ? null : playlistId
    renderMusicCollection()
    return
  }
  if (action === 'delete-playlist') {
    await commitMusicChange(deleteGuestPlaylist(playlistId), 'Playlist deleted.')
    return
  }
  if (action === 'playlist-up' || action === 'playlist-down') {
    const ordered = [...musicPlaylists].sort((a, b) => a.position - b.position)
    const index = ordered.findIndex(item => item.id === playlistId)
    const destination = index + (action === 'playlist-up' ? -1 : 1)
    if (index < 0 || destination < 0 || destination >= ordered.length) return
    const [moved] = ordered.splice(index, 1); ordered.splice(destination, 0, moved)
    await commitMusicChange(reorderGuestPlaylists(ordered.map(item => item.id)), 'Playlist order saved privately.')
    return
  }
  const playlist = musicPlaylists.find(item => item.id === playlistId)
  if (!playlist) return
  if (action === 'remove-track') {
    await commitMusicChange(removeGuestPlaylistTrack(playlistId, button.dataset.trackId || ''), 'Song removed from your private playlist.')
    return
  }
  if (action === 'track-up' || action === 'track-down') {
    const index = Number(button.dataset.trackIndex)
    const destination = index + (action === 'track-up' ? -1 : 1)
    if (!Number.isInteger(index) || destination < 0 || destination >= playlist.tracks.length) return
    const ids = playlist.tracks.map(track => track.id)
    ;[ids[index], ids[destination]] = [ids[destination], ids[index]]
    await commitMusicChange(reorderGuestPlaylistTracks(playlistId, ids), 'Song order saved privately.')
  }
})
$<HTMLButtonElement>('beat-close').onclick = closeSheets
$<HTMLButtonElement>('beat-play').onclick = toggleBeat
document.querySelectorAll<HTMLButtonElement>('[data-section]').forEach(button => button.onclick = () => { beatSection = button.dataset.section as 'a' | 'b'; drawBeat() })
document.querySelectorAll<HTMLButtonElement>('[data-kit]').forEach(button => button.onclick = () => {
  const kit = button.dataset.kit as SoundKit
  if (kit && SOUND_KITS[kit]) {
    beatKit = kit
    beatBpm = SOUND_KITS[kit].defaultBpm
    if (beatPlaying) { stopBeat(); toggleBeat() }
    drawBeat()
    toast(`Kit: ${SOUND_KITS[kit].name} · ${beatBpm} BPM`)
  }
})
const tempoSlider = $<HTMLInputElement>('beat-tempo')
if (tempoSlider) {
  tempoSlider.oninput = () => {
    beatBpm = clampBpm(Number(tempoSlider.value))
    const display = $<HTMLElement>('tempo-display')
    if (display) display.textContent = String(beatBpm)
    if (beatPlaying) { stopBeat(); toggleBeat() }
  }
}
$<HTMLButtonElement>('beat-clear').onclick = () => {
  if (beatSection === 'a') beatPattern = clearPattern()
  else beatPatternB = clearPattern()
  drawBeat()
  toast(`Cleared Section ${beatSection.toUpperCase()}`)
}
$<HTMLButtonElement>('beat-save').onclick = () => {
  localStorage.setItem('scene-beat-arrangement', JSON.stringify({ a: beatPattern, b: beatPatternB, kit: beatKit, bpm: beatBpm }))
  beatDraftSaved = true
  $<HTMLElement>('beat-status').textContent = `Saved ${SOUND_KITS[beatKit].name} arrangement (${beatBpm} BPM) on this device.`
  toast('Local beat pattern saved')
}
$<HTMLButtonElement>('beat-render').onclick = async () => {
  if (!sectionsDiffer(beatPattern, beatPatternB)) { $<HTMLElement>('beat-status').textContent = 'Change Section B so the arrangement has two distinct sections.'; return }
  $<HTMLElement>('beat-status').textContent = 'Rendering your 30-second master…'
  try {
    const { renderMasterWav } = await import('./renderMaster.ts')
    const wav = renderMasterWav(beatPattern, beatPatternB, beatKit, beatBpm)
    const blob = new Blob([wav.buffer as ArrayBuffer], { type: 'audio/wav' })
    await saveLocalMaster(blob)
    masterBlob = blob
    localStorage.setItem('scene-beat-arrangement', JSON.stringify({ a: beatPattern, b: beatPatternB, kit: beatKit, bpm: beatBpm }))
    beatDraftSaved = true
    $<HTMLElement>('beat-status').textContent = `30-second ${SOUND_KITS[beatKit].name} master saved (${beatBpm} BPM). Visit Release House.`
    toast('Private master ready · visit Release House')
  } catch { $<HTMLElement>('beat-status').textContent = 'Could not save the master on this device. Try again.' }
}
$<HTMLButtonElement>('release-close').onclick = closeSheets
$<HTMLButtonElement>('release-save').onclick = () => {
  localStorage.setItem('scene-release-draft', JSON.stringify(releaseDraft))
  releaseDraftSaved = !!releaseDraft.title.trim()
  $<HTMLElement>('release-status').textContent = 'Private sleeve saved on this device. Not submitted or scheduled.'
  toast('Private sleeve draft saved')
}
$<HTMLButtonElement>('release-export-sleeve').onclick = () => {
  const svgUrl = URL.createObjectURL(new Blob([createReleaseSleeveSvg(releaseDraft)], { type: 'image/svg+xml;charset=utf-8' }))
  const image = new Image()
  image.onload = () => {
    const canvas = document.createElement('canvas')
    canvas.width = canvas.height = 1200
    const context = canvas.getContext('2d')
    context?.drawImage(image, 0, 0, 1200, 1200)
    URL.revokeObjectURL(svgUrl)
    canvas.toBlob(blob => {
      if (!blob) { toast('Could not export sleeve artwork'); return }
      const link = document.createElement('a')
      const slug = (releaseDraft.title || 'private-sleeve').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'private-sleeve'
      link.href = URL.createObjectURL(blob)
      link.download = `${slug}-sleeve.png`
      link.click()
      setTimeout(() => URL.revokeObjectURL(link.href), 1000)
      $<HTMLElement>('release-status').textContent = 'Sleeve PNG downloaded to this device. Nothing was uploaded or submitted.'
    }, 'image/png')
  }
  image.onerror = () => { URL.revokeObjectURL(svgUrl); toast('Could not render sleeve artwork on this device') }
  image.src = svgUrl
}
$<HTMLButtonElement>('release-export-master').onclick = () => {
  if (!masterBlob) return
  const link = document.createElement('a')
  link.href = URL.createObjectURL(masterBlob)
  link.download = `${(releaseDraft.title || 'private-master').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'private-master'}.wav`
  link.click()
  setTimeout(() => URL.revokeObjectURL(link.href), 1000)
  $<HTMLElement>('release-status').textContent = 'Private WAV downloaded to this device. Nothing was uploaded or submitted.'
}
$<HTMLButtonElement>('release-preflight').onclick = () => {
  if (canPreflight(releaseDraft, !!masterBlob)) {
    releaseDraft.status = 'PREFLIGHT_READY'
    localStorage.setItem('scene-release-draft', JSON.stringify(releaseDraft))
    $<HTMLElement>('release-status').textContent = 'Local checks passed. Server upload, rights review, date reservation and publication are unavailable; nothing was submitted.'
    toast('Local preflight passed · not submitted')
  } else {
    toast('Complete all checklist requirements first')
  }
}
$<HTMLButtonElement>('release-play').onclick = () => {
  if (!masterBlob) return
  stopMasterPreview()
  masterAudioUrl = URL.createObjectURL(masterBlob)
  masterPlayer = new Audio(masterAudioUrl)
  masterPlayer.onended = () => {
    stopMasterPreview()
    $<HTMLElement>('release-status').textContent = 'Private audition complete. Not submitted, scheduled, or counted as a public listen.'
  }
  void masterPlayer.play().then(() => {
    releaseAuditionPlayed = true
    try { localStorage.setItem('scene-release-audition-played', 'true') } catch { /* audition history is optional local progress */ }
    if (!$<HTMLElement>('desk-sheet').hidden) renderDesk()
    $<HTMLButtonElement>('audio').innerHTML = '♫ <span>ON</span>'
    $<HTMLButtonElement>('audio').setAttribute('aria-label', 'Audio on')
    $<HTMLElement>('release-status').textContent = 'Playing your private master. Not submitted, scheduled, or counted as a public listen.'
  }).catch(() => { $<HTMLElement>('release-status').textContent = 'Audio was blocked. Tap Play again.'; stopMasterPreview() })
}
for (const field of ['title', 'artist'] as const) $<HTMLInputElement>(`release-${field}`).oninput = event => { releaseDraft[field] = (event.target as HTMLInputElement).value; renderReleaseDraft(false) }
const genreSelector = $<HTMLSelectElement>('release-genre')
if (genreSelector) {
  genreSelector.onchange = event => {
    releaseDraft.genre = (event.target as HTMLSelectElement).value as ReleaseGenre
    renderReleaseDraft(false)
  }
}
$<HTMLInputElement>('right-master').onchange = e => { releaseDraft.rights.masterOwnership = (e.target as HTMLInputElement).checked; renderReleaseDraft(false) }
$<HTMLInputElement>('right-composition').onchange = e => { releaseDraft.rights.originalComposition = (e.target as HTMLInputElement).checked; renderReleaseDraft(false) }
$<HTMLInputElement>('right-samples').onchange = e => { releaseDraft.rights.sampleClearance = (e.target as HTMLInputElement).checked; renderReleaseDraft(false) }
$<HTMLInputElement>('right-consent').onchange = e => { releaseDraft.rights.contributorConsent = (e.target as HTMLInputElement).checked; renderReleaseDraft(false) }
document.querySelectorAll<HTMLButtonElement>('[data-art]').forEach(button => button.onclick = () => { releaseDraft.artwork = button.dataset.art as ArtworkVariant; renderReleaseDraft(false) })
$<HTMLButtonElement>('display-close').onclick = closeSheets
document.querySelectorAll<HTMLButtonElement>('[data-quality]').forEach(button => button.onclick = () => { quality = button.dataset.quality as Quality; localStorage.setItem('scene-quality', quality); applyQuality(); updateMetrics() })
document.querySelectorAll<HTMLButtonElement>('[data-lighting]').forEach(button => button.onclick = () => {
  const mode = button.dataset.lighting as LightingMode
  applyLighting(mode)
  toast(`Atmosphere: ${LIGHTING_PRESETS[mode].label} ${LIGHTING_PRESETS[mode].icon}`)
})
const timeToggle = document.getElementById('time-toggle')
if (timeToggle) {
  timeToggle.onclick = () => {
    const nextMode = getNextLightingMode(lightingMode)
    applyLighting(nextMode)
    toast(`Atmosphere: ${LIGHTING_PRESETS[nextMode].label} ${LIGHTING_PRESETS[nextMode].icon}`)
  }
}
$<HTMLButtonElement>('nav-create').onclick = () => location === 'studio' ? setRoute('studioDesk') : location === 'release' ? setRoute('releaseIntake') : location === 'square' ? setRoute('studio') : toast('Walk to City Studio from Music Square')
$<HTMLButtonElement>('nav-people').onclick = () => { closeSheets(); $<HTMLElement>('people-sheet').hidden = false; renderPeople(connectedPlayers, presenceConnected); void refreshFriendState(); void refreshPartyState() }
$<HTMLButtonElement>('people-close').onclick = closeSheets
$<HTMLButtonElement>('people-wave').onclick = () => { if (presenceConnected && connectedPlayers.some(player => player.location === location)) presence.sendEmote('wave') }
$<HTMLButtonElement>('people-edit-avatar').onclick = () => { $<HTMLElement>('people-sheet').hidden = true; $<HTMLElement>('avatar-sheet').hidden = false; applyAppearance() }
$<HTMLButtonElement>('report-close').onclick = () => $<HTMLDialogElement>('report-dialog').close()
$<HTMLButtonElement>('report-cancel').onclick = () => $<HTMLDialogElement>('report-dialog').close()
$<HTMLButtonElement>('direct-message-close').onclick = () => $<HTMLDialogElement>('direct-message-dialog').close()
$<HTMLDialogElement>('direct-message-dialog').addEventListener('close', () => { directMessageTarget = '' })
$<HTMLFormElement>('direct-message-form').addEventListener('submit', submitDirectMessage)
$<HTMLTextAreaElement>('direct-message-input').oninput = event => { $<HTMLElement>('direct-message-count').textContent = String((event.target as HTMLTextAreaElement).value.length) }
$<HTMLInputElement>('friend-messages-enabled').onchange = async event => {
  const input = event.target as HTMLInputElement
  const enabled = input.checked
  input.disabled = true
  try {
    await setGuestMessagePreference(enabled)
    friendState.allowFriendMessages = enabled
    renderSocialState()
    if (!enabled && $<HTMLDialogElement>('direct-message-dialog').open) $<HTMLDialogElement>('direct-message-dialog').close()
    toast(enabled ? 'Friend messages are on' : 'Friend messages are off')
  } catch (error) {
    input.checked = friendState.allowFriendMessages
    toast(error instanceof Error ? error.message : 'Could not update message privacy')
  } finally { input.disabled = false }
}
$<HTMLFormElement>('report-form').addEventListener('submit', async event => {
  event.preventDefault()
  const submit = $<HTMLButtonElement>('report-submit')
  const status = $<HTMLElement>('report-status')
  submit.disabled = true
  status.textContent = 'Sending report…'
  try {
    const reason = $<HTMLSelectElement>('report-reason').value as GuestReportReason
    const details = $<HTMLTextAreaElement>('report-details').value
    const receipt = await submitGuestReport({ targetGuestId: reportTargetId, reason, details })
    if (receipt.status !== 'received') throw new Error('Report was not received')
    status.textContent = 'Report received in the private prototype queue. No moderation team is connected yet.'
    submit.textContent = 'Report received'
  } catch (error) {
    status.textContent = error instanceof Error ? error.message : 'Could not send this report. Try again when connected.'
    submit.disabled = false
  }
})
$<HTMLButtonElement>('avatar-close').onclick = closeSheets
$<HTMLInputElement>('avatar-name').oninput = event => {
  playerName = (event.target as HTMLInputElement).value.trim().slice(0, 16) || 'Guest'
  localStorage.setItem('scene-player-name', playerName)
  updateAvatarNameTag(avatar, playerName, 'self')
  presence.send({ x: avatar.position.x, z: avatar.position.z, angle: avatar.rotation.y, dancing, location, name: playerName })
}
document.querySelectorAll<HTMLButtonElement>('.swatch-row button').forEach(button => {
  button.onclick = () => {
    const option = (button.closest('.swatch-row') as HTMLElement).dataset.option
    const value = button.dataset.value!
    if (option === 'skin') { skinColour = value; localStorage.setItem('scene-skin', value) }
    else if (option === 'shirt') { shirtColour = value; localStorage.setItem('scene-shirt', value) }
    else if (option === 'trousers') { trousersColour = value; localStorage.setItem('scene-trousers', value) }
    applyAppearance()
  }
})
applyAppearance()
$<HTMLButtonElement>('home').onclick = () => { closeSheets(); $<HTMLElement>('venue-card').hidden = true }
$<HTMLButtonElement>('route-close').onclick = () => { routeTarget = null; onwardTarget = null; $<HTMLElement>('route').hidden = true; clearWalkTarget() }
$<HTMLButtonElement>('venue-close').onclick = () => { $<HTMLElement>('venue-card').hidden = true; refreshContext() }
$<HTMLButtonElement>('preview-hall').onclick = () => { $<HTMLElement>('venue-card').hidden = true; refreshContext() }
$<HTMLButtonElement>('view-setup').onclick = () => { $<HTMLElement>('venue-card').hidden = true; setRoute('stage') }
document.querySelectorAll<HTMLButtonElement>('.desk-tabs button').forEach(button => button.addEventListener('click', () => openDesk(button.dataset.tab as 'today' | 'ask' | 'plans')))

window.addEventListener('keydown', event => {
  if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) return
  const key = event.key.toLowerCase()
  if (['w', 'a', 's', 'd', 'arrowup', 'arrowdown', 'arrowleft', 'arrowright'].includes(key)) event.preventDefault()
  keys.add(key)
  if (key === 'e' && nearby) interact()
  if (key === 'm') openMap()
  if (key === 'escape') closeSheets()
})
window.addEventListener('keyup', event => keys.delete(event.key.toLowerCase()))
window.addEventListener('blur', () => keys.clear())
world.addEventListener('pointerdown', event => { dragging = true; previousX = pointerStartX = event.clientX; previousY = pointerStartY = event.clientY; pointerMoved = false; world.setPointerCapture(event.pointerId) })
world.addEventListener('pointermove', event => { if (dragging) { if (Math.hypot(event.clientX - pointerStartX, event.clientY - pointerStartY) > 7) pointerMoved = true; if (pointerMoved) { yaw += (event.clientX - previousX) * .004; cameraPitch = THREE.MathUtils.clamp(cameraPitch + (event.clientY - previousY) * .012, -1.1, 1.1) } previousX = event.clientX; previousY = event.clientY } })
world.addEventListener('wheel', event => { cameraZoom = THREE.MathUtils.clamp(cameraZoom + Math.sign(event.deltaY) * .45, -1.5, 2.5) }, { passive: true })
world.addEventListener('pointerup', event => {
  dragging = false
  if (pointerMoved || sheet !== 'none') return
  if (!mutePopover.hidden) { mutePopover.hidden = true; return }
  const bounds = renderer.domElement.getBoundingClientRect()
  raycaster.setFromCamera(new THREE.Vector2((event.clientX - bounds.left) / bounds.width * 2 - 1, -(event.clientY - bounds.top) / bounds.height * 2 + 1), camera)
  // Check remote avatars first — tap to show mute option
  const avatarMeshes: THREE.Object3D[] = []
  for (const model of remoteAvatars.values()) model.traverse(obj => { if ((obj as THREE.Mesh).isMesh) avatarMeshes.push(obj) })
  const avatarHits = raycaster.intersectObjects(avatarMeshes, false)
  if (avatarHits.length > 0) {
    // Find which remote avatar group was hit
    for (const [id, model] of remoteAvatars) {
      let found = false
      model.traverse(obj => { if (obj === avatarHits[0].object) found = true })
      if (found) { showMutePopover(id, event.clientX, event.clientY); return }
    }
  }
  const hit = new THREE.Vector3()
  if (raycaster.ray.intersectPlane(ground, hit)) {
    const bounds = BOUNDARIES[location]
    hit.x = THREE.MathUtils.clamp(hit.x, bounds.minX, bounds.maxX)
    hit.z = THREE.MathUtils.clamp(hit.z, bounds.minZ, bounds.maxZ)
    if (isPointBlocked(location, hit.x, hit.z)) {
      toast('That spot is blocked by an obstacle')
      return
    }
    if (!beginWalkTo(hit.x, hit.z)) { toast('No clear walking route to that spot'); return }
    toast('Walking to marked spot')
  }
})
const pad = $<HTMLDivElement>('pad'), stick = $<HTMLDivElement>('stick')
function movePad(event: PointerEvent) {
  const bounds = pad.getBoundingClientRect(), dx = event.clientX - bounds.left - bounds.width / 2, dy = event.clientY - bounds.top - bounds.height / 2
  const distance = Math.max(1, Math.hypot(dx, dy)), strength = Math.min(1, distance / 43)
  touchX = dx / distance * strength; touchY = -dy / distance * strength
  stick.style.transform = `translate(${touchX * 33}px, ${-touchY * 33}px)`
}
pad.addEventListener('pointerdown', event => { clearWalkTarget(); pad.setPointerCapture(event.pointerId); movePad(event) })
pad.addEventListener('pointermove', event => { if (pad.hasPointerCapture(event.pointerId)) movePad(event) })
for (const name of ['pointerup', 'pointercancel']) pad.addEventListener(name, () => { touchX = touchY = 0; stick.style.transform = 'translate(0,0)' })
document.querySelectorAll<HTMLButtonElement>('[data-cue-look]').forEach(button => button.addEventListener('click', () => {
  if (stageCueMode !== 'record' || !masterPlayer || stageCues.length >= 64) return
  const look = button.dataset.cueLook as StageLook
  stageLook = look
  palmRoom?.setStageLook(look)
  stageCues.push({ at: Math.round(masterPlayer.currentTime * 10) / 10, look })
  $<HTMLElement>('stage-cue-count').textContent = `${stageCues.length} light cue${stageCues.length === 1 ? '' : 's'} recorded · saved when you stop`
}))
$<HTMLButtonElement>('stage-cue-stop').onclick = () => { stopMasterPreview(); toast('Local rehearsal ended · light cues saved') }
window.addEventListener('pagehide', () => { stopPreview(); stopBeat(); stopMasterPreview() })

// Development-only visual entry point for inspecting the room in a browser.
// Normal gameplay still requires walking to the physical Palm Room entrance.
if (import.meta.env.DEV) {
  const qa = new URLSearchParams(window.location.search).get('qa')
  if (qa === 'release' || qa === 'intake') {
    showReleaseHouse()
    if (qa === 'intake') { avatar.position.set(0, 0, -4.2); camera.position.set(0, 3.6, 3) }
  } else if (qa === 'studio' || qa === 'beat') {
    showStudio()
    if (qa === 'beat') { avatar.position.set(0, 0, -4.2); camera.position.set(0, 3.6, 3) }
  } else if (qa === 'palm' || qa === 'stage') {
    showVenue()
    if (qa === 'stage') { avatar.position.set(0, 0, -5.2); camera.position.set(0, 3.6, 2) }
  }
}

function resize() { camera.aspect = world.clientWidth / world.clientHeight; camera.fov = world.clientWidth < 700 ? 72 : 60; camera.updateProjectionMatrix(); renderer.setSize(world.clientWidth, world.clientHeight) }
window.addEventListener('resize', resize)
resize()
let previousFrame = performance.now(), elapsed = 0
let frameRequest = 0
let lastPresenceSend = 0
const frameSamples: number[] = []
let readyMs: number | null = null
function updateMetrics() {
  const summary = summarizeFrames(frameSamples)
  $<HTMLElement>('frame-metric').textContent = summary ? `${summary.medianMs.toFixed(1)} ms median · ${summary.p95Ms.toFixed(1)} ms p95 · ~${summary.fps} FPS` : 'Measuring…'
  $<HTMLElement>('scene-metric').textContent = `${renderer.info.render.calls} draws · ${renderer.info.render.triangles.toLocaleString()} triangles · ${renderer.info.memory.textures} textures`
  $<HTMLElement>('transfer-metric').textContent = `${(reportedTransferBytes() / 1024).toFixed(0)} KiB reported`
  $<HTMLElement>('ready-metric').textContent = readyMs === null ? 'Measuring…' : `${(readyMs / 1000).toFixed(2)} s · first rendered avatar`
}
function scheduleFrame() {
  if (!frameRequest && !document.hidden) frameRequest = requestAnimationFrame(frame)
}
document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    if (frameRequest) cancelAnimationFrame(frameRequest)
    frameRequest = 0
    return
  }
  previousFrame = performance.now()
  scheduleFrame()
})
function frame() {
  frameRequest = 0
  if (document.hidden) return
  const now = performance.now(), dt = Math.min((now - previousFrame) / 1000, .05)
  if (readyMs !== null && now - previousFrame < 250) { frameSamples.push(now - previousFrame); if (frameSamples.length > 300) frameSamples.shift() }
  previousFrame = now; elapsed += dt
  const forward = (keys.has('w') || keys.has('arrowup') ? 1 : 0) - (keys.has('s') || keys.has('arrowdown') ? 1 : 0) + touchY
  const side = (keys.has('d') || keys.has('arrowright') ? 1 : 0) - (keys.has('a') || keys.has('arrowleft') ? 1 : 0) + touchX
  const speed = Math.min(1, Math.hypot(forward, side))
  if (speed > .05 || walkTarget) {
    if (dancing) { dancing = false; $<HTMLButtonElement>('dance').setAttribute('aria-pressed', 'false'); $<HTMLButtonElement>('dance').textContent = '♪ Dance' }
  }
  if (speed > .05) clearWalkTarget()
  const remaining = walkTarget ? Math.hypot(walkTarget.x - avatar.position.x, walkTarget.z - avatar.position.z) : 0
  if (walkTarget && remaining < .18) {
    const next = walkPath.shift()
    if (next) walkTarget.set(next[0], 0, next[1])
    else clearWalkTarget()
  }
  if ((speed > .05 || walkTarget) && sheet === 'none') {
    const angle = walkTarget ? Math.atan2(walkTarget.x - avatar.position.x, avatar.position.z - walkTarget.z) : Math.atan2(side, forward) + yaw
    const step = Math.min(walkTarget ? remaining : Infinity, (walkTarget ? 1 : speed) * dt * 4.25)
    const nextX = avatar.position.x + Math.sin(angle) * step
    const nextZ = avatar.position.z - Math.cos(angle) * step
    const resolved = resolveCollision(location, avatar.position.x, avatar.position.z, nextX, nextZ)
    avatar.position.x = resolved.x
    avatar.position.z = resolved.z
    const targetY = location === 'venue' && avatar.position.z <= -6.4 && avatar.position.z >= -10.8 && Math.abs(avatar.position.x) <= 6.8 ? 0.78 : 0
    avatar.position.y += (targetY - avatar.position.y) * Math.min(1, dt * 10)
    avatar.rotation.y = idleFacing = facingAngleForMovement(angle)
    const gait = walkingPose(elapsed * 11, walkTarget ? 1 : speed)
    leftArm.rotation.z = -.15; rightArm.rotation.z = .15
    leftElbow.rotation.z = rightElbow.rotation.z = 0
    leftLeg.rotation.x = gait.leftLeg; rightLeg.rotation.x = gait.rightLeg
    leftArm.rotation.x = gait.leftArm; rightArm.rotation.x = gait.rightArm
    leftElbow.rotation.x = gait.leftElbow; rightElbow.rotation.x = gait.rightElbow
    leftKnee.rotation.x = gait.leftKnee; rightKnee.rotation.x = gait.rightKnee
    leftFoot.rotation.x = -gait.leftKnee * .6; rightFoot.rotation.x = -gait.rightKnee * .6
    avatarBody.position.y = gait.bob
    avatarBody.rotation.z = 0
  } else if (dancing && sheet === 'none') {
    avatarBody.position.y = Math.abs(Math.sin(elapsed * 5)) * .045
    avatarBody.rotation.z = 0
    avatar.rotation.y = Math.PI + Math.sin(elapsed * 2.5) * .32
    leftArm.rotation.x = Math.sin(elapsed * 6) * .6
    rightArm.rotation.x = -leftArm.rotation.x
    leftElbow.rotation.x = .14 + Math.max(0, Math.sin(elapsed * 6)) * .2
    rightElbow.rotation.x = .14 + Math.max(0, -Math.sin(elapsed * 6)) * .2
    leftArm.rotation.z = -.45 - Math.sin(elapsed * 4) * .2
    rightArm.rotation.z = .45 + Math.sin(elapsed * 4) * .2
    leftElbow.rotation.z = rightElbow.rotation.z = 0
    leftLeg.rotation.x = Math.sin(elapsed * 6) * .17
    rightLeg.rotation.x = -leftLeg.rotation.x
    leftKnee.rotation.x = Math.max(0, Math.sin(elapsed * 6)) * .35
    rightKnee.rotation.x = Math.max(0, -Math.sin(elapsed * 6)) * .35
    leftFoot.rotation.x = -leftKnee.rotation.x * .6; rightFoot.rotation.x = -rightKnee.rotation.x * .6
  } else {
    const idle = idlePose(elapsed)
    avatarBody.position.y = idle.bob
    avatarBody.rotation.z = idle.lean
    avatar.rotation.y = idleFacing + idle.facing
    leftLeg.rotation.x = rightLeg.rotation.x = 0
    leftArm.rotation.x = idle.armSwing; rightArm.rotation.x = -idle.armSwing
    leftElbow.rotation.x = rightElbow.rotation.x = .08
    leftElbow.rotation.z = rightElbow.rotation.z = 0
    leftKnee.rotation.x = rightKnee.rotation.x = leftFoot.rotation.x = rightFoot.rotation.x = 0
    leftArm.rotation.z = -.15; rightArm.rotation.z = .15
  }
  applyActiveAvatarEmote(avatar, { body: avatarBody, leftArm, rightArm, leftElbow, rightElbow })
  const deskFraming = location === 'square' && sheet === 'desk'
  const cameraDistance = (location === 'venue' ? 10.6 : deskFraming ? 10.2 : 6.2) + cameraZoom
  const cameraHeight = (location === 'venue' ? 4.9 : deskFraming ? 4.1 : 3.15) + cameraPitch
  const desired = avatar.position.clone().add(new THREE.Vector3(Math.sin(yaw) * cameraDistance, cameraHeight, Math.cos(yaw) * cameraDistance))
  const b = BOUNDARIES[location]
  const camPad = location === 'square' ? 3.5 : location === 'venue' ? 7.5 : 1.2
  desired.x = THREE.MathUtils.clamp(desired.x, b.minX - camPad, b.maxX + camPad)
  desired.z = THREE.MathUtils.clamp(desired.z, b.minZ - camPad, b.maxZ + camPad)
  camera.position.lerp(desired, 1 - Math.exp(-7 * dt))
  const lookAhead = location === 'square' ? deskFraming ? -2.2 : 1.4 : 0
  camera.lookAt(avatar.position.x + Math.sin(yaw) * lookAhead, avatar.position.y + (deskFraming ? .35 : 1.78), avatar.position.z - Math.cos(yaw) * lookAhead)
  const next = getNearby(location, avatar.position.x, avatar.position.z)
  if (now - lastPresenceSend > 125) {
    presence.send({ x: avatar.position.x, z: avatar.position.z, angle: avatar.rotation.y, dancing, location, name: playerName })
    lastPresenceSend = now
  }
  for (const player of connectedPlayers) {
    const model = remoteAvatars.get(player.id)
    if (!model) continue
    const parts = model.userData.avatarParts as {
      body: THREE.Group; leftArm: THREE.Group; rightArm: THREE.Group; leftElbow: THREE.Group; rightElbow: THREE.Group
      leftLeg: THREE.Group; rightLeg: THREE.Group; leftKnee: THREE.Group; rightKnee: THREE.Group; leftFoot: THREE.Group; rightFoot: THREE.Group
    }
    if (player.dancing) {
      model.rotation.y = player.angle + Math.sin(elapsed * 2.5) * .32
      parts.body.position.y = Math.abs(Math.sin(elapsed * 5)) * .045
      parts.leftArm.rotation.x = Math.sin(elapsed * 6) * .6; parts.rightArm.rotation.x = -parts.leftArm.rotation.x
      parts.leftElbow.rotation.x = .14 + Math.max(0, Math.sin(elapsed * 6)) * .2
      parts.rightElbow.rotation.x = .14 + Math.max(0, -Math.sin(elapsed * 6)) * .2
      parts.leftArm.rotation.z = -.45 - Math.sin(elapsed * 4) * .2; parts.rightArm.rotation.z = .45 + Math.sin(elapsed * 4) * .2
      parts.leftElbow.rotation.z = parts.rightElbow.rotation.z = 0
      parts.leftLeg.rotation.x = Math.sin(elapsed * 6) * .17; parts.rightLeg.rotation.x = -parts.leftLeg.rotation.x
      parts.leftKnee.rotation.x = Math.max(0, Math.sin(elapsed * 6)) * .35
      parts.rightKnee.rotation.x = Math.max(0, -Math.sin(elapsed * 6)) * .35
      parts.leftFoot.rotation.x = -parts.leftKnee.rotation.x * .6; parts.rightFoot.rotation.x = -parts.rightKnee.rotation.x * .6
    } else {
      model.rotation.y = player.angle
      const gait = walkingPose(elapsed * 11, model.userData.walking ? 1 : 0)
      parts.body.position.y = gait.bob
      parts.leftArm.rotation.x = gait.leftArm; parts.rightArm.rotation.x = gait.rightArm
      parts.leftElbow.rotation.x = gait.leftElbow; parts.rightElbow.rotation.x = gait.rightElbow
      parts.leftArm.rotation.z = -.15; parts.rightArm.rotation.z = .15
      parts.leftElbow.rotation.z = parts.rightElbow.rotation.z = 0
      parts.leftLeg.rotation.x = gait.leftLeg; parts.rightLeg.rotation.x = gait.rightLeg
      parts.leftKnee.rotation.x = gait.leftKnee; parts.rightKnee.rotation.x = gait.rightKnee
      parts.leftFoot.rotation.x = -gait.leftKnee * .6; parts.rightFoot.rotation.x = -gait.rightKnee * .6
    }
    applyActiveAvatarEmote(model, parts)
  }
  if (next !== nearby) { nearby = next; refreshContext() }
  if (routeTarget) {
    const [x, z] = routePoints[routeTarget]
    const distance = Math.round(Math.hypot(x - avatar.position.x, z - avatar.position.z))
    const bearing = Math.atan2(x - avatar.position.x, avatar.position.z - z) - yaw
    $<HTMLElement>('route-arrow').style.transform = `rotate(${bearing}rad)`
    $<HTMLElement>('route-distance').textContent = distance < 3 ? 'In reach · interact here' : `${distance} m · walk through the world`
    if (nearby === routeTarget) $<HTMLElement>('route').classList.add('arrived')
    else $<HTMLElement>('route').classList.remove('arrived')
  }
  routeMarker.visible = !!routeTarget
  if (location === 'venue') palmRoom?.update(elapsed)
  if (location === 'square') {
    (square.userData.updateConcierge as ((time: number) => void) | undefined)?.(elapsed);
    (square.userData.updateAmbientPedestrians as ((time: number, enabled: boolean) => void) | undefined)?.(elapsed, quality !== 'saver');
    (square.userData.updatePerformer as ((time: number) => void) | undefined)?.(elapsed)
  }
  if (location === 'studio') (studioRoom?.userData.updateServiceNpc as ((time: number) => void) | undefined)?.(elapsed)
  renderer.render(scene, camera)
  if (readyMs === null) readyMs = performance.now()
  if (Math.floor(elapsed * 2) !== Math.floor((elapsed - dt) * 2) && !$<HTMLElement>('display-sheet').hidden) updateMetrics()
  scheduleFrame()
}
scheduleFrame()
