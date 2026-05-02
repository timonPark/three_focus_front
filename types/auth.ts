export interface LoginRequest {
  email: string
  password: string
}

export interface SignUpRequest {
  name: string
  email: string
  password: string
  phone?: string
  birthDate?: string
  gender?: Gender
  termsService: boolean
  termsPrivacy: boolean
  termsMarketing?: boolean
}

export interface GoogleLoginRequest {
  idToken: string
}

export interface CompleteProfileRequest {
  phone?: string
  gender?: Gender
  birthDate?: string
  termsService: boolean
  termsPrivacy: boolean
  termsMarketing?: boolean
}

export interface RefreshRequest {
  refreshToken: string
}

export interface AuthResponse {
  accessToken: string
  refreshToken: string
  user: User
  isProfileComplete?: boolean
}

export interface RefreshResponse {
  accessToken: string
}

export type Gender = 'male' | 'female' | 'other'

export type User = {
  id: number
  name: string
  email: string
}
