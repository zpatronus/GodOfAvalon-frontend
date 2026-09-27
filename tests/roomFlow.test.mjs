import test from 'node:test'
import assert from 'node:assert/strict'
import { existsSync } from 'node:fs'
import { roleVariant, localDateKey } from '../src/roleVariant.js'
import { nextRoomId, randomRoomId, prefillIdentity, prefillRoomId } from '../src/random.js'

const roles = ['merlin', 'percival', 'morgana', 'mordred', 'assassin', 'loyal_servant', 'oberon', 'minion']

test('next rooms follow ONW base-62 carry and six-character wrapping', () => {
  for (const [current, next] of [['a', 'b'], ['z', 'A'], ['Z', '0'], ['8', '9'],
    ['9', 'ba'], ['aa9', 'aba'], ['abc999', 'abdaaa'], ['999999', 'aaaaaa'], ['00000a', '00000b']]) {
    assert.equal(nextRoomId(current), next)
  }
  for (const bad of ['', 'abcdefg', 'bad/id', null, undefined]) assert.equal(nextRoomId(bad), 'a')
  for (let i = 0; i < 100; i++) assert.match(randomRoomId(), /^[A-Za-z0-9]{6}$/)
})

test('prefill persists new credentials and restores existing values verbatim', () => {
  const values = new Map()
  globalThis.localStorage = { getItem: key => values.get(key) ?? null, setItem: (key, value) => values.set(key, value) }
  const identity = prefillIdentity()
  const room = prefillRoomId()
  assert.ok(identity.userid && identity.userpsw)
  assert.deepEqual(prefillIdentity(), identity)
  assert.equal(prefillRoomId(), room)
  values.set('userId', 'User_1')
  values.set('userPsw', '0012')
  values.set('roomId', 'aZ09Aa')
  assert.deepEqual(prefillIdentity(), { userid: 'User_1', userpsw: '0012' })
  assert.equal(prefillRoomId(), 'aZ09Aa')
})

test('role variants remain stable on reconnect and across days, with all three versions reachable', () => {
  const choices = roles.map(role => roleVariant(role, { roomid: 'ROOM', userid: 'Arthur', date: '2026-09-26' }))
  assert.deepEqual(roles.map(role => roleVariant(role, { roomid: 'ROOM', userid: 'Arthur', date: '2030-01-01' })), choices)
  assert.ok(new Set(choices).size > 1)
  assert.notDeepEqual(roles.map(role => roleVariant(role, { roomid: 'NEXT', userid: 'Arthur' })), choices)
  assert.notDeepEqual(roles.map(role => roleVariant(role, { roomid: 'ROOM', userid: 'Grail' })), choices)
  for (const role of roles) {
    const variants = new Set(Array.from({ length: 100 }, (_, i) => roleVariant(role, { roomid: 'ROOM', userid: `User${i}` })))
    assert.deepEqual(variants, new Set([1, 2, 3]))
  }
})

test('public previews vary by local day, and all 24 card assets exist', () => {
  assert.equal(localDateKey(new Date(2026, 8, 26, 23, 59)), '2026-09-26')
  const today = roles.map(role => roleVariant(role, { date: '2026-09-26' }))
  assert.deepEqual(roles.map(role => roleVariant(role, { date: '2026-09-26' })), today)
  assert.notDeepEqual(roles.map(role => roleVariant(role, { date: '2026-09-27' })), today)
  for (const role of roles) {
    for (const version of [1, 2, 3]) {
      assert.ok(existsSync(new URL(`../src/assets/roles/${role}-${version}.webp`, import.meta.url)), `${role}-${version}`)
    }
  }
})
