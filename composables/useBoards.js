export const useBoards = () => {
  const boards = useState('boards', () => [])
  const loading = useState('boards-loading', () => false)
  const error = useState('boards-error', () => null)

  // Fetch all boards
  const fetchBoards = async () => {
    loading.value = true
    error.value = null
    try {
      const data = await $fetch('/api/boards')
      boards.value = data
      return data
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  // Fetch a single board
  const fetchBoard = async (id) => {
    loading.value = true
    error.value = null
    try {
      const data = await $fetch(`/api/boards/${id}`)
      return data
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  // Create a new board
  const createBoard = async (boardData) => {
    loading.value = true
    error.value = null
    try {
      const newBoard = await $fetch('/api/boards', {
        method: 'POST',
        body: boardData
      })
      boards.value.push(newBoard)
      return newBoard
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  // Update a board
  const updateBoard = async (id, boardData) => {
    loading.value = true
    error.value = null
    try {
      const updatedBoard = await $fetch(`/api/boards/${id}`, {
        method: 'PUT',
        body: boardData
      })
      const index = boards.value.findIndex(b => b.id === id)
      if (index !== -1) {
        boards.value[index] = updatedBoard
      }
      return updatedBoard
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  // Delete a board
  const deleteBoard = async (id) => {
    loading.value = true
    error.value = null
    try {
      await $fetch(`/api/boards/${id}`, {
        method: 'DELETE'
      })
      boards.value = boards.value.filter(b => b.id !== id)
      return true
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  return {
    boards,
    loading,
    error,
    fetchBoards,
    fetchBoard,
    createBoard,
    updateBoard,
    deleteBoard
  }
}
