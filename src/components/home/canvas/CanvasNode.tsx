import type { CanvasNode as CanvasNodeType } from "@/types/canvas"
import { useCanvas } from "@/context/CanvasContext"
import { Badge, Button, Card, CardContent, CardFooter, CardHeader } from "@/components/ui"
import { Link, X } from "lucide-react"

/** 노드 타입별 색상 매핑 */
const NODE_STYLES: Record<
    string,
    { badgeBg: string; badgeText: string; headerBg: string; label: string }
> = {
    idea: {
        badgeBg: "bg-violet-500",
        badgeText: "text-white",
        headerBg: "bg-violet-600/10",
        label: "아이디어 (Idea)",
    },
    problem: {
        badgeBg: "bg-red-500",
        badgeText: "text-white",
        headerBg: "bg-red-600/10",
        label: "문제인식 (Problem)",
    },
    solution: {
        badgeBg: "bg-blue-500",
        badgeText: "text-white",
        headerBg: "bg-blue-600/10",
        label: "해결방안 (Solution)",
    },
    scaleup: {
        badgeBg: "bg-green-500",
        badgeText: "text-white",
        headerBg: "bg-green-600/10",
        label: "성장전략 (Scale-up)",
    },
    team: {
        badgeBg: "bg-amber-500",
        badgeText: "text-white",
        headerBg: "bg-amber-600/10",
        label: "팀 빌딩 (Team)",
    },
}

interface CanvasNodeProps {
    node: CanvasNodeType
    onDragStart: (e: React.MouseEvent, nodeId: string) => void
}

export default function CanvasNode({ node, onDragStart }: CanvasNodeProps) {
    const { removeNode, startConnection, completeConnection, connectingFromNodeId } = useCanvas()
    const style = NODE_STYLES[node.type] || NODE_STYLES.idea
    const isConnecting = connectingFromNodeId !== null
    const isSource = connectingFromNodeId === node.id

    const handleCardClick = () => {
        // 연결 모드 진행 중이고, 이 노드가 소스가 아니면 연결 완료
        if (isConnecting && !isSource) {
            completeConnection(node.id)
        }
    }

    const handleConnectClick = (e: React.MouseEvent) => {
        e.stopPropagation()
        startConnection(node.id)
    }

    const handleRemoveClick = (e: React.MouseEvent) => {
        e.stopPropagation()
        removeNode(node.id)
    }

    return (
        <div
            className="absolute select-none"
            style={{
                left: node.x,
                top: node.y,
                zIndex: isSource ? 20 : 10,
            }}
            onClick={handleCardClick}
        >
            <Card
                className={`h-fit w-64 cursor-pointer gap-3 p-0 transition-shadow duration-200 ${
                    isSource
                        ? "ring-2 ring-blue-500 shadow-lg shadow-blue-500/20"
                        : isConnecting
                          ? "hover:ring-2 hover:ring-blue-300 hover:shadow-md"
                          : "hover:shadow-md"
                }`}
            >
                <CardHeader
                    className={`flex items-center justify-between px-3 py-2 ${style.headerBg}`}
                    onMouseDown={(e) => {
                        // 연결 모드가 아닌 경우에만 드래그 가능
                        if (!isConnecting) {
                            onDragStart(e, node.id)
                        }
                    }}
                    style={{ cursor: isConnecting ? "pointer" : "move" }}
                >
                    <Badge className={`rounded-sm ${style.badgeBg} text-[10px] font-medium ${style.badgeText}`}>
                        {style.label}
                    </Badge>
                    <Button
                        variant="link"
                        className="h-fit rounded-sm p-0!"
                        onClick={handleRemoveClick}
                    >
                        <X className="h-3.5! w-3.5! text-neutral-500" />
                    </Button>
                </CardHeader>
                <CardContent className="grid gap-2 px-3 text-xs">
                    <span className="font-semibold">{node.title}</span>
                    <p className="text-justify text-neutral-500">{node.description}</p>
                </CardContent>
                <CardFooter className="flex items-center justify-center p-2">
                    <Button
                        className={`h-fit rounded-full px-2 py-1 text-xs ${
                            isSource
                                ? "bg-blue-500 text-white hover:bg-blue-600"
                                : ""
                        }`}
                        variant={isSource ? "default" : "outline"}
                        onClick={handleConnectClick}
                    >
                        <Link className="h-3! w-3!" />
                        노드 연결
                    </Button>
                </CardFooter>
            </Card>
        </div>
    )
}
