import { Card, Button, Badge } from "@/components/ui"
import { AlertCircle, CheckCircle2, ArrowRight, Sparkles, X, FileText } from "lucide-react"

interface PsstRecommendDialogProps {
    isOpen: boolean
    onClose: () => void
    onProceed: () => void
    status: {
        hasProblem: boolean
        hasSolution: boolean
        hasScaleup: boolean
        hasTeam: boolean
        isConnected: boolean
        ideaCount: number
    }
}

export default function PsstRecommendDialog({
    isOpen,
    onClose,
    onProceed,
    status,
}: PsstRecommendDialogProps) {
    if (!isOpen) return null

    const steps = [
        { key: "problem", label: "문제인식 (Problem)", exists: status.hasProblem, color: "text-red-500", bg: "bg-red-500/10 border-red-200 text-red-700 dark:border-red-900 dark:text-red-400" },
        { key: "solution", label: "해결방안 (Solution)", exists: status.hasSolution, color: "text-blue-500", bg: "bg-blue-500/10 border-blue-200 text-blue-700 dark:border-blue-900 dark:text-blue-400" },
        { key: "scaleup", label: "성장전략 (Scale-up)", exists: status.hasScaleup, color: "text-green-500", bg: "bg-green-500/10 border-green-200 text-green-700 dark:border-green-900 dark:text-green-400" },
        { key: "team", label: "팀 빌딩 (Team)", exists: status.hasTeam, color: "text-amber-500", bg: "bg-amber-500/10 border-amber-200 text-amber-700 dark:border-amber-900 dark:text-amber-400" },
    ]

    const completedCount = steps.filter((s) => s.exists).length

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs animate-in fade-in duration-200">
            <Card className="relative w-full max-w-lg border-border/80 bg-card p-6 shadow-2xl">
                {/* 닫기 버튼 */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 rounded-md p-1.5 text-neutral-400 hover:bg-accent hover:text-foreground"
                >
                    <X className="h-4 w-4" />
                </button>

                {/* 헤더 */}
                <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-amber-500/10 text-amber-500">
                        <AlertCircle className="h-5 w-5" />
                    </div>
                    <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2">
                            <h2 className="text-base font-bold text-foreground">PSST 사업계획서 권장사항 안내</h2>
                            <Badge variant="outline" className="text-xs text-amber-600 dark:text-amber-400">
                                권장 연결 {completedCount}/4
                            </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">
                            필수 조건은 아니지만, 핵심 4대 노드가 순서대로 연결되면 더욱 신뢰도 높은 사업계획서가 완성됩니다.
                        </p>
                    </div>
                </div>

                {/* 권장 순서 안내 다이어그램 */}
                <div className="my-4 rounded-lg border border-border/60 bg-muted/40 p-3.5">
                    <div className="mb-2 text-xs font-semibold text-neutral-600 dark:text-neutral-300">
                        📌 권장 연결 프로세스
                    </div>
                    <div className="flex flex-wrap items-center justify-between gap-1 text-[11px]">
                        {steps.map((step, idx) => (
                            <div key={step.key} className="flex items-center gap-1">
                                <span
                                    className={`inline-flex items-center gap-1 rounded-md border px-2 py-1 font-medium ${
                                        step.exists
                                            ? step.bg
                                            : "border-border/60 bg-background/80 text-muted-foreground opacity-60"
                                    }`}
                                >
                                    {step.exists ? (
                                        <CheckCircle2 className="h-3 w-3 text-green-500" />
                                    ) : (
                                        <span className="h-1.5 w-1.5 rounded-full bg-neutral-400" />
                                    )}
                                    {step.label.split(" ")[0]}
                                </span>
                                {idx < steps.length - 1 && (
                                    <ArrowRight className="h-3 w-3 text-muted-foreground/60" />
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* 상태 상세 알림 */}
                <div className="space-y-2 rounded-lg bg-accent/40 p-3 text-xs text-neutral-600 dark:text-neutral-300">
                    <div className="flex items-center gap-2 font-medium">
                        <Sparkles className="h-3.5 w-3.5 text-blue-500" />
                        <span>현재 캔버스 분석 요약</span>
                    </div>
                    <ul className="list-inside list-disc space-y-1 text-xs text-muted-foreground">
                        <li>
                            아이디어 노드: <span className="font-semibold text-foreground">{status.ideaCount}개</span> 도출됨
                        </li>
                        <li>
                            PSST 필수 노드: <span className="font-semibold text-foreground">{completedCount}개 구성됨</span>
                            {completedCount < 4 && " (누락된 노드를 추가하면 구체성이 대폭 향상됩니다)"}
                        </li>
                        <li>
                            노드 연결 상태:{" "}
                            <span className="font-semibold text-foreground">
                                {status.isConnected ? "핵심 연결 완료" : "일부 노드 미연결 (선 연결 권장)"}
                            </span>
                        </li>
                    </ul>
                </div>

                {/* 하단 액션 버튼 */}
                <div className="mt-5 flex items-center justify-end gap-2.5">
                    <Button variant="outline" size="sm" onClick={onClose} className="text-xs">
                        캔버스에서 노드 보완하기
                    </Button>
                    <Button
                        size="sm"
                        onClick={onProceed}
                        className="bg-blue-700 text-xs font-semibold text-white hover:bg-blue-800 dark:bg-blue-600"
                    >
                        <FileText className="mr-1.5 h-3.5 w-3.5" />
                        현재 상태로 바로 사업계획서 도출
                    </Button>
                </div>
            </Card>
        </div>
    )
}
