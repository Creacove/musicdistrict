import assert from 'node:assert/strict'
import test from 'node:test'
import * as THREE from 'three'
import { disposeSpriteResources } from '../src/avatarLifecycle.ts'

test('removing an owned avatar label disposes its texture and sprite material', () => {
  const texture = new THREE.Texture()
  const material = new THREE.SpriteMaterial({ map: texture })
  const sprite = new THREE.Sprite(material)
  let textureDisposed = false
  let materialDisposed = false
  texture.addEventListener('dispose', () => { textureDisposed = true })
  material.addEventListener('dispose', () => { materialDisposed = true })

  disposeSpriteResources(sprite, true)

  assert.equal(textureDisposed, true)
  assert.equal(materialDisposed, true)
})

test('removing one emote sprite preserves its shared emote texture', () => {
  const texture = new THREE.Texture()
  const material = new THREE.SpriteMaterial({ map: texture })
  const sprite = new THREE.Sprite(material)
  let textureDisposed = false
  let materialDisposed = false
  texture.addEventListener('dispose', () => { textureDisposed = true })
  material.addEventListener('dispose', () => { materialDisposed = true })

  disposeSpriteResources(sprite, false)

  assert.equal(textureDisposed, false)
  assert.equal(materialDisposed, true)
})
