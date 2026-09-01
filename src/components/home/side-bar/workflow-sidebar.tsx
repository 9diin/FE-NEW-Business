import React from "react"
import WORKFLOW_TYPES from "@/constants/workflow"
import WorkflowCard from "../card/workflow-card"
import { Card, Separator } from "../../ui"
import { Pin } from "lucide-react"

export default function WorkflowSidebar() {
    return (
        <aside aria-label="워크플로우 메뉴" className="flex h-full w-64 flex-col justify-between">
            <div className="flex flex-col gap-4">
                {WORKFLOW_TYPES.map((workflow, index: number) => {
                    return (
                        <React.Fragment key={workflow.label}>
                            <WorkflowCard {...workflow} />
                            {index !== WORKFLOW_TYPES.length - 1 && <Separator />}
                        </React.Fragment>
                    )
                })}
            </div>
            <Card className="gap-2 p-3">
                <Pin className="h-4 w-4 text-rose-400" fill="oklch(71.2% 0.194 13.428)" />
                <p className="text-xs text-neutral-500">노드 하단 [선 연결] 버튼을 눌러 연관 아이디어를 잇고 AI 구조화를 실행하세요.</p>
            </Card>
        </aside>
    )
}
