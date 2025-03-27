import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Pencil } from "lucide-react"
import { Button } from "@/components/ui/button"
import pb from "@/lib/pocketbase"
import { TaskDialog } from "@/components/create-update"

export default async function TasksPage() {
  const records = await pb.collection("Tasks").getFullList({
    sort: "-created",
  })

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Tasks</h1>
        <TaskDialog mode="create" />
      </div>
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">My Tasks</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Collection</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {records.map((task) => (
                <TableRow key={task.id}>
                  <TableCell>{task.title}</TableCell>
                  <TableCell>{task.collectionName}</TableCell>
                  <TableCell>{new Date(task.created).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <Badge variant={task.completed ? "default" : "destructive"}>
                      {task.completed ? "Completed" : "Pending"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <TaskDialog
                      mode="update"
                      task={{
                        id: task.id,
                        title: task.title,
                        completed: task.completed,
                      }}
                      trigger={
                        <Button variant="ghost" size="icon">
                          <Pencil className="h-4 w-4" />
                        </Button>
                      }
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}

