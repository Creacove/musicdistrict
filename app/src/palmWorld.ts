import * as THREE from 'three'
import { createServiceNpc, updateServiceNpc } from './serviceNpc.ts'

const mat = (color: string, metalness = 0, emissive = '#000000') =>
  new THREE.MeshStandardMaterial({ color, roughness: .78, metalness, emissive, emissiveIntensity: .45 })
const charcoal = mat('#25252a')
const black = mat('#111419')
const brass = mat('#c39962', .42)
const violet = mat('#7652b0', .15, '#2d1748')
const mint = mat('#0e896d', .12, '#063324')
const foliage = mat('#2a4d38')
const wood = mat('#614536')
const cream = mat('#bfae99')

function box(parent: THREE.Group, w: number, h: number, d: number, material: THREE.Material, x: number, y: number, z: number) {
  const mesh = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), material)
  mesh.position.set(x, y, z)
  // Venue lighting uses warm area accents; reserve the one real-time shadow
  // caster for the player so low-end phones do not render every prop twice.
  mesh.castShadow = false
  mesh.receiveShadow = true
  parent.add(mesh)
  return mesh
}

function cylinder(parent: THREE.Group, top: number, bottom: number, height: number, material: THREE.Material, x: number, y: number, z: number, sides = 10) {
  const mesh = new THREE.Mesh(new THREE.CylinderGeometry(top, bottom, height, sides), material)
  mesh.position.set(x, y, z)
  mesh.castShadow = false
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

function tileFloor(parent: THREE.Group, width: number, depth: number, color: string, grout: string) {
  const canvas = document.createElement('canvas')
  canvas.width = canvas.height = 512
  const c = canvas.getContext('2d')!
  const reliefCanvas = document.createElement('canvas')
  reliefCanvas.width = reliefCanvas.height = 512
  const relief = reliefCanvas.getContext('2d')!
  c.fillStyle = grout
  c.fillRect(0, 0, 512, 512)
  relief.fillStyle = '#565656'
  relief.fillRect(0, 0, 512, 512)
  const tiles = 4
  const tones = [color, '#806653', '#8b715d', '#90745f', '#826957']
  for (let row = 0; row < tiles; row++) for (let col = 0; col < tiles; col++) {
    const x = col * 128 + 4, y = row * 128 + 4
    const gradient = c.createLinearGradient(x, y, x + 120, y + 120)
    const tone = tones[(row * 7 + col * 3) % tones.length]
    gradient.addColorStop(0, tone); gradient.addColorStop(1, '#59483f')
    c.fillStyle = gradient; c.fillRect(x, y, 120, 120)
    c.fillStyle = 'rgba(255,255,255,.08)'; c.fillRect(x + 1, y + 1, 118, 2)
    c.fillStyle = 'rgba(18,15,15,.12)'; c.fillRect(x + 1, y + 117, 118, 2)
    relief.fillStyle = '#a2a2a2'; relief.fillRect(x, y, 120, 120)
    relief.fillStyle = '#b8b8b8'; relief.fillRect(x + 1, y + 1, 118, 3)
    relief.fillStyle = '#878787'; relief.fillRect(x + 1, y + 116, 118, 3)
    for (let speck = 0; speck < 48; speck++) {
      const hash = (row * 977 + col * 619 + speck * 313) % 997
      const sx = x + 5 + (hash * 37 % 110), sy = y + 5 + (hash * 71 % 110)
      c.fillStyle = speck % 2 ? 'rgba(35,24,20,.045)' : 'rgba(255,232,192,.055)'
      c.fillRect(sx, sy, speck % 5 === 0 ? 2 : 1, 1)
      const shade = speck % 2 ? '#949494' : '#aaaaaa'
      relief.fillStyle = shade; relief.fillRect(sx, sy, 1, 1)
    }
  }
  const tex = new THREE.CanvasTexture(canvas)
  const bump = new THREE.CanvasTexture(reliefCanvas)
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping
  bump.wrapS = bump.wrapT = THREE.RepeatWrapping
  tex.repeat.set(width / 4.5, depth / 4.5)
  bump.repeat.copy(tex.repeat)
  tex.colorSpace = THREE.SRGBColorSpace
  const mesh = new THREE.Mesh(new THREE.PlaneGeometry(width, depth), new THREE.MeshStandardMaterial({ map: tex, bumpMap: bump, bumpScale: .016, roughness: .86, metalness: .025 }))
  mesh.rotation.x = -Math.PI / 2
  mesh.receiveShadow = true
  parent.add(mesh)
  box(parent, width + .4, .22, depth + .4, mat(grout), 0, -.13, 0)
}

function openSkyline(parent: THREE.Group) {
  const canvas = document.createElement('canvas')
  canvas.width = 1024; canvas.height = 384
  const ctx = canvas.getContext('2d')!
  const sky = ctx.createLinearGradient(0, 0, 0, 384)
  sky.addColorStop(0, '#272b43'); sky.addColorStop(.62, '#65536a'); sky.addColorStop(1, '#d78b64')
  ctx.fillStyle = sky; ctx.fillRect(0, 0, 1024, 384)
  const haze = ctx.createRadialGradient(710, 325, 8, 710, 325, 350)
  haze.addColorStop(0, 'rgba(255,185,116,.44)'); haze.addColorStop(1, 'rgba(255,185,116,0)')
  ctx.fillStyle = haze; ctx.fillRect(0, 120, 1024, 264)
  ctx.fillStyle = '#45414d'
  const buildings = [58, 96, 142, 188, 214, 264, 308, 352, 416, 451, 508, 554, 596, 643, 706, 755, 806, 852, 902, 949, 982]
  buildings.forEach((x, i) => {
    const width = 18 + (i * 17 % 31), height = 38 + (i * 29 % 124)
    ctx.fillStyle = i % 4 === 0 ? '#393744' : '#45414d'
    ctx.beginPath()
    ctx.moveTo(x, 352 - height + 9); ctx.lineTo(x + width * .12, 352 - height + 3)
    ctx.lineTo(x + width * .35, 352 - height + (i % 3 === 0 ? 0 : 8))
    ctx.lineTo(x + width * .68, 352 - height + 5); ctx.lineTo(x + width, 352 - height + 11)
    ctx.lineTo(x + width, 384); ctx.lineTo(x, 384); ctx.closePath(); ctx.fill()
    ctx.fillStyle = '#52505c'; ctx.fillRect(x + 2, 352 - height + 13, 2, height - 12)
    ctx.fillStyle = '#45414d'
    ctx.fillStyle = 'rgba(255,207,153,.46)'
    for (let wy = 360 - height; wy < 346; wy += 14) for (let wx = x + 4; wx < x + width - 3; wx += 9) {
      if ((wx * 3 + wy * 5 + i) % 5 === 0) ctx.fillRect(wx, wy, 3, 5)
    }
    ctx.fillStyle = '#45414d'
    if (i % 4 === 1) {
      ctx.fillRect(x + width * .55, 342 - height, 3, 15)
      ctx.beginPath(); ctx.arc(x + width * .56 + 1.5, 340 - height, 4, 0, Math.PI * 2); ctx.fill()
    }
  })
  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace
  const skyline = new THREE.Mesh(new THREE.PlaneGeometry(40, 11), new THREE.MeshBasicMaterial({ map: texture, side: THREE.DoubleSide, fog: false }))
  skyline.name = 'Lagos dusk skyline'
  skyline.position.set(0, 12.6, -12.96)
  parent.add(skyline)
}

function tubeBetween(parent: THREE.Group, from: THREE.Vector3, to: THREE.Vector3, radius: number, material: THREE.Material) {
  const direction = new THREE.Vector3().subVectors(to, from)
  const mesh = new THREE.Mesh(new THREE.CylinderGeometry(radius, radius, direction.length(), 8), material)
  mesh.position.copy(from).add(to).multiplyScalar(.5)
  mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), direction.normalize())
  mesh.castShadow = false
  parent.add(mesh)
  return mesh
}

