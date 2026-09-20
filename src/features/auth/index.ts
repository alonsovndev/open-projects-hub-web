// Public API for auth feature
export { authRoutes } from "./routes";

export {
  adminAuthApi,
  useLoginMutation,
  useRegisterMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
  useResendResetCodeMutation,
  useLogoutMutation,
} from "./api/admin-auth-api";

export {
  adminAuthReducer,
  setAdminSession,
  clearAdminSessionState,
  sessionBootstrapFinished,
} from "./state/admin-auth-slice";

export { AdminLoginForm } from "./components/admin-login-form";
export { RegisterForm } from "./components/register-form";
export { ForgotPasswordForm } from "./components/forgot-password-form";
export { ResetPasswordForm } from "./components/reset-password-form";
export { SessionExpiryWarning } from "./components/session-expiry-warning";

export { useAuth } from "./hooks/use-auth";
export { useLogout } from "./hooks/use-logout";
export { useRole } from "./hooks/use-role";
export { useSessionBootstrap } from "./hooks/use-session-bootstrap";
export { useSessionExpiryWarning } from "./hooks/use-session-expiry-warning";

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
