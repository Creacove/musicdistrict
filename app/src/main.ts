import * as THREE from 'three'
import { getNearby, type Hotspot, type Location } from './worldModel.ts'
import { makePalmRoom, makeSquare } from './world.ts'
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
  <div id="route" class="route" hidden><span>↗</span><div><b id="route-title"></b><small id="route-distance"></small></div><button id="route-close" aria-label="Cancel route">×</button></div>

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
renderer.setPixelRatio(Math.min(devicePixelRatio, 1.5))
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFShadowMap
renderer.outputColorSpace = THREE.SRGBColorSpace
renderer.toneMapping = THREE.ACESFilmicToneMapping
renderer.toneMappingExposure = 1.16
world.appendChild(renderer.domElement)

const square = makeSquare()
scene.add(square)
let palmRoom: ReturnType<typeof makePalmRoom> | null = null
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
let yaw = 0, dragging = false, previousX = 0, touchX = 0, touchY = 0
let nearby: Hotspot | null = null
let routeTarget: Hotspot | null = null
let sheet: 'none' | 'desk' | 'action' = 'none'
let deskTab: 'today' | 'ask' | 'plans' = 'today'
let savedPreview = false, equipmentPreviewVisible = false, playing = false
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
  sheet = 'none'
  refreshContext()
}

