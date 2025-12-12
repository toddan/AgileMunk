import { getBoards } from '~/server/utils/storage'

export default defineEventHandler(async (event) => {
  try {
    const boards = await getBoards()
    return boards
  } catch (error) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch boards',
      data: error.message
    })
  }
})
