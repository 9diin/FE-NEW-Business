import React, { useState } from "react"
import { Button, Input, Label, Checkbox } from "@/components/ui"
import { signUpApi } from "@/apis"
import type { FormErrors, User } from "@/types/auth"
import { Loader2, Mail, Lock, User as UserIcon, AlertCircle } from "lucide-react"

interface SignUpFormProps {
  onSuccess: (user: User) => void
  onSwitchToLogin: () => void
}

export function SignUpForm({ onSuccess, onSwitchToLogin }: SignUpFormProps) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [nickname, setNickname] = useState("")

  // 법적 조치 약관 동의 상태
  const [privacyPolicyAccepted, setPrivacyPolicyAccepted] = useState(false)
  const [termsOfServiceAccepted, setTermsOfServiceAccepted] = useState(false)
  const [marketingOptIn, setMarketingOptIn] = useState(false)

  const [errors, setErrors] = useState<FormErrors>({})
  const [isLoading, setIsLoading] = useState(false)

  // 전체 동의 핸들러
  const handleSelectAll = (checked: boolean) => {
    setPrivacyPolicyAccepted(checked)
    setTermsOfServiceAccepted(checked)
    setMarketingOptIn(checked)
    if (checked) {
      setErrors((prev) => ({ ...prev, privacyPolicyAccepted: undefined, termsOfServiceAccepted: undefined }))
    }
  }

  const isAllChecked = privacyPolicyAccepted && termsOfServiceAccepted && marketingOptIn

  // Validation Check
  const validate = (): boolean => {
    const newErrors: FormErrors = {}

    // 이메일 검증
    if (!email.trim()) {
      newErrors.email = "이메일을 입력해 주세요."
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(email)) {
        newErrors.email = "올바른 이메일 형식이 아닙니다."
      }
    }

    // 비밀번호 검증
    if (!password) {
      newErrors.password = "비밀번호를 입력해 주세요."
    } else if (password.length < 6) {
      newErrors.password = "비밀번호는 최소 6자 이상이어야 합니다."
    }

    // 닉네임 검증
    if (!nickname.trim()) {
      newErrors.nickname = "닉네임을 입력해 주세요."
    } else if (nickname.trim().length < 2) {
      newErrors.nickname = "닉네임은 2자 이상이어야 합니다."
    }

    // 약관 검증
    if (!privacyPolicyAccepted) {
      newErrors.privacyPolicyAccepted = "개인정보처리방침 동의는 필수입니다."
    }

    if (!termsOfServiceAccepted) {
      newErrors.termsOfServiceAccepted = "서비스 이용약관 동의는 필수입니다."
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
      const response = await signUpApi({
        email,
        password,
        nickname,
        privacyPolicyAccepted,
        termsOfServiceAccepted,
        marketingOptIn,
      })

      if (response.success && response.user) {
        onSuccess(response.user)
      } else {
        setErrors({ general: response.message || "회원가입에 실패했습니다." })
      }
    } catch (err: any) {
      setErrors({ general: err.message || "회원가입 처리 중 오류가 발생했습니다." })
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
        <Label htmlFor="signup-email" className="text-xs font-semibold text-foreground">
          이메일주소 <span className="text-destructive">*</span>
        </Label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            id="signup-email"
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
        <Label htmlFor="signup-password" className="text-xs font-semibold text-foreground">
          비밀번호 <span className="text-destructive">*</span>
        </Label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            id="signup-password"
            type="password"
            placeholder="6자 이상 입력하세요"
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

      {/* 닉네임 입력 */}
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="signup-nickname" className="text-xs font-semibold text-foreground">
          닉네임 <span className="text-destructive">*</span>
        </Label>
        <div className="relative">
          <UserIcon className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            id="signup-nickname"
            type="text"
            placeholder="사용하실 닉네임 (2자 이상)"
            value={nickname}
            onChange={(e) => {
              setNickname(e.target.value)
              if (errors.nickname) setErrors((prev) => ({ ...prev, nickname: undefined }))
            }}
            className="pl-9"
            disabled={isLoading}
          />
        </div>
        {errors.nickname && <span className="text-xs text-destructive">{errors.nickname}</span>}
      </div>

      {/* 법적 조치 필수/선택 약관 동의 섹션 */}
      <div className="mt-1 flex flex-col gap-2.5 rounded-lg border border-border/80 bg-muted/40 p-3">
        <div className="flex items-center justify-between border-b pb-2">
          <div className="flex items-center gap-2">
            <Checkbox
              id="term-all"
              checked={isAllChecked}
              onCheckedChange={(checked) => handleSelectAll(Boolean(checked))}
              disabled={isLoading}
            />
            <Label htmlFor="term-all" className="text-xs font-bold cursor-pointer">
              전체 동의하기
            </Label>
          </div>
          <span className="text-[11px] text-muted-foreground">필수 및 선택 약관 전체</span>
        </div>

        {/* 개인정보처리방침 (필수) */}
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <Checkbox
              id="term-privacy"
              checked={privacyPolicyAccepted}
              onCheckedChange={(checked) => {
                setPrivacyPolicyAccepted(Boolean(checked))
                if (checked && errors.privacyPolicyAccepted) setErrors((prev) => ({ ...prev, privacyPolicyAccepted: undefined }))
              }}
              disabled={isLoading}
            />
            <Label htmlFor="term-privacy" className="text-xs cursor-pointer flex items-center gap-1">
              <span className="font-semibold text-blue-600 dark:text-blue-400">[필수]</span>
              <span>개인정보처리방침 동의</span>
            </Label>
          </div>
          {errors.privacyPolicyAccepted && (
            <span className="pl-6 text-[11px] text-destructive">{errors.privacyPolicyAccepted}</span>
          )}
        </div>

        {/* 서비스 이용약관 (필수) */}
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <Checkbox
              id="term-service"
              checked={termsOfServiceAccepted}
              onCheckedChange={(checked) => {
                setTermsOfServiceAccepted(Boolean(checked))
                if (checked && errors.termsOfServiceAccepted) setErrors((prev) => ({ ...prev, termsOfServiceAccepted: undefined }))
              }}
              disabled={isLoading}
            />
            <Label htmlFor="term-service" className="text-xs cursor-pointer flex items-center gap-1">
              <span className="font-semibold text-blue-600 dark:text-blue-400">[필수]</span>
              <span>서비스 이용약관 동의</span>
            </Label>
          </div>
          {errors.termsOfServiceAccepted && (
            <span className="pl-6 text-[11px] text-destructive">{errors.termsOfServiceAccepted}</span>
          )}
        </div>

        {/* 마케팅 수신동의 (선택) */}
        <div className="flex items-center gap-2">
          <Checkbox
            id="term-marketing"
            checked={marketingOptIn}
            onCheckedChange={(checked) => setMarketingOptIn(Boolean(checked))}
            disabled={isLoading}
          />
          <Label htmlFor="term-marketing" className="text-xs cursor-pointer flex items-center gap-1">
            <span className="font-semibold text-muted-foreground">[선택]</span>
            <span>마케팅 정보 수신 및 혜택 알림 동의</span>
          </Label>
        </div>
      </div>

      {/* 회원가입 제출 버튼 */}
      <Button
        type="submit"
        disabled={isLoading}
        className="mt-2 w-full bg-blue-900 text-white hover:bg-blue-800"
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 size-4 animate-spin" />
            회원가입 처리 중...
          </>
        ) : (
          "회원가입 완료"
        )}
      </Button>

      {/* 로그인 유도 링크 */}
      <div className="mt-2 text-center text-xs text-muted-foreground">
        이미 계정이 있으신가요?{" "}
        <button
          type="button"
          onClick={onSwitchToLogin}
          className="font-semibold text-blue-900 underline underline-offset-4 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
        >
          로그인
        </button>
      </div>
    </form>
  )
}
