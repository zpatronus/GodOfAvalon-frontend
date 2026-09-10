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
      <div class="subtitle">对局信息</div>
      <div class="info-grid">
        <div class="info-row"><span class="info-label">房间ID</span><span class="info-value">{{ roomId }}</span></div>
        <div class="info-row"><span class="info-label">你的玩家ID</span><span class="info-value">{{ userId }}</span></div>
        <div class="info-row"><span class="info-label">玩家数量</span><span class="info-value">{{ userCount }}</span></div>
      </div>
      <div class="subtitle">板子</div>
      <div class="board" v-html="template"></div>
    </div>

    <div class="container role-card">
      <details ref="details" @toggle="toggleDetails">
        <summary class="role-summary">
          <span class="role-summary-star">✦</span>
          <span>{{ summaryText }}</span>
          <span class="role-summary-star">✦</span>
        </summary>
        <div class="role-name">{{ chineseRoleName }}</div>
        <div v-if="roleUserSee" class="subtitle">{{ roleUserSee }}</div>
        <div class="role-see">
          <div v-for="u in usersUserSee" :key="u.userId" class="see-player">
            <img class="see-avatar" :src="avatarOf(u.userId)" :alt="u.userId" />
            <span class="see-name">{{ u.userId }}</span>
          </div>
        </div>
      </details>
    </div>

    <div class="container history-card" style="padding:0" v-if="votes.length > 0">
      <div class="subtitle">历史记录</div>
      <div
        v-for="(message, index) in renderedHistory"
        :key="index"
        class="history-entry"
        :class="`history-${message.kind}`"
      >
        <div :style="getBackgroundStyle(message)" class="history-message">
          <div class="history-inner">
            <div class="history-topline">
              <div class="subsubtitle">{{ message.title }}</div>
              <div v-if="message.builder" class="history-builder">
                <span class="history-label">队长</span>
                <span class="hist-member" :title="message.builder">
                  <img class="hist-avatar hist-builder-avatar" :src="avatarOf(message.builder)" :alt="message.builder" />
                  <span class="hist-name">{{ message.builder }}</span>
                </span>
              </div>
            </div>
            <div class="history-bottomline">
              <div class="history-team">
                <span class="history-label">队伍</span>
                <span v-for="m in message.members" :key="m" class="hist-member" :title="m">
                  <img class="hist-avatar" :src="avatarOf(m)" :alt="m" />
                  <span class="hist-name">{{ m }}</span>
                </span>
              </div>
              <div class="history-votes">
                <span class="green">{{ message.agree }}</span>
                <span class="vote-sep">|</span>
                <span class="red">{{ message.disagree }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div id="votepart" class="container" v-show="showvotecontainer">
      <div class="subtitle" v-if="votetitle">{{ votetitle }}</div>
      <div class="vote-content">
        <div class="vote-builder" v-if="roomState.team_builder">
          <span class="vote-label">队长</span>
          <span class="vote-person">
            <img class="vote-avatar vote-builder-avatar" :src="avatarOf(roomState.team_builder)" :alt="roomState.team_builder" />
            <span>{{ roomState.team_builder }}</span>
          </span>
        </div>
        <div class="vote-team">
          <span class="vote-label">任务队伍</span>
          <div class="vote-members">
            <span v-for="member in roomState.members" :key="member" class="vote-person">
              <img class="vote-avatar" :src="avatarOf(member)" :alt="member" />
              <span>{{ member }}</span>
            </span>
          </div>
        </div>
      </div>
      <div class="vote-buttons">
        <button class="vote-btn" :class="{ 'vote-selected': userChoice === 'yes' }" v-on:click="chooseYes">✔️</button>
        <button id="nobutton" class="vote-btn" :disabled="noButtonDisabled" :class="{ 'vote-selected': userChoice === 'no' }" v-on:click="chooseNo">❌</button>
      </div>
      <div v-show="choiceMade" class="vote-confirm">
        <div class="choice-info">你的选择：<span class="choice-pill">{{ userChoiceEmoji }}</span></div>
        <button class="btn-primary btn-block" v-on:click="confirmChoice">确认投票</button>
      </div>
    </div>

    <div class="container" id="teambuilding" v-show="showbuildcontainer">
      <div class="subtitle">任务队伍成员数量</div>
      <div class="phase-text">{{ teamBuildingPhase }}</div>
      <hr>
      <div class="subtitle">组建任务队伍&笔记</div>

      <div
        v-for="user in users"
        :key="user.userId"
        class="team-row"
        :class="{ 'team-selected': selectedUsers.includes(user.userId) }"
        role="button"
        tabindex="0"
        @click="toggleTeamUser(user.userId)"
        @keydown.enter.prevent="toggleTeamUser(user.userId)"
        @keydown.space.prevent="toggleTeamUser(user.userId)"
      >
        <img
          class="team-avatar"
          :src="avatarOf(user.userId)"
          :alt="user.userId"
        />
        <div class="team-copy">
          <span
            class="team-name"
          >{{ user.userId }}</span>
          <div class="note-emojis">
            <span v-for="emoji in emojis" :key="emoji" class="grayscale note-emoji" @click.stop="toggleGrayscale($event)">{{ emoji }}</span>
          </div>
        </div>
      </div>

      <div class="team-preview">
        <span class="preview-label">你的任务队伍是：</span>
        <span v-if="selectedUsers.length === 0" class="team-empty">∅</span>
        <span v-for="(u) in selectedUsers" :key="u" class="team-member" :title="u">
          <img class="preview-avatar" :src="avatarOf(u)" :alt="u" />
          <span>{{ u }}</span>
        </span>
      </div>
      <div v-if="!selectedUsers.includes(userId)" class="warn-note">你没有在队伍提名中包含自己，你确定吗？</div>
      <div class="team-actions">
        <button v-on:click="preDoQuestNew" :class="{ disabledButton: selectedUsers.length < 2, 'btn-primary': !preQuestDone }">确定任务队伍人选</button>
        <button v-on:click="doQuestNew" v-if="preQuestDone" class="btn-primary">发起任务队伍投票</button>
      </div>
    </div>
    <div class="status">{{ info }}</div>


    <div style="margin-bottom:100px"></div>
  </div>
</template>
<script>
import { post } from '@/api'
import { ROLE_DISPLAY, boardTemplate, teamPhase, canReject, renderVote, errorMessage } from '@/gameConfig'
import { getMyAvatar, avatarUrl } from '@/avatar'
export default {
  name: 'InRoomView',
  data () {
    return {
      emojis: ['🟦', '🧙‍♂️', '🛡️', '🔪', '😈', '🟧',],
      summaryText: '点击查看角色',
      roomId: '',
      userId: '',
      userPsw: '',
      users: [],
      avatars: {},
      userCount: 0,
      userRole: '',
      usersUserSee: [],
      selectedUsers: [],
      votes: [],
      preQuestDone: false,
      showvotecontainer: false,
      showbuildcontainer: false,
      roomState: { phase: 'normal', team_builder: '', members: [], on_vote: false, voted: false, build_round: 1, quest_round: 1 },
      userChoice: 'yes',
      userChoiceEmoji: '✔️',
      choiceMade: false,
      noButtonDisabled: true,
      info: '',
      intervalId: null,
    }
  },
  computed: {
    template: function () {
      return boardTemplate(this.userCount)
    },
    teamBuildingPhase: function () {
      return teamPhase(this.userCount)
    },
    chineseRoleName () {
      return (ROLE_DISPLAY[this.userRole] || {}).name || ''
    },
    roleUserSee () {
      return (ROLE_DISPLAY[this.userRole] || {}).hint || ''
    },
    renderedHistory () {
      return this.votes.map(renderVote)
    },
    votetitle () {
      if (this.roomState.phase === 'build') return `队伍提名 #${this.roomState.build_round}`
      if (this.roomState.phase === 'quest') return `任务 #${this.roomState.quest_round}`
      return ''
    },
  },
  methods: {
    avatarOf (userId) {
      const filename = this.avatars[userId] || (userId === this.userId ? getMyAvatar() : '')
      return avatarUrl(filename)
    },
    changeTeamUser () {
      this.preQuestDone = false;
    },
    toggleTeamUser (userId) {
      const index = this.selectedUsers.indexOf(userId)
      if (index === -1) {
        this.selectedUsers.push(userId)
      } else {
        this.selectedUsers.splice(index, 1)
      }
      this.changeTeamUser()
    },
    toggleGrayscale (event) {
      event.target.classList.toggle('grayscale');
    },
    toggleDetails () {
      this.summaryText = this.$refs.details.open ? '点击隐藏角色' : '点击查看角色'
    },
    getBackgroundStyle (message) {
      // only quest results get the split success/fail gradient
      if (message.kind === 'build') {
        return { padding: '0 0 8px 0' }
      }
      const successCnt = message.agreeCount
      const failCnt = message.disagreeCount
      const leftColor = 'rgba(0,160,224,0.4)'
      const rightColor = 'rgba(224,118,0,0.5)'
      const middleColor = 'rgba(0,0,0,0)'
      const split = (successCnt + failCnt) > 0 ? successCnt / (successCnt + failCnt) : 0.5
      return {
        padding: '0 0 8px 0',
        background: `linear-gradient(to right, ${leftColor} 0%, ${middleColor} ${split * 100}%, ${middleColor} ${split * 100}%, ${rightColor} 100%)`
      }
    },
    preDoQuestNew () {
      this.preQuestDone = true;
    },
    async doQuestNew () {
      this.info = '提交任务队伍提名中...'
      try {
        const res = await post('/build_team/', {
          roomid: this.roomId,
          userid: this.userId,
          userpsw: this.userPsw,
          members: this.selectedUsers
        })
        this.info = res.ok ? '' : errorMessage(res.message, '提交失败')
        if (res.ok) this.refresh()
      } catch (e) {
        this.info = '网络错误，请重试'
      }
    },
    chooseYes () {
      this.userChoice = 'yes'
      this.userChoiceEmoji = '✔️'
      this.choiceMade = true
    },
    chooseNo () {
      this.userChoice = 'no'
      this.userChoiceEmoji = '❌'
      this.choiceMade = true
    },
    async confirmChoice () {
      this.info = '提交投票中...'
      try {
        const res = await post('/vote/', {
          roomid: this.roomId,
          userid: this.userId,
          userpsw: this.userPsw,
          choice: this.userChoice === 'yes'
        })
        if (res.ok) {
          this.choiceMade = false
          this.showvotecontainer = false
          this.showbuildcontainer = false
          this.info = ''
          this.refresh()
        } else {
          this.info = errorMessage(res.message, '投票失败')
        }
      } catch (e) {
        this.info = '网络错误，请重试'
      }
    },
    async loadUsers () {
      try {
        const res = await post('/waiting_room/', {
          roomid: this.roomId, userid: this.userId, userpsw: this.userPsw
        })
        if (!res.ok) return
        this.userCount = res.users.length
        this.avatars = { ...this.avatars, ...(res.avatars || {}) }
        this.users = res.users.map(userId => ({ userId }))
      } catch (e) { /* polling */ }
    },
    async loadRole () {
      try {
        const res = await post('/my_role/', {
          roomid: this.roomId, userid: this.userId, userpsw: this.userPsw
        })
        if (!res.ok) return
        this.userRole = res.role
        this.avatars = { ...this.avatars, ...(res.avatars || {}) }
        this.usersUserSee = res.users.map(userId => ({ userId }))
      } catch (e) { /* polling */ }
    },
    async loadHistory () {
      try {
        const res = await post('/history/', {
          roomid: this.roomId, userid: this.userId, userpsw: this.userPsw
        })
        if (res.ok) {
          this.votes = res.votes
          this.avatars = { ...this.avatars, ...(res.avatars || {}) }
        }
      } catch (e) { /* polling */ }
    },
    async loadState () {
      try {
        const re = await post('/room_state/', {
          roomid: this.roomId, userid: this.userId, userpsw: this.userPsw
        })
        if (!re.ok) return
        this.roomState = re
        if (re.phase === 'normal') {
          this.showbuildcontainer = true
          this.showvotecontainer = false
        } else if (re.phase === 'build') {
          this.showbuildcontainer = false
          this.selectedUsers = [this.userId]
          this.preQuestDone = false
          this.showvotecontainer = !re.voted
        } else if (re.phase === 'quest') {
          this.showbuildcontainer = false
          this.showvotecontainer = re.on_vote && !re.voted
        }
        this.noButtonDisabled = !canReject(this.userRole, re.phase)
      } catch (e) { /* polling */ }
    },
    async refresh () {
      await Promise.all([this.loadHistory(), this.loadState()])
    },
  },
  async mounted () {
    this.roomId = localStorage.getItem('roomId')
    this.userId = localStorage.getItem('userId')
    this.userPsw = localStorage.getItem('userPsw')
    this.selectedUsers = [this.userId]

    await Promise.all([this.loadUsers(), this.loadRole(), this.loadHistory(), this.loadState()])
    this.intervalId = setInterval(() => { this.refresh() }, 2000)
  },
  beforeUnmount () {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  },

}
</script>
<style>
/* Note-taking: toggling the grayscale class marks a role as "dead" for yourself */
.grayscale {
  filter: grayscale(100%);
  opacity: 0.2;
}

/* Team selection cards */
.team-row {
  display: flex;
  align-items: center;
  gap: 12px;
  margin: 8px 0;
  padding: 8px;
  border: 1px solid var(--border-strong);
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.035);
  cursor: pointer;
  transition: background 0.2s, border-color 0.2s, box-shadow 0.2s;
}

