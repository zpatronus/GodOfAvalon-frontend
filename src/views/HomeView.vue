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
    <!--
    <button v-on:click="trypost">trypost button</button>
    -->
    <div class="container">
      <b class="centerContainer">
        <p style="color: yellow">For English speakers: Apologies, this project started as a practice and was not
          designed with multilingual
          considerations in mind. Please use <a
            href="https://goa-zijuny-dev.translate.goog/?_x_tr_sl=zh-CN&_x_tr_tl=en&_x_tr_hl=en&_x_tr_pto=wapp">Google
            Translate</a>.</p>

      </b>
      <div class="subtitle">--help</div>
      要使用此网站玩《阿瓦隆：抵抗组织》，首先需要创建一个房间。
      <br><br>
      <b>创建房间：</b>
      如果你还没有创建房间，请前往“创建房间”选项卡，在那里你需要选择房间ID。
      <br><br>
      <b>创建玩家/加入房间：</b>
      如果房间已经创建，请前往“加入房间”选项卡，在那里你需要选择玩家ID并设置密码。如果该房间中尚未创建此玩家ID，将会初始化一个新玩家。
      <hr>
      <b>反馈：</b>如果你找到了bug，或者有任何想法，欢迎到这个项目的github repo新增issue（<a
        href="https://github.com/zpatronus/GodOfAvalon-frontend">前端</a>，<a
        href="https://github.com/zpatronus/GodOfAvalon-backend">后端</a>）；如果你不熟悉github，或者只是想留个言，也可以填写
      <a href="https://forms.gle/g6kHoRVJ7qCBM5598">Google Form</a>。
    </div>
    <br>
    <div class="container">
      <div class="subtitle">更新日志</div>


      <p><strong>2026年3月21日：</strong></p>
      <ol>
        <li>前端性能优化。</li>
      </ol>

      <p><strong>2025年1月13日：</strong></p>
      <ol>
        <li>更新任务结果显示界面。</li>
      </ol>

      <p><strong>2024年12月31日：</strong></p>
      <ol>
        <li>更新前端依赖至安全版本。</li>
      </ol>

      <p><strong>2024年12月8日：</strong></p>
      <ol>
        <li>增加一键随机密码和玩家id。</li>
      </ol>

      <p><strong>2024年12月7日：</strong></p>
      <ol>
        <li>增加访客计数。</li>
      </ol>

      <p><strong>2024年11月4日：</strong></p>
      <ol>
        <li>迁移后端至新服务器。</li>
      </ol>

      <p><strong>2024年11月1日：</strong></p>
      <ol>
        <li>迁移域名至goa.zijuny.dev，迁移前端至新服务器。</li>
      </ol>

      <p><strong>2024年10月29日：</strong></p>
      <ol>
        <li>修复了万圣节背景计时器被清除的bug。</li>
        <li>新增了快捷输入房间ID按钮，新开一局更容易了。</li>
        <li>修改了一些样式布局。</li>
      </ol>

      <p><strong>2024年10月28日：</strong></p>
      <ol>
        <li>修改了任务队伍人数的显示位置。</li>
        <li>新增了万圣节背景。</li>
      </ol>

      <p><strong>2024年10月27日：</strong></p>
      <ol>
        <li>修改了历史记录出现逻辑：没有记录时不显示。</li>
      </ol>

      <p><strong>2024年10月24日：</strong></p>
      <ol>
        <li>添加了提名的任务队伍成员信息。</li>
        <li>添加了任务队伍中不包含自己的警示信息。</li>
      </ol>

      <p><strong>2024年10月18日：</strong></p>
      <ol>
        <li>升级至 Django 5.1.2。</li>
        <li>添加了房间清理功能。</li>
        <li>修复了等待室表情符号显示问题。</li>
        <li>为增强安全性，升级至 Vue 3。</li>
        <li>添加并随后移除了支付宝支持。</li>
        <li>修改了 HomeView，添加了反馈和 PayPal 集成。</li>
      </ol>

      <p><strong>2024年7月22日：</strong></p>
      <ol>
        <li>修复了在 iOS 设备上的显示问题。</li>
        <li>更新并调整了历史记录的样式。</li>
        <li>添加了确认团队组建按钮。</li>
        <li>实现了角色标记功能。</li>
        <li>添加了角色表情符号，修改了滚动条。</li>
        <li>增加了加载信息。</li>
      </ol>

      <p><strong>2024年7月21日：</strong></p>
      <ol>
        <li>解决了长度方面的问题。</li>
        <li>添加了“跳转中”的提示信息。</li>
        <li>修改了副标题的样式。</li>
        <li>修复了房间内团队组建的显示逻辑。</li>
      </ol>

      <p><strong>2024年7月19日：</strong></p>
      <ol>
        <li>在组建团队后清除了已选择的用户。</li>
        <li>修复了当所有玩家都被添加到团队时出现的错误。</li>
        <li>修正了界面中的措辞。</li>
        <li>修复了历史记录背景颜色的问题。</li>
      </ol>

      <p><strong>2024年7月18日：</strong></p>
      <ol>
        <li>添加了用于指示任务结果的背景颜色。</li>
        <li>使背景图案具有响应式设计。</li>
      </ol>

      <p><strong>2024年7月17日：</strong></p>
      <ol>
        <li>加快了等待室信息的加载速度。</li>
        <li>修复了允许少于两名玩家开始任务的问题。</li>
        <li>更新了 README 文档。</li>
        <li>修复了自动加入功能。</li>
        <li>实现了游戏开始时自动加入房间。</li>
      </ol>

      <p><strong>2024年7月15日：</strong></p>
      <ol>
        <li>优化了整体样式。</li>
        <li>改善了背景设计。</li>
        <li>更新了 <code>.gitignore</code> 文件。</li>
        <li>将软件包更新至最新版本。</li>
        <li>将应用程序语言更改为中文。</li>
        <li>添加了背景并将内容完全翻译为中文。</li>
        <li>更新了团队构建复选框的样式，界面转换为中文。</li>
      </ol>

      <p><strong>2023年5月12日：</strong></p>
      <ol>
        <li>根据服务器性能调整了轮询速率。</li>
      </ol>

      <p><strong>2023年5月10日：</strong></p>
      <ol>
        <li>改进了代码中的空格布局。</li>
        <li>在井号（#）前添加了空格。</li>
        <li>当无人同意或反对时，移除了冒号。</li>
      </ol>

      <p><strong>2022年11月23日：</strong></p>
      <ol>
        <li>更正了 <code>HomeView</code> 中的游戏名称。</li>
      </ol>

      <p><strong>2022年10月8日：</strong></p>
      <ol>
        <li>对应用程序进行了小幅调整。</li>
        <li>将房间内视图的刷新间隔从 2 秒改为 4 秒。</li>
        <li>添加了隐藏功能。</li>
        <li>在房间内视图中实现了点击查看角色的功能。</li>
        <li>在消息中添加了组建者的信息。</li>
      </ol>

      <p><strong>2022年9月7日：</strong></p>
      <ol>
        <li>在 <code>HomeView</code> 中添加了使用说明。</li>
      </ol>

      <p><strong>2022年8月16日：</strong></p>
      <ol>
        <li>合并了拉取请求 #2：更新了 Pillow 和 NumPy 的版本。</li>
        <li>更新了应用程序版本号。</li>
        <li>合并了拉取请求 #1：更新了 Django 版本。</li>
        <li>将 Django 更新至最新版本。</li>
        <li>在主页中将 “caviar” 更改为 “zpatronus”。</li>
      </ol>

      <p><strong>2022年8月7日：</strong></p>
      <ol>
        <li>向仓库添加了许可证文件。</li>
      </ol>

      <p><strong>2022年8月4日：</strong></p>
      <ol>
        <li>更新了 README 文件中的链接。</li>
      </ol>

      <p><strong>2022年5月29日：</strong></p>
      <ol>
        <li>添加了字符串检查函数以进行验证。</li>
      </ol>

      <p><strong>2022年5月14日：</strong></p>
      <ol>
        <li>从 <code>main.js</code> 中移除了 Axios。</li>
        <li>向项目添加了静态文件。</li>
        <li>在依赖项中启用了虚拟环境支持。</li>
      </ol>

      <p><strong>2022年5月10日：</strong></p>
      <ol>
        <li>切换到新电脑后的首次提交。</li>
        <li>在函数声明后添加了空格。</li>
        <li>进行了其他一些修改。</li>
      </ol>

      <p><strong>2022年5月5日：</strong></p>
      <ol>
        <li>在 <code>App</code> 中将水平线样式更改为虚线。</li>
        <li>限制了应用程序布局的最大宽度。</li>
      </ol>

      <p><strong>2022年5月4日：</strong></p>
      <ol>
        <li>更新了 <code>App.vue</code> 中的链接样式。</li>
        <li>移除了项目中未使用的脚本。</li>
      </ol>

      <p><strong>2022年5月3日：</strong></p>
      <ol>
        <li>将项目开源。</li>
        <li>解决了未跟踪的文件以修复 <code>.gitignore</code> 问题。</li>
        <li>更新了项目的依赖项。</li>
        <li>更新了 README 文件。</li>
        <li>修复了与 <code>.gitignore</code> 相关的未跟踪文件问题。</li>
      </ol>

      <p><strong>2022年4月28日：</strong></p>
      <ol>
        <li>为保持一致性，将缩进大小改为 2 个空格。</li>
      </ol>

      <p><strong>2022年4月26日：</strong></p>
      <ol>
        <li>添加了莫德雷德的爪牙可见的角色信息。</li>
        <li>确保用户只能投票一次。</li>
      </ol>

      <p><strong>2022年4月24日：</strong></p>
      <ol>
        <li>修复了冗余的 CSRF 设置。</li>
        <li>重写了投票信息的获取方式。</li>
        <li>重写了团队提案功能。</li>
      </ol>

      <p><strong>2022年4月23日：</strong></p>
      <ol>
        <li>重写了消息轮询模块。</li>
        <li>添加了 POST 方法和 CSRF 保护。</li>
      </ol>

      <p><strong>2022年4月10日：</strong></p>
      <ol>
        <li>修复了应用程序中的各种错误。</li>
      </ol>

      <p><strong>2022年4月4日：</strong></p>
      <ol>
        <li>完成了 HTML 和 JavaScript 组件。</li>
        <li>更新了项目的完成状态。</li>
      </ol>

      <p><strong>2022年4月3日：</strong></p>
      <ol>
        <li>添加了投票功能。</li>
      </ol>

      <p><strong>2022年4月2日：</strong></p>
      <ol>
        <li>添加了任务选择功能。</li>
        <li>实现了角色之间的知晓关系。</li>
        <li>添加了角色分配器。</li>
        <li>引入了 <code>enterRoom</code> 功能。</li>
      </ol>

      <p><strong>2022年4月1日：</strong></p>
      <ol>
        <li>添加了等待室功能。</li>
      </ol>

      <p><strong>2022年3月31日：</strong></p>
      <ol>
        <li>建立了初始的项目结构。</li>
        <li>添加了加入房间的功能。</li>
      </ol>

      <p><strong>2022年3月27日：</strong></p>
      <ol>
        <li>初始化了仓库的首次提交。</li>
        <li>添加了房间创建功能。</li>
      </ol>

      <p><strong>2022年3月26日：</strong></p>
      <ol>
        <li>初始化了项目。</li>
        <li>修改了 <code>package-lock.json</code>、<code>package.json</code> 和 <code>src/App.vue</code> 等核心文件。</li>
        <li>添加了新视图：<code>CreateRoomView.vue</code> 和 <code>JoinRoomView.vue</code>。</li>
      </ol>
    </div>
  </div>
</template>
<script>

import axios from "axios"
// import Vue from "vue"
// import VueCookies from 'vue-cookies'
// Vue.use(VueCookies)
axios.defaults.withCredentials = true
export default {
  name: 'HomeView',
  components: {

  },
  data () {
    return {
      token: ''
    }
  },
  computed: {
    server () {
      return this.$store.state.server
    }
  },
  methods: {
    trypost () {

      axios({
        headers: {
          'X-CSRFToken': this.token,
          'Content-Type': 'application/json',
        },
        withCredentials: true,
        url: `${this.server}/test/`,
        method: 'post',
        data: {
          'data1': 'data2',
        }
      })
        .then((res) => {
          console.log(res)
        })
    },

    gettoken () {
      axios({
        method: 'get',
        url: `${this.server}/get_csrf_token/`,
        withCredentials: true
      })
        .then((res) => {
          this.token = res.data.token
          //console.log(this.token)
        })
    },
  },
  mounted: function () {
    //get token
    this.gettoken()
  },
}
</script>
