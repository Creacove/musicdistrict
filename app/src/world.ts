import * as THREE from 'three'
import { instanceStaticBoxes } from './instanceBoxes.ts'
import { createAmbientPedestrian, createServiceNpc, updateAmbientPedestrian, updateServiceNpc } from './serviceNpc.ts'
import { MUSIC_SQUARE_AMBIENT_WALKERS, sampleAmbientWalker } from './ambientNpcMotion.ts'

const mat = (color: string, metalness = 0, emissive = '#000000') =>
  new THREE.MeshStandardMaterial({ color, roughness: .78, metalness, emissive, emissiveIntensity: .45 })
const charcoal = mat('#25252a')
const black = mat('#111419')
const cream = mat('#bfae99')
const brass = mat('#c39962', .42)
const violet = mat('#7652b0', .15, '#2d1748')
const mint = mat('#0e896d', .12, '#063324')
const foliage = mat('#2a4d38')
const wood = mat('#614536')

function box(parent: THREE.Group, w: number, h: number, d: number, material: THREE.Material, x: number, y: number, z: number) {
  const mesh = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), material)
  mesh.position.set(x, y, z)
  mesh.castShadow = true
  mesh.receiveShadow = true
  parent.add(mesh)
  return mesh
}

function cylinder(parent: THREE.Group, top: number, bottom: number, height: number, material: THREE.Material, x: number, y: number, z: number, sides = 10) {
  const mesh = new THREE.Mesh(new THREE.CylinderGeometry(top, bottom, height, sides), material)
  mesh.position.set(x, y, z)
  mesh.castShadow = true
  parent.add(mesh)
  return mesh
}

function sign(parent: THREE.Group, lines: string[], width: number, height: number, x: number, y: number, z: number, opts: { bg?: string; ink?: string; size?: number; align?: CanvasTextAlign } = {}) {
  const canvas = document.createElement('canvas')
  canvas.width = 1024
  canvas.height = Math.max(256, Math.round(1024 * height / width))
  const ctx = canvas.getContext('2d')!
  ctx.fillStyle = opts.bg ?? '#1c1a1d'
  ctx.fillRect(0, 0, canvas.width, canvas.height)
  ctx.fillStyle = opts.ink ?? '#f4e2c3'
  ctx.textAlign = opts.align ?? 'center'
  ctx.textBaseline = 'middle'
  const lineHeight = opts.size ?? Math.min(104, canvas.height / (lines.length + .5))
  ctx.font = `800 ${lineHeight}px Arial`
  const start = (canvas.height - lineHeight * (lines.length - 1)) / 2
  lines.forEach((line, i) => ctx.fillText(line, canvas.width / 2, start + lineHeight * i, canvas.width - 70))
  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace
  const mesh = new THREE.Mesh(new THREE.PlaneGeometry(width, height), new THREE.MeshBasicMaterial({ map: texture }))
  mesh.position.set(x, y, z)
  parent.add(mesh)
  return mesh
}

function squareMural(parent: THREE.Group) {
  const canvas = document.createElement('canvas')
  canvas.width = 1024
  canvas.height = 360
  const c = canvas.getContext('2d')!
  const wash = c.createLinearGradient(0, 0, 1024, 360)
  wash.addColorStop(0, '#33243b')
  wash.addColorStop(.55, '#71405a')
  wash.addColorStop(1, '#c46652')
  c.fillStyle = wash
  c.fillRect(0, 0, 1024, 360)
  // Original painted skyline and rhythmic blocks, not a concept image texture.
  for (let i = 0; i < 22; i++) {
    const x = i * 49 - 10
    const h = 46 + (i * 37 % 125)
    c.fillStyle = i % 3 === 0 ? '#db8a5f' : '#a75666'
    c.fillRect(x, 360 - h, 43, h)
    c.fillStyle = '#f2ad70'
    for (let y = 360 - h + 14; y < 340; y += 24) for (let wx = x + 8; wx < x + 42; wx += 15) c.fillRect(wx, y, 5, 7)
  }
  c.save()
  c.translate(790, 145)
  c.rotate(-.13)
  c.fillStyle = '#f5b66c'
  c.font = '900 170px Arial'
  c.fillText('♪', 0, 0)
  c.restore()
  c.textAlign = 'left'
  c.shadowColor = '#211622'
  c.shadowBlur = 13
  c.fillStyle = '#ffe2a0'
  c.font = '900 82px Arial'
  c.fillText('GOOD MUSIC', 46, 116)
  c.fillStyle = '#ffffff'
  c.font = '900 76px Arial'
  c.fillText('BRIGHTER LAGOS', 46, 208)
  c.shadowBlur = 0
  c.fillStyle = '#ffc996'
  c.font = '700 25px Arial'
  c.fillText('THE SCENE  •  MUSIC SQUARE', 50, 268)
  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace
  const mural = new THREE.Mesh(new THREE.PlaneGeometry(11.4, 3.45), new THREE.MeshBasicMaterial({ map: texture }))
  mural.position.set(-5.5, 2.55, -12.7)
  parent.add(mural)
}

