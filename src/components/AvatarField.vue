<script setup>
import { computed, ref } from 'vue'
import { AVATARS, avatarUrl, getMyAvatar, setMyAvatar, randomAvatar } from '@/avatar'

const props = defineProps({
  modelValue: String,
  disabled: Boolean,
  persist: { type: Boolean, default: true }
})
const emit = defineEmits(['update:modelValue'])
const dialog = ref(null)
const selected = computed(() => props.modelValue || getMyAvatar())

function open () {
  if (props.disabled || dialog.value.open) return
  dialog.value.showModal()
  dialog.value.querySelector('.avatar-selected')?.focus()
}
function choose (file) {
  if (props.disabled) return
  if (props.persist) setMyAvatar(file)
  emit('update:modelValue', file)
  dialog.value.close()
}
function dismissBackdrop (event) {
  if (event.target !== dialog.value) return
  const rect = dialog.value.getBoundingClientRect()
  if (event.clientX < rect.left || event.clientX > rect.right ||
      event.clientY < rect.top || event.clientY > rect.bottom) dialog.value.close()
}
</script>

<template>
  <div class="avatar-field">
    <div class="subtitle avatar-title">选择头像</div>
    <div class="avatar-picker-row">
      <button type="button" class="avatar-preview-wrap" :disabled="disabled" aria-label="选择头像" aria-haspopup="dialog" @click="open">
        <img class="avatar-preview" :src="avatarUrl(selected)" alt="当前头像" />
      </button>
      <button type="button" :disabled="disabled" @click="choose(randomAvatar())">随机头像</button>
    </div>
    <dialog ref="dialog" class="avatar-dialog" aria-label="选择头像" @click="dismissBackdrop">
      <div class="avatar-dialog-header">
        <h2>选择头像</h2>
        <button type="button" aria-label="关闭" @click="dialog.close()">×</button>
      </div>
      <div class="avatar-grid">
        <button v-for="file in AVATARS" :key="file" type="button" class="avatar-thumb"
          :disabled="disabled" :class="{ 'avatar-selected': file === selected }"
          :aria-pressed="file === selected" :aria-label="file.replace(/\.svg$/, '').replace(/-/g, ' ')"
          @click="choose(file)">
          <img :src="avatarUrl(file)" alt="" loading="lazy" />
        </button>
      </div>
    </dialog>
  </div>
</template>

<style scoped>
.avatar-title { margin-top: 14px; }
.avatar-picker-row { display: flex; align-items: center; justify-content: center; gap: 12px; margin: 6px 0 10px; }
.avatar-preview-wrap { padding: 0; margin: 0; width: 76px; height: 76px; border-radius: 12px; overflow: hidden; border: 2px solid var(--accent); background: var(--surface-2); flex-shrink: 0; }
.avatar-preview { display: block; width: 100%; height: 100%; object-fit: cover; }
.avatar-dialog { width: 420px; max-width: calc(100vw - 32px); max-height: calc(100dvh - 32px); padding: 16px; border: 1px solid var(--border-strong); border-radius: 16px; background: var(--bg-1); color: var(--text); box-shadow: var(--shadow); }
.avatar-dialog::backdrop { background: rgba(0, 0, 0, 0.65); }
.avatar-dialog-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px; }
.avatar-dialog-header h2 { margin: 0; font-size: 1.1rem; }
.avatar-dialog-header button { margin: 0; padding: 4px 12px; font-size: 1.4rem; }
.avatar-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(58px, 1fr)); gap: 6px; max-height: min(520px, calc(100dvh - 160px)); overflow-y: auto; padding: 4px; }
.avatar-thumb { padding: 0; margin: 0; width: 100%; aspect-ratio: 1; border: 2px solid transparent; border-radius: 8px; overflow: hidden; }
.avatar-thumb img { display: block; width: 100%; height: 100%; object-fit: cover; }
.avatar-selected { border-color: var(--accent); box-shadow: 0 0 0 2px rgba(224, 182, 76, 0.35); }
</style>
