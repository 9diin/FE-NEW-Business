import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { LoginForm } from "./LoginForm"
import { SignUpForm } from "./SignUpForm"
import type { User } from "@/types/auth"
import { toast } from "sonner"

interface AuthModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  initialView?: "login" | "signup"
  onAuthSuccess?: (user: User) => void
}

export function AuthModal({
  open,
  onOpenChange,
  initialView = "login",
  onAuthSuccess,
}: AuthModalProps) {
  const [view, setView] = useState<"login" | "signup">(initialView)

  // Reset view when dialog opens/closes
  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen) {
      setTimeout(() => setView(initialView), 200)
    }
    onOpenChange(nextOpen)
  }

  const handleLoginSuccess = (user: User) => {
    toast.success("로그인이 완료되었습니다.", {
      className: "bg-green-600 text-white border-none",
    })
    if (onAuthSuccess) {
      onAuthSuccess(user)
    }
    onOpenChange(false)
  }

  const handleSignUpSuccess = (user: User) => {
    toast.success("회원가입이 완료되었습니다. 로그인해주세요.", {
      className: "bg-green-600 text-white border-none",
    })
    setView("login")
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[420px] rounded-xl p-6 shadow-2xl border bg-background">
        <DialogHeader className="flex flex-col gap-1 text-left">
          <DialogTitle className="text-xl font-bold text-foreground">
            {view === "login" ? "NODE-BIZ 로그인" : "NODE-BIZ 회원가입"}
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            {view === "login"
              ? "서비스 사용을 위해 계정에 로그인해 주세요."
              : "새 계정을 생성하고 노드 기반 사업계획서 도출 서비스를 이용해보세요."}
          </DialogDescription>
        </DialogHeader>

        {view === "login" ? (
          <LoginForm
            onSuccess={handleLoginSuccess}
            onSwitchToSignUp={() => setView("signup")}
          />
        ) : (
          <SignUpForm
            onSuccess={handleSignUpSuccess}
            onSwitchToLogin={() => setView("login")}
          />
        )}
      </DialogContent>
    </Dialog>
  )
}
