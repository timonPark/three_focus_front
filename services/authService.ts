import api from './api'
import type {
  LoginRequest,
  SignUpRequest,
  GoogleLoginRequest,
  CompleteProfileRequest,
  RefreshRequest,
  AuthResponse,
  RefreshResponse,
  UserResponse,
} from '@/types/auth'

export const authService = {
  login: (data: LoginRequest) =>
    api.post<AuthResponse>('/api/auth/login', data).then((r) => r.data),

  signUp: (data: SignUpRequest) =>
    api.post<void>('/api/auth/sign-up', data).then((r) => r.data),

  refresh: (data: RefreshRequest) =>
    api.post<RefreshResponse>('/api/auth/refresh', data).then((r) => r.data),

  googleLogin: (data: GoogleLoginRequest) =>
    api.post<AuthResponse>('/api/auth/google', data).then((r) => r.data),

  completeProfile: (data: CompleteProfileRequest) =>
    api.post<AuthResponse>('/api/auth/complete-profile', data).then((r) => r.data),

  getMe: () =>
    api.get<UserResponse>('/api/users/me').then((r) => r.data),
}
