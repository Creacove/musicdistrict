import assert from 'node:assert/strict'
import test from 'node:test'
import { SERVICE_NPC_ROLES } from '../src/serviceNpc.ts'

test('service characters are visibly classified NPC ambience, never human sessions', () => {
  for (const role of Object.values(SERVICE_NPC_ROLES)) {
    assert.equal(role.actorType, 'NPC')
    assert.equal(role.cosmeticOnly, true)
    assert.equal(role.countsAsHuman, false)
    assert.equal(role.financialEffect, 'none')
    assert.match(role.badge, /NPC/)
  }
})

test('service NPC roles stay inside their documented locations', () => {
  assert.equal(SERVICE_NPC_ROLES['venue-usher'].location, 'venue')
  assert.equal(SERVICE_NPC_ROLES['studio-technician'].location, 'studio')
  assert.equal(SERVICE_NPC_ROLES['studio-technician'].badge.includes('TECH'), true)
  assert.equal(SERVICE_NPC_ROLES['venue-usher'].badge.includes('USHER'), true)
})
