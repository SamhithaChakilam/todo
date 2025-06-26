"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Trash2, Plus, LogOut } from "lucide-react"
import { apiRequest } from "@/lib/api"

interface Task {
  _id: string
  title: string
  createdAt: string
}

interface TodoDashboardProps {
  onLogout: () => void
}

export function TodoDashboard({ onLogout }: TodoDashboardProps) {
  const [tasks, setTasks] = useState<Task[]>([])
  const [newTask, setNewTask] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [addingTask, setAddingTask] = useState(false)

  useEffect(() => {
    fetchTasks()
  }, [])

  const fetchTasks = async () => {
    setLoading(true)
    setError("")

    try {
      const data = await apiRequest("/api/tasks", "GET")
      setTasks(data.tasks || [])
    } catch (err) {
      setError("Failed to fetch tasks")
    } finally {
      setLoading(false)
    }
  }

  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newTask.trim()) return

    setAddingTask(true)
    setError("")

    try {
      const data = await apiRequest("/api/tasks", "POST", {
        title: newTask.trim(),
      })

      setTasks([...tasks, data.task])
      setNewTask("")
    } catch (err) {
      setError("Failed to add task")
    } finally {
      setAddingTask(false)
    }
  }

  const handleDeleteTask = async (taskId: string) => {
    setError("")

    try {
      await apiRequest(`/api/tasks/${taskId}`, "DELETE")
      setTasks(tasks.filter((task) => task._id !== taskId))
    } catch (err) {
      setError("Failed to delete task")
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Tasks</h1>
          <Button variant="outline" onClick={onLogout} className="bg-white text-gray-700">
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">Add New Task</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAddTask} className="flex gap-2">
              <Input
                type="text"
                placeholder="Enter task title..."
                value={newTask}
                onChange={(e) => setNewTask(e.target.value)}
                disabled={addingTask}
                className="flex-1"
              />
              <Button type="submit" disabled={addingTask || !newTask.trim()}>
                <Plus className="w-4 h-4 mr-2" />
                {addingTask ? "Adding..." : "Add Task"}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Tasks ({tasks.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8 text-gray-500">Loading tasks...</div>
            ) : tasks.length === 0 ? (
              <div className="text-center py-8 text-gray-500">No tasks yet. Add your first task above!</div>
            ) : (
              <div className="space-y-2">
                {tasks.map((task) => (
                  <div key={task._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-900">{task.title}</span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteTask(task._id)}
                      className="bg-red-50 text-red-600 hover:bg-red-100"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
