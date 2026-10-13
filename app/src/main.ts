import * as THREE from 'three'
import { getNearby, type Hotspot, type Location } from './worldModel.ts'
import { makePalmRoom, makeSquare } from './world.ts'
import { reportedTransferBytes, summarizeFrames } from './performance.ts'
import { makeStudio } from './studioWorld.ts'
import { renderMasterWav, sectionsDiffer, starterPattern, toggleStep, validPattern, type BeatPattern } from './beatPattern.ts'
import { loadLocalMaster, saveLocalMaster } from './localMaster.ts'
import { makeReleaseHouse } from './releaseWorld.ts'
import { blankReleaseDraft, releaseBlockers, validReleaseDraft, type ReleaseDraft } from './releaseDraft.ts'
import './style.css'

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
<main id="game">
  <div id="world" aria-label="Interactive 3D THE SCENE world"></div>
  <div class="shade"></div>
  <header class="topbar">
    <div class="brand"><span class="brand-mark">♛</span><span>THE<br>SCENE</span></div>
    <div class="top-divider"></div>
    <div class="clock"><span>☀</span><div><b>GOLDEN HOUR</b><small id="place-name">Music Square · Lagos</small></div></div>
    <div class="top-divider mood-divider"></div>
    <div class="mood"><i></i> EXPLORING</div>
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
    <dl class="runtime-metrics"><div><dt>Frame time</dt><dd id="frame-metric">Measuring…</dd></div><div><dt>Reported transfer</dt><dd id="transfer-metric">Measuring…</dd></div><div><dt>Avatar ready</dt><dd id="ready-metric">Measuring…</dd></div><div><dt>Audio before Play</dt><dd>0 B · generated preview</dd></div></dl>
    <p class="metric-note">This development server sends unbundled files; its transfer total is not a production-load result. Real-phone FPS, thermals, and network recovery remain untested.</p>
  </section>
  <section id="beat-sheet" class="beat-sheet" hidden aria-label="City Studio beat desk">
    <button id="beat-close" class="icon-close" aria-label="Close beat desk">×</button>
    <small class="eyebrow">CITY STUDIO · LOCAL DEMO</small><h2>Make a beat</h2>
    <p>Tap pads to arrange four original synthesized sounds. This private pattern stays on this device.</p>
    <div class="section-tabs"><button data-section="a">Section A</button><button data-section="b">Section B</button></div>
    <div id="beat-grid" class="beat-grid"></div>
    <div class="beat-actions"><button id="beat-play" class="green-button">▶ Play beat</button><button id="beat-save">Save pattern</button><button id="beat-render">Render 30s master</button></div>
    <small id="beat-status">No release, upload, or public sharing is available.</small>
  </section>
  <section id="release-sheet" class="release-sheet" hidden aria-label="Release House record intake">
    <button id="release-close" class="icon-close" aria-label="Close release intake">×</button>
    <small class="eyebrow">RELEASE HOUSE · PRIVATE DRAFT</small><h2>Prepare your release</h2>
    <p>Start a sleeve here. Submission and Friday scheduling require a finished master, rights review, and the release service.</p>
    <div class="release-layout"><div id="release-cover" class="release-cover"><span>THE SCENE</span><strong id="release-cover-title">UNTITLED</strong><small id="release-cover-artist">ARTIST NAME</small></div><div class="release-fields"><label>Song title<input id="release-title" maxlength="80" placeholder="Name your track"></label><label>Artist name<input id="release-artist" maxlength="80" placeholder="Your artist name"></label><div class="cover-choices" aria-label="Draft artwork colour"><button data-art="rose" aria-label="Rose artwork"></button><button data-art="teal" aria-label="Teal artwork"></button><button data-art="night" aria-label="Night artwork"></button></div></div></div>
    <div class="release-checklist"><b>Before this can be released</b><ul id="release-blockers"></ul></div>
    <div class="release-actions"><button id="release-save" class="green-button">Save private sleeve draft</button><button id="release-play" hidden>▶ Play local master</button></div><small id="release-status">Not submitted or scheduled.</small>
  </section>

  <div id="toast" class="toast" role="status"></div>
  <div id="pad" class="pad" aria-label="Touch movement pad"><div id="stick"></div></div>
  <div class="keyboard-hint"><kbd>W</kbd><kbd>A</kbd><kbd>S</kbd><kbd>D</kbd> MOVE <span>·</span> DRAG TO LOOK</div>
  <nav class="bottom-nav" aria-label="Main navigation"><button id="home" class="active"><span>⌂</span>Home</button><button id="nav-map"><span>▱</span>Map</button><button id="nav-create"><span>⊕</span>Create</button><button id="nav-people"><span>♧</span>People</button><button id="nav-phone"><span>▯</span>Phone</button></nav>
  <button id="desk-trigger" class="desk-trigger"><span>✦</span> Desk <small>Next moves</small></button>
