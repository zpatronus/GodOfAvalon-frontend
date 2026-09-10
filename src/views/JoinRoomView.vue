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
      <div class="subtitle">房间ID</div>
      <div class="field-row">
        <input v-on:input="checkRoomId" v-model="roomId" type="text" placeholder="房间ID" />
        <button v-on:click="generateNextRoomId">下一个</button>
      </div>
      <div class="subtitle">玩家ID</div>
      <input v-on:input="checkUserId" v-model="userId" type="text" placeholder="玩家ID" />
      <!-- <button v-on:click="generateRandomId">随机，无意冒犯，纯属搞笑</button> -->
      <div class="subtitle">玩家密码</div>
      <div class="field-row">
        <input v-on:input="checkUserPsw" v-model="userPsw" type="text" placeholder="玩家密码" />
        <button v-on:click="generateRandomPsw">随机</button>
      </div>
      <div class="subtitle avatar-title">选择头像</div>
      <div class="avatar-picker">
        <button type="button" class="avatar-preview-wrap" aria-label="选择头像" aria-haspopup="dialog" title="点击选择头像" v-on:click="openAvatarPicker">
          <img class="avatar-preview" :src="avatarOfUser(selectedAvatar)" alt="avatar" />
        </button>
        <button v-on:click="randomizeAvatar">随机头像</button>
      </div>
      <dialog ref="avatarDialog" class="avatar-dialog" aria-labelledby="avatar-dialog-title" v-on:click="dismissAvatarBackdrop">
        <div class="avatar-dialog-header">
          <h2 id="avatar-dialog-title">选择头像</h2>
          <button type="button" aria-label="关闭" v-on:click="$refs.avatarDialog.close()">×</button>
        </div>
        <div class="avatar-grid">
        <button
          v-for="file in AVATARS"
          :key="file"
          type="button"
          class="avatar-thumb"
          :class="{ 'avatar-selected': file === selectedAvatar }"
          :aria-pressed="file === selectedAvatar"
          :aria-label="file.replace(/\.svg$/, '').replace(/-/g, ' ')"
          :title="file"
          v-on:click="chooseAvatar(file)"
        >
          <img :src="avatarOfUser(file)" alt="" />
        </button>
        </div>
      </dialog>
      <ul class="tips">
        <li>
          不要使用你的常用密码，密码会被明文传输
        </li>
        <li>
          玩家密码不是房间密码，网站不存在房间密码
        </li>
        <li>
          玩家应当设置自己的密码，防止同一房间他人偷窥自己身份
        </li>
        <li>
          建议随机输入，网站会将密码保存在本地，刷新后也不会丢失，并会自动填入
        </li>
      </ul>
      <button class="btn-primary btn-block" v-on:click="joinRoom">加入房间</button>
      <div class="status">{{ info }}</div>
    </div>
  </div>
