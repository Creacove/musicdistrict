import * as THREE from 'three'
import { AMBIENT_ACTOR_TRUTH } from './ambientNpcMotion.ts'

export type ServiceNpcRole = 'venue-usher' | 'studio-technician' | 'city-concierge'

export const SERVICE_NPC_ROLES = {
  'venue-usher': {
    location: 'venue', badge: 'NPC · VENUE USHER', actorType: 'NPC',
    cosmeticOnly: true, countsAsHuman: false, financialEffect: 'none',
    shirt: '#214b46', shirtAccent: '#d6aa66', trouser: '#34313b', skin: '#74452f', hair: '#211714',
  },
  'studio-technician': {
    location: 'studio', badge: 'NPC · STUDIO TECH', actorType: 'NPC',
    cosmeticOnly: true, countsAsHuman: false, financialEffect: 'none',
    shirt: '#384151', shirtAccent: '#59b7a1', trouser: '#252a34', skin: '#513222', hair: '#181313',
  },
  'city-concierge': {
    location: 'square', badge: 'NPC · CITY CONCIERGE', actorType: 'NPC',
    cosmeticOnly: true, countsAsHuman: false, financialEffect: 'none',
    shirt: '#254d45', shirtAccent: '#e1b15d', trouser: '#352d3d', skin: '#8d5524', hair: '#191512',
  },
} as const

function wovenFabric(base: string, accent: string) {
  const canvas = document.createElement('canvas')
  canvas.width = canvas.height = 128
  const ctx = canvas.getContext('2d')!
  ctx.fillStyle = base
  ctx.fillRect(0, 0, 128, 128)
  ctx.globalAlpha = .16
  for (let y = 0; y <= 128; y += 4) {
    ctx.strokeStyle = y % 8 ? '#fff5df' : '#111820'
    ctx.lineWidth = 1
    ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(128, y + 2); ctx.stroke()
  }
  ctx.globalAlpha = .6
  ctx.strokeStyle = accent
  ctx.lineWidth = 1.2
  for (let x = 0; x < 128; x += 32) for (let y = 0; y < 128; y += 32) {
    ctx.beginPath(); ctx.moveTo(x + 9, y + 16); ctx.lineTo(x + 16, y + 9); ctx.lineTo(x + 23, y + 16); ctx.lineTo(x + 16, y + 23); ctx.closePath(); ctx.stroke()
    ctx.fillRect(x + 15, y + 15, 2, 2)
  }
  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping
  texture.repeat.set(2, 2)
  return texture
}

function badgeTexture(label: string, accent: string) {
  const canvas = document.createElement('canvas')
  canvas.width = 384; canvas.height = 192
  const ctx = canvas.getContext('2d')!
  ctx.fillStyle = '#101a20'; ctx.fillRect(0, 0, canvas.width, canvas.height)
  ctx.strokeStyle = accent; ctx.lineWidth = 9; ctx.strokeRect(7, 7, canvas.width - 14, canvas.height - 14)
  ctx.fillStyle = accent; ctx.font = '900 38px Arial'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'
  ctx.fillText('NPC', canvas.width / 2, 58)
  ctx.fillStyle = '#f6eee0'; ctx.font = '800 23px Arial'
  ctx.fillText(label.replace('NPC · ', ''), canvas.width / 2, 125, canvas.width - 30)
  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace
  return texture
}

function rolePlateTexture(label: string, accent: string) {
  const canvas = document.createElement('canvas')
  canvas.width = 512; canvas.height = 128
  const ctx = canvas.getContext('2d')!
  ctx.fillStyle = 'rgba(13, 20, 25, .94)'
  ctx.beginPath(); ctx.roundRect(4, 4, 504, 120, 24); ctx.fill()
  ctx.strokeStyle = accent; ctx.lineWidth = 5
  ctx.beginPath(); ctx.roundRect(4, 4, 504, 120, 24); ctx.stroke()
  ctx.fillStyle = accent; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'
  ctx.font = '900 36px Arial'; ctx.fillText('NPC', 256, 42)
  ctx.fillStyle = '#f6eee0'; ctx.font = '800 28px Arial'
  ctx.fillText(label.replace('NPC · ', ''), 256, 84, 460)
  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace
  return texture
}

