<template>
  <div class="board-card card">
    <h3>{{ board.name }}</h3>
    <p>{{ board.description }}</p>
    <div class="board-stats">
      <span>{{ taskCount }} tasks</span>
    </div>
    <div class="mt-1">
      <slot name="actions"></slot>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  board: {
    type: Object,
    required: true
  }
});

const taskCount = computed(() => {
  return props.board.tasks ? props.board.tasks.length : 0;
});
</script>

<style scoped>
.board-card {
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
}

.board-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0,0,0,0.15);
}

.board-stats {
  font-size: 0.9rem;
  color: #666;
  margin-top: 0.5rem;
}
</style>
