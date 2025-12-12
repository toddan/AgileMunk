import fs from 'fs/promises'
import path from 'path'

const DATA_DIR = path.join(process.cwd(), 'data')
const BOARDS_FILE = path.join(DATA_DIR, 'boards.json')

// Ensure data directory exists
async function ensureDataDir() {
  try {
    await fs.access(DATA_DIR)
  } catch {
    await fs.mkdir(DATA_DIR, { recursive: true })
  }
}

// Initialize boards file if it doesn't exist
async function ensureBoardsFile() {
  await ensureDataDir()
  try {
    await fs.access(BOARDS_FILE)
  } catch {
    await fs.writeFile(BOARDS_FILE, JSON.stringify([]))
  }
}

// Read all boards
export async function getBoards() {
  await ensureBoardsFile()
  const data = await fs.readFile(BOARDS_FILE, 'utf-8')
  return JSON.parse(data)
}

// Get a single board by ID
export async function getBoard(id) {
  const boards = await getBoards()
  return boards.find(b => b.id === id)
}

// Save boards
export async function saveBoards(boards) {
  await ensureBoardsFile()
  await fs.writeFile(BOARDS_FILE, JSON.stringify(boards, null, 2))
}

// Create a new board
export async function createBoard(boardData) {
  const boards = await getBoards()
  const newBoard = {
    id: Date.now(),
    name: boardData.name,
    description: boardData.description || '',
    tasks: [],
    createdAt: new Date().toISOString()
  }
  boards.push(newBoard)
  await saveBoards(boards)
  return newBoard
}

// Update a board
export async function updateBoard(id, boardData) {
  const boards = await getBoards()
  const index = boards.findIndex(b => b.id === id)
  if (index === -1) {
    throw new Error('Board not found')
  }
  boards[index] = {
    ...boards[index],
    ...boardData,
    id, // Ensure ID doesn't change
    updatedAt: new Date().toISOString()
  }
  await saveBoards(boards)
  return boards[index]
}

// Delete a board
export async function deleteBoard(id) {
  const boards = await getBoards()
  const filteredBoards = boards.filter(b => b.id !== id)
  if (filteredBoards.length === boards.length) {
    throw new Error('Board not found')
  }
  await saveBoards(filteredBoards)
  return { success: true }
}

// Add a task to a board
export async function addTask(boardId, taskData) {
  const boards = await getBoards()
  const board = boards.find(b => b.id === boardId)
  if (!board) {
    throw new Error('Board not found')
  }

  const newTask = {
    id: Date.now(),
    title: taskData.title,
    description: taskData.description || '',
    priority: taskData.priority || 'medium',
    status: taskData.status || 'todo',
    createdAt: new Date().toISOString()
  }

  if (!board.tasks) {
    board.tasks = []
  }
  board.tasks.push(newTask)
  await saveBoards(boards)
  return newTask
}

// Update a task
export async function updateTask(boardId, taskId, taskData) {
  const boards = await getBoards()
  const board = boards.find(b => b.id === boardId)
  if (!board) {
    throw new Error('Board not found')
  }

  const taskIndex = board.tasks.findIndex(t => t.id === taskId)
  if (taskIndex === -1) {
    throw new Error('Task not found')
  }

  board.tasks[taskIndex] = {
    ...board.tasks[taskIndex],
    ...taskData,
    id: taskId, // Ensure ID doesn't change
    updatedAt: new Date().toISOString()
  }

  await saveBoards(boards)
  return board.tasks[taskIndex]
}

// Delete a task
export async function deleteTask(boardId, taskId) {
  const boards = await getBoards()
  const board = boards.find(b => b.id === boardId)
  if (!board) {
    throw new Error('Board not found')
  }

  const originalLength = board.tasks.length
  board.tasks = board.tasks.filter(t => t.id !== taskId)

  if (board.tasks.length === originalLength) {
    throw new Error('Task not found')
  }

  await saveBoards(boards)
  return { success: true }
}