.team-row:focus-visible {
  outline: 2px solid var(--accent);
  outline-offset: 2px;
}

.team-selected {
  border-color: var(--accent);
  background: rgba(224, 182, 76, 0.18);
  box-shadow: 0 0 0 3px rgba(224, 182, 76, 0.25);
}

.team-copy {
  display: grid;
  grid-template-rows: 1fr 1fr;
  align-self: stretch;
  flex: 1;
  min-width: 0;
}

.team-name {
  align-self: center;
  overflow: hidden;
  color: var(--text);
  font-size: 1rem;
  font-weight: 600;
  text-align: left;
  text-overflow: ellipsis;
  white-space: nowrap;
  cursor: pointer;
}

.note-emojis {
  display: flex;
  align-items: center;
  align-self: center;
  justify-content: flex-end;
  font-size: 1.5rem;
  line-height: 2rem;
  white-space: nowrap;
}

.note-emoji {
  display: inline-block;
  cursor: pointer;
  margin-left: 3px;
}

.team-preview {
  margin: 12px 0 4px;
  font-size: 0.95rem;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 4px;
}

.preview-label {
  color: var(--text-dim);
  margin-right: 2px;
}

.preview-avatar {
  width: 26px;
  height: 26px;
  border-radius: 6px;
  object-fit: cover;
  border: 1px solid rgba(255, 255, 255, 0.18);
  background: rgba(255, 255, 255, 0.06);
  vertical-align: middle;
  margin-right: 2px;
}

