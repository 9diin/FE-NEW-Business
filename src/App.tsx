import { Dot, Plus, ChevronsRight } from "lucide-react"
import { AppHeader } from "./components/common"
import { NodeButton, WorkflowCard } from "./components/home"
import { Separator } from "./components/ui"
import { Button } from "./components/ui/button"

import WORKFLOW_TYPES from "./constants/workflow"
import PLANFLOW_TYPES from "./constants/plan"

export function App() {
    return (
        <div className="flex flex-col p-4">
            <AppHeader />
            <main className="flex gap-4 p-4">
                <aside className="flex w-64 flex-col gap-4">
                    {WORKFLOW_TYPES.map((workflow, index: number) => {
                        return (
                            <>
                                <WorkflowCard key={workflow.label} {...workflow} />
                                {index !== WORKFLOW_TYPES.length - 1 && <Separator />}
                            </>
                        )
                    })}
                    {/* 야이디어 생성(도출) 영역 */}
                    {/* <WorkflowCard /> */}

                    {/* AI 자동 구조화 영역 */}
                    {/* <WorkflowCard /> */}

                    {/* PSST 사업계획서 도출 영역 */}
                    {/* <WorkflowCard /> */}
                </aside>
                <ChevronsRight className="text-neutral-500" />
                <div className="flex flex-col gap-4">
                    <div className="flex flex-col gap-0.5">
                        <span className="font-semibold">노드 추가하기</span>
                        <span className="text-xs text-neutral-500">영역별 아이디어를 생성하여 캔버스에 배치하세요.</span>
                    </div>

                    <div className="flex flex-col gap-2">
                        {PLANFLOW_TYPES.map((planflow) => {
                            return <NodeButton key={planflow.label} {...planflow} />
                        })}

                        <Button variant="outline" className="flex items-center justify-between" onClick={() => console.log("문제점 (Problem) 버튼 클릭")}>
                            <div className="flex items-center gap-2">
                                <Dot className="-mx-5 h-12! w-12! text-red-500" />
                                <span className="font-medium">문제점 (Problem)</span>
                            </div>
                            <Plus className="text-neutral-500" />
                        </Button>
                        {/* <Button variant="outline" className="flex items-center justify-between" onClick={() => console.log("해결책 (Solution) 버튼 클릭")}>
                            <div className="flex items-center gap-2">
                                <Dot className="-mx-5 h-12! w-12! text-blue-500" />
                                <span className="font-medium">해결책 (Solution)</span>
                            </div>
                            <Plus className="text-neutral-500" />
                        </Button>
                        <Button variant="outline" className="flex items-center justify-between" onClick={() => console.log("성장전략 (Scale-up) 버튼 클릭")}>
                            <div className="flex items-center gap-2">
                                <Dot className="-mx-5 h-12! w-12! text-green-500" />
                                <span className="font-medium">성장전략 (Scale-up)</span>
                            </div>
                            <Plus className="text-neutral-500" />
                        </Button>
                        <Button
                            variant="outline"
                            className="flex items-center justify-between"
                            onClick={() => console.log("팀 구성 (Team-Building) 버튼 클릭")}
                        >
                            <div className="flex items-center gap-2">
                                <Dot className="-mx-5 h-12! w-12! text-amber-500" />
                                <span className="font-medium">팀 구성 (Team-Building)</span>
                            </div>
                            <Plus className="text-neutral-500" />
                        </Button>
                        <Button variant="outline" className="flex items-center justify-between" onClick={() => console.log("아이디어 (Idea) 버튼 클릭")}>
                            <div className="flex items-center gap-2">
                                <Dot className="-mx-5 h-12! w-12! text-purple-500" />
                                <span className="font-medium">아이디어 (Idea)</span>
                            </div>
                            <Plus className="text-neutral-500" />
                        </Button> */}
                    </div>

                    <div></div>
                </div>
            </main>
        </div>
    )
}

export default App
