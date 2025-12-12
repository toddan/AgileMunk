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

    <!-- Loading State -->
    <div v-if="loading" class="card text-center">
      <p>Loading boards...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="card text-center">
      <p style="color: #e74c3c;">Error: {{ error }}</p>
      <button class="btn btn-primary mt-1" @click="loadBoards">Retry</button>
    </div>

    <!-- Boards List -->
    <div v-else-if="boards.length === 0" class="card text-center">
      <p>No boards yet. Create your first board to get started!</p>
    </div>

    <div v-else class="board">
      <div v-for="board in boards" :key="board.id" class="card">
        <h3>{{ board.name }}</h3>
        <p>{{ board.description }}</p>
        <div class="task-count">{{ board.tasks?.length || 0 }} tasks</div>
        <div class="mt-1">
          <button class="btn btn-primary" @click="selectBoard(board)">
            Open Board
          </button>
          <button class="btn btn-danger" @click="handleDeleteBoard(board.id)" style="margin-left: 0.5rem;">
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
          <button class="btn btn-success" @click="handleCreateBoard" :disabled="loading">
            {{ loading ? 'Creating...' : 'Create' }}
          </button>
          <button class="btn" @click="showNewBoardModal = false">Cancel</button>
        </div>
      </div>
    </div>

    <!-- Board View -->
    <div v-if="selectedBoard" class="modal" @click.self="selectedBoard = null">
      <div class="modal-content modal-large">
        <div class="flex justify-between align-center mb-2">
          <h2>{{ selectedBoard.name }}</h2>
          <button class="btn" @click="closeBoard">Close</button>
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
                <span :class="`priority-badge badge-${task.priority}`">
                  {{ task.priority }}
                </span>
              </div>
              <div class="mt-1">
                <select @change="handleUpdateTaskStatus(task.id, $event.target.value)" :value="task.status">
                  <option v-for="s in statuses" :key="s.id" :value="s.id">
                    {{ s.name }}
                  </option>
                </select>
                <button class="btn btn-danger" @click="handleDeleteTask(task.id)" style="margin-left: 0.5rem; font-size: 0.8rem; padding: 0.25rem 0.5rem;">
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
          <button class="btn btn-success" @click="handleCreateTask" :disabled="taskLoading">
            {{ taskLoading ? 'Creating...' : 'Create' }}
          </button>
          <button class="btn" @click="showNewTaskModal = false">Cancel</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const { boards, loading, error, fetchBoards, createBoard, deleteBoard } = useBoards()

const selectedBoard = ref(null)
const taskLoading = ref(false)
const showNewBoardModal = ref(false)
const showNewTaskModal = ref(false)

const newBoard = ref({
  name: '',
  description: ''
})

const newTask = ref({
  title: '',
  description: '',
  priority: 'medium',
  status: 'todo'
})

const statuses = [
  { id: 'todo', name: 'To Do' },
  { id: 'in-progress', name: 'In Progress' },
  { id: 'done', name: 'Done' }
]

// Load boards on mount
onMounted(async () => {
  await loadBoards()
})

const loadBoards = async () => {
  try {
    await fetchBoards()
  } catch (err) {
    console.error('Failed to load boards:', err)
  }
}

const handleCreateBoard = async () => {
  if (!newBoard.value.name) {
    alert('Please enter a board name')
    return
  }

  try {
    await createBoard(newBoard.value)
    newBoard.value = { name: '', description: '' }
    showNewBoardModal.value = false
  } catch (err) {
    alert('Failed to create board: ' + err.message)
  }
}

const handleDeleteBoard = async (id) => {
  if (confirm('Are you sure you want to delete this board?')) {
    try {
      await deleteBoard(id)
    } catch (err) {
      alert('Failed to delete board: ' + err.message)
    }
  }
}

const selectBoard = async (board) => {
  selectedBoard.value = board
}

const closeBoard = async () => {
  // Refresh the board data to get latest tasks
  if (selectedBoard.value) {
    try {
      const { fetchBoard } = useBoards()
      const updatedBoard = await fetchBoard(selectedBoard.value.id)
      selectedBoard.value = updatedBoard
      // Update the board in the list
      const index = boards.value.findIndex(b => b.id === updatedBoard.id)
      if (index !== -1) {
        boards.value[index] = updatedBoard
      }
    } catch (err) {
      console.error('Failed to refresh board:', err)
    }
  }
  selectedBoard.value = null
}

const getTasksByStatus = (status) => {
  if (!selectedBoard.value || !selectedBoard.value.tasks) {
    return []
  }
  return selectedBoard.value.tasks.filter(t => t.status === status)
}

const handleCreateTask = async () => {
  if (!newTask.value.title) {
    alert('Please enter a task title')
    return
  }

  taskLoading.value = true
  try {
    const { createTask } = useTasks(selectedBoard.value.id)
    const createdTask = await createTask(newTask.value)

    // Update the local board with the new task
    if (!selectedBoard.value.tasks) {
      selectedBoard.value.tasks = []
    }
    selectedBoard.value.tasks.push(createdTask)

    newTask.value = {
      title: '',
      description: '',
      priority: 'medium',
      status: 'todo'
    }
    showNewTaskModal.value = false
  } catch (err) {
    alert('Failed to create task: ' + err.message)
  } finally {
    taskLoading.value = false
  }
}

const handleUpdateTaskStatus = async (taskId, newStatus) => {
  taskLoading.value = true
  try {
    const { updateTask } = useTasks(selectedBoard.value.id)
    const updatedTask = await updateTask(taskId, { status: newStatus })

    // Update the local task
    const taskIndex = selectedBoard.value.tasks.findIndex(t => t.id === taskId)
    if (taskIndex !== -1) {
      selectedBoard.value.tasks[taskIndex] = updatedTask
    }
  } catch (err) {
    alert('Failed to update task: ' + err.message)
  } finally {
    taskLoading.value = false
  }
}

const handleDeleteTask = async (taskId) => {
  if (confirm('Are you sure you want to delete this task?')) {
    taskLoading.value = true
    try {
      const { deleteTask } = useTasks(selectedBoard.value.id)
      await deleteTask(taskId)

      // Remove from local board
      selectedBoard.value.tasks = selectedBoard.value.tasks.filter(t => t.id !== taskId)
    } catch (err) {
      alert('Failed to delete task: ' + err.message)
    } finally {
      taskLoading.value = false
    }
  }
}
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

.task-count {
  font-size: 0.9rem;
  color: #666;
  margin-top: 0.5rem;
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
