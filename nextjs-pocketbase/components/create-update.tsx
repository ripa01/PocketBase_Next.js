"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { updateTask } from "@/lib/update"
import { createTask } from "@/lib/create"

interface Task {
  id: string
  title: string
  completed: boolean
}

interface TaskDialogProps {
  mode: "create" | "update"
  task?: Task
  trigger?: React.ReactNode
}

export function TaskDialog({ mode = "create", task, trigger }: TaskDialogProps) {
  const router = useRouter()
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { isSubmitting },
  } = useForm<Task>({
    defaultValues: { title: "", completed: false },
  })

  const completed = watch("completed")

  useEffect(() => {
    if (task && mode === "update") {
      reset(task)
    } else {
      reset()
    }
  }, [task, mode, reset])

  const onSubmit = async (data: Task) => {
    try {
      await (mode === "create"
        ? createTask(data)
        : updateTask({ ...data }))
      reset()
      router.refresh()
    } catch (error) {
      console.error(`Failed to ${mode} task:`, error)
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>{trigger || <Button size={mode === "create" ? "default" : "sm"}>{mode === "create" ? "Create Task" : "Edit"}</Button>}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{mode === "create" ? "Create New Task" : "Update Task"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label htmlFor="title">Task Title</Label>
            <Input id="title" {...register("title", { required: "Task title is required" })} placeholder="Enter task title" />
          </div>
          <div className="flex items-center justify-between">
            <Label>Status</Label>
            <div className="flex items-center space-x-2">
              <Label>{completed ? "Completed" : "Pending"}</Label>
              <Switch checked={completed} onCheckedChange={(value) => setValue("completed", value)} />
            </div>
          </div>
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? (mode === "create" ? "Creating..." : "Updating...") : mode === "create" ? "Create Task" : "Update Task"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
