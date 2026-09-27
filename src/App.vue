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
      <router-link class="nav-link" to="/room">创建或加入房间</router-link>
    </nav>

    <router-view :key="$route.fullPath" />
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
  --bg-0: #0a0e14;
  --bg-1: #10151d;
  --surface: rgba(19, 24, 25, 0.86);
  --surface-2: rgba(255, 255, 255, 0.045);
  --border: rgba(255, 255, 255, 0.09);
  --border-strong: rgba(255, 255, 255, 0.18);
  --text: #e9edf4;
  --text-dim: #a9b4c2;
  --text-faint: #6f7d8d;
  --accent: #e5bd54;
  --accent-hover: #f5d67c;
  --accent-ink: #1d1504;
  --good: #45b7f5;
  --evil: #ff8b45;
  --radius: 16px;
  --radius-sm: 10px;
  --shadow-sm: 0 2px 8px rgba(0, 0, 0, 0.28);
  --shadow: 0 12px 32px rgba(0, 0, 0, 0.4);
  --shadow-gold: 0 6px 18px rgba(229, 189, 84, 0.24);
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

/* Kill the default blue/translucent tap flash WebKit paints on touch */
* {
  -webkit-tap-highlight-color: transparent;
}

html,
body {
  -webkit-touch-callout: none;
}

body {
  margin: 0;
  padding: 0;
  min-height: 100vh;
  background: var(--bg-0);
  isolation: isolate;
}

/* Keep the square scene steady when mobile browser controls appear or hide. */
body::before {
  content: "";
  position: fixed;
  inset: 0;
  height: 100vh;
  height: 100lvh;
  z-index: -1;
  pointer-events: none;
  background: linear-gradient(rgba(8, 12, 14, 0.25), rgba(8, 12, 14, 0.38)),
    var(--avalon-background) center / cover no-repeat;
}

#app {
  max-width: 460px;
  margin: 0 auto;
  padding: 22px 14px 56px;
}

@media (max-width: 390px) {
  #app {
    padding-left: 10px;
    padding-right: 10px;
  }

  .container {
    padding: 14px 12px;
  }
}

/* ---------- Masthead + nav ---------- */

.masthead {
  text-align: center;
  margin-bottom: 18px;
}

.title {
  font-size: 2.2rem;
  font-weight: 800;
  letter-spacing: 2px;
  line-height: 1.1;
  background: linear-gradient(180deg, #f8e7b0, var(--accent) 72%, #b98a2a);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  color: var(--accent);
}

.tagline {
  margin: 8px 0 0;
  color: var(--text-faint);
  font-size: 0.8rem;
  letter-spacing: 3px;
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
  box-shadow: var(--shadow-sm);
}

.nav-link {
  text-decoration: none;
  color: var(--text-dim);
  font-weight: 600;
  font-size: 0.9rem;
  padding: 9px 18px;
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
  position: relative;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 18px;
  margin: 14px auto;
  box-shadow: var(--shadow);
  backdrop-filter: blur(14px);
}

.container::before {
  content: "";
  position: absolute;
  top: 0;
  left: 14px;
  right: 14px;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.16), transparent);
  pointer-events: none;
}

.subtitle {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  margin: 16px 0 10px;
  font-size: 0.78rem;
  font-weight: 700;
  letter-spacing: 2px;
  text-transform: uppercase;
  color: var(--accent);
  text-align: center;
}

.subtitle::before,
.subtitle::after {
  content: "";
  flex: 0 0 26px;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(229, 189, 84, 0.55));
}

