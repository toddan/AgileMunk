import { getBoard } from '~/server/utils/storage'

export default defineEventHandler(async (event) => {
  try {
    const id = parseInt(event.context.params.id)
    const board = await getBoard(id)

    if (!board) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Board not found'
      })
    }

    return board
  } catch (error) {
    if (error.statusCode) {
      throw error
    }
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch board',
      data: error.message
    })
  }
})