function tileFloor(parent: THREE.Group, width: number, depth: number, color: string, grout: string) {
  const canvas = document.createElement('canvas')
  canvas.width = canvas.height = 512
  const c = canvas.getContext('2d')!
  const relief = document.createElement('canvas')
  relief.width = relief.height = 512
  const bump = relief.getContext('2d')!
  c.fillStyle = grout
  c.fillRect(0, 0, 512, 512)
  bump.fillStyle = '#686868'
  bump.fillRect(0, 0, 512, 512)
  const tiles = 4
  let seed = 0x51ce
  const random = () => {
    seed = (seed * 1664525 + 1013904223) >>> 0
    return seed / 0x100000000
  }
  const paverTones = ['#b5a28c', '#ad9a85', '#b9a68e', '#ae9d88', '#b2a08a']
  for (let row = 0; row < tiles; row++) for (let col = 0; col < tiles; col++) {
    const x = col * 128 + 4
    const y = row * 128 + 4
    c.fillStyle = paverTones[Math.floor(random() * paverTones.length)] ?? color
    c.fillRect(x, y, 120, 120)
    c.fillStyle = 'rgba(255,255,255,.12)'
    c.fillRect(x + 2, y + 2, 116, 2)
    c.fillStyle = 'rgba(255,255,255,.045)'
    c.fillRect(x + 2, y + 3, 2, 112)
    c.fillStyle = 'rgba(48,36,27,.08)'
    c.fillRect(x + 2, y + 116, 116, 2)
    bump.fillStyle = '#a0a0a0'
    bump.fillRect(x, y, 120, 120)
    bump.fillStyle = '#b6b6b6'
    bump.fillRect(x + 2, y + 2, 116, 2)
    bump.fillStyle = '#888888'
    bump.fillRect(x + 2, y + 116, 116, 2)
    for (let fleck = 0; fleck < 28; fleck++) {
      const fx = x + 5 + Math.floor(random() * 110)
      const fy = y + 6 + Math.floor(random() * 108)
      const size = 1 + Math.floor(random() * 3)
      c.fillStyle = random() > .5 ? 'rgba(255,247,226,.09)' : 'rgba(61,48,38,.055)'
      c.fillRect(fx, fy, size, size)
      const reliefValue = 143 + Math.floor(random() * 28)
      bump.fillStyle = `rgb(${reliefValue},${reliefValue},${reliefValue})`
      bump.fillRect(fx, fy, size, size)
    }
  }
  const tex = new THREE.CanvasTexture(canvas)
  const bumpTexture = new THREE.CanvasTexture(relief)
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping
  bumpTexture.wrapS = bumpTexture.wrapT = THREE.RepeatWrapping
  tex.repeat.set(width / 4.5, depth / 4.5)
  bumpTexture.repeat.copy(tex.repeat)
  tex.colorSpace = THREE.SRGBColorSpace
  const mesh = new THREE.Mesh(new THREE.PlaneGeometry(width, depth), new THREE.MeshStandardMaterial({ map: tex, bumpMap: bumpTexture, bumpScale: .035, color: '#ffffff', roughness: .91 }))
  mesh.rotation.x = -Math.PI / 2
  mesh.receiveShadow = true
  parent.add(mesh)
  box(parent, width + .4, .22, depth + .4, mat(grout), 0, -.13, 0)
}

