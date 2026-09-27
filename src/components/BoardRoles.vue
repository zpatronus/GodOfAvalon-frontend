<script setup>
import { computed } from 'vue'
import { boardRoles, boardTemplate, ROLE_DISPLAY } from '@/gameConfig'
import RoleCard from './RoleCard.vue'

const props = defineProps({ count: Number, roomId: String, userId: String })
const roles = computed(() => boardRoles(props.count))
</script>

<template>
  <div v-if="roles.length" class="board-roles">
    <div class="board-chips">
      <div v-for="entry in roles" :key="entry.role" class="board-chip">
        <RoleCard :role="entry.role" :roomid="roomId" :userid="userId" />
        <span>{{ ROLE_DISPLAY[entry.role].name }} ×{{ entry.count }}</span>
      </div>
    </div>
    <p v-if="count >= 8" class="board-note">建议使用湖中仙女</p>
  </div>
  <p v-else class="board-note">{{ boardTemplate(count) }}</p>
</template>

<style scoped>
.board-chips { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 12px; padding-top: 12px; }
.board-chip { min-width: 0; text-align: center; padding: 6px; border: 1px solid var(--border); border-radius: 8px; background: var(--surface-2); font-size: 0.72rem; }
.board-chip > span { display: block; margin-top: 6px; overflow-wrap: anywhere; }
.board-note { color: var(--text-dim); font-size: 0.8rem; line-height: 1.6; }
</style>
