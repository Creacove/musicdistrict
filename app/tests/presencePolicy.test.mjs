import assert from 'node:assert/strict'
import test from 'node:test'
import { isAllowedQuickChatPhrase, isPublicZoneChatRecipient } from '../server/presence.mjs'
import { createGuestStore } from '../server/guestStore.mjs'

test('public-zone chat requires both players to opt in and share the same place', () => {
  const optedIn = { chatOptIn: true, location: 'square' }
  assert.equal(isPublicZoneChatRecipient(optedIn, { chatOptIn: true, location: 'square' }), true)
  assert.equal(isPublicZoneChatRecipient(optedIn, { chatOptIn: false, location: 'square' }), false)
  assert.equal(isPublicZoneChatRecipient(optedIn, { chatOptIn: true, location: 'studio' }), false)
  assert.equal(isPublicZoneChatRecipient({ ...optedIn, chatOptIn: false }, { chatOptIn: true, location: 'square' }), false)
})

test('prototype chat accepts only its published quick phrases', () => {
  assert.equal(isAllowedQuickChatPhrase('Vibing here ✨'), true)
  assert.equal(isAllowedQuickChatPhrase('Vibing at the Palm Room! 🌴'), false)
  assert.equal(isAllowedQuickChatPhrase(''), false)
})

test('a guest block suppresses public chat in either direction', () => {
  const store = createGuestStore(':memory:')
  const a = store.create(), b = store.create()
  const playerA = { id: a.id, chatOptIn: true, location: 'square' }
  const playerB = { id: b.id, chatOptIn: true, location: 'square' }
  try {
    assert.equal(isPublicZoneChatRecipient(playerA, playerB, store), true)
    store.block(a.id, b.id)
    assert.equal(isPublicZoneChatRecipient(playerA, playerB, store), false)
    assert.equal(isPublicZoneChatRecipient(playerB, playerA, store), false)
  } finally { store.close() }
})
