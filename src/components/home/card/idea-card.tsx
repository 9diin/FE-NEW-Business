import { Card, Separator } from "@/components/ui"

export default function IdeaCard() {
    return (
        <div className="relative">
            {/* 장식용 아이콘은 alt="" 처리하여 스크린 리더가 건너뛰도록 설정 */}
            <img src="/icons/pin.svg" alt="" aria-hidden="true" className="absolute -top-3 -left-1 z-10" />

            <Card className="w-64 gap-3 p-3">
                <span className="font-semibold text-neutral-400">AI 도출 사업 컨셉</span>
                <div className="flex flex-col gap-1">
                    <Separator />
                    <Separator />
                </div>
                <p className="text-justify text-xs">생각 정리 부담을 해소하는 시각적 마인드맵 기반 AI 사업계획서 자동 생성 SaaS</p>
                <div className="flex items-start gap-1 rounded-md bg-accent/50 p-3">
                    <p className="text-justify text-xs text-neutral-500">
                        현재 '팀 구성(Team)' 관련 정보가 다소 부족합니다. 개발 및 사업화 인력 역량을 추가하면 계획서 완성도가 더 높아집니다.
                    </p>
                </div>
            </Card>
        </div>
    )
}
