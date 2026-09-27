import { post } from './api'
import { setMyAvatar } from './avatar'

export const createOrJoinRoom = identity => post('/create_or_join_room/', identity)

export function saveSession ({ roomid, userid, userpsw, avatar }) {
  localStorage.setItem('roomId', roomid)
  localStorage.setItem('userId', userid)
  localStorage.setItem('userPsw', userpsw)
  setMyAvatar(avatar)
}

export const roomRoute = status => status === 'started' ? '/inroom' : '/waitingroom'
