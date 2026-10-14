export type WalkPose = {
  leftArm: number; rightArm: number; leftElbow: number; rightElbow: number
  leftLeg: number; rightLeg: number; leftKnee: number; rightKnee: number; bob: number
}

export type AvatarEmote = 'cheer' | 'wave' | 'heart' | 'fire'
export type EmotePose = {
  leftArmZ: number; rightArmZ: number; leftElbowZ: number; rightElbowZ: number
  bodyBob: number; turn: number; weight: number
}

export function walkingPose(phase: number, intensity: number): WalkPose {
  const strength = Number.isFinite(intensity) ? Math.max(0, Math.min(1, intensity)) : 0
  if (strength === 0) return { leftArm: 0, rightArm: 0, leftElbow: 0, rightElbow: 0, leftLeg: 0, rightLeg: 0, leftKnee: 0, rightKnee: 0, bob: 0 }
  const cycle = Math.sin(phase)
  const stride = cycle * 0.42 * strength
  const leftLift = Math.max(0, cycle) * 0.48 * strength
  const rightLift = Math.max(0, -cycle) * 0.48 * strength
  return {
    leftArm: -stride * 0.6,
    rightArm: stride * 0.6,
    leftElbow: (0.06 + Math.max(0, -cycle) * 0.18) * strength,
    rightElbow: (0.06 + Math.max(0, cycle) * 0.18) * strength,
    leftLeg: stride,
    rightLeg: -stride,
    leftKnee: leftLift,
    rightKnee: rightLift,
    bob: Math.abs(Math.sin(phase * 2)) * 0.035 * strength,
  }
}

export function emotePose(emote: AvatarEmote, phase: number): EmotePose {
  const progress = Number.isFinite(phase) ? Math.max(0, Math.min(1, phase)) : 0
  const pulse = progress === 0 || progress === 1 ? 0 : Math.sin(Math.PI * progress)
  const wave = Math.sin(progress * Math.PI * 12)
  const pose: Omit<EmotePose, 'weight'> = {
    leftArmZ: -.15, rightArmZ: .15, leftElbowZ: 0, rightElbowZ: 0, bodyBob: 0, turn: 0,
  }
  if (emote === 'wave') {
    pose.rightArmZ = 2.85
    pose.rightElbowZ = -.55 + wave * .4
    pose.bodyBob = .025 * Math.sin(progress * Math.PI * 4)
  } else if (emote === 'cheer') {
    pose.leftArmZ = -2.55
    pose.rightArmZ = 2.55
    pose.leftElbowZ = -.22
    pose.rightElbowZ = .22
    pose.bodyBob = .045 * Math.sin(progress * Math.PI * 4)
  } else if (emote === 'heart') {
    pose.leftArmZ = -.95
    pose.rightArmZ = .95
    pose.leftElbowZ = -.55
    pose.rightElbowZ = .55
    pose.bodyBob = .018 * Math.sin(progress * Math.PI * 2)
  } else {
    pose.leftArmZ = -1.65
    pose.rightArmZ = 2.1
    pose.leftElbowZ = -.28
    pose.rightElbowZ = -.35 + wave * .25
    pose.bodyBob = .035 * Math.sin(progress * Math.PI * 6)
    pose.turn = .12 * Math.sin(progress * Math.PI * 2)
  }
  return { ...pose, weight: pulse }
}
