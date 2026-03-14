import { useMemo, useState } from "react";

import { useNavigate } from "react-router-dom";

import { normalizeProjectCode, projectCodePattern } from "@/features/client-viewer/model/project-code";
import type { ProjectCodeFormValues } from "@/features/client-viewer/types";

interface UseProjectCodeSearchOptions {
  onSearch: (projectCode: string) => boolean;
}

export const useProjectCodeSearch = ({ onSearch }: UseProjectCodeSearchOptions) => {
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState("");

  const projectCodeRules = useMemo(() => {
    return [
      {
        required: true,
        message: "Please enter the project access code.",
      },
      {
        pattern: projectCodePattern,
        message: "Use the format PRJ-123456.",
      },
    ];
  }, []);

  const handleSubmit = ({ projectCode }: ProjectCodeFormValues) => {
    const normalizedCode = normalizeProjectCode(projectCode);
    const wasFound = onSearch(normalizedCode);

    if (!wasFound) {
      setErrorMessage("We couldn't find a project with that access code.");
      return;
    }

    setErrorMessage("");
  };

  const handleValuesChange = () => {
    if (errorMessage) {
      setErrorMessage("");
    }
  };

  const handleBack = () => {
    navigate("/");
  };

  return {
    errorMessage,
    projectCodeRules,
    handleSubmit,
    handleValuesChange,
    handleBack,
  };
};
