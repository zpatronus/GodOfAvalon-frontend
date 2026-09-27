// Same base-62 ordering as One Night Werewolf. Case and leading digits matter.
const ROOM_DIGITS = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
const NAMES = ['Arthur', 'Grail', 'Knight', 'Lake', 'Oak', 'Raven', 'Mist', 'Crown', 'Ember', 'Rune']

export function randomRoomId () {
  return Array.from({ length: 6 }, () => ROOM_DIGITS[Math.floor(Math.random() * 62)]).join('')
}

export function nextRoomId (currentId) {
  if (typeof currentId !== 'string' || !/^[A-Za-z0-9]{1,6}$/.test(currentId)) return 'a'
  const digits = [...currentId]
  for (let i = digits.length - 1; i >= 0; i--) {
    const next = ROOM_DIGITS.indexOf(digits[i]) + 1
    digits[i] = ROOM_DIGITS[next % 62]
    if (next < 62) return digits.join('')
  }
  return digits.length < 6 ? 'b' + digits.join('') : digits.join('')
}

export function randomPsw () {
  return Array.from({ length: 4 }, () => Math.floor(Math.random() * 10)).join('')
}

function restore (key, generate) {
  const value = localStorage.getItem(key) || generate()
  localStorage.setItem(key, value)
  return value
}

export function prefillIdentity () {
  return {
    userid: restore('userId', () => NAMES[Math.floor(Math.random() * NAMES.length)]),
    userpsw: restore('userPsw', randomPsw)
  }
}

export const prefillRoomId = () => restore('roomId', randomRoomId)
