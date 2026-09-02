import { Card, Button, Badge } from "@/components/ui"
import { X, Check, Copy, Download, Sparkles, FileText } from "lucide-react"
import { useState } from "react"
import type { CanvasNode } from "@/types/canvas"

interface PsstResultDialogProps {
    isOpen: boolean
    onClose: () => void
    nodes: CanvasNode[]
}

export default function PsstResultDialog({ isOpen, onClose, nodes }: PsstResultDialogProps) {
    const [copied, setCopied] = useState(false)

    if (!isOpen) return null

    // 캔버스 노드 정보 추출
    const ideaNodes = nodes.filter((n) => n.type === "idea")
    const problemNodes = nodes.filter((n) => n.type === "problem")
    const solutionNodes = nodes.filter((n) => n.type === "solution")
    const scaleupNodes = nodes.filter((n) => n.type === "scaleup")
    const teamNodes = nodes.filter((n) => n.type === "team")

    const mainIdea = ideaNodes[0]?.title || "생각 정리 기반 AI 사업계획서 자동 생성 SaaS"

    const psstContent = {
        problem: {
            title: "1. 문제인식 (Problem)",
            summary: problemNodes.length > 0 ? problemNodes.map((n) => n.title).join(", ") : "창업 초기 서류 작성 및 PSST 표준 양식 구조화의 극심한 시간 소모",
            desc: problemNodes[0]?.description || "예비 및 초기 창업자들은 아이디어를 구체적인 지원사업 양식에 맞춰 구조화하는 데 주당 20시간 이상을 허비하고 있어 제품 개발 및 시장 검증에 집중하지 못함.",
        },
        solution: {
            title: "2. 해결방안 (Solution)",
            summary: solutionNodes.length > 0 ? solutionNodes.map((n) => n.title).join(", ") : "마인드맵 캔버스 기반 직관적 아이디어 연결 및 AI 실시간 PSST 자동 매핑",
            desc: solutionNodes[0]?.description || "시각적 노드 연결형 마인드맵 인터페이스를 통해 생각의 흐름을 자유롭게 구성하면, LLM 에이전트가 각 요소를 PSST 표준 체계로 즉각 자동 구조화 및 문장화.",
        },
        scaleup: {
            title: "3. 성장전략 (Scale-up)",
            summary: scaleupNodes.length > 0 ? scaleupNodes.map((n) => n.title).join(", ") : "초기 스타트업 지원사업 데이터베이스 연계 및 기관/대학 구독형 B2B 확장",
            desc: scaleupNodes[0]?.description || "1단계: 예비창업패키지/초기창업패키지 합격자 데이터 기반 템플릿 제공 → 2단계: 창업보육센터 및 액셀러레이터 SaaS 구독 연계 모델 확장.",
        },
        team: {
            title: "4. 팀 구성 (Team Building)",
            summary: teamNodes.length > 0 ? teamNodes.map((n) => n.title).join(", ") : "AI 엔지니어 및 풀스택 개발자, 정부지원사업 심사위원 출신 비즈니스 리더",
            desc: teamNodes[0]?.description || "AI/프론트엔드 핵심 개발진과 지원사업 평가위원 경험을 보유한 창업 기획 인력의 결합으로 높은 사업 실행력 확보.",
        },
    }

    const fullDocumentText = `[PSST 사업계획서 요약본]
프로젝트: ${mainIdea}
도출 일시: ${new Date().toLocaleDateString("ko-KR")}

1. 문제인식 (Problem)
- 핵심 문제: ${psstContent.problem.summary}
- 상세 내용: ${psstContent.problem.desc}

2. 해결방안 (Solution)
- 핵심 솔루션: ${psstContent.solution.summary}
- 상세 내용: ${psstContent.solution.desc}

3. 성장전략 (Scale-up)
- 시장 확장 및 비즈니스 모델: ${psstContent.scaleup.summary}
- 상세 내용: ${psstContent.scaleup.desc}

4. 팀 구성 (Team)
- 팀 구성 및 역량: ${psstContent.team.summary}
- 상세 내용: ${psstContent.team.desc}
`

    const handleCopy = () => {
        navigator.clipboard.writeText(fullDocumentText)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs animate-in fade-in duration-200">
            <Card className="relative flex max-h-[90vh] w-full max-w-2xl flex-col border-border/80 bg-card p-6 shadow-2xl">
                {/* 닫기 버튼 */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 rounded-md p-1.5 text-neutral-400 hover:bg-accent hover:text-foreground"
                >
                    <X className="h-4 w-4" />
                </button>

                {/* 헤더 */}
                <div className="flex items-start gap-3 border-b border-border/60 pb-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-500/10 text-blue-600">
                        <FileText className="h-5 w-5" />
                    </div>
                    <div>
                        <div className="flex items-center gap-2">
                            <h2 className="text-base font-bold text-foreground">AI 도출 PSST 표준 사업계획서</h2>
                            <Badge className="bg-blue-600 text-[10px] text-white">생성 완료</Badge>
                        </div>
                        <p className="mt-0.5 text-xs text-muted-foreground">
                            캔버스에 연결된 노드 분석을 기반으로 최적화된 사업계획서 초안입니다.
                        </p>
                    </div>
                </div>

                {/* 문서 본문 스크롤 영역 */}
                <div className="my-4 flex-1 space-y-4 overflow-y-auto pr-1">
                    {/* 프로젝트명 */}
                    <div className="rounded-lg border border-border/60 bg-muted/30 p-3">
                        <span className="text-[11px] font-semibold text-muted-foreground">비즈니스 핵심 명칭</span>
                        <div className="text-sm font-bold text-foreground">{mainIdea}</div>
                    </div>

                    {/* Problem */}
                    <div className="rounded-lg border border-red-500/20 bg-red-500/5 p-3.5 dark:bg-red-950/20">
                        <div className="flex items-center gap-2">
                            <Badge className="bg-red-500 text-[10px] text-white">Problem</Badge>
                            <span className="text-xs font-bold text-foreground">{psstContent.problem.title}</span>
                        </div>
                        <p className="mt-2 text-xs font-semibold text-foreground">{psstContent.problem.summary}</p>
                        <p className="mt-1 text-xs text-muted-foreground">{psstContent.problem.desc}</p>
                    </div>

                    {/* Solution */}
                    <div className="rounded-lg border border-blue-500/20 bg-blue-500/5 p-3.5 dark:bg-blue-950/20">
                        <div className="flex items-center gap-2">
                            <Badge className="bg-blue-500 text-[10px] text-white">Solution</Badge>
                            <span className="text-xs font-bold text-foreground">{psstContent.solution.title}</span>
                        </div>
                        <p className="mt-2 text-xs font-semibold text-foreground">{psstContent.solution.summary}</p>
                        <p className="mt-1 text-xs text-muted-foreground">{psstContent.solution.desc}</p>
                    </div>

                    {/* Scale-up */}
                    <div className="rounded-lg border border-green-500/20 bg-green-500/5 p-3.5 dark:bg-green-950/20">
                        <div className="flex items-center gap-2">
                            <Badge className="bg-green-500 text-[10px] text-white">Scale-up</Badge>
                            <span className="text-xs font-bold text-foreground">{psstContent.scaleup.title}</span>
                        </div>
                        <p className="mt-2 text-xs font-semibold text-foreground">{psstContent.scaleup.summary}</p>
                        <p className="mt-1 text-xs text-muted-foreground">{psstContent.scaleup.desc}</p>
                    </div>

                    {/* Team */}
                    <div className="rounded-lg border border-amber-500/20 bg-amber-500/5 p-3.5 dark:bg-amber-950/20">
                        <div className="flex items-center gap-2">
                            <Badge className="bg-amber-500 text-[10px] text-white">Team</Badge>
                            <span className="text-xs font-bold text-foreground">{psstContent.team.title}</span>
                        </div>
                        <p className="mt-2 text-xs font-semibold text-foreground">{psstContent.team.summary}</p>
                        <p className="mt-1 text-xs text-muted-foreground">{psstContent.team.desc}</p>
                    </div>
                </div>

                {/* 하단 버튼 */}
                <div className="flex items-center justify-between border-t border-border/60 pt-4">
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <Sparkles className="h-3.5 w-3.5 text-blue-500" />
                        <span>캔버스 노드 {nodes.length}개 분석 반영됨</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" onClick={handleCopy} className="text-xs">
                            {copied ? <Check className="mr-1 h-3.5 w-3.5 text-green-500" /> : <Copy className="mr-1 h-3.5 w-3.5" />}
                            {copied ? "복사 완료" : "전문 복사"}
                        </Button>
                        <Button
                            size="sm"
                            onClick={() => {
                                const blob = new Blob([fullDocumentText], { type: "text/plain;charset=utf-8" })
                                const url = URL.createObjectURL(blob)
                                const a = document.createElement("a")
                                a.href = url
                                a.download = `PSST_사업계획서_${new Date().toISOString().slice(0, 10)}.txt`
                                a.click()
                            }}
                            className="bg-blue-700 text-xs font-semibold text-white hover:bg-blue-800 dark:bg-blue-600"
                        >
                            <Download className="mr-1.5 h-3.5 w-3.5" />
                            다운로드
                        </Button>
                    </div>
                </div>
            </Card>
        </div>
    )
}
