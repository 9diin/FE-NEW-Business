import { useState } from "react"
import { Button, Badge } from "../../ui"
import { Brain, Plus, WandSparkles, AlertCircle, CheckCircle2 } from "lucide-react"
import { useCanvas } from "@/context/CanvasContext"
import PsstRecommendDialog from "../modal/psst-recommend-dialog"
import PsstResultDialog from "../modal/psst-result-dialog"
import AiStructureDialog from "../modal/ai-structure-dialog"

interface WorkflowCardProps {
    title: string
    description: string
    label: string
    icon: string
}

export default function WorkflowCard({ title, description, label, icon }: WorkflowCardProps) {
    const { addNode, nodes, connections } = useCanvas()

    const [isAiModalOpen, setIsAiModalOpen] = useState(false)
    const [isRecommendOpen, setIsRecommendOpen] = useState(false)
    const [isResultOpen, setIsResultOpen] = useState(false)

    // 아이디어 노드 존재 여부
    const ideaNodes = nodes.filter((n) => n.type === "idea")
    const hasIdea = ideaNodes.length > 0

    // PSST 핵심 4대 노드 존재 여부
    const hasProblem = nodes.some((n) => n.type === "problem")
    const hasSolution = nodes.some((n) => n.type === "solution")
    const hasScaleup = nodes.some((n) => n.type === "scaleup")
    const hasTeam = nodes.some((n) => n.type === "team")
    const psstCount = [hasProblem, hasSolution, hasScaleup, hasTeam].filter(Boolean).length

    // 노드 간 연결 형성 여부 (최소 1개 이상의 연결선 또는 4개 노드 상호 연결)
    const isConnected = connections.length >= 2

    // 권장 조건 충족 여부 (4대 노드 모두 구비 + 연결 존재)
    const isFullyRecommended = psstCount === 4 && connections.length >= 3

    // 활성화 여부 계산
    const isIdeaStep = label === "아이디어 생성"
    const isAiStep = label === "AI 아이디어 구조화"
    const isPsstStep = label === "PSST 사업계획서 도출"

    const isDisabled = (isAiStep || isPsstStep) && !hasIdea

    const handleClick = () => {
        if (isDisabled) return

        if (isIdeaStep) {
            addNode("idea", "새로운 아이디어", "아이디어를 자유롭게 입력하세요. 노드를 연결하여 구조화할 수 있습니다.")
        } else if (isAiStep) {
            setIsAiModalOpen(true)
        } else if (isPsstStep) {
            if (isFullyRecommended) {
                // 이미 완전하게 연결된 경우 바로 결과 모달 오픈
                setIsResultOpen(true)
            } else {
                // 권장 조건(4대 노드 연결)이 미흡한 경우 권장사항 안내 모달 표시
                setIsRecommendOpen(true)
            }
        }
    }

    const handleProceedPsst = () => {
        setIsRecommendOpen(false)
        setIsResultOpen(true)
    }

    return (
        <>
            <div className="flex flex-col gap-3">
                <div className="flex flex-col gap-0.5">
                    <div className="flex items-center justify-between">
                        <span className="font-semibold text-neutral-400">{title}</span>
                        {isPsstStep && hasIdea && (
                            <Badge
                                variant="outline"
                                className={`text-[10px] px-1.5 py-0 h-4 ${
                                    isFullyRecommended
                                        ? "border-green-500/50 text-green-600 bg-green-500/10"
                                        : "border-amber-500/50 text-amber-600 bg-amber-500/10"
                                }`}
                            >
                                {isFullyRecommended ? "권장 충족" : `권장 ${psstCount}/4`}
                            </Badge>
                        )}
                    </div>
                    <p className="text-xs text-neutral-500">{description}</p>
                </div>

                <div className="relative">
                    <Button
                        disabled={isDisabled}
                        className={`w-full font-semibold transition-all ${
                            isDisabled
                                ? "cursor-not-allowed bg-neutral-200 text-neutral-400 opacity-60 dark:bg-neutral-800 dark:text-neutral-600"
                                : isPsstStep
                                  ? "bg-blue-700 text-white shadow-sm hover:bg-blue-800 active:scale-[0.99]"
                                  : isAiStep
                                    ? "bg-violet-700 text-white shadow-sm hover:bg-violet-800 active:scale-[0.99]"
                                    : "bg-blue-800 text-white hover:bg-blue-800/90 active:scale-[0.99]"
                        }`}
                        onClick={handleClick}
                    >
                        {icon === "plus" && <Plus className="h-4 w-4 mr-1.5" />}
                        {icon === "brain" && <Brain className="h-4 w-4 mr-1.5" />}
                        {icon === "wand-sparkles" && <WandSparkles className="h-4 w-4 mr-1.5" />}
                        {label}
                    </Button>

                    {/* 비활성화 상태 안내 문구 */}
                    {isDisabled && (
                        <div className="mt-1.5 flex items-center gap-1 text-[11px] text-neutral-400 dark:text-neutral-500">
                            <AlertCircle className="h-3 w-3 shrink-0" />
                            <span>아이디어 노드가 1개 이상 필요합니다</span>
                        </div>
                    )}

                    {/* PSST 도출 권장사항 인디케이터 (활성화 시) */}
                    {isPsstStep && !isDisabled && !isFullyRecommended && (
                        <div className="mt-1.5 flex items-center gap-1 text-[11px] text-amber-600 dark:text-amber-400">
                            <AlertCircle className="h-3 w-3 shrink-0" />
                            <span>Problem→Solution→Scale-up→Team 연결 권장</span>
                        </div>
                    )}
                    {isPsstStep && !isDisabled && isFullyRecommended && (
                        <div className="mt-1.5 flex items-center gap-1 text-[11px] text-green-600 dark:text-green-400">
                            <CheckCircle2 className="h-3 w-3 shrink-0" />
                            <span>PSST 핵심 4대 노드 연결 완료</span>
                        </div>
                    )}
                </div>
            </div>

            {/* AI 아이디어 구조화 모달 */}
            <AiStructureDialog
                isOpen={isAiModalOpen}
                onClose={() => setIsAiModalOpen(false)}
                nodes={nodes}
            />

            {/* PSST 권장사항 안내 모달 */}
            <PsstRecommendDialog
                isOpen={isRecommendOpen}
                onClose={() => setIsRecommendOpen(false)}
                onProceed={handleProceedPsst}
                status={{
                    hasProblem,
                    hasSolution,
                    hasScaleup,
                    hasTeam,
                    isConnected,
                    ideaCount: ideaNodes.length,
                }}
            />

            {/* PSST 완성 사업계획서 결과 모달 */}
            <PsstResultDialog
                isOpen={isResultOpen}
                onClose={() => setIsResultOpen(false)}
                nodes={nodes}
            />
        </>
    )
}