function setRoute(target: Hotspot) {
  routeTarget = target
  $<HTMLElement>('route').hidden = false
  $<HTMLElement>('route-title').textContent = target === 'palmEntrance' ? 'PALM ROOM' : target === 'stage' ? 'STAGE SETUP' : target === 'studio' ? 'CITY STUDIO' : 'LISTENING STATION'
  closeSheets()
  toast('Follow the world marker and walk there')
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

function leaveVenue() {
  if (getNearby('venue', avatar.position.x, avatar.position.z) !== 'venueExit') { toast('Walk to the exit first'); return }
  palmRoom!.root.visible = false
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
}

function interact() {
  if (!nearby) return
  if (nearby === 'kiosk') openAction('Listening station', 'Play an original synthesized preview. No song file downloads before you choose Play.', playing ? 'Stop preview' : 'Play preview', () => { playing ? stopPreview() : startPreview(); interact() }, { label: savedPreview ? 'Saved ✓' : 'Save preview', action: () => { savedPreview = true; toast('Saved for this session'); interact() } })
  if (nearby === 'studio') openAction('City Studio', 'This door is a route landmark. The free music workstation follows in a later playable slice.', 'Set studio route', () => setRoute('studio'))
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
    studio: ['CITY STUDIO', 'Free creation space · coming next'],
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
  intro.textContent = location === 'venue' ? 'Inspect the space before making any commitment.' : 'Your music journey, one step at a time.'
  if (deskTab === 'today') {
    cards.innerHTML = location === 'venue'
      ? `<article><div class="card-icon">☼</div><div><b>Inspect the stage</b><p>Preview one floor-light snap point.</p></div><button data-route="stage">Take me there ↗</button></article><article><div class="card-icon">⌂</div><div><b>Explore freely</b><p>Walk the room, then return to the square.</p></div><button data-close>Keep exploring</button></article>`
      : `<article><div class="card-icon">♫</div><div><b>Find a sound</b><p>${savedPreview ? 'Your preview is saved. Visit the station again anytime.' : 'Discover an original preview at the listening station.'}</p></div><button data-route="kiosk">Take me there ↗</button></article><article><div class="card-icon">♛</div><div><b>Explore Palm Room</b><p>Walk to the venue entrance and inspect the stage.</p></div><button data-route="palmEntrance">Take me there ↗</button></article><article><div class="card-icon">▤</div><div><b>City Studio</b><p>Find the studio door in Music Square.</p></div><button data-route="studio">Show route ↗</button></article>`
  } else if (deskTab === 'ask') {
    cards.innerHTML = `<div class="ask-panel"><b>What can I do here?</b><p>${location === 'venue' ? 'Inspect the venue and preview one floor light. Leasing needs a verified server quote.' : 'Listen at the kiosk, walk to Palm Room, or find City Studio. All routes require walking.'}</p><button data-route="${location === 'venue' ? 'stage' : 'palmEntrance'}">Show a next move ↗</button></div>`
  } else {
    cards.innerHTML = `<div class="ask-panel"><b>Your local session</b><p>${savedPreview ? '♫ Tone preview saved for this session.' : 'No tone preview saved yet.'}</p><p>${equipmentPreviewVisible ? '☼ Temporary floor-light preview is visible.' : 'No stage preview is shown.'}</p><p>${routeTarget ? '↗ A walking route is active.' : 'No walking route selected.'}</p></div>`
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
  openDesk('ask')
  toast(location === 'venue' ? 'Stage setup is in front of you' : 'Choose a route from Desk')
}

$<HTMLButtonElement>('audio').onclick = () => playing ? stopPreview() : toast('Choose Play at the listening station')
$<HTMLButtonElement>('desk-trigger').onclick = () => openDesk()
$<HTMLButtonElement>('desk-close').onclick = closeSheets
$<HTMLButtonElement>('action-close').onclick = closeSheets
$<HTMLButtonElement>('interact').onclick = interact
$<HTMLButtonElement>('map-button').onclick = openMap
$<HTMLButtonElement>('nav-map').onclick = openMap
$<HTMLButtonElement>('nav-phone').onclick = () => openDesk('plans')
$<HTMLButtonElement>('nav-create').onclick = () => location === 'square' ? setRoute('studio') : toast('Walk to City Studio from Music Square')
$<HTMLButtonElement>('nav-people').onclick = () => toast('Real player presence arrives with the multiplayer service')
$<HTMLButtonElement>('home').onclick = () => { closeSheets(); $<HTMLElement>('venue-card').hidden = true }
$<HTMLButtonElement>('route-close').onclick = () => { routeTarget = null; $<HTMLElement>('route').hidden = true }
$<HTMLButtonElement>('venue-close').onclick = () => { $<HTMLElement>('venue-card').hidden = true; refreshContext() }
$<HTMLButtonElement>('preview-hall').onclick = () => { $<HTMLElement>('venue-card').hidden = true; refreshContext() }
$<HTMLButtonElement>('view-setup').onclick = () => { $<HTMLElement>('venue-card').hidden = true; setRoute('stage') }
document.querySelectorAll<HTMLButtonElement>('.desk-tabs button').forEach(button => button.addEventListener('click', () => openDesk(button.dataset.tab as 'today' | 'ask' | 'plans')))

window.addEventListener('keydown', event => {
  const key = event.key.toLowerCase()
  if (['w', 'a', 's', 'd', 'arrowup', 'arrowdown', 'arrowleft', 'arrowright'].includes(key)) event.preventDefault()
  keys.add(key)
  if (key === 'e' && nearby) interact()
  if (key === 'm') openMap()
  if (key === 'escape') closeSheets()
})
window.addEventListener('keyup', event => keys.delete(event.key.toLowerCase()))
window.addEventListener('blur', () => keys.clear())
world.addEventListener('pointerdown', event => { if (event.pointerType === 'mouse') { dragging = true; previousX = event.clientX; world.setPointerCapture(event.pointerId) } })
world.addEventListener('pointermove', event => { if (dragging) { yaw += (event.clientX - previousX) * .004; previousX = event.clientX } })
world.addEventListener('pointerup', () => dragging = false)
const pad = $<HTMLDivElement>('pad'), stick = $<HTMLDivElement>('stick')
function movePad(event: PointerEvent) {
  const bounds = pad.getBoundingClientRect(), dx = event.clientX - bounds.left - bounds.width / 2, dy = event.clientY - bounds.top - bounds.height / 2
  const distance = Math.max(1, Math.hypot(dx, dy)), strength = Math.min(1, distance / 43)
  touchX = dx / distance * strength; touchY = -dy / distance * strength
  stick.style.transform = `translate(${touchX * 33}px, ${-touchY * 33}px)`
}
pad.addEventListener('pointerdown', event => { pad.setPointerCapture(event.pointerId); movePad(event) })
pad.addEventListener('pointermove', event => { if (pad.hasPointerCapture(event.pointerId)) movePad(event) })
for (const name of ['pointerup', 'pointercancel']) pad.addEventListener(name, () => { touchX = touchY = 0; stick.style.transform = 'translate(0,0)' })
window.addEventListener('pagehide', stopPreview)

// Development-only visual entry point for inspecting the room in a browser.
// Normal gameplay still requires walking to the physical Palm Room entrance.
if (import.meta.env.DEV) {
  const qa = new URLSearchParams(window.location.search).get('qa')
  if (qa === 'palm' || qa === 'stage') {
    showVenue()
    if (qa === 'stage') { avatar.position.set(0, 0, -5.2); camera.position.set(0, 3.6, 2) }
  }
}

function resize() { camera.aspect = world.clientWidth / world.clientHeight; camera.fov = world.clientWidth < 700 ? 72 : 60; camera.updateProjectionMatrix(); renderer.setSize(world.clientWidth, world.clientHeight) }
window.addEventListener('resize', resize)
resize()
let previousFrame = performance.now(), elapsed = 0
function frame() {
  requestAnimationFrame(frame)
  const now = performance.now(), dt = Math.min((now - previousFrame) / 1000, .05)
  previousFrame = now; elapsed += dt
  const forward = (keys.has('w') || keys.has('arrowup') ? 1 : 0) - (keys.has('s') || keys.has('arrowdown') ? 1 : 0) + touchY
  const side = (keys.has('d') || keys.has('arrowright') ? 1 : 0) - (keys.has('a') || keys.has('arrowleft') ? 1 : 0) + touchX
  const speed = Math.min(1, Math.hypot(forward, side))
  if (speed > .05 && sheet === 'none') {
    const angle = Math.atan2(side, forward) + yaw, step = speed * dt * 4.25
    const boundary = location === 'square' ? { minX: -18, maxX: 19, minZ: -12, maxZ: 16 } : { minX: -12, maxX: 12, minZ: -10.5, maxZ: 11.5 }
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
    const points: Record<Hotspot, [number, number]> = { kiosk: [-8, 2], studio: [13, -8], palmEntrance: [10, 2], stage: [0, -7], venueExit: [-10, 9] }
    const [x, z] = points[routeTarget]
    const distance = Math.round(Math.hypot(x - avatar.position.x, z - avatar.position.z))
    $<HTMLElement>('route-distance').textContent = distance < 3 ? 'Entrance in reach · interact' : `${distance} m · walk through the world`
    if (nearby === routeTarget) $<HTMLElement>('route').classList.add('arrived')
    else $<HTMLElement>('route').classList.remove('arrived')
  }
  renderer.render(scene, camera)
}
frame()
