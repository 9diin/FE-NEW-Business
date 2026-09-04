export interface User {
  id: string
  email: string
  nickname: string
  createdAt?: string
}

export interface LoginRequest {
  email: string
  password: string
}

export interface SignUpRequest {
  email: string
  password: string
  nickname: string
  privacyPolicyAccepted: boolean
  termsOfServiceAccepted: boolean
  marketingOptIn: boolean
}

export interface AuthResponse {
  success: boolean
  message: string
  user?: User
  accessToken?: string
}

export interface FormErrors {
  email?: string
  password?: string
  nickname?: string
  privacyPolicyAccepted?: string
  termsOfServiceAccepted?: string
  general?: string
}
