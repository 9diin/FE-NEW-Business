import { Card, Separator } from "../../ui"
import NodeAdderButton from "../button/node-adder-button"
import { Dot, Lightbulb } from "lucide-react"
import PLANFLOW_TYPES from "@/constants/plan"

interface NodeAdderSidebarProps {
    isOpen?: boolean
}

export default function NodeAdderSidebar({ isOpen = true }: NodeAdderSidebarProps) {
    return (
        <div
            aria-label="노드 추가 및 안내"
            className={`flex h-full w-64 flex-col justify-between overflow-hidden transition-all duration-300 will-change-transform ${
                isOpen ? "translate-x-0 opacity-100" : "pointer-events-none -mr-2 w-0! -translate-x-80 opacity-0"
            }`}
        >
            <div className="flex w-full flex-col gap-4">
                <div className="flex flex-col gap-0.5">
                    <span className="font-semibold">노드 추가하기</span>
                    <span className="text-xs text-neutral-500">영역별 아이디어를 생성하여 캔버스에 배치하세요.</span>
                </div>
                <div className="flex flex-col gap-2">
                    {PLANFLOW_TYPES.map((planflow) => {
                        return <NodeAdderButton key={planflow.label} {...planflow} />
                    })}
                </div>
                <Separator />
                <div>
                    <span className="font-semibold text-neutral-400">노드 연결 방법</span>
                    <div className="-ml-2">
                        <div className="flex items-center">
                            <Dot className="text-neutral-500" />
                            <div className="flex items-center gap-1">
                                <span className="text-xs text-neutral-500">노드 하단</span>
                                <span className="text-xs text-blue-500">[+]</span>
                                <span className="text-xs text-neutral-500">연동 버튼 클릭</span>
                            </div>
                        </div>
                        <div className="flex items-center">
                            <Dot className="text-neutral-500" />
                            <span className="text-xs text-neutral-500">연결하고 싶은 다른 노드를 클릭하면 선 연결</span>
                        </div>
                        <div className="flex items-center">
                            <Dot className="text-neutral-500" />
                            <span className="text-xs text-neutral-500">연결선을 클릭하면 삭제 가능</span>
                        </div>
                    </div>
                </div>
            </div>
            <Card className="gap-2 p-3">
                <Lightbulb className="h-4 w-4 text-yellow-400" fill="oklch(85.2% 0.199 91.936)" />
                <p className="text-xs text-neutral-500">노드가 많을 수록 연결이 촘촘할 수록 AI가 작성하는 사업계획서의 논리가 구체화 됩니다.</p>
            </Card>
        </div>
    )
}
