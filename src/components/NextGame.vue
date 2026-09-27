<script setup>
import { computed, onUnmounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { nextRoomId } from '@/random'
import { getMyAvatar } from '@/avatar'
import { errorMessage } from '@/gameConfig'
import { createOrJoinRoom, saveSession, roomRoute } from '@/roomSession'

const props = defineProps({ roomId: String, userId: String, userPsw: String })
const router = useRouter()
const nextId = computed(() => nextRoomId(props.roomId))
const dialog = ref(null)
const acknowledged = ref(false)
const busy = ref(false)
const message = ref('')
let active = true
onUnmounted(() => { active = false })

function open () {
  if (busy.value || !props.roomId) return
  acknowledged.value = false
  message.value = ''
  dialog.value.showModal()
}

async function enterNext () {
  if (!dialog.value.open || !acknowledged.value || busy.value) return
  busy.value = true
  message.value = ''
  const submitted = { roomid: nextId.value, userid: props.userId, userpsw: props.userPsw, avatar: getMyAvatar() }
  try {
    const res = await createOrJoinRoom(submitted)
    if (!active) return
    if (!res.ok) { message.value = errorMessage(res.message, '进入失败，请重试'); return }
    saveSession({ ...submitted, avatar: res.avatar })
    // Changing the route key also remounts when rejoining a started next room.
    await router.push({ path: roomRoute(res.roomstatus), query: { game: submitted.roomid } })
  } catch {
    if (active) message.value = '网络错误，请重试。你仍在当前房间。'
  } finally {
    busy.value = false
  }
}
</script>

<template>
  <section class="container next-game">
    <h2>下一局</h2>
    <p>本局结束后，与其他玩家一起进入下一房间。</p>
    <button type="button" class="btn-block" :disabled="busy || !roomId" @click="open">创建或加入下一局 · {{ nextId }}</button>
    <dialog ref="dialog" aria-labelledby="next-game-title" @cancel="busy && $event.preventDefault()">
      <h2 id="next-game-title">确认进入下一局？</h2>
      <p>你将从 <strong>{{ roomId }}</strong> 前往 <strong>{{ nextId }}</strong>，保留当前玩家名和密码。其他玩家也需点击下一局才能进入同一房间。</p>
      <p>当前对局和记录会保留。本页面不会自动判断游戏是否结束，请先完成本局讨论和刺杀。</p>
      <label class="next-check"><input v-model="acknowledged" type="checkbox" :disabled="busy" /><span>我已确认本局结束，准备进入下一局</span></label>
      <p v-if="message" class="status" role="alert">{{ message }}</p>
      <div class="next-actions">
        <button type="button" autofocus :disabled="busy" @click="dialog.close()">留在本局</button>
        <button type="button" class="btn-primary" :disabled="!acknowledged || busy" @click="enterNext">{{ busy ? '进入中…' : '确认进入' }}</button>
      </div>
    </dialog>
  </section>
</template>

<style scoped>
.next-game { margin-top: 28px; }
h2 { margin: 0 0 12px; font-size: 1.1rem; }
p { font-size: 0.85rem; color: var(--text-dim); line-height: 1.7; }
strong { color: var(--accent); font-family: ui-monospace, monospace; }
dialog { width: 420px; max-width: calc(100vw - 32px); max-height: calc(100dvh - 32px); padding: 24px; border: 1px solid var(--border-strong); border-radius: 16px; background: var(--bg-1); color: var(--text); box-shadow: var(--shadow); }
dialog::backdrop { background: rgba(0, 0, 0, 0.7); }
.next-check { display: flex; align-items: flex-start; gap: 10px; font-size: 0.85rem; line-height: 1.6; margin: 20px 0; padding: 11px 0; cursor: pointer; }
.next-check input { appearance: auto; width: 18px; height: 18px; flex: 0 0 18px; padding: 0; margin: 2px 0 0; accent-color: var(--accent); color-scheme: dark; cursor: inherit; }
.next-check input:focus-visible { outline: 2px solid var(--accent); outline-offset: 3px; }
.next-check input:disabled { cursor: not-allowed; opacity: 0.5; }
.next-check input:disabled + span { opacity: 0.5; }
.next-actions { display: flex; flex-wrap: wrap; justify-content: flex-end; gap: 8px; }
.next-actions button { margin: 0; }
</style>
