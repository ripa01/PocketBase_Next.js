import pb from "@/lib/pocketbase"



export async function deleteTask(  id: string ) {
    try {
      const record = await pb.collection("Tasks").delete(id)
      return { success: true, data: record }
    } catch (error) {
      console.error("Error deleting task:", error)
      throw new Error("Failed to update task")
    }
  }
  

