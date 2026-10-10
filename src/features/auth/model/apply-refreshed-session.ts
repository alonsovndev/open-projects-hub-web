import type { AppDispatch } from "@/app/store/store";
import {
  mapAdminSession,
  type AdminLoginApiResponse,
} from "@/features/auth/model/map-admin-session";
import { sessionRefreshed } from "@/features/auth/state/admin-auth-slice";

export const applyRefreshedSession = (
  dispatch: AppDispatch,
  response: AdminLoginApiResponse,
  generation: number
): void => {
  dispatch(sessionRefreshed({ session: mapAdminSession(response, ""), generation }));
};