</template>
<script>
import { get, post } from '@/api'
import { errorMessage } from '@/gameConfig'
import { AVATARS, getMyAvatar, setMyAvatar, randomAvatar, avatarUrl } from '@/avatar'
export default {
  name: 'CreateRoomView',
  data () {
    return {
      roomId: 'sample',
      userId: 'sample',
      userPsw: 'sample',
      validRoomId: 'sample',
      validUserId: 'sample',
      validUserPsw: 'sample',
      AVATARS,
      selectedAvatar: '',
      info: '',
    }
  },
  methods: {
    openAvatarPicker () {
      const dialog = this.$refs.avatarDialog
      dialog.showModal()
      const selected = dialog.querySelector('.avatar-selected')
      if (selected) selected.focus()
    },
    dismissAvatarBackdrop (event) {
      const dialog = this.$refs.avatarDialog
      if (event.target !== dialog) return
      const bounds = dialog.getBoundingClientRect()
      if (event.clientX < bounds.left || event.clientX > bounds.right ||
          event.clientY < bounds.top || event.clientY > bounds.bottom) {
        dialog.close()
      }
    },
    chooseAvatar (file) {
      this.selectAvatar(file)
      this.$refs.avatarDialog.close()
    },
    randomizeAvatar () {
      this.selectAvatar(randomAvatar())
    },
    selectAvatar (file) {
      this.selectedAvatar = file
      setMyAvatar(file)
    },
    avatarOfUser (file) {
      return avatarUrl(file)
    },
    async joinRoom () {
      if (this.validRoomId === '') {
        this.info = '房间ID不能为空！'
        return
      }
      if (this.validUserId === '') {
        this.info = '玩家ID不能为空！'
        return
      }
      if (this.validUserPsw === '') {
        this.info = '密码不能为空！'
      }
      this.info = '加入房间中...'
      try {
        const res = await post('/join_room/', {
          roomid: this.validRoomId,
          userid: this.validUserId,
          userpsw: this.validUserPsw,
          avatar: this.selectedAvatar
        })
        if (!res.ok) {
          this.info = errorMessage(res.message, '加入失败')
          return
        }
        // Existing players keep the avatar chosen on their first join. The
        // backend returns that authoritative filename on every successful join.
        this.selectedAvatar = res.avatar || this.selectedAvatar
        setMyAvatar(this.selectedAvatar)
        this.info = res.created ? '成功创建玩家，跳转中...' : '成功登录，跳转中...'
        const status = await get(`/room_status/${this.validRoomId}/`)
        if (status.ok && status.status === 'waiting') {
          this.$router.push({ path: '/waitingroom' })
        } else {
          this.$router.push({ path: '/inroom' })
        }
      } catch (e) {
        this.info = '网络错误，请重试'
      }
    },
    checkRoomId () {
      let flag = this.roomId.length <= 6;
      for (let i = 0; i < this.roomId.length && flag; i++) {
        let c = this.roomId.charAt(i)
        if (!(('0' <= c && c <= '9') || ('a' <= c && c <= 'z') || ('A' <= c && c <= 'Z'))) {
          flag = false;
        }
      }
      if (flag) {
        this.validRoomId = this.roomId
        this.updateRoomInfo()
      } else {
        this.roomId = this.validRoomId
      }
    },
    checkUserId () {
      let flag = this.userId.length <= 7;
      for (let i = 0; i < this.userId.length && flag; i++) {
        let c = this.userId.charAt(i)
        if (!(('0' <= c && c <= '9') || ('a' <= c && c <= 'z') || ('A' <= c && c <= 'Z') || (c === '_'))) {
          flag = false;
        }
      }
      if (flag) {
        this.validUserId = this.userId
        this.updateRoomInfo()
      } else {
        this.userId = this.validUserId
      }
    },
    checkUserPsw () {
      let flag = this.userPsw.length <= 6;
      for (let i = 0; i < this.userPsw.length && flag; i++) {
        let c = this.userPsw.charAt(i)
        if (!(('0' <= c && c <= '9') || ('a' <= c && c <= 'z') || ('A' <= c && c <= 'Z'))) {
          flag = false;
        }
      }
      if (flag) {
        this.validUserPsw = this.userPsw
        this.updateRoomInfo()
      } else {
        this.userPsw = this.validUserPsw
      }
    },
    updateRoomInfo () {
      localStorage.setItem(`roomId`, this.validRoomId)
      localStorage.setItem(`userId`, this.validUserId)
      localStorage.setItem(`userPsw`, this.validUserPsw)
    },
    generateNextRoomId () {
      let currentId = this.roomId
      let prefix = ''
      let numberPart = ''
      if (currentId === '') {
        this.info = '自动下一个失败，请手动输入房间ID'
        return;
      }

      for (let i = 0; i < currentId.length; i++) {
        let char = currentId[i]
        if (isNaN(parseInt(char))) {
          prefix += char
        } else {
          numberPart = currentId.slice(i)
          break
        }
      }

      let nextRoomId = ''
      if (numberPart) {
        let newNumber = (parseInt(numberPart) + 1).toString()
        nextRoomId = prefix + newNumber
      } else {
        nextRoomId = prefix + '0'
      }

      if (!this.isValidRoomId(nextRoomId)) {
        this.info = '自动下一个失败，请手动输入房间ID'
        return;
      }
      this.roomId = nextRoomId;

      this.checkRoomId()
    },
    generateRandomPsw () {
      const randomNumber = Math.floor(Math.random() * (9999 - 1000 + 1)) + 1000;
      this.userPsw = `${randomNumber}`;
      this.checkUserPsw();
    },
    generateRandomId () {
      this.validUserId = this.getRandomUserId();
      this.userId = this.validUserId;
      this.updateRoomInfo();
    },
    isValidRoomId (id) {
      if (id.length > 6) return false
      for (let i = 0; i < id.length; i++) {
        let c = id[i]
        if (!((c >= '0' && c <= '9') || (c >= 'a' && c <= 'z') || (c >= 'A' && c <= 'Z'))) {
          return false
        }
      }
      return true
    },
    getRandomUserId () {
      const defaultUsernames = [
        "Peter", "Stewie", "Quag", "Lois", "Brian", "Meg", "Chris",
        "Joe", "Clev", "Herb", "Adam", "Bonnie", "Mort", "Neil", "Glenn",
        "Nap", "Hitler", "Stalin", "Church", "Patton", "Rommel",
        "Monty", "Eisen", "Lee", "Grant", "Hannib", "Scipio",
        "Caesar", "Nelson", "Nimitz", "Wash", "Attila", "Tito",
        "FDR", "Truman", "Mussol", "Franco", "Castro", "Bismar",
        "Wilhel", "Lincoln", "Jeff", "Jackson", "NapIII", "DeGaul",
        "Cromwe", "Philip", "George", "Andrew", "Clinto", "Putin",
        "Trump", "Kim", "Boris", "Zelens", "Arafat", "Netany",
        "Erdoga", "Bolson", "Dutert", "Orban", "LePen", "Modi",
        "Saddam", "Gaddaf", "BinLad", "Assad", "Che", "Hoover",
        "Nixon", "Reagan", "Bush", "Macron", "Merkel", "Thatchr",
        "Blair", "Biden", "Sandrs", "Obama", "Harris", "Pelosi",
        "Marjor", "Gaetz", "BoJo", "Epstei", "Weiner", "Ritten",
        "Ye", "Musk", "Zucker", "Bezos", "Snowde", "Assang", "Soros",
        "Alexan", "Petrov", "Zhuko", "Konev", "Timosh", "DeGaul",
        "NapIII", "Monty", "Rommel", "Bradly", "MacArt", "Yama",
        "Welles", "Truman", "FDR", "Reagan", "Nixon", "Clinto",
        "Eisen", "Patton", "Sherma", "Jackson", "Nelson", "Welles",
        "Blair", "Biden", "Thatchr", "Church", "BoJo", "Macron",
        "DeGaul", "Bonapa"
      ];

      const randomIndex = Math.floor(Math.random() * defaultUsernames.length);
      return defaultUsernames[randomIndex];
    }
  },
  mounted: function () {
    if (!(localStorage.getItem('roomId') === null)) {
      let tempRoomId = localStorage.getItem('roomId');
      this.roomId = tempRoomId;
      this.validRoomId = tempRoomId;
    }
    if (!(localStorage.getItem('userId') === null || localStorage.getItem('userPsw') === null)) {
      let tempUserId = localStorage.getItem('userId'), tempUserPsw = localStorage.getItem('userPsw');
      if (tempUserId === '') {
        tempUserId = this.getRandomUserId();
      }
      this.userId = tempUserId;
      this.validUserId = tempUserId;
      this.userPsw = tempUserPsw;
      this.validUserPsw = tempUserPsw;
    } else {
      if (localStorage.getItem('userId') === null) {

        this.userId = this.getRandomUserId();
        this.validUserId = this.userId;
      }
      if (localStorage.getItem('userPsw') === null) {
        this.generateRandomPsw();
      }
    }
    this.updateRoomInfo();
    this.selectedAvatar = getMyAvatar();
  },
}
</script>
<style scoped>
.avatar-title {
  margin-top: 14px;
}

