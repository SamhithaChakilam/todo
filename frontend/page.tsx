"use client"

import { useState, useEffect } from "react"
import { SignupForm } from "@/components/signup-form"
import { LoginForm } from "@/components/login-form"
import { TodoDashboard } from "@/components/todo-dashboard"

type View = "login" | "signup" | "dashboard"

export default function App() {
  const [currentView, setCurrentView] = useState<View>("login")
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    // Check if user is already logged in
    const token = localStorage.getItem("jwt_token")
    if (token) {
      setIsAuthenticated(true)
      setCurrentView("dashboard")
    }
  }, [])

  const handleAuthSuccess = (token: string) => {
    localStorage.setItem("jwt_token", token)
    setIsAuthenticated(true)
    setCurrentView("dashboard")
  }

  const handleLogout = () => {
    localStorage.removeItem("jwt_token")
    setIsAuthenticated(false)
    setCurrentView("login")
  }

  if (isAuthenticated && currentView === "dashboard") {
    return <TodoDashboard onLogout={handleLogout} />
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">Todo App</h1>
          <p className="mt-2 text-gray-600">
            {currentView === "login" ? "Sign in to your account" : "Create a new account"}
          </p>
        </div>

        {currentView === "login" ? (
          <LoginForm onSuccess={handleAuthSuccess} onSwitchToSignup={() => setCurrentView("signup")} />
        ) : (
          <SignupForm onSuccess={handleAuthSuccess} onSwitchToLogin={() => setCurrentView("login")} />
        )}
      </div>
    </div>
  )
}
