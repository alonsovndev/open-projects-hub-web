/**
 * Type definitions for Google Stitch MCP Server
 */

export interface Component {
  id: string;
  name: string;
  description?: string;
  category?: string;
  tags?: string[];
  createdAt?: string;
  updatedAt?: string;
}

export interface ComponentProp {
  name: string;
  type: string;
  required: boolean;
  defaultValue?: any;
  description?: string;
}

export interface ComponentVariant {
  name: string;
  props: Record<string, any>;
  description?: string;
}

export interface ComponentSpec {
  id: string;
  name: string;
  description?: string;
  category?: string;
  props: ComponentProp[];
  variants?: ComponentVariant[];
  examples?: ComponentExample[];
  tags?: string[];
}

export interface ComponentExample {
  name: string;
  code: string;
  description?: string;
}

export interface ComponentStyles {
  css?: string;
  scss?: string;
  variables?: Record<string, string>;
  breakpoints?: Record<string, string>;
}

export interface DesignToken {
  name: string;
  value: string;
  type: "color" | "spacing" | "typography" | "border" | "shadow" | "other";
  category?: string;
  description?: string;
}

export interface DesignTokenCollection {
  colors?: DesignToken[];
  spacing?: DesignToken[];
  typography?: DesignToken[];
  borders?: DesignToken[];
  shadows?: DesignToken[];
  other?: DesignToken[];
}

export interface GeneratedComponent {
  component: {
    filename: string;
    code: string;
  };
  styles: {
    filename: string;
    code: string;
  };
  tests?: {
    filename: string;
    code: string;
  };
  index?: {
    filename: string;
    code: string;
  };
}

export interface StitchClientConfig {
  apiKey: string;
  projectId: string;
  baseURL?: string;
}
