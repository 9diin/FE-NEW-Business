import { Card, Button, Badge } from "@/components/ui"
import { Brain, X, Sparkles, ArrowRight, PlusCircle } from "lucide-react"
import { useCanvas } from "@/context/CanvasContext"
import type { CanvasNode } from "@/types/canvas"

interface AiStructureDialogProps {
    isOpen: boolean
    onClose: () => void
    nodes: CanvasNode[]
}

export default function AiStructureDialog({ isOpen, onClose, nodes }: AiStructureDialogProps) {
    const { addNode } = useCanvas()

    if (!isOpen) return null

    const ideaNodes = nodes.filter((n) => n.type === "idea")
    const mainIdea = ideaNodes[0]?.title || "신규 비즈니스 아이디어"

    const suggestedNodes = [
        { type: "problem" as const, title: `[문제인식] ${mainIdea}의 사용자 페인포인트`, desc: "기존 솔루션 부재로 인한 시간/비용 낭비 및 사용자 불편" },
        { type: "solution" as const, title: `[해결방안] AI 기반 자동화 솔루션`, desc: "핵심 기술 알고리즘과 직관적 워크플로우를 통한 문제 해결" },
        { type: "scaleup" as const, title: `[성장전략] 초기 B2C 확보 및 B2B 확장`, desc: "커뮤니티 타깃 초기 고객 획득 및 기관 파트너십 구축" },
        { type: "team" as const, title: `[팀빌딩] AI/풀스택 전문 팀 구성`, desc: "핵심 제품 개발 인력 및 시장 진입(GTM) 전략 전문가" },
    ]

    const handleApplyAll = () => {
        suggestedNodes.forEach((item) => {
            // 아직 없는 타입 위주로 추가
            const exists = nodes.some((n) => n.type === item.type)
            if (!exists) {
                addNode(item.type, item.title, item.desc)
            }
        })
        onClose()
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs animate-in fade-in duration-200">
            <Card className="relative flex max-h-[90vh] w-full max-w-lg flex-col border-border/80 bg-card p-6 shadow-2xl">
                {/* 닫기 버튼 */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 rounded-md p-1.5 text-neutral-400 hover:bg-accent hover:text-foreground"
                >
                    <X className="h-4 w-4" />
                </button>

                {/* 헤더 */}
                <div className="flex items-start gap-3 border-b border-border/60 pb-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-violet-500/10 text-violet-600">
                        <Brain className="h-5 w-5" />
                    </div>
                    <div>
                        <div className="flex items-center gap-2">
                            <h2 className="text-base font-bold text-foreground">AI 아이디어 논리 구조화</h2>
                            <Badge className="bg-violet-600 text-[10px] text-white">분석 완료</Badge>
                        </div>
                        <p className="mt-0.5 text-xs text-muted-foreground">
                            도출된 아이디어 <span className="font-semibold text-foreground">"{mainIdea}"</span>를 기반으로 PSST 핵심 구조를 제안합니다.
                        </p>
                    </div>
                </div>

                {/* 추천 구조화 목록 */}
                <div className="my-4 flex-1 space-y-2.5 overflow-y-auto pr-1">
                    <div className="text-xs font-semibold text-neutral-600 dark:text-neutral-300">
                        ⚡ AI가 도출한 4단계 핵심 구성
                    </div>

                    {suggestedNodes.map((s) => {
                        const isAlreadyPresent = nodes.some((n) => n.type === s.type)
                        return (
                            <div
                                key={s.type}
                                className="flex items-start justify-between gap-3 rounded-lg border border-border/60 bg-muted/40 p-3"
                            >
                                <div className="space-y-1">
                                    <div className="flex items-center gap-1.5">
                                        <span className="text-xs font-bold text-foreground">{s.title}</span>
                                        {isAlreadyPresent && (
                                            <Badge variant="outline" className="text-[10px] text-green-600">
                                                이미 존재
                                            </Badge>
                                        )}
                                    </div>
                                    <p className="text-[11px] text-muted-foreground">{s.desc}</p>
                                </div>
                                {!isAlreadyPresent && (
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        className="shrink-0 text-xs"
                                        onClick={() => addNode(s.type, s.title, s.desc)}
                                    >
                                        <PlusCircle className="mr-1 h-3 w-3" />
                                        추가
                                    </Button>
                                )}
                            </div>
                        )
                    })}
                </div>

                {/* 하단 액션 버튼 */}
                <div className="flex items-center justify-between border-t border-border/60 pt-4">
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Sparkles className="h-3.5 w-3.5 text-violet-500" />
                        <span>생성 후 노드를 드래그하여 연결하세요</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" onClick={onClose} className="text-xs">
                            닫기
                        </Button>
                        <Button
                            size="sm"
                            onClick={handleApplyAll}
                            className="bg-violet-700 text-xs font-semibold text-white hover:bg-violet-800 dark:bg-violet-600"
                        >
                            미보유 노드 일괄 생성
                            <ArrowRight className="ml-1 h-3.5 w-3.5" />
                        </Button>
                    </div>
                </div>
            </Card>
        </div>
    )
}
