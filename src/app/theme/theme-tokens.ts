import type { ThemeConfig } from "antd";

const fontFamily =
  'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif';

export const lightTokens: ThemeConfig = {
  token: {
    // Primary palette
    colorPrimary: "#0057c2",
    colorPrimaryHover: "#006ef2",
    colorPrimaryActive: "#004da8",
    colorLink: "#0057c2",
    colorInfo: "#0057c2",
    colorSuccess: "#52c41a",
    colorWarning: "#faad14",
    colorError: "#ff4d4f",

    // Surfaces
    colorBgLayout: "#f9f9f9",
    colorBgContainer: "#ffffff",
    colorBgElevated: "#ffffff",
    colorBgSpotlight: "#1a1a1a",

    // Borders
    colorBorder: "#eeeeee",
    colorBorderSecondary: "#eeeeee",

    // Text
    colorText: "#1a1a1a",
    colorTextSecondary: "#666666",
    colorTextTertiary: "#999999",
    colorTextQuaternary: "#cccccc",

    // Typography
    fontFamily,
    fontSize: 14,
    fontSizeHeading1: 32,
    fontSizeHeading2: 24,
    fontSizeHeading3: 18,
    fontSizeHeading4: 16,
    fontSizeHeading5: 14,

    // Radius
    borderRadius: 8,
    borderRadiusLG: 16,
    borderRadiusXS: 4,

    // Spacing (used internally by Ant Design)
    padding: 16,
    paddingSM: 12,
    paddingXS: 8,
    paddingXXS: 4,
    paddingLG: 24,
    margin: 16,
    marginSM: 12,
    marginXS: 8,
    marginXXS: 4,
    marginLG: 24,

    // Shadow
    boxShadow:
      "0 1px 2px 0 rgba(0, 0, 0, 0.03), 0 1px 6px -1px rgba(0, 0, 0, 0.02), 0 2px 4px 0 rgba(0, 0, 0, 0.02)",
    boxShadowSecondary:
      "0 6px 16px 0 rgba(0, 0, 0, 0.08), 0 3px 6px -4px rgba(0, 0, 0, 0.12), 0 9px 28px 8px rgba(0, 0, 0, 0.05)",
  },
  components: {
    Menu: {
      itemBg: "transparent",
      itemColor: "#666666",
      itemHoverBg: "rgba(0, 87, 194, 0.04)",
      itemHoverColor: "#0057c2",
      itemSelectedBg: "rgba(0, 87, 194, 0.1)",
      itemSelectedColor: "#0057c2",
      itemBorderRadius: 8,
      itemHeight: 40,
      itemMarginInline: 8,
      paddingXS: 16,
    },
    Button: {
      borderRadius: 8,
      primaryShadow: "none",
      fontFamily,
      contentFontSize: 16,
      paddingContentHorizontal: 16,
      paddingContentVertical: 8,
    },
    Card: {
      borderRadiusLG: 24,
      paddingLG: 24,
    },
    Input: {
      borderRadius: 8,
      paddingBlock: 8,
      paddingInline: 12,
    },
    Select: {
      borderRadius: 8,
      optionPadding: "8px 12px",
    },
    Table: {
      headerBg: "#f9f9f9",
      headerColor: "#666666",
      headerBorderRadius: 8,
      rowHoverBg: "rgba(0, 87, 194, 0.02)",
      borderRadius: 8,
    },
    Tabs: {
      inkBarColor: "#0057c2",
      itemSelectedColor: "#0057c2",
      itemHoverColor: "#0057c2",
    },
    Form: {
      labelFontSize: 14,
      labelRequiredMarkColor: "#ff4d4f",
    },
    Alert: {
      borderRadiusLG: 16,
      withDescriptionPadding: "16px 24px",
    },
    Spin: {
      contentHeight: 400,
    },
    Tag: {
      borderRadius: 8,
    },
    Modal: {
      borderRadiusLG: 24,
      paddingContentHorizontal: 24,
      paddingMD: 24,
    },
    Dropdown: {
      borderRadius: 8,
    },
    Popover: {
      borderRadius: 8,
    },
  },
};

export const darkTokens: ThemeConfig = {
  token: {
    ...lightTokens.token,
    // Inverted surfaces
    colorBgLayout: "#141414",
    colorBgContainer: "#1e1e1e",
    colorBgElevated: "#2d2d2d",
    colorBgSpotlight: "#e8e8e8",

    // Inverted borders
    colorBorder: "#2d2d2d",
    colorBorderSecondary: "#2d2d2d",

    // Inverted text
    colorText: "#e8e8e8",
    colorTextSecondary: "#a0a0a0",
    colorTextTertiary: "#7a7a7a",
    colorTextQuaternary: "#555555",

    // Preserved primary (slightly lighter for dark bg contrast)
    colorPrimary: "#4a8fd9",
    colorPrimaryHover: "#6ba8e8",
    colorPrimaryActive: "#3a7ac4",
    colorLink: "#4a8fd9",
    colorInfo: "#4a8fd9",

    // Softened shadow for dark
    boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.2)",
    boxShadowSecondary: "0 6px 16px 0 rgba(0, 0, 0, 0.3)",
  },
  components: {
    ...lightTokens.components,
    Menu: {
      ...lightTokens.components?.Menu,
      itemBg: "transparent",
      itemColor: "#a0a0a0",
      itemHoverBg: "rgba(74, 143, 217, 0.1)",
      itemHoverColor: "#4a8fd9",
      itemSelectedBg: "rgba(74, 143, 217, 0.15)",
      itemSelectedColor: "#4a8fd9",
    },
    Button: {
      ...lightTokens.components?.Button,
    },
    Table: {
      ...lightTokens.components?.Table,
      headerBg: "#1e1e1e",
      headerColor: "#a0a0a0",
      rowHoverBg: "rgba(74, 143, 217, 0.05)",
    },
    Tabs: {
      ...lightTokens.components?.Tabs,
      inkBarColor: "#4a8fd9",
      itemSelectedColor: "#4a8fd9",
      itemHoverColor: "#4a8fd9",
    },
  },
};
