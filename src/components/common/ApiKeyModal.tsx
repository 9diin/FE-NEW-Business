import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { Button, Input, Label } from "@/components/ui"
import { registerAiKey, updateAiKey, deleteAiKey } from "@/apis"
import { Loader2, KeyRound, Trash2, Pencil } from "lucide-react"
import { toast } from "sonner"

interface ApiKeyModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  userId: string | null
  /** 현재 Key 등록 여부 (부모로부터 주입) */
  hasKey: boolean
  onKeyStatusChange: (hasKey: boolean) => void
}

type ModalMode = "register" | "update" | "delete_confirm"

export function ApiKeyModal({
  open,
  onOpenChange,
  userId,
  hasKey,
  onKeyStatusChange,
}: ApiKeyModalProps) {
  const [apiKey, setApiKey] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [mode, setMode] = useState<ModalMode>("register")

  // Mock 유저 여부 판단 (백엔드 미연결 시 Mock 토큰 스타트에 'mock_' 사용)
  const isMockUser = (localStorage.getItem("accessToken") || "").startsWith("mock_")

  // 모달이 열릴 때 등록 여부에 따라 초기 모드 설정
  useEffect(() => {
    if (open) {
      setMode(hasKey ? "update" : "register")
      setApiKey("")
      setError("")
    }
  }, [open, hasKey])

  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen) {
      setApiKey("")
      setError("")
    }
    onOpenChange(nextOpen)
  }

  // 등록 또는 수정 제출
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!userId) return

    if (!apiKey.trim()) {
      setError("API Key를 입력해 주세요.")
      return
    }

    setIsLoading(true)
    setError("")

    try {
      const response =
        mode === "register"
          ? await registerAiKey(userId, apiKey.trim())
          : await updateAiKey(userId, apiKey.trim())

      toast.success(response.message, {
        className: "bg-green-600 text-white border-none",
      })
      onKeyStatusChange(response.has_ai_key)
      onOpenChange(false)
    } catch (err: any) {
      // 409: 이미 등록됨 → 수정 모드로 전환 유도
      const msg = err.response?.data?.detail || err.message || "오류가 발생했습니다."
      setError(msg)
    } finally {
      setIsLoading(false)
    }
  }

  // 삭제 실행
  const handleDelete = async () => {
    if (!userId) return
    setIsLoading(true)
    setError("")

    try {
      const response = await deleteAiKey(userId)
      toast.success(response.message, {
        className: "bg-red-600 text-white border-none",
      })
      onKeyStatusChange(response.has_ai_key)
      onOpenChange(false)
    } catch (err: any) {
      const msg = err.response?.data?.detail || err.message || "삭제 중 오류가 발생했습니다."
      setError(msg)
    } finally {
      setIsLoading(false)
    }
  }

  const isDeleteConfirm = mode === "delete_confirm"
  const isRegister = mode === "register"

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[440px] rounded-xl p-6 shadow-2xl border bg-background">
        <DialogHeader className="flex flex-col gap-2 text-left">
          <DialogTitle className="text-xl font-bold text-foreground flex items-center gap-2">
            <KeyRound className="size-5 text-blue-600" />
            {isDeleteConfirm
              ? "Gemini AI Key 삭제"
              : isRegister
                ? "Gemini AI Key 등록"
                : "Gemini AI Key 수정"}
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground leading-relaxed">
            {isDeleteConfirm ? (
              <span className="text-sm text-destructive font-medium">
                등록된 Gemini AI Key가 삭제됩니다. 계속하시겠습니까?
              </span>
            ) : (
              <>
                <span className="text-sm">
                  현재는{" "}
                  <strong className="text-foreground">Gemini AI Key</strong> 등록만
                  지원합니다.
                </span>
                <br />
                추후 ChatGPT(OpenAI) 및 Claude(Anthropic) 모델에 대한 키 등록 기능도
                추가될 예정입니다.
              </>
            )}
          </DialogDescription>
        </DialogHeader>

        {/* Mock 유저일 때: 로그인 미연결 안내 */}
        {isMockUser ? (
          <div className="mt-4 flex flex-col gap-4">
            <div className="rounded-lg border border-yellow-500/40 bg-yellow-500/10 p-4 text-sm text-yellow-300">
              <p className="font-semibold mb-1">서버 미연결 상태</p>
              <p className="text-xs leading-relaxed text-yellow-300/80">
                현재 백엔드 서버에 연결되지 않은 상태로 로그인된 상태입니다.<br />
                Gemini AI Key 등록은 백엔드 서버가 연결된 실제 계정으로
                로그인해야 사용 가능합니다.
              </p>
            </div>
            <div className="flex justify-end">
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                닫기
              </Button>
            </div>
          </div>
        ) : isDeleteConfirm ? (
          // 삭제 확인 모드
          <div className="flex flex-col gap-4 mt-2">
            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setMode("update")}
                disabled={isLoading}
              >
                취소
              </Button>
              <Button
                type="button"
                disabled={isLoading}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                onClick={handleDelete}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 size-4 animate-spin" />
                    삭제 중...
                  </>
                ) : (
                  "삭제 확인"
                )}
              </Button>
            </div>
          </div>
        ) : (
          // 등록/수정 입력 모드
          <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-2">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="gemini-api-key" className="text-xs font-semibold text-foreground">
                API Key <span className="text-destructive">*</span>
              </Label>
              <Input
                id="gemini-api-key"
                type="password"
                placeholder={hasKey ? "새로운 Key를 입력하세요" : "AIxx-xxxxxxxxxxxxxxxxxxxxxxxx"}
                value={apiKey}
                onChange={(e) => {
                  setApiKey(e.target.value)
                  if (error) setError("")
                }}
                disabled={isLoading}
              />
              {error && <span className="text-xs text-destructive">{error}</span>}
            </div>

            <div className={`flex gap-2 mt-2 ${hasKey ? "justify-between" : "justify-end"}`}>
              {/* 키가 이미 등록된 경우: 삭제 버튼 노출 */}
              {hasKey && (
                <Button
                  type="button"
                  variant="outline"
                  disabled={isLoading}
                  className="text-destructive border-destructive/50 hover:bg-destructive/10 gap-1.5"
                  onClick={() => setMode("delete_confirm")}
                >
                  <Trash2 className="size-3.5" />
                  Key 삭제
                </Button>
              )}
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => onOpenChange(false)}
                  disabled={isLoading}
                >
                  취소
                </Button>
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="bg-blue-900 text-white hover:bg-blue-800 gap-1.5"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="size-4 animate-spin" />
                      {isRegister ? "등록 중..." : "수정 중..."}
                    </>
                  ) : (
                    <>
                      {!isRegister && <Pencil className="size-3.5" />}
                      {isRegister ? "등록하기" : "수정하기"}
                    </>
                  )}
                </Button>
              </div>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}
