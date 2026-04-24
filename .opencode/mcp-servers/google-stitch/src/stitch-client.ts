import axios, { AxiosInstance } from "axios";
import {
  Component,
  ComponentSpec,
  ComponentStyles,
  DesignToken,
  DesignTokenCollection,
  StitchClientConfig,
} from "./types.js";

/**
 * Client for interacting with Google Stitch API
 *
 * NOTE: This is a template implementation. You'll need to adapt the API endpoints,
 * request/response formats, and authentication to match your actual Google Stitch API.
 */
export class StitchClient {
  private client: AxiosInstance;
  private projectId: string;

  constructor(config: StitchClientConfig) {
    this.projectId = config.projectId;

    // Initialize axios client with authentication
    this.client = axios.create({
      baseURL: config.baseURL || "https://api.stitch.google.com/v1",
      headers: {
        Authorization: `Bearer ${config.apiKey}`,
        "Content-Type": "application/json",
      },
      timeout: 10000,
    });

    // Add response interceptor for error handling
    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response) {
          throw new Error(
            `Stitch API error: ${error.response.status} - ${error.response.data?.message || error.message}`
          );
        }
        throw error;
      }
    );
  }

  /**
   * List all components in the project
   */
  async listComponents(options?: { category?: string; search?: string }): Promise<Component[]> {
    const params: Record<string, string> = {};

    if (options?.category) {
      params.category = options.category;
    }
    if (options?.search) {
      params.q = options.search;
    }

    const response = await this.client.get(`/projects/${this.projectId}/components`, { params });

    return response.data.components || [];
  }

  /**
   * Get detailed specifications for a specific component
   */
  async getComponent(componentId: string): Promise<ComponentSpec> {
    const response = await this.client.get(`/projects/${this.projectId}/components/${componentId}`);

    return response.data;
  }

  /**
   * Search for components by name or description
   */
  async searchComponents(query: string): Promise<Component[]> {
    const response = await this.client.get(`/projects/${this.projectId}/components/search`, {
      params: { q: query },
    });

    return response.data.components || [];
  }

  /**
   * Get CSS/SCSS styles for a component
   */
  async getComponentStyles(componentId: string): Promise<ComponentStyles> {
    const response = await this.client.get(
      `/projects/${this.projectId}/components/${componentId}/styles`
    );

    return response.data;
  }

  /**
   * Get design tokens (colors, spacing, typography, etc.)
   */
  async getDesignTokens(
    type?: "colors" | "spacing" | "typography" | "all"
  ): Promise<DesignTokenCollection> {
    const params: Record<string, string> = {};

    if (type && type !== "all") {
      params.type = type;
    }

    const response = await this.client.get(`/projects/${this.projectId}/design-tokens`, { params });

    const tokens = response.data.tokens || [];

    // Group tokens by type
    const collection: DesignTokenCollection = {
      colors: [],
      spacing: [],
      typography: [],
      borders: [],
      shadows: [],
      other: [],
    };

    tokens.forEach((token: DesignToken) => {
      switch (token.type) {
        case "color":
          collection.colors?.push(token);
          break;
        case "spacing":
          collection.spacing?.push(token);
          break;
        case "typography":
          collection.typography?.push(token);
          break;
        case "border":
          collection.borders?.push(token);
          break;
        case "shadow":
          collection.shadows?.push(token);
          break;
        default:
          collection.other?.push(token);
      }
    });

    return collection;
  }

  /**
   * Get component metadata by name (searches and returns first match)
   */
  async getComponentByName(name: string): Promise<ComponentSpec | null> {
    const results = await this.searchComponents(name);

    if (results.length === 0) {
      return null;
    }

    // Return the first exact match, or the first result
    const exactMatch = results.find((c) => c.name.toLowerCase() === name.toLowerCase());

    const componentId = exactMatch?.id || results[0].id;
    return this.getComponent(componentId);
  }
}
