export const useTasks = (boardId) => {
  const loading = useState(`tasks-${boardId}-loading`, () => false)
  const error = useState(`tasks-${boardId}-error`, () => null)

  // Create a new task
  const createTask = async (taskData) => {
    loading.value = true
    error.value = null
    try {
      const newTask = await $fetch(`/api/boards/${boardId}/tasks`, {
        method: 'POST',
        body: taskData
      })
      return newTask
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  // Update a task
  const updateTask = async (taskId, taskData) => {
    loading.value = true
    error.value = null
    try {
      const updatedTask = await $fetch(`/api/boards/${boardId}/tasks/${taskId}`, {
        method: 'PUT',
        body: taskData
      })
      return updatedTask
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  // Delete a task
  const deleteTask = async (taskId) => {
    loading.value = true
    error.value = null
    try {
      await $fetch(`/api/boards/${boardId}/tasks/${taskId}`, {
        method: 'DELETE'
      })
      return true
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  return {
    loading,
    error,
    createTask,
    updateTask,
    deleteTask
  }
}
