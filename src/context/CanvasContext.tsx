import { createContext, useContext, useState, useCallback } from "react"
import type { CanvasNode, CanvasContextType, NodeType, Connection } from "@/types/canvas"

const CanvasContext = createContext<CanvasContextType | null>(null)

let nodeIdCounter = 0

export function CanvasProvider({ children }: { children: React.ReactNode }) {
    const [nodes, setNodes] = useState<CanvasNode[]>([])
    const [connections, setConnections] = useState<Connection[]>([])
    const [connectingFromNodeId, setConnectingFromNodeId] = useState<string | null>(null)

    const addNode = useCallback(
        (type: NodeType, title: string, description: string) => {
            const id = `node-${++nodeIdCounter}`

            // 좌측 고정 패널(IdeaCard + NodeAdder, x: ~284px)을 침범하지 않도록 안전한 기본 위치 산출
            const existingCount = nodes.length
            const col = existingCount % 2
            const row = Math.floor(existingCount / 2) % 4

            const baseOffsetX = 320 + col * 280
            const baseOffsetY = 40 + row * 170

            const newNode: CanvasNode = {
                id,
                type,
                title,
                description,
                x: baseOffsetX,
                y: baseOffsetY,
            }

            setNodes((prev) => [...prev, newNode])
        },
        [nodes.length]
    )

    const removeNode = useCallback(
        (id: string) => {
            setNodes((prev) => prev.filter((n) => n.id !== id))
            // 관련 연결선도 자동 제거
            setConnections((prev) => prev.filter((c) => c.fromNodeId !== id && c.toNodeId !== id))
            // 연결 모드 진행 중이었다면 취소
            if (connectingFromNodeId === id) {
                setConnectingFromNodeId(null)
            }
        },
        [connectingFromNodeId]
    )

    const updateNodePosition = useCallback((id: string, x: number, y: number) => {
        setNodes((prev) => prev.map((n) => (n.id === id ? { ...n, x, y } : n)))
    }, [])

    const startConnection = useCallback(
        (nodeId: string) => {
            if (connectingFromNodeId === nodeId) {
                // 같은 노드 다시 클릭하면 연결 취소
                setConnectingFromNodeId(null)
            } else {
                setConnectingFromNodeId(nodeId)
            }
        },
        [connectingFromNodeId]
    )

    const completeConnection = useCallback(
        (nodeId: string) => {
            if (!connectingFromNodeId || connectingFromNodeId === nodeId) return

            // 이미 동일한 연결이 있는지 확인
            const alreadyConnected = connections.some(
                (c) =>
                    (c.fromNodeId === connectingFromNodeId && c.toNodeId === nodeId) ||
                    (c.fromNodeId === nodeId && c.toNodeId === connectingFromNodeId)
            )

            if (!alreadyConnected) {
                const newConnection: Connection = {
                    id: `conn-${Date.now()}`,
                    fromNodeId: connectingFromNodeId,
                    toNodeId: nodeId,
                }
                setConnections((prev) => [...prev, newConnection])
            }

            setConnectingFromNodeId(null)
        },
        [connectingFromNodeId, connections]
    )

    const cancelConnection = useCallback(() => {
        setConnectingFromNodeId(null)
    }, [])

    const removeConnection = useCallback((id: string) => {
        setConnections((prev) => prev.filter((c) => c.id !== id))
    }, [])

    return (
        <CanvasContext.Provider
            value={{
                nodes,
                connections,
                connectingFromNodeId,
                addNode,
                removeNode,
                updateNodePosition,
                startConnection,
                completeConnection,
                cancelConnection,
                removeConnection,
            }}
        >
            {children}
        </CanvasContext.Provider>
    )
}

export function useCanvas(): CanvasContextType {
    const context = useContext(CanvasContext)
    if (!context) {
        throw new Error("useCanvas must be used within a CanvasProvider")
    }
    return context
}
