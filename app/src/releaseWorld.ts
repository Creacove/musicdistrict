import * as THREE from 'three'

const mat = (color: string, glow = '#000000') => new THREE.MeshStandardMaterial({ color, roughness: .78, emissive: glow, emissiveIntensity: .42 })
export function makeReleaseHouse() {
  const root = new THREE.Group(); root.name = 'Release House'
  const ink = mat('#1a1723'), wall = mat('#39303c'), rose = mat('#b24087', '#641d4b'), brass = mat('#c99868')
  const box = (w: number, h: number, d: number, material: THREE.Material, x: number, y: number, z: number) => {
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), material)
    mesh.position.set(x, y, z); mesh.castShadow = true; mesh.receiveShadow = true; root.add(mesh); return mesh
  }
  const sign = (words: string, w: number, h: number, x: number, y: number, z: number, color = '#fff3dc') => {
    const canvas = document.createElement('canvas'); canvas.width = 1024; canvas.height = 256
    const ctx = canvas.getContext('2d')!; ctx.fillStyle = '#211b2a'; ctx.fillRect(0, 0, 1024, 256)
    ctx.fillStyle = color; ctx.font = 'bold 105px Arial'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'
    ctx.fillText(words, 512, 128, 950)
    const texture = new THREE.CanvasTexture(canvas); texture.colorSpace = THREE.SRGBColorSpace
    const mesh = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({ map: texture }))
    mesh.position.set(x, y, z); root.add(mesh)
  }
  box(26, .2, 24, mat('#65545a'), 0, -.1, 0)
  box(26, 7, .4, wall, 0, 3.5, -12); box(.4, 7, 24, wall, -13, 3.5, 0); box(.4, 7, 24, wall, 13, 3.5, 0)
  for (const x of [-9, -4, 1, 6, 11]) box(.12, .02, 24, mat('#837077'), x, .02, 0)
  sign('RELEASE HOUSE', 8.8, 2.1, 0, 5.3, -11.7, '#ffbce9')
  // Record intake: physical desk, sleeve, turntable and a lit preflight station.
  box(8.5, 1.35, 2.7, ink, 0, .68, -6)
  box(8.8, .16, 3, brass, 0, 1.43, -6)
  box(2.8, 2.2, .22, rose, -2.3, 2.65, -7.35)
  box(2.35, 1.75, .03, mat('#301e3a'), -2.3, 2.65, -7.2)
  box(2.3, 1.6, .15, ink, 2.4, 2.2, -7.35)
  box(1.95, 1.3, .06, mat('#139578', '#0b473e'), 2.4, 2.2, -7.22)
  sign('RECORD INTAKE', 5.6, .8, 0, 3.75, -7.52)
  // Artwork gallery uses authored geometry. These are empty sample frames, not actual catalogue covers.
  sign('ARTWORK WALL', 5.5, .8, -7.8, 5.65, -11.68)
  for (const [i, x] of [-10.2, -7.8, -5.4].entries()) {
    box(1.9, 2.1, .1, brass, x, 3.5, -11.65)
    box(1.7, 1.9, .12, [rose, mat('#4c77a5'), mat('#1c8a79')][i], x, 3.5, -11.55)
    box(.9, .9, .14, mat('#efb782'), x + .2, 3.7, -11.46)
  }
  // Listening station is present, but release playback stays gated until a valid rendered master exists.
  box(4.4, 3.7, .18, ink, 9.5, 2.4, -7.4)
  sign('LISTENING', 3.5, .72, 9.5, 4.45, -7.28)
  box(2.7, 1.1, 1.3, mat('#493847'), 9.5, .55, -5.8)
  box(4, 4.2, .2, ink, -10, 2.1, 11.7)
  sign('EXIT TO SQUARE', 4.7, .75, -10, 5.05, 11.58)
  const light = new THREE.PointLight('#f5aecc', 11, 19); light.position.set(0, 5.4, -4.5); root.add(light)
  return root
}
