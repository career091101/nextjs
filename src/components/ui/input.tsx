import * as React from "react"
import { cn } from "@/lib/utils"

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  // カスタムプロップスを追加（必要に応じて）
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          // ベーススタイル
          "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2",
          // テキストとプレースホルダーのスタイル
          "text-sm text-foreground placeholder:text-muted-foreground",
          // フォーカス時のスタイル
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
          // 無効時のスタイル
          "disabled:cursor-not-allowed disabled:opacity-50",
          // モバイルでのタップハイライトを無効化
          "touch-none",
          // カスタムクラスの適用
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)

// コンポーネントの表示名を設定（開発ツールでの識別用）
Input.displayName = "Input"

export { Input }