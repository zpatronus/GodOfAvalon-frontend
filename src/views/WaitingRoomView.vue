<!--
 Copyright (C) 2022 Zijun Yang <zijun.yang@outlook.com>
 
 This file is part of God of Avalon Frontend.
 
 God of Avalon Frontend is free software: you can redistribute it and/or modify
 it under the terms of the GNU General Public License as published by
 the Free Software Foundation, either version 3 of the License, or
 (at your option) any later version.
 
 God of Avalon Frontend is distributed in the hope that it will be useful,
 but WITHOUT ANY WARRANTY; without even the implied warranty of
 MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 GNU General Public License for more details.
 
 You should have received a copy of the GNU General Public License
 along with God of Avalon Frontend.  If not, see <http://www.gnu.org/licenses/>.
-->

<template>
  <div>
    <div class="container">
      <div class="info-grid">
        <div class="info-row"><span class="info-label">房间ID</span><span class="info-value">{{ roomId }}</span></div>
        <div class="info-row"><span class="info-label">你的玩家ID</span><span class="info-value">{{ userId }}</span></div>
        <div class="info-row"><span class="info-label">玩家数量</span><span class="info-value">{{ userCount }}</span></div>
      </div>
      <div class="subtitle">房间内的玩家</div>
      <div class="player-list">
        <div v-for="user in users" :key="user.userId" class="player-card">
          <img class="player-avatar" :src="avatarOf(user.userId)" :alt="user.userId" />
          <span class="player-name">{{ user.userId }}</span>
        </div>
      </div>
      <AvatarField v-if="roomStatus === 'waiting'" :model-value="avatars[userId]" :persist="false"
        :disabled="avatarSaving || starting" @update:model-value="saveAvatar" />
    </div>
    <div class="container">
      <div class="subtitle">板子</div>
      <BoardRoles :count="userCount" :room-id="roomId" :user-id="userId" />
      <div class="subtitle">任务队伍成员数量</div>
      <div class="phase-text">{{ teamBuildingPhase }}</div>
    </div>
    <div class="waiting-note">请等待玩家到齐后再开始游戏</div>
    <button id="startGameButton" v-on:click="openStartConfirmation" class="btn-primary btn-block" :disabled="!canStart || starting" :class="{ disabledButton: !canStart }">开始游戏</button>
    <dialog ref="startDialog" class="start-dialog" aria-labelledby="start-dialog-title" aria-describedby="start-dialog-description" v-on:close="startConfirmation = false">
      <h2 id="start-dialog-title">准备开始？</h2>
      <p id="start-dialog-description" class="start-confirm-info">当前共有 <strong>{{ userCount }}</strong> 名玩家，所有玩家都到齐了吗？</p>
      <div class="start-dialog-actions">
        <button type="button" autofocus v-on:click="closeStartConfirmation">再等等</button>
        <button type="button" class="btn-primary" :disabled="!canStart || starting" v-on:click="startGame">确认开始</button>
      </div>
    </dialog>
    <div class="status">{{ info }}</div>
  </div>
