import { useState, useCallback, useRef, useEffect, useMemo } from "react"
import { useCanvas } from "@/context/CanvasContext"
import CanvasNode from "./CanvasNode"
import ConnectionLines from "./ConnectionLines"
import IdeaCard from "../card/idea-card"
import { MousePointerClick } from "lucide-react"

// IdeaCard 점유 영역 (top-4 left-4, w-64=256px + padding)
const IDEA_CARD_BOUNDS = {
    minX: 0,
    maxX: 284,
    minY: 0,
    maxY: 284,
}

export default function Canvas() {
    const { nodes, connections, connectingFromNodeId, cancelConnection } = useCanvas()
    const { updateNodePosition } = useCanvas()

    const canvasRef = useRef<HTMLDivElement>(null)
    const [dragging, setDragging] = useState<{
        nodeId: string
        offsetX: number
        offsetY: number
    } | null>(null)
    const [mousePosition, setMousePosition] = useState<{ x: number; y: number } | null>(null)

    // 노드 및 연결 기반 AI 도출 사업 컨셉 및 피드백 계산
    const { dynamicConcept, dynamicFeedback } = useMemo(() => {
        if (nodes.length === 0) {
            return {
                dynamicConcept: "생각 정리 부담을 해소하는 시각적 마인드맵 기반 AI 사업계획서 자동 생성 SaaS",
                dynamicFeedback: "노드를 추가하고 연결하면 AI가 자동으로 핵심 사업 컨셉을 분석하고 보완점을 제시합니다.",
            }
        }

        const nodeTypes = new Set(nodes.map((n) => n.type))
        const ideaNodes = nodes.filter((n) => n.type === "idea")

        // 컨셉 문구 생성
        let concept = "생각 정리 부담을 해소하는 시각적 마인드맵 기반 AI 사업계획서 자동 생성 SaaS"
        if (ideaNodes.length > 0) {
            const firstIdea = ideaNodes[0]
            concept = `${firstIdea.title} 중심으로 설계된 비즈니스 모델로, ${nodes.length}개의 요소가 유기적으로 연계되어 있습니다.`
        }

        // 부족한 PSST 항목 피드백 도출
        const missing: string[] = []
        if (!nodeTypes.has("team")) missing.push("'팀 구성(Team)'")
        if (!nodeTypes.has("scaleup")) missing.push("'성장전략(Scale-up)'")
        if (!nodeTypes.has("solution")) missing.push("'해결방안(Solution)'")
        if (!nodeTypes.has("problem")) missing.push("'문제인식(Problem)'")

        let feedback = "현재 모든 핵심 영역(PSST)이 균형 있게 구성되어 사업계획서 완성도가 높습니다."
        if (missing.length > 0) {
            feedback = `현재 ${missing.join(", ")} 관련 정보가 다소 부족합니다. 해당 노드를 추가하고 연결하면 완성도가 더 높아집니다.`
        } else if (connections.length < Math.max(1, nodes.length - 1)) {
            feedback = "노드 간의 연결이 더 추가되면 AI가 도출하는 사업 계획의 논리적 연결성이 더욱 강화됩니다."
        }

        return { dynamicConcept: concept, dynamicFeedback: feedback }
    }, [nodes, connections])

    /** 드래그 시작 */
    const handleDragStart = useCallback((e: React.MouseEvent, nodeId: string) => {
        e.preventDefault()
        e.stopPropagation()

        const node = nodes.find((n) => n.id === nodeId)
        if (!node) return

        const offsetX = e.clientX - node.x
        const offsetY = e.clientY - node.y

        setDragging({ nodeId, offsetX, offsetY })
    }, [nodes])

    /** 드래그 중 & 연결 모드 마우스 추적 (IdeaCard 영역 침범 방지) */
    const handleMouseMove = useCallback(
        (e: React.MouseEvent) => {
            if (dragging && canvasRef.current) {
                const rect = canvasRef.current.getBoundingClientRect()
                let targetX = e.clientX - dragging.offsetX
                let targetY = e.clientY - dragging.offsetY

                // 캔버스 외곽 바운더리 클램핑
                targetX = Math.max(0, Math.min(targetX, rect.width - 256))
                targetY = Math.max(0, Math.min(targetY, rect.height - 160))

                // IdeaCard 영역(좌상단) 침범 방지
                if (targetX < IDEA_CARD_BOUNDS.maxX && targetY < IDEA_CARD_BOUNDS.maxY) {
                    const diffX = IDEA_CARD_BOUNDS.maxX - targetX
                    const diffY = IDEA_CARD_BOUNDS.maxY - targetY

                    if (diffX < diffY) {
                        targetX = IDEA_CARD_BOUNDS.maxX
                    } else {
                        targetY = IDEA_CARD_BOUNDS.maxY
                    }
                }

                updateNodePosition(dragging.nodeId, targetX, targetY)
            }

            // 연결 모드일 때 마우스 위치 추적
            if (connectingFromNodeId && canvasRef.current) {
                const rect = canvasRef.current.getBoundingClientRect()
                setMousePosition({
                    x: e.clientX - rect.left,
                    y: e.clientY - rect.top,
                })
            }
        },
        [dragging, connectingFromNodeId, updateNodePosition]
    )

    /** 드래그 끝 */
    const handleMouseUp = useCallback(() => {
        setDragging(null)
    }, [])

    /** 캔버스 빈 영역 클릭 시 연결 모드 취소 */
    const handleCanvasClick = useCallback(
        (e: React.MouseEvent) => {
            // 이벤트가 캔버스 자체에서 발생한 경우만 취소
            if (e.target === canvasRef.current && connectingFromNodeId) {
                cancelConnection()
                setMousePosition(null)
            }
        },
        [connectingFromNodeId, cancelConnection]
    )

    /** 마우스가 캔버스를 벗어나면 드래그 종료 */
    useEffect(() => {
        const handleGlobalMouseUp = () => {
            if (dragging) setDragging(null)
        }
        window.addEventListener("mouseup", handleGlobalMouseUp)
        return () => window.removeEventListener("mouseup", handleGlobalMouseUp)
    }, [dragging])

    const isEmpty = nodes.length === 0

    return (
        <div
            ref={canvasRef}
            className={`relative h-full flex-1 overflow-hidden rounded-md border border-border/50 bg-card/50 ${
                connectingFromNodeId ? "cursor-crosshair" : ""
            }`}
            style={{
                backgroundImage: `radial-gradient(circle at 1.5px 1.5px, rgb(115 115 115 / 0.22) 1.5px, transparent 0)`,
                backgroundSize: "24px 24px",
            }}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onClick={handleCanvasClick}
        >
            {/* 좌측 상단 고정 IdeaCard (노드 침범 불가 영역) */}
            <div className="absolute top-4 left-4 z-20 pointer-events-auto">
                <IdeaCard concept={dynamicConcept} feedback={dynamicFeedback} />
            </div>

            {/* 연결 모드 표시 배너 */}
            {connectingFromNodeId && (
                <div className="absolute top-3 left-1/2 z-30 -translate-x-1/2">
                    <div className="flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-4 py-1.5 text-xs font-medium text-blue-700 shadow-sm dark:border-blue-800 dark:bg-blue-950/50 dark:text-blue-300">
                        <span className="relative flex h-2 w-2">
                            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-blue-400 opacity-75" />
                            <span className="relative inline-flex h-2 w-2 rounded-full bg-blue-500" />
                        </span>
                        연결할 노드를 클릭하세요
                        <button
                            className="ml-1 rounded-full p-0.5 hover:bg-blue-200 dark:hover:bg-blue-800"
                            onClick={(e) => {
                                e.stopPropagation()
                                cancelConnection()
                                setMousePosition(null)
                            }}
                        >
                            ✕
                        </button>
                    </div>
                </div>
            )}

            {/* 빈 캔버스 안내 문구 */}
            {isEmpty && (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 pointer-events-none">
                    <MousePointerClick className="text-neutral-500" />
                    <div className="flex flex-col items-center gap-1.5">
                        <h3 className="text-base font-semibold text-neutral-500">캔버스가 비어있습니다</h3>
                        <p className="max-w-xs text-center text-xs text-neutral-400">
                            아이디어를 추가하거나 좌측의 노드 추가 버튼을 클릭하여 새로운 아이디어를 캔버스에 배치하세요.
                        </p>
                    </div>
                </div>
            )}

            {/* 연결선 */}
            <ConnectionLines mousePosition={mousePosition} />

            {/* 노드들 */}
            {nodes.map((node) => (
                <CanvasNode key={node.id} node={node} onDragStart={handleDragStart} />
            ))}
        </div>
    )
}

