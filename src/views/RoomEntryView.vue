<script setup>
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import AvatarField from '@/components/AvatarField.vue'
import { getMyAvatar } from '@/avatar'
import { errorMessage } from '@/gameConfig'
import { prefillIdentity, prefillRoomId, randomRoomId, nextRoomId, randomPsw } from '@/random'
import { createOrJoinRoom, saveSession, roomRoute } from '@/roomSession'

const router = useRouter()
const route = useRoute()
const roomid = ref(prefillRoomId())
const identity = prefillIdentity()
const userid = ref(identity.userid)
const userpsw = ref(identity.userpsw)
const avatar = ref(getMyAvatar())
const busy = ref(false)
const message = ref('')
let active = true
onUnmounted(() => { active = false })
const valid = computed(() => /^[A-Za-z0-9]{1,6}$/.test(roomid.value)
  && /^[A-Za-z0-9_]{1,7}$/.test(userid.value)
  && /^[A-Za-z0-9]{1,6}$/.test(userpsw.value))

watch([roomid, userid, userpsw], ([r, u, p]) => {
  localStorage.setItem('roomId', r)
  localStorage.setItem('userId', u)
  localStorage.setItem('userPsw', p)
}, { flush: 'sync' })

onMounted(() => {
  if (typeof route.query.room === 'string' && /^[A-Za-z0-9]{1,6}$/.test(route.query.room)) {
    roomid.value = route.query.room
  }
  if (route.query.room !== undefined) {
    const query = { ...route.query }
    delete query.room
    router.replace({ query })
  }
})

async function submit () {
  if (!valid.value || busy.value) return
  busy.value = true
  message.value = ''
  const submitted = { roomid: roomid.value, userid: userid.value, userpsw: userpsw.value, avatar: avatar.value }
  try {
    const res = await createOrJoinRoom(submitted)
    if (!active) return
    if (!res.ok) { message.value = errorMessage(res.message, '进入失败，请重试'); return }
    saveSession({ ...submitted, avatar: res.avatar })
    await router.push(roomRoute(res.roomstatus))
  } catch {
    if (active) message.value = '网络错误，请重试'
  } finally {
    busy.value = false
  }
}
</script>

<template>
  <form class="container entry-form" @submit.prevent="submit">
    <h1>创建或加入房间</h1>
    <fieldset :disabled="busy">
      <div class="entry-group">
        <label for="room-id">房间号</label>
        <div class="field-row room-field">
          <input id="room-id" v-model.trim="roomid" maxlength="6" required pattern="[A-Za-z0-9]{1,6}" autocapitalize="off" spellcheck="false" aria-describedby="room-hint" />
          <button type="button" @click="roomid = randomRoomId()">随机</button>
          <button type="button" @click="roomid = nextRoomId(roomid)">下一个</button>
        </div>
        <p id="room-hint" class="field-hint">1–6 位字母或数字，区分大小写。房间不存在时自动创建。</p>
      </div>
      <div class="entry-group">
        <label for="player-id">玩家名</label>
        <input id="player-id" v-model.trim="userid" maxlength="7" required pattern="[A-Za-z0-9_]{1,7}" autocapitalize="off" spellcheck="false" aria-describedby="player-hint" />
        <p id="player-hint" class="field-hint">1–7 位字母、数字或下划线</p>
      </div>
      <div class="entry-group">
        <label for="player-password">玩家密码</label>
        <div class="field-row">
          <input id="player-password" v-model.trim="userpsw" maxlength="6" required pattern="[A-Za-z0-9]{1,6}" autocapitalize="off" spellcheck="false" aria-describedby="password-hint" />
          <button type="button" @click="userpsw = randomPsw()">随机</button>
        </div>
        <p id="password-hint" class="field-hint">用于重新加入，非房间密码。1–6 位字母或数字。</p>
      </div>
      <div class="entry-avatar"><AvatarField v-model="avatar" :disabled="busy" /></div>
      <p class="field-hint">密码会明文保存在本机。请使用随机密码，勿使用常用密码。</p>
      <button type="submit" class="btn-primary btn-block" :disabled="!valid || busy">{{ busy ? '进入中…' : '创建或加入房间' }}</button>
    </fieldset>
    <p v-if="message" class="status" role="alert">{{ message }}</p>
  </form>
</template>

<style scoped>
.entry-form { border-color: rgba(229, 189, 84, 0.25); }
h1 { margin: 0 0 24px; text-align: center; font-size: 1.35rem; }
fieldset { border: 0; padding: 0; margin: 0; min-width: 0; }
.entry-group { margin: 20px 0; }
label { display: block; margin-bottom: 8px; font-size: 0.9rem; font-weight: 600; }
.entry-form input { margin: 0; min-width: 0; }
.field-row { gap: 6px; }
.field-row button { margin: 0; padding: 10px; font-size: 0.8rem; flex-shrink: 0; }
.room-field input { font-family: ui-monospace, monospace; letter-spacing: 0.06em; }
.field-hint { color: var(--text-dim); font-size: 0.78rem; line-height: 1.65; margin: 8px 0; }
.entry-avatar { padding: 4px 12px 12px; border: 1px solid var(--border); border-radius: 12px; background: var(--surface-2); margin: 20px 0 14px; }
</style>
