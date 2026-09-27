<script setup>
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import { ROLE_DISPLAY } from '@/gameConfig'
import { localDateKey, roleVariant } from '@/roleVariant'
import { cachedImage, cacheImage, forgetImage } from '@/imageCache'

const props = defineProps({ role: String, eager: Boolean, roomid: String, userid: String })
const date = ref(localDateKey())
let dateTimer
onMounted(() => {
  if (!props.roomid || !props.userid) dateTimer = setInterval(() => { date.value = localDateKey() }, 60000)
})
onUnmounted(() => clearInterval(dateTimer))
const images = require.context('@/assets/roles/', false, /\.webp$/)
const failed = ref(false)
const label = computed(() => ROLE_DISPLAY[props.role]?.name || '未知身份')
const filename = computed(() => {
  const version = roleVariant(props.role, { roomid: props.roomid, userid: props.userid, date: date.value })
  return `${props.role}-${version}.webp`
})
const bundledSrc = computed(() => {
  const file = `./${filename.value}`
  return images.keys().includes(file) ? images(file) : ''
})
const src = ref('')
watch(bundledSrc, url => {
  failed.value = false
  src.value = url ? cachedImage(filename.value, url) || url : ''
}, { immediate: true, flush: 'sync' })
function remember () {
  if (src.value === bundledSrc.value) cacheImage(filename.value, bundledSrc.value)
}
function recover () {
  if (src.value !== bundledSrc.value) {
    forgetImage(filename.value)
    src.value = bundledSrc.value
  } else {
    failed.value = true
  }
}
</script>

<template>
  <img v-if="src && !failed" class="role-art" :src="src" :alt="label"
    width="768" height="512" :loading="eager ? 'eager' : 'lazy'"
    decoding="async" @load="remember" @error="recover" />
  <div v-else class="role-art-fallback">{{ label }}</div>
</template>

<style scoped>
.role-art { display: block; width: 100%; height: auto; aspect-ratio: 3 / 2; object-fit: contain; border-radius: 8px; }
.role-art-fallback { padding: 24px; text-align: center; font-size: 1.3rem; color: var(--accent); }
</style>
