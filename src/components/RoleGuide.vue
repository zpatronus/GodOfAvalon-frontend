<script setup>
import { reactive } from 'vue'
import RoleCard from './RoleCard.vue'
import { ROLE_DISPLAY } from '@/gameConfig'
const open = reactive({})
const descriptions = {
  merlin: '忠于亚瑟。知道除莫德雷德外的邪恶角色，但必须隐藏自己的身份。',
  percival: '忠于亚瑟。看到梅林和莫甘娜，却不知道谁是真正的梅林。',
  loyal_servant: '忠于亚瑟。没有额外身份信息，需要通过讨论和任务结果寻找同伴。',
  morgana: '效忠邪恶。与邪恶同伴相认，并在派西维尔眼中伪装成梅林。',
  assassin: '效忠邪恶。与邪恶同伴相认，在好人完成任务后寻找并刺杀梅林。',
  mordred: '效忠邪恶。与邪恶同伴相认，身份对梅林隐藏。',
  oberon: '效忠邪恶。与其他邪恶角色互不相认。',
  minion: '效忠邪恶。与其他邪恶同伴相认，奥伯伦除外。'
}
</script>

<template>
  <section class="container role-guide">
    <h2>角色图鉴</h2>
    <details v-for="(description, role) in descriptions" :key="role" @toggle="open[role] = $event.target.open">
      <summary>{{ ROLE_DISPLAY[role].name }}</summary>
      <template v-if="open[role]">
        <RoleCard :role="role" />
        <p>{{ description }}</p>
      </template>
    </details>
  </section>
</template>

<style scoped>
h2 { margin: 0 0 16px; font-size: 1.2rem; }
details { border-top: 1px solid var(--border); }
summary { padding: 14px 0; cursor: pointer; font-size: 0.9rem; }
p { font-size: 0.85rem; color: var(--text-dim); line-height: 1.7; margin: 12px 0 18px; }
</style>
