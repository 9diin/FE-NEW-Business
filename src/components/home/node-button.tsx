import { Button } from "@/components/ui/button"
import { Dot, Plus } from "lucide-react"

export default function NodeButton({ label, color }: { label: string; color: string }) {
    const createNode = (label: string) => {
        // const res = await axios.post("http://localhost:8080/api/nodes", { label })

        if (label === "문제인식 (Problem)") {
            console.log("문제점 (Problem) 버튼 클릭")
        } else if (label === "해결방안 (Solution)") {
            console.log("해결책 (Solution) 버튼 클릭")
        } else if (label === "성장전략 (Scale-up)") {
            console.log("성장전략 (Scale-up) 버튼 클릭")
        } else if (label === "팀 빌딩 (Team Building)") {
            console.log("팀 빌딩 (Team Building) 버튼 클릭")
        } else if (label === "아이디어 (Idea)") {
            console.log("아이디어 (Idea) 버튼 클릭")
        } else {
            console.log(`${label} 버튼 클릭`)
        }
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
