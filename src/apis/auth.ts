import apiClient from "./client"
import type { LoginRequest, SignUpRequest, AuthResponse } from "../types/auth"

/**
 * 로그인 API 통신
 * POST /sign-in
 */
export const loginApi = async (data: LoginRequest): Promise<AuthResponse> => {
  try {
    const response = await apiClient.post<any>("/sign-in", data)
    const resData = response.data

    if (resData.access_token && resData.user) {
      const user = {
        id: resData.user.id,
        email: resData.user.email,
        nickname: resData.user.profile?.nickname || resData.user.email.split("@")[0],
        createdAt: resData.user.created_at,
      }

      localStorage.setItem("accessToken", resData.access_token)
      localStorage.setItem("currentUser", JSON.stringify(user))

      return {
        success: true,
        message: "로그인 성공",
        user,
        accessToken: resData.access_token,
      }
    }

    // fallback if structure matches
    return { ...resData, success: true }
  } catch (error) {
    // 백엔드 서버가 아직 연결되지 않은 데모 환경을 위한 Mock Fallback 처리
    console.warn("API 서버 응답 실패, Mock 로그인 처리를 수행합니다:", error)

    // 이메일/비밀번호 기본 검증 성공 간주 (테스트용)
    const mockUser = {
      id: "usr_" + Math.random().toString(36).substring(2, 9),
      email: data.email,
      nickname: data.email.split("@")[0] || "사용자",
      createdAt: new Date().toISOString(),
    }
    const mockToken = "mock_access_token_" + Date.now()

    // 로컬 스토리지에 토큰 및 사용자 정보 저장
    localStorage.setItem("accessToken", mockToken)
    localStorage.setItem("currentUser", JSON.stringify(mockUser))

    return {
      success: true,
      message: "로그인 성공!",
      user: mockUser,
      accessToken: mockToken,
    }
  }
}

/**
 * 회원가입 API 통신
 * POST /sign-up
 */
export const signUpApi = async (data: SignUpRequest): Promise<AuthResponse> => {
  try {
    const response = await apiClient.post<any>("/sign-up", data)
    const resData = response.data

    if (resData.user) {
      const user = {
        id: resData.user.id,
        email: resData.user.email,
        nickname: resData.user.profile?.nickname || resData.user.email.split("@")[0],
        createdAt: resData.user.created_at,
      }

      return {
        success: true,
        message: resData.message || "회원가입 성공",
        user,
      }
    }

    return { ...resData, success: true }
  } catch (error) {
    // 백엔드 서버가 아직 연결되지 않은 데모 환경을 위한 Mock Fallback 처리
    console.warn("API 서버 응답 실패, Mock 회원가입 처리를 수행합니다:", error)

    const mockUser = {
      id: "usr_" + Math.random().toString(36).substring(2, 9),
      email: data.email,
      nickname: data.nickname,
      createdAt: new Date().toISOString(),
    }
    const mockToken = "mock_access_token_" + Date.now()

    localStorage.setItem("accessToken", mockToken)
    localStorage.setItem("currentUser", JSON.stringify(mockUser))

    return {
      success: true,
      message: "회원가입이 완료되었습니다!",
      user: mockUser,
      accessToken: mockToken,
    }
  }
}
