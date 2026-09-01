export type NodeType = "problem" | "solution" | "scaleup" | "team" | "idea"

export interface CanvasNode {
    id: string
    type: NodeType
    title: string
    description: string
    x: number
    y: number
}

export interface Connection {
    id: string
    fromNodeId: string
    toNodeId: string
}

export interface CanvasContextType {
    nodes: CanvasNode[]
    connections: Connection[]
    connectingFromNodeId: string | null
    addNode: (type: NodeType, title: string, description: string) => void
    removeNode: (id: string) => void
    updateNodePosition: (id: string, x: number, y: number) => void
    startConnection: (nodeId: string) => void
    completeConnection: (nodeId: string) => void
    cancelConnection: () => void
    removeConnection: (id: string) => void
}
