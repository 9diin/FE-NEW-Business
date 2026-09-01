import { AppHeader } from "./components/common"
import { NodeButton, WorkflowCard } from "./components/home"
import { Separator } from "./components/ui"
import { ChevronsRight } from "lucide-react"

import WORKFLOW_TYPES from "./constants/workflow"
import PLANFLOW_TYPES from "./constants/plan"

export function App() {
    return (
        <div className="flex flex-col p-4">
            <AppHeader />
            <main className="flex gap-4 py-4">
                {/* 야이디어 생성(도출) / AI 자동 구조화 / PSST 사업계획서 도출 영역 */}
                <aside className="flex w-64 flex-col gap-4">
                    {WORKFLOW_TYPES.map((workflow, index: number) => {
                        return (
                            <>
                                <WorkflowCard key={workflow.label} {...workflow} />
                                {index !== WORKFLOW_TYPES.length - 1 && <Separator />}
                            </>
                        )
                    })}
                </aside>
                <ChevronsRight className="text-neutral-500" />
                {/* 노드 추가하기 */}
                <div className="flex flex-col gap-4">
                    <div className="flex flex-col gap-0.5">
                        <span className="font-semibold">노드 추가하기</span>
                        <span className="text-xs text-neutral-500">영역별 아이디어를 생성하여 캔버스에 배치하세요.</span>
                    </div>

                    <div className="flex flex-col gap-2">
                        {PLANFLOW_TYPES.map((planflow) => {
                            return <NodeButton key={planflow.label} {...planflow} />
                        })}
                    </div>

                    <div></div>
                </div>
            </main>
        </div>
    )
}

export default App
