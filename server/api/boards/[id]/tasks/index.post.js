import { addTask } from '~/server/utils/storage'

export default defineEventHandler(async (event) => {
  try {
    const boardId = parseInt(event.context.params.id)
    const body = await readBody(event)

    if (!body.title) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Task title is required'
      })
    }

    const newTask = await addTask(boardId, body)
    return newTask
  } catch (error) {
    if (error.statusCode) {
      throw error
    }
    if (error.message === 'Board not found') {
      throw createError({
        statusCode: 404,
        statusMessage: 'Board not found'
      })
    }
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to create task',
      data: error.message
    })
  }
})
