import { updateBoard } from '~/server/utils/storage'

export default defineEventHandler(async (event) => {
  try {
    const id = parseInt(event.context.params.id)
    const body = await readBody(event)

    const updatedBoard = await updateBoard(id, body)
    return updatedBoard
  } catch (error) {
    if (error.message === 'Board not found') {
      throw createError({
        statusCode: 404,
        statusMessage: 'Board not found'
      })
    }
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to update board',
      data: error.message
    })
  }
})