.subtitle::after {
  background: linear-gradient(90deg, rgba(229, 189, 84, 0.55), transparent);
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

input:not([type="checkbox"]):not([type="radio"]) {
  -webkit-appearance: none;
  appearance: none;
  background: rgba(10, 14, 20, 0.55);
  font-size: 1rem;
  outline: none;
  padding: 12px 14px;
  border: 1px solid var(--border-strong);
  border-radius: var(--radius-sm);
  margin: 0;
  width: 100%;
  min-width: 0;
  color: var(--text);
  box-shadow: inset 0 1px 4px rgba(0, 0, 0, 0.4);
  transition: border-color 0.2s, background 0.2s, box-shadow 0.2s;
}

input:not([type="checkbox"]):not([type="radio"]):focus {
  background: rgba(10, 14, 20, 0.75);
  border-color: var(--accent);
  box-shadow: 0 0 0 3px rgba(229, 189, 84, 0.2), inset 0 1px 4px rgba(0, 0, 0, 0.4);
}

input:not([type="checkbox"]):not([type="radio"])::placeholder {
  color: var(--text-faint);
}

.field-row {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: nowrap;
  width: 100%;
  gap: 8px;
  margin: 8px 0;
}

.field-row input {
  flex: 1 1 0%;
  min-width: 0;
  max-width: none;
}

.field-row button {
  flex-shrink: 0;
}

.status {
  min-height: 1.3em;
  margin-top: 10px;
  color: var(--text-dim);
  font-size: 0.9rem;
  text-align: center;
}

button {
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05));
  border: 1px solid var(--border-strong);
  border-radius: var(--radius-sm);
  padding: 11px 20px;
  margin: 8px 4px;
  color: var(--text);
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  box-shadow: var(--shadow-sm);
  transition: transform 0.06s ease, background 0.2s, border-color 0.2s, box-shadow 0.2s;
}

button:hover {
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.17), rgba(255, 255, 255, 0.09));
  border-color: rgba(255, 255, 255, 0.28);
}

button:active {
  transform: translateY(1px) scale(0.99);
}

button:focus-visible {
  outline: 2px solid var(--accent);
  outline-offset: 2px;
}

button:disabled {
  opacity: 0.4;
  filter: grayscale(0.5);
  cursor: not-allowed;
  pointer-events: none;
}

.btn-primary {
  background: linear-gradient(180deg, var(--accent-hover), var(--accent) 55%, #d0a53f);
  border-color: rgba(229, 189, 84, 0.55);
  color: var(--accent-ink);
  font-weight: 700;
  box-shadow: var(--shadow-gold);
}

.btn-primary:hover {
  background: linear-gradient(180deg, #ffeaad, var(--accent-hover) 55%, #e0b64c);
  border-color: rgba(229, 189, 84, 0.85);
  transform: translateY(-1px);
}

.btn-block {
  display: block;
  width: 100%;
  margin: 10px 0;
}

.disabledButton {
  opacity: 0.4;
  filter: grayscale(0.5);
  cursor: not-allowed;
  pointer-events: none;
}

/* ---------- Shared layout helpers ---------- */

.info-grid {
  display: flex;
  flex-direction: column;
  gap: 9px;
  margin-bottom: 12px;
}

.info-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.95rem;
  padding-bottom: 9px;
  border-bottom: 1px dashed rgba(255, 255, 255, 0.06);
}

.info-row:last-child {
  border-bottom: none;
  padding-bottom: 0;
}

.info-label {
  color: var(--text-dim);
  font-size: 0.85rem;
}

.info-value {
  font-weight: 700;
  letter-spacing: 0.5px;
  color: var(--accent);
}

.player-list {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  justify-content: center;
}

.player-chip {
  display: inline-flex;
  align-items: center;
  background: var(--surface-2);
  border: 1px solid var(--border);
  border-radius: 999px;
  padding: 7px 16px;
  font-weight: 600;
  font-size: 0.92rem;
}

.board {
  background: rgba(229, 189, 84, 0.05);
  border: 1px dashed rgba(229, 189, 84, 0.3);
  border-radius: var(--radius-sm);
  padding: 12px 14px;
  line-height: 1.9;
  font-size: 0.95rem;
  text-align: center;
}

.phase-text {
  text-align: center;
  font-size: 1.05rem;
  font-weight: 700;
  letter-spacing: 2px;
  color: var(--text);
}

.waiting-note {
  text-align: center;
  font-weight: 600;
  font-size: 0.92rem;
  color: var(--evil);
  background: rgba(255, 139, 69, 0.08);
  border: 1px solid rgba(255, 139, 69, 0.28);
  border-radius: var(--radius-sm);
  padding: 10px 12px;
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
