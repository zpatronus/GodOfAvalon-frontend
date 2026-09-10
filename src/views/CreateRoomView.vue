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
      <button class="btn-primary btn-block" v-on:click="createRoom">创建房间</button>
      <div class="status">{{ info }}</div>
    </div>
  </div>
</template>
<script>
import { post } from '@/api'
import { errorMessage } from '@/gameConfig'
export default {
  name: 'CreateRoomView',
  data () {
    return {
      roomId: 'sample',
      validRoomId: 'sample',
      info: '',
    }
  },
  methods: {
    async createRoom () {
      if (this.validRoomId === '') {
        this.info = '房间ID不能为空！'
        return
      }
      this.info = '创建房间中...'
      try {
        const res = await post('/create_room/', { roomid: this.validRoomId })
        if (!res.ok) {
          this.info = errorMessage(res.message, '创建失败')
          return
        }
        this.updateRoomInfo()
        this.info = '创建成功，跳转中...'
        setTimeout(() => {
          this.$router.push({ path: '/joinroom' })
        }, 1000)
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
    updateRoomInfo () {
      localStorage.setItem(`roomId`, this.validRoomId)
    },
    generateNextRoomId () {
      let currentId = this.roomId
      let prefix = ''
      let numberPart = ''
      if (currentId === '') {
        this.roomId = this.randomRoomId()
        this.checkRoomId()
        return;
      }

      // Separate characters from trailing numbers
      for (let i = 0; i < currentId.length; i++) {
        let char = currentId[i]
        if (isNaN(parseInt(char))) {
          prefix += char
        } else {
          numberPart = currentId.slice(i)
          break
        }
      }

      // Increment number or append '0' if none
      if (numberPart) {
        let newNumber = (parseInt(numberPart) + 1).toString()
        this.roomId = prefix + newNumber
      } else {
        this.roomId = prefix + '0'
      }

      // Generate random 4-character ID if not valid
      if (!this.isValidRoomId(this.roomId)) {
        this.roomId = this.randomRoomId()
      }

      this.checkRoomId()
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
    randomRoomId () {
      let chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ'
      let result = ''
      for (let i = 0; i < 5; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length))
      }
      return result
    },
  },
  mounted: function () {
    if (!(localStorage.getItem('roomId') === null)) {
      let tempRoomId = localStorage.getItem('roomId');
      this.roomId = tempRoomId;
      this.validRoomId = tempRoomId;
    }
  },

}
</script>
