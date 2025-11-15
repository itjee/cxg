/**
 * Auth feature exports
 */

// Components
export { SigninForm } from "./components/signin-form";
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

// Apollo Hooks (Advanced usage)
export {
  useSignin,
  useSignup,
  useRefreshToken,
  useLogout,
  useChangePassword,
  useForgotPassword,
  useCurrentUser,
} from "./hooks/use-auth";

// Services
export { authService } from "./services/auth.service";

// Types
export type {
  SigninRequest,
  SignupRequest,
  TokenResponse,
  User,
} from "./types/auth.types";

export type {
  ForgotPasswordRequest,
  ForgotPasswordResponse,
  ResetPasswordRequest,
  ResetPasswordResponse,
} from "./types/reset-password.types";