</template>
<script>
import { post } from '@/api'
import { sortPlayers } from '@/playerOrder'
import { teamPhase, MIN_PLAYERS, MAX_PLAYERS, errorMessage } from '@/gameConfig'
import { getMyAvatar, avatarUrl } from '@/avatar'
import AvatarField from '@/components/AvatarField.vue'
import BoardRoles from '@/components/BoardRoles.vue'
export default {
  name: 'WaitingRoomView',
  components: { AvatarField, BoardRoles },
  data () {
    return {
      roomId: '',
      userId: '',
      userPsw: '',
      users: [],
      avatars: {},
      avatarSaving: false,
      roomStatus: '',
      revision: 0,
      polling: false,
      active: true,
      userCount: 0,
      startConfirmation: false,
      starting: false,
      info: '',
      intervalId: null,
    }
  },
  computed: {
    canStart: function () {
      return this.roomStatus === 'waiting' && !this.avatarSaving && this.userCount >= MIN_PLAYERS && this.userCount <= MAX_PLAYERS;
    },
    teamBuildingPhase: function () {
      return teamPhase(this.userCount)
    }
  },
  methods: {
    async saveAvatar (avatar) {
      if (this.avatarSaving || this.starting || this.roomStatus !== 'waiting') return
      this.avatarSaving = true
      this.revision++
      this.info = ''
      try {
        const res = await post('/set_avatar/', { roomid: this.roomId, userid: this.userId, userpsw: this.userPsw, avatar })
        if (!this.active) return
        if (!res.ok) { this.info = errorMessage(res.message, '头像保存失败'); return }
        this.avatars = res.avatars
      } catch {
        if (this.active) this.info = '网络错误，头像未更改，请重试'
      } finally {
        this.revision++
        this.avatarSaving = false
        if (this.active) this.updateRoomInfo()
      }
    },
    openStartConfirmation () {
      if (!this.canStart || this.starting) return
      this.startConfirmation = true
      this.$refs.startDialog.showModal()
    },
    closeStartConfirmation () {
      this.startConfirmation = false
      this.$refs.startDialog?.close()
    },
    avatarOf (userId) {
      const filename = this.avatars[userId] || (userId === this.userId ? getMyAvatar() : '')
      return avatarUrl(filename)
    },
    async startGame () {
      if (!this.canStart || !this.startConfirmation || this.starting) return
      this.starting = true
      this.revision++
      this.closeStartConfirmation()
      this.info = '正在开启游戏...'
      try {
        const res = await post('/start_game/', {
          roomid: this.roomId,
          userid: this.userId,
          userpsw: this.userPsw
        })
        if (!this.active) return
        if (!res.ok) { this.info = errorMessage(res.message, '开始失败'); return }
        this.info = '游戏已开启，跳转中...'
        this.$router.push({ path: '/inroom' })
      } catch (e) {
        this.info = '网络错误，请重试'
      } finally {
        this.starting = false
        this.startConfirmation = false
      }
    },
    async updateRoomInfo () {
      if (!this.active || this.polling || this.avatarSaving || this.starting) return
      this.polling = true
      const revision = this.revision
      try {
        const res = await post('/waiting_room/', {
          roomid: this.roomId,
          userid: this.userId,
          userpsw: this.userPsw
        })
        if (!this.active || revision !== this.revision || !res.ok) return
        this.roomStatus = res.roomstatus
        if (this.userCount !== res.users.length) this.closeStartConfirmation()
        this.userCount = res.users.length
        this.avatars = res.avatars || {}
        this.users = sortPlayers(res.users, this.roomId).map(userId => ({ userId }))
        if (res.roomstatus === 'started') {
          this.info = '游戏已开启，跳转中...'
          this.$router.push({ path: '/inroom' })
        }
      } catch (e) {
        /* polling; ignore transient errors */
      } finally {
        this.polling = false
      }
    }
  },
  mounted: function () {
    this.roomId = localStorage.getItem('roomId')
    this.userId = localStorage.getItem('userId')
    this.userPsw = localStorage.getItem('userPsw')
    this.updateRoomInfo()
    this.intervalId = setInterval(() => {//update room info
      this.updateRoomInfo()
    }, 2000)
  },
  beforeUnmount () {
    this.active = false
    // console.log(this.intervalId)
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  },
}
</script>
<style scoped>
.start-dialog {
  box-sizing: border-box;
  width: 380px;
  max-width: calc(100vw - 32px);
  max-height: calc(100dvh - 32px);
  padding: 24px;
  border: 1px solid var(--border-strong);
  border-radius: 16px;
  background: var(--bg-1);
  color: var(--text);
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
}

.start-dialog::backdrop {
  background: rgba(0, 0, 0, 0.6);
}

.start-dialog h2 {
  margin: 0;
  font-size: 1.2rem;
  text-align: center;
}

.start-confirm-info {
  margin: 16px 0 24px;
  color: var(--text-dim);
  text-align: center;
}

.start-confirm-info strong {
  color: var(--accent);
}

.start-dialog-actions {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 10px;
}

.start-dialog-actions button {
  margin: 0;
}

.player-list {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 18px 14px;
  margin: 14px 0 8px;
}

.player-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 7px;
  width: 92px;
  min-width: 0;
}

.player-avatar {
  width: 76px;
  height: 76px;
  border-radius: 16px;
  object-fit: cover;
  border: 2px solid rgba(255, 255, 255, 0.22);
  background: rgba(255, 255, 255, 0.06);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.22);
}

.player-name {
  width: 100%;
  overflow: hidden;
  color: var(--text);
  font-size: 0.9rem;
  line-height: 1.2;
  text-align: center;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