.team-avatar {
  width: 60px;
  height: 60px;
  border-radius: 13px;
  object-fit: cover;
  border: 2px solid rgba(255, 255, 255, 0.22);
  background: rgba(255, 255, 255, 0.06);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.22);
  flex-shrink: 0;
}

.team-empty {
  color: var(--text-faint);
}

.warn-note {
  margin: 8px 0;
  color: var(--evil);
  font-weight: 600;
  font-size: 0.9rem;
}

.team-actions {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 10px;
}

.team-actions button {
  width: 100%;
  margin: 0;
}

/* Vote panel */
.vote-content {
  display: grid;
  gap: 12px;
  margin: 8px 0 14px;
  padding: 12px;
  border: 1px solid var(--border-strong);
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.035);
}

.vote-builder,
.vote-team {
  display: flex;
  align-items: center;
  gap: 12px;
}

.vote-label {
  width: 58px;
  flex-shrink: 0;
  color: var(--text-dim);
  font-size: 0.8rem;
  text-align: right;
}

.vote-members {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  min-width: 0;
}

.vote-person {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  min-width: 0;
  font-size: 0.85rem;
}

.vote-avatar {
  width: 36px;
  height: 36px;
  flex-shrink: 0;
  border: 1.5px solid rgba(255, 255, 255, 0.2);
  border-radius: 9px;
  background: rgba(255, 255, 255, 0.06);
  object-fit: cover;
}

