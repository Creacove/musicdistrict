import assert from 'node:assert/strict'
import test from 'node:test'
import { emotePose, idlePose, walkingPose } from '../src/avatarMotion.ts'
import { facingAngleForMovement } from '../src/avatarFacing.ts'

test('avatar model faces its movement direction in every cardinal direction', () => {
  const forward = facingAngleForMovement(0)
  const right = facingAngleForMovement(Math.PI / 2)
  const backward = facingAngleForMovement(Math.PI)
  const left = facingAngleForMovement(-Math.PI / 2)

  assert.ok(Math.abs(Math.sin(forward)) < 1e-9)
  assert.ok(Math.cos(forward) < -0.999999)
  assert.ok(Math.sin(right) > 0.999999)
  assert.ok(Math.abs(Math.cos(right)) < 1e-9)
  assert.ok(Math.abs(Math.sin(backward)) < 1e-9)
  assert.ok(Math.cos(backward) > 0.999999)
  assert.ok(Math.sin(left) < -0.999999)
  assert.ok(Math.abs(Math.cos(left)) < 1e-9)
})

test('idle motion stays subtle, finite, and changes smoothly with time', () => {
  const first = idlePose(0)
  const next = idlePose(.8)
  assert.ok(first.bob >= 0 && first.bob <= .02)
  assert.ok(Math.abs(first.lean) <= .02)
  assert.ok(Math.abs(first.armSwing) <= .03)
  assert.ok(Math.abs(first.facing) <= .05)
  assert.notDeepEqual(next, first)
  assert.ok(Object.values(idlePose(Number.NaN)).every(Number.isFinite))
})

test('walking gait keeps opposite limbs in counter-swing', () => {
  const pose = walkingPose(Math.PI / 2, 0.8)

  assert.ok(Math.abs(pose.leftLeg + pose.rightLeg) < 1e-9)
  assert.ok(Math.abs(pose.leftArm + pose.rightArm) < 1e-9)
  assert.ok(pose.leftLeg > 0)
  assert.ok(pose.leftArm < 0)
})

test('idle gait returns the avatar to a neutral pose', () => {
  assert.deepEqual(walkingPose(2.3, 0), { leftArm: 0, rightArm: 0, leftElbow: 0, rightElbow: 0, leftLeg: 0, rightLeg: 0, leftKnee: 0, rightKnee: 0, bob: 0 })
})

test('gait intensity is clamped to a safe stride', () => {
  const pose = walkingPose(Math.PI / 2, 2)
  assert.equal(pose.leftLeg, 0.42)
  assert.equal(pose.rightLeg, -0.42)
})

test('knees flex on alternating steps while elbows stay softly bent', () => {
  const pose = walkingPose(Math.PI / 2, 0.8)
  assert.ok(pose.leftKnee > 0)
  assert.equal(pose.rightKnee, 0)
  assert.ok(pose.leftElbow > 0)
  assert.ok(pose.rightElbow > pose.leftElbow)
})

test('wave lifts one hand and returns both arms to neutral at the gesture edges', () => {
  const pose = emotePose('wave', 0.5)
  assert.ok(pose.rightArmZ > 2.5)
  assert.equal(pose.leftArmZ, -.15)
  assert.equal(emotePose('wave', 0).weight, 0)
  assert.ok(emotePose('wave', 1).weight < 1e-9)
})

test('cheer and heart gestures use distinct balanced arm poses', () => {
  const cheer = emotePose('cheer', 0.5)
  const heart = emotePose('heart', 0.5)
  assert.ok(cheer.leftArmZ < -2.4 && cheer.rightArmZ > 2.4)
  assert.equal(heart.leftArmZ, -heart.rightArmZ)
  assert.equal(heart.leftElbowZ, -heart.rightElbowZ)
  assert.notEqual(heart.leftArmZ, cheer.leftArmZ)
})

test('emote progress is clamped and produces finite poses', () => {
  const pose = emotePose('fire', Number.POSITIVE_INFINITY)
  assert.equal(pose.weight, 0)
  assert.ok(Object.values(pose).every(Number.isFinite))
  assert.equal(emotePose('fire', 3).weight, 0)
})
