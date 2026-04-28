import type { FC } from "react";
import { Card, Button, Space, Typography, Progress, Empty, Spin } from "antd";
import { ThunderboltOutlined, CheckOutlined, CopyOutlined, BulbOutlined } from "@ant-design/icons";

import type { AISuggestion } from "@/features/refinement/types";

import styles from "./suggestion-panel.module.scss";

const { Title, Text, Paragraph } = Typography;

interface SuggestionPanelProps {
  suggestions: AISuggestion[];
  onApply: (suggestion: AISuggestion) => void;
  onRefine: () => void;
  loading?: boolean;
}

export const SuggestionPanelComponent: FC<SuggestionPanelProps> = ({
  suggestions,
  onApply,
  onRefine,
  loading = false,
}) => {
  const getSuggestionTypeLabel = (type: AISuggestion["type"]) => {
    const labels = {
      title: "Title Suggestion",
      description: "Description Suggestion",
      criteria: "Acceptance Criteria",
      complete: "Complete Story",
    };
    return labels[type];
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.9) return "success";
    if (confidence >= 0.7) return "normal";
    return "exception";
  };

  return (
    <Card className={styles.panelCard}>
      <div className={styles.cardHeader}>
        <div>
          <Title level={3} className={styles.cardTitle}>
            <ThunderboltOutlined className={styles.aiIcon} />
            AI Suggestions
          </Title>
          <Text className={styles.cardSubtitle}>Review and apply AI-powered refinements</Text>
        </div>
        <Button
          type="primary"
          icon={<ThunderboltOutlined />}
          onClick={onRefine}
          loading={loading}
          className={styles.refineButton}
        >
          Refine Story
        </Button>
      </div>

      {loading ? (
        <div className={styles.loadingContainer}>
          <Spin size="large" />
          <Text className={styles.loadingText}>AI is analyzing your story...</Text>
        </div>
      ) : suggestions.length === 0 ? (
        <Empty
          image={<BulbOutlined className={styles.emptyIcon} />}
          description={
            <Space direction="vertical" size="small">
              <Text className={styles.emptyTitle}>No suggestions yet</Text>
              <Text className={styles.emptyText}>
                Click "Refine Story" to get AI-powered suggestions
              </Text>
            </Space>
          }
          className={styles.empty}
        />
      ) : (
        <Space direction="vertical" size="large" style={{ width: "100%" }}>
          {suggestions.map((suggestion) => (
            <div key={suggestion.id} className={styles.suggestionCard}>
              <div className={styles.suggestionHeader}>
                <Text className={styles.suggestionType}>
                  {getSuggestionTypeLabel(suggestion.type)}
                </Text>
                <div className={styles.confidenceBadge}>
                  <Text className={styles.confidenceLabel}>Confidence</Text>
                  <Progress
                    type="circle"
                    percent={Math.round(suggestion.confidence * 100)}
                    width={40}
                    strokeColor={{
                      "0%": "#0057c2",
                      "100%": "#006ef2",
                    }}
                    format={(percent) => `${percent}%`}
                    status={getConfidenceColor(suggestion.confidence)}
                  />
                </div>
              </div>

              <Paragraph className={styles.suggestionContent}>{suggestion.content}</Paragraph>

              {suggestion.reasoning && (
                <div className={styles.reasoning}>
                  <Text className={styles.reasoningLabel}>
                    <BulbOutlined /> Why this works:
                  </Text>
                  <Text className={styles.reasoningText}>{suggestion.reasoning}</Text>
                </div>
              )}

              <div className={styles.suggestionActions}>
                <Button
                  type="primary"
                  icon={<CheckOutlined />}
                  onClick={() => onApply(suggestion)}
                  className={styles.applyButton}
                >
                  Apply Suggestion
                </Button>
                <Button
                  icon={<CopyOutlined />}
                  onClick={() => navigator.clipboard.writeText(suggestion.content)}
                >
                  Copy
                </Button>
              </div>
            </div>
          ))}
        </Space>
      )}
    </Card>
  );
};
