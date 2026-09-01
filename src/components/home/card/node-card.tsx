import { Badge, Button, Card, CardContent, CardFooter, CardHeader } from "@/components/ui"
import { Link, X } from "lucide-react"

export default function NodeCard() {
    return (
        <Card className="h-fit w-64 cursor-pointer gap-3 p-0">
            <CardHeader className="flex items-center justify-between bg-violet-600/10 px-3 py-2">
                <Badge className="rounded-sm bg-violet-500 text-[10px] font-medium text-white">아이디어 (Idea)</Badge>
                <Button variant="link" className="h-fit rounded-sm p-0!">
                    <X className="h-3.5! w-3.5! text-neutral-500" />
                </Button>
            </CardHeader>
            <CardContent className="grid gap-2 px-3 text-xs">
                <span className="font-semibold">창업 서류 작성 부담</span>
                <p className="text-justify text-neutral-500">지원사업 PSST 양식을 채우는데 주당 20시간 이상 소요되어 핵심 개발에 집중 불가</p>
            </CardContent>
            <CardFooter className="flex items-center justify-center p-2">
                <Button className="h-fit rounded-full px-2 py-1 text-xs" variant="outline">
                    <Link className="h-3! w-3!" />
                    노드 연결
                </Button>
            </CardFooter>
        </Card>
    )
}
