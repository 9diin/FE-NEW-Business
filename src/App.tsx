import { useState } from "react"
import { AppHeader } from "./components/common"
import { NodeAdderSidebar, WorkflowSidebar } from "./components/home"
import Canvas from "./components/home/canvas/Canvas"
import { ChevronsRight } from "lucide-react"
import { Button } from "./components/ui"
import { CanvasProvider } from "./context/CanvasContext"

export function App() {
    const [isNodeAdderOpen, setIsNodeAdderOpen] = useState(false)

    return (
        <CanvasProvider>
            <div className="flex h-screen flex-col">
                <AppHeader />
                <main className="flex h-[calc(100%-73px)] items-start gap-4 p-4">
                    {/* 야이디어 생성(도출) / AI 자동 구조화 / PSST 사업계획서 도출 영역 */}
                    <WorkflowSidebar />
                    <Button variant="outline" size="icon" onClick={() => setIsNodeAdderOpen(!isNodeAdderOpen)} className="transition-transform duration-300">
                        <ChevronsRight className={`text-neutral-500 transition-transform duration-300 ${isNodeAdderOpen ? "rotate-180" : ""}`} />
                    </Button>
                    {/* 노드 추가하기 */}
                    <NodeAdderSidebar isOpen={isNodeAdderOpen} />
                    {/* 캔버스 영역 */}
                    <Canvas />
                </main>
            </div>
        </CanvasProvider>
    )
}

export default App
