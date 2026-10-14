import * as THREE from 'three'

/** Dispose a transient sprite's material and optionally its owned, non-shared texture. */
export function disposeSpriteResources(sprite: THREE.Sprite, disposeMap: boolean) {
  if (disposeMap) sprite.material.map?.dispose()
  sprite.material.dispose()
}
