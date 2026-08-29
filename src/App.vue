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
  <div id="app">

    <h1 style="display: none;">God of Avalon | Play Avalon Online! | 线上阿瓦隆 | 阿瓦隆发牌助手</h1>
    <header class="masthead">
      <div class="title">God of Avalon</div>
      <div class="tagline">线上阿瓦隆 · 阿瓦隆发牌助手</div>
    </header>

    <nav class="nav">
      <router-link class="nav-link" to="/">主页</router-link>
      <router-link class="nav-link" to="/createroom">创建房间</router-link>
      <router-link class="nav-link" to="/joinroom">加入房间</router-link>
    </nav>

    <router-view />
    <div class="visitor-count">
      Visitors: {{ visitorCount }}
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data () {
    return {
      visitorCount: 0,
    };
  },
  mounted () {
    this.fetchVisitorCount();
  },
  methods: {
    async fetchVisitorCount () {
      try {
        const response = await axios.get("https://zjyang.dev/visitor_count/goa/");
        this.visitorCount = response.data || 'N/A';
      } catch (error) {
        console.error("Error fetching visitor count:", error);
      }
    },
  },
};
</script>



<style lang="scss">
:root {
  --bg-0: #0e131a;
  --bg-1: #161d26;
  --surface: rgba(23, 30, 40, 0.82);
  --surface-2: rgba(255, 255, 255, 0.04);
  --border: rgba(255, 255, 255, 0.08);
  --border-strong: rgba(255, 255, 255, 0.16);
  --text: #e7ecf3;
  --text-dim: #aeb9c6;
  --text-faint: #7d8a99;
  --accent: #e0b64c;
  --accent-hover: #f2cc6b;
  --accent-ink: #1c1405;
  --good: #3db4f0;
  --evil: #ff8b45;
  --radius: 14px;
  --radius-sm: 9px;
  --shadow: 0 10px 28px rgba(0, 0, 0, 0.35);
}

* {
  color: var(--text);
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial,
    "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "Noto Sans SC", sans-serif;
  box-sizing: border-box;
}

html {
  -webkit-text-size-adjust: 100%;
}

body {
  margin: 0;
  padding: 0;
  min-height: 100vh;
  background:
    radial-gradient(60% 38% at 50% 0%, rgba(224, 182, 76, 0.07), transparent 70%),
    linear-gradient(180deg, var(--bg-0), var(--bg-1));
  background-attachment: fixed;
  background-repeat: no-repeat;
}

#app {
  max-width: 420px;
  margin: 0 auto;
  padding: 24px 16px 48px;
}

/* ---------- Masthead + nav ---------- */

.masthead {
  text-align: center;
  margin-bottom: 18px;
}

.title {
  font-size: 2rem;
  font-weight: 800;
  letter-spacing: 1px;
  background: linear-gradient(180deg, #f7e2a0, var(--accent));
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  color: var(--accent);
}

.tagline {
  margin: 6px 0 0;
  color: var(--text-faint);
  font-size: 0.8rem;
  letter-spacing: 2px;
}

.nav {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 4px;
  width: fit-content;
  max-width: 100%;
  margin: 0 auto 20px;
  padding: 4px;
  background: var(--surface-2);
  border: 1px solid var(--border);
  border-radius: 999px;
}

.nav-link {
  text-decoration: none;
  color: var(--text-dim);
  font-weight: 600;
  font-size: 0.9rem;
  padding: 8px 16px;
  border-radius: 999px;
  white-space: nowrap;
  transition: color 0.2s, background 0.2s;
}

.nav-link:hover {
  color: var(--text);
  background: rgba(255, 255, 255, 0.06);
}

.nav-link.router-link-exact-active {
  color: var(--accent-ink);
  background: var(--accent);
}

/* ---------- Cards ---------- */

.container {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 16px;
  margin: 12px auto;
  box-shadow: var(--shadow);
  backdrop-filter: blur(10px);
}

.centerContainer {
  align-items: center;
  display: flex;
  flex-direction: column;
}

.subtitle {
  margin: 14px 0 8px;
  font-size: 0.8rem;
  font-weight: 700;
  letter-spacing: 1.5px;
  text-transform: uppercase;
  color: var(--accent);
  text-align: center;
}

.subtitle:first-child {
  margin-top: 0;
}

.subsubtitle {
  font-style: italic;
  font-weight: 600;
  color: var(--text-dim);
}

/* ---------- Typography helpers ---------- */

.green {
  color: var(--good);
}

.red {
  color: var(--evil);
}

.hidden {
  display: none;
}

a {
  color: var(--accent);
}

/* ---------- Form controls ---------- */

input {
  background: rgba(255, 255, 255, 0.06);
  font-size: 1rem;
  outline: none;
  padding: 11px 14px;
  border: 1px solid var(--border-strong);
  border-radius: var(--radius-sm);
  margin: 0;
  width: min(220px, 100%);
  color: var(--text);
  box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.3);
  transition: border-color 0.2s, background 0.2s, box-shadow 0.2s;
}

