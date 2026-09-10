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
    </div>
    <div class="container">
      <div class="subtitle">板子</div>
      <div class="board" v-html="template"></div>
      <div class="subtitle">任务队伍成员数量</div>
      <div class="phase-text">{{ teamBuildingPhase }}</div>
    </div>
    <div class="waiting-note">请等待玩家到齐后再开始游戏</div>
    <button id="startGameButton" v-on:click="startGame" class="btn-primary btn-block" :disabled="!canStart" :class="{ disabledButton: !canStart }">开始游戏</button>
    <div class="status">{{ info }}</div>
  </div>
</template>
<script>
import { post } from '@/api'
import { boardTemplate, teamPhase, MIN_PLAYERS, MAX_PLAYERS, errorMessage } from '@/gameConfig'
import { getMyAvatar, avatarUrl } from '@/avatar'
export default {
  name: 'WaitingRoomView',
  data () {
    return {
      roomId: '',
      userId: '',
      userPsw: '',
      users: [],
      avatars: {},
      userCount: 0,
      info: '',
      intervalId: null,
    }
  },
  computed: {
    canStart: function () {
      return this.userCount >= MIN_PLAYERS && this.userCount <= MAX_PLAYERS;
    },
    template: function () {
      return boardTemplate(this.userCount)
    },
    teamBuildingPhase: function () {
      return teamPhase(this.userCount)
    }
  },
  methods: {
    avatarOf (userId) {
      const filename = this.avatars[userId] || (userId === this.userId ? getMyAvatar() : '')
      return avatarUrl(filename)
    },
    async startGame () {
      if (!this.canStart) return
      this.info = '正在开启游戏...'
      try {
        const res = await post('/start_game/', {
          roomid: this.roomId,
          userid: this.userId,
          userpsw: this.userPsw
        })
        if (!res.ok) { this.info = errorMessage(res.message, '开始失败'); return }
        this.info = '游戏已开启，跳转中...'
        this.$router.push({ path: '/inroom' })
      } catch (e) {
        this.info = '网络错误，请重试'
      }
    },
    async updateRoomInfo () {
      try {
        const res = await post('/waiting_room/', {
          roomid: this.roomId,
          userid: this.userId,
          userpsw: this.userPsw
        })
        if (!res.ok) return
        this.userCount = res.users.length
        this.avatars = res.avatars || {}
        this.users = res.users.map(userId => ({ userId }))
        if (res.roomstatus === 'started') {
          this.info = '游戏已开启，跳转中...'
          this.$router.push({ path: '/inroom' })
        }
      } catch (e) {
        /* polling; ignore transient errors */
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
    this.updateRoomInfo()
  },
  beforeUnmount () {
    // console.log(this.intervalId)
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  },
}
</script>
<style scoped>
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