.avatar-picker {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  margin: 6px 0 10px;
}

.avatar-preview-wrap {
  padding: 0;
  margin: 0;
  width: 96px;
  height: 96px;
  border-radius: 10px;
  overflow: hidden;
  border: 2px solid var(--accent);
  background: rgba(255, 255, 255, 0.06);
  flex-shrink: 0;
}

.avatar-preview {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.avatar-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  max-height: min(520px, calc(100dvh - 160px));
  overflow-y: auto;
  padding: 4px;
  margin-bottom: 4px;
}

.avatar-dialog {
  width: 420px;
  max-width: calc(100vw - 64px);
  max-height: calc(100dvh - 64px);
  padding: 16px;
  border: 1px solid var(--border-strong);
  border-radius: 16px;
  background: var(--bg-1);
  color: var(--text);
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
}

.avatar-dialog::backdrop {
  background: rgba(0, 0, 0, 0.6);
}

.avatar-dialog-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
}

.avatar-dialog-header h2 {
  margin: 0;
  font-size: 1.1rem;
}

.avatar-dialog-header button {
  margin: 0;
  padding: 4px 12px;
  font-size: 1.4rem;
}

.avatar-thumb {
  flex-shrink: 0;
  padding: 0;
  margin: 0;
  width: 66px;
  height: 66px;
  border-radius: 8px;
  object-fit: cover;
  border: 2px solid rgba(255, 255, 255, 0.08);
  cursor: pointer;
  transition: transform 0.1s, border-color 0.15s, box-shadow 0.15s;
}

.avatar-thumb img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 6px;
}

.avatar-thumb:hover {
  transform: scale(1.08);
}

.avatar-selected {
  border-color: var(--accent);
  box-shadow: 0 0 0 2px rgba(224, 182, 76, 0.4);
}
</style>
