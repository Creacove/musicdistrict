import * as THREE from 'three'

type BoxEntry = { mesh: THREE.Mesh; material: THREE.Material; matrix: THREE.Matrix4 }

function staticMaterialKey(material: THREE.Material) {
  const value = material as THREE.Material & {
    color?: THREE.Color; emissive?: THREE.Color; emissiveIntensity?: number
    roughness?: number; metalness?: number; map?: THREE.Texture | null
  }
  return [
    material.type,
    value.color?.getHexString() ?? '',
    value.emissive?.getHexString() ?? '',
    value.emissiveIntensity ?? '',
    value.roughness ?? '',
    value.metalness ?? '',
    value.map?.uuid ?? '',
    material.transparent,
    material.opacity,
    material.side,
    material.depthWrite,
  ].join('|')
}

/** Replace static BoxGeometry meshes with unit-box instances, grouped by equivalent material. */
export function instanceStaticBoxes(root: THREE.Group) {
  root.updateMatrixWorld(true)
  const rootInverse = root.matrixWorld.clone().invert()
  const buckets = new Map<string, BoxEntry[]>()
  root.traverse(object => {
    if (!(object instanceof THREE.Mesh) || object instanceof THREE.InstancedMesh) return
    if (!(object.geometry instanceof THREE.BoxGeometry) || Array.isArray(object.material)) return
    const mesh = object as THREE.Mesh<THREE.BoxGeometry, THREE.Material>
    const { width, height, depth } = mesh.geometry.parameters
    const dimensions = new THREE.Matrix4().makeScale(width, height, depth)
    const matrix = rootInverse.clone().multiply(mesh.matrixWorld).multiply(dimensions)
    const key = staticMaterialKey(mesh.material)
    const entries = buckets.get(key) ?? []
    entries.push({ mesh, material: mesh.material, matrix })
    buckets.set(key, entries)
  })

  let sourceBoxes = 0
  for (const entries of buckets.values()) {
    const batch = new THREE.InstancedMesh(new THREE.BoxGeometry(1, 1, 1), entries[0]!.material, entries.length)
    batch.name = `Static box batch (${entries.length})`
    batch.castShadow = entries.some(entry => entry.mesh.castShadow)
    batch.receiveShadow = entries.some(entry => entry.mesh.receiveShadow)
    entries.forEach((entry, index) => batch.setMatrixAt(index, entry.matrix))
    batch.instanceMatrix.needsUpdate = true
    batch.computeBoundingBox()
    batch.computeBoundingSphere()
    root.add(batch)
    for (const entry of entries) {
      entry.mesh.parent?.remove(entry.mesh)
      entry.mesh.geometry.dispose()
      sourceBoxes++
    }
  }
  return { sourceBoxes, batches: buckets.size }
}