input:focus {
  background: rgba(255, 255, 255, 0.09);
  border-color: var(--accent);
  box-shadow: 0 0 0 3px rgba(224, 182, 76, 0.22);
}

input::placeholder {
  color: var(--text-faint);
}

.field-row {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  gap: 8px;
  margin: 8px 0;
}

.field-row input {
  flex: 1 1 auto;
  min-width: 0;
  max-width: 220px;
}

.status {
  min-height: 1.3em;
  margin-top: 10px;
  color: var(--text-dim);
  font-size: 0.9rem;
  text-align: center;
}

button {
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.12), rgba(255, 255, 255, 0.06));
  border: 1px solid var(--border-strong);
  border-radius: var(--radius-sm);
  padding: 10px 18px;
  margin: 8px 4px;
  color: var(--text);
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.25);
  transition: background 0.2s, border-color 0.2s, transform 0.05s;
}

button:hover {
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.18), rgba(255, 255, 255, 0.1));
}

button:active {
  transform: translateY(1px);
}

button:disabled {
  opacity: 0.45;
  filter: grayscale(0.5);
  cursor: not-allowed;
  pointer-events: none;
}

.btn-primary {
  background: linear-gradient(180deg, var(--accent-hover), var(--accent));
  border-color: rgba(224, 182, 76, 0.6);
  color: var(--accent-ink);
  font-weight: 700;
}

.btn-primary:hover {
  background: linear-gradient(180deg, #ffe3a0, var(--accent-hover));
  border-color: var(--accent);
}

.btn-block {
  display: block;
  width: 100%;
  margin: 10px 0;
}

.disabledButton {
  opacity: 0.45;
  filter: grayscale(0.5);
  cursor: not-allowed;
  pointer-events: none;
}

/* ---------- Shared layout helpers ---------- */

.info-grid {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 12px;
}

.info-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.95rem;
}

.info-label {
  color: var(--text-dim);
}

.info-value {
  font-weight: 600;
  letter-spacing: 0.5px;
}

.chips {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  justify-content: center;
}

.chip {
  background: var(--surface-2);
  border: 1px solid var(--border-strong);
  border-radius: 999px;
  padding: 6px 14px;
  font-size: 0.9rem;
  font-weight: 600;
}

.board {
  background: var(--surface-2);
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  padding: 12px;
  line-height: 1.9;
  font-size: 0.95rem;
  text-align: center;
}

.phase-pills {
  text-align: center;
  font-size: 1.1rem;
  font-weight: 700;
  letter-spacing: 3px;
  color: var(--accent);
}

.waiting-note {
  text-align: center;
  font-weight: 700;
  color: var(--evil);
  margin: 14px 0 4px;
}

.notice {
  color: var(--text-dim);
  background: var(--surface-2);
  border: 1px solid var(--border);
  border-left: 3px solid var(--accent);
  border-radius: var(--radius-sm);
  padding: 10px 12px;
  font-size: 0.9rem;
  line-height: 1.6;
}

.notice a {
  color: var(--accent);
}

.tips {
  text-align: left;
  margin: 10px 0;
  padding: 0 4px 0 22px;
  color: var(--text-dim);
  font-size: 0.85rem;
  line-height: 1.7;
}

.tips li {
  margin: 5px 0;
}

.visitor-count {
  text-align: center;
  color: var(--text-faint);
  font-size: 0.8rem;
  margin-top: 32px;
}

hr {
  border: none;
  border-top: 1px solid var(--border);
  margin: 12px 0;
}
</style>


<style>
/* Custom scrollbar */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: var(--bg-0);
}

::-webkit-scrollbar-thumb {
  background-color: rgba(255, 255, 255, 0.18);
  border-radius: 10px;
  border: 2px solid var(--bg-0);
}

::-webkit-scrollbar-thumb:hover {
  background-color: rgba(255, 255, 255, 0.3);
}

/* For Firefox */
body {
  scrollbar-width: thin;
  scrollbar-color: rgba(255, 255, 255, 0.18) var(--bg-0);
}
</style>
