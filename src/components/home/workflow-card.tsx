import { Button } from "../ui"
import { Plus } from "lucide-react"

interface WorkflowCardProps {
    title: string
    description: string
    label: string
    icon: string
}

export default function WorkflowCard({ title, description, label }: WorkflowCardProps) {
    return (
        <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-0.5">
                <span className="font-semibold text-neutral-400">{title}</span>
                <p className="text-xs text-neutral-500">{description}</p>
            </div>
            <Button className="bg-blue-800 font-semibold text-white hover:bg-blue-800/90">
                <Plus />
                {label}
            </Button>
        </div>
    )
}
