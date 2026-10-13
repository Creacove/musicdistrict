import * as THREE from 'three'

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

function tileFloor(parent: THREE.Group, width: number, depth: number, color: string, grout: string) {
  const canvas = document.createElement('canvas')
  canvas.width = canvas.height = 512
  const c = canvas.getContext('2d')!
  c.fillStyle = grout
  c.fillRect(0, 0, 512, 512)
  const tiles = 4
  for (let row = 0; row < tiles; row++) for (let col = 0; col < tiles; col++) {
    c.fillStyle = color
    c.fillRect(col * 128 + 4, row * 128 + 4, 120, 120)
    c.fillStyle = 'rgba(255,255,255,.035)'
    c.fillRect(col * 128 + 5, row * 128 + 5, 118, 2)
  }
  const tex = new THREE.CanvasTexture(canvas)
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping
  tex.repeat.set(width / 4.5, depth / 4.5)
  tex.colorSpace = THREE.SRGBColorSpace
  const mesh = new THREE.Mesh(new THREE.PlaneGeometry(width, depth), new THREE.MeshStandardMaterial({ map: tex, roughness: 1 }))
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
  for (let i = 0; i < 7; i++) {
    const leaf = new THREE.Mesh(new THREE.ConeGeometry(.65, 4.3, 4), foliage)
    leaf.position.set(x + Math.cos(i * Math.PI * 2 / 7) * 1.35, height + .06, z + Math.sin(i * Math.PI * 2 / 7) * 1.35)
    leaf.rotation.z = Math.PI / 2.7
    leaf.rotation.y = i * Math.PI * 2 / 7
    parent.add(leaf)
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

export function makeSquare() {
  const root = new THREE.Group()
  root.name = 'Music Square'
  tileFloor(root, 43, 40, '#a18f7b', '#756b60')
  // Layered street edge gives the small playable square a surrounding city.
  const sand = mat('#a88b71'), pale = mat('#c5a488'), brick = mat('#805b4c'), windowGlass = mat('#d6ad78', .1, '#493320')
  for (const [x, z, w, h, face] of [[-19, -22, 7, 14, sand], [-10, -25, 8, 17, pale], [4, -24, 9, 13, brick], [17, -23, 7, 16, sand], [-23, -6, 4, 12, pale], [23, -4, 4, 14, brick]] as const) {
    box(root, w, h, 2.3, face, x, h / 2, z)
    box(root, w + .4, .36, 2.7, charcoal, x, h, z)
    for (let floor = 1; floor < h - 1; floor += 2.8) for (let col = -w / 2 + 1; col < w / 2; col += 2.3) {
      box(root, 1.05, 1.45, .08, charcoal, x + col, floor + .6, z + 1.18)
      box(root, .85, 1.25, .09, windowGlass, x + col, floor + .6, z + 1.24)
    }
  }
  for (const [x, z] of [[-16, -17], [7, -17], [20, -17]]) {
    box(root, .22, 6, .22, brass, x, 3, z)
    box(root, 1.3, .3, 1.3, charcoal, x, 6.1, z)
  }
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
  sign(root, ['GOOD MUSIC', 'BRIGHTER LAGOS'], 5.5, 2.2, -5.5, 2.8, -12.7, { bg: '#503044', ink: '#f0c98d', size: 72 })
  speaker(root, -11, 1.63, -8.35, 1.05)
  speaker(root, 0, 1.63, -8.35, 1.05)
  microphone(root, -5.5, -9.7)
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
  return root
}

export function makePalmRoom() {
  const root = new THREE.Group()
  root.name = 'Palm Room'
  tileFloor(root, 28, 27, '#876c5a', '#5d5048')
  box(root, 28, 7, .5, mat('#483c3b'), 0, 3.5, -13.25)
  box(root, .5, 7, 27, mat('#51443e'), -14, 3.5, 0)
  box(root, .5, 7, 27, mat('#51443e'), 14, 3.5, 0)
  for (const x of [-10, -5, 0, 5, 10]) box(root, .2, 7, .25, wood, x, 3.5, -12.9)
  box(root, 14.2, .8, 5, charcoal, 0, .38, -9.3)
  box(root, 14.4, .13, .16, brass, 0, .81, -6.8)
  box(root, 13.6, 5.1, .18, black, 0, 3.35, -12.82)
  sign(root, ['🌴', 'PALM ROOM'], 6.4, 3.8, 0, 3.8, -12.68, { bg: '#19181c', ink: '#f4d19a', size: 130 })
  for (const x of [-6.6, 6.6]) speaker(root, x, 1.7, -6.9, 1.6)
  microphone(root, -1.9, -8.1)
  microphone(root, 2.2, -8.1)
  // Drum kit and lighting truss are actual geometry.
  cylinder(root, .67, .67, .7, cream, 1, 1.42, -10.4, 16)
  cylinder(root, .36, .36, .37, charcoal, -.1, 1.24, -10, 14)
  cylinder(root, .42, .42, .4, charcoal, 2.1, 1.25, -10, 14)
  for (const x of [-.9, 3]) {
    cylinder(root, .025, .025, 1.2, black, x, 1.55, -9.8)
    cylinder(root, .44, .44, .03, brass, x, 2.15, -9.8, 14)
  }
  box(root, 16, .13, .13, black, 0, 5.85, -7)
  for (const x of [-6, -3, 0, 3, 6]) {
    box(root, .33, .38, .36, black, x, 5.47, -7)
  }
  box(root, 4.2, .4, .8, charcoal, 0, .19, -6.4)
  box(root, 4.4, .08, .12, brass, 0, .39, -6.0)
  const stageGlow = new THREE.PointLight('#f8b472', 13, 16)
  stageGlow.position.set(0, 4.5, -7.7)
  root.add(stageGlow)
  const performanceSpot = new THREE.SpotLight('#ffe2a8', 0, 22, Math.PI / 4, .5)
  performanceSpot.position.set(0, 6.2, -6.5)
  performanceSpot.target.position.set(0, .8, -8)
  root.add(performanceSpot)
  root.add(performanceSpot.target)
  const stageFill = new THREE.PointLight('#ff70a6', 0, 14)
  stageFill.position.set(0, 3.2, -8.5)
  root.add(stageFill)
  // Bar and lounge seating on the left.
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
  // Mixing workstation and visible equipment snap point.
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
  return {
    root,
    setEquipmentPreview(visible: boolean) { equipment.visible = visible },
    setStagePerformance(active: boolean) {
      performanceSpot.intensity = active ? 28 : 0
      stageFill.intensity = active ? 8 : 0
      stageGlow.intensity = active ? 22 : 13
    },
  }
}
