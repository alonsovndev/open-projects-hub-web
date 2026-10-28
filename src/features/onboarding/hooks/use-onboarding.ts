import { useCallback } from "react";
import { message } from "antd";

import { getErrorMessage } from "@/shared/types/api";
import {
  useGetUserProfileQuery,
  useUpdateOnboardingMutation,
} from "@/features/settings/api/settings-rtk-api";
import { useRole } from "@/features/auth/hooks/use-role";

export const useOnboarding = () => {
  const { isAdmin } = useRole();
  // First-use guidance is for the workspace Admin; teammates are invited into a set-up workspace.
  const { data: profile } = useGetUserProfileQuery(undefined, { skip: !isAdmin });
  const [updateOnboarding, { isLoading }] = useUpdateOnboardingMutation();

  const shouldShow = isAdmin && profile?.onboardingCompleted === false;

  const complete = useCallback(async () => {
    try {
      await updateOnboarding({ completed: true }).unwrap();
    } catch (err) {
      message.error(getErrorMessage(err, "We couldn't save that. Please try again."));
    }
  }, [updateOnboarding]);

  const reset = useCallback(async () => {
    try {
      await updateOnboarding({ completed: false }).unwrap();
      message.success("Onboarding reset. You'll see the welcome again on your dashboard.");
    } catch (err) {
      message.error(getErrorMessage(err, "We couldn't reset onboarding. Please try again."));
    }
  }, [updateOnboarding]);

  return { shouldShow, saving: isLoading, complete, reset };
};
