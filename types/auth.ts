export interface LoginRequest {
  email: string
  password: string
}

export interface TermAgreementRequest {
  termType: 'SERVICE_TERMS' | 'PRIVACY_POLICY' | 'MARKETING'
  agreed: boolean
}

export interface SignUpRequest {
  name: string
  email: string
  password: string
  phone: string
  birthday: string
  gender: Gender
  termAgreements: TermAgreementRequest[]
}

export interface GoogleLoginRequest {
  idToken: string
}

export interface CompleteProfileRequest {
  phone: string
  birthday: string
  gender: Gender
  termAgreements: TermAgreementRequest[]
}

export interface RefreshRequest {
  refreshToken: string
}

export interface AuthResponse {
  accessToken: string
  refreshToken: string
  user?: User
  isProfileComplete?: boolean
}

export interface RefreshResponse {
  accessToken: string
}

export type Gender = 'MALE' | 'FEMALE'

export type User = {
  id: number
  name: string
  email: string
}

export interface UserResponse {
  id: number
  name: string
  email: string
}
