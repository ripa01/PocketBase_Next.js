import pb from "@/lib/pocketbase"

export async function fetchTasks(page = 1, perPage = 5) {
  try {
    const result = await pb.collection('Tasks').getList(page, perPage, {
      sort: '-created',
    })
    return result
  } catch (error) {
    console.error('Error fetching tasks:', error)
    throw error
  }
}
