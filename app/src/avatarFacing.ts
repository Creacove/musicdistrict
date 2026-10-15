/** Converts the movement angle (whose zero vector points toward -Z) into the avatar's +Z-facing model heading. */
export function facingAngleForMovement(movementAngle: number): number {
  return Math.PI - movementAngle
}
