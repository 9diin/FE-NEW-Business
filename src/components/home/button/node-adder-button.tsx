import { Button } from "@/components/ui/button"
import { Dot, Plus } from "lucide-react"
import { useCanvas } from "@/context/CanvasContext"
import type { NodeType } from "@/types/canvas"

/** label → NodeType 매핑 */
const LABEL_TO_TYPE: Record<string, NodeType> = {
    "문제인식 (Problem)": "problem",
    "해결방안 (Solution)": "solution",
    "성장전략 (Scale-up)": "scaleup",
    "팀 빌딩 (Team Building)": "team",
    "아이디어 (Idea)": "idea",
}

/** label → 기본 설명 매핑 */
const LABEL_TO_DESCRIPTION: Record<string, string> = {
    "문제인식 (Problem)": "해결하고자 하는 문제를 구체적으로 정의하세요.",
    "해결방안 (Solution)": "문제를 해결하기 위한 핵심 솔루션을 기술하세요.",
    "성장전략 (Scale-up)": "사업 확장을 위한 성장 전략을 수립하세요.",
    "팀 빌딩 (Team Building)": "핵심 역량을 갖춘 팀 구성을 설계하세요.",
    "아이디어 (Idea)": "자유롭게 아이디어를 추가하세요.",
}

export default function NodeAdderButton({ label, color }: { label: string; color: string }) {
    const { addNode } = useCanvas()

    const createNode = (label: string) => {
        const nodeType = LABEL_TO_TYPE[label] || "idea"
        const description = LABEL_TO_DESCRIPTION[label] || "노드 설명을 입력하세요."
        addNode(nodeType, label, description)
    }

    return (
        <Button variant="outline" className="flex items-center justify-between" onClick={() => createNode(label)}>
            <div className="flex items-center gap-2">
                <Dot className={`-mx-5 h-12! w-12! ${color}`} />
                <span className="font-medium">{label}</span>
            </div>
            <Plus className="text-neutral-500" />
        </Button>
    )
}
