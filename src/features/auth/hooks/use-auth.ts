import { useAppSelector } from "@/app/store/hooks";

export const useAuth = () => {
  const session = useAppSelector((state) => state.auth.session);

  return {
    session,
    isAuthenticated: !!session,
    token: session?.token ?? null,
    user: session
      ? {
          email: session.email,
          displayName: session.displayName,
          role: session.role,
        }
      : null,
  };
};
