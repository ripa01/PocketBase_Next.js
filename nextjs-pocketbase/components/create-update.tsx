"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
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
  const [open, setOpen] = useState(false)
  const [title, setTitle] = useState("")
  const [completed, setCompleted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()

  // Initialize form with task data when in update mode and dialog opens
  useEffect(() => {
    if (open && mode === "update" && task) {
      setTitle(task.title)
      setCompleted(task.completed)
    } else if (open && mode === "create") {
      // Reset form when opening in create mode
      setTitle("")
      setCompleted(false)
    }
  }, [open, mode, task])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      if (mode === "create") {
        await createTask({ title, completed })
        setTitle("")
        setCompleted(false)
      } else if (mode === "update" && task) {
        await updateTask({ id: task.id, title, completed })
      }

      setOpen(false)
      router.refresh()
    } catch (error) {
      console.error(`Failed to ${mode} task:`, error)
    } finally {
      setIsSubmitting(false)
    }
  }

  // Determine text based on mode
  const dialogTitle = mode === "create" ? "Create New Task" : "Update Task"
  const buttonText = isSubmitting
    ? mode === "create"
      ? "Creating..."
      : "Updating..."
    : mode === "create"
      ? "Create Task"
      : "Update Task"

  // Default trigger based on mode
  const defaultTrigger =
    mode === "create" ? <Button className="mb-4">Create Task</Button> : <Button size="sm">Edit</Button>

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger || defaultTrigger}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{dialogTitle}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Task Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter task title"
              required
            />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="completed">Status</Label>
            <div className="flex items-center space-x-2">
              <Label htmlFor="completed">{completed ? "Completed" : "Pending"}</Label>
              <Switch id="completed" checked={completed} onCheckedChange={setCompleted} />
            </div>
          </div>
          <Button type="submit" className="w-full" disabled={isSubmitting || !title.trim()}>
            {buttonText}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}

