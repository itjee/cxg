/**
 * Auth feature exports
 */

// Components
export { LoginForm } from "./components/login-form";
export { SignupForm } from "./components/signup-form";
export { ForgotPasswordForm } from "./components/forgot-password-form";
export { ResetPasswordForm } from "./components/reset-password-form";

// Providers
export { AuthProvider } from "./providers/auth-provider";

// Stores
export { useAuthStore } from "./stores/auth.store";

// Hooks
export { useAuth } from "./hooks/use-auth";
export { useResetPassword } from "./hooks/use-reset-password";

// Services
export { authService } from "./services/auth.service";

// Types
export type {
  SigninRequest,
  SignupRequest,
  LoginRequest,  // Backward compatibility
  RegisterRequest,  // Backward compatibility
  TokenResponse,
  User,
  ApiError,
  EnvelopeResponse,
} from "./types/auth.types";

export type {
  ForgotPasswordRequest,
  ForgotPasswordResponse,
  ResetPasswordRequest,
  ResetPasswordResponse,
} from "./types/reset-password.types";
