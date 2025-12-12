<template>
  <div class="container">
    <div class="card">
      <h2>Welcome to AgileMunk 🐵</h2>
      <p>A simple agile tool for managing your personal projects.</p>

      <div class="mt-2">
        <h3>Features</h3>
        <ul>
          <li>Create and manage project boards</li>
          <li>Track tasks with different statuses</li>
          <li>Simple and intuitive interface</li>
          <li>Perfect for personal project management</li>
        </ul>
      </div>

      <div class="mt-2">
        <NuxtLink to="/boards">
          <button class="btn btn-primary">View Boards →</button>
        </NuxtLink>
      </div>
    </div>

    <div class="card">
      <h3>Quick Stats</h3>
      <div class="board">
        <div>
          <h4>{{ stats.totalBoards }}</h4>
          <p>Total Boards</p>
        </div>
        <div>
          <h4>{{ stats.totalTasks }}</h4>
          <p>Total Tasks</p>
        </div>
        <div>
          <h4>{{ stats.completedTasks }}</h4>
          <p>Completed Tasks</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const { fetchBoards } = useBoards()

const stats = ref({
  totalBoards: 0,
  totalTasks: 0,
  completedTasks: 0
});

// Fetch stats from the server API
onMounted(async () => {
  try {
    const boards = await fetchBoards();
    stats.value.totalBoards = boards.length;

    let totalTasks = 0;
    let completedTasks = 0;

    boards.forEach(board => {
      if (board.tasks) {
        totalTasks += board.tasks.length;
        completedTasks += board.tasks.filter(t => t.status === 'done').length;
      }
    });

    stats.value.totalTasks = totalTasks;
    stats.value.completedTasks = completedTasks;
  } catch (error) {
    console.error('Failed to load stats:', error);
  }
});
</script>

<style scoped>
ul {
  margin-left: 2rem;
  margin-top: 1rem;
}

li {
  margin-bottom: 0.5rem;
}

h4 {
  font-size: 2rem;
  color: #3498db;
  margin-bottom: 0.5rem;
}
</style>
