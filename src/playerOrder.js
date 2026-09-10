// Stable room-specific display order; never mutate the supplied player list.
function playerHash (roomId, username) {
  const key = JSON.stringify([roomId, username])
  let hash = 2166136261
  for (let i = 0; i < key.length; i++) {
    hash = Math.imul(hash ^ key.charCodeAt(i), 16777619)
  }
  // Mix the final bits so similar names and room IDs spread across the order.
  hash = Math.imul(hash ^ (hash >>> 16), 0x85ebca6b)
  hash = Math.imul(hash ^ (hash >>> 13), 0xc2b2ae35)
  return (hash ^ (hash >>> 16)) >>> 0
}

export function sortPlayers (usernames, roomId) {
  return usernames
    .map(username => ({ username, hash: playerHash(roomId, username) }))
    .sort((a, b) => a.hash - b.hash ||
      (a.username < b.username ? -1 : a.username > b.username ? 1 : 0))
    .map(player => player.username)
}
