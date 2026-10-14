import assert from 'node:assert/strict'
import test from 'node:test'
import * as THREE from 'three'
import { instanceStaticBoxes } from '../src/instanceBoxes.ts'

test('static boxes batch by material while retaining their transforms', () => {
  const root = new THREE.Group()
  const facade = new THREE.Group()
  facade.position.set(3, 0, 0)
  root.add(facade)
  const plaster = new THREE.MeshStandardMaterial({ color: '#bba088', roughness: .9 })
  const brass = new THREE.MeshStandardMaterial({ color: '#bb9a61', metalness: .4 })

  for (let i = 0; i < 50; i++) {
    const box = new THREE.Mesh(new THREE.BoxGeometry(1 + i * .01, .2, .4), plaster)
    box.position.set(i, 1, -i)
    facade.add(box)
  }
  const sign = new THREE.Mesh(new THREE.BoxGeometry(2, 1, .1), brass)
  root.add(sign)
  const plant = new THREE.Mesh(new THREE.SphereGeometry(.5), plaster)
  root.add(plant)

  const result = instanceStaticBoxes(root)

  assert.deepEqual(result, { sourceBoxes: 51, batches: 2 })
  const batches = root.children.filter((child): child is THREE.InstancedMesh => child instanceof THREE.InstancedMesh)
  assert.equal(batches.length, 2)
  assert.equal(batches.reduce((sum, batch) => sum + batch.count, 0), 51)
  assert.equal(plant.parent, root)

  const facadeBatch = batches.find(batch => batch.count === 50)!
  const matrix = new THREE.Matrix4()
  facadeBatch.getMatrixAt(0, matrix)
  const center = new THREE.Vector3().applyMatrix4(matrix)
  assert.ok(Math.abs(center.x - 3) < 1e-9)
  assert.ok(Math.abs(center.y - 1) < 1e-9)
  assert.ok(Math.abs(center.z) < 1e-9)
  assert.equal(new THREE.Vector3(.5, 0, 0).applyMatrix4(matrix).distanceTo(center), .5)
})
