import { deleteTask } from '~/server/utils/storage'

export default defineEventHandler(async (event) => {
  try {
    const boardId = parseInt(event.context.params.id)
    const taskId = parseInt(event.context.params.taskId)

    const result = await deleteTask(boardId, taskId)
    return result
  } catch (error) {
    if (error.message === 'Board not found' || error.message === 'Task not found') {
      throw createError({
        statusCode: 404,
        statusMessage: error.message
      })
    }
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to delete task',
      data: error.message
    })
  }
})
