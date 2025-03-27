import pb from "@/lib/pocketbase"

interface TaskData {
  title: string
  completed: boolean
}


export async function updateTask(data: TaskData & { id?: string }) {
    try {
      const { id, ...taskData } = data
  
      if (!id) {
        throw new Error("Task ID is required for updates")
      }
  
      const record = await pb.collection("Tasks").update(id, taskData)
      return { success: true, data: record }
    } catch (error) {
      console.error("Error updating task:", error)
      throw new Error("Failed to update task")
    }
  }
  

