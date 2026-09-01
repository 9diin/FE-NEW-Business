const WORKFLOW_TYPES = [
    {
        title: "STEP 1. 아이디어 생성(도출)",
        description: "떠오르는 아이디어나 생각 조각들을 분류 상관없이 자유롭게 추가해보세요.",
        icon: "plus",
        label: "아이디어 생성",
    },
    {
        title: "STEP 2. AI 자동 구조화",
        description: "생성된 아이디어들을 AI가 분석하여 핵심 개념을 도출하고 논리적으로 구조화합니다.",
        icon: "brain",
        label: "AI 아이디어 구조화",
    },
    {
        title: "STEP 3. PSST 사업계획서 도출",
        description: "구조화된 내용을 PSST 항목(Problem, Solution, Scale-up, Team)으로 자동 매핑하여 사업계획서를 완성합니다.",
        icon: "wand-sparkles",
        label: "PSST 사업계획서 도출",
    },
] as const

export default WORKFLOW_TYPES
