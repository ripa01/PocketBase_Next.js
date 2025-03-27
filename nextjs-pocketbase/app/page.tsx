import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Pencil, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TaskDialog } from "@/components/create-update";
import { DeleteTaskDialog } from "@/components/delete";
import { fetchTasks } from "@/lib/pagination";
import { changePage } from "./actions";
import { PerPageSelect } from "@/components/perPage";

export default async function TasksPage(
props: {
  searchParams?: Promise<{
    page?: string
    perPage?: string
  }>
}
) {
  const params = await props.searchParams;
  const page = Number(params?.page) || 1;
  const perPage = Number(params?.perPage) || 5;
  const { items: records, totalPages } = await fetchTasks(page, perPage);

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Tasks</h1>
        <TaskDialog mode="create" />
      </div>

      <Card className="w-full shadow-md">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">My Tasks</CardTitle>
        </CardHeader>

        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-100 dark:bg-gray-800">
                <TableHead className="w-1/4">Title</TableHead>
                <TableHead className="w-1/5">Collection</TableHead>
                <TableHead className="w-1/5">Created</TableHead>
                <TableHead className="w-1/6 text-center">Status</TableHead>
                <TableHead className="w-1/6 text-center">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {records.map((task) => (
                <TableRow key={task.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <TableCell>{task.title}</TableCell>
                  <TableCell>{task.collectionName}</TableCell>
                  <TableCell>{new Date(task.created).toLocaleDateString()}</TableCell>
                  <TableCell className="text-center">
                    <Badge variant={task.completed ? "default" : "destructive"}>
                      {task.completed ? "Completed" : "Pending"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex items-center justify-center gap-2">
                      <TaskDialog
                        mode="update"
                        task={{ id: task.id, title: task.title, completed: task.completed }}
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
          <div className="flex justify-between items-center mt-6">
            <div className="flex items-center space-x-2">
              <span>Per Page:</span>
              <PerPageSelect currentPerPage={perPage} />
            </div>
            
            <div className="flex items-center space-x-4">
              <form action={changePage}>
                <input type="hidden" name="page" value={page} />
                <input type="hidden" name="totalPages" value={totalPages} />
                <input type="hidden" name="direction" value="prev" />
                <input type="hidden" name="perPage" value={perPage} />
                <Button type="submit" variant="outline" size="icon" disabled={page <= 1}>
                  <ChevronLeft className="h-5 w-5" />
                </Button>
              </form>

              <span className="text-sm">Page {page} of {totalPages}</span>
              
              <form action={changePage}>
                <input type="hidden" name="page" value={page} />
                <input type="hidden" name="totalPages" value={totalPages} />
                <input type="hidden" name="direction" value="next" />
                <input type="hidden" name="perPage" value={perPage} />
                <Button type="submit" variant="outline" size="icon" disabled={page >= totalPages}>
                  <ChevronRight className="h-5 w-5" />
                </Button>
              </form>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
