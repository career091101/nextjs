import * as React from "react"
import { cn } from "@/lib/utils"

interface ToastProps {
  message: string
  type?: "success" | "error" | "warning" | "info"
  duration?: number
}

let toastTimeoutId: NodeJS.Timeout

export function toast({ message, type = "info", duration = 3000 }: ToastProps) {
  // 既存のトーストを削除
  const existingToast = document.getElementById("toast-container")
  if (existingToast) {
    document.body.removeChild(existingToast)
    clearTimeout(toastTimeoutId)
  }

  // トーストコンテナを作成
  const container = document.createElement("div")
  container.id = "toast-container"
  container.className = cn(
    "fixed top-4 right-4 z-50 max-w-md px-4 py-2 rounded-lg shadow-lg",
    {
      "bg-green-500 text-white": type === "success",
      "bg-red-500 text-white": type === "error",
      "bg-yellow-500 text-white": type === "warning",
      "bg-blue-500 text-white": type === "info",
    }
  )
  container.textContent = message

  // トーストを表示
  document.body.appendChild(container)

  // 指定時間後にトーストを削除
  toastTimeoutId = setTimeout(() => {
    if (container.parentNode === document.body) {
      document.body.removeChild(container)
    }
  }, duration)
} 