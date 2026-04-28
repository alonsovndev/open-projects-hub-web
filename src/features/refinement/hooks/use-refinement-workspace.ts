import { useState } from "react";
import { message } from "antd";

import type { StoryDraft, AISuggestion } from "@/features/refinement/types";
import { refineStory, saveStoryDraft } from "@/features/refinement/api/refinement-api";

export const useRefinementWorkspace = () => {
  const [story, setStory] = useState<StoryDraft>({
    id: `story-${Date.now()}`,
    title: "",
    description: "",
    acceptanceCriteria: [""],
    status: "draft",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });

  const [suggestions, setSuggestions] = useState<AISuggestion[]>([]);
  const [refining, setRefining] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleStoryChange = (updatedStory: StoryDraft) => {
    setStory(updatedStory);
  };

  const handleRefine = async () => {
    if (!story.title && !story.description) {
      message.warning("Please add a title or description before refining");
      return;
    }

    setRefining(true);
    try {
      const newSuggestions = await refineStory(story.id, `${story.title} ${story.description}`);
      setSuggestions(newSuggestions);
      setStory({ ...story, status: "refining" });
      message.success("AI suggestions generated successfully!");
    } catch (error) {
      console.error("Failed to refine story:", error);
      message.error("Failed to generate suggestions. Please try again.");
    } finally {
      setRefining(false);
    }
  };

  const handleApplySuggestion = (suggestion: AISuggestion) => {
    let updatedStory = { ...story };

    switch (suggestion.type) {
      case "title":
        updatedStory.title = suggestion.content;
        break;
      case "description":
        updatedStory.description = suggestion.content;
        break;
      case "criteria":
        // Split by newline for multiple criteria
        const criteria = suggestion.content.split("\n").filter((c) => c.trim());
        updatedStory.acceptanceCriteria = criteria;
        break;
      case "complete":
        // Parse complete story (would need more sophisticated parsing in real app)
        message.info("Complete story suggestion - manual review recommended");
        break;
    }

    setStory({ ...updatedStory, status: "refined" });
    message.success("Suggestion applied successfully!");
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const savedStory = await saveStoryDraft(story);
      setStory(savedStory);
      message.success("Story saved successfully!");
    } catch (error) {
      console.error("Failed to save story:", error);
      message.error("Failed to save story. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return {
    story,
    suggestions,
    refining,
    saving,
    handleStoryChange,
    handleRefine,
    handleApplySuggestion,
    handleSave,
  };
};
