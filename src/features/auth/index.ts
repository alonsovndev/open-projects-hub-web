// Public API for auth feature
export { authRoutes } from "./routes";

export {
  adminAuthApi,
  useLoginMutation,
  useRegisterMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
} from "./api/admin-auth-api";

export {
  adminAuthReducer,
  setAdminSession,
  clearAdminSessionState,
} from "./state/admin-auth-slice";

export { AdminLoginForm } from "./components/admin-login-form";
export { RegisterForm } from "./components/register-form";
export { ForgotPasswordForm } from "./components/forgot-password-form";
export { ResetPasswordForm } from "./components/reset-password-form";

export { useAuth } from "./hooks/use-auth";
export { useLogout } from "./hooks/use-logout";
export { useRole } from "./hooks/use-role";

export { sessionStorage } from "./model/session-storage";

export type {
  AdminLoginValues,
  AdminRegisterValues,
  ForgotPasswordValues,
  ResetPasswordValues,
  AdminSession,
  AdminAuthResponse,
  UserRole,
} from "./types";