let passerbyPlate: THREE.Texture | undefined

export function createAmbientPedestrian(variant: 0 | 1): THREE.Group {
  const palettes = [
    { top: '#267566', bottom: '#3e4141', accent: '#e7c98c', skin: '#805038', hair: '#211713' },
    { top: '#5277a7', bottom: '#a96447', accent: '#edcf98', skin: '#633c2d', hair: '#171411' },
  ] as const
  const colors = palettes[variant]
  const actor = new THREE.Group()
  actor.name = 'NPC · PASSERBY'
  Object.assign(actor.userData, { ...AMBIENT_ACTOR_TRUTH, npcRole: 'ambient-pedestrian', visibleBadge: 'NPC · PASSERBY' })
  const top = new THREE.MeshStandardMaterial({ color: colors.top, roughness: .9 })
  const bottom = new THREE.MeshStandardMaterial({ color: colors.bottom, roughness: .94 })
  const skin = new THREE.MeshStandardMaterial({ color: colors.skin, roughness: .93 })
  const hair = new THREE.MeshStandardMaterial({ color: colors.hair, roughness: 1 })
  const accent = new THREE.MeshStandardMaterial({ color: colors.accent, roughness: .83 })
  const add = (geometry: THREE.BufferGeometry, material: THREE.Material, parent: THREE.Group, x = 0, y = 0, z = 0) => {
    const mesh = new THREE.Mesh(geometry, material)
    mesh.position.set(x, y, z)
    mesh.castShadow = false
    mesh.receiveShadow = false
    parent.add(mesh)
    return mesh
  }
  const torso = new THREE.Group()
  torso.position.y = 1.14
  actor.add(torso)
  add(new THREE.CapsuleGeometry(.205, .43, 3, 7), top, torso)
  add(new THREE.BoxGeometry(.025, .34, .018), accent, torso, -.16, .01, .18)
  add(new THREE.SphereGeometry(.17, 9, 7), skin, torso, 0, .61, .005)
  const hairCap = add(new THREE.SphereGeometry(.176, 8, 6), hair, torso, 0, .68, -.008)
  hairCap.scale.set(1.04, .52, 1.02)
  const legs: THREE.Group[] = []
  const arms: THREE.Group[] = []
  for (const side of [-1, 1] as const) {
    const leg = new THREE.Group()
    leg.position.set(side * .105, .83, 0)
    actor.add(leg)
    legs.push(leg)
    add(new THREE.CapsuleGeometry(.083, .36, 3, 6), bottom, leg, 0, -.24, 0)
    add(new THREE.BoxGeometry(.16, .09, .23), hair, leg, 0, -.48, .045)
    const arm = new THREE.Group()
    arm.position.set(side * .22, 1.34, 0)
    actor.add(arm)
    arms.push(arm)
    add(new THREE.CapsuleGeometry(.065, .32, 3, 6), top, arm, 0, -.18, 0)
    add(new THREE.SphereGeometry(.052, 6, 5), skin, arm, 0, -.4, .01)
  }
  if (!passerbyPlate) passerbyPlate = rolePlateTexture('NPC · PASSERBY', colors.accent)
  const label = new THREE.Sprite(new THREE.SpriteMaterial({ map: passerbyPlate, depthWrite: false }))
  label.name = 'NPC · PASSERBY role label'
  label.position.set(0, 2.22, 0)
  label.scale.set(1.12, .28, 1)
  actor.add(label)
  actor.userData.walkPose = { torso, legs, arms, phase: variant * Math.PI }
  return actor
}

