import pb from "@/lib/pocketbase"

interface TaskData {
  title: string
  completed: boolean
}

export async function createTask(data: TaskData) {
  try {
    const record = await pb.collection("Tasks").create(data)

    return { success: true, data: record }
  } catch (error) {
    console.error("Error creating task:", error)
    throw new Error("Failed to create task")
  }
}

