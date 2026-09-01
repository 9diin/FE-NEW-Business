import { Badge, Button } from "../ui"
import { Key, Workflow } from "lucide-react"

export default function AppHeader() {
    return (
        <header className="flex w-full items-center justify-between">
            {/* 로고 영역 */}
            <div className="flex items-center gap-2">
                <Button size="icon" className="bg-blue-900/50 text-white hover:bg-blue-900/50">
                    <Workflow />
                </Button>
                <div className="flex flex-col gap-0">
                    <div className="flex items-center gap-2">
                        <span className="text-base font-bold">NODE-BIZ</span>
                        <Badge className="rounded-sm border border-blue-900/30 bg-blue-900/50 text-[10px] text-white">AI PSST</Badge>
                    </div>
                    <span className="text-xs text-neutral-500">노드 연결 기반 사업계획서 자동 도출 플랫폼</span>
                </div>
            </div>
            {/* 메뉴 탭 영역 */}
            <div></div>
            {/* 버튼 영역 */}
            <div className="flex items-center gap-2">
                <Button variant="secondary">
                    <Key />
                    Gemini AI Key 설정
                </Button>
                <Button className="bg-blue-900/50 text-white hover:bg-blue-900/70">로그인</Button>
            </div>
        </header>
    )
}
