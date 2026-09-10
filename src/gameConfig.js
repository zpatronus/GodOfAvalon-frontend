// Centralized display config for the game, keyed by stable *role codes* coming
// from the backend. Because the backend stores codes (not display strings), the
// wording/emoji below can be edited or translated without touching server code.
import { sortPlayers } from './playerOrder'

export const MIN_PLAYERS = 5
export const MAX_PLAYERS = 10

// role code -> { name (with emoji), hint shown on reveal }
export const ROLE_DISPLAY = {
  merlin: { name: '梅林🧙‍♂️', hint: '你知道的坏人' },
  percival: { name: '派西维尔🛡️', hint: '一个是梅林🧙‍♂️，另一个是莫甘娜😈' },
  mordred: { name: '莫德雷德👹', hint: '你的邪恶队友' },
  morgana: { name: '莫甘娜😈', hint: '你的邪恶队友' },
  assassin: { name: '刺客🔪', hint: '你的邪恶队友' },
  loyal_servant: { name: '亚瑟的忠臣🙌', hint: '' },
  oberon: { name: '奥伯伦👻', hint: '你是奥伯伦👻，你不知道你的邪恶队友是谁' },
  minion: { name: '莫德雷德的爪牙💀', hint: '你的邪恶队友' }
}

const EVIL_ROLES = ['morgana', 'assassin', 'mordred', 'minion']

// Does this role have a "reject" (❌) button? Evil roles and everyone during a
// team-build approval vote may vote No.
export function canReject (role, phase) {
  return EVIL_ROLES.includes(role) || phase === 'build'
}

// Board composition summary, indexed by player count.
const BOARDS = [
  '', '', '', '', '',
  '🟦：梅林🧙‍♂️、派西维尔🛡️、亚瑟的忠臣🙌<br>🟧：莫甘娜😈、刺客🔪',
  '🟦：梅林🧙‍♂️、派西维尔🛡️、2×亚瑟的忠臣🙌<br>🟧：莫甘娜😈、刺客🔪',
  '🟦：梅林🧙‍♂️、派西维尔🛡️、2×亚瑟的忠臣🙌<br>🟧：莫甘娜😈、刺客🔪、奥伯伦👻',
  '🟦：梅林🧙‍♂️、派西维尔🛡️、3×亚瑟的忠臣🙌<br>🟧：莫德雷德👹、莫甘娜😈、刺客🔪（建议使用湖中仙女）',
  '🟦：梅林🧙‍♂️、派西维尔🛡️、4×亚瑟的忠臣🙌<br>🟧：莫德雷德👹、莫甘娜😈、刺客🔪<br>（建议使用湖中仙女）',
  '🟦：梅林🧙‍♂️、派西维尔🛡️、4×亚瑟的忠臣🙌<br>🟧：莫德雷德👹、莫甘娜😈、刺客🔪、莫德雷德的爪牙💀<br>（建议使用湖中仙女）'
]

// Quest team sizes per round, indexed by player count (protected rounds marked).
const TEAM_PHASES = [
  '', '', '', '', '',
  '2 3 2 3 3',
  '2 3 4 3 4',
  '2 3 3 4（保护轮）4',
  '3 4 4 5（保护轮）5',
  '3 4 4 5（保护轮）5',
  '3 4 4 5（保护轮）5'
]

export function boardTemplate (count) {
  if (count < MIN_PLAYERS) return '玩家数量不足'
  if (count > MAX_PLAYERS) return '玩家数量过多，请重开房间'
  return BOARDS[count]
}

export function teamPhase (count) {
  if (count < MIN_PLAYERS) return '玩家数量不足'
  if (count > MAX_PLAYERS) return '玩家数量过多，请重开房间'
  return TEAM_PHASES[count]
}

// The backend returns short english *error codes* (not display strings); the
// wording lives here so it can be styled/localized without touching server code.
export const ERROR_MESSAGES = {
  bad_credentials: '玩家验证失败（或密码错误）',
  room_not_found: '房间不存在',
  roomid_empty: '房间ID不能为空',
  roomid_long: '房间ID过长（最多6位）',
  roomid_taken: '房间ID已存在',
  id_or_psw_long: '玩家ID或密码过长',
  wrong_password: '密码错误',
  room_started: '房间已开始游戏，无法加入',
  already_started: '房间已开始游戏',
  not_started: '房间未开始游戏',
  bad_players_count: '玩家数量需为5到10人',
  vote_in_progress: '上一轮投票还在进行中',
  team_too_small: '队伍人数无效，至少要选2人',
  dup_members: '队伍成员不能重复',
  member_not_found: '队伍里有不存在的玩家',
  no_vote: '当前没有可投的票',
  already_voted: '你已经投过票了'
}

// Translate a backend error code to a human-readable message.
export function errorMessage (code, fallback) {
  return ERROR_MESSAGES[code] || fallback || code || ''
}

// The "N 赞同：a, b" line for a team-build (approval) vote result.
function agreeLine (votes, roomId) {
  const agree = sortPlayers(votes.filter(v => v.choice).map(v => v.userid), roomId)
  return `${agree.length} 赞同${agree.length > 0 ? '：' : ''}${agree.join(', ')}`
}

function disagreeLine (votes, roomId) {
  const disagree = sortPlayers(votes.filter(v => !v.choice).map(v => v.userid), roomId)
  return `${disagree.length} 反对${disagree.length > 0 ? '：' : ''}${disagree.join(', ')}`
}

// Render a structured Vote record the way the history card displays it.
export function renderVote (vote, roomId) {
  const members = sortPlayers(vote.members || [], roomId)
  const team = `队长：${vote.builder} | 队伍：${members.join(', ')}`
  if (vote.kind === 'quest') {
    return {
      kind: 'quest',
      title: `任务 #${vote.round_no}`,
      team,
      builder: vote.builder,
      members,
      agree: `${vote.agree} 成功`,
      disagree: `${vote.disagree} 失败`,
      agreeCount: vote.agree,
      disagreeCount: vote.disagree
    }
  }
  const approved = vote.agree > vote.disagree
  const ballots = vote.ballots || []
  return {
    kind: 'build',
    title: `队伍提名 #${vote.round_no}${approved ? '' : ' - 流局'}`,
    team,
    builder: vote.builder,
    members,
    agree: agreeLine(ballots, roomId),
    disagree: disagreeLine(ballots, roomId),
    agreeCount: vote.agree,
    disagreeCount: vote.disagree
  }
}
