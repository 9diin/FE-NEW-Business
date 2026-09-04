import React, { useState } from "react"
import { Button, Input, Label } from "@/components/ui"
import { loginApi } from "@/apis"
import type { FormErrors, User } from "@/types/auth"
import { Loader2, Mail, Lock, AlertCircle } from "lucide-react"

interface LoginFormProps {
  onSuccess: (user: User) => void
  onSwitchToSignUp: () => void
}

export function LoginForm({ onSuccess, onSwitchToSignUp }: LoginFormProps) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [errors, setErrors] = useState<FormErrors>({})
  const [isLoading, setIsLoading] = useState(false)

  // Validation Check
  const validate = (): boolean => {
    const newErrors: FormErrors = {}

    if (!email.trim()) {
      newErrors.email = "이메일을 입력해 주세요."
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(email)) {
        newErrors.email = "올바른 이메일 형식이 아닙니다."
      }
    }

    if (!password) {
      newErrors.password = "비밀번호를 입력해 주세요."
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return

    setIsLoading(true)
    setErrors({})

    try {
      const response = await loginApi({ email, password })
      if (response.success && response.user) {
        onSuccess(response.user)
      } else {
        setErrors({ general: response.message || "로그인에 실패했습니다." })
      }
    } catch (err: any) {
      setErrors({ general: err.message || "로그인 중 오류가 발생했습니다." })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 py-2">
      {errors.general && (
        <div className="flex items-center gap-2 rounded-md bg-destructive/15 p-3 text-xs font-medium text-destructive">
          <AlertCircle className="size-4 shrink-0" />
          <span>{errors.general}</span>
        </div>
      )}

      {/* 이메일 입력 */}
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="login-email" className="text-xs font-semibold text-foreground">
          이메일주소 <span className="text-destructive">*</span>
        </Label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            id="login-email"
            type="email"
            placeholder="example@domain.com"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value)
              if (errors.email) setErrors((prev) => ({ ...prev, email: undefined }))
            }}
            className="pl-9"
            disabled={isLoading}
          />
        </div>
        {errors.email && <span className="text-xs text-destructive">{errors.email}</span>}
      </div>

      {/* 비밀번호 입력 */}
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="login-password font-semibold" className="text-xs font-semibold text-foreground">
          비밀번호 <span className="text-destructive">*</span>
        </Label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            id="login-password"
            type="password"
            placeholder="비밀번호를 입력하세요"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value)
              if (errors.password) setErrors((prev) => ({ ...prev, password: undefined }))
            }}
            className="pl-9"
            disabled={isLoading}
          />
        </div>
        {errors.password && <span className="text-xs text-destructive">{errors.password}</span>}
      </div>

      {/* 로그인 버튼 */}
      <Button
        type="submit"
        disabled={isLoading}
        className="mt-2 w-full bg-blue-900 text-white hover:bg-blue-800"
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 size-4 animate-spin" />
            로그인 중...
          </>
        ) : (
          "로그인"
        )}
      </Button>

      {/* 회원가입 유도 링크 */}
      <div className="mt-3 text-center text-xs text-muted-foreground">
        아직 계정이 없으신가요?{" "}
        <button
          type="button"
          onClick={onSwitchToSignUp}
          className="font-semibold text-blue-900 underline underline-offset-4 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
        >
          회원가입
        </button>
      </div>
    </form>
  )
}
