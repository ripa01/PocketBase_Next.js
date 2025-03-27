import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Pencil } from "lucide-react"
import { Button } from "@/components/ui/button"
import { TaskDialog } from "@/components/create-update"
import { DeleteTaskDialog } from "@/components/delete"
import { fetchTasks } from "@/lib/pagination"
import { changePage } from "./actions"
import { PerPageSelect } from "@/components/perPage"

export default async function TasksPage(
  props: {
    searchParams?: Promise<{
      page?: string
      perPage?: string
    }>
  }
) {
  const searchParams = await props.searchParams;
  const page = Number(searchParams?.page) || 1
  const perPage = Number(searchParams?.perPage) || 5

  const { items: records, totalPages } = await fetchTasks(page, perPage)

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
                    <div className="flex items-center gap-2">
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
                      <DeleteTaskDialog
                        task={{
                          id: task.id,
                          title: task.title,
                        }}
                      />
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          
          {/* Pagination Controls */}
          <div className="flex justify-between items-center mt-4">
            <div className="flex items-center space-x-2">
              <span>Per Page</span>
              <PerPageSelect currentPerPage={perPage} />
            </div>
            
            <div className="flex items-center space-x-2">
              <form action={changePage}>
                <input type="hidden" name="page" value={page} />
                <input type="hidden" name="totalPages" value={totalPages} />
                <input type="hidden" name="direction" value="prev" />
                <input type="hidden" name="perPage" value={perPage} />
                <Button 
                  type="submit"
                  variant="outline"
                  disabled={page <= 1}
                >
                  Previous
                </Button>
              </form>
              
              <span>
                Page {page} of {totalPages}
              </span>
              
              <form action={changePage}>
                <input type="hidden" name="page" value={page} />
                <input type="hidden" name="totalPages" value={totalPages} />
                <input type="hidden" name="direction" value="next" />
                <input type="hidden" name="perPage" value={perPage} />
                <Button 
                  type="submit"
                  variant="outline"
                  disabled={page >= totalPages}
                >
                  Next
                </Button>
              </form>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}