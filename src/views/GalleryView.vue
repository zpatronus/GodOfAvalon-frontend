<script setup>
import { ref } from 'vue'
import RoleCard from '@/components/RoleCard.vue'
import { ROLE_DISPLAY } from '@/gameConfig'
import { cachedImage, cacheImage, forgetImage } from '@/imageCache'
import backgroundUrl from '@/assets/avalon-island.webp'

const roles = ['merlin', 'percival', 'loyal_servant', 'morgana', 'mordred', 'oberon', 'assassin', 'minion']
const backgroundFile = 'avalon-island.webp'
const backgroundSrc = ref(cachedImage(backgroundFile, backgroundUrl) || backgroundUrl)
const backgroundFailed = ref(false)
function rememberBackground () {
  if (backgroundSrc.value === backgroundUrl) cacheImage(backgroundFile, backgroundUrl)
}
function recoverBackground () {
  if (backgroundSrc.value !== backgroundUrl) {
    forgetImage(backgroundFile)
    backgroundSrc.value = backgroundUrl
  } else {
    backgroundFailed.value = true
  }
}
</script>

<template>
  <main class="gallery">
    <section v-for="role in roles" :key="role" class="container gallery-section">
      <h2>{{ ROLE_DISPLAY[role].name }}</h2>
      <figure v-for="version in 3" :key="version">
        <RoleCard :role="role" :variant="version" />
      </figure>
    </section>
    <section class="container gallery-section">
      <h2>阿瓦隆之岛</h2>
      <figure>
        <img v-if="!backgroundFailed" class="gallery-background" :src="backgroundSrc" alt="阿瓦隆之岛"
          width="1280" height="1280" loading="lazy" decoding="async"
          @load="rememberBackground" @error="recoverBackground" />
        <p v-else>背景图片暂时无法加载。</p>
        <figcaption>背景</figcaption>
      </figure>
    </section>
  </main>
</template>

<style scoped>
.gallery { display: flex; flex-direction: column; }
h2 { font-size: 1.1rem; margin: 0 0 16px; }
p, figcaption { color: var(--text-dim); font-size: 0.85rem; line-height: 1.6; }
figure { margin: 0 0 24px; }
figure:last-child { margin-bottom: 0; }
figcaption { margin-top: 8px; text-align: center; }
.gallery-background { display: block; width: 100%; height: auto; aspect-ratio: 1; object-fit: contain; border-radius: 8px; }
</style>