.vote-builder-avatar {
  border-color: rgba(224, 182, 76, 0.7);
}

.vote-buttons {
  display: flex;
  justify-content: center;
  gap: 12px;
  margin: 10px 0;
}

.vote-btn {
  font-size: 1.6rem;
  width: 64px;
  height: 64px;
  padding: 0;
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.vote-selected {
  border-color: var(--accent);
  background: rgba(224, 182, 76, 0.18);
  box-shadow: 0 0 0 3px rgba(224, 182, 76, 0.25);
}

.vote-confirm {
  animation: voteFadeIn 0.2s ease;
}

.vote-confirm button {
  margin: 10px 0 0;
}

.choice-info {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  color: var(--text-dim);
  margin: 4px 0 0;
}

.choice-pill {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 42px;
  height: 42px;
  padding: 0 10px;
  border-radius: 999px;
  background: rgba(229, 189, 84, 0.14);
  border: 1px solid rgba(229, 189, 84, 0.4);
  font-size: 1.3rem;
}

@keyframes voteFadeIn {
  from { opacity: 0; transform: translateY(4px); }
  to { opacity: 1; transform: translateY(0); }
}

/* History / quest result bars */
.history-card {
  overflow: hidden;
}

.history-card > .subtitle {
  padding: 14px 16px 6px;
  margin-bottom: 0;
}

.history-message {
  border-radius: 6px;
}

.history-entry + .history-entry {
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.history-build + .history-quest {
  margin-top: 10px;
  border-top: 0;
  padding-top: 0;
}

.history-inner {
  padding: 3px 14px 8px;
  line-height: 1.5;
}

.history-topline,
.history-bottomline {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px 18px;
}

.history-topline {
  margin-bottom: 5px;
}

.history-bottomline {
  align-items: flex-start;
}

.history-team {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 6px;
  min-width: 0;
}

.history-builder {
  display: flex;
  align-items: center;
  flex-shrink: 0;
  gap: 6px;
}

.history-label {
  color: var(--text-dim);
  font-size: 0.78rem;
  font-weight: 600;
}

.hist-member {
  display: inline-flex;
  align-items: center;
  gap: 4px;
}

.hist-name {
  color: var(--text);
  font-size: 0.95rem;
  font-weight: 600;
  line-height: 1.2;
}

.hist-avatar {
  width: 28px;
  height: 28px;
  border-radius: 7px;
  object-fit: cover;
  border: 1px solid rgba(255, 255, 255, 0.16);
  background: rgba(255, 255, 255, 0.06);
}

.hist-builder-avatar {
  border-color: rgba(224, 182, 76, 0.7);
}

.history-builder .hist-name {
  color: var(--accent-hover);
  font-weight: 700;
}

.history-votes {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  flex-shrink: 0;
  flex-wrap: wrap;
  gap: 6px;
  padding-top: 2px;
  text-align: right;
}

@media (max-width: 380px) {
  .history-bottomline {
    flex-direction: column;
  }

  .history-votes {
    align-self: flex-end;
  }
}

.vote-sep {
  color: var(--text-faint);
}

/* Role reveal */
.role-card {
  padding: 12px 18px 10px;
}

.role-name {
  text-align: center;
  font-size: 1.4rem;
  font-weight: 700;
  padding: 8px 0 4px;
}

.role-card details > .subtitle {
  margin: 10px 0 8px;
}

.role-see {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 18px 14px;
  margin: 8px 0 0;
  padding-bottom: 0;
}

.see-player {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 7px;
  width: 92px;
  min-width: 0;
}

.see-avatar {
  width: 76px;
  height: 76px;
  border-radius: 16px;
  object-fit: cover;
  border: 2px solid rgba(255, 255, 255, 0.22);
  background: rgba(255, 255, 255, 0.06);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.22);
}

.see-name {
  width: 100%;
  overflow: hidden;
  color: var(--text);
  font-size: 0.9rem;
  line-height: 1.2;
  text-align: center;
  text-overflow: ellipsis;
  white-space: nowrap;
}

details {
  width: 100%;
}

details summary {
  list-style: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 9px;
}

details summary::-webkit-details-marker {
  display: none;
}

.role-summary {
  width: fit-content;
  min-width: 190px;
  margin: 0 auto;
  padding: 8px 14px;
  border: 1px solid rgba(229, 189, 84, 0.28);
  border-radius: 999px;
  background: rgba(229, 189, 84, 0.07);
  color: var(--accent);
  font-size: 0.82rem;
  font-weight: 700;
  letter-spacing: 1px;
  transition: color 0.2s, background 0.2s, border-color 0.2s;
}

.role-summary:hover {
  color: var(--accent-hover);
  border-color: rgba(229, 189, 84, 0.55);
  background: rgba(229, 189, 84, 0.13);
}

.role-summary:focus-visible {
  outline: 1px solid var(--border-strong);
  outline-offset: 3px;
}

.role-summary-star {
  color: var(--accent-hover);
  font-size: 0.72rem;
}

</style>
