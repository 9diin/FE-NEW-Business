import { useState, useEffect } from "react"
import { Badge, Button } from "../ui"
import { Key, Workflow, User as UserIcon, LogOut, CheckCircle2 } from "lucide-react"
import { AuthModal } from "@/components/auth"
import { ApiKeyModal } from "@/components/common"
import { getAiKeyStatus } from "@/apis"
import type { User } from "@/types/auth"

export default function AppHeader() {
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)
    const [isApiKeyModalOpen, setIsApiKeyModalOpen] = useState(false)
    const [isKeyRegistered, setIsKeyRegistered] = useState(false)
    const [currentUser, setCurrentUser] = useState<User | null>(null)

    // 앱 시작 시 localStorage에서 사용자 정보 복원
    useEffect(() => {
        const storedUser = localStorage.getItem("currentUser")
        if (storedUser) {
            try {
                setCurrentUser(JSON.parse(storedUser))
            } catch (e) {
                console.error("Failed to parse stored user", e)
            }
        }
    }, [])

    // 로그인된 유저가 있을 때 AI Key 등록 여부를 서버에서 조회
    // Mock 유저(백엔드 미연결 상태)는 건너뜀
    useEffect(() => {
        if (!currentUser) {
            setIsKeyRegistered(false)
            return
        }
        const token = localStorage.getItem("accessToken") || ""
        if (token.startsWith("mock_")) {
            // Mock 로그인 상태: 실제 서버 호출 생략
            setIsKeyRegistered(false)
            return
        }
        getAiKeyStatus(currentUser.id)
            .then((res) => setIsKeyRegistered(res.has_ai_key))
            .catch(() => setIsKeyRegistered(false))
    }, [currentUser])

    const handleAuthSuccess = (user: User) => {
        setCurrentUser(user)
    }

    const handleLogout = () => {
        localStorage.removeItem("accessToken")
        localStorage.removeItem("currentUser")
        setCurrentUser(null)
        setIsKeyRegistered(false)
    }

    return (
        <header className="flex w-full items-center justify-between border-b p-4">
            {/* 로고 영역 */}
            <div className="flex items-center gap-2">
                <Button size="icon" className="bg-blue-900/50 text-white hover:bg-blue-900/50">
                    <Workflow />
                </Button>
                <div className="flex flex-col gap-0">
                    <div className="flex items-center gap-2">
                        <span className="text-base font-bold">NODE-BIZ</span>
                        <Badge className="rounded-sm border border-blue-900/30 bg-blue-900/50 text-[10px] text-white">AI PSST</Badge>
                    </div>
                    <span className="text-xs text-neutral-500">노드 연결 기반 사업계획서 자동 도출 플랫폼</span>
                </div>
            </div>
            {/* 메뉴 탭 영역 */}
            <div></div>
            {/* 버튼 영역 */}
            <div className="flex items-center gap-2">
                {/* 로그인 상태일 때만 Key 버튼 노출 */}
                {currentUser && (
                    <Button
                        variant={isKeyRegistered ? "default" : "secondary"}
                        className={isKeyRegistered
                            ? "relative overflow-hidden bg-gradient-to-r from-blue-950 to-indigo-950 border border-indigo-500/30 text-indigo-200 shadow-[0_0_15px_rgba(79,70,229,0.2)] hover:shadow-[0_0_20px_rgba(79,70,229,0.4)] hover:border-indigo-400/50 transition-all duration-300"
                            : ""}
                        onClick={() => setIsApiKeyModalOpen(true)}
                    >
                        {isKeyRegistered
                            ? <CheckCircle2 className="size-4 text-indigo-400 drop-shadow-[0_0_5px_rgba(129,140,248,0.8)]" />
                            : <Key className="size-4" />
                        }
                        {isKeyRegistered ? "Gemini Key 연동됨" : "Gemini AI Key 설정"}
                    </Button>
                )}

                {currentUser ? (
                    <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1.5 rounded-md border bg-muted/50 px-3 py-1.5 text-xs font-medium">
                            <UserIcon className="size-3.5 text-blue-600" />
                            <span>{currentUser.nickname}</span>
                            <span className="text-[10px] text-muted-foreground">({currentUser.email})</span>
                        </div>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={handleLogout}
                            className="gap-1 text-xs"
                        >
                            <LogOut className="size-3.5" />
                            로그아웃
                        </Button>
                    </div>
                ) : (
                    <Button
                        onClick={() => setIsAuthModalOpen(true)}
                        className="bg-blue-900/50 text-white hover:bg-blue-900/70"
                    >
                        로그인
                    </Button>
                )}
            </div>

            {/* 로그인 / 회원가입 Dialog 모달 */}
            <AuthModal
                open={isAuthModalOpen}
                onOpenChange={setIsAuthModalOpen}
                onAuthSuccess={handleAuthSuccess}
            />

            {/* API Key CRUD Dialog 모달 */}
            <ApiKeyModal
                open={isApiKeyModalOpen}
                onOpenChange={setIsApiKeyModalOpen}
                userId={currentUser?.id ?? null}
                hasKey={isKeyRegistered}
                onKeyStatusChange={setIsKeyRegistered}
            />
        </header>
    )
}
