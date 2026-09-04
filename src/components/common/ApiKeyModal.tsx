import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { Button, Input, Label } from "@/components/ui"
import { registerApiKey } from "@/apis"
import { Loader2, KeyRound } from "lucide-react"
import { toast } from "sonner"

interface ApiKeyModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
}

export function ApiKeyModal({ open, onOpenChange, onSuccess }: ApiKeyModalProps) {
  const [apiKey, setApiKey] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!apiKey.trim()) {
      setError("API Key를 입력해 주세요.")
      return
    }

    setIsLoading(true)
    setError("")

    try {
      const response = await registerApiKey({
        provider: "gemini",
        apiKey: apiKey.trim(),
      })

      if (response.success) {
        toast.success(response.message, {
          className: "bg-green-600 text-white border-none",
        })
        setApiKey("") // 초기화
        if (onSuccess) onSuccess()
        onOpenChange(false)
      } else {
        setError(response.message || "키 등록에 실패했습니다.")
      }
    } catch (err: any) {
      setError(err.message || "키 등록 중 오류가 발생했습니다.")
    } finally {
      setIsLoading(false)
    }
  }

  // 모달이 닫힐 때 상태 초기화
  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen) {
      setApiKey("")
      setError("")
    }
    onOpenChange(nextOpen)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-136 rounded-xl p-6 shadow-2xl border bg-background">
        <DialogHeader className="flex flex-col gap-2 text-left">
          <DialogTitle className="text-xl font-bold text-foreground flex items-center gap-2">
            <KeyRound className="size-5 text-blue-600" />
            Gemini AI Key 등록
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground leading-relaxed">
            <span className="text-sm">
              현재는 <strong className="text-white">Gemini AI Key</strong> 등록만 지원합니다.
            </span>
            <br />
            추후 ChatGPT(OpenAI) 및 Claude(Anthropic) 모델에 대한 키 등록 기능도 추가될 예정입니다.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-2">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="gemini-api-key" className="text-xs font-semibold text-foreground">
              API Key <span className="text-destructive">*</span>
            </Label>
            <Input
              id="gemini-api-key"
              type="password"
              placeholder="AIxx-xxxxxxxxxxxxxxxxxxxxxxxx"
              value={apiKey}
              onChange={(e) => {
                setApiKey(e.target.value)
                if (error) setError("")
              }}
              disabled={isLoading}
            />
            {error && <span className="text-xs text-destructive">{error}</span>}
          </div>

          <div className="flex justify-end gap-2 mt-2">
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
              className="bg-blue-900 text-white hover:bg-blue-800"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 size-4 animate-spin" />
                  등록 중...
                </>
              ) : (
                "등록하기"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
