import { createBoard } from '~/server/utils/storage'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)

    if (!body.name) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Board name is required'
      })
    }

    const newBoard = await createBoard(body)
    return newBoard
  } catch (error) {
    if (error.statusCode) {
      throw error
    }
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to create board',
      data: error.message
    })
  }
})
