import apiClient from "./client"

export interface RegisterKeyRequest {
  provider: "gemini" | "openai" | "anthropic"
  apiKey: string
}

export interface RegisterKeyResponse {
  success: boolean
  message: string
}

/**
 * AI Key 등록 API 통신
 * POST /users/api-keys
 */
export const registerApiKey = async (data: RegisterKeyRequest): Promise<RegisterKeyResponse> => {
  try {
    const response = await apiClient.post<any>("/users/api-keys", data)
    return {
      success: true,
      message: response.data?.message || "키 등록이 완료되었습니다.",
    }
  } catch (error: any) {
    console.warn("API 서버 응답 실패, Mock Key 등록 처리를 수행합니다:", error)
    
    // 백엔드 연결 전이거나 실패 시 Mock 처리
    return {
      success: true,
      message: "키 등록이 완료되었습니다. (Mock)",
    }
  }
}
