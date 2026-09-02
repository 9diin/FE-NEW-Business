import { Card, Separator, Button } from "../../ui"
import NodeAdderButton from "../button/node-adder-button"
import { Dot, Lightbulb, ChevronDown, ChevronUp, PlusCircle } from "lucide-react"
import PLANFLOW_TYPES from "@/constants/plan"

interface NodeAdderSidebarProps {
    isOpen?: boolean
    onToggle?: () => void
}

export default function NodeAdderSidebar({ isOpen = true, onToggle }: NodeAdderSidebarProps) {
    return (
        <Card className="w-64 border-border/80 bg-card/95 p-3 shadow-md backdrop-blur-xs transition-all duration-300">
            {/* 패널 헤더 & 토글 버튼 */}
            <div
                className="flex cursor-pointer items-center justify-between"
                onClick={onToggle}
            >
                <div className="flex items-center gap-1.5">
                    <PlusCircle className="h-4 w-4 text-blue-500" />
                    <span className="text-xs font-bold text-foreground">노드 추가하기</span>
                </div>
                <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0 text-muted-foreground hover:text-foreground"
                    onClick={(e) => {
                        e.stopPropagation()
                        onToggle?.()
                    }}
                >
                    {isOpen ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
                </Button>
            </div>

            {/* 접었을 때 간단한 안내 */}
            {!isOpen && (
                <p className="mt-1 text-[11px] text-muted-foreground truncate">
                    클릭하여 5개 노드 생성 메뉴 열기
                </p>
            )}

            {/* 펼쳐졌을 때 전체 메뉴 내용 */}
            {isOpen && (
                <div className="mt-2.5 flex flex-col gap-3 animate-in fade-in duration-200">
                    <span className="text-[11px] text-neutral-500">
                        영역별 아이디어를 생성하여 캔버스에 배치하세요.
                    </span>

                    {/* 5대 노드 추가 버튼들 */}
                    <div className="flex flex-col gap-1.5">
                        {PLANFLOW_TYPES.map((planflow) => {
                            return <NodeAdderButton key={planflow.label} {...planflow} />
                        })}
                    </div>

                    <Separator />

                    {/* 노드 연결 방법 가이드 */}
                    <div className="space-y-1">
                        <span className="text-[11px] font-semibold text-neutral-400">노드 연결 방법</span>
                        <div className="-ml-1 space-y-0.5 text-[11px] text-neutral-500">
                            <div className="flex items-center">
                                <Dot className="h-4 w-4 text-neutral-400 shrink-0" />
                                <span>
                                    노드 하단 <span className="font-semibold text-blue-500">[노드 연결]</span> 클릭
                                </span>
                            </div>
                            <div className="flex items-center">
                                <Dot className="h-4 w-4 text-neutral-400 shrink-0" />
                                <span>연결 대상 노드 클릭 시 선 연결</span>
                            </div>
                            <div className="flex items-center">
                                <Dot className="h-4 w-4 text-neutral-400 shrink-0" />
                                <span>연결선 클릭 시 삭제 가능</span>
                            </div>
                        </div>
                    </div>

                    {/* 팁 박스 */}
                    <div className="flex items-start gap-1.5 rounded-md bg-amber-500/10 p-2 text-[11px] text-neutral-600 dark:text-neutral-300">
                        <Lightbulb className="h-3.5 w-3.5 shrink-0 text-amber-500 mt-0.5" fill="currentColor" />
                        <p className="leading-tight">
                            노드가 많고 연결이 촘촘할수록 더욱 완성도 높은 사업계획서가 작성됩니다.
                        </p>
                    </div>
                </div>
            )}
        </Card>
    )
}