function frontDrum(parent: THREE.Group, x: number, y: number, z: number, radius: number, depth: number, shell: THREE.Material) {
  const drum = new THREE.Mesh(new THREE.CylinderGeometry(radius, radius, depth, 20), shell)
  drum.rotation.x = Math.PI / 2
  drum.position.set(x, y, z)
  drum.castShadow = false
  parent.add(drum)
  const head = new THREE.Mesh(new THREE.CircleGeometry(radius * .9, 24), cream)
  head.position.set(x, y, z + depth / 2 + .012)
  parent.add(head)
  const rim = new THREE.Mesh(new THREE.TorusGeometry(radius * .93, .035, 6, 24), brass)
  rim.position.set(x, y, z + depth / 2 + .025)
  parent.add(rim)
  return drum
}

function palmRoomBackdrop(parent: THREE.Group) {
  const canvas = document.createElement('canvas')
  canvas.width = 1024
  canvas.height = 768
  const ctx = canvas.getContext('2d')!
  const glow = ctx.createRadialGradient(512, 265, 20, 512, 280, 500)
  glow.addColorStop(0, '#39293d')
  glow.addColorStop(.62, '#211c29')
  glow.addColorStop(1, '#13151b')
  ctx.fillStyle = glow
  ctx.fillRect(0, 0, 1024, 768)
  ctx.strokeStyle = 'rgba(219,176,111,.52)'
  ctx.lineWidth = 5
  ctx.strokeRect(24, 24, 976, 720)

  // A clean, authored palm mark keeps the venue sign legible on mobile without
  // relying on platform-specific emoji rendering.
  ctx.save()
  ctx.translate(512, 48)
  ctx.strokeStyle = '#f2cf93'
  ctx.lineWidth = 12
  ctx.lineCap = 'round'
  ctx.beginPath()
  ctx.moveTo(0, 188)
  ctx.quadraticCurveTo(-18, 116, 0, 18)
  ctx.stroke()
  for (let i = 0; i < 9; i++) {
    const angle = -Math.PI + i * Math.PI / 8
    const endX = Math.cos(angle) * 160
    const endY = Math.sin(angle) * 96
    ctx.beginPath()
    ctx.moveTo(0, 42)
    ctx.quadraticCurveTo(endX * .44, endY - 12, endX, endY)
    ctx.stroke()
    for (let leaflet = 1; leaflet <= 5; leaflet++) {
      const t = leaflet / 6
      const px = endX * t
      const py = 42 + (endY - 42) * t
      const side = i < 4 ? 1 : -1
      ctx.beginPath()
      ctx.moveTo(px, py)
      ctx.lineTo(px + side * 15, py + 14)
      ctx.stroke()
    }
  }
  ctx.restore()

  ctx.fillStyle = '#f6dfb7'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.font = '700 170px Georgia, serif'
  ctx.fillText('PALM', 512, 486)
  ctx.fillText('ROOM', 512, 657)
  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace
  const sign = new THREE.Mesh(new THREE.PlaneGeometry(6.5, 4.8), new THREE.MeshBasicMaterial({ map: texture }))
  sign.position.set(0, 3.45, -12.68)
  parent.add(sign)
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

function palm(parent: THREE.Group, x: number, z: number, height = 5.4) {
  const trunk = cylinder(parent, .19, .33, height, wood, x, height / 2, z, 8)
  trunk.rotation.z = .07
  for (let i = 0; i < 7; i++) {
    const leaf = new THREE.Mesh(new THREE.ConeGeometry(.65, 4.3, 4), foliage)
    leaf.position.set(x + Math.cos(i * Math.PI * 2 / 7) * 1.35, height + .06, z + Math.sin(i * Math.PI * 2 / 7) * 1.35)
    leaf.rotation.z = Math.PI / 2.7
    leaf.rotation.y = i * Math.PI * 2 / 7
    parent.add(leaf)
  }
}

export function makePalmRoom() {
  const root = new THREE.Group()
  root.name = 'Palm Room'
  tileFloor(root, 40, 40, '#876c5a', '#5d5048')
  box(root, 40, 7, .5, mat('#5a4840'), 0, 3.5, -13.25)
  box(root, .5, 7, 40, mat('#51443e'), -20, 3.5, 0)
  box(root, .5, 7, 40, mat('#51443e'), 20, 3.5, 0)
  openSkyline(root)
  for (const x of [-10, -5, 0, 5, 10]) box(root, .2, 7, .25, wood, x, 3.5, -12.9)
  box(root, 14.2, .8, 5, charcoal, 0, .38, -9.3)
  box(root, 14.4, .13, .16, brass, 0, .81, -6.8)
  box(root, 13.6, 5.1, .18, mat('#2b242e'), 0, 3.35, -12.82)
  palmRoomBackdrop(root)
  for (const x of [-6.6, 6.6]) speaker(root, x, 1.7, -6.9, 1.6)
  const drumShell = mat('#6e3733', .12)
  // Compact, recognisable house kit; the front heads face the room rather than
  // reading as anonymous cylinders from the arrival camera.
  frontDrum(root, -.35, 1.36, -9.2, .68, .8, drumShell)
  frontDrum(root, -1.35, 2.05, -9.5, .32, .48, drumShell)
  frontDrum(root, -.55, 2.18, -9.57, .36, .48, drumShell)
  frontDrum(root, .25, 2.1, -9.5, .31, .46, drumShell)
  frontDrum(root, 1.05, 1.45, -9.35, .37, .5, drumShell)
  const chrome = mat('#a8afb4', .68)
  const cymbal = new THREE.MeshStandardMaterial({ color: '#c6a562', metalness: .7, roughness: .36 })
  for (const [x, z, h, radius] of [[-2.05, -9.1, 2.8, .62], [1.9, -9.05, 3.05, .7], [0, -10.05, 2.7, .54]] as const) {
    cylinder(root, .025, .035, h - .82, chrome, x, .8 + (h - .82) / 2, z, 8)
    const disc = new THREE.Mesh(new THREE.CylinderGeometry(radius * .92, radius, .05, 24), cymbal)
    disc.position.set(x, h, z)
    disc.rotation.z = .05
    disc.castShadow = false
    root.add(disc)
    cylinder(root, .045, .055, .1, brass, x, h + .06, z, 8)
    for (const angle of [0, 2.1, 4.2]) {
      tubeBetween(root, new THREE.Vector3(x, .87, z), new THREE.Vector3(x + Math.cos(angle) * .42, .82, z + Math.sin(angle) * .42), .025, chrome)
    }
  }
  cylinder(root, .16, .16, .12, charcoal, -.35, 2.14, -10.2, 12)
  // Keyboard, floor monitors and amp stack make the platform read as a working
  // rehearsal stage. These are scene fixtures only; no inventory is implied.
  box(root, 1.95, .18, .82, charcoal, 3.35, 2.06, -9.25)
  const whiteKeys = new THREE.InstancedMesh(new THREE.BoxGeometry(.108, .045, .42), cream, 16)
  const blackKeys = new THREE.InstancedMesh(new THREE.BoxGeometry(.066, .065, .24), black, 12)
  const matrix = new THREE.Matrix4()
  for (let i = 0; i < 16; i++) {
    const x = 2.42 + i * .12
    matrix.makeTranslation(x, 2.17, -8.99)
    whiteKeys.setMatrixAt(i, matrix)
  }
  let blackIndex = 0
  for (let i = 0; i < 16; i++) {
    if ([2, 6, 9, 14].includes(i % 7)) continue
    const x = 2.48 + i * .12
    matrix.makeTranslation(x, 2.21, -9.15)
    blackKeys.setMatrixAt(blackIndex++, matrix)
  }
  whiteKeys.instanceMatrix.needsUpdate = true
  blackKeys.instanceMatrix.needsUpdate = true
  root.add(whiteKeys, blackKeys)
  tubeBetween(root, new THREE.Vector3(2.56, .9, -9.56), new THREE.Vector3(2.72, 1.98, -9.34), .045, chrome)
  tubeBetween(root, new THREE.Vector3(4.12, .9, -9.56), new THREE.Vector3(3.98, 1.98, -9.34), .045, chrome)
  for (const x of [-4.2, 4.45]) {
    const monitor = box(root, 1.15, .42, .95, black, x, .98, -6.84)
    monitor.rotation.x = -.18
    const grille = new THREE.Mesh(new THREE.CircleGeometry(.25, 16), mat('#444951'))
    grille.position.set(x, 1.1, -6.32)
    grille.rotation.x = Math.PI / 2
    root.add(grille)
  }
  box(root, 1.35, 1.18, .82, black, 5.35, 1.38, -10.15)
  box(root, 1.42, .075, .9, brass, 5.35, 2.0, -10.15)
  box(root, 1.2, .92, .08, mat('#303239'), 5.35, 1.4, -9.7)
  for (const y of [1.13, 1.64]) {
    const cone = new THREE.Mesh(new THREE.CylinderGeometry(.26, .24, .045, 18), mat('#555a60'))
    cone.rotation.x = Math.PI / 2
    cone.position.set(5.35, y, -9.64)
    root.add(cone)
  }
  for (const [x, z] of [[-5.3, -7.1], [6.45, -7.0]] as const) {
    box(root, 1.25, .82, .9, mat('#34383e', .28), x, 1.19, z)
    for (const y of [.93, 1.42]) box(root, 1.31, .035, .94, brass, x, y, z)
    for (const side of [-1, 1]) cylinder(root, .035, .035, .04, black, x + side * .46, 1.63, z, 8)
  }
  const cableMaterial = mat('#1d2024')
  for (const points of [
    [[-1.9, .84, -7.9], [-2.9, .85, -7.45], [-3.35, .84, -7.9], [-4.2, .84, -6.84]],
    [[2.2, .84, -7.9], [3.2, .85, -7.55], [3.7, .84, -7.95], [4.45, .84, -6.84]],
  ] as const) {
    const curve = new THREE.CatmullRomCurve3(points.map(([x, y, z]) => new THREE.Vector3(x, y, z)))
    root.add(new THREE.Mesh(new THREE.TubeGeometry(curve, 18, .022, 5, false), cableMaterial))
  }
  microphone(root, -1.9, -8.1)
  microphone(root, 2.2, -8.1)
  cylinder(root, .67, .67, .7, cream, 1, 1.42, -10.4, 16)
  cylinder(root, .36, .36, .37, charcoal, -.1, 1.24, -10, 14)
  cylinder(root, .42, .42, .4, charcoal, 2.1, 1.25, -10, 14)
  for (const x of [-.9, 3]) {
    cylinder(root, .025, .025, 1.2, black, x, 1.55, -9.8)
    cylinder(root, .44, .44, .03, brass, x, 2.15, -9.8, 14)
  }
  const truss = mat('#657079', .7)
  for (const z of [-7.7, -8.25]) tubeBetween(root, new THREE.Vector3(-7.2, 5.85, z), new THREE.Vector3(7.2, 5.85, z), .075, truss)
  for (const x of [-7.2, 7.2]) tubeBetween(root, new THREE.Vector3(x, 5.05, -7.7), new THREE.Vector3(x, 5.85, -7.7), .09, truss)
  for (let x = -6.4; x < 7; x += 1.6) {
    tubeBetween(root, new THREE.Vector3(x, 5.85, -7.7), new THREE.Vector3(x + 1.6, 5.85, -8.25), .035, truss)
    tubeBetween(root, new THREE.Vector3(x, 5.85, -8.25), new THREE.Vector3(x + 1.6, 5.85, -7.7), .035, truss)
  }
  const performanceBeams = new THREE.Group()
  const beamMeshes: THREE.Mesh[] = []
  for (const [x, color] of [[-4.7, '#f5c881'], [0, '#fff0cf'], [4.7, '#ee9dbb']] as const) {
    box(root, .55, .32, .44, black, x, 5.55, -7.85)
    const lens = new THREE.Mesh(new THREE.SphereGeometry(.15, 10, 8), mat(color, .05, color))
    lens.position.set(x, 5.36, -7.58)
    root.add(lens)
    const beam = new THREE.Mesh(new THREE.ConeGeometry(1.45, 4.2, 12, 1, true), new THREE.MeshBasicMaterial({ color, transparent: true, opacity: .045, depthWrite: false, side: THREE.DoubleSide }))
    beam.position.set(x * .45, 3.2, -8.6)
    beam.rotation.x = Math.PI
    performanceBeams.add(beam)
    beamMeshes.push(beam)
  }
  performanceBeams.visible = false
  root.add(performanceBeams)
  box(root, 4.2, .4, .8, charcoal, 0, .19, -6.4)
  box(root, 4.4, .08, .12, brass, 0, .39, -6.0)
  const stageGlow = new THREE.PointLight('#f8b472', 13, 16)
  stageGlow.position.set(0, 4.5, -7.7)
  root.add(stageGlow)
  const roomWash = new THREE.PointLight('#f3c998', 16, 38)
  roomWash.position.set(0, 8.5, 5.5)
  root.add(roomWash)
  const performanceSpot = new THREE.SpotLight('#ffe2a8', 0, 25, Math.PI / 4, .5)
  performanceSpot.position.set(0, 6.2, -6.5)
  performanceSpot.target.position.set(0, .8, -8)
  root.add(performanceSpot)
  root.add(performanceSpot.target)
  const stageFill = new THREE.PointLight('#ff70a6', 1.8, 18)
  stageFill.position.set(-3.4, 3.2, -8.5)
  root.add(stageFill)
  const stageEdge = new THREE.PointLight('#e8a961', 3.4, 15)
  stageEdge.position.set(4.5, 3.1, -9)
  root.add(stageEdge)
  box(root, 6.5, 1.2, 1.35, wood, -9.4, .6, -3)
  box(root, 6.7, .13, 1.55, brass, -9.4, 1.2, -3)
  for (const y of [2.2, 3.35]) {
    box(root, 6.3, .1, .65, wood, -9.4, y, -5.7)
    for (let i = 0; i < 7; i++) cylinder(root, .1, .13, .5, mat(i % 2 ? '#bb8d51' : '#63906b', .3), -12 + i * .83, y + .29, -5.65)
  }
  const barGlow = new THREE.PointLight('#efaa65', 6, 11)
  barGlow.position.set(-10, 3.5, -4.8)
  root.add(barGlow)
  for (const [x, z] of [[-9, 4], [-5.5, 6], [5, 4], [8.8, 1.3]]) {
    cylinder(root, .58, .6, .11, wood, x, .72, z, 12)
    cylinder(root, .055, .055, .65, black, x, .36, z)
    for (let i = 0; i < 2; i++) box(root, .65, .72, .68, mat('#41615d'), x + (i ? 1.1 : -1.1), .37, z)
    cylinder(root, .08, .08, .16, mat('#ffe3a3', .2, '#ffb875'), x, .82, z)
  }
  box(root, 4.2, 1.2, 1.7, charcoal, 8.8, .6, 7.4)
  box(root, 3.8, .12, 1.4, mat('#4e5965', .45), 8.8, 1.27, 7.4)
  for (let i = 0; i < 14; i++) box(root, .09, .06, .09, i % 3 ? violet : mint, 7.2 + (i % 7) * .5, 1.36, 7.1 + Math.floor(i / 7) * .34)
  box(root, 1.05, .8, .07, black, 9.5, 1.72, 6.92)
  box(root, .9, .62, .04, violet, 9.5, 1.72, 6.98)
  sign(root, ['MUSIC', 'PEOPLE', 'GOOD TIMES'], 2.2, 3.4, -12.6, 3.1, -8.3, { bg: '#332924', ink: '#f8d195', size: 78 })
  sign(root, ['LAGOS', 'SOUNDS', 'BETTER'], 2.1, 3.3, 12.6, 3.2, -7.8, { bg: '#552c3f', ink: '#ffdcb2', size: 82 })
  for (const [x, z] of [[-11, 9], [11, -3]]) palm(root, x, z, 3.2)
  box(root, 3.2, 4.5, .16, wood, -10, 2.25, 12.45)
  sign(root, ['EXIT TO SQUARE'], 3.6, .64, -10, 5.1, 12.53, { bg: '#22252a', ink: '#f3ebd7', size: 100 })
  const equipment = new THREE.Group()
  box(equipment, .9, .7, .8, black, 3.2, 1.1, -6.6)
  cylinder(equipment, .1, .12, .7, black, 3.2, 1.78, -6.6)
  const bulb = new THREE.Mesh(new THREE.SphereGeometry(.22, 10, 8), mat('#ffe1a7', .1, '#ff9f3c'))
  bulb.position.set(3.2, 2.15, -6.6)
  equipment.add(bulb)
  const equipmentLight = new THREE.PointLight('#e295ff', 3, 7)
  equipmentLight.position.set(1.5, 2.5, -6.6)
  equipment.add(equipmentLight)
  equipment.visible = false
  root.add(equipment)
  type StageLook = 'warm' | 'sunset' | 'spotlight'
  let currentLook: StageLook = 'warm'
  let performanceActive = false
  const applyStageLook = () => {
    const look = currentLook === 'warm'
      ? { spot: '#ffe2a8', fill: '#e8906a', glow: 16, spotPower: 4, fillPower: 1.8, beamColors: ['#f5c881', '#fff0cf', '#ee9dbb'], beam: .045 }
      : currentLook === 'sunset'
        ? { spot: '#ffc16e', fill: '#ff5d9c', glow: 17, spotPower: 7, fillPower: 5, beamColors: ['#ffb45d', '#ffe0a0', '#f05e9a'], beam: .075 }
        : { spot: '#fff0d2', fill: '#9b71db', glow: 14, spotPower: 12, fillPower: .6, beamColors: ['#8d72d1', '#fff3db', '#8d72d1'], beam: .055 }
    performanceSpot.color.set(look.spot)
    stageFill.color.set(look.fill)
    stageGlow.intensity = performanceActive ? 22 : look.glow
    performanceSpot.intensity = performanceActive ? 28 : look.spotPower
    stageFill.intensity = performanceActive ? 8 : look.fillPower
    beamMeshes.forEach((beam, index) => {
      const material = beam.material as THREE.MeshBasicMaterial
      material.color.set(look.beamColors[index])
      material.opacity = performanceActive ? .12 : look.beam
    })
  }
  applyStageLook()
  const usher = createServiceNpc('venue-usher')
  usher.position.set(-4.8, 0, 1.4)
  root.add(usher)

  return {
    root,
    update(time: number) { updateServiceNpc(usher, time) },
    setEquipmentPreview(visible: boolean) { equipment.visible = visible },
    setStageLook(look: StageLook) { currentLook = look; applyStageLook() },
    setStagePerformance(active: boolean) {
      performanceActive = active
      applyStageLook()
      performanceBeams.visible = active
    },
  }
}
