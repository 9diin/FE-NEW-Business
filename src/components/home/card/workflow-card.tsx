import { Button } from "../../ui"
import { Brain, Plus, WandSparkles } from "lucide-react"

interface WorkflowCardProps {
    title: string
    description: string
    label: string
    icon: string
}

export default function WorkflowCard({ title, description, label, icon }: WorkflowCardProps) {
    return (
        <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-0.5">
                <span className="font-semibold text-neutral-400">{title}</span>
                <p className="text-xs text-neutral-500">{description}</p>
            </div>
            <Button className="bg-blue-800 font-semibold text-white hover:bg-blue-800/90">
                {/* 수정 요망 */}
                {icon === "plus" && <Plus />}
                {icon === "brain" && <Brain />}
                {icon === "wand-sparkles" && <WandSparkles />}
                {label}
            </Button>
        </div>
    )
}
