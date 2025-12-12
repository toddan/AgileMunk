import { deleteBoard } from '~/server/utils/storage'

export default defineEventHandler(async (event) => {
  try {
    const id = parseInt(event.context.params.id)
    const result = await deleteBoard(id)
    return result
  } catch (error) {
    if (error.message === 'Board not found') {
      throw createError({
        statusCode: 404,
        statusMessage: 'Board not found'
      })
    }
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to delete board',
      data: error.message
    })
  }
})