function lamp(parent: THREE.Group, x: number, z: number, height = 4.6) {
  cylinder(parent, .07, .1, height, black, x, height / 2, z, 8)
  box(parent, .65, .12, .65, brass, x, height - .12, z)
  box(parent, .48, .4, .48, mat('#ffddb3', .05, '#d78b43'), x, height - .4, z)
  const light = new THREE.PointLight('#ffb879', 2, 10)
  light.position.set(x, height - .4, z)
  parent.add(light)
}

function palm(parent: THREE.Group, x: number, z: number, height = 5.4) {
  const trunk = cylinder(parent, .19, .33, height, wood, x, height / 2, z, 8)
  trunk.rotation.z = .07
  for (let i = 0; i < 9; i++) {
    const angle = i * Math.PI * 2 / 9
    const direction = new THREE.Vector3(Math.cos(angle), -.28, Math.sin(angle))
    for (let segment = 0; segment < 3; segment++) {
      const start = segment * .82
      const leaf = new THREE.Mesh(new THREE.ConeGeometry(.28 - segment * .055, 1.75, 5), foliage)
      leaf.position.set(x + direction.x * (start + .8), height + direction.y * (start + .8), z + direction.z * (start + .8))
      leaf.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), direction.clone().normalize())
      parent.add(leaf)
    }
  }
}

function planter(parent: THREE.Group, x: number, z: number, w = 3.4) {
  box(parent, w, .8, 1.35, cream, x, .38, z)
  box(parent, w - .22, .04, 1.14, mat('#332b26'), x, .81, z)
  for (let i = -1; i <= 1; i++) {
    const leaf = new THREE.Mesh(new THREE.SphereGeometry(.56, 7, 5), foliage)
    leaf.position.set(x + i * (w / 4), 1.04, z)
    leaf.scale.set(1, .8, .7)
    parent.add(leaf)
  }
}

function speaker(parent: THREE.Group, x: number, y: number, z: number, scale = 1) {
  box(parent, .9 * scale, 1.65 * scale, .7 * scale, black, x, y, z)
  const coneMat = mat('#343840', .05)
  for (const offset of [-.43, .36]) {
    const cone = new THREE.Mesh(new THREE.CylinderGeometry(.29 * scale, .22 * scale, .05, 16), coneMat)
    cone.rotation.x = Math.PI / 2
    cone.position.set(x, y + offset * scale, z + .38 * scale)
    parent.add(cone)
  }
}

function microphone(parent: THREE.Group, x: number, z: number) {
  cylinder(parent, .025, .035, 1.95, black, x, 1.7, z, 8)
  const head = new THREE.Mesh(new THREE.SphereGeometry(.12, 10, 6), mat('#788088', .6))
  head.position.set(x, 2.72, z)
  parent.add(head)
  cylinder(parent, .3, .3, .04, black, x, .73, z)
}

// Cheap, authored festoon lighting gives the square its evening street identity.
// Bulbs share materials and geometry; only the existing street lamps cast light.
function festoon(parent: THREE.Group, from: [number, number, number], to: [number, number, number], count = 15) {
  const points: THREE.Vector3[] = []
  const bulbGeometry = new THREE.SphereGeometry(.095, 6, 4)
  const bulbMaterial = new THREE.MeshBasicMaterial({ color: '#ffe0a0' })
  for (let i = 0; i <= count; i++) {
    const t = i / count
    const sag = Math.sin(t * Math.PI) * .75
    const point = new THREE.Vector3(
      THREE.MathUtils.lerp(from[0], to[0], t),
      THREE.MathUtils.lerp(from[1], to[1], t) - sag,
      THREE.MathUtils.lerp(from[2], to[2], t),
    )
    points.push(point)
    if (i > 0 && i < count) {
      const bulb = new THREE.Mesh(bulbGeometry, bulbMaterial)
      bulb.position.copy(point)
      parent.add(bulb)
    }
  }
  const cable = new THREE.Line(new THREE.BufferGeometry().setFromPoints(points), new THREE.LineBasicMaterial({ color: '#28242a' }))
  parent.add(cable)
}

