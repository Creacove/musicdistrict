import assert from 'node:assert/strict'
import test from 'node:test'
import { isAllowedQuickChatPhrase, isPublicZoneChatRecipient } from '../server/presence.mjs'

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
