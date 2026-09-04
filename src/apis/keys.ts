import apiClient from "./client"

// ==========================================
// Types
// ==========================================

export interface AiKeyRequest {
  ai_key: string
}

export interface AiKeyResponse {
  user_id: string
  has_ai_key: boolean
  message: string
}

// ==========================================
// Gemini AI Key CRUD API Functions
// ==========================================

/**
 * [POST] Gemini AI Key 등록
 * /users/{user_id}/ai-key
 * 이미 등록된 키가 있으면 409 에러
 */
export const registerAiKey = async (
  userId: string,
  aiKey: string
): Promise<AiKeyResponse> => {
  const response = await apiClient.post<AiKeyResponse>(
    `/users/${userId}/ai-key`,
    { ai_key: aiKey } satisfies AiKeyRequest
  )
  return response.data
}

/**
 * [GET] Gemini AI Key 등록 여부 조회
 * /users/{user_id}/ai-key
 * 보안상 실제 Key 값은 반환하지 않고 has_ai_key 여부만 반환
 */
export const getAiKeyStatus = async (userId: string): Promise<AiKeyResponse> => {
  const response = await apiClient.get<AiKeyResponse>(`/users/${userId}/ai-key`)
  return response.data
}

/**
 * [PUT] Gemini AI Key 수정
 * /users/{user_id}/ai-key
 * 등록된 키가 없으면 404 에러
 */
export const updateAiKey = async (
  userId: string,
  aiKey: string
): Promise<AiKeyResponse> => {
  const response = await apiClient.put<AiKeyResponse>(
    `/users/${userId}/ai-key`,
    { ai_key: aiKey } satisfies AiKeyRequest
  )
  return response.data
}

/**
 * [DELETE] Gemini AI Key 삭제
 * /users/{user_id}/ai-key
 * ai_key 컬럼을 NULL로 초기화
 */
export const deleteAiKey = async (userId: string): Promise<AiKeyResponse> => {
  const response = await apiClient.delete<AiKeyResponse>(`/users/${userId}/ai-key`)
  return response.data
}