export function makeSquare() {
  const root = new THREE.Group()
  root.name = 'Music Square'
  tileFloor(root, 43, 40, '#b19e87', '#877868')
  // Layered street edge gives the small playable square a surrounding city.
  const sand = mat('#a88b71'), pale = mat('#c5a488'), brick = mat('#805b4c')
  const windowGlass = new THREE.MeshStandardMaterial({ color: '#c79660', roughness: .31, metalness: .06, emissive: '#7e4727', emissiveIntensity: .32 })
  for (const [x, z, w, h, face] of [[-19, -22, 7, 14, sand], [-10, -25, 8, 17, pale], [4, -24, 9, 13, brick], [17, -23, 7, 16, sand], [-23, -6, 4, 12, pale], [23, -4, 4, 14, brick]] as const) {
    box(root, w, h, 2.3, face, x, h / 2, z)
    box(root, w + .24, .5, 2.55, brick, x, .25, z + .035)
    box(root, w + .4, .36, 2.7, charcoal, x, h, z)
    for (let floor = 1; floor < h - 1; floor += 2.8) for (let col = -w / 2 + 1; col < w / 2; col += 2.3) {
      box(root, 1.05, 1.45, .08, charcoal, x + col, floor + .6, z + 1.18)
      box(root, .85, 1.25, .09, windowGlass, x + col, floor + .6, z + 1.24)
      box(root, .055, 1.2, .06, brass, x + col, floor + .6, z + 1.31)
      box(root, .96, .075, .14, cream, x + col, floor - .16, z + 1.28)
    }
  }
  for (const [x, z] of [[-16, -17], [7, -17], [20, -17]]) {
    box(root, .22, 6, .22, brass, x, 3, z)
    box(root, 1.3, .3, 1.3, charcoal, x, 6.1, z)
  }
  // Balconies, shaded storefronts and hanging lights break up the flat blockout.
  for (const [x, z, w] of [[-19, -22, 7], [-10, -25, 8], [4, -24, 9], [17, -23, 7]] as const) {
    for (const y of [3.4, 6.2, 9]) {
      box(root, w - .7, .16, 1.25, cream, x, y, z + 1.8)
      box(root, w - .8, .65, .08, charcoal, x, y + .38, z + 2.4)
      for (let rail = -w / 2 + .7; rail < w / 2; rail += .8) {
        box(root, .055, .58, .055, brass, x + rail, y + .37, z + 2.4)
      }
    }
  }
  festoon(root, [-20, 6.2, 4], [20, 6.2, 3])
  festoon(root, [-18, 6.4, -3], [19, 6.1, -4])
  festoon(root, [-17, 6.3, 11], [18, 6.1, 10])
  // Civic arcade and covered live stage.
  box(root, 28, 7.7, 3.3, cream, -3, 3.85, -18)
  box(root, 30, .55, 5.4, charcoal, -3, 4.25, -15.8)
  box(root, 12.9, 1.65, .18, black, -5.5, 5.9, -13.02)
  sign(root, ['♪  MUSIC SQUARE'], 12.4, 1.4, -5.5, 5.9, -12.89, { size: 94 })
  sign(root, ['MUSIC  ·  PEOPLE  ·  OPPORTUNITY'], 11.7, .44, -5.5, 4.92, -12.86, { bg: '#1c1a1d', ink: '#d9bd91', size: 61 })
  for (let i = 0; i < 7; i++) {
    const x = -15 + i * 3.6
    box(root, 2.55, 2.7, .08, charcoal, x, 1.65, -16.32)
    box(root, 1.98, 2.23, .09, i % 3 ? mat('#a3775b') : violet, x, 1.65, -16.24)
  }
  box(root, 13, .75, 4.7, charcoal, -5.5, .37, -10.5)
  box(root, 13.4, .15, .18, brass, -5.5, .8, -8.1)
  box(root, 11.6, 3.4, .18, mat('#3d263a'), -5.5, 2.55, -12.84)
  squareMural(root)
  // The lighting rig gives the open mic a recognizable performance silhouette.
  for (const x of [-11.9, .9]) box(root, .16, 3.8, .16, charcoal, x, 2.7, -8.05)
  box(root, 13.1, .16, .16, charcoal, -5.5, 4.58, -8.05)
  for (const x of [-10, -7.8, -5.5, -3.2, -1]) {
    cylinder(root, .19, .13, .38, black, x, 4.26, -8.04, 8)
    const lens = new THREE.Mesh(new THREE.CircleGeometry(.14, 8), new THREE.MeshBasicMaterial({ color: '#ffe8b2' }))
    lens.rotation.x = -Math.PI / 2
    lens.position.set(x, 4.05, -8.04)
    root.add(lens)
  }
  speaker(root, -11, 1.63, -8.35, 1.05)
  speaker(root, 0, 1.63, -8.35, 1.05)
  microphone(root, -5.5, -9.7)
  const performer = createAmbientPedestrian(1)
  performer.position.set(-10.1, .75, -10.5)
  performer.rotation.y = Math.PI
  root.add(performer)
  root.userData.updatePerformer = (time: number) => updateAmbientPedestrian(performer, time * .38)
  // Warm visible beams put the live act at the centre of the square at dusk.
  const beamMaterial = new THREE.MeshBasicMaterial({ color: '#ffe2ab', transparent: true, opacity: .065, depthWrite: false, side: THREE.DoubleSide })
  for (const x of [-9.7, -5.5, -1.3]) {
    const beam = new THREE.Mesh(new THREE.ConeGeometry(1.25, 3.45, 16, 1, true), beamMaterial)
    beam.position.set(x, 2.25, -9.8)
    root.add(beam)
  }
  for (const x of [-9.7, -5.5, -1.3]) {
    const light = new THREE.PointLight('#ffc883', 2.5, 8)
    light.position.set(x, 4.1, -9.4)
    root.add(light)
  }
  // Discovery kiosk: the sound source remains personal and opt-in.
  box(root, 2.85, 3.15, 1.7, mint, -8, 1.58, 2)
  box(root, 2.5, 1.75, .08, black, -8, 1.95, 2.91)
  sign(root, ['♫', 'LISTEN HERE'], 2.45, 1.6, -8, 1.95, 2.97, { bg: '#152b28', ink: '#ddfff0', size: 90 })
  const kioskRing = new THREE.Mesh(new THREE.TorusGeometry(.8, .05, 8, 32), mint)
  kioskRing.rotation.x = Math.PI / 2
  kioskRing.position.set(-8, .05, 4.1)
  root.add(kioskRing)
  // Separate reachable buildings; their concept screens are never flattened onto meshes.
  box(root, 9.5, 6, 4, mat('#4a3b39'), 11, 3, -1.8)
  box(root, 3.3, 4.2, .12, black, 10, 2.1, .27)
  box(root, 3.05, 3.93, .08, mat('#8b633f', .25), 10, 2.03, .36)
  sign(root, ['PALM ROOM'], 7, 1.13, 11, 4.8, .34, { bg: '#19181c', ink: '#e8c58d', size: 98 })
  box(root, 9, .3, 2, black, 11, 4.12, .4)
  box(root, 9, 5.5, 4, charcoal, 14, 2.75, -12)
  box(root, 3, 3.8, .09, violet, 13, 1.9, -9.9)
  sign(root, ['CITY STUDIO'], 7.5, 1.1, 14, 4.75, -9.86, { bg: '#22202d', ink: '#e6d6fa', size: 102 })
  box(root, 8.5, 5.5, 4, charcoal, -14, 2.75, -12)
  box(root, 3.2, 3.8, .12, mat('#6c395f', .1, '#35132b'), -13, 1.9, -9.85)
  sign(root, ['RELEASE HOUSE'], 7.5, 1.1, -14, 4.7, -9.78, { bg: '#201b28', ink: '#ffc1ec', size: 98 })
  // Short, visible approaches make the three entrances legible from the plaza.
  for (const [x, z, w, d] of [[-13, -5.2, 3.7, 6.3], [13, -5.2, 3.7, 6.3], [10, 2.4, 3.8, 4.3]]) {
    box(root, w, .045, d, mat('#aa9880'), x, .023, z)
    for (const edge of [-1, 1]) box(root, .07, .05, d, brass, x + edge * (w / 2 - .1), .055, z)
  }
  for (const x of [-14, 13]) {
    box(root, 5.5, .22, 1.8, wood, x, 3.95, -9.1)
    for (let i = -2; i <= 2; i++) box(root, .12, .12, 1.82, brass, x + i * .96, 4.07, -9.1)
  }
  // A physical district guide remains useful even when the map sheet is closed.
  // The studio direction stays readable from the spawn camera without inventing a travel time.
  box(root, 3.65, .92, .16, mint, .15, 3.75, -5.2)
  box(root, 3.47, .76, .18, black, .15, 3.75, -5.08)
  sign(root, ['CITY STUDIO  →'], 3.35, .68, .15, 3.75, -4.96, { bg: '#153b36', ink: '#f1f2e7', size: 86 })
  for (const x of [-1.2, 1.5]) {
    cylinder(root, .025, .025, 2.2, charcoal, x, 5.25, -5.2, 6)
  }
  cylinder(root, .075, .095, 3.2, black, 4, 1.6, 1.4, 8)
  box(root, 2.9, .72, .12, black, 4, 2.75, 1.4)
  sign(root, ['← RELEASE  ·  STUDIO →'], 2.78, .6, 4, 2.75, 1.48, { bg: '#183e39', ink: '#f6e9c9', size: 73 })
  box(root, 2.55, .62, .12, black, 4, 1.9, 1.4)
  sign(root, ['PALM ROOM  →'], 2.44, .52, 4, 1.9, 1.48, { bg: '#2c2d29', ink: '#f6e9c9', size: 82 })
  for (const [x, z] of [[-15, 9.5], [15, 9.5]]) {
    box(root, 3.1, .19, .82, wood, x, .69, z)
    for (const end of [-1, 1]) box(root, .13, .64, .72, black, x + end * 1.25, .32, z)
  }
  // Designed street furniture and warm pools of light.
  for (const [x, z] of [[-17, 3], [19, 5], [5, -6]]) palm(root, x, z)
  for (const [x, z] of [[-14, -5], [3, 8], [18, -7]]) lamp(root, x, z)
  planter(root, 1.5, 2.3, 4.4)
  planter(root, -16, 10)
  box(root, 3.8, .45, 1.1, wood, 3, .55, 9)
  for (const x of [1.45, 4.55]) box(root, .14, .85, 1.1, black, x, .43, 9)
  box(root, 2.5, 3.8, .12, black, 20, 2, -1.5)
  sign(root, ['LAGOS', 'CREATES', 'STARS'], 2.35, 3.6, 20, 2, -1.41, { bg: '#4b2c32', ink: '#f1dac0', size: 92 })
  const concierge = createServiceNpc('city-concierge')
  concierge.position.set(3.8, 0, 6.3)
  concierge.rotation.y = -Math.PI / 2
  root.add(concierge)
  root.userData.updateConcierge = (time: number) => updateServiceNpc(concierge, time)
  const crowd = new THREE.Group()
  crowd.name = 'Music Square ambient pedestrians · NPC only'
  const walkers = MUSIC_SQUARE_AMBIENT_WALKERS.map(route => {
    const actor = createAmbientPedestrian(route.variant)
    crowd.add(actor)
    return { actor, route }
  })
  root.add(crowd)
  root.userData.updateAmbientPedestrians = (time: number, enabled: boolean) => {
    crowd.visible = enabled
    for (const { actor, route } of walkers) {
      const pose = sampleAmbientWalker(route, time)
      actor.position.set(pose.x, 0, pose.z)
      actor.rotation.y = pose.heading
      if (enabled) updateAmbientPedestrian(actor, time)
    }
  }
  instanceStaticBoxes(root)
  return root
}
