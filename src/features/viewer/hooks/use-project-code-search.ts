import { useMemo } from "react";

import { useNavigate } from "react-router-dom";

import { accessCodePattern, normalizeAccessCode } from "@/features/viewer/model/access-code";
import type { ProjectCodeFormValues } from "@/features/viewer/types";

interface UseProjectCodeSearchOptions {
  onSearch: (accessCode: string) => void;
}

export const useProjectCodeSearch = ({ onSearch }: UseProjectCodeSearchOptions) => {
  const navigate = useNavigate();

  const projectCodeRules = useMemo(() => {
    return [
      {
        required: true,
        message: "Please enter the project access code.",
      },
      {
        // Validate the normalized value so lowercase and stray spaces are not rejected.
        validator: (_rule: unknown, value: string | undefined) =>
          !value || accessCodePattern.test(normalizeAccessCode(value))
            ? Promise.resolve()
            : Promise.reject(new Error("Use the format PRJ-XXXXXXXX.")),
      },
    ];
  }, []);

  const handleSubmit = ({ projectCode }: ProjectCodeFormValues) => {
    onSearch(normalizeAccessCode(projectCode));
  };

  const handleBack = () => {
    navigate("/");
  };

  return {
    projectCodeRules,
    handleSubmit,
    handleBack,
  };
};
