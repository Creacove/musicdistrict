import * as THREE from 'three'
import { createServiceNpc, updateServiceNpc } from './serviceNpc.ts'

const material = (color: string, emissive = '#000000') => new THREE.MeshStandardMaterial({ color, roughness: .78, emissive, emissiveIntensity: .35 })
const wall = material('#3b3340'), dark = material('#1a1d24'), wood = material('#604536')
const purple = material('#7450a9', '#2b1548'), teal = material('#158b7a', '#073a33')

export function makeStudio() {
  const root = new THREE.Group()
  const box = (w: number, h: number, d: number, mat: THREE.Material, x: number, y: number, z: number) => {
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat)
    mesh.position.set(x, y, z); mesh.castShadow = true; mesh.receiveShadow = true; root.add(mesh)
    return mesh
  }
  const label = (words: string, width: number, height: number, x: number, y: number, z: number, ink = '#fff1d8') => {
    const canvas = document.createElement('canvas'); canvas.width = 1024; canvas.height = 256
    const ctx = canvas.getContext('2d')!; ctx.fillStyle = '#221b28'; ctx.fillRect(0, 0, 1024, 256)
    ctx.fillStyle = ink; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.font = 'bold 104px Arial'
    ctx.fillText(words, 512, 128, 940)
    const texture = new THREE.CanvasTexture(canvas); texture.colorSpace = THREE.SRGBColorSpace
    const mesh = new THREE.Mesh(new THREE.PlaneGeometry(width, height), new THREE.MeshBasicMaterial({ map: texture }))
    mesh.position.set(x, y, z); root.add(mesh)
  }
  // One compact authored room; the square is hidden while this zone is active.
  box(26, .2, 24, material('#8d7469'), 0, -.1, 0)
  box(26, 7, .5, wall, 0, 3.5, -12)
  box(.5, 7, 24, wall, -13, 3.5, 0)
  box(.5, 7, 24, wall, 13, 3.5, 0)
  for (const x of [-10, -6, -2, 2, 6, 10]) box(.11, .02, 24, material('#6d5953'), x, .015, 0)
  label('CITY STUDIO', 8, 1.5, 0, 3.55, -11.7)
  // Producer desk, eight illuminated pads, speakers and a simple workstation screen.
  box(8, 1.1, 2.8, wood, 0, .55, -6.2)
  box(8.4, .16, 3, dark, 0, 1.2, -6.2)
  for (let i = 0; i < 8; i++) box(.58, .08, .58, i % 3 ? purple : teal, -2.9 + i * .82, 1.34, -5.4)
  box(2.8, 1.55, .12, dark, 0, 2.15, -7.5)
  box(2.52, 1.25, .03, material('#1bb897', '#086f62'), 0, 2.15, -7.42)
  for (const x of [-4.7, 4.7]) { box(1.15, 2.1, 1, dark, x, 2.15, -7.6); box(.72, .72, .07, material('#caa172'), x, 2.5, -7.04) }
  // Booth and art wall are spatial landmarks; recording stays unavailable until consent/storage exist.
  box(5, 5.5, .3, dark, 9.8, 2.75, -4)
  box(.25, 5.5, 7.2, dark, 7.2, 2.75, -7.5)
  box(2.2, 3.2, .08, material('#655475'), 7.1, 2.65, -7)
  box(.06, 1.7, .06, dark, 9.6, 1.55, -8)
  box(.35, .25, .35, material('#ddc7ad'), 9.6, 2.35, -8)
  label('VOCAL BOOTH', 3.4, .75, 9.7, 4.8, -3.8)
  for (const x of [-9, -5]) { box(2.4, 2.4, .12, purple, x, 3.2, -11.62); box(1.8, 1.8, .13, teal, x, 3.2, -11.52) }
  box(3.8, 4.4, .2, wood, -10, 2.2, 11.75)
  label('EXIT TO SQUARE', 4.3, .75, -10, 5, 11.65)
  const light = new THREE.PointLight('#e7b28e', 12, 19); light.position.set(-3, 5.8, -4); root.add(light)
  const technician = createServiceNpc('studio-technician')
  technician.position.set(3.3, 0, -3.8)
  root.add(technician)
  root.userData.updateServiceNpc = (time: number) => updateServiceNpc(technician, time)
  return root
}
