import type { ThemeConfig } from "antd";
import { theme } from "antd";

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
    colorTextTertiary: "#666666",
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
    borderRadiusLG: 12,
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
    screenLG: 1024,
    screenLGMin: 1024,
    screenMDMax: 1023,

    // Shadow
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.06)",
    boxShadowSecondary: "0 4px 16px rgba(0, 0, 0, 0.08)",
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
      itemHeight: 44,
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
      borderRadiusLG: 12,
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
      borderRadiusLG: 12,
      withDescriptionPadding: "16px 24px",
    },
    Spin: {
      contentHeight: 400,
    },
    Tag: {
      borderRadius: 8,
    },
    Modal: {
      borderRadiusLG: 12,
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
  algorithm: theme.darkAlgorithm,
  token: {
    ...lightTokens.token,
    colorPrimary: "#69b1ff",
    colorPrimaryHover: "#91caff",
    colorPrimaryActive: "#4096ff",
    colorLink: "#69b1ff",
    colorInfo: "#69b1ff",
    colorBgLayout: "#141414",
    colorBgContainer: "#1f1f1f",
    colorBgElevated: "#262626",
    colorBgSpotlight: "#424242",
    colorBorder: "#424242",
    colorBorderSecondary: "#303030",
    colorText: "#f0f0f0",
    colorTextSecondary: "#bfbfbf",
    colorTextTertiary: "#a6a6a6",
    colorTextQuaternary: "#737373",
    colorTextLightSolid: "#141414",
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.3)",
    boxShadowSecondary: "0 4px 16px rgba(0, 0, 0, 0.4)",
  },
  components: {
    ...lightTokens.components,
    Menu: {
      ...lightTokens.components?.Menu,
      itemColor: "#bfbfbf",
      itemHoverBg: "rgba(105, 177, 255, 0.08)",
      itemHoverColor: "#69b1ff",
      itemSelectedBg: "rgba(105, 177, 255, 0.15)",
      itemSelectedColor: "#69b1ff",
    },
    Table: {
      ...lightTokens.components?.Table,
      headerBg: "#262626",
      headerColor: "#bfbfbf",
      rowHoverBg: "rgba(105, 177, 255, 0.06)",
    },
    Tabs: {
      ...lightTokens.components?.Tabs,
      inkBarColor: "#69b1ff",
      itemSelectedColor: "#69b1ff",
      itemHoverColor: "#91caff",
    },
    Tooltip: {
      colorTextLightSolid: "#f0f0f0",
    },
  },
};
