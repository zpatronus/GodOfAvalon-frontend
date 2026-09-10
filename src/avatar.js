// Avatar identity is a filename. The current user's filename is stored beside
// userId/userPsw in localStorage. SVG contents are cached separately so an
// avatar asset is only requested when that file is not already available.

const ctx = require.context('@/assets/avatars/', false, /\.svg$/)

// Stable, sorted list of avatar file names, e.g. "demon-devil-halloween-lucifer-satan.svg".
export const AVATARS = [...ctx.keys()]
  .map(k => k.replace(/^\.\//, ''))
  .sort()

const CURRENT_AVATAR_KEY = 'avatar'
const FILE_CACHE_PREFIX = 'avatarFile:'
const pending = new Set()

function isValidAvatar (file) {
  return Boolean(file && AVATARS.includes(file))
}

export function randomAvatar () {
  return AVATARS[Math.floor(Math.random() * AVATARS.length)] || ''
}

export function getMyAvatar () {
  const stored = localStorage.getItem(CURRENT_AVATAR_KEY)
  if (isValidAvatar(stored)) return stored

  const picked = randomAvatar()
  if (picked) localStorage.setItem(CURRENT_AVATAR_KEY, picked)
  return picked
}

export function setMyAvatar (file) {
  if (isValidAvatar(file)) localStorage.setItem(CURRENT_AVATAR_KEY, file)
}

function cacheKey (file) {
  return FILE_CACHE_PREFIX + file
}

function cacheFile (file, assetUrl) {
  if (pending.has(file)) return
  pending.add(file)

  fetch(assetUrl)
    .then(response => {
      if (!response.ok) throw new Error('avatar request failed')
      return response.text()
    })
    .then(svg => localStorage.setItem(cacheKey(file), svg))
    .catch(() => {})
    .finally(() => pending.delete(file))
}

// Always check the file cache first. If it is absent, use the bundled asset for
// this render and populate localStorage for subsequent renders.
export function avatarUrl (file) {
  const safeFile = isValidAvatar(file) ? file : AVATARS[0]
  if (!safeFile) return ''

  const cached = localStorage.getItem(cacheKey(safeFile))
  if (cached) return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(cached)}`

  const assetUrl = ctx('./' + safeFile)
  cacheFile(safeFile, assetUrl)
  return assetUrl
}
