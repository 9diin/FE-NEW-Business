import { AppHeader } from "./components/common"
import { WorkflowSidebar } from "./components/home"
import Canvas from "./components/home/canvas/Canvas"
import { CanvasProvider } from "./context/CanvasContext"

export function App() {
    return (
        <CanvasProvider>
            <div className="flex h-screen flex-col">
                <AppHeader />
                <main className="flex h-[calc(100%-73px)] items-start gap-4 p-4">
                    {/* 아이디어 생성(도출) / AI 자동 구조화 / PSST 사업계획서 도출 영역 */}
                    <WorkflowSidebar />
                    {/* 캔버스 영역 (내부 좌측 상단에 IdeaCard 및 노드 추가 패널 포함) */}
                    <Canvas />
                </main>
            </div>
        </CanvasProvider>
    )
}

export default App
