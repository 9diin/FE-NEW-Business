import { Button } from "../../ui"
import { Brain, Plus, WandSparkles } from "lucide-react"
import { useCanvas } from "@/context/CanvasContext"

interface WorkflowCardProps {
    title: string
    description: string
    label: string
    icon: string
}

export default function WorkflowCard({ title, description, label, icon }: WorkflowCardProps) {
    const { addNode } = useCanvas()

    const handleClick = () => {
        if (label === "아이디어 생성") {
            addNode("idea", "새로운 아이디어", "아이디어를 자유롭게 입력하세요. 노드를 연결하여 구조화할 수 있습니다.")
        }
    }

    return (
        <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-0.5">
                <span className="font-semibold text-neutral-400">{title}</span>
                <p className="text-xs text-neutral-500">{description}</p>
            </div>
            <Button className="bg-blue-800 font-semibold text-white hover:bg-blue-800/90" onClick={handleClick}>
                {/* 수정 요망 */}
                {icon === "plus" && <Plus />}
                {icon === "brain" && <Brain />}
                {icon === "wand-sparkles" && <WandSparkles />}
                {label}
            </Button>
        </div>
    )
}
