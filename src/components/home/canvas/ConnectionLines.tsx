import { useCanvas } from "@/context/CanvasContext"
import type { NodeType } from "@/types/canvas"

/** 두 노드 타입 조합에 따른 사업 관련 Chip 라벨 */
const CONNECTION_LABELS: Record<string, string> = {
    "idea+idea": "브레인스토밍",
    "idea+problem": "문제 발견",
    "idea+solution": "솔루션 도출",
    "idea+scaleup": "성장 기회",
    "idea+team": "역량 매칭",
    "problem+problem": "연쇄 과제",
    "problem+solution": "문제 해결",
    "problem+scaleup": "리스크 분석",
    "problem+team": "과제 배분",
    "solution+solution": "시너지",
    "solution+scaleup": "사업 확장",
    "solution+team": "실행 계획",
    "scaleup+scaleup": "규모 확대",
    "scaleup+team": "조직 성장",
    "team+team": "협업 구조",
}

function getConnectionLabel(typeA: NodeType, typeB: NodeType): string {
    // 정렬하여 키 순서 무관하게 매칭
    const key = [typeA, typeB].sort().join("+")
    return CONNECTION_LABELS[key] || "연결"
}

interface ConnectionLinesProps {
    /** 연결 모드 진행 중일 때 마우스 위치 */
    mousePosition: { x: number; y: number } | null
}

export default function ConnectionLines({ mousePosition }: ConnectionLinesProps) {
    const { nodes, connections, connectingFromNodeId, removeConnection } = useCanvas()

    /** 노드 ID로 노드의 중심 좌표를 가져옴 */
    const getNodeCenter = (nodeId: string) => {
        const node = nodes.find((n) => n.id === nodeId)
        if (!node) return null
        // 노드 카드 크기: width=256, height≈160 (추정)
        return { x: node.x + 128, y: node.y + 80 }
    }

    /** 두 점 사이의 부드러운 곡선 경로 생성 */
    const getCurvePath = (x1: number, y1: number, x2: number, y2: number) => {
        const midX = (x1 + x2) / 2
        const midY = (y1 + y2) / 2
        const dx = x2 - x1
        // 곡선의 높이를 거리에 비례하게 설정
        const curveOffset = Math.min(Math.abs(dx) * 0.2, 60)
        const cpX = midX
        const cpY = midY - curveOffset

        // Quadratic Bezier 곡선 위의 실제 중간점 (t=0.5)
        // B(0.5) = 0.25·P0 + 0.5·CP + 0.25·P1
        const onCurveX = 0.25 * x1 + 0.5 * cpX + 0.25 * x2
        const onCurveY = 0.25 * y1 + 0.5 * cpY + 0.25 * y2

        return { path: `M ${x1} ${y1} Q ${cpX} ${cpY} ${x2} ${y2}`, midX: onCurveX, midY: onCurveY }
    }

    return (
        <>
            {/* SVG 연결선 레이어 */}
            <svg
                className="pointer-events-none absolute inset-0 h-full w-full"
                style={{ zIndex: 5 }}
            >
                <defs>
                    {/* Dashed 애니메이션을 위한 CSS */}
                    <style>{`
                        @keyframes dashFlow {
                            from { stroke-dashoffset: 24; }
                            to { stroke-dashoffset: 0; }
                        }
                        .connection-line {
                            stroke-dasharray: 8 4;
                            animation: dashFlow 0.8s linear infinite;
                        }
                        .connection-line-hover {
                            pointer-events: stroke;
                            cursor: pointer;
                        }
                    `}</style>
                    <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#6366f1" />
                        <stop offset="100%" stopColor="#a855f7" />
                    </linearGradient>
                    <linearGradient id="lineGradientHover" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#ef4444" />
                        <stop offset="100%" stopColor="#f97316" />
                    </linearGradient>
                </defs>

                {/* 기존 연결선들 */}
                {connections.map((conn) => {
                    const from = getNodeCenter(conn.fromNodeId)
                    const to = getNodeCenter(conn.toNodeId)
                    if (!from || !to) return null

                    const { path } = getCurvePath(from.x, from.y, to.x, to.y)

                    return (
                        <g key={conn.id}>
                            {/* 투명한 넓은 히트 영역 */}
                            <path
                                d={path}
                                fill="none"
                                stroke="transparent"
                                strokeWidth="20"
                                className="connection-line-hover pointer-events-auto"
                                onClick={() => removeConnection(conn.id)}
                            />
                            {/* 보이는 연결선 */}
                            <path
                                d={path}
                                fill="none"
                                stroke="url(#lineGradient)"
                                strokeWidth="2"
                                className="connection-line"
                            />
                            {/* hover 시 색상 변경을 위한 오버레이 */}
                            <path
                                d={path}
                                fill="none"
                                stroke="url(#lineGradientHover)"
                                strokeWidth="2.5"
                                className="connection-line pointer-events-none opacity-0 transition-opacity group-hover:opacity-100"
                                style={{ opacity: 0 }}
                            />
                        </g>
                    )
                })}

                {/* 연결 진행 중인 임시 선 */}
                {connectingFromNodeId && mousePosition && (() => {
                    const from = getNodeCenter(connectingFromNodeId)
                    if (!from) return null
                    const { path } = getCurvePath(from.x, from.y, mousePosition.x, mousePosition.y)
                    return (
                        <path
                            d={path}
                            fill="none"
                            stroke="#6366f1"
                            strokeWidth="2"
                            strokeDasharray="6 4"
                            opacity="0.6"
                        />
                    )
                })()}
            </svg>

            {/* HTML 연결선 중앙 Chip 레이어 */}
            {connections.map((conn) => {
                const fromNode = nodes.find((n) => n.id === conn.fromNodeId)
                const toNode = nodes.find((n) => n.id === conn.toNodeId)
                if (!fromNode || !toNode) return null

                const from = getNodeCenter(conn.fromNodeId)
                const to = getNodeCenter(conn.toNodeId)
                if (!from || !to) return null

                const { midX, midY } = getCurvePath(from.x, from.y, to.x, to.y)
                const chipLabel = getConnectionLabel(fromNode.type, toNode.type)

                return (
                    <div
                        key={`chip-${conn.id}`}
                        className="absolute z-[6] -translate-x-1/2 -translate-y-1/2 cursor-pointer"
                        style={{ left: midX, top: midY }}
                        onClick={() => removeConnection(conn.id)}
                    >
                        <span className="inline-flex items-center gap-1 rounded-full border border-indigo-200 bg-white px-2.5 py-0.5 text-[10px] font-medium text-indigo-600 shadow-sm transition-all hover:border-red-300 hover:bg-red-50 hover:text-red-500 dark:border-indigo-700 dark:bg-neutral-800 dark:text-indigo-400 dark:hover:border-red-600 dark:hover:bg-red-900/30 dark:hover:text-red-400">
                            <span className="h-1.5 w-1.5 rounded-full bg-current" />
                            {chipLabel}
                        </span>
                    </div>
                )
            })}
        </>
    )
}
