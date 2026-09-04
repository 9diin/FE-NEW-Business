import type { CanvasNode as CanvasNodeType } from "@/types/canvas"
import { useCanvas } from "@/context/CanvasContext"
import { Badge, Button, Card, CardContent, CardFooter, CardHeader, Field, FieldLabel, Input, Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue, Separator, Sheet, SheetClose, SheetContent, SheetFooter, SheetHeader, SheetTitle, SheetTrigger, Textarea } from "@/components/ui"
import { Link, Settings2, Unlink, X } from "lucide-react"

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

const items = [
    { label: "아이디어 (Idea)", value: "idea" },
    { label: "문제인식 (Problem)", value: "problem" },
    { label: "해결방안 (Solution)", value: "solution" },
    { label: "성장전략 (Scale-up)", value: "scale-up" },
    { label: "팀 빌딩 (Team-Building)", value: "team-building" },
]

interface CanvasNodeProps {
    node: CanvasNodeType
    onDragStart: (e: React.MouseEvent, nodeId: string) => void
}

export default function CanvasNode({ node, onDragStart }: CanvasNodeProps) {
    const { removeNode, startConnection, completeConnection, connectingFromNodeId } = useCanvas()
    const style = NODE_STYLES[node.type] || NODE_STYLES.idea
    const isConnecting = connectingFromNodeId !== null
    const isSource = connectingFromNodeId === node.id

    // 해당 노드 정보가 수정될 경우, Sheet가 닫히면서 메인 캔버스 UI 정보도 refresh가 되어야 한다. 
    // useQuery를 활용해서 refetch를 해야한다. => ???? 혹시 AI가 가이드라인 해준 useQuery란? 무엇인가? 추후 논의


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
        <Sheet>
            <SheetTrigger render={<div
                className="absolute select-none"
                style={{
                    left: node.x,
                    top: node.y,
                    zIndex: isSource ? 20 : 10,
                }}
                onClick={handleCardClick}
            >
                <Card
                    className={`h-fit w-64 cursor-pointer gap-3 p-0 transition-shadow duration-200 ${isSource
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
                            className={`h-fit rounded-full px-2 py-1 text-xs ${isSource
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
            </div>} />
            <SheetContent>
                <SheetHeader>
                    <SheetTitle className="flex items-center gap-2 text-neutral-500">
                        <Settings2 className="w-4.5! h-4.5!" />
                        노드 내용 편집
                    </SheetTitle>
                </SheetHeader>
                <div className="grid gap-4">
                    <div className="grid flex-1 auto-rows-min gap-6 px-4">
                        <Field>
                            <FieldLabel htmlFor="input-field-username">카테고리</FieldLabel>
                            <Select items={items}>
                                <SelectTrigger className="w-full">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectLabel>카테고리</SelectLabel>
                                        {items.map((item) => (
                                            <SelectItem key={item.value} value={item.value}>
                                                {item.label}
                                            </SelectItem>
                                        ))}
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </Field>
                        <Field>
                            <FieldLabel htmlFor="input-field-username">아이디어 제목</FieldLabel>
                            <Input
                                id="input-field-username"
                                type="text"
                                placeholder="아이디어 제목을 입력하세요."
                            />
                        </Field>
                        <Field>
                            <FieldLabel htmlFor="input-field-username">세부 메모 및 키워드</FieldLabel>
                            <Textarea placeholder="예: 지원사업 PSST 양식 채우는데 주장 20시간 이상 소요되어 피로함" className="resize-none h-32" />
                        </Field>
                    </div>
                    <Separator />
                    <div className="px-4 grid gap-2">
                        <span className="font-semibold">연결된 노드 목록</span>
                        <div className="grid gap-2">
                            <div className="flex items-center justify-between bg-neutral-700/10 rounded-md p-1 pl-2.25">
                                <div className="flex items-center gap-2">
                                    <Badge variant="outline" className="rounded-sm text-yellow-500">IN</Badge>
                                    <span>바쁜 직장인의 점심 고민</span>
                                </div>
                                <Button variant="ghost" size="icon" className="hover:text-neutral-400!">
                                    <Unlink className="text-neutral-500" />
                                </Button>
                            </div>
                            <div className="flex items-center justify-between bg-neutral-700/10 rounded-md p-1 pl-2.25">
                                <div className="flex items-center gap-2">
                                    <Badge variant="outline" className="rounded-sm text-red-500">OUT</Badge>
                                    <span>바쁜 직장인의 점심 고민</span>
                                </div>
                                <Button variant="ghost" size="icon" className="hover:text-neutral-400!">
                                    <Unlink className="text-neutral-500" />
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
                <SheetFooter>
                    <Button type="submit">저장</Button>
                    <SheetClose render={<Button variant="outline">취소</Button>} />
                </SheetFooter>
            </SheetContent>
        </Sheet>

    )
}
