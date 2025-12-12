<template>
  <div class="task-card" :class="`priority-${task.priority}`">
    <h4>{{ task.title }}</h4>
    <p>{{ task.description }}</p>
    <div class="task-meta">
      <span class="priority-badge" :class="`badge-${task.priority}`">
        {{ task.priority }}
      </span>
    </div>
    <div class="mt-1">
      <slot name="actions"></slot>
    </div>
  </div>
</template>

<script setup>
defineProps({
  task: {
    type: Object,
    required: true
  }
});
</script>

<style scoped>
.task-card {
  background: white;
  padding: 1rem;
  margin-bottom: 0.5rem;
  border-radius: 4px;
  border-left: 4px solid #3498db;
}

.task-card.priority-high {
  border-left-color: #e74c3c;
}

.task-card.priority-medium {
  border-left-color: #f39c12;
}

.task-card.priority-low {
  border-left-color: #95a5a6;
}

.task-card h4 {
  margin-bottom: 0.5rem;
  color: #2c3e50;
}

.task-card p {
  font-size: 0.9rem;
  color: #666;
  margin-bottom: 0.5rem;
}

.task-meta {
  display: flex;
  gap: 0.5rem;
  font-size: 0.8rem;
}

.priority-badge {
  padding: 0.25rem 0.5rem;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
}

.badge-high {
  background: #fee;
  color: #e74c3c;
}

.badge-medium {
  background: #fef5e7;
  color: #f39c12;
}

.badge-low {
  background: #ecf0f1;
  color: #95a5a6;
}
</style>