</main>`

const $ = <T extends HTMLElement>(id: string) => document.getElementById(id) as T
const world = $<HTMLDivElement>('world')
const scene = new THREE.Scene()
scene.background = new THREE.Color('#413243')
scene.fog = new THREE.Fog('#413243', 32, 72)
const camera = new THREE.PerspectiveCamera(62, 1, .1, 90)
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
applyQuality()
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFShadowMap
renderer.outputColorSpace = THREE.SRGBColorSpace
renderer.toneMapping = THREE.ACESFilmicToneMapping
renderer.toneMappingExposure = 1.16
world.appendChild(renderer.domElement)

const square = makeSquare()
scene.add(square)
let palmRoom: ReturnType<typeof makePalmRoom> | null = null
let studioRoom: ReturnType<typeof makeStudio> | null = null
let releaseRoom: ReturnType<typeof makeReleaseHouse> | null = null
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

// The avatar is original prototype geometry, not a borrowed rig or a fake connected player.
const avatar = new THREE.Group()
scene.add(avatar)
const skin = new THREE.MeshStandardMaterial({ color: '#70412f', roughness: .9 })
const cloth = document.createElement('canvas')
cloth.width = cloth.height = 256
const clothContext = cloth.getContext('2d')!
clothContext.fillStyle = '#dfac5f'; clothContext.fillRect(0, 0, 256, 256)
for (let row = 0; row < 8; row++) for (let col = 0; col < 8; col++) {
  const x = 16 + col * 32, y = 16 + row * 32
  clothContext.strokeStyle = '#a86935'; clothContext.lineWidth = 3
  clothContext.beginPath(); clothContext.arc(x, y, 8, 0, Math.PI * 2); clothContext.stroke()
  clothContext.fillStyle = '#eee0aa'; clothContext.fillRect(x - 2, y - 2, 4, 4)
}
const clothTexture = new THREE.CanvasTexture(cloth)
clothTexture.colorSpace = THREE.SRGBColorSpace
const shirt = new THREE.MeshStandardMaterial({ map: clothTexture, roughness: .95 })
const trousers = new THREE.MeshStandardMaterial({ color: '#7758b0', roughness: .91 })
const hair = new THREE.MeshStandardMaterial({ color: '#18131a', roughness: 1 })
const shoes = new THREE.MeshStandardMaterial({ color: '#211d22', roughness: .8 })
function avatarPart(geometry: THREE.BufferGeometry, material: THREE.Material, x: number, y: number, z: number) {
  const part = new THREE.Mesh(geometry, material)
  part.position.set(x, y, z)
  part.castShadow = true
  avatar.add(part)
  return part
}
avatarPart(new THREE.CapsuleGeometry(.42, .76, 4, 10), shirt, 0, 1.4, 0)
avatarPart(new THREE.SphereGeometry(.31, 12, 9), skin, 0, 2.4, 0)
avatarPart(new THREE.SphereGeometry(.335, 12, 9), hair, 0, 2.58, -.05)
const leftArm = avatarPart(new THREE.CapsuleGeometry(.105, .56, 3, 8), skin, -.5, 1.37, 0)
const rightArm = avatarPart(new THREE.CapsuleGeometry(.105, .56, 3, 8), skin, .5, 1.37, 0)
leftArm.rotation.z = -.15
rightArm.rotation.z = .15
const leftLeg = avatarPart(new THREE.CapsuleGeometry(.14, .65, 3, 8), trousers, -.21, .55, 0)
const rightLeg = avatarPart(new THREE.CapsuleGeometry(.14, .65, 3, 8), trousers, .21, .55, 0)
avatarPart(new THREE.BoxGeometry(.32, .18, .55), shoes, -.21, .11, .13)
avatarPart(new THREE.BoxGeometry(.32, .18, .55), shoes, .21, .11, .13)
avatar.position.set(-4, 0, 7)
camera.position.set(-4, 3.8, 14.2)

const keys = new Set<string>()
let yaw = 0, dragging = false, previousX = 0, pointerStartX = 0, pointerStartY = 0, pointerMoved = false, touchX = 0, touchY = 0
let walkTarget: THREE.Vector3 | null = null
const walkMarker = new THREE.Mesh(new THREE.RingGeometry(.45, .58, 28), new THREE.MeshBasicMaterial({ color: '#36e8b8', side: THREE.DoubleSide, depthTest: false }))
walkMarker.rotation.x = -Math.PI / 2; walkMarker.visible = false; walkMarker.renderOrder = 20; scene.add(walkMarker)
const routeMarker = new THREE.Mesh(new THREE.RingGeometry(.7, .84, 32), new THREE.MeshBasicMaterial({ color: '#f7d37d', side: THREE.DoubleSide, depthTest: false }))
routeMarker.rotation.x = -Math.PI / 2; routeMarker.visible = false; routeMarker.renderOrder = 21; scene.add(routeMarker)
const routePoints: Record<Hotspot, [number, number]> = { kiosk: [-8, 2], studio: [13, -8], palmEntrance: [10, 2], stage: [0, -7], venueExit: [-10, 9], studioDesk: [0, -5.5], studioExit: [-10, 9], releaseEntrance: [-13, -8], releaseIntake: [0, -5.5], releaseExit: [-10, 9] }
const ground = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0), raycaster = new THREE.Raycaster()
function clearWalkTarget() { walkTarget = null; walkMarker.visible = false }
let nearby: Hotspot | null = null
let routeTarget: Hotspot | null = null
let onwardTarget: Hotspot | null = null
let sheet: 'none' | 'desk' | 'action' = 'none'
let deskTab: 'today' | 'ask' | 'plans' = 'today'
let savedPreview = false, equipmentPreviewVisible = false, playing = false
let beatPattern: BeatPattern = starterPattern(), beatPatternB: BeatPattern = toggleStep(starterPattern(), 0, 1)
let beatSection: 'a' | 'b' = 'a', beatPlaying = false, beatTimer: number | undefined, beatStep = 0, beatBar = 0, beatDraftSaved = false
let masterBlob: Blob | null = null, masterPlayer: HTMLAudioElement | null = null, masterAudioUrl: string | null = null
let releaseDraft: ReleaseDraft = blankReleaseDraft()
try { const saved = JSON.parse(localStorage.getItem('scene-beat-draft') || 'null'); if (validPattern(saved)) { beatPattern = saved; beatDraftSaved = true } } catch { /* invalid local draft starts fresh */ }
try { const saved = JSON.parse(localStorage.getItem('scene-beat-arrangement') || 'null'); if (validPattern(saved?.a) && validPattern(saved?.b)) { beatPattern = saved.a; beatPatternB = saved.b; beatDraftSaved = true } } catch { /* invalid local arrangement starts fresh */ }
try { const saved = JSON.parse(localStorage.getItem('scene-release-draft') || 'null'); if (validReleaseDraft(saved)) releaseDraft = saved } catch { /* invalid local draft starts fresh */ }
void loadLocalMaster().then(blob => { masterBlob = blob; if (!$<HTMLElement>('release-sheet').hidden) renderReleaseDraft(false) }).catch(() => { /* private mode may block local storage */ })
let audio: AudioContext | null = null, audioTimer: number | undefined

function toast(text: string) {
  const node = $<HTMLDivElement>('toast')
  node.textContent = text
  node.classList.add('show')
  window.setTimeout(() => node.classList.remove('show'), 3100)
}

function closeSheets() {
  $<HTMLElement>('desk-sheet').hidden = true
  $<HTMLElement>('action-sheet').hidden = true
  $<HTMLElement>('display-sheet').hidden = true
  $<HTMLElement>('beat-sheet').hidden = true
  $<HTMLElement>('release-sheet').hidden = true
  $<HTMLElement>('map-sheet').hidden = true
  stopBeat()
  stopMasterPreview()
  sheet = 'none'
  refreshContext()
}

function stopMasterPreview() {
  masterPlayer?.pause(); masterPlayer = null
  if (masterAudioUrl) URL.revokeObjectURL(masterAudioUrl)
  masterAudioUrl = null
  if (!playing && !beatPlaying) { $<HTMLButtonElement>('audio').innerHTML = '♫ <span>OFF</span>'; $<HTMLButtonElement>('audio').setAttribute('aria-label', 'Audio off') }
}

function setRoute(target: Hotspot) {
  routeTarget = target
  const [x, z] = routePoints[target]
  routeMarker.position.set(x, .075, z)
  routeMarker.visible = true
  $<HTMLElement>('route').hidden = false
  $<HTMLElement>('route-title').textContent = target === 'palmEntrance' ? 'PALM ROOM' : target === 'stage' ? 'STAGE SETUP' : target === 'studio' ? 'CITY STUDIO' : target === 'studioDesk' ? 'BEAT DESK' : target === 'studioExit' ? 'STUDIO EXIT' : target === 'releaseEntrance' ? 'RELEASE HOUSE' : target === 'releaseIntake' ? 'RECORD INTAKE' : target === 'releaseExit' ? 'RELEASE EXIT' : target === 'venueExit' ? 'VENUE EXIT' : 'LISTENING STATION'
  closeSheets()
  toast('Follow the world marker and walk there')
}

const mapDestinations: { id: Hotspot; name: string; detail: string }[] = [
  { id: 'releaseEntrance', name: 'Release House', detail: 'Record intake · private sleeve' },
  { id: 'studio', name: 'City Studio', detail: 'Free beat desk' },
  { id: 'kiosk', name: 'Listening station', detail: 'Original music preview' },
  { id: 'palmEntrance', name: 'Palm Room', detail: 'Walkable venue preview' },
]
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
    avatarPin.style.left = `${Math.max(5, Math.min(95, (avatar.position.x + 18) / 37 * 100))}%`
    avatarPin.style.top = `${Math.max(6, Math.min(94, (avatar.position.z + 12) / 28 * 100))}%`
  }
  $<HTMLElement>('map-context').textContent = location === 'square' ? 'Choose a place, then walk to its entrance.' : `You are inside ${location === 'venue' ? 'Palm Room' : location === 'studio' ? 'City Studio' : 'Release House'}. A route to another place begins at this room’s exit.`
  $<HTMLElement>('map-places').innerHTML = mapDestinations.map(item => `<button data-map-target="${item.id}"><b>${item.name}</b><small>${item.detail}</small><span>Show route ↗</span></button>`).join('')
  $<HTMLElement>('map-sheet').querySelectorAll<HTMLButtonElement>('[data-map-target]').forEach(button => button.onclick = () => mapRoute(button.dataset.mapTarget as Hotspot))
}

function startPreview() {
  audio ??= new AudioContext()
  void audio.resume()
  playing = true
  let step = 0
  const notes = [220, 261.63, 329.63, 392, 329.63, 261.63, 196, 246.94]
  const note = () => {
    if (!playing || !audio) return
    const oscillator = audio.createOscillator(), gain = audio.createGain()
    oscillator.type = 'sine'
    oscillator.frequency.value = notes[step++ % notes.length]
    gain.gain.setValueAtTime(.0001, audio.currentTime)
    gain.gain.exponentialRampToValueAtTime(.065, audio.currentTime + .02)
    gain.gain.exponentialRampToValueAtTime(.0001, audio.currentTime + .29)
    oscillator.connect(gain).connect(audio.destination)
    oscillator.start(); oscillator.stop(audio.currentTime + .3)
  }
  note()
  audioTimer = window.setInterval(note, 350)
  $<HTMLButtonElement>('audio').innerHTML = '♫ <span>ON</span>'
  $<HTMLButtonElement>('audio').setAttribute('aria-label', 'Audio on')
}

function stopPreview() {
  playing = false
  window.clearInterval(audioTimer)
  $<HTMLButtonElement>('audio').innerHTML = '♫ <span>OFF</span>'
  $<HTMLButtonElement>('audio').setAttribute('aria-label', 'Audio off')
}

function beatVoice(lane: number) {
  audio ??= new AudioContext()
  void audio.resume()
  const at = audio.currentTime, oscillator = audio.createOscillator(), gain = audio.createGain()
  oscillator.type = lane === 2 ? 'square' : lane === 1 ? 'triangle' : 'sine'
  oscillator.frequency.setValueAtTime([125, 240, 680, 164][lane], at)
  oscillator.frequency.exponentialRampToValueAtTime([48, 120, 420, 150][lane], at + .14)
  gain.gain.setValueAtTime(.0001, at)
  gain.gain.exponentialRampToValueAtTime(lane === 2 ? .018 : .065, at + .008)
  gain.gain.exponentialRampToValueAtTime(.0001, at + (lane === 3 ? .34 : .18))
  oscillator.connect(gain).connect(audio.destination)
  oscillator.start(at); oscillator.stop(at + .36)
}

function drawBeat() {
  const grid = $<HTMLDivElement>('beat-grid')
  const pattern = beatSection === 'a' ? beatPattern : beatPatternB
  document.querySelectorAll<HTMLButtonElement>('[data-section]').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.section === beatSection)))
  grid.innerHTML = pattern.map((lane, laneIndex) => `<div class="beat-row"><b>${['Kick', 'Snare', 'Hat', 'Bass'][laneIndex]}</b>${lane.map((on, step) => `<button aria-label="${['Kick', 'Snare', 'Hat', 'Bass'][laneIndex]} step ${step + 1}" aria-pressed="${on}" data-lane="${laneIndex}" data-step="${step}" class="${beatPlaying && beatStep === step ? 'current' : ''}"></button>`).join('')}</div>`).join('')
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
  const pulse = () => { const pattern = beatBar % 2 ? beatPatternB : beatPattern; pattern.forEach((row, lane) => { if (row[beatStep]) beatVoice(lane) }); drawBeat(); beatStep = (beatStep + 1) % 8; if (beatStep === 0) beatBar++ }
  pulse(); beatTimer = window.setInterval(pulse, 312.5)
}

function openAction(title: string, copy: string, primary: string, onPrimary: () => void, secondary?: { label: string; action: () => void }) {
  closeSheets()
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
  showVenue()
}

function showVenue() {
  clearWalkTarget()
  if (!palmRoom) { palmRoom = makePalmRoom(); scene.add(palmRoom.root) }
  square.visible = false
  palmRoom.root.visible = true
  location = 'venue'
  $<HTMLElement>('game').dataset.location = 'venue'
  avatar.position.set(0, 0, 8)
  yaw = 0
  camera.position.set(0, 3.6, 15)
  sun.intensity = 1.2
  ambient.intensity = 1.35
  scene.background = new THREE.Color('#211d26')
  scene.fog = new THREE.Fog('#211d26', 24, 55)
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
  showStudio()
}

function showStudio() {
  clearWalkTarget()
  if (!studioRoom) { studioRoom = makeStudio(); scene.add(studioRoom) }
  square.visible = false; studioRoom.visible = true
  location = 'studio'; $<HTMLElement>('game').dataset.location = 'studio'
  avatar.position.set(0, 0, 7); yaw = 0; camera.position.set(0, 3.7, 14)
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
  avatar.position.set(13, 0, -6.7); yaw = 0; camera.position.set(13, 3.8, .3)
  sun.intensity = 2; ambient.intensity = 1.9
  scene.background = new THREE.Color('#413243'); scene.fog = new THREE.Fog('#413243', 32, 72)
  nearby = null; closeSheets(); $<HTMLElement>('place-name').textContent = 'Music Square · Lagos'
  $<HTMLElement>('scene-name').textContent = 'MUSIC SQUARE'
  continueMapRoute()
}

function enterReleaseHouse() {
  if (getNearby('square', avatar.position.x, avatar.position.z) !== 'releaseEntrance') { toast('Walk to the Release House entrance first'); return }
  showReleaseHouse()
}

function showReleaseHouse() {
  clearWalkTarget()
  if (!releaseRoom) { releaseRoom = makeReleaseHouse(); scene.add(releaseRoom) }
  square.visible = false; releaseRoom.visible = true
  location = 'release'; $<HTMLElement>('game').dataset.location = 'release'
  avatar.position.set(0, 0, 7); yaw = 0; camera.position.set(0, 3.7, 14)
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
  avatar.position.set(-13, 0, -6.7); yaw = 0; camera.position.set(-13, 3.8, .3)
  sun.intensity = 2; ambient.intensity = 1.9
  scene.background = new THREE.Color('#413243'); scene.fog = new THREE.Fog('#413243', 32, 72)
  nearby = null; closeSheets(); $<HTMLElement>('place-name').textContent = 'Music Square · Lagos'
  $<HTMLElement>('scene-name').textContent = 'MUSIC SQUARE'
  continueMapRoute()
}

function renderReleaseDraft(syncInputs = true) {
  if (syncInputs) { $<HTMLInputElement>('release-title').value = releaseDraft.title; $<HTMLInputElement>('release-artist').value = releaseDraft.artist }
  $<HTMLElement>('release-cover-title').textContent = releaseDraft.title || 'UNTITLED'
  $<HTMLElement>('release-cover-artist').textContent = releaseDraft.artist || 'ARTIST NAME'
  $<HTMLElement>('release-cover').dataset.art = releaseDraft.artwork
  document.querySelectorAll<HTMLButtonElement>('[data-art]').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.art === releaseDraft.artwork)))
  $<HTMLElement>('release-blockers').replaceChildren(...releaseBlockers(releaseDraft, !!masterBlob).map(item => { const li = document.createElement('li'); li.textContent = item; return li }))
  $<HTMLButtonElement>('release-play').hidden = !masterBlob
}

function openReleaseDraft() {
  closeSheets(); sheet = 'action'; $<HTMLElement>('release-sheet').hidden = false; renderReleaseDraft()
}

function leaveVenue() {
  if (getNearby('venue', avatar.position.x, avatar.position.z) !== 'venueExit') { toast('Walk to the exit first'); return }
  clearWalkTarget(); palmRoom!.root.visible = false
  square.visible = true
  location = 'square'
  $<HTMLElement>('game').dataset.location = 'square'
  avatar.position.set(10, 0, 3.5)
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

function interact() {
  if (!nearby) return
  if (nearby === 'kiosk') openAction('Listening station', 'Play an original synthesized preview. No song file downloads before you choose Play.', playing ? 'Stop preview' : 'Play preview', () => { playing ? stopPreview() : startPreview(); interact() }, { label: savedPreview ? 'Saved ✓' : 'Save preview', action: () => { savedPreview = true; toast('Saved for this session'); interact() } })
  if (nearby === 'studio') openAction('City Studio', 'Enter the free studio and walk to the producer desk. The local beat demo uses original synthesized sounds.', 'Enter studio', enterStudio)
  if (nearby === 'studioDesk') openBeat()
  if (nearby === 'studioExit') openAction('Exit City Studio', 'Walk back to Music Square. Your local beat draft stays on this device.', 'Return to square', leaveStudio)
  if (nearby === 'releaseEntrance') openAction('Release House', 'Enter the record intake and artwork room. Public release is unavailable until a finished rights-cleared master and server review exist.', 'Enter Release House', enterReleaseHouse)
  if (nearby === 'releaseIntake') openReleaseDraft()
  if (nearby === 'releaseExit') openAction('Exit Release House', 'Walk back to Music Square. Your private sleeve draft remains on this device.', 'Return to square', leaveReleaseHouse)
  if (nearby === 'palmEntrance') openAction('Palm Room', 'Go through the door to inspect a small walkable music venue. No lease or purchase occurs.', 'Enter venue', enterVenue)
  if (nearby === 'stage') openAction('Stage setup preview', equipmentPreviewVisible ? 'A temporary floor light preview is visible at this snap point. It is not owned, installed, or saved.' : 'Preview a floor light at this snap point. Actual installation requires authorised inventory and a server save.', equipmentPreviewVisible ? 'Hide preview' : 'Show floor light preview', () => { equipmentPreviewVisible = !equipmentPreviewVisible; palmRoom?.setEquipmentPreview(equipmentPreviewVisible); toast(equipmentPreviewVisible ? 'Temporary preview shown' : 'Preview hidden'); refreshContext(); interact() })
  if (nearby === 'venueExit') openAction('Exit Palm Room', 'Walk back out to Music Square. Your local stage preview state stays available for this session.', 'Return to square', leaveVenue)
}

function refreshContext() {
  const context = $<HTMLElement>('context')
  context.hidden = !nearby || sheet !== 'none' || !$<HTMLElement>('venue-card').hidden
  if (!nearby) return
  const names: Record<Hotspot, [string, string]> = {
    kiosk: ['LISTEN HERE', 'Choose a preview and save it'],
    studio: ['CITY STUDIO', 'Enter the free beat room'],
    studioDesk: ['BEAT DESK', 'Tap pads and make a private beat'],
    studioExit: ['MUSIC SQUARE', 'Leave City Studio'],
    releaseEntrance: ['RELEASE HOUSE', 'Enter the record intake'],
    releaseIntake: ['RECORD INTAKE', 'Prepare a private release sleeve'],
    releaseExit: ['MUSIC SQUARE', 'Leave Release House'],
    palmEntrance: ['PALM ROOM', 'Enter the music venue'],
    stage: ['STAGE PREVIEW', equipmentPreviewVisible ? 'Temporary floor light shown' : 'Inspect one floor-light snap point'],
    venueExit: ['MUSIC SQUARE', 'Leave the venue'],
  }
  $<HTMLElement>('context-name').textContent = names[nearby][0]
  $<HTMLElement>('context-help').textContent = names[nearby][1]
  $<HTMLElement>('context-icon').textContent = nearby === 'kiosk' ? '♫' : nearby === 'stage' ? '☼' : '↗'
}

function renderDesk() {
  const cards = $<HTMLDivElement>('desk-cards')
  const intro = $<HTMLElement>('desk-intro')
  intro.textContent = location === 'venue' ? 'Inspect the space before making any commitment.' : location === 'studio' ? 'Make a private beat at the producer desk.' : location === 'release' ? 'Prepare a private sleeve at Record Intake.' : 'Your music journey, one step at a time.'
  if (deskTab === 'today') {
    cards.innerHTML = location === 'release'
      ? `<article><div class="card-icon">▣</div><div><b>Prepare your release</b><p>Set a title, artist name and draft artwork at Record Intake.</p></div><button data-route="releaseIntake">Take me there ↗</button></article><article><div class="card-icon">⌂</div><div><b>Return to the square</b><p>Walk to the exit when finished.</p></div><button data-route="releaseExit">Show exit ↗</button></article>`
      : location === 'studio'
      ? `<article><div class="card-icon">♫</div><div><b>Make a beat</b><p>Walk to the desk and arrange four original sounds.</p></div><button data-route="studioDesk">Take me there ↗</button></article><article><div class="card-icon">⌂</div><div><b>Return to the square</b><p>Your local pattern stays on this device.</p></div><button data-route="studioExit">Show exit ↗</button></article>`
      : location === 'venue'
      ? `<article><div class="card-icon">☼</div><div><b>Inspect the stage</b><p>Preview one floor-light snap point.</p></div><button data-route="stage">Take me there ↗</button></article><article><div class="card-icon">⌂</div><div><b>Explore freely</b><p>Walk the room, then return to the square.</p></div><button data-close>Keep exploring</button></article>`
      : `<article><div class="card-icon">♫</div><div><b>Find a sound</b><p>${savedPreview ? 'Your preview is saved. Visit the station again anytime.' : 'Discover an original preview at the listening station.'}</p></div><button data-route="kiosk">Take me there ↗</button></article><article><div class="card-icon">▤</div><div><b>City Studio</b><p>Make a private beat.</p></div><button data-route="studio">Show route ↗</button></article><article><div class="card-icon">▣</div><div><b>Release House</b><p>Prepare a private sleeve draft.</p></div><button data-route="releaseEntrance">Show route ↗</button></article><article><div class="card-icon">♛</div><div><b>Explore Palm Room</b><p>Inspect the venue stage.</p></div><button data-route="palmEntrance">Show route ↗</button></article>`
  } else if (deskTab === 'ask') {
    cards.innerHTML = `<div class="ask-panel"><b>What can I do here?</b><p>${location === 'venue' ? 'Inspect the venue and preview one floor light. Leasing needs a verified server quote.' : location === 'studio' ? 'Make a private beat at the producer desk, then walk to the exit.' : location === 'release' ? 'Prepare a private sleeve. A finished master and rights review are required before submission.' : 'Listen, make a beat, prepare a release draft, or inspect Palm Room. Routes require walking.'}</p><button data-route="${location === 'venue' ? 'stage' : location === 'studio' ? 'studioDesk' : location === 'release' ? 'releaseIntake' : 'studio'}">Show a next move ↗</button></div>`
  } else {
    cards.innerHTML = `<div class="ask-panel"><b>Your local session</b><p>${savedPreview ? '♫ Tone preview saved for this session.' : 'No tone preview saved yet.'}</p><p>${beatDraftSaved ? '♫ A private beat pattern is saved on this device.' : 'No beat pattern saved yet.'}</p><p>${releaseDraft.title ? '▣ Private sleeve: ' + releaseDraft.title.replaceAll('&', '&amp;').replaceAll('<', '&lt;') : 'No release sleeve saved yet.'}</p><p>${equipmentPreviewVisible ? '☼ Temporary floor-light preview is visible.' : 'No stage preview is shown.'}</p><p>${routeTarget ? '↗ A walking route is active.' : 'No walking route selected.'}</p></div>`
  }
  cards.querySelectorAll<HTMLButtonElement>('[data-route]').forEach(button => button.addEventListener('click', () => setRoute(button.dataset.route as Hotspot)))
  cards.querySelectorAll<HTMLButtonElement>('[data-close]').forEach(button => button.addEventListener('click', closeSheets))
}

function openDesk(tab: 'today' | 'ask' | 'plans' = 'today') {
  closeSheets()
  deskTab = tab
  $<HTMLElement>('desk-sheet').hidden = false
  $<HTMLElement>('venue-card').hidden = true
  sheet = 'desk'
  document.querySelectorAll<HTMLButtonElement>('.desk-tabs button').forEach(button => { const active = button.dataset.tab === deskTab; button.classList.toggle('active', active); button.setAttribute('aria-selected', String(active)) })
  renderDesk()
  refreshContext()
}

function openMap() {
  closeSheets()
  $<HTMLElement>('venue-card').hidden = true
  renderMap()
  $<HTMLElement>('map-sheet').hidden = false
  sheet = 'action'
  refreshContext()
}

$<HTMLButtonElement>('audio').onclick = () => playing ? stopPreview() : masterPlayer ? stopMasterPreview() : toast('Choose Play at a listening station or music desk')
$<HTMLButtonElement>('desk-trigger').onclick = () => openDesk()
$<HTMLButtonElement>('desk-close').onclick = closeSheets
$<HTMLButtonElement>('action-close').onclick = closeSheets
$<HTMLButtonElement>('interact').onclick = interact
$<HTMLButtonElement>('map-button').onclick = openMap
$<HTMLButtonElement>('nav-map').onclick = openMap
$<HTMLButtonElement>('map-close').onclick = closeSheets
$<HTMLButtonElement>('nav-phone').onclick = () => { closeSheets(); $<HTMLElement>('venue-card').hidden = true; $<HTMLElement>('display-sheet').hidden = false; sheet = 'action'; updateMetrics() }
$<HTMLButtonElement>('beat-close').onclick = closeSheets
$<HTMLButtonElement>('beat-play').onclick = toggleBeat
document.querySelectorAll<HTMLButtonElement>('[data-section]').forEach(button => button.onclick = () => { beatSection = button.dataset.section as 'a' | 'b'; drawBeat() })
$<HTMLButtonElement>('beat-save').onclick = () => { localStorage.setItem('scene-beat-arrangement', JSON.stringify({ a: beatPattern, b: beatPatternB })); beatDraftSaved = true; $<HTMLElement>('beat-status').textContent = 'Two-section pattern saved on this device.'; toast('Local beat pattern saved') }
$<HTMLButtonElement>('beat-render').onclick = async () => {
  if (!sectionsDiffer(beatPattern, beatPatternB)) { $<HTMLElement>('beat-status').textContent = 'Change Section B so the arrangement has two distinct sections.'; return }
  $<HTMLElement>('beat-status').textContent = 'Rendering your 30-second master…'
  try {
    const wav = renderMasterWav(beatPattern, beatPatternB)
    const blob = new Blob([wav.buffer as ArrayBuffer], { type: 'audio/wav' })
    await saveLocalMaster(blob)
    masterBlob = blob
    localStorage.setItem('scene-beat-arrangement', JSON.stringify({ a: beatPattern, b: beatPatternB }))
    beatDraftSaved = true
    $<HTMLElement>('beat-status').textContent = '30-second private master saved on this device. Visit Release House.'
    toast('Private master ready · visit Release House')
  } catch { $<HTMLElement>('beat-status').textContent = 'Could not save the master on this device. Try again.' }
}
$<HTMLButtonElement>('release-close').onclick = closeSheets
$<HTMLButtonElement>('release-save').onclick = () => { localStorage.setItem('scene-release-draft', JSON.stringify(releaseDraft)); $<HTMLElement>('release-status').textContent = 'Private sleeve saved on this device. Not submitted or scheduled.'; toast('Private sleeve draft saved') }
$<HTMLButtonElement>('release-play').onclick = () => {
  if (!masterBlob) return
  stopMasterPreview()
  masterAudioUrl = URL.createObjectURL(masterBlob)
  masterPlayer = new Audio(masterAudioUrl)
  masterPlayer.onended = stopMasterPreview
  void masterPlayer.play().then(() => { $<HTMLButtonElement>('audio').innerHTML = '♫ <span>ON</span>'; $<HTMLButtonElement>('audio').setAttribute('aria-label', 'Audio on'); $<HTMLElement>('release-status').textContent = 'Playing your private master. Not submitted or scheduled.' }).catch(() => { $<HTMLElement>('release-status').textContent = 'Audio was blocked. Tap Play again.'; stopMasterPreview() })
}
for (const field of ['title', 'artist'] as const) $<HTMLInputElement>(`release-${field}`).oninput = event => { releaseDraft[field] = (event.target as HTMLInputElement).value; renderReleaseDraft(false) }
document.querySelectorAll<HTMLButtonElement>('[data-art]').forEach(button => button.onclick = () => { releaseDraft.artwork = button.dataset.art as ReleaseDraft['artwork']; renderReleaseDraft(false) })
$<HTMLButtonElement>('display-close').onclick = closeSheets
document.querySelectorAll<HTMLButtonElement>('[data-quality]').forEach(button => button.onclick = () => { quality = button.dataset.quality as Quality; localStorage.setItem('scene-quality', quality); applyQuality(); updateMetrics() })
$<HTMLButtonElement>('nav-create').onclick = () => location === 'studio' ? setRoute('studioDesk') : location === 'release' ? setRoute('releaseIntake') : location === 'square' ? setRoute('studio') : toast('Walk to City Studio from Music Square')
$<HTMLButtonElement>('nav-people').onclick = () => toast('Real player presence arrives with the multiplayer service')
$<HTMLButtonElement>('home').onclick = () => { closeSheets(); $<HTMLElement>('venue-card').hidden = true }
$<HTMLButtonElement>('route-close').onclick = () => { routeTarget = null; onwardTarget = null; $<HTMLElement>('route').hidden = true }
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
world.addEventListener('pointerdown', event => { dragging = true; previousX = pointerStartX = event.clientX; pointerStartY = event.clientY; pointerMoved = false; world.setPointerCapture(event.pointerId) })
world.addEventListener('pointermove', event => { if (dragging) { if (Math.hypot(event.clientX - pointerStartX, event.clientY - pointerStartY) > 7) pointerMoved = true; if (pointerMoved) yaw += (event.clientX - previousX) * .004; previousX = event.clientX } })
world.addEventListener('pointerup', event => {
  dragging = false
  if (pointerMoved || sheet !== 'none') return
  const bounds = renderer.domElement.getBoundingClientRect()
  raycaster.setFromCamera(new THREE.Vector2((event.clientX - bounds.left) / bounds.width * 2 - 1, -(event.clientY - bounds.top) / bounds.height * 2 + 1), camera)
  const hit = new THREE.Vector3()
  if (raycaster.ray.intersectPlane(ground, hit)) {
    const bounds = location === 'square' ? { minX: -18, maxX: 19, minZ: -12, maxZ: 16 } : location === 'venue' ? { minX: -12, maxX: 12, minZ: -10.5, maxZ: 11.5 } : { minX: -11.5, maxX: 11.5, minZ: -10.5, maxZ: 10.5 }
    hit.x = THREE.MathUtils.clamp(hit.x, bounds.minX, bounds.maxX)
    hit.z = THREE.MathUtils.clamp(hit.z, bounds.minZ, bounds.maxZ)
    walkTarget = hit; walkMarker.position.set(hit.x, .05, hit.z); walkMarker.visible = true
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
const frameSamples: number[] = []
let readyMs: number | null = null
function updateMetrics() {
  const summary = summarizeFrames(frameSamples)
  $<HTMLElement>('frame-metric').textContent = summary ? `${summary.medianMs.toFixed(1)} ms median · ${summary.p95Ms.toFixed(1)} ms p95 · ~${summary.fps} FPS` : 'Measuring…'
  $<HTMLElement>('transfer-metric').textContent = `${(reportedTransferBytes() / 1024).toFixed(0)} KiB reported`
  $<HTMLElement>('ready-metric').textContent = readyMs === null ? 'Measuring…' : `${(readyMs / 1000).toFixed(2)} s · first rendered avatar`
}
function frame() {
  requestAnimationFrame(frame)
  const now = performance.now(), dt = Math.min((now - previousFrame) / 1000, .05)
  if (readyMs !== null && now - previousFrame < 250) { frameSamples.push(now - previousFrame); if (frameSamples.length > 300) frameSamples.shift() }
  previousFrame = now; elapsed += dt
  const forward = (keys.has('w') || keys.has('arrowup') ? 1 : 0) - (keys.has('s') || keys.has('arrowdown') ? 1 : 0) + touchY
  const side = (keys.has('d') || keys.has('arrowright') ? 1 : 0) - (keys.has('a') || keys.has('arrowleft') ? 1 : 0) + touchX
  const speed = Math.min(1, Math.hypot(forward, side))
  if (speed > .05) clearWalkTarget()
  const remaining = walkTarget ? Math.hypot(walkTarget.x - avatar.position.x, walkTarget.z - avatar.position.z) : 0
  if (walkTarget && remaining < .18) clearWalkTarget()
  if ((speed > .05 || walkTarget) && sheet === 'none') {
    const angle = walkTarget ? Math.atan2(walkTarget.x - avatar.position.x, avatar.position.z - walkTarget.z) : Math.atan2(side, forward) + yaw
    const step = Math.min(walkTarget ? remaining : Infinity, (walkTarget ? 1 : speed) * dt * 4.25)
    const boundary = location === 'square' ? { minX: -18, maxX: 19, minZ: -12, maxZ: 16 } : location === 'venue' ? { minX: -12, maxX: 12, minZ: -10.5, maxZ: 11.5 } : { minX: -11.5, maxX: 11.5, minZ: -10.5, maxZ: 10.5 }
    avatar.position.x = THREE.MathUtils.clamp(avatar.position.x + Math.sin(angle) * step, boundary.minX, boundary.maxX)
    avatar.position.z = THREE.MathUtils.clamp(avatar.position.z - Math.cos(angle) * step, boundary.minZ, boundary.maxZ)
    avatar.rotation.y = angle
    leftLeg.rotation.x = Math.sin(elapsed * 11) * .38; rightLeg.rotation.x = -leftLeg.rotation.x
    leftArm.rotation.x = -leftLeg.rotation.x * .6; rightArm.rotation.x = -rightLeg.rotation.x * .6
  } else { leftLeg.rotation.x = rightLeg.rotation.x = leftArm.rotation.x = rightArm.rotation.x = 0 }
  const desired = avatar.position.clone().add(new THREE.Vector3(Math.sin(yaw) * 7.1, 3.85, Math.cos(yaw) * 7.1))
  camera.position.lerp(desired, 1 - Math.exp(-5 * dt))
  camera.lookAt(avatar.position.x, 1.52, avatar.position.z)
  const next = getNearby(location, avatar.position.x, avatar.position.z)
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
  renderer.render(scene, camera)
  if (readyMs === null) readyMs = performance.now()
  if (Math.floor(elapsed * 2) !== Math.floor((elapsed - dt) * 2) && !$<HTMLElement>('display-sheet').hidden) updateMetrics()
}
frame()
