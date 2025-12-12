<template>
  <div class="container">
    <div class="card">
      <div class="flex justify-between align-center">
        <h2>Your Boards</h2>
        <button class="btn btn-primary" @click="showNewBoardModal = true">
          + New Board
        </button>
      </div>
    </div>

    <!-- Boards List -->
    <div v-if="boards.length === 0" class="card text-center">
      <p>No boards yet. Create your first board to get started!</p>
    </div>

    <div v-else class="board">
      <div v-for="board in boards" :key="board.id" class="card">
        <h3>{{ board.name }}</h3>
        <p>{{ board.description }}</p>
        <div class="mt-1">
          <button class="btn btn-primary" @click="selectBoard(board)">
            Open Board
          </button>
          <button class="btn btn-danger" @click="deleteBoard(board.id)" style="margin-left: 0.5rem;">
            Delete
          </button>
        </div>
      </div>
    </div>

    <!-- New Board Modal -->
    <div v-if="showNewBoardModal" class="modal" @click.self="showNewBoardModal = false">
      <div class="modal-content">
        <h3>Create New Board</h3>
        <div class="form-group">
          <label>Board Name</label>
          <input v-model="newBoard.name" type="text" placeholder="Enter board name">
        </div>
        <div class="form-group">
          <label>Description</label>
          <textarea v-model="newBoard.description" placeholder="Enter description"></textarea>
        </div>
        <div class="flex gap-1">
          <button class="btn btn-success" @click="createBoard">Create</button>
          <button class="btn" @click="showNewBoardModal = false">Cancel</button>
        </div>
      </div>
    </div>

    <!-- Board View -->
    <div v-if="selectedBoard" class="modal" @click.self="selectedBoard = null">
      <div class="modal-content modal-large">
        <div class="flex justify-between align-center mb-2">
          <h2>{{ selectedBoard.name }}</h2>
          <button class="btn" @click="selectedBoard = null">Close</button>
        </div>

        <button class="btn btn-success mb-2" @click="showNewTaskModal = true">
          + New Task
        </button>

        <div class="board">
          <div v-for="status in statuses" :key="status.id" class="column">
            <h3>{{ status.name }}</h3>
            <div
              v-for="task in getTasksByStatus(status.id)"
              :key="task.id"
              class="task"
            >
              <h4>{{ task.title }}</h4>
              <p>{{ task.description }}</p>
              <div class="task-meta">
                <span>Priority: {{ task.priority }}</span>
              </div>
              <div class="mt-1">
                <select @change="updateTaskStatus(task.id, $event.target.value)" :value="task.status">
                  <option v-for="s in statuses" :key="s.id" :value="s.id">
                    {{ s.name }}
                  </option>
                </select>
                <button class="btn btn-danger" @click="deleteTask(task.id)" style="margin-left: 0.5rem; font-size: 0.8rem; padding: 0.25rem 0.5rem;">
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- New Task Modal -->
    <div v-if="showNewTaskModal" class="modal" @click.self="showNewTaskModal = false">
      <div class="modal-content">
        <h3>Create New Task</h3>
        <div class="form-group">
          <label>Task Title</label>
          <input v-model="newTask.title" type="text" placeholder="Enter task title">
        </div>
        <div class="form-group">
          <label>Description</label>
          <textarea v-model="newTask.description" placeholder="Enter description"></textarea>
        </div>
        <div class="form-group">
          <label>Priority</label>
          <select v-model="newTask.priority">
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>
        <div class="form-group">
          <label>Status</label>
          <select v-model="newTask.status">
            <option v-for="status in statuses" :key="status.id" :value="status.id">
              {{ status.name }}
            </option>
          </select>
        </div>
        <div class="flex gap-1">
          <button class="btn btn-success" @click="createTask">Create</button>
          <button class="btn" @click="showNewTaskModal = false">Cancel</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const boards = ref([]);
const selectedBoard = ref(null);
const showNewBoardModal = ref(false);
const showNewTaskModal = ref(false);

const newBoard = ref({
  name: '',
  description: ''
});

const newTask = ref({
  title: '',
  description: '',
  priority: 'medium',
  status: 'todo'
});

const statuses = [
  { id: 'todo', name: 'To Do' },
  { id: 'in-progress', name: 'In Progress' },
  { id: 'done', name: 'Done' }
];

// Load boards from localStorage
onMounted(() => {
  const savedBoards = localStorage.getItem('boards');
  if (savedBoards) {
    boards.value = JSON.parse(savedBoards);
  }
});

// Save boards to localStorage
const saveBoards = () => {
  localStorage.setItem('boards', JSON.stringify(boards.value));
};

const createBoard = () => {
  if (!newBoard.value.name) {
    alert('Please enter a board name');
    return;
  }

  const board = {
    id: Date.now(),
    name: newBoard.value.name,
    description: newBoard.value.description,
    tasks: []
  };

  boards.value.push(board);
  saveBoards();

  newBoard.value = { name: '', description: '' };
  showNewBoardModal.value = false;
};

const deleteBoard = (id) => {
  if (confirm('Are you sure you want to delete this board?')) {
    boards.value = boards.value.filter(b => b.id !== id);
    saveBoards();
  }
};

const selectBoard = (board) => {
  selectedBoard.value = board;
};

const getTasksByStatus = (status) => {
  if (!selectedBoard.value || !selectedBoard.value.tasks) {
    return [];
  }
  return selectedBoard.value.tasks.filter(t => t.status === status);
};

const createTask = () => {
  if (!newTask.value.title) {
    alert('Please enter a task title');
    return;
  }

  const task = {
    id: Date.now(),
    title: newTask.value.title,
    description: newTask.value.description,
    priority: newTask.value.priority,
    status: newTask.value.status
  };

  if (!selectedBoard.value.tasks) {
    selectedBoard.value.tasks = [];
  }

  selectedBoard.value.tasks.push(task);
  saveBoards();

  newTask.value = {
    title: '',
    description: '',
    priority: 'medium',
    status: 'todo'
  };
  showNewTaskModal.value = false;
};

const updateTaskStatus = (taskId, newStatus) => {
  const task = selectedBoard.value.tasks.find(t => t.id === taskId);
  if (task) {
    task.status = newStatus;
    saveBoards();
  }
};

const deleteTask = (taskId) => {
  if (confirm('Are you sure you want to delete this task?')) {
    selectedBoard.value.tasks = selectedBoard.value.tasks.filter(t => t.id !== taskId);
    saveBoards();
  }
};
</script>

<style scoped>
.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  max-width: 500px;
  width: 90%;
  max-height: 90vh;
  overflow-y: auto;
}

.modal-large {
  max-width: 1200px;
}

select {
  padding: 0.25rem 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 0.9rem;
}
</style>
