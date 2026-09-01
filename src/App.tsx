import { AppHeader } from "./components/common"
import { NodeButton, WorkflowCard } from "./components/home"
import { Separator, Card } from "./components/ui"
import { ChevronsRight, Dot, Lightbulb, Pin, Plus } from "lucide-react"

import WORKFLOW_TYPES from "./constants/workflow"
import PLANFLOW_TYPES from "./constants/plan"

export function App() {
    return (
        <div className="flex h-screen flex-col p-4">
            <AppHeader />
            <main className="flex h-full items-center gap-4 py-4">
                {/* 야이디어 생성(도출) / AI 자동 구조화 / PSST 사업계획서 도출 영역 */}
                <aside className="flex h-full w-64 flex-col justify-between">
                    <div className="flex flex-col gap-4">
                        {WORKFLOW_TYPES.map((workflow, index: number) => {
                            return (
                                <>
                                    <WorkflowCard key={workflow.label} {...workflow} />
                                    {index !== WORKFLOW_TYPES.length - 1 && <Separator />}
                                </>
                            )
                        })}
                    </div>
                    <Card className="gap-2 p-3">
                        <Pin className="h-4 w-4 text-rose-400" fill="oklch(71.2% 0.194 13.428)" />
                        <p className="text-xs text-neutral-500">노드 하단 [선 연결] 버튼을 눌러 연관 아이디어를 잇고 AI 구조화를 실행하세요.</p>
                    </Card>
                </aside>
                <ChevronsRight className="text-neutral-500" />
                {/* 노드 추가하기 */}
                <div className="flex h-full w-64 flex-col justify-between">
                    <div className="flex w-full flex-col gap-4">
                        <div className="flex flex-col gap-0.5">
                            <span className="font-semibold">노드 추가하기</span>
                            <span className="text-xs text-neutral-500">영역별 아이디어를 생성하여 캔버스에 배치하세요.</span>
                        </div>
                        <div className="flex flex-col gap-2">
                            {PLANFLOW_TYPES.map((planflow) => {
                                return <NodeButton key={planflow.label} {...planflow} />
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
                {/* 캔버스 영역 */}
                <div className="h-full flex-1 rounded-md bg-card/50"></div>
            </main>
        </div>
    )
}

export default App