export function updateAmbientPedestrian(actor: THREE.Group, time: number) {
  const pose = actor.userData.walkPose as { torso: THREE.Group; legs: THREE.Group[]; arms: THREE.Group[]; phase: number } | undefined
  if (!pose) return
  const stride = Math.sin(time * 5.4 + pose.phase)
  pose.torso.position.y = 1.14 + Math.abs(stride) * .018
  pose.legs[0].rotation.x = stride * .25
  pose.legs[1].rotation.x = -stride * .25
  pose.arms[0].rotation.x = -stride * .19
  pose.arms[1].rotation.x = stride * .19
}

function makeMesh(geometry: THREE.BufferGeometry, material: THREE.Material, parent: THREE.Group) {
  const mesh = new THREE.Mesh(geometry, material)
  mesh.castShadow = false
  mesh.receiveShadow = false
  parent.add(mesh)
  return mesh
}

export function createServiceNpc(role: ServiceNpcRole): THREE.Group {
  const spec = SERVICE_NPC_ROLES[role]
  const actor = new THREE.Group()
  actor.name = spec.badge
  actor.userData.actorType = spec.actorType
  actor.userData.serviceRole = role
  actor.userData.cosmeticOnly = spec.cosmeticOnly
  actor.userData.countsAsHuman = spec.countsAsHuman
  actor.userData.financialEffect = spec.financialEffect
  actor.userData.visibleBadge = spec.badge
  actor.userData.inspectionLabel = spec.badge

  const skin = new THREE.MeshStandardMaterial({ color: spec.skin, roughness: .91 })
  const hair = new THREE.MeshStandardMaterial({ color: spec.hair, roughness: 1 })
  const shirtTexture = wovenFabric(spec.shirt, spec.shirtAccent)
  const shirt = new THREE.MeshStandardMaterial({ map: shirtTexture, color: '#ffffff', roughness: .94 })
  const trousersTexture = wovenFabric(spec.trouser, '#a29482')
  const trousers = new THREE.MeshStandardMaterial({ map: trousersTexture, color: '#ffffff', roughness: .95 })
  const trim = new THREE.MeshStandardMaterial({ color: spec.shirtAccent, roughness: .86, metalness: .08 })
  const shoe = new THREE.MeshStandardMaterial({ color: '#1e1c1d', roughness: .8 })
  const sole = new THREE.MeshStandardMaterial({ color: '#b9ab91', roughness: .92 })
  const eyes = new THREE.MeshStandardMaterial({ color: '#f2e5d1', roughness: .72 })
  const eyeDark = new THREE.MeshStandardMaterial({ color: '#241914', roughness: .9 })

  const lower = new THREE.Group()
  const upper = new THREE.Group()
  upper.position.y = 1.06
  actor.add(lower, upper)
  makeMesh(new THREE.CapsuleGeometry(.29, .55, 4, 10), shirt, upper)
  makeMesh(new THREE.CylinderGeometry(.08, .09, .16, 10), skin, upper).position.y = .72
  makeMesh(new THREE.SphereGeometry(.22, 14, 10), skin, upper).position.set(0, .94, .015)
  const hairCap = makeMesh(new THREE.SphereGeometry(.226, 12, 8), hair, upper)
  hairCap.scale.set(1.03, .49, 1.02); hairCap.position.set(0, 1.01, -.018)

  const curls = new THREE.InstancedMesh(new THREE.SphereGeometry(.034, 6, 5), hair, 14)
  curls.castShadow = false
  const curl = new THREE.Object3D()
  for (let i = 0; i < 14; i++) {
    const x = Math.cos(i * Math.PI * 2 / 14) * .16
    const z = Math.sin(i * Math.PI * 2 / 14) * .16 - .005
    curl.position.set(x, .97 + ((i * 7) % 4) * .018, z)
    curl.scale.setScalar(.9 + (i % 3) * .08); curl.updateMatrix(); curls.setMatrixAt(i, curl.matrix)
  }
  upper.add(curls)
  for (const x of [-.085, .085]) {
    makeMesh(new THREE.SphereGeometry(.021, 7, 6), eyes, upper).position.set(x, .945, .204)
    makeMesh(new THREE.SphereGeometry(.011, 6, 5), eyeDark, upper).position.set(x, .945, .22)
  }
  const nose = makeMesh(new THREE.SphereGeometry(.027, 7, 5), skin, upper)
  nose.scale.set(.72, 1.2, .9); nose.position.set(0, .9, .219)
  makeMesh(new THREE.TorusGeometry(.19, .018, 5, 18), trim, upper).rotation.x = Math.PI / 2

  for (const x of [-.145, .145]) {
    const leg = makeMesh(new THREE.CapsuleGeometry(.115, .43, 3, 8), trousers, lower)
    leg.position.set(x, .37, 0)
    const boot = makeMesh(new THREE.BoxGeometry(.23, .14, .34), shoe, lower)
    boot.position.set(x, .12, .055)
    const outsole = makeMesh(new THREE.BoxGeometry(.24, .045, .35), sole, lower)
    outsole.position.set(x, .055, .055)
  }

  const armPivots: THREE.Group[] = []
  for (const side of [-1, 1] as const) {
    const shoulder = new THREE.Group()
    shoulder.position.set(side * .28, .43, 0)
    upper.add(shoulder)
    armPivots.push(shoulder)
    const upperArm = makeMesh(new THREE.CapsuleGeometry(.082, .26, 3, 8), shirt, shoulder)
    upperArm.position.y = -.2
    const lowerArm = makeMesh(new THREE.CapsuleGeometry(.066, .27, 3, 8), skin, shoulder)
    lowerArm.position.set(side * .015, -.51, .015)
    const hand = makeMesh(new THREE.SphereGeometry(.075, 8, 6), skin, shoulder)
    hand.position.set(side * .025, -.69, .02)
  }
  armPivots[0].rotation.z = role === 'venue-usher' ? -.14 : role === 'city-concierge' ? -.42 : .18
  armPivots[1].rotation.z = role === 'venue-usher' ? .58 : role === 'city-concierge' ? .42 : -.32

  const badge = makeMesh(new THREE.PlaneGeometry(.34, .19), new THREE.MeshBasicMaterial({ map: badgeTexture(spec.badge, spec.shirtAccent), side: THREE.DoubleSide }), upper)
  badge.position.set(0, .52, .295)
  const rolePlate = new THREE.Sprite(new THREE.SpriteMaterial({ map: rolePlateTexture(spec.badge, spec.shirtAccent), depthWrite: false }))
  rolePlate.name = 'NPC role identification'
  rolePlate.position.set(0, 2.31, 0)
  rolePlate.scale.set(1.12, .28, 1)
  actor.add(rolePlate)
  const lanyardPath = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-.075, .76, .268), new THREE.Vector3(-.045, .65, .286), new THREE.Vector3(0, .58, .294), new THREE.Vector3(.045, .65, .286), new THREE.Vector3(.075, .76, .268),
  ])
  const lanyard = makeMesh(new THREE.TubeGeometry(lanyardPath, 12, .012, 5, false), trim, upper)
  lanyard.renderOrder = 2

  const chestSeam = makeMesh(new THREE.BoxGeometry(.018, .42, .012), trim, upper)
  chestSeam.position.set(-.19, .03, .258)
  actor.userData.idlePose = { upper, armPivots, armRestZ: armPivots[1].rotation.z, phase: role === 'venue-usher' ? .4 : role === 'city-concierge' ? 1.25 : 2.1 }
  return actor
}

export function updateServiceNpc(actor: THREE.Group, time: number) {
  const pose = actor.userData.idlePose as { upper: THREE.Group; armPivots: THREE.Group[]; armRestZ: number; phase: number } | undefined
  if (!pose) return
  const breath = Math.sin(time * 1.55 + pose.phase)
  pose.upper.position.y = 1.06 + breath * .012
  pose.armPivots[0].rotation.x = Math.sin(time * .7 + pose.phase) * .025
  pose.armPivots[1].rotation.z = pose.armRestZ + Math.sin(time * .82 + pose.phase + 1) * .035
}
